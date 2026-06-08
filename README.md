# ServeIQ

ServeIQ is a full-stack service marketplace concept built with:

- React + Vite for the frontend
- Spring Boot for the backend
- AI/ML recommendation and fraud-detection layers
- PayHere-ready payment integration points

## Project Layout

- `frontend/` - React app that implements the landing page and UI flows from your HTML
- `backend/` - Spring Boot API scaffold for future authentication, providers, bookings, and payments

## Frontend

```bash
cd frontend
npm install
npm run dev
```

## Backend

```bash
cd backend
mvn spring-boot:run
```

The backend is configured to use MySQL on `localhost:3306` with:

- database: `serveiq_db`
- username: `root`
- password: `1234`

## What is included

- Responsive landing page converted from your HTML into React
- Modal-based sign in, registration, and booking flows
- AI matching, fraud monitoring, payment, dashboard, and tech-stack sections
- Spring Boot health endpoint scaffold for backend expansion
