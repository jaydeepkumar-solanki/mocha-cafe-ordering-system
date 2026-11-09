const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    tags: [
        {
            name: "Authentication",
            description: "Admin authentication APIs"
        },
        {
            name: "Products",
            description: "Product management APIs"
        },
        {
            name: "Categories",
            description: "Category management APIs"
        }
    ],
    openapi: "3.0.0",
    info: {
      title: "Cafe Menu & Order Management API",
      version: "1.0.0",
      description: "REST API documentation for the Cafe Ordering System",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your Admin JWT token",
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;
