const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");

// 1. Create a new order
const createOrder = async (req, res) => {
  try {
    const {
      customerName,
      phone,
      orderType,
      tableNumber,
      specialInstructions,
      items,
    } = req.body;

    // 1. Validate customer details
    if (
      typeof customerName !== "string" ||
      !customerName.trim() ||
      typeof phone !== "string" ||
      !/^[6-9]\d{9}$/.test(phone.trim())
    ) {
      return res.status(400).json({
        success: false,
        message:
          "A valid customer name and 10-digit phone number are required.",
      });
    }

    // 2. Validate order type
    if (!["dinein", "takeaway"].includes(orderType)) {
      return res.status(400).json({
        success: false,
        message: "Order type must be dinein or takeaway.",
      });
    }

    // 3. Validate table number
    if (
      orderType === "dinein" &&
      (!Number.isInteger(Number(tableNumber)) || Number(tableNumber) < 1)
    ) {
      return res.status(400).json({
        success: false,
        message: "A valid table number is required for dine-in orders.",
      });
    }

    // 4. Validate instructions
    if (
      specialInstructions !== undefined &&
      (typeof specialInstructions !== "string" ||
        specialInstructions.length > 500)
    ) {
      return res.status(400).json({
        success: false,
        message: "Special instructions cannot exceed 500 characters.",
      });
    }

    // 5. Validate order items
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "An order must contain at least one item.",
      });
    }

    if (items.some((item) => !item || !item.product)) {
      return res.status(400).json({
        success: false,
        message: "Every order item must contain a product ID.",
      });
    }

    // 6. Prevent duplicate products
    const productIds = items.map((item) => item.product);
    const uniqueProductIds = new Set(productIds.map(String));

    if (uniqueProductIds.size !== productIds.length) {
      return res.status(400).json({
        success: false,
        message: "Duplicate products are not allowed in an order.",
      });
    }

    // 7. Validate products and calculate prices from MongoDB
    const orderItems = await Promise.all(
      items.map(async (item) => {
        if (
          !mongoose.Types.ObjectId.isValid(item.product) ||
          !Number.isSafeInteger(item.quantity) ||
          item.quantity < 1 ||
          item.quantity > 20
        ) {
          throw new Error(
            "Each product must have a valid ID and quantity between 1 and 20.",
          );
        }

        const product = await Product.findById(item.product);

        if (!product) {
          const error = new Error("Product not found.");
          error.statusCode = 404;
          throw error;
        }

        if (!product.isAvailable) {
          const error = new Error(`${product.name} is currently unavailable.`);
          error.statusCode = 400;
          throw error;
        }

        const priceInPaise = Math.round(
          (Number(product.price) + Number.EPSILON) * 100,
        );

        const subtotalInPaise = priceInPaise * item.quantity;

        if (
          !Number.isSafeInteger(priceInPaise) ||
          !Number.isSafeInteger(subtotalInPaise)
        ) {
          throw new Error("Invalid product price calculation.");
        }

        return {
          product: product._id,
          name: product.name,
          quantity: item.quantity,
          price: priceInPaise / 100,
          subtotal: subtotalInPaise / 100,
        };
      }),
    );

    // 8. Calculate subtotal using integer paise
    const subtotalInPaise = orderItems.reduce(
      (total, item) => total + Math.round(item.subtotal * 100),
      0,
    );

    // 9. Calculate 5% GST
    const taxInPaise = Math.round(subtotalInPaise * 0.05);

    // 10. Calculate final total
    const totalInPaise = subtotalInPaise + taxInPaise;

    if (!Number.isSafeInteger(totalInPaise)) {
      throw new Error("Invalid order total calculation.");
    }

    // 11. Save order
    const order = await Order.create({
      customerName: customerName.trim(),
      phone: phone.trim(),
      orderType,
      tableNumber: orderType === "dinein" ? Number(tableNumber) : null,
      specialInstructions: specialInstructions?.trim() || "",
      items: orderItems,
      subtotalAmount: subtotalInPaise / 100,
      taxAmount: taxInPaise / 100,
      totalAmount: totalInPaise / 100,
    });

    // 12. Return saved order
    return res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      data: order,
    });
  } catch (error) {
    console.error("Create Order Error:", error);

    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Invalid order data.",
      });
    }

    if (
      error.message.includes("quantity") ||
      error.message.includes("price calculation") ||
      error.message.includes("order total")
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error while creating order.",
    });
  }
};

// 2. Get all orders with pagination
const getAllOrders = async (req, res) => {
  try {
    // Get pagination values from query parameters
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);

    // Validate pagination values
    if (
      !Number.isInteger(page) ||
      page < 1 ||
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Page must be at least 1 and limit must be between 1 and 100.",
      });
    }

    // Calculate how many records to skip
    const skip = (page - 1) * limit;

    // Fetch orders and total count
    const [orders, totalOrders] = await Promise.all([
      Order.find()
        .populate("items.product", "name price")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Order.countDocuments(),
    ]);

    // Calculate total pages
    const totalPages = Math.ceil(totalOrders / limit);

    return res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        currentPage: page,
        limit,
        totalOrders,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get All Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching orders.",
    });
  }
};

// 3. Get order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "items.product",
      "name price",
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Get Order By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching order.",
    });
  }
};

// 4. Track customer order using order ID and phone number
const trackOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const phone = req.body.phone.trim();

    // Verify both order ID and customer's phone number
    const order = await Order.findOne({
      _id: id,
      phone,
    })
      .select(
        "_id customerName orderType tableNumber items.name items.quantity items.price items.subtotal subtotalAmount taxAmount totalAmount orderStatus createdAt updatedAt",
      )
      .lean();

    // Return the same message whether the ID or phone is incorrect
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or phone number does not match.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order details retrieved successfully.",
      data: order,
    });
  } catch (error) {
    console.error("Track Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error while tracking order.",
    });
  }
};

// 4. Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const allowedStatuses = ["pending", "preparing", "completed", "cancelled"];

    if (!allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status.",
      });
    }

    // Find the existing order
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    // Define allowed status transitions
    const allowedTransitions = {
      pending: ["preparing", "cancelled"],
      preparing: ["completed", "cancelled"],
      completed: [],
      cancelled: [],
    };

    // Check whether the requested transition is allowed
    if (!allowedTransitions[order.orderStatus].includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change order status from ${order.orderStatus} to ${orderStatus}.`,
      });
    }

    // Update and save order
    order.orderStatus = orderStatus;
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      data: order,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error while updating order status.",
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  trackOrder,
  updateOrderStatus,
};
