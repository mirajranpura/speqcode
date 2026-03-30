const express = require('express');
const cors = require('cors');
const db = require('./db');

// Seed database on first run
require('./seed');

const app = express();
app.use(cors());
app.use(express.json());

// --- Products ---
app.get('/api/products', (req, res) => {
  const products = db.prepare('SELECT * FROM products').all();
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  const reviews = db.prepare('SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC').all(req.params.id);
  res.json({ ...product, reviews });
});

// --- Cart ---
app.get('/api/cart', (req, res) => {
  const items = db.prepare(`
    SELECT c.id, c.quantity, p.id as product_id, p.name, p.emoji, p.price
    FROM cart_items c JOIN products p ON c.product_id = p.id
  `).all();
  res.json(items);
});

app.post('/api/cart', (req, res) => {
  const { product_id, quantity = 1 } = req.body;
  if (!product_id) return res.status(400).json({ error: 'product_id required' });
  const product = db.prepare('SELECT id FROM products WHERE id = ?').get(product_id);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const existing = db.prepare('SELECT * FROM cart_items WHERE product_id = ?').get(product_id);
  if (existing) {
    db.prepare('UPDATE cart_items SET quantity = quantity + ? WHERE product_id = ?').run(quantity, product_id);
  } else {
    db.prepare('INSERT INTO cart_items (product_id, quantity) VALUES (?, ?)').run(product_id, quantity);
  }
  res.json({ success: true });
});

app.put('/api/cart/:id', (req, res) => {
  const { quantity } = req.body;
  if (!quantity || quantity < 1) return res.status(400).json({ error: 'quantity must be >= 1' });
  const result = db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(quantity, req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Cart item not found' });
  res.json({ success: true });
});

app.delete('/api/cart/:id', (req, res) => {
  const result = db.prepare('DELETE FROM cart_items WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Cart item not found' });
  res.json({ success: true });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
