const express = require('express')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./config/swagger')
require('dotenv').config()

const paymentRoutes = require('./routes/payments')

const app = express()
const PORT = process.env.PORT || 3004

app.use(cors())
app.use(express.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Payments service is running', port: PORT })
})

app.use('/payments', paymentRoutes)

app.listen(PORT, () => {
  console.log(`Payments service running on port ${PORT}`)
  console.log(`Swagger docs at http://localhost:${PORT}/api-docs`)
})