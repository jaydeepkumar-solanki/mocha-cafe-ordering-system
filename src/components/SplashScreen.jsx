import React from 'react';
import { motion } from 'framer-motion';
import { BRAND } from '../data/brand.js';

export const SplashScreen = ({ onComplete }) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      onClick={onComplete}
      className="fixed inset-0 z-[100] bg-espresso flex flex-col items-center justify-center pointer-events-auto cursor-pointer"
    >
      <div className="relative w-32 h-32 flex items-center justify-center mb-6">
        {/* Rising Steam SVG paths */}
        <svg className="absolute -top-10 w-16 h-16 pointer-events-none overflow-visible" viewBox="0 0 50 60">
          <path className="steam-1 stroke-caramel fill-none stroke-[2.5] stroke-linecap-round" d="M12,45 Q6,30 18,15 T10,2" />
          <path className="steam-2 stroke-caramel-light fill-none stroke-[2.5] stroke-linecap-round" d="M25,48 Q32,32 20,18 T28,4" />
          <path className="steam-3 stroke-caramel fill-none stroke-[2.5] stroke-linecap-round" d="M38,45 Q32,28 42,16 T36,2" />
        </svg>

        {/* Coffee Cup Vector */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <svg
            className="w-24 h-24 text-caramel drop-shadow-[0_10px_20px_rgba(200,161,90,0.3)]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 8h1a4 4 0 1 1 0 8h-1"></path>
            <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path>
            <line x1="6" y1="2" x2="6" y2="4"></line>
            <line x1="10" y1="2" x2="10" y2="4"></line>
            <line x1="14" y1="2" x2="14" y2="4"></line>
          </svg>
        </motion.div>
      </div>

      <motion.h1
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="font-serif text-3xl md:text-4xl tracking-widest text-cream uppercase font-medium text-center px-4"
      >
        {BRAND.name}
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex items-center gap-2 mt-2"
      >
        <span className="h-[1px] w-6 bg-caramel"></span>
        <p className="text-xs tracking-[0.3em] uppercase text-caramel">Artisan Roastery</p>
        <span className="h-[1px] w-6 bg-caramel"></span>
      </motion.div>
    </motion.div>
  );
};
