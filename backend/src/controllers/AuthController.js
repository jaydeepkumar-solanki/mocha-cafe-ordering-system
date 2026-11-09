const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

// Admin Registration
const registerAdmin = async (req, res) => {
  try {
    const registrationKey = req.headers["x-admin-registration-key"];

    if (
      !process.env.ADMIN_REGISTRATION_KEY ||
      registrationKey !== process.env.ADMIN_REGISTRATION_KEY
    ) {
      return res.status(403).json({
        success: false,
        message: "Admin registration is not authorized",
      });
    }
    
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // Check whether admin already exists
    const existingAdmin = await Admin.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: "Admin already exists",
      });
    }

    // Create admin
    const admin = await Admin.create({
      name,
      email,
      password,
    });

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin Registration Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// Admin Login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find admin and include password
    const admin = await Admin.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
      },
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
};
