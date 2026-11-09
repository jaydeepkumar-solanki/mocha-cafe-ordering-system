
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const TableGreetingModal = ({
  isOpen,
  onClose,
  onContinue,
  tableNumber,
}) => {
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setPhone('');
      setPhoneError('');
    }
  }, [isOpen]);

  const handleContinue = (e) => {
    e.preventDefault();

    const cleanedPhone = phone.trim();

    if (!/^[6-9]\d{9}$/.test(cleanedPhone)) {
      setPhoneError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setPhoneError('');

    if (onContinue) {
      onContinue(cleanedPhone);
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
            initial={{ scale: 0.9, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-cream-light dark:bg-espresso-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-caramel/30 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-caramel to-caramel-dark text-espresso mx-auto flex items-center justify-center shadow-lg shadow-caramel/30">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2 2-2 2m4 12l2 2-2 2"
                    strokeWidth="2"
                    strokeLinecap="round"
                  ></path>
                  <circle cx="12" cy="12" r="3" strokeWidth="2"></circle>
                </svg>
              </div>

              <span className="text-xs uppercase tracking-[0.25em] text-caramel font-semibold block">
                Tabletop QR Verified
              </span>

              <h3 className="font-serif text-3xl font-bold text-espresso dark:text-cream">
                Welcome, Table {tableNumber}
              </h3>

              <p className="text-xs sm:text-sm text-espresso/70 dark:text-cream/70 leading-relaxed">
                Relax and browse our roast menu directly from your phone.
                Zero downloads or passwords required.
              </p>
            </div>

            {/* Quick recommendation chip */}
            <div className="mt-6 p-3.5 rounded-2xl bg-espresso/5 dark:bg-espresso/30 border border-caramel/20 space-y-2">
              <p className="text-[11px] font-semibold text-caramel uppercase tracking-wider">
                Chef's pairing recommendation:
              </p>

              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=150&q=80"
                  alt="Pistachio Cortado"
                  className="w-11 h-11 rounded-xl object-cover shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-semibold text-espresso dark:text-cream truncate">
                    Pistachio Rose Latte
                  </h5>

                  <p className="text-[10px] text-espresso/60 dark:text-cream/60 truncate">
                    Crushed green pistachios & Persian rose essence
                  </p>
                </div>

                <span className="text-xs font-serif font-bold text-caramel shrink-0">
                  ₹340
                </span>
              </div>
            </div>

            {/* Customer phone number */}
            <form onSubmit={handleContinue} className="mt-6 space-y-3">
              <div>
                <label
                  htmlFor="customerPhone"
                  className="block text-xs font-semibold text-espresso dark:text-cream mb-2"
                >
                  Enter your mobile number
                </label>

                <div className="flex items-center rounded-xl border border-caramel/30 bg-white dark:bg-espresso/30 overflow-hidden">
                  <span className="px-3 py-3 text-sm font-semibold text-espresso/70 dark:text-cream/70 border-r border-caramel/20">
                    +91
                  </span>

                  <input
                    id="customerPhone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value.replace(/\D/g, ''));
                      setPhoneError('');
                    }}
                    placeholder="Enter 10-digit number"
                    className="w-full px-3 py-3 text-sm bg-transparent text-espresso dark:text-cream outline-none placeholder:text-espresso/40 dark:placeholder:text-cream/40"
                  />
                </div>

                {phoneError && (
                  <p className="text-xs text-red-500 mt-2">
                    {phoneError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-caramel hover:bg-caramel-dark text-espresso font-semibold text-sm tracking-wide shadow-warm-glow press-spring cursor-pointer transition-colors"
              >
                Continue to Menu
              </button>
            </form>

            <p className="text-center text-[10px] text-espresso/50 dark:text-cream/40 mt-3">
              Your orders are delivered direct to your tabletop.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
