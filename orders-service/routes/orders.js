const express = require('express')
const router = express.Router()
const axios = require('axios')
const supabase = require('../config/supabase')
const verifyToken = require('../middleware/auth')
require('dotenv').config()

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Place a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *               - quantity
 *             properties:
 *               product_id:
 *                 type: string
 *                 example: uuid-of-product
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       400:
 *         description: Insufficient stock or missing fields
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.post('/', verifyToken, async (req, res) => {
  const { product_id, quantity } = req.body

  if (!product_id || !quantity) {
    return res.status(400).json({ error: 'product_id and quantity are required.' })
  }

  try {
    const productResponse = await axios.get(
      `${process.env.PRODUCTS_SERVICE_URL}/products/${product_id}`
    )
    const product = productResponse.data.product

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' })
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: `Insufficient stock. Only ${product.stock} left.` })
    }

    const total_price = product.price * quantity

    const { data: order, error: orderError } = await supabase
      .schema('orders')
      .from('orders')
      .insert([{
        user_id: req.user.id,
        product_id,
        product_name: product.name,
        quantity,
        unit_price: product.price,
        total_price,
        status: 'pending'
      }])
      .select()
      .single()

    if (orderError) throw orderError

    await axios.patch(
      `${process.env.PRODUCTS_SERVICE_URL}/products/${product_id}/stock`,
      { quantity: -quantity }
    )

    try {
      const paymentResponse = await axios.post(
        `${process.env.PAYMENTS_SERVICE_URL}/payments`,
        {
          order_id: order.id,
          user_id: req.user.id,
          amount: total_price
        }
      )

      await supabase
        .schema('orders')
        .from('orders')
        .update({ status: 'confirmed', updated_at: new Date() })
        .eq('id', order.id)

      return res.status(201).json({
        message: 'Order placed successfully.',
        order: { ...order, status: 'confirmed' },
        payment: paymentResponse.data
      })
    } catch (paymentError) {
      await supabase
        .schema('orders')
        .from('orders')
        .update({ status: 'payment_failed', updated_at: new Date() })
        .eq('id', order.id)

      return res.status(201).json({
        message: 'Order placed but payment pending.',
        order: { ...order, status: 'payment_failed' }
      })
    }
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get a single order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .schema('orders')
      .from('orders')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (error || !data) {
      return res.status(404).json({ error: 'Order not found.' })
    }

    return res.status(200).json({ order: data })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

/**
 * @swagger
 * /orders/user/my-orders:
 *   get:
 *     summary: Get all orders for the logged in user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user orders
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/user/my-orders', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .schema('orders')
      .from('orders')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return res.status(200).json({ orders: data })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Update order status (used internally by payments service)
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 example: confirmed
 *     responses:
 *       200:
 *         description: Status updated
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body

  try {
    const { data, error } = await supabase
      .schema('orders')
      .from('orders')
      .update({ status, updated_at: new Date() })
      .eq('id', req.params.id)
      .select()
      .single()

    if (error || !data) {
      return res.status(404).json({ error: 'Order not found.' })
    }

    return res.status(200).json({ message: 'Order status updated.', order: data })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

/**
 * @swagger
 * /orders/analytics/sales:
 *   get:
 *     summary: Get sales analytics using MapReduce pattern
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sales analytics data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/analytics/sales', verifyToken, async (req, res) => {
  try {
    const { data: orders, error } = await supabase
      .schema('orders')
      .from('orders')
      .select('*')
      .eq('status', 'confirmed')

    if (error) throw error

    // MAP phase — transform each order into a processable unit
    const mapped = orders.map(order => ({
      product_id: order.product_id,
      product_name: order.product_name,
      quantity: order.quantity,
      revenue: parseFloat(order.total_price)
    }))

    // REDUCE phase — aggregate all mapped units into summary
    const reduced = mapped.reduce((acc, item) => {
      if (!acc[item.product_id]) {
        acc[item.product_id] = {
          product_id: item.product_id,
          product_name: item.product_name,
          total_quantity_sold: 0,
          total_revenue: 0
        }
      }
      acc[item.product_id].total_quantity_sold += item.quantity
      acc[item.product_id].total_revenue += item.revenue
      return acc
    }, {})

    const productSummary = Object.values(reduced).sort(
      (a, b) => b.total_revenue - a.total_revenue
    )

    const totalRevenue = mapped.reduce((sum, item) => sum + item.revenue, 0)
    const totalOrders = orders.length
    const totalItemsSold = mapped.reduce((sum, item) => sum + item.quantity, 0)

    return res.status(200).json({
      message: 'Sales analytics — MapReduce pattern',
      summary: {
        total_orders: totalOrders,
        total_items_sold: totalItemsSold,
        total_revenue: parseFloat(totalRevenue.toFixed(2))
      },
      top_products: productSummary
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

module.exports = router