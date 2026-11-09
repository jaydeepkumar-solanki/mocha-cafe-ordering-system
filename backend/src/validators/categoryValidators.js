
const { body, param } = require("express-validator");

// Create Category Validation
const validateCreateCategory = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Category name is required")
        .isLength({ max: 100 })
        .withMessage("Category name cannot exceed 100 characters"),

    body("slug")
        .trim()
        .notEmpty()
        .withMessage("Category slug is required")
        .toLowerCase()
        .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .withMessage("Slug must contain lowercase letters, numbers and hyphens"),

    body("description")
        .optional()
        .isString()
        .withMessage("Description must be a string"),

    body("image")
        .optional()
        .isString()
        .withMessage("Image must be a string"),

    body("isActive")
        .optional()
        .isBoolean()
        .withMessage("isActive must be true or false")
        .toBoolean()
];

// Update Category Validation
const validateUpdateCategory = [
    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Category name cannot be empty")
        .isLength({ max: 100 })
        .withMessage("Category name cannot exceed 100 characters"),

    body("slug")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Category slug cannot be empty")
        .toLowerCase()
        .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .withMessage("Invalid category slug"),

    body("description")
        .optional()
        .isString()
        .withMessage("Description must be a string"),

    body("image")
        .optional()
        .isString()
        .withMessage("Image must be a string"),

    body("isActive")
        .optional()
        .isBoolean()
        .withMessage("isActive must be true or false")
        .toBoolean()
];

// Validate Category ID
const validateCategoryId = [
    param("id")
        .isMongoId()
        .withMessage("Invalid category ID")
];

module.exports = {
    validateCreateCategory,
    validateUpdateCategory,
    validateCategoryId
};
