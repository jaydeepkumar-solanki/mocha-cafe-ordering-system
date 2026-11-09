const express = require("express");
const validateRequest = require("../middleware/validateRequest");
const {
  authenticateAdmin,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

const {
  validateCreateOrder,
  validateOrderId,
  validateTrackOrder,
  validateUpdateOrderStatus,
} = require("../validators/orderValidators");

const router = express.Router();

const {
  createOrder,
  getAllOrders,
  getOrderById,
  trackOrder,
  updateOrderStatus,
} = require("../controllers/OrderController");

// Place a new order
/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Place a new customer order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerName
 *               - phone
 *               - items
 *             properties:
 *               customerName:
 *                 type: string
 *                 example: Rahul
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                       example: "671234567890123456789012"
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       400:
 *         description: Invalid order data
 */
router.post("/", validateCreateOrder, validateRequest, createOrder);

// Get all orders
/**
 * @swagger
 * /api/orders:
 *   get:
 *     security:
 *     - bearerAuth: []
 *     summary: Get all customer orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/", authenticateAdmin, authorizeAdmin, getAllOrders);

// Get a single order
/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     security:
 *     - bearerAuth: []
 *     summary: Get a single order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB order ID
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *       400:
 *         description: Invalid order ID
 *       404:
 *         description: Order not found
 */
router.get(
  "/:id",
  authenticateAdmin,
  authorizeAdmin,
  validateOrderId,
  validateRequest,
  getOrderById,
);

/**
 * @swagger
 * /api/orders/{id}/track:
 *   post:
 *     summary: Track a customer order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *     responses:
 *       200:
 *         description: Order details retrieved successfully
 *       400:
 *         description: Invalid order ID or phone number
 *       404:
 *         description: Order not found or phone number does not match
 */
router.post("/:id/track", validateTrackOrder, validateRequest, trackOrder);

// Update order status
/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     security:
 *     - bearerAuth: []
 *     summary: Update customer order status
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderStatus
 *             properties:
 *               orderStatus:
 *                 type: string
 *                 enum:
 *                   - pending
 *                   - preparing
 *                   - completed
 *                   - cancelled
 *                 example: preparing
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Invalid status or order ID
 *       404:
 *         description: Order not found
 */
router.patch(
  "/:id/status",
  authenticateAdmin,
  authorizeAdmin,
  validateUpdateOrderStatus,
  validateRequest,
  updateOrderStatus,
);

module.exports = router;
