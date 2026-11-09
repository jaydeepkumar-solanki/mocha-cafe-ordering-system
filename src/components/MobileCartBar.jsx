import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const MobileCartBar = ({
  cartCount,
  grandTotal,
  onOpenCart,
}) => {
  return (
    <AnimatePresence>
      {cartCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="fixed bottom-4 inset-x-4 z-30 md:hidden"
        >
          <button
            onClick={onOpenCart}
            className="w-full bg-caramel hover:bg-caramel-dark text-espresso font-semibold px-6 py-3.5 rounded-2xl shadow-xl flex items-center justify-between press-spring cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="bg-espresso text-cream text-xs font-bold rounded-lg px-2.5 py-1">
                {cartCount} {cartCount === 1 ? 'item' : 'items'}
              </span>
              <span className="text-sm font-medium">Review Order</span>
            </div>
            <div className="flex items-center gap-1.5 font-serif font-bold text-base">
              <span>₹{grandTotal}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
