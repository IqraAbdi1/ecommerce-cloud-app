const swaggerJsdoc = require('swagger-jsdoc')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Payments Service API',
      version: '1.0.0',
      description: 'Payments service — record and verify payments',
    },
    servers: [
      {
        url: 'http://localhost:3004',
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