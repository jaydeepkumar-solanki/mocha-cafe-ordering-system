
const express = require("express");

const router = express.Router();

const {
    authenticateAdmin,
    authorizeAdmin
} = require("../middleware/authMiddleware");

const upload = require("../middleware/upload");

const { uploadImage } = require("../controllers/UploadController");

// Upload Product or Category Image
/**
 * @swagger
 * /api/upload/{type}:
 *   post:
 *     summary: Upload Product or Category Image
 *     tags: [Image Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [product, category]
 *         description: Upload destination
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       400:
 *         description: Invalid image or upload error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 */
router.post(
    "/:type",
    authenticateAdmin,
    authorizeAdmin,
    upload.single("image"),
    uploadImage
);

module.exports = router;
