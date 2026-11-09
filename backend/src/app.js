const express = require("express");
const cors = require("cors");
require("dotenv").config();

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const productRoutes = require("../src/routes/ProductRoute");
const categoryRoutes = require("../src/routes/CategoryRoute");
const orderRoutes = require("../src/routes/OrderRoute");

const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");

const authRoutes = require("./routes/AuthRoute");

const uploadRoutes = require("./routes/UploadRoute");

const connectDB = require("./config/database");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Upload Routes
app.use("/api/upload", uploadRoutes);

const path = require("path");
// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Authentication Routes
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "L'Aura Boutique Cafe API is running!",
  });
});

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
  });
});

// Swagger API Documentation
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);

// Handle unknown routes (must be after all routes)
app.use(notFound);

// Centralized error handling (must be last)
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
