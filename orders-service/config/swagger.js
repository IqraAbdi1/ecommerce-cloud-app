const swaggerJsdoc = require('swagger-jsdoc')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Orders Service API',
      version: '1.0.0',
      description: 'Orders service — place orders, track status, and sales analytics',
    },
    servers: [
      {
        url: 'http://localhost:3003',
        description: 'Local development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js'],
}

module.exports = swaggerJsdoc(options)