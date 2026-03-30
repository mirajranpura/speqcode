import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Product from './pages/Product';
import Cart from './pages/Cart';
import ChatWidget from './components/ChatWidget';
import './App.css';

export default function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <Link to="/" className="nav-brand">🛍️ Emoji Shop</Link>
        <Link to="/cart" className="nav-cart">🛒 Cart</Link>
      </nav>
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </main>
      <ChatWidget />
    </div>
  );
}
