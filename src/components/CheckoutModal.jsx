import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND } from "../data/brand.js";
import { createOrder } from "../services/orderService.js";

export const CheckoutModal = ({
  isOpen,
  onClose,
  cart,
  menuItems,
  onOrderSuccess,
  tableNumber,
  customerPhone,
}) => {
  const [orderType, setOrderType] = useState("dinein");
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [instructions, setInstructions] = useState("");
  const [nameError, setNameError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shakeField, setShakeField] = useState("none");
  const [submitError, setSubmitError] = useState("");

  // Populate checkout phone number from the QR greeting modal
  useEffect(() => {
    if (isOpen && customerPhone) {
      setCustPhone(customerPhone);
      setPhoneError(false);
    }
  }, [isOpen, customerPhone]);

  const itemEntries = Object.entries(cart).filter(([_, qty]) => qty > 0);
  const totalCount = itemEntries.reduce((sum, [_, qty]) => sum + qty, 0);

  const subtotal = itemEntries.reduce((acc, [id, qty]) => {
    const item = menuItems.find((i) => i.id === id);
    return acc + (item ? item.price * qty : 0);
  }, 0);

  const tax = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();

    let valid = true;

    if (!custName.trim()) {
      setNameError(true);
      setShakeField("name");
      setTimeout(() => setShakeField("none"), 400);
      valid = false;
    } else {
      setNameError(false);
    }

    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phoneRegex.test(custPhone.trim())) {
      setPhoneError(true);

      if (valid) {
        setShakeField("phone");
        setTimeout(() => setShakeField("none"), 400);
      }

      valid = false;
    } else {
      setPhoneError(false);
    }

    if (!valid) return;

    if (itemEntries.length === 0) {
      setSubmitError("Your cart is empty. Please add items first.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const orderPayload = {
        customerName: custName.trim(),
        phone: custPhone.trim(),
        orderType,
        tableNumber: orderType === "dinein" ? Number(tableNumber) : null,
        specialInstructions: instructions.trim(),
        items: itemEntries.map(([productId, quantity]) => ({
          product: productId,
          quantity,
        })),
      };

      const createdOrder = await createOrder(orderPayload);

      // Open success modal only after MongoDB confirms order creation
      onOrderSuccess(createdOrder);
    } catch (error) {
      console.error("Order submission failed:", error);

      setSubmitError(
        error.response?.data?.message ||
          error.message ||
          "Unable to place your order. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-pointer"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-cream-light dark:bg-espresso-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-caramel/30 max-h-[92vh] overflow-y-auto no-scrollbar cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-caramel/20 mb-6">
              <div>
                <h3 className="font-serif text-2xl font-bold text-espresso dark:text-cream">
                  Complete Your Order
                </h3>
                <p className="text-xs text-caramel">
                  Fast table-side check-in • No login required
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-espresso/50 dark:text-cream/50 hover:text-caramel rounded-full transition-colors cursor-pointer"
                aria-label="Close checkout"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M6 18L18 6M6 6l12 12"
                    strokeWidth="2"
                    strokeLinecap="round"
                  ></path>
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Service Experience Toggle */}
              <div>
                <label className="block text-xs font-medium text-espresso/70 dark:text-cream/70 mb-1.5 uppercase tracking-wider">
                  Service Experience
                </label>
                <div className="grid grid-cols-2 gap-3 p-1 bg-espresso/5 dark:bg-espresso/40 rounded-2xl border border-caramel/20">
                  <button
                    type="button"
                    onClick={() => setOrderType("dinein")}
                    className={`py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      orderType === "dinein"
                        ? "bg-caramel text-espresso shadow-sm"
                        : "text-espresso/70 dark:text-cream/70 hover:text-caramel"
                    }`}
                  >
                    Dine-in (Table {tableNumber})
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType("takeaway")}
                    className={`py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      orderType === "takeaway"
                        ? "bg-caramel text-espresso shadow-sm"
                        : "text-espresso/70 dark:text-cream/70 hover:text-caramel"
                    }`}
                  >
                    Takeaway
                  </button>
                </div>
              </div>

              {/* Customer Name */}
              <div
                className={`relative pt-2 transition-transform ${
                  shakeField === "name" ? "animate-bounce" : ""
                }`}
              >
                <div className="relative">
                  <input
                    type="text"
                    id="custName"
                    value={custName}
                    onChange={(e) => {
                      setCustName(e.target.value);
                      if (nameError) setNameError(false);
                    }}
                    placeholder=" "
                    className="peer w-full px-4 py-3.5 rounded-xl bg-transparent border border-caramel/30 focus:border-caramel focus:ring-2 focus:ring-caramel/20 focus:outline-none text-sm text-espresso dark:text-cream transition-all placeholder-transparent"
                  />
                  <label
                    htmlFor="custName"
                    className="absolute left-4 top-3.5 text-xs text-espresso/50 dark:text-cream/50 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-caramel peer-focus:bg-cream-light dark:peer-focus:bg-espresso-card peer-focus:px-1 pointer-events-none"
                  >
                    Your Full Name *
                  </label>
                </div>
                {nameError && (
                  <p className="text-[11px] text-red-500 mt-1">
                    Please provide your name.
                  </p>
                )}
              </div>

              {/* Phone Number with +91 Prefix */}
              <div
                className={`relative pt-2 transition-transform ${
                  shakeField === "phone" ? "animate-bounce" : ""
                }`}
              >
                <div className="flex rounded-xl border border-caramel/30 focus-within:border-caramel focus-within:ring-2 focus-within:ring-caramel/20 overflow-hidden">
                  <span className="inline-flex items-center px-3.5 bg-espresso/5 dark:bg-espresso/40 text-xs font-semibold text-caramel border-r border-caramel/20">
                    +91
                  </span>
                  <input
                    type="tel"
                    id="custPhone"
                    maxLength={10}
                    value={custPhone}
                    onChange={(e) => {
                      setCustPhone(e.target.value.replace(/\D/g, ""));
                      if (phoneError) setPhoneError(false);
                    }}
                    placeholder="10-digit mobile number"
                    className="w-full px-4 py-3 bg-transparent text-sm focus:outline-none text-espresso dark:text-cream placeholder-espresso/40 dark:placeholder-cream/30 font-mono"
                  />
                </div>
                {phoneError && (
                  <p className="text-[11px] text-red-500 mt-1">
                    Enter a valid 10-digit mobile number starting with 6-9.
                  </p>
                )}
              </div>

              {/* Table Location */}
              {orderType === "dinein" && (
                <div className="relative pt-2">
                  <input
                    type="text"
                    readOnly
                    value={`Table ${tableNumber} (Corner Solarium)`}
                    className="w-full px-4 py-3 rounded-xl bg-espresso/5 dark:bg-espresso/30 border border-caramel/20 text-xs font-semibold text-caramel focus:outline-none cursor-not-allowed"
                  />
                </div>
              )}

              {/* Special Barista Instructions */}
              <div className="relative pt-2">
                <textarea
                  rows={2}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Special brew instructions (e.g., Oat milk, extra hot, less sweet)..."
                  className="w-full px-4 py-3 rounded-xl bg-transparent border border-caramel/30 focus:border-caramel focus:ring-2 focus:ring-caramel/20 focus:outline-none text-xs text-espresso dark:text-cream transition-all placeholder-espresso/40 dark:placeholder-cream/30 resize-none"
                ></textarea>
              </div>

              {submitError && (
                <div
                  role="alert"
                  className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs"
                >
                  {submitError}
                </div>
              )}

              {/* Collapsible Order Summary preview */}
              <details className="group border border-caramel/20 rounded-2xl p-3.5 bg-espresso/5 dark:bg-espresso/30 text-xs cursor-pointer">
                <summary className="font-semibold flex items-center justify-between text-caramel select-none list-none">
                  <span>Review Items ({totalCount})</span>
                  <svg
                    className="w-4 h-4 transform group-open:rotate-180 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M19 9l-7 7-7-7"
                      strokeWidth="2"
                      strokeLinecap="round"
                    ></path>
                  </svg>
                </summary>
                <div className="pt-3 space-y-1.5 text-espresso/70 dark:text-cream/70 border-t border-caramel/15 mt-2">
                  {itemEntries.map(([id, qty]) => {
                    const item = menuItems.find((m) => m.id === id);
                    if (!item) return null;
                    return (
                      <div
                        key={id}
                        className="flex justify-between items-center"
                      >
                        <span>
                          {qty}x {item.name}
                        </span>
                        <span className="font-medium">₹{item.price * qty}</span>
                      </div>
                    );
                  })}
                  <div className="h-[1px] bg-caramel/15 my-1"></div>
                  <div className="flex justify-between text-xs font-semibold text-espresso dark:text-cream">
                    <span>Grand Total (incl. GST)</span>
                    <span className="text-caramel font-bold">
                      ₹{grandTotal}
                    </span>
                  </div>
                </div>
              </details>

              {/* Place Order CTA Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 py-4 rounded-2xl bg-caramel hover:bg-caramel-dark text-espresso font-semibold text-sm tracking-wide shadow-warm-glow press-spring flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span>Transmitting to Barista...</span>
                    <svg
                      className="w-5 h-5 animate-spin text-espresso"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                  </>
                ) : (
                  <span>Confirm & Place Order • ₹{grandTotal}</span>
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
