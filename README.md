# E-Commerce Cloud App

A full-stack cloud-native e-commerce application built to demonstrate core cloud computing concepts including microservices architecture, edge computing, cloud storage, containerisation, and CI/CD automation.

---

## Live Demo
- **Frontend:** (Vercel URL — add after deployment)
- **API Gateway:** (Cloudflare Workers URL — add after deployment)

---

## Architecture

This project is split into 4 independent microservices, each with its own database, deployed on a public cloud platform.

### Services
| Service | Port | Responsibility |
|---|---|---|
| Auth service | 3001 | Register, login, issue JWT tokens |
| Products service | 3002 | Product CRUD, image uploads |
| Orders service | 3003 | Place orders, track status, sales analytics |
| Payments service | 3004 | Record and verify payments |

### Infrastructure
| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React on Vercel | User interface, CDN-delivered |
| Edge gateway | Cloudflare Workers | JWT validation, request routing |
| Microservices | Railway.app (PaaS) | Business logic in Docker containers |
| Databases | Supabase PostgreSQL | One isolated DB per service |
| Object storage | Supabase Storage | Product image uploads |
| CI/CD | GitHub Actions | Auto-deploy on every git push |

---

## Cloud Computing Concepts Demonstrated

- **Microservices architecture** — 4 independent services, each deployable and scalable on its own
- **Edge computing** — API gateway runs on Cloudflare's global edge network (300+ locations)
- **PaaS deployment** — all services hosted on Railway.app, no server management needed
- **Containerisation** — each service runs in its own Docker container (sandboxing)
- **Cloud databases** — managed PostgreSQL instances on Supabase, one per service
- **Object storage** — product images stored in Supabase Storage (S3-compatible)
- **MapReduce programming model** — sales analytics endpoint maps and reduces order data
- **JWT authentication** — stateless auth tokens validated at the edge gateway
- **CI/CD pipeline** — GitHub Actions automatically tests and deploys on every push
- **Service-to-service communication** — async HTTP calls between services using Promise.all()
- **Environment variables and secrets** — all sensitive config stored as cloud secrets, never in code
- **Infrastructure separation** — each service fails and scales independently

---

## Project Structure
ecommerce-cloud-app/
├── gateway/              # Cloudflare Worker — API gateway
├── auth-service/         # Node.js — register, login, JWT
├── products-service/     # Node.js — products + image upload
├── orders-service/       # Node.js — orders + analytics
├── payments-service/     # Node.js — payments
├── frontend/             # React — user interface
└── .github/
└── workflows/        # GitHub Actions CI/CD

---

## How to Run Locally

### Prerequisites
- Node.js v18+
- Docker Desktop
- Git

### Steps

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/ecommerce-cloud-app.git
cd ecommerce-cloud-app
```

2. Set up environment variables — create a `.env` file in each service folder (see each service's README for required variables)

3. Run a service locally:
```bash
cd auth-service
npm install
npm run dev
```

4. Or run with Docker:
```bash
docker build -t auth-service .
docker run -p 3001:3001 auth-service
```

---

## Environment Variables

Each service requires its own `.env` file. Never commit these to GitHub — they are listed in `.gitignore`.

| Variable | Used in | Purpose |
|---|---|---|
| `SUPABASE_URL` | All services | Supabase project URL |
| `SUPABASE_KEY` | All services | Supabase anon/service key |
| `JWT_SECRET` | Auth + Gateway | Secret key for signing tokens |
| `AUTH_SERVICE_URL` | Gateway | Railway URL of auth service |
| `PRODUCTS_SERVICE_URL` | Gateway + Orders | Railway URL of products service |
| `ORDERS_SERVICE_URL` | Gateway + Payments | Railway URL of orders service |
| `PAYMENTS_SERVICE_URL` | Gateway + Orders | Railway URL of payments service |

---

## Author
- **Name:** Iqra Abdirizak Mohamed 
- **Course:** CSC 3206 — Edge and Cloud Computing
- **Institution:** Islamic University in Uganda
- **Year:** III