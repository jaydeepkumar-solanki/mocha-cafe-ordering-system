const { body, param } = require("express-validator");

// Validate order creation
const validateCreateOrder = [
    body("customerName")
        .trim()
        .notEmpty()
        .withMessage("Customer name is required")
        .bail()
        .isLength({ min: 2, max: 100 })
        .withMessage("Customer name must be between 2 and 100 characters")
        .matches(/^[a-zA-Z\s.'-]+$/)
        .withMessage("Customer name can only contain letters and valid name characters"),

    body("phone")
        .trim()
        .matches(/^[6-9]\d{9}$/)
        .withMessage("Enter a valid 10-digit Indian mobile number"),

    body("orderType")
        .isIn(["dinein", "takeaway"])
        .withMessage("Order type must be dinein or takeaway"),

    body("tableNumber")
        .if((value, { req }) => req.body.orderType === "dinein")
        .isInt({ min: 1 })
        .withMessage("A valid table number is required for dine-in orders"),

    body("specialInstructions")
        .optional({ nullable: true })
        .isString()
        .withMessage("Special instructions must be text")
        .isLength({ max: 500 })
        .withMessage("Special instructions cannot exceed 500 characters"),

    body("items")
        .isArray({ min: 1 })
        .withMessage("At least one order item is required"),

    body("items.*.product")
        .isMongoId()
        .withMessage("Invalid product ID"),

    body("items.*.quantity")
        .isInt({ min: 1, max: 20 })
        .withMessage("Each product quantity must be between 1 and 20"),
];

// Validate MongoDB order ID
const validateOrderId = [
    param("id")
        .isMongoId()
        .withMessage("Invalid order ID"),
];

// Validate customer order tracking
const validateTrackOrder = [
    param("id")
        .isMongoId()
        .withMessage("Invalid order ID"),

    body("phone")
        .trim()
        .matches(/^[6-9]\d{9}$/)
        .withMessage("Enter the valid 10-digit phone number used for ordering"),
];

// Validate order status
const validateUpdateOrderStatus = [
    param("id")
        .isMongoId()
        .withMessage("Invalid order ID"),

    body("orderStatus")
        .isIn(["pending", "preparing", "completed", "cancelled"])
        .withMessage("Invalid order status"),
];

module.exports = {
    validateCreateOrder,
    validateOrderId,
    validateTrackOrder,
    validateUpdateOrderStatus,
};
