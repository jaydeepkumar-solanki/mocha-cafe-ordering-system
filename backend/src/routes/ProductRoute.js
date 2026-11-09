
const express = require("express");
const validateRequest = require("../middleware/validateRequest");
const {
    validateCreateProduct,
    validateUpdateProduct,
    validateProductId
} = require("../validators/productValidators");

const {
    authenticateAdmin,
    authorizeAdmin
} = require("../middleware/authMiddleware");

const router = express.Router();

const {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
} = require("../controllers/ProductController");

// Create Product
/**
 * @swagger
 * /api/products:
 *   post:
 *     security:
 *     - bearerAuth: []
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Cappuccino
 *               description:
 *                 type: string
 *                 example: Freshly brewed cappuccino
 *               price:
 *                 type: number
 *                 example: 150
 *               category:
 *                 type: string
 *                 example: "671234567890123456789012"
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid product data
 */
router.post(
    "/",
    authenticateAdmin,
    authorizeAdmin,
    validateCreateProduct,
    validateRequest,
    createProduct
);


// Get All Products
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/", getAllProducts);


// Get Single Product
/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *       404:
 *         description: Product not found
 */
router.get(
    "/:id",
    validateProductId,
    validateRequest,
    getSingleProduct
);


// Update Product
/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     security:
 *     - bearerAuth: []
 *     summary: Update product
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: Cappuccino
 *               description:
 *                 type: string
 *                 example: Creamy cappuccino
 *               price:
 *                 type: number
 *                 example: 170
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 */
router.put(
    "/:id",
    authenticateAdmin,
    authorizeAdmin,
    validateProductId,
    validateUpdateProduct,
    validateRequest,
    updateProduct
);


// Delete Product
/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     security:
 *     - bearerAuth: []
 *     summary: Delete product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete(
    "/:id",
    authenticateAdmin,
    authorizeAdmin,
    validateProductId,
    validateRequest,
    deleteProduct
);

module.exports = router;
