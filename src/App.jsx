
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { SplashScreen } from "./components/SplashScreen.jsx";
import { Navbar } from "./components/Navbar.jsx";
import { Hero } from "./components/Hero.jsx";
import { MenuSection } from "./components/MenuSection.jsx";
import { CartDrawer } from "./components/CartDrawer.jsx";
import { MobileCartBar } from "./components/MobileCartBar.jsx";
import { TableGreetingModal } from "./components/TableGreetingModal.jsx";
import { CheckoutModal } from "./components/CheckoutModal.jsx";
import { OrderSuccessModal } from "./components/OrderSuccessModal.jsx";
import { AdminQrModal } from "./components/AdminQrModal.jsx";
import { ToastContainer } from "./components/ToastContainer.jsx";
import { BRAND } from "./data/brand.js";
import { getCategories } from "./services/categoryService.js";
import { getProducts } from "./services/productService.js";

export default function App() {
  const [showSplash, setShowSplash] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [vegOnly, setVegOnly] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [tableNumber, setTableNumber] = useState(7);
  const [customerPhone, setCustomerPhone] = useState("");

  // Cart: { itemId: quantity }
  const [cart, setCart] = useState({});
  const [isCartBouncing, setIsCartBouncing] = useState(false);

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isGreetingOpen, setIsGreetingOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");

  // Order Details
  const [orderData, setOrderData] = useState(null);

  // Toasts
  const [toasts, setToasts] = useState([]);

  // Ref for Cart Button
  const cartBtnRef = useRef(null);

  // Fetch active categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();

        if (response.success && Array.isArray(response.data)) {
          const activeCategories = response.data.filter(
            (category) => category.isActive,
          );

          setCategories(activeCategories);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();

    // System dark mode check
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }

    // Splash dismiss timer
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 1300);

    return () => clearTimeout(splashTimer);
  }, []);

  // Detect table number from QR code URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qrTableNumber = Number(params.get("table"));

    if (
      Number.isInteger(qrTableNumber) &&
      qrTableNumber >= 1 &&
      qrTableNumber <= 6
    ) {
      setTableNumber(qrTableNumber);
      setIsGreetingOpen(true);
    }
  }, []);

  // Fetch active products from backend
  const fetchProducts = useCallback(async () => {
    try {
      setProductsLoading(true);
      setProductsError("");

      const products = await getProducts();

      setMenuItems(products);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProductsError("Unable to load menu items. Please try again.");
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return next;
    });
  };

  // Toast Helpers
  const addToast = (message, type = "info", extra = {}) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = {
      id,
      message,
      type,
      ...extra,
    };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(
      () => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      },
      type === "undo" ? 4500 : 2500,
    );
  };

  const handleUndo = (toast) => {
    if (toast.itemId) {
      setCart((prev) => ({
        ...prev,
        [toast.itemId]: toast.count || 1,
      }));
      setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      addToast("Item restored to tray");
    }
  };

  // Flying Animation to Cart
  const triggerFlyToCart = (itemId) => {
    const imgElem = document.getElementById(`img-${itemId}`);
    const cartBtn = cartBtnRef.current;
    if (!imgElem || !cartBtn) return;

    const imgRect = imgElem.getBoundingClientRect();
    const cartRect = cartBtn.getBoundingClientRect();

    const flyClone = document.createElement("img");
    flyClone.src = imgElem.src;
    flyClone.className = "flying-proxy";
    flyClone.style.left = `${imgRect.left + imgRect.width / 2 - 25}px`;
    flyClone.style.top = `${imgRect.top + imgRect.height / 2 - 25}px`;
    flyClone.style.width = "50px";
    flyClone.style.height = "50px";
    document.body.appendChild(flyClone);

    requestAnimationFrame(() => {
      flyClone.style.left = `${cartRect.left + cartRect.width / 2 - 12}px`;
      flyClone.style.top = `${cartRect.top + cartRect.height / 2 - 12}px`;
      flyClone.style.width = "24px";
      flyClone.style.height = "24px";
      flyClone.style.opacity = "0.35";
    });

    setTimeout(() => {
      flyClone.remove();
      setIsCartBouncing(true);
      setTimeout(() => setIsCartBouncing(false), 250);
    }, 750);
  };

  // Cart Actions
  const handleAddToCart = (itemId, e) => {
    triggerFlyToCart(itemId);
    setCart((prev) => ({
      ...prev,
      [itemId]: 1,
    }));
    addToast("Item added to your tray");
  };

  const handleUpdateQty = (itemId, delta, e) => {
    if (delta > 0 && e) {
      triggerFlyToCart(itemId);
    }

    setCart((prev) => {
      const current = prev[itemId] || 0;
      const next = current + delta;
      const copy = { ...prev };

      if (next <= 0) {
        delete copy[itemId];
        const item = menuItems.find((m) => m.id === itemId);
        if (item) {
          addToast(`Removed ${item.name}`, "undo", {
            itemName: item.name,
            itemId,
            count: current,
          });
        }
      } else {
        copy[itemId] = next;
      }
      return copy;
    });
  };

  const handleRemoveItem = (itemId) => {
    const current = cart[itemId] || 1;
    const item = menuItems.find((m) => m.id === itemId);
    setCart((prev) => {
      const copy = { ...prev };
      delete copy[itemId];
      return copy;
    });
    if (item) {
      addToast(`Removed ${item.name}`, "undo", {
        itemName: item.name,
        itemId,
        count: current,
      });
    }
  };

  const handleResetFilters = () => {
    setActiveCategory("All");
    setVegOnly(false);
    setSearchQuery("");
    setSortBy("popular");
  };

  // Order Flow
  const handleGreetingContinue = (phone) => {
    setCustomerPhone(phone);
    setIsGreetingOpen(false);
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (order) => {
    setOrderData({
      ...order,
      table:
        order.orderType === "dinein"
          ? `Table ${order.tableNumber} (Dine-in)`
          : "Takeaway Counter",
    });

    setCart({});
    setIsCheckoutOpen(false);
    setIsSuccessOpen(true);
  };

  // Filter & Sort calculation
  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    let result = menuItems.filter((item) => {
      const matchesCategory =
        activeCategory === "All" || item.category?.name === activeCategory;

      const matchesVeg = !vegOnly || item.veg;
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);

      return matchesCategory && matchesVeg && matchesSearch;
    });

    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      result.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
    }

    return result;
  }, [menuItems, activeCategory, vegOnly, searchQuery, sortBy]);

  const totalCartCount = useMemo(() => {
    return Object.values(cart).reduce((sum, q) => sum + q, 0);
  }, [cart]);

  const grandTotal = useMemo(() => {
    const sub = Object.entries(cart).reduce((acc, [id, qty]) => {
      const item = menuItems.find((m) => m.id === id);
      return acc + (item ? item.price * qty : 0);
    }, 0);
    const tax = Math.round(sub * 0.05);
    return sub + tax;
  }, [cart, menuItems]);

  return (
    <div className="min-h-screen text-espresso dark:text-cream bg-cream-light dark:bg-espresso-dark transition-colors duration-500 font-sans relative selection:bg-caramel selection:text-white w-full max-w-full overflow-x-hidden">
      {/* Subtle Grain Canvas Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 grain-overlay overflow-hidden"></div>

      {/* Splash Screen */}
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onUndo={handleUndo} />

      {/* Sticky Blurred Navbar */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isDark={isDark}
        toggleTheme={toggleTheme}
        cartCount={totalCartCount}
        openCart={() => setIsCartOpen(true)}
        openAdminModal={() => setIsAdminOpen(true)}
        cartBtnRef={cartBtnRef}
        isCartBouncing={isCartBouncing}
      />

      {/* Hero Section */}
      <main>
        <Hero onSimulateQr={() => setIsGreetingOpen(true)} />

        {/* Menu Section with Loading / Error / Success States */}
        {productsLoading ? (
          <section
            className="py-24 text-center"
            aria-live="polite"
          >
            <div className="w-10 h-10 mx-auto mb-4 border-4 border-caramel/30 border-t-caramel rounded-full animate-spin"></div>

            <p className="text-sm font-medium text-espresso/70 dark:text-cream/70">
              Preparing your menu...
            </p>
          </section>
        ) : productsError ? (
          <section
            className="py-24 px-4 text-center"
            aria-live="assertive"
          >
            <h3 className="font-serif text-2xl font-semibold text-espresso dark:text-cream mb-3">
              Menu unavailable
            </h3>

            <p className="text-sm text-espresso/60 dark:text-cream/60 mb-6">
              {productsError}
            </p>

            <button
              onClick={fetchProducts}
              className="px-6 py-2.5 rounded-full bg-caramel text-espresso font-semibold text-xs uppercase tracking-wider hover:bg-caramel-dark transition-colors cursor-pointer"
            >
              Try Again
            </button>
          </section>
        ) : (
          <MenuSection
            categories={categories}
            items={filteredItems}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            vegOnly={vegOnly}
            setVegOnly={setVegOnly}
            sortBy={sortBy}
            setSortBy={setSortBy}
            cart={cart}
            onAdd={handleAddToCart}
            onUpdateQty={handleUpdateQty}
            onResetFilters={handleResetFilters}
          />
        )}
      </main>

      {/* Luxury Café Footer */}
      <footer className="border-t border-caramel/20 py-12 px-4 sm:px-6 lg:px-8 mt-20 bg-cream/40 dark:bg-espresso-card/40 w-full max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-caramel to-caramel-dark flex items-center justify-center text-espresso shadow-md shadow-caramel/25">
              <svg
                className="w-5 h-5"
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
              <span className="font-serif text-xl font-bold block text-espresso dark:text-cream">
                {BRAND.footerTitle}
              </span>
              <p className="text-[11px] text-caramel uppercase tracking-[0.2em] font-medium">
                {BRAND.footerSub}
              </p>
            </div>
          </div>

          <div className="text-xs text-espresso/60 dark:text-cream/60 space-y-1">
            <p>Open Daily • 07:00 AM – 11:00 PM</p>
            <p>Table QR ordering enabled • Zero app downloads required</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAdminOpen(true)}
              className="text-xs text-caramel font-semibold px-4 py-2 rounded-full border border-caramel/30 hover:bg-caramel/10 transition-colors cursor-pointer"
            >
              Print Table QRs
            </button>
            <button
              onClick={() => setIsGreetingOpen(true)}
              className="text-xs text-espresso/70 dark:text-cream/70 hover:text-caramel transition-colors cursor-pointer"
            >
              Simulate Table 7
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Mobile Cart Bar */}
      <MobileCartBar
        cartCount={totalCartCount}
        grandTotal={grandTotal}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        menuItems={menuItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={handleProceedToCheckout}
        tableNumber={tableNumber}
      />

      {/* Table Greeting Modal */}
      <TableGreetingModal
        isOpen={isGreetingOpen}
        onClose={() => setIsGreetingOpen(false)}
        onContinue={handleGreetingContinue}
        tableNumber={tableNumber}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        menuItems={menuItems}
        onOrderSuccess={handleOrderSuccess}
        tableNumber={tableNumber}
        customerPhone={customerPhone}
      />

      {/* Order Success Modal */}
      <OrderSuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        orderData={orderData}
      />

      {/* Admin QR Standees Modal */}
      <AdminQrModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}
