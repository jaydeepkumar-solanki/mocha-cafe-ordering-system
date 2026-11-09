import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export const MenuItemCard = ({ item, quantity, onAdd, onUpdateQty, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.04, ease: "easeOut" }}
      className="relative group h-full"
    >
      {/* Ambient Warm Glow Backing on Hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-caramel/30 to-sage/20 rounded-3xl blur-xl transform scale-95 opacity-0 group-hover:opacity-75 transition-opacity duration-300 pointer-events-none" />

      {/* Smooth Lifted Card Surface */}
      <div className="relative h-full rounded-3xl p-3.5 glass-light dark:glass-dark border border-white/60 dark:border-caramel/20 shadow-card-soft group-hover:shadow-card-hover group-hover:border-caramel/45 transform group-hover:-translate-y-2 transition-all duration-300 ease-out flex flex-col justify-between overflow-hidden">
        <div>
          {/* Image with zoom & badges */}
          <div className="relative h-48 rounded-2xl overflow-hidden bg-espresso/10 mb-3.5">
            <img
              id={`img-${item.id}`}
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso/45 via-transparent to-transparent opacity-60 pointer-events-none"></div>

            {/* Indian Veg / Non-Veg Indicator */}
            {typeof item.veg === "boolean" && (
              <div className="absolute top-3 left-3 bg-cream/90 dark:bg-espresso/90 backdrop-blur-md p-1 rounded-md border border-caramel/30 flex items-center justify-center shadow-sm">
                <span
                  className={`w-3.5 h-3.5 border-2 ${
                    item.veg ? "border-sage" : "border-red-600"
                  } rounded-sm flex items-center justify-center`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      item.veg ? "bg-sage" : "bg-red-600"
                    }`}
                  ></span>
                </span>
              </div>
            )}

            {/* Bestseller / Rating Badge */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5">
              {item.bestseller && (
                <span className="px-2.5 py-0.5 rounded-full bg-caramel text-espresso font-bold text-[10px] uppercase tracking-wider shadow-sm">
                  Bestseller
                </span>
              )}

              {typeof item.rating === "number" && item.rating > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-espresso/80 text-caramel text-[11px] font-semibold backdrop-blur-sm flex items-center gap-1 shadow-sm">
                  ★ {item.rating}
                </span>
              )}
            </div>
          </div>

          {/* Title & Description */}
          <div className="px-1">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className="font-serif text-lg font-semibold text-espresso dark:text-cream group-hover:text-caramel transition-colors line-clamp-1">
                {item.name}
              </h4>
            </div>
            <p className="text-xs text-espresso/70 dark:text-cream/70 line-clamp-2 leading-relaxed mb-3">
              {item.description}
            </p>
          </div>
        </div>

        {/* Bottom Action: Price & Morphing Quantity Stepper */}
        <div className="px-1 pt-2 flex items-center justify-between border-t border-caramel/15 mt-2">
          <span className="font-serif text-lg font-bold text-caramel">
            ₹{item.price}
          </span>

          <div>
            <AnimatePresence mode="wait">
              {quantity === 0 ? (
                <motion.button
                  key="add-btn"
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.85, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  onClick={(e) => onAdd(item.id, e)}
                  className="px-5 py-2 rounded-full bg-caramel hover:bg-caramel-dark text-espresso font-semibold text-xs tracking-wider uppercase shadow-sm press-spring flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <line
                      x1="12"
                      y1="5"
                      x2="12"
                      y2="19"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    ></line>
                    <line
                      x1="5"
                      y1="12"
                      x2="19"
                      y2="12"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    ></line>
                  </svg>
                  <span>Add</span>
                </motion.button>
              ) : (
                <motion.div
                  key="stepper"
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.85, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-2.5 bg-caramel/20 dark:bg-caramel/25 p-1 rounded-full border border-caramel/30"
                >
                  <button
                    onClick={() => onUpdateQty(item.id, -1)}
                    className="w-7 h-7 rounded-full bg-caramel hover:bg-caramel-dark text-espresso font-bold flex items-center justify-center press-spring text-sm leading-none cursor-pointer transition-colors"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="font-sans font-bold text-xs min-w-[14px] text-center text-espresso dark:text-cream">
                    {quantity}
                  </span>
                  <button
                    onClick={(e) => onUpdateQty(item.id, 1, e)}
                    className="w-7 h-7 rounded-full bg-caramel hover:bg-caramel-dark text-espresso font-bold flex items-center justify-center press-spring text-sm leading-none cursor-pointer transition-colors"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
