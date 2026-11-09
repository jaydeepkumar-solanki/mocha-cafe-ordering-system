const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0,
  },
});

const orderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    // Dine-in or takeaway
    orderType: {
      type: String,
      enum: ["dinein", "takeaway"],
      required: true,
      default: "dinein",
    },

    // Only applicable to dine-in orders
    tableNumber: {
      type: Number,
      default: null,
      min: 1,
    },

    // Optional customer instructions
    specialInstructions: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: function (items) {
          return items.length > 0;
        },
        message: "An order must contain at least one item.",
      },
    },

    // Amount before GST
    subtotalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // 5% GST
    taxAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Final amount including GST
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    orderStatus: {
      type: String,
      enum: ["pending", "preparing", "completed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Order", orderSchema);
