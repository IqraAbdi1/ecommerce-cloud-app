const express = require('express')
const router = express.Router()
const axios = require('axios')
const supabase = require('../config/supabase')
const verifyToken = require('../middleware/auth')
require('dotenv').config()

/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Record a payment for an order
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_id
 *               - user_id
 *               - amount
 *             properties:
 *               order_id:
 *                 type: string
 *                 example: uuid-of-order
 *               user_id:
 *                 type: string
 *                 example: uuid-of-user
 *               amount:
 *                 type: number
 *                 example: 401.98
 *               payment_method:
 *                 type: string
 *                 example: card
 *     responses:
 *       201:
 *         description: Payment recorded successfully
 *       400:
 *         description: Missing fields or invalid amount
 *       409:
 *         description: Payment already exists for this order
 *       500:
 *         description: Server error
 */
router.post('/', async (req, res) => {
  const { order_id, user_id, amount, payment_method } = req.body

  if (!order_id || !user_id || !amount) {
    return res.status(400).json({ error: 'order_id, user_id and amount are required.' })
  }

  if (amount <= 0) {
    return res.status(400).json({ error: 'Amount must be greater than zero.' })
  }

  try {
    const { data: existingPayment } = await supabase
      .schema('payments')
      .from('payments')
      .select('id')
      .eq('order_id', order_id)
      .single()

    if (existingPayment) {
      return res.status(409).json({ error: 'Payment already exists for this order.' })
    }

    const { data: payment, error } = await supabase
      .schema('payments')
      .from('payments')
      .insert([{
        order_id,
        user_id,
        amount,
        status: 'completed',
        payment_method: payment_method || 'card'
      }])
      .select()
      .single()

    if (error) throw error

    try {
      await axios.patch(
        `${process.env.ORDERS_SERVICE_URL}/orders/${order_id}/status`,
        { status: 'confirmed' }
      )
    } catch (updateError) {
      console.log('Could not update order status:', updateError.message)
    }

    return res.status(201).json({
      message: 'Payment recorded successfully.',
      payment
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

/**
 * @swagger
 * /payments/{orderId}:
 *   get:
 *     summary: Get payment by order ID
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Server error
 */
router.get('/:orderId', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .schema('payments')
      .from('payments')
      .select('*')
      .eq('order_id', req.params.orderId)
      .single()

    if (error || !data) {
      return res.status(404).json({ error: 'Payment not found.' })
    }

    return res.status(200).json({ payment: data })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

/**
 * @swagger
 * /payments/user/my-payments:
 *   get:
 *     summary: Get all payments for the logged in user
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user payments
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/user/my-payments', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .schema('payments')
      .from('payments')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return res.status(200).json({ payments: data })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

module.exports = router