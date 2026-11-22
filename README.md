# Product Catalogue

A full-stack product catalogue application built with Node.js/TypeScript/Express on the backend and React/TypeScript/Vite on the frontend. Products are sourced from the [Fake Store API](https://fakestoreapi.com) via a backend proxy. Users can browse products by category, search, view featured items, and submit enquiries via email (powered by Nodemailer + Ethereal — no real SMTP setup required).

---

## Tech Stack

| Layer     | Technology                                              |
|-----------|---------------------------------------------------------|
| Client    | React 18, TypeScript, Vite, React Router v6, CSS Modules |
| Backend   | Node.js 20, TypeScript, Express, Axios, express-validator |
| Email     | Nodemailer + Ethereal (auto test account, preview URLs logged) |
| Container | Docker, Docker Compose, nginx (frontend serving)        |

---

## Quick Start

### Prerequisites

- [Node.js 20+](https://nodejs.org/) (for local dev)
- [Docker](https://www.docker.com/) and Docker Compose (for containerised run)

---

### Option A — Docker (Recommended)

One command to run everything:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
docker compose up
```

Then open **http://localhost:3000**

> The backend API is available at **http://localhost:4000/api**

---

### Option B — Local Dev (Two Terminals)

**Terminal 1 — Backend:**

```bash
cd backend
npm install
npm run dev
```

**Terminal 2 — Frontend:**

```bash
cd frontend
npm install
npm run dev
```

Then open **http://localhost:3000**

---

## Environment Variables

### Backend (`backend/.env`)

| Variable              | Description                                      | Default                        |
|-----------------------|--------------------------------------------------|--------------------------------|
| `PORT`                | Port the Express server listens on               | `4000`                         |
| `FAKE_STORE_BASE_URL` | Base URL of the upstream product API             | `https://fakestoreapi.com`     |
| `SALES_EMAIL`         | Recipient address for product enquiry emails     | `sales@example.com`            |
| `SMTP_HOST`           | SMTP host (leave blank to use Ethereal auto-account) | _(blank)_                  |
| `SMTP_PORT`           | SMTP port                                        | _(blank)_                      |
| `SMTP_USER`           | SMTP username                                    | _(blank)_                      |
| `SMTP_PASS`           | SMTP password                                    | _(blank)_                      |
| `SMTP_FROM`           | From address for outgoing emails                 | _(blank)_                      |

### Frontend (`frontend/.env`)

| Variable        | Description                          | Default                         |
|-----------------|--------------------------------------|---------------------------------|
| `VITE_API_URL`  | Base URL for backend API calls       | `http://localhost:4000/api`     |

---

## Running Tests

**Backend (Jest + Supertest):**

```bash
cd backend
npm test
```

**Frontend (Vitest + React Testing Library):**

```bash
cd frontend
npm test
```

---

## Email (Ethereal)

No email configuration is required. When `SMTP_HOST` is not set, the backend automatically creates a free [Ethereal](https://ethereal.email/) test account on startup. After submitting an enquiry, a **preview URL** is logged to the backend console — open it in your browser to view the email exactly as it was sent.

For production, populate the `SMTP_*` environment variables with your real SMTP provider credentials and restart the server.

---

## Architecture

```
Browser (React SPA)
       │
       │  HTTP (REST)
       ▼
Express Backend (:4000)
  ├── In-memory cache (5 min TTL)
  │
  └──▶ Fake Store API (fakestoreapi.com)
         (products, categories)

  └──▶ Nodemailer / Ethereal
         (enquiry emails)
```

The frontend **never** calls the Fake Store API directly. All product data flows through the Express backend, which caches responses for 5 minutes to reduce upstream load. Email is handled server-side only.

---

## Folder Structure

```
product-catalogue/
├── backend/
│   ├── src/
│   │   ├── routes/          # products.ts, enquiry.ts
│   │   ├── services/        # fakeStoreService.ts, emailService.ts
│   │   ├── middleware/      # errorHandler.ts, validate.ts
│   │   ├── types/           # index.ts (shared interfaces)
│   │   ├── config.ts
│   │   ├── app.ts
│   │   └── server.ts
│   ├── tests/
│   │   ├── products.test.ts
│   │   └── enquiry.test.ts
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── jest.config.ts
│   ├── nodemon.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/             # client.ts, products.ts, enquiry.ts
│   │   ├── components/      # Header, Footer, ProductCard, SearchBar, EnquiryModal, ...
│   │   ├── pages/           # HomePage, CategoryPage, ProductDetailPage
│   │   ├── types/           # index.ts
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── .env.example
├── docker-compose.yml
├── .gitignore
├── .env.example
├── README.md
├── DECISIONS.md
└── AI_USAGE.md
```
