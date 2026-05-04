const swaggerJsdoc = require('swagger-jsdoc')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Products Service API',
      version: '1.0.0',
      description: 'Products service — CRUD operations and image uploads',
    },
    servers: [
      {
        url: 'http://localhost:3002',
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