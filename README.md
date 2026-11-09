# MOCHA • Luxury Artisan Café & Roasters

An artisan café and roastery web application built with **React JS (JSX)**, **Vite**, **Framer Motion**, and **Tailwind CSS**.

---

## 🛠 Tech Stack

- **Framework**: [React 19](https://react.dev/) (`.jsx` components)
- **Bundler & Dev Server**: [Vite 8](https://vitejs.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) (spring animations, exit transitions, 3D card tilts, sliding category pills, fly-to-cart proxy)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with custom `@theme` tokens and glassmorphism

---

## 🚀 How to Run Locally

### Prerequisites
Make sure you have **Node.js** (version 18 or higher) installed on your system.
You can check by running in your terminal:
```bash
node -v
npm -v
```

### Step 1: Extract the Project
Extract the downloaded ZIP file to a folder of your choice on your computer.

### Step 2: Open Terminal in the Project Folder
Open your terminal (Terminal on macOS/Linux, Command Prompt or PowerShell on Windows) and navigate to the project directory:
```bash
cd path/to/extracted-folder
```

### Step 3: Install Dependencies
Run the following command to install all required packages:
```bash
npm install
```
*(Note: If your local npm environment ever flags peer dependency warnings, you can also run `npm install --legacy-peer-deps`)*

### Step 4: Start the Development Server
Run the dev server:
```bash
npm run dev
```

### Step 5: Open in Your Browser
Once the dev server starts, open your browser and navigate to:
```
http://localhost:3000
```

---

## 📦 Building for Production

To create an optimized production build:
```bash
npm run build
```
To preview the production build locally:
```bash
npm run preview
```

---

## 📂 Project Structure

```
├── index.html               # Main HTML entry with Google Fonts (Playfair Display & Inter)
├── package.json             # Dependencies and scripts
├── vite.config.ts           # Vite configuration with React and Tailwind plugins
└── src/
    ├── main.jsx             # React application entry point
    ├── App.jsx              # Main app orchestrator (state, modals, theme, cart)
    ├── index.css            # Tailwind theme tokens, animations, and glass styles
    ├── data/
    │   ├── brand.js         # Centralized café branding (name, tagline, tokens)
    │   └── menu.js          # Curated menu delicacies (prices, categories, images)
    └── components/
        ├── Navbar.jsx              # Sticky blurred navbar with search, theme toggle & cart badge
        ├── Hero.jsx                # Luxury hero with floating coffee beans & 3D tilt Cortado card
        ├── MenuSection.jsx         # Category pills with sliding indicator, veg toggle & sort
        ├── MenuItemCard.jsx        # Cards with 3D tilt, veg badge, and morphing Add/stepper button
        ├── CartDrawer.jsx          # Slide-in tray drawer with GST calculation & item adjustments
        ├── MobileCartBar.jsx       # Floating mobile cart bar
        ├── TableGreetingModal.jsx  # Table QR verification modal with chef recommendations
        ├── CheckoutModal.jsx       # Table-side checkout form with validation
        ├── OrderSuccessModal.jsx   # Order confirmation with confetti & animated checkmark
        ├── AdminQrModal.jsx        # Printable table QR standee generator (Tables 1-6)
        ├── ToastContainer.jsx      # Slide-in toast alerts with undo functionality
        └── SplashScreen.jsx        # Animated rising steam intro emblem
```
