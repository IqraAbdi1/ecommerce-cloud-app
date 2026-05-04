require('dotenv').config()
const express = require('express')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./config/swagger')


const orderRoutes = require('./routes/orders')

const app = express()
const PORT = process.env.PORT || 3003

app.use(cors())
app.use(express.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Orders service is running', port: PORT })
})

app.use('/orders', orderRoutes)

app.listen(PORT, () => {
  console.log(`Orders service running on port ${PORT}`)
  console.log(`Swagger docs at http://localhost:${PORT}/api-docs`)
})