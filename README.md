Live demo: https://reconciler-frontend-2gb2.onrender.com

Heads up: the backend is backed by a free Render Postgres instance. Free instances are useful for demos but not guaranteed long-term — they can be reclaimed or hit limits. If the live demo stops working, it’s likely because the free DB was removed or exhausted.

---

# Transaction Reconciler

Hi — I'm sharing a small, production-minded demo I built to show how I think about backend engineering, data ingestion, and delivering a usable product fast.

---

## Quick elevator (what I built)
I created a full-stack Transaction Reconciler:
- A Spring Boot backend (Java 17, Maven) that ingests CSVs, runs deterministic reconciliation rules, and exposes a JSON report.
- A lightweight React UI to upload files and view the reconciliation results.
- Deployable with Docker, backed by PostgreSQL, and hosted as a free demo (Render + Vercel).

Why it matters: reconciliation is a recurring real-world problem in banking and payments. This demo compresses the key engineering parts — ingestion, matching logic, persistence, reporting, and deployability — into a single, interview-friendly repository.

---

## What I solved (high-level)
- Reliable CSV ingestion with header validation and defensive parsing.
- Deterministic matching with clear, ordered rules:
  1. exact txn_id ↔ ref_txn_id
  2. amount + txn_date
- Clear JSON reporting suitable for downstream automation (counts, matched pairs, rules used).
- Minimal UI that demonstrates the end-to-end flow in under 60 seconds.
- Containerized app with a Render blueprint for one-click deploy and a Vercel-ready frontend.

---

## Tech stack
- Backend: Java 17, Spring Boot 3, Spring Data JPA, Maven
- Database: PostgreSQL
- CSV parsing: Apache Commons CSV
- Frontend: React (Create React App)
- Infra: Docker, Docker Compose, Render (free Postgres + web), Vercel (frontend)
- CI: GitHub Actions (build pipelines for backend and frontend)

---

## Concrete highlights I want you to notice
- **Code structure**: small, opinionated modules (`service` for reconciliation logic, `controller` for API, `repository` for persistence). Easy to review.
- **Idempotent ingest**: CSV ingestion is batch-oriented and safe to re-run for demos.
- **Reconciliation traceability**: each match includes which rule matched it (txnId vs amount+date) so you can reproduce decisions during an interview.
- **One-click deploy pattern**: `render.yaml` wires the web service to a managed Postgres instance so reviewers can reproduce hosted behavior quickly.
- **Minimal but real CI**: GitHub Actions build steps to validate the app on push/PR.

---

## Repo map — what to open first
- `backend/src/main/java/.../service/ReconciliationService.java` — core logic. Read this to understand rules and edge-case handling.
- `backend/src/main/java/.../controller/ReconciliationController.java` — API surface for ingest and run.
- `frontend/src/App.js` — the minimal UI glue to demonstrate the end-to-end flow.
- `render.yaml` — infrastructure blueprint for Render (one-file deploy).
- `docker-compose.yml` (optional) — local end-to-end demo with Postgres.

---

## How to run locally (fast)
1. Start Postgres:
```bash
docker run --name tr-dev-db -e POSTGRES_DB=reconciler -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15
```
2. Run backend:
```bash
cd backend
# set env for local run (optional)
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/reconciler
export SPRING_DATASOURCE_USERNAME=postgres
export SPRING_DATASOURCE_PASSWORD=postgres
./mvnw spring-boot:run
```
3. Run frontend:
```bash
cd frontend
export REACT_APP_API_BASE_URL=http://localhost:8080
npm install
npm start
```
Or run everything with `docker compose up --build` if `docker-compose.yml` is present.

---

## Sample CSVs (drop into UI)
**transactions.csv**
```
txn_id,source,amount,txn_date
T1001,bankA,100.00,2025-08-01
T1002,bankA,50.00,2025-08-01
,bankA,25.00,2025-08-02
```
**references.csv**
```
ref_txn_id,source,amount,txn_date
T1001,ledger,100.00,2025-08-01
R5001,ledger,25.00,2025-08-02
```