/*  this is the previous working code for auth
but without the role based thing 
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const supabase = require('../config/supabase')
require('dotenv').config()

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: Registration successful
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: Email already registered
 *       500:
 *         description: Server error
 */
/*
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required.' })
  }

  try {
    const { data: existing } = await supabase
      .schema('app_auth')
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existing) {
      return res.status(409).json({ error: 'Email already registered.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const { data, error } = await supabase
      .schema('app_auth')
      .from('users')
      .insert([{ name, email, password: hashedPassword }])
      .select()
      .single()

    if (error) throw error

    const token = jwt.sign(
      { id: data.id, email: data.email, name: data.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.status(201).json({
      message: 'Registration successful.',
      token,
      user: { id: data.id, name: data.name, email: data.email }
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
/*
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' })
  }

  try {
    const { data: user, error } = await supabase
      .schema('app_auth')
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid email or password.' })
    }

    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password.' })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.status(200).json({
      message: 'Login successful.',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current logged in user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns current user data
 *       401:
 *         description: No token provided
 *       403:
 *         description: Invalid token
 *       404:
 *         description: User not found
 */
/*
router.get('/me', require('../middleware/auth'), async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .schema('app_auth')
      .from('users')
      .select('id, name, email, created_at')
      .eq('id', req.user.id)
      .single()

    if (error || !user) {
      return res.status(404).json({ error: 'User not found.' })
    }

    return res.status(200).json({ user })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

module.exports = router*/


const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const supabase = require('../config/supabase')
require('dotenv').config()

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: Registration successful
 *       409:
 *         description: Email already registered
 *       500:
 *         description: Server error
 */
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required.' })
  }

  try {
    const { data: existing } = await supabase
      .schema('app_auth')
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existing) {
      return res.status(409).json({ error: 'Email already registered.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const { data, error } = await supabase
      .schema('app_auth')
      .from('users')
      .insert([{ name, email, password: hashedPassword, role: 'customer' }])
      .select()
      .single()

    if (error) throw error

    const token = jwt.sign(
      { id: data.id, email: data.email, name: data.name, role: data.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.status(201).json({
      message: 'Registration successful.',
      token,
      user: { id: data.id, name: data.name, email: data.email, role: data.role }
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' })
  }

  try {
    const { data: user, error } = await supabase
      .schema('app_auth')
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid email or password.' })
    }

    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password.' })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.status(200).json({
      message: 'Login successful.',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current logged in user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns current user data
 *       401:
 *         description: No token provided
 *       404:
 *         description: User not found
 */
router.get('/me', require('../middleware/auth'), async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .schema('app_auth')
      .from('users')
      .select('id, name, email, role, created_at')
      .eq('id', req.user.id)
      .single()

    if (error || !user) {
      return res.status(404).json({ error: 'User not found.' })
    }

    return res.status(200).json({ user })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

module.exports = router