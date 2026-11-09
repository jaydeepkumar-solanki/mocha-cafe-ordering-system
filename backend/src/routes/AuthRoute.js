
const express = require("express");

const router = express.Router();

const {
    registerAdmin,
    loginAdmin
} = require("../controllers/AuthController");

// Admin Registration
// /**
//  * @swagger
//  * /api/auth/register:
//  *   post:
//  *     summary: Register a new admin
//  *     tags: [Authentication]
//  *     parameters:
//  *       - in: header
//  *         name: x-admin-registration-key
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: Private admin registration key
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - name
//  *               - email
//  *               - password
//  *             properties:
//  *               name:
//  *                 type: string
//  *                 example: Cafe Admin
//  *               email:
//  *                 type: string
//  *                 example: admin@cafe.com
//  *               password:
//  *                 type: string
//  *                 example: Admin@12345
//  *     responses:
//  *       201:
//  *         description: Admin registered successfully
//  *       400:
//  *         description: Missing or invalid registration data
//  *       403:
//  *         description: Registration key is invalid
//  *       409:
//  *         description: Admin already exists
//  */
router.post("/register", registerAdmin);

// Admin Login
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Admin Login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@cafe.com
 *               password:
 *                 type: string
 *                 example: Admin@12345
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid email or password
 */
router.post("/login", loginAdmin);

module.exports = router;


module.exports = router;
