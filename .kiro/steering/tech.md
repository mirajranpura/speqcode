# Tech Stack

## Server
- Runtime: Node.js
- Framework: Express.js (v4)
- Database: SQLite via `better-sqlite3` (synchronous API)
- CORS enabled via `cors` middleware
- Module system: CommonJS (`require`/`module.exports`)
- Database file: `server/shop.db` (WAL mode, foreign keys ON)

## Client
- Framework: React 18 (functional components, hooks)
- Routing: React Router v6
- Bundler: Create React App (`react-scripts` v5)
- API calls: plain `fetch` (no axios or other HTTP library)
- Module system: ES Modules (`import`/`export`)
- Dev proxy: `http://localhost:4000` configured in client/package.json

## Monorepo Coordination
- Root `package.json` uses `concurrently` to run server + client together
- No shared packages between client and server

## Common Commands

```bash
# Install all dependencies (root, server, client)
npm run install:all

# Run both server and client in development
npm run dev

# Run server only (Express on port 4000)
npm run server

# Run client only (React on port 3000)
npm run client

# Build client for production
cd client && npm run build
```

## Ports
- Server API: `http://localhost:4000`
- Client dev server: `http://localhost:3000`
- All API routes are prefixed with `/api`
