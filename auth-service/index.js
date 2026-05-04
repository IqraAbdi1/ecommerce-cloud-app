const express = require('express')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./config/swagger')
require('dotenv').config()

const authRoutes = require('./routes/auth')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Auth service is running', port: PORT })
})

app.use('/auth', authRoutes)

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`)
  console.log(`Swagger docs at http://localhost:${PORT}/api-docs`)
})