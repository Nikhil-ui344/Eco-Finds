import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import ProductPage from './pages/ProductPage';
import CategoryPage from './pages/CategoryPage';
import Profile from './pages/Profile';
import SellProduct from './pages/SellProduct';
import { CartProvider } from './hooks/useCart';
import { UserProvider } from './hooks/useUser';
import './App.css';

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <Router>
          <div className="app">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/category/:categoryName" element={<CategoryPage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/sell" element={<SellProduct />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </UserProvider>
  );
}

export default App;
