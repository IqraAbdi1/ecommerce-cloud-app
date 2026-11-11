# PearlMart: Cloud-Native E-Commerce Platform

A full-stack e-commerce application built with a microservices architecture, an edge API gateway, cloud databases and object storage, and automated deployment. It was built for CSC 3206 (Edge and Cloud Computing) at the Islamic University in Uganda to put core cloud computing concepts into a working product.

Users can browse products, manage a cart, check out by card, mobile money or cash, track orders and view payment history. Admins get product management and a sales analytics dashboard.

---

## Live Deployment

| Part | URL | Status |
|---|---|---|
| Frontend (Vercel) | https://pearlmart.vercel.app | Live (the live site is branded "CloudShop") |
| API gateway (Cloudflare Workers) | https://ecommerce-gateway-v2.iqraabdi228.workers.dev/api/health | Live |
| Backend services (Railway) | — | Offline |

The four backend services were deployed on Railway's free tier, which has since ended, so the live site loads but cannot fetch products, log in or place orders. To run the full app, follow [How to Run Locally](#how-to-run-locally).

---

## Architecture

```
React frontend (Vercel)
        |
        v
API gateway (Cloudflare Workers, edge)
        |  routes /api/auth, /api/products, /api/orders, /api/payments
        v
+-----------+   +---------------+   +-------------+   +---------------+
|   Auth    |   |   Products    |   |   Orders    |   |   Payments    |
|  :3001    |   |    :3002      |   |   :3003     |   |    :3004      |
+-----------+   +---------------+   +-------------+   +---------------+
        \              |                  |                 /
         v             v                  v                v
     Supabase PostgreSQL (one schema per service) + Supabase Storage
```

### Services

| Service | Port | Responsibility | Schema |
|---|---|---|---|
| Auth service | 3001 | Register, login, issue JWT tokens | `app_auth` |
| Products service | 3002 | Product CRUD, image uploads | `products` |
| Orders service | 3003 | Place orders, track status, sales analytics | `orders` |
| Payments service | 3004 | Record and verify payments | `payments` |

### Infrastructure

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React, Vite, Tailwind CSS on Vercel | User interface, served from a CDN |
| Edge gateway | Cloudflare Workers | Routes requests to the right service; rejects missing or expired tokens on protected routes |
| Microservices | Node.js and Express in Docker, on Railway (PaaS) | Business logic, one container per service |
| Databases | Supabase PostgreSQL | A separate schema per service |
| Object storage | Supabase Storage | Product images (S3-compatible) |
| CI/CD | GitHub Actions and Railway auto-deploy | Dependency checks on every push; Railway redeploys services from `main` |

---

## Cloud Computing Concepts Demonstrated

- **Microservices architecture:** 4 independent services, each with its own codebase, container and database schema
- **Edge computing:** the API gateway runs on Cloudflare's global edge network
- **PaaS deployment:** services hosted on Railway with no server management
- **Containerisation:** each service has its own Dockerfile
- **Cloud databases:** managed PostgreSQL on Supabase, with schema-level separation per service
- **Object storage:** product images stored in Supabase Storage
- **MapReduce programming model:** the sales analytics endpoint (`GET /orders/analytics/sales`) maps over orders and reduces them into revenue totals and top products
- **JWT authentication:** the auth service issues tokens; every service verifies the signature with `jsonwebtoken`, and the gateway rejects requests with missing or expired tokens before they reach a service
- **CI/CD pipeline:** GitHub Actions installs and checks each service on every push to `main`, and Railway automatically redeploys the services
- **Service-to-service communication:** the orders service calls the products and payments services over HTTP
- **Configuration through environment variables:** Supabase keys and the JWT secret are read from environment variables, not stored in the code

---

## Project Structure

```
ecommerce-cloud-app/
├── gateway/              # Cloudflare Worker: API gateway
├── auth-service/         # Node.js: register, login, JWT
├── products-service/     # Node.js: products and image upload
├── orders-service/       # Node.js: orders and analytics
├── payments-service/     # Node.js: payments
├── frontend/             # React: user interface
└── .github/
    └── workflows/        # GitHub Actions CI/CD
```

---

## How to Run Locally

### Prerequisites
- Node.js v18+
- A Supabase project with the `app_auth`, `products`, `orders` and `payments` schemas
- Docker Desktop (optional)

### Steps

1. Clone the repository:
```bash
git clone https://github.com/IqraAbdi1/ecommerce-cloud-app.git
cd ecommerce-cloud-app
```

2. Create a `.env` file in each service folder and in `frontend/` using the variables in the table below.

3. Start each service (in separate terminals):
```bash
cd auth-service && npm install && npm run dev
cd products-service && npm install && npm run dev
cd orders-service && npm install && npm run dev
cd payments-service && npm install && npm run dev
```

4. Start the frontend:
```bash
cd frontend && npm install && npm run dev
```

5. Or run a service with Docker:
```bash
cd auth-service
docker build -t auth-service .
docker run -p 3001:3001 --env-file .env auth-service
```

---

## Environment Variables

Never commit `.env` files. They are listed in `.gitignore`.

| Variable | Used in | Purpose |
|---|---|---|
| `SUPABASE_URL` | All 4 services | Supabase project URL |
| `SUPABASE_KEY` | All 4 services | Supabase API key |
| `JWT_SECRET` | All 4 services | Secret for signing and verifying tokens (must match across services) |
| `PORT` | All 4 services | Port the service listens on (3001–3004) |
| `PRODUCTS_SERVICE_URL` | Orders | URL of the products service |
| `PAYMENTS_SERVICE_URL` | Orders | URL of the payments service |
| `ORDERS_SERVICE_URL` | Payments | URL of the orders service |
| `VITE_GATEWAY_URL` | Frontend | URL of the API gateway |

The gateway's service URLs are set in `gateway/worker.js`.

---

## Author

**Iqra Abdirizak Mohamed** ([@IqraAbdi1](https://github.com/IqraAbdi1))
CSC 3206 Edge and Cloud Computing, Islamic University in Uganda
