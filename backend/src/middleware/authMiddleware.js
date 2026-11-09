
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// Authentication Middleware
const authenticateAdmin = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access denied. Authentication token required."
            });
        }

        const token = authHeader.split(" ")[1];

        // Verify JWT token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Confirm admin still exists
        const admin = await Admin.findById(decoded.id);

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Admin account not found."
            });
        }

        // Attach admin information to request
        req.admin = admin;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired authentication token."
        });
    }
};


// Authorization Middleware
const authorizeAdmin = (req, res, next) => {
    if (!req.admin || req.admin.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "You are not authorized to perform this action."
        });
    }

    next();
};

module.exports = {
    authenticateAdmin,
    authorizeAdmin
};
