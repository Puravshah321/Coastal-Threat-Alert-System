# Nereus — Full‑Stack Demo (React + Tailwind + Express)

## Quick Start

### 1) Backend
```bash
cd server
npm i
npm run dev
```
This starts the API at `http://localhost:4000/api`

### 2) Frontend
```bash
cd ../nereus-frontend
npm i
npm run dev
```
Visit `http://localhost:5173`

### Configure API URL
In development the frontend targets `http://localhost:4000/api`. To override, create `.env` in `nereus-frontend` with:
```
VITE_API_URL=http://localhost:4000/api
```

## Features
- Auth (JWT): register, login, logout
- Alerts feed
- Protected “Report Incident” page with image upload (base64 demo)
- Modern UI: Tailwind, dark theme, animated hero, responsive layout

## Notes
- Storage is in-memory for demo. Swap `server/data/db.js` with a real database.
- This is Vite (React) + Tailwind. No Next.js required.
