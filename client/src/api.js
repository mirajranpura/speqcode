const BASE = 'http://localhost:4000/api';

export async function fetchProducts() {
  const res = await fetch(`${BASE}/products`);
  return res.json();
}

export async function fetchProduct(id) {
  const res = await fetch(`${BASE}/products/${id}`);
  return res.json();
}

export async function fetchCart() {
  const res = await fetch(`${BASE}/cart`);
  return res.json();
}

export async function addToCart(product_id, quantity = 1) {
  const res = await fetch(`${BASE}/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product_id, quantity }),
  });
  return res.json();
}

export async function updateCartItem(id, quantity) {
  const res = await fetch(`${BASE}/cart/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  });
  return res.json();
}

export async function deleteCartItem(id) {
  const res = await fetch(`${BASE}/cart/${id}`, { method: 'DELETE' });
  return res.json();
}
