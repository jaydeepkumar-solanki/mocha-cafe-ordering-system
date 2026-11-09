
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BRAND } from '../data/brand.js';

export const AdminQrModal = ({ isOpen, onClose }) => {
  const tables = [1, 2, 3, 4, 5, 6];

  const handlePrint = () => {
    window.print();
  };

  const getTableUrl = (tableNum) => {
    return `${window.location.origin}/?table=${tableNum}`;
  };

  const getQrCodeUrl = (tableNum) => {
    const tableUrl = getTableUrl(tableNum);

    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(tableUrl)}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-pointer print:p-0 print:bg-white"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl bg-cream-light dark:bg-espresso-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-caramel/30 max-h-[90vh] overflow-y-auto no-scrollbar cursor-default print:max-h-none print:shadow-none print:border-none print:p-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-caramel/20 mb-6 print:hidden">
              <div>
                <h3 className="font-serif text-2xl font-bold text-espresso dark:text-cream">
                  Tabletop QR Standee Generator
                </h3>
                <p className="text-xs text-caramel">
                  Print-ready luxury tabletop displays with zero-login links
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-xl bg-caramel text-espresso font-semibold text-xs tracking-wide press-spring flex items-center gap-1.5 cursor-pointer hover:bg-caramel-dark transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2m-12 0v4h12v-4"
                      strokeWidth="2"
                    ></path>
                  </svg>
                  <span>Print All Cards</span>
                </button>

                <button
                  onClick={onClose}
                  className="p-2 text-espresso/50 dark:text-cream/50 hover:text-caramel rounded-full transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round"></path>
                  </svg>
                </button>
              </div>
            </div>

            {/* Printable QR Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {tables.map((tableNum) => (
                <div
                  key={tableNum}
                  className="bg-cream text-espresso p-6 rounded-3xl border-2 border-caramel/40 shadow-xl flex flex-col items-center text-center space-y-4"
                >
                  <div className="border-b border-caramel/30 pb-3 w-full">
                    <h4 className="font-serif text-xl font-bold tracking-wider uppercase text-espresso">
                      {BRAND.name.toUpperCase()}
                    </h4>

                    <p className="text-[9px] uppercase tracking-[0.25em] text-caramel font-semibold">
                      {BRAND.standeeSub}
                    </p>
                  </div>

                  {/* Actual Scannable QR Code */}
                  <div className="p-3 bg-white rounded-2xl shadow-inner border border-caramel/20">
                    <img
                      src={getQrCodeUrl(tableNum)}
                      alt={`MOCHA Table ${tableNum} QR Code`}
                      className="w-32 h-32 object-contain"
                      loading="eager"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-widest text-caramel font-semibold">
                      Tabletop Standee
                    </span>

                    <h5 className="font-serif text-2xl font-bold">
                      Table {tableNum}
                    </h5>

                    <p className="text-[10px] text-espresso/60 max-w-[180px]">
                      Scan camera to view roast collection & place orders instantly.
                    </p>
                  </div>

                  <div className="w-full pt-2 border-t border-caramel/20 flex items-center justify-center gap-1.5 text-[9px] uppercase tracking-wider text-caramel font-bold">
                    <span>Complimentary High-Speed Wi-Fi</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
