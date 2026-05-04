const express = require('express')
const router = express.Router()
const multer = require('multer')
const supabase = require('../config/supabase')
const verifyToken = require('../middleware/auth')
require('dotenv').config()

const upload = multer({ storage: multer.memoryStorage() })

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *     responses:
 *       200:
 *         description: List of all products
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
  try {
    const { category } = req.query
    let query = supabase.schema('products').from('products').select('*')

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query.order('created_at', { ascending: false })
    if (error) throw error

    return res.status(200).json({ products: data })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a single product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .schema('products')
      .from('products')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (error || !data) {
      return res.status(404).json({ error: 'Product not found.' })
    }

    return res.status(200).json({ product: data })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product with optional image
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: Laptop
 *               description:
 *                 type: string
 *                 example: A powerful laptop
 *               price:
 *                 type: number
 *                 example: 999.99
 *               stock:
 *                 type: integer
 *                 example: 50
 *               category:
 *                 type: string
 *                 example: Electronics
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Product created
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', verifyToken, upload.single('image'), async (req, res) => {
  const { name, description, price, stock, category } = req.body

  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required.' })
  }

  try {
    let image_url = null

    if (req.file) {
      const fileName = `${Date.now()}_${req.file.originalname}`
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
        })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName)

      image_url = urlData.publicUrl
    }

    const { data, error } = await supabase
      .schema('products')
      .from('products')
      .insert([{ name, description, price, stock: stock || 0, category, image_url }])
      .select()
      .single()

    if (error) throw error

    return res.status(201).json({ message: 'Product created.', product: data })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.put('/:id', verifyToken, async (req, res) => {
  const { name, description, price, stock, category } = req.body

  try {
    const { data, error } = await supabase
      .schema('products')
      .from('products')
      .update({ name, description, price, stock, category, updated_at: new Date() })
      .eq('id', req.params.id)
      .select()
      .single()

    if (error || !data) {
      return res.status(404).json({ error: 'Product not found.' })
    }

    return res.status(200).json({ message: 'Product updated.', product: data })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
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
 *         description: Product deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { error } = await supabase
      .schema('products')
      .from('products')
      .delete()
      .eq('id', req.params.id)

    if (error) throw error

    return res.status(200).json({ message: 'Product deleted.' })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

/**
 * @swagger
 * /products/{id}/stock:
 *   patch:
 *     summary: Update product stock (used internally by orders service)
 *     tags: [Products]
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
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: -1
 *     responses:
 *       200:
 *         description: Stock updated
 *       400:
 *         description: Insufficient stock
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.patch('/:id/stock', async (req, res) => {
  const { quantity } = req.body

  try {
    const { data: product, error: fetchError } = await supabase
      .schema('products')
      .from('products')
      .select('stock')
      .eq('id', req.params.id)
      .single()

    if (fetchError || !product) {
      return res.status(404).json({ error: 'Product not found.' })
    }

    const newStock = product.stock + quantity

    if (newStock < 0) {
      return res.status(400).json({ error: 'Insufficient stock.' })
    }

    const { data, error } = await supabase
      .schema('products')
      .from('products')
      .update({ stock: newStock, updated_at: new Date() })
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) throw error

    return res.status(200).json({ message: 'Stock updated.', product: data })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

module.exports = router