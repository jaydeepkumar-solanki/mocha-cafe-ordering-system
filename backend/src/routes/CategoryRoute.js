
const express = require("express");
const validateRequest = require("../middleware/validateRequest");

const {
    validateCreateCategory,
    validateUpdateCategory,
    validateCategoryId
} = require("../validators/categoryValidators");

const {
    authenticateAdmin,
    authorizeAdmin
} = require("../middleware/authMiddleware");

const router = express.Router();

const {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require("../controllers/CategoryController");

// Create Category
/**
 * @swagger
 * /api/categories:
 *   post:
 *     security:
 *     - bearerAuth: []
 *     summary: Create a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Coffee
 *               description:
 *                 type: string
 *                 example: Freshly brewed coffee
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Invalid category data
 */
router.post(
    "/",
    authenticateAdmin,
    authorizeAdmin,
    validateCreateCategory,
    validateRequest,
    createCategory
);


// Get All Categories
/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/", getCategories);


// Get Single Category
/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *       404:
 *         description: Category not found
 */
router.get(
    "/:id",
    validateCategoryId,
    validateRequest,
    getCategoryById
);


// Update Category
/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     security:
 *     - bearerAuth: []
 *     summary: Update category
 *     tags: [Categories]
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
 *                 example: Cold Coffee
 *               description:
 *                 type: string
 *                 example: Refreshing cold coffee
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       404:
 *         description: Category not found
 */
router.put(
    "/:id",
    authenticateAdmin,
    authorizeAdmin,
    validateCategoryId,
    validateUpdateCategory,
    validateRequest,
    updateCategory
);


// Delete Category
/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     security:
 *     - bearerAuth: []
 *     summary: Delete category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 */
router.delete(
    "/:id",
    authenticateAdmin,
    authorizeAdmin,
    validateCategoryId,
    validateRequest,
    deleteCategory
);

module.exports = router;
