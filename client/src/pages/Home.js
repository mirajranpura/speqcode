import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../api';

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  return (
    <>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>All Products</h1>
      <div className="product-grid">
        {products.map((p) => (
          <Link to={`/product/${p.id}`} className="product-card" key={p.id}>
            <div className="product-emoji">{p.emoji}</div>
            <div className="product-name">{p.name}</div>
            <div className="product-price">${p.price.toFixed(2)}</div>
            <div className="product-category">{p.category}</div>
          </Link>
        ))}
      </div>
    </>
  );
}
