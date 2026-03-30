const db = require('./db');

const products = [
  { name: 'Wireless Headphones', emoji: '🎧', description: 'Premium noise-cancelling wireless headphones with 30-hour battery life.', price: 79.99, category: 'Electronics' },
  { name: 'Running Shoes', emoji: '👟', description: 'Lightweight breathable running shoes with cushioned sole.', price: 59.99, category: 'Sports' },
  { name: 'Coffee Maker', emoji: '☕', description: 'Programmable drip coffee maker with thermal carafe.', price: 49.99, category: 'Kitchen' },
  { name: 'Backpack', emoji: '🎒', description: 'Water-resistant laptop backpack with USB charging port.', price: 39.99, category: 'Accessories' },
  { name: 'Sunglasses', emoji: '🕶️', description: 'Polarized UV400 sunglasses with lightweight titanium frame.', price: 29.99, category: 'Accessories' },
  { name: 'Smartphone', emoji: '📱', description: 'Latest 5G smartphone with 128GB storage and OLED display.', price: 699.99, category: 'Electronics' },
  { name: 'Yoga Mat', emoji: '🧘', description: 'Non-slip eco-friendly yoga mat, 6mm thick.', price: 24.99, category: 'Sports' },
  { name: 'Desk Lamp', emoji: '💡', description: 'LED desk lamp with adjustable brightness and color temperature.', price: 34.99, category: 'Home' },
  { name: 'Water Bottle', emoji: '🧴', description: 'Insulated stainless steel water bottle, keeps drinks cold 24hrs.', price: 19.99, category: 'Sports' },
  { name: 'Notebook', emoji: '📓', description: 'Premium hardcover lined notebook, 200 pages.', price: 12.99, category: 'Office' },
  { name: 'Mechanical Keyboard', emoji: '⌨️', description: 'RGB mechanical keyboard with Cherry MX switches.', price: 89.99, category: 'Electronics' },
  { name: 'Plant Pot', emoji: '🪴', description: 'Ceramic self-watering plant pot with drainage tray.', price: 15.99, category: 'Home' },
  { name: 'Wrist Watch', emoji: '⌚', description: 'Classic analog watch with leather strap and sapphire crystal.', price: 149.99, category: 'Accessories' },
  { name: 'Board Game', emoji: '🎲', description: 'Strategy board game for 2-6 players, ages 10+.', price: 34.99, category: 'Toys' },
  { name: 'Candle Set', emoji: '🕯️', description: 'Set of 3 soy wax scented candles, 40-hour burn time each.', price: 22.99, category: 'Home' },
  { name: 'Guitar Picks', emoji: '🎸', description: 'Variety pack of 20 guitar picks in different thicknesses.', price: 8.99, category: 'Music' },
  { name: 'Cooking Pan', emoji: '🍳', description: 'Non-stick ceramic frying pan, 12-inch, oven safe.', price: 44.99, category: 'Kitchen' },
  { name: 'Telescope', emoji: '🔭', description: 'Portable refractor telescope with tripod, 70mm aperture.', price: 129.99, category: 'Electronics' },
  { name: 'Art Supplies', emoji: '🎨', description: 'Complete acrylic painting set with 24 colors and brushes.', price: 27.99, category: 'Art' },
  { name: 'Soccer Ball', emoji: '⚽', description: 'Official size 5 match soccer ball, hand-stitched.', price: 29.99, category: 'Sports' },
];

const reviews = [
  { product_id: 1, author: 'Alice', rating: 5, comment: 'Amazing sound quality and super comfortable!' },
  { product_id: 1, author: 'Bob', rating: 4, comment: 'Great headphones, battery lasts forever.' },
  { product_id: 2, author: 'Charlie', rating: 5, comment: 'Best running shoes I have ever owned.' },
  { product_id: 2, author: 'Diana', rating: 4, comment: 'Very comfortable for long runs.' },
  { product_id: 3, author: 'Eve', rating: 3, comment: 'Good coffee maker but a bit noisy.' },
  { product_id: 4, author: 'Frank', rating: 5, comment: 'Perfect for daily commute, fits my laptop great.' },
  { product_id: 5, author: 'Grace', rating: 4, comment: 'Stylish and great UV protection.' },
  { product_id: 6, author: 'Hank', rating: 5, comment: 'Incredible display and camera quality.' },
  { product_id: 6, author: 'Ivy', rating: 4, comment: 'Fast and smooth, love the 5G speed.' },
  { product_id: 6, author: 'Jack', rating: 3, comment: 'Good phone but pricey.' },
  { product_id: 7, author: 'Karen', rating: 5, comment: 'Non-slip grip is excellent for hot yoga.' },
  { product_id: 8, author: 'Leo', rating: 4, comment: 'Nice adjustable brightness levels.' },
  { product_id: 9, author: 'Mia', rating: 5, comment: 'Keeps my water ice cold all day!' },
  { product_id: 10, author: 'Noah', rating: 4, comment: 'Smooth paper, great for journaling.' },
  { product_id: 11, author: 'Olivia', rating: 5, comment: 'Typing feels amazing with Cherry switches.' },
  { product_id: 12, author: 'Pete', rating: 4, comment: 'My plants love the self-watering feature.' },
  { product_id: 13, author: 'Quinn', rating: 5, comment: 'Elegant design, keeps perfect time.' },
  { product_id: 14, author: 'Rose', rating: 4, comment: 'Fun game night staple for our family.' },
  { product_id: 15, author: 'Sam', rating: 5, comment: 'Beautiful scents, burn evenly.' },
  { product_id: 16, author: 'Tina', rating: 4, comment: 'Great variety of thicknesses.' },
  { product_id: 17, author: 'Uma', rating: 5, comment: 'Nothing sticks, easy to clean.' },
  { product_id: 18, author: 'Vic', rating: 4, comment: 'Clear views of the moon and planets.' },
  { product_id: 19, author: 'Wendy', rating: 5, comment: 'Vibrant colors, great starter set.' },
  { product_id: 20, author: 'Xander', rating: 4, comment: 'Good quality ball, holds air well.' },
];

// Seed only if products table is empty
const count = db.prepare('SELECT COUNT(*) as c FROM products').get();
if (count.c === 0) {
  const insertProduct = db.prepare('INSERT INTO products (name, emoji, description, price, category) VALUES (?, ?, ?, ?, ?)');
  const insertReview = db.prepare('INSERT INTO reviews (product_id, author, rating, comment) VALUES (?, ?, ?, ?)');

  const seedAll = db.transaction(() => {
    for (const p of products) insertProduct.run(p.name, p.emoji, p.description, p.price, p.category);
    for (const r of reviews) insertReview.run(r.product_id, r.author, r.rating, r.comment);
  });
  seedAll();
  console.log('Database seeded with 20 products and reviews.');
} else {
  console.log('Database already seeded.');
}
