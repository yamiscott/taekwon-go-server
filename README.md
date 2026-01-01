# Dockerized Node + Express CRUD with MongoDB

## Quick start

1. Copy `.env.example` to `.env` and adjust values.

2. Using Docker Compose (recommended):

```bash
docker compose up --build
```

The app will be available on http://localhost:3000

## Scripts

- `npm run dev` — start with nodemon for local development
- `npm test` — run tests

## API Endpoints

- `GET /health` — health check
- `GET /items` — list items
- `POST /items` — create item (json: `{ name, description }`)
- `GET /items/:id` — get item
- `PUT /items/:id` — update item
- `DELETE /items/:id` — delete item
