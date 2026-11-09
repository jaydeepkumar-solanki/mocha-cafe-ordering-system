import React from 'react';
import { motion } from 'framer-motion';

export const Hero = ({ onSimulateQr }) => {
  return (
    <section className="relative min-h-[82vh] flex items-center overflow-hidden py-12 lg:py-20 w-full max-w-full">
      {/* Floating Background Beans / Ambient Particles */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-1/4 left-8 text-caramel/20 animate-float">
          <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
            <ellipse cx="12" cy="12" rx="9" ry="6" transform="rotate(-35 12 12)" />
          </svg>
        </div>
        <div className="absolute bottom-1/3 right-12 text-caramel/15 animate-float-delayed">
          <svg className="w-16 h-16" viewBox="0 0 24 24" fill="currentColor">
            <ellipse cx="12" cy="12" rx="9" ry="6" transform="rotate(45 12 12)" />
          </svg>
        </div>
        <div className="absolute top-2/3 left-1/3 text-sage/20 animate-float">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="5" />
          </svg>
        </div>
      </div>

      {/* Background Gradient Glows */}
      <div className="absolute -top-32 right-1/4 w-96 h-96 bg-gradient-to-tr from-caramel/25 to-sage/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 -left-20 w-80 h-80 bg-gradient-to-br from-espresso/15 dark:from-caramel/10 to-transparent rounded-full blur-2xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Hero Text */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-caramel/15 border border-caramel/30 text-caramel text-xs tracking-widest uppercase font-semibold">
              <span className="w-2 h-2 rounded-full bg-caramel animate-ping"></span>
              Fresh Micro-Lot Harvests
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-espresso dark:text-cream leading-[1.15]">
              <span className="block transform transition-all duration-700 hover:translate-x-1">
                Where Slow Roasts
              </span>
              <span className="block italic text-caramel font-normal transform transition-all duration-700 delay-100 hover:translate-x-1">
                Meet Warm Luxury.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-espresso/80 dark:text-cream/80 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Curated single-origin brews, delicate viennoiserie baked at dawn, and table-side hospitality crafted for conversation. Scan your table QR, curate your feast, and unwind.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#menuSection"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-caramel hover:bg-caramel-dark text-espresso font-semibold text-sm tracking-wide shadow-warm-glow press-spring flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Explore The Menu</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M19 14l-7 7m0 0l-7-7m7 7V3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>

              <button
                onClick={onSimulateQr}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full border border-caramel/40 text-caramel hover:bg-caramel/10 text-sm font-medium press-spring flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
                <span>Simulate Table 7 QR</span>
              </button>
            </div>
          </motion.div>

          {/* Hero Showcase Card (Fixed/Calm without mouse-tracking tilt) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="lg:col-span-5 relative flex justify-center"
          >
            <div className="relative w-full max-w-md">
              {/* Glow Backing */}
              <div className="absolute inset-0 bg-gradient-to-tr from-caramel/35 to-sage/25 rounded-3xl blur-2xl transform rotate-2 scale-95 opacity-70 pointer-events-none"></div>

              <div className="relative glass-light dark:glass-dark rounded-3xl p-4 shadow-card-hover border border-white/50 dark:border-caramel/25 overflow-hidden">
                <div className="relative h-80 rounded-2xl overflow-hidden bg-espresso/5">
                  <img
                    src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80"
                    alt="MOCHA Signature Velvet Brew"
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                  <span className="absolute top-3 right-3 px-3 py-1 bg-espresso/85 text-caramel text-xs tracking-wider font-semibold rounded-full backdrop-blur-md border border-caramel/30 uppercase">
                    Chef's Roast
                  </span>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-espresso dark:text-cream">
                      Saffron Honey Cortado
                    </h3>
                    <p className="text-xs text-espresso/60 dark:text-cream/60">
                      Double ristretto, wildflower saffron honey & velvety microfoam
                    </p>
                  </div>
                  <span className="font-serif font-bold text-xl text-caramel">₹310</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
