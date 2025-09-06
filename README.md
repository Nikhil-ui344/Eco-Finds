# EcoFinds Second-Hand - Sustainable Shopping Platform

A sleek, modern second-hand marketplace built with React, featuring a beautiful black & white minimalist design with smooth animations. Shop pre-loved items and give them a new life while saving money and helping the environment.

## ✨ Features

### � Second-Hand Focus
- **Sustainable shopping** with pre-owned and refurbished items
- **Condition indicators** (Excellent, Very Good, Good, Fair)
- **Price comparisons** showing original vs. current prices
- **Seller information** with location and item history
- **Environmental impact** messaging throughout

### �🎨 Design & UI
- **Black & White minimalist theme** with gradients and shadows
- **Smooth animations** using CSS transitions and keyframes
- **Fully responsive** design (desktop, tablet, mobile)
- **Clean typography** using Inter font from Google Fonts
- **Elegant hover effects** and interactive elements

### 🏪 Landing Page
- **Sticky header** with dynamic cart counter and profile icon
- **Smart search bar** for finding second-hand treasures
- **Interactive banner carousel** promoting sustainable shopping
- **Category grid** showcasing pre-loved items by type
- **Advanced filtering** by condition, price, category, and rating
- **User dashboard link** with animated underline hover

### 📦 Product Page
- **Detailed condition information** and seller details
- **Price comparison** with original retail prices and savings
- **Item history** showing years of use and seller location
- **Image carousel** with multiple product photos
- **Add to cart functionality** with ripple animations
- **Responsive layout** optimized for all devices

### 🛒 Shopping Features
- **Real-time cart management** with context API
- **Dynamic cart counter** in header
- **Advanced search and filtering** by category, condition, price, rating
- **Smart sorting** by name, price, condition, rating, newest listings
- **Flexible grouping** by category, condition, price range, rating
- **Graceful "no results" handling** with clear messaging

### 📱 Responsive Design
- **Mobile-first approach** with breakpoints at 768px and 480px
- **Touch-friendly interactions** for mobile devices
- **Optimized layouts** for different screen sizes
- **Accessible design** with proper focus states and ARIA labels

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd eco-finds
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Header.jsx       # Navigation header with cart
│   ├── SearchBar.jsx    # Search and filter controls
│   ├── Banner.jsx       # Hero banner carousel
│   ├── CategoryCard.jsx # Category display cards
│   └── ProductCard.jsx  # Product display cards
├── pages/               # Page components
│   ├── LandingPage.jsx  # Main product listing page
│   └── ProductPage.jsx  # Individual product details
├── hooks/               # Custom React hooks
│   └── useCart.jsx      # Shopping cart state management
├── data/                # Mock data and utilities
│   └── mockData.js      # Sample products and categories
├── App.jsx              # Main app component with routing
├── App.css              # Global styles and CSS variables
└── index.css            # Base styles and resets
```

## 🎨 Styling Architecture

### CSS Modules
- Scoped component styles using `.module.css` files
- Prevents style conflicts and improves maintainability

### CSS Variables
- Consistent color palette and design tokens
- Easy theme customization and maintenance

### Animation System
- CSS keyframes for entrance animations
- Smooth hover effects and transitions
- Performance-optimized animations

## 🛠️ Technology Stack

- **React 18** - Modern React with hooks and functional components
- **React Router** - Client-side routing for SPA navigation
- **Vite** - Fast development server and build tool
- **CSS Modules** - Scoped styling solution
- **Context API** - State management for shopping cart

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Future Enhancements

- [ ] User authentication and seller profiles
- [ ] Shopping cart persistence
- [ ] Messaging system between buyers and sellers
- [ ] Item condition verification system
- [ ] Wishlist functionality
- [ ] Advanced filtering (brand, size, age, etc.)
- [ ] Seller ratings and reviews
- [ ] Local pickup and delivery options
- [ ] Environmental impact tracking
- [ ] Admin dashboard for marketplace management
- [ ] Mobile app development
- [ ] Integration with shipping services

## 🌱 Environmental Impact

EcoFinds promotes sustainable consumption by:
- **Extending product lifecycles** through second-hand sales
- **Reducing waste** by keeping items out of landfills
- **Saving resources** by avoiding new product manufacturing
- **Building community** around sustainable practices
- **Educating users** about environmental benefits

---

Built with ❤️ for the planet using React and modern web technologies.+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
