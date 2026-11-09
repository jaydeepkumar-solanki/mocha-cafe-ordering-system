import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const CartDrawer = ({
  isOpen,
  onClose,
  cart,
  menuItems,
  onUpdateQty,
  onRemoveItem,
  onProceedToCheckout,
  tableNumber,
}) => {
  const itemEntries = Object.entries(cart).filter(([_, qty]) => qty > 0);
  const totalCount = itemEntries.reduce((sum, [_, qty]) => sum + qty, 0);

  const subtotal = itemEntries.reduce((acc, [id, qty]) => {
    const item = menuItems.find((i) => i.id === id);
    return acc + (item ? item.price * qty : 0);
  }, 0);

  const tax = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + tax;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 cursor-pointer"
            onClick={onClose}
          />

          {/* Drawer: Bottom-sheet on mobile, Right Drawer on desktop */}
          <motion.div
            initial={{
              y: typeof window !== 'undefined' && window.innerWidth < 768 ? '100%' : 0,
              x: typeof window !== 'undefined' && window.innerWidth < 768 ? 0 : '100%',
            }}
            animate={{ y: 0, x: 0 }}
            exit={{
              y: typeof window !== 'undefined' && window.innerWidth < 768 ? '100%' : 0,
              x: typeof window !== 'undefined' && window.innerWidth < 768 ? 0 : '100%',
            }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed z-50 bg-cream-light dark:bg-espresso-card shadow-2xl flex flex-col inset-x-0 bottom-0 max-h-[85vh] rounded-t-3xl md:rounded-none md:inset-y-0 md:right-0 md:left-auto md:w-[440px] md:max-h-full border-t md:border-t-0 md:border-l border-caramel/20 overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-caramel/20 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-caramel/15 text-caramel flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      strokeWidth="2"
                      strokeLinecap="round"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-espresso dark:text-cream">
                    Your Curated Tray
                  </h3>
                  <p className="text-xs text-caramel font-medium">
                    Table {tableNumber} • Dine-in
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-espresso/50 dark:text-cream/50 hover:text-caramel transition-colors rounded-full focus:outline-none cursor-pointer"
                aria-label="Close cart drawer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round"></path>
                </svg>
              </button>
            </div>

            {/* Items List or Empty State */}
            {totalCount > 0 ? (
              <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                <AnimatePresence initial={false}>
                  {itemEntries.map(([id, qty]) => {
                    const item = menuItems.find((m) => m.id === id);
                    if (!item) return null;

                    return (
                      <motion.div
                        key={id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, height: 0, margin: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-3.5 p-3 rounded-2xl bg-espresso/5 dark:bg-espresso/40 border border-caramel/15"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 rounded-xl object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-serif text-sm font-semibold truncate text-espresso dark:text-cream">
                            {item.name}
                          </h5>
                          <span className="text-xs text-caramel font-bold">₹{item.price}</span>
                        </div>

                        {/* Stepper */}
                        <div className="flex items-center gap-2 bg-caramel/20 p-1 rounded-full border border-caramel/30 shrink-0">
                          <button
                            onClick={() => onUpdateQty(item.id, -1)}
                            className="w-6 h-6 rounded-full bg-caramel text-espresso font-bold flex items-center justify-center press-spring text-xs cursor-pointer hover:bg-caramel-dark transition-colors"
                          >
                            −
                          </button>
                          <span className="text-xs font-bold w-4 text-center text-espresso dark:text-cream">
                            {qty}
                          </span>
                          <button
                            onClick={() => onUpdateQty(item.id, 1)}
                            className="w-6 h-6 rounded-full bg-caramel text-espresso font-bold flex items-center justify-center press-spring text-xs cursor-pointer hover:bg-caramel-dark transition-colors"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-espresso/40 dark:text-cream/40 hover:text-red-500 p-1 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              strokeWidth="1.8"
                            ></path>
                          </svg>
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-caramel/10 text-caramel flex items-center justify-center mb-4">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"
                      strokeWidth="1.8"
                    ></path>
                  </svg>
                </div>
                <h4 className="font-serif text-lg font-semibold mb-1 text-espresso dark:text-cream">
                  Your tray is empty
                </h4>
                <p className="text-xs text-espresso/60 dark:text-cream/60 max-w-xs mb-6">
                  Select from our signature brews, warm tartines, and viennoiserie to begin.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full bg-caramel text-espresso font-semibold text-xs uppercase tracking-wider press-spring cursor-pointer hover:bg-caramel-dark transition-colors"
                >
                  Explore Menu
                </button>
              </div>
            )}

            {/* Drawer Footer */}
            {totalCount > 0 && (
              <div className="p-6 border-t border-caramel/20 bg-cream/50 dark:bg-espresso-dark/40 space-y-3 shrink-0">
                <div className="space-y-1.5 text-xs text-espresso/70 dark:text-cream/70 font-medium">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-espresso dark:text-cream">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes & GST (5%)</span>
                    <span className="font-semibold text-espresso dark:text-cream">₹{tax}</span>
                  </div>
                  <div className="h-[1px] bg-caramel/20 my-1"></div>
                  <div className="flex justify-between text-base font-serif font-bold text-espresso dark:text-cream">
                    <span>Grand Total</span>
                    <span className="text-caramel">₹{grandTotal}</span>
                  </div>
                </div>

                <button
                  onClick={onProceedToCheckout}
                  className="w-full py-3.5 rounded-2xl bg-caramel hover:bg-caramel-dark text-espresso font-semibold text-sm tracking-wide shadow-warm-glow press-spring flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                      strokeWidth="2"
                      strokeLinecap="round"
                    ></path>
                  </svg>
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
