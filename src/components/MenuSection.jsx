import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MenuItemCard } from './MenuItemCard';

export const MenuSection = ({
  categories = [],
  items,
  activeCategory,
  setActiveCategory,
  vegOnly,
  setVegOnly,
  sortBy,
  setSortBy,
  cart,
  onAdd,
  onUpdateQty,
  onResetFilters,
}) => {
  return (
    <section id="menuSection" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20 w-full overflow-hidden">
      {/* Header & Live Filter Bar */}
      <div className="space-y-8 mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-caramel font-semibold block mb-1">
              Our Offerings
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso dark:text-cream">
              The Culinary Collection
            </h2>
          </div>
          <p id="resultCountBadge" className="text-xs sm:text-sm text-espresso/60 dark:text-cream/60 font-medium">
            Showing {items.length} curated {items.length === 1 ? 'delicacy' : 'delicacies'}
          </p>
        </div>

        {/* Category Filter Pills + Secondary Controls Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Horizontally Scrolling Category Pills with Sliding Indicator */}
          <div className="relative overflow-x-auto no-scrollbar py-1">
            <div className="flex items-center gap-2 relative bg-espresso/5 dark:bg-espresso/40 p-1.5 rounded-full border border-caramel/20 w-max">
              {['All', ...categories.map((category) => category.name)].map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`relative px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition-colors duration-200 z-10 press-spring cursor-pointer ${
                      isActive
                        ? 'text-espresso font-bold'
                        : 'text-espresso/70 dark:text-cream/70 hover:text-caramel'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeCategoryPill"
                        className="absolute inset-0 bg-caramel rounded-full shadow-md shadow-caramel/25 -z-10"
                        transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                      />
                    )}
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filters (Veg Only & Sorting) */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            {/* Veg Only Toggle */}
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold uppercase tracking-wider select-none bg-espresso/5 dark:bg-espresso/40 px-3.5 py-2 rounded-full border border-caramel/20 hover:border-caramel/40 transition-colors">
              <input
                type="checkbox"
                checked={vegOnly}
                onChange={(e) => setVegOnly(e.target.checked)}
                className="sr-only peer"
              />
              <span className="w-3.5 h-3.5 rounded-full border-2 border-sage flex items-center justify-center p-0.5">
                <span
                  className={`w-2 h-2 rounded-full bg-sage transition-transform ${
                    vegOnly ? 'scale-100' : 'scale-0'
                  }`}
                ></span>
              </span>
              <span
                className={`font-medium ${
                  vegOnly ? 'text-sage' : 'text-espresso/80 dark:text-cream/80'
                }`}
              >
                Pure Veg
              </span>
            </label>

            {/* Price / Popularity Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort items"
                className="appearance-none bg-espresso/5 dark:bg-espresso/40 border border-caramel/20 text-xs font-medium uppercase tracking-wider text-espresso dark:text-cream py-2 pl-4 pr-9 rounded-full focus:outline-none focus:ring-2 focus:ring-caramel transition-colors cursor-pointer"
              >
                <option value="popular" className="bg-cream-light dark:bg-espresso text-espresso dark:text-cream">
                  Most Popular
                </option>
                <option value="price-asc" className="bg-cream-light dark:bg-espresso text-espresso dark:text-cream">
                  Price: Low to High
                </option>
                <option value="price-desc" className="bg-cream-light dark:bg-espresso text-espresso dark:text-cream">
                  Price: High to Low
                </option>
                <option value="rating" className="bg-cream-light dark:bg-espresso text-espresso dark:text-cream">
                  Highest Rated
                </option>
              </select>
              <svg
                className="w-3.5 h-3.5 text-caramel absolute right-3.5 top-3 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items Grid */}
      {items.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-300"
        >
          <AnimatePresence>
            {items.map((item, index) => (
              <MenuItemCard
                key={item.id}
                item={item}
                quantity={cart[item.id] || 0}
                onAdd={onAdd}
                onUpdateQty={onUpdateQty}
                index={index}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* Empty State Illustration */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-caramel/10 flex items-center justify-center text-caramel">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"
                strokeWidth="1.8"
                strokeLinecap="round"
              ></path>
            </svg>
          </div>
          <h3 className="font-serif text-2xl font-semibold mb-2 text-espresso dark:text-cream">
            No delicacies found
          </h3>
          <p className="text-sm text-espresso/60 dark:text-cream/60 max-w-sm mx-auto mb-6">
            We couldn't find matches for this selection. Try clearing filters or exploring our artisan roasts.
          </p>
          <button
            onClick={onResetFilters}
            className="px-6 py-2.5 rounded-full bg-caramel text-espresso font-semibold text-xs tracking-wider uppercase press-spring hover:bg-caramel-dark cursor-pointer transition-colors"
          >
            Reset Filters
          </button>
        </motion.div>
      )}
    </section>
  );
};
