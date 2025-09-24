# 🏦 Transaction Reconciler

Transaction Reconciler is a **full-stack web application** that automates reconciliation between **bank transaction data** and **reference ledger data**.  
It helps identify **matched**, **partially matched**, and **unmatched** transactions using smart matching rules.

---

## **🚀 Features**
- **CSV Upload** → Upload two CSVs: one for transactions, one for reference records.
- **Smart Reconciliation** → Matches using:
  - **Transaction ID match** ✅
  - **Amount + Date match** ✅
- **Detailed Results Dashboard** → Displays:
  - Total transactions & references
  - Matched vs unmatched counts
  - First 50 matched rows in a clean table
- **RESTful API** → Well-structured endpoints for integration.

---

## **🛠️ Tech Stack**

### **Frontend**
- React (Create React App)
- Axios
- SCSS / CSS Modules
- Vercel (for deployment)

### **Backend**
- Spring Boot 3 (Java 17)
- Spring Data JPA + Hibernate
- PostgreSQL
- REST API architecture
- Docker (for local DB)

## **⚡ Quick Start**

### **Backend Setup**
```bash
cd backend

# Start Postgres in Docker
docker run --name recon-db -d \
  -p 5432:5432 \
  -e POSTGRES_DB=reconciler \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  postgres:15-alpine

# Build & run Spring Boot
mvn clean package -DskipTests
java -jar target/*.jar

Backend runs at http://localhost:8080

Frontend Setup
cd frontend
npm install
npm start


Frontend runs at http://localhost:3000