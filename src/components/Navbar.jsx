import React from 'react';
import { motion } from 'framer-motion';
import { BRAND } from '../data/brand.js';

export const Navbar = ({
  searchQuery,
  setSearchQuery,
  isDark,
  toggleTheme,
  cartCount,
  openCart,
  openAdminModal,
  cartBtnRef,
  isCartBouncing,
}) => {
  return (
    <header className="sticky top-0 z-40 transition-all duration-300 backdrop-blur-xl bg-cream-light/85 dark:bg-espresso-dark/85 border-b border-caramel/15 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Café Brand Logo */}
        <a
          href="#"
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-caramel rounded-xl p-1"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-caramel to-caramel-dark flex items-center justify-center text-espresso shadow-md shadow-caramel/25 group-hover:rotate-6 transition-transform duration-300">
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
              <line x1="6" y1="1" x2="6" y2="4"></line>
              <line x1="10" y1="1" x2="10" y2="4"></line>
              <line x1="14" y1="1" x2="14" y2="4"></line>
            </svg>
          </div>
          <div>
            <span className="font-serif text-2xl font-semibold tracking-wide block leading-none text-espresso dark:text-cream">
              {BRAND.name}
            </span>
            <span className="text-[10px] tracking-[0.25em] text-caramel uppercase font-medium">
              {BRAND.badge}
            </span>
          </div>
        </a>

        {/* Quick Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search our roasts, brews & pastries..."
              className="w-full pl-11 pr-9 py-2.5 rounded-full text-sm bg-cream/70 dark:bg-espresso/80 border border-caramel/30 focus:border-caramel focus:ring-2 focus:ring-caramel/30 focus:outline-none transition-all duration-300 text-espresso dark:text-cream placeholder-espresso/50 dark:placeholder-cream/40"
            />
            <svg
              className="w-4 h-4 text-caramel absolute left-4 top-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" strokeWidth="2" strokeLinecap="round"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" strokeLinecap="round"></line>
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3 text-espresso/40 dark:text-cream/40 hover:text-caramel transition-colors cursor-pointer"
                title="Clear search"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round"></path>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Right Actions: Admin View, Theme Toggle, Cart */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Admin QR standees trigger */}
          <button
            onClick={openAdminModal}
            title="Printable Table QR Standees"
            className="p-2.5 rounded-full hover:bg-caramel/15 text-caramel transition-colors focus:ring-2 focus:ring-caramel focus:outline-none flex items-center gap-1.5 text-xs font-medium cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="3" width="7" height="7" strokeWidth="2" rx="1"></rect>
              <rect x="14" y="3" width="7" height="7" strokeWidth="2" rx="1"></rect>
              <rect x="3" y="14" width="7" height="7" strokeWidth="2" rx="1"></rect>
              <path strokeWidth="2" strokeLinecap="round" d="M14 14h3v3h-3zM17 17h4v4h-4zM14 20h3"></path>
            </svg>
            <span className="hidden lg:inline">Table QRs</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme Mode"
            className="p-2.5 rounded-full hover:bg-caramel/15 text-caramel transition-colors focus:ring-2 focus:ring-caramel focus:outline-none cursor-pointer"
          >
            {isDark ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5" strokeWidth="2"></circle>
                <line x1="12" y1="1" x2="12" y2="3" strokeWidth="2" strokeLinecap="round"></line>
                <line x1="12" y1="21" x2="12" y2="23" strokeWidth="2" strokeLinecap="round"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" strokeWidth="2" strokeLinecap="round"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" strokeWidth="2" strokeLinecap="round"></line>
                <line x1="1" y1="12" x2="3" y2="12" strokeWidth="2" strokeLinecap="round"></line>
                <line x1="21" y1="12" x2="23" y2="12" strokeWidth="2" strokeLinecap="round"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" strokeWidth="2" strokeLinecap="round"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" strokeWidth="2" strokeLinecap="round"></line>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            )}
          </button>

          {/* Cart Trigger Button */}
          <button
            ref={cartBtnRef}
            onClick={openCart}
            aria-label="View Cart"
            className="relative p-2.5 rounded-full bg-caramel/15 hover:bg-caramel/25 text-caramel transition-all focus:ring-2 focus:ring-caramel focus:outline-none press-spring flex items-center justify-center cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"></path>
              <line x1="3" y1="6" x2="21" y2="6" strokeWidth="1.8"></line>
              <path d="M16 10a4 4 0 0 1-8 0" strokeWidth="1.8" strokeLinecap="round"></path>
            </svg>

            {/* Live item counter badge */}
            <motion.span
              animate={{
                scale: cartCount > 0 ? (isCartBouncing ? 1.35 : 1) : 0,
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="absolute -top-1.5 -right-1.5 bg-caramel text-espresso dark:text-espresso-dark font-bold text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md font-sans pointer-events-none"
            >
              {cartCount}
            </motion.span>
          </button>
        </div>
      </div>
    </header>
  );
};
