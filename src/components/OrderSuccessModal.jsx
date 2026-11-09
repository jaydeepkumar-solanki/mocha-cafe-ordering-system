import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { trackOrder } from "../services/orderService.js";

export const OrderSuccessModal = ({ isOpen, onClose, orderData }) => {
  const [trackingData, setTrackingData] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [trackingError, setTrackingError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTrackingData(null);
      setTrackingError("");

      const end = Date.now() + 1.2 * 1000;
      const colors = ["#C8A15A", "#2B1B14", "#8A9A7B", "#F7F1E8", "#DFC48D"];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });

        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  }, [isOpen, orderData?._id]);

  // Automatically refresh order status every 10 seconds
  useEffect(() => {
    if (!isOpen || !trackingData?._id || !orderData?.phone) {
      return;
    }

    // Stop polling when the order reaches a final status
    if (["completed", "cancelled"].includes(trackingData.orderStatus)) {
      return;
    }

    const intervalId = setInterval(async () => {
      try {
        const latestOrder = await trackOrder(trackingData._id, orderData.phone);

        setTrackingData(latestOrder);
        setTrackingError("");
      } catch (error) {
        console.error("Automatic order tracking failed:", error);
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, [isOpen, trackingData?._id, trackingData?.orderStatus, orderData?.phone]);

  const handleTrackOrder = async () => {
    if (!orderData?._id || !orderData?.phone) {
      setTrackingError("Order information is missing. Please try again.");
      return;
    }

    setIsTracking(true);
    setTrackingError("");

    try {
      const result = await trackOrder(orderData._id, orderData.phone);
      setTrackingData(result);
    } catch (error) {
      console.error("Order tracking failed:", error);

      setTrackingError(
        error.response?.data?.message ||
          error.message ||
          "Unable to retrieve order status. Please try again.",
      );
    } finally {
      setIsTracking(false);
    }
  };

  const currentOrder = trackingData || orderData;

  const statusStyles = {
    pending: "bg-amber-500/15 text-amber-600 border-amber-500/30",
    preparing: "bg-blue-500/15 text-blue-500 border-blue-500/30",
    completed: "bg-green-500/15 text-green-600 border-green-500/30",
    cancelled: "bg-red-500/15 text-red-500 border-red-500/30",
  };

  const statusLabels = {
    pending: "Order Received",
    preparing: "Preparing Your Order",
    completed: "Order Completed",
    cancelled: "Order Cancelled",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4 cursor-pointer"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-20 w-full max-w-md bg-cream-light dark:bg-espresso-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-caramel/40 text-center space-y-6 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated Checkmark */}
            <div className="w-24 h-24 mx-auto rounded-full bg-caramel/15 border border-caramel/30 flex items-center justify-center relative">
              <svg className="w-14 h-14 text-caramel" viewBox="0 0 52 52">
                <circle
                  cx="26"
                  cy="26"
                  r="23"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="opacity-30"
                />
                <path
                  className="draw-path fill-none stroke-caramel stroke-[3.5] stroke-linecap-round stroke-linejoin-round"
                  d="M14 27 l8 8 l16 -16"
                />
              </svg>
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.25em] text-caramel font-semibold">
                {trackingData ? "Order Tracking" : "Kitchen Order Confirmed"}
              </span>

              <h3 className="font-serif text-3xl font-bold text-espresso dark:text-cream">
                {trackingData ? "Your Coffee Journey" : "Brewing Happiness"}
              </h3>

              <p className="text-xs text-espresso/70 dark:text-cream/70">
                {currentOrder?.customerName
                  ? `Thank you, ${currentOrder.customerName}!`
                  : ""}
              </p>
            </div>

            {/* Order Information */}
            <div className="p-4 rounded-2xl bg-espresso/5 dark:bg-espresso/40 border border-caramel/20 text-left space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-espresso/60 dark:text-cream/60">
                  Order Token
                </span>

                <span className="font-mono font-bold text-caramel">
                  {currentOrder?._id
                    ? `#${currentOrder._id.slice(-8).toUpperCase()}`
                    : "—"}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-espresso/60 dark:text-cream/60">
                  Destination
                </span>

                <span className="font-semibold text-espresso dark:text-cream">
                  {currentOrder?.orderType === "takeaway"
                    ? "Takeaway Counter"
                    : currentOrder?.tableNumber
                      ? `Table ${currentOrder.tableNumber}`
                      : orderData?.table || "—"}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-espresso/60 dark:text-cream/60">
                  Order Total
                </span>

                <span className="font-bold text-caramel">
                  ₹{currentOrder?.totalAmount ?? 0}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-espresso/60 dark:text-cream/60">
                  Order Status
                </span>

                <span
                  className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase ${
                    statusStyles[currentOrder?.orderStatus] ||
                    "bg-gray-500/10 text-gray-500 border-gray-500/20"
                  }`}
                >
                  {statusLabels[currentOrder?.orderStatus] ||
                    currentOrder?.orderStatus ||
                    "Unknown"}
                </span>
              </div>

              {trackingData && (
                <div className="border-t border-caramel/20 pt-3 space-y-2">
                  <p className="text-xs font-semibold text-espresso dark:text-cream">
                    Ordered Items
                  </p>

                  {trackingData.items?.map((item, index) => (
                    <div
                      key={item._id || index}
                      className="flex justify-between text-xs text-espresso/70 dark:text-cream/70"
                    >
                      <span>
                        {item.name} × {item.quantity}
                      </span>

                      <span>₹{item.subtotal}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tracking Error */}
            {trackingError && (
              <div
                role="alert"
                className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs"
              >
                {trackingError}
              </div>
            )}

            {/* Actions */}
            {!trackingData ? (
              <button
                onClick={handleTrackOrder}
                disabled={isTracking}
                className="w-full py-3.5 rounded-2xl bg-caramel hover:bg-caramel-dark disabled:opacity-60 text-espresso font-semibold text-sm tracking-wide shadow-warm-glow press-spring cursor-pointer disabled:cursor-not-allowed transition-colors"
              >
                {isTracking
                  ? "Fetching Order Status..."
                  : "Track Order & Browse More"}
              </button>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleTrackOrder}
                  disabled={isTracking}
                  className="w-full py-3 rounded-2xl border border-caramel text-caramel font-semibold text-sm hover:bg-caramel/10 disabled:opacity-60 transition-colors"
                >
                  {isTracking ? "Refreshing..." : "Refresh Order Status"}
                </button>

                <button
                  onClick={onClose}
                  className="w-full py-3.5 rounded-2xl bg-caramel hover:bg-caramel-dark text-espresso font-semibold text-sm tracking-wide shadow-warm-glow press-spring cursor-pointer transition-colors"
                >
                  Continue Browsing
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
