
const { body, param } = require("express-validator");

// Create Product Validation
const validateCreateProduct = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Product name is required")
        .isLength({ max: 100 })
        .withMessage("Product name cannot exceed 100 characters"),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Product description is required"),

    body("price")
        .notEmpty()
        .withMessage("Product price is required")
        .isFloat({ min: 0 })
        .withMessage("Price must be a valid non-negative number")
        .toFloat(),

    body("category")
        .trim()
        .notEmpty()
        .withMessage("Product category is required"),

    body("image")
        .optional()
        .isString()
        .withMessage("Image must be a string"),

    body("isAvailable")
        .optional()
        .isBoolean()
        .withMessage("isAvailable must be true or false")
        .toBoolean(),

    body("isFeatured")
        .optional()
        .isBoolean()
        .withMessage("isFeatured must be true or false")
        .toBoolean()
];

// Update Product Validation
const validateUpdateProduct = [
    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Product name cannot be empty")
        .isLength({ max: 100 })
        .withMessage("Product name cannot exceed 100 characters"),

    body("description")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Product description cannot be empty"),

    body("price")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Price must be a valid non-negative number")
        .toFloat(),

    body("category")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Product category cannot be empty"),

    body("image")
        .optional()
        .isString()
        .withMessage("Image must be a string"),

    body("isAvailable")
        .optional()
        .isBoolean()
        .withMessage("isAvailable must be true or false")
        .toBoolean(),

    body("isFeatured")
        .optional()
        .isBoolean()
        .withMessage("isFeatured must be true or false")
        .toBoolean()
];

// Validate Product ID
const validateProductId = [
    param("id")
        .isMongoId()
        .withMessage("Invalid product ID")
];

module.exports = {
    validateCreateProduct,
    validateUpdateProduct,
    validateProductId
};
