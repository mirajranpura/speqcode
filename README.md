# 🛒 Emoji Shop

A full-stack e-commerce web application where users browse emoji-themed products, read reviews, manage a shopping cart, and chat with an AI-powered shopping assistant.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client (React)                           │
│                     http://localhost:3000                        │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────────┐  │
│  │  Home    │  │ Product  │  │  Cart    │  │  ChatWidget    │  │
│  │  (grid)  │  │ (detail) │  │ (manage) │  │  (assistant)   │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └───────┬────────┘  │
│       │              │             │                │            │
│       └──────────────┴─────────────┘                │            │
│                      │                              │            │
│                api.js (fetch)                       │            │
└──────────────────────┼──────────────────────────────┼────────────┘
                       │                              │
                       ▼                              ▼
          ┌────────────────────┐         ┌─────────────────────────┐
          │   Express Server   │         │   Chatbot (Flask)       │
          │ http://localhost:4000│        │  http://localhost:8000  │
          │                    │         │                         │
          │  /api/products     │◄────────│  Strands Agent          │
          │  /api/products/:id │  HTTP   │  (Amazon Bedrock        │
          │  /api/cart         │ requests│   Nova Pro)             │
          │  /api/cart/:id     │         │                         │
          └────────┬───────────┘         │  Tools:                │
                   │                     │  - get_products         │
                   ▼                     │  - get_product_details  │
          ┌────────────────────┐         │  - get_cart             │
          │   SQLite (shop.db) │         │  - add_to_cart          │
          │                    │         │  - update_cart_item     │
          │  products          │         │  - remove_from_cart     │
          │  reviews           │         └─────────────────────────┘
          │  cart_items         │
          └────────────────────┘
```

## Tech Stack

| Layer    | Technology                                      |
|----------|------------------------------------------------|
| Frontend | React 18, React Router v6, Create React App     |
| Backend  | Node.js, Express.js v4, better-sqlite3           |
| Chatbot  | Python, Flask, Strands Agents SDK, Amazon Bedrock |
| Database | SQLite (WAL mode, foreign keys enabled)          |

## Features

- Product catalog with 20 emoji-themed products
- Product detail pages with star-rated customer reviews
- Shopping cart (add, update quantity, remove items)
- AI shopping assistant powered by Amazon Bedrock Nova Pro
- Session-based chat with conversation history
- Responsive UI with floating chat widget

## Prerequisites

- Node.js (v18+)
- Python 3.10+
- AWS credentials configured for Amazon Bedrock access
  - Either `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY`
  - Or `AWS_BEARER_TOKEN_BEDROCK`

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/mirajranpura/speqcode.git
cd speqcode
```

### 2. Install Node.js dependencies

```bash
npm run install:all
```

This installs dependencies for the root, server, and client.

### 3. Set up the Python chatbot

```bash
cd chatbot
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..
```

### 4. Configure AWS credentials

Export your AWS credentials so the chatbot can access Amazon Bedrock:

```bash
export AWS_ACCESS_KEY_ID=your-access-key
export AWS_SECRET_ACCESS_KEY=your-secret-key
export AWS_DEFAULT_REGION=us-east-1
```

### 5. Run the application

```bash
npm run dev
```

This starts all three services concurrently:

| Service  | URL                      |
|----------|--------------------------|
| Client   | http://localhost:3000     |
| Server   | http://localhost:4000     |
| Chatbot  | http://localhost:8000     |

The database is automatically created and seeded with sample products and reviews on first run.

## API Routes

| Method | Route              | Description                    |
|--------|--------------------|--------------------------------|
| GET    | /api/products      | List all products              |
| GET    | /api/products/:id  | Get product with reviews       |
| GET    | /api/cart          | Get cart items with product info|
| POST   | /api/cart          | Add item to cart               |
| PUT    | /api/cart/:id      | Update cart item quantity       |
| DELETE | /api/cart/:id      | Remove item from cart          |

## Project Structure

```
├── package.json           # Root scripts + concurrently
├── server/
│   ├── index.js           # Express API routes
│   ├── db.js              # SQLite connection + schema
│   └── seed.js            # Sample data seeder
├── client/
│   └── src/
│       ├── App.js         # Root component + routing
│       ├── api.js         # API fetch helpers
│       ├── pages/         # Home, Product, Cart pages
│       └── components/    # ChatWidget
└── chatbot/
    ├── app.py             # Flask server
    ├── agent.py           # Strands Agent config
    ├── tools.py           # Agent tools (shop API wrappers)
    └── sessions.py        # Chat session management
```
