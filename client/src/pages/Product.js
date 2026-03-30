import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProduct, addToCart } from '../api';

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProduct(id).then(setProduct);
  }, [id]);

  const handleAdd = async () => {
    await addToCart(product.id, quantity);
    setMessage(`Added ${quantity} × ${product.name} to cart`);
    setTimeout(() => setMessage(''), 2500);
  };

  if (!product) return <p>Loading...</p>;

  const stars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

  return (
    <>
      <Link to="/" className="back-link">← Back to products</Link>
      {message && <div className="message">{message}</div>}
      <div className="product-detail">
        <div className="emoji-large">{product.emoji}</div>
        <h1>{product.name}</h1>
        <div className="price">${product.price.toFixed(2)}</div>
        <p className="description">{product.description}</p>
        <div className="quantity-row">
          <label htmlFor="qty">Quantity:</label>
          <input id="qty" type="number" min="1" value={quantity}
            onChange={(e) => setQuantity(Math.max(1, +e.target.value))} />
          <button className="btn btn-primary" onClick={handleAdd}>Add to Cart</button>
        </div>
      </div>

      {product.reviews && product.reviews.length > 0 && (
        <div className="reviews">
          <h2>Customer Reviews ({product.reviews.length})</h2>
          {product.reviews.map((r) => (
            <div className="review-card" key={r.id}>
              <div className="review-header">
                <span className="review-author">{r.author}</span>
                <span className="review-stars">{stars(r.rating)}</span>
              </div>
              <p className="review-comment">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
