import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCart, updateCartItem, deleteCartItem } from '../api';

export default function Cart() {
  const [items, setItems] = useState([]);

  const load = () => fetchCart().then(setItems);
  useEffect(() => { load(); }, []);

  const handleUpdate = async (id, qty) => {
    if (qty < 1) return;
    await updateCartItem(id, qty);
    load();
  };

  const handleDelete = async (id) => {
    await deleteCartItem(id);
    load();
  };

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <p style={{ fontSize: '3rem' }}>🛒</p>
        <p>Your cart is empty.</p>
        <Link to="/" className="back-link" style={{ marginTop: '1rem' }}>Browse products</Link>
      </div>
    );
  }

  return (
    <>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Shopping Cart</h1>
      {items.map((item) => (
        <div className="cart-item" key={item.id}>
          <span className="emoji">{item.emoji}</span>
          <div className="info">
            <h3><Link to={`/product/${item.product_id}`}>{item.name}</Link></h3>
            <span className="price">${item.price.toFixed(2)}</span>
          </div>
          <div className="actions">
            <button className="btn btn-sm btn-primary"
              onClick={() => handleUpdate(item.id, item.quantity - 1)}>−</button>
            <input type="number" min="1" value={item.quantity}
              onChange={(e) => handleUpdate(item.id, +e.target.value)} />
            <button className="btn btn-sm btn-primary"
              onClick={() => handleUpdate(item.id, item.quantity + 1)}>+</button>
            <button className="btn btn-sm btn-danger"
              onClick={() => handleDelete(item.id)}>Delete</button>
          </div>
        </div>
      ))}
      <div className="cart-summary">
        <span className="total">Total: ${total.toFixed(2)}</span>
        <button className="btn btn-primary">Checkout</button>
      </div>
    </>
  );
}
