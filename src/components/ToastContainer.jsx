import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const ToastContainer = ({ toasts, onUndo }) => {
  return (
    <div className="fixed top-20 right-6 z-[80] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="glass-light dark:glass-dark border border-caramel/40 px-4 py-3 rounded-2xl shadow-xl text-xs flex items-center justify-between gap-4 pointer-events-auto min-w-[220px]"
          >
            {toast.type === 'undo' ? (
              <>
                <span className="text-espresso dark:text-cream truncate max-w-[170px] font-medium">
                  Removed {toast.itemName}
                </span>
                <button
                  onClick={() => onUndo(toast)}
                  className="text-caramel hover:underline font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Undo
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-caramel shrink-0"></span>
                <span className="font-medium text-espresso dark:text-cream">{toast.message}</span>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
