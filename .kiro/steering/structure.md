# Project Structure

```
├── package.json              # Root scripts (dev, install:all) + concurrently
├── server/
│   ├── package.json          # Server dependencies
│   ├── index.js              # Express app, all API route definitions
│   ├── db.js                 # SQLite connection + schema creation (products, reviews, cart_items)
│   ├── seed.js               # Seed data (20 products, 24 reviews), runs once if DB is empty
│   └── shop.db               # SQLite database file (gitignored in practice)
├── client/
│   ├── package.json          # React dependencies + proxy config
│   ├── public/
│   │   └── index.html        # HTML shell
│   └── src/
│       ├── index.js           # React entry point, BrowserRouter setup
│       ├── App.js             # Root component, navbar, route definitions
│       ├── App.css            # Global styles
│       ├── api.js             # All API helper functions (fetch wrappers)
│       └── pages/
│           ├── Home.js        # Product grid listing
│           ├── Product.js     # Product detail + reviews + add-to-cart
│           └── Cart.js        # Cart management (quantity update, delete)
```

## Key Conventions
- All server routes live in a single file (`server/index.js`), no separate router modules
- Database schema is created inline in `db.js` using `CREATE TABLE IF NOT EXISTS`
- Client pages are in `client/src/pages/`, one component per page
- API helpers are centralized in `client/src/api.js` — all server communication goes through this module
- Components are functional with hooks (`useState`, `useEffect`, `useParams`)
- No state management library — local component state only
- Inline styles used sparingly alongside CSS classes from `App.css`

## API Routes
| Method | Route              | Description                    |
|--------|--------------------|--------------------------------|
| GET    | /api/products      | List all products              |
| GET    | /api/products/:id  | Get product with reviews       |
| GET    | /api/cart          | Get cart items (joined with products) |
| POST   | /api/cart          | Add item to cart               |
| PUT    | /api/cart/:id      | Update cart item quantity       |
| DELETE | /api/cart/:id      | Remove item from cart          |

## Database Tables
- `products` — id, name, emoji, description, price, category
- `reviews` — id, product_id (FK), author, rating (1-5), comment, created_at
- `cart_items` — id, product_id (FK, unique), quantity (>0)
