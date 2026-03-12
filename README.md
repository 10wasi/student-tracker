# Student Performance Tracker

Full-stack app: **FastAPI** backend + **React (Vite)** frontend. Track students, courses, grades, and insights.

## Quick start

### Backend (API)
```bash
cd backend
.\venv\Scripts\Activate.ps1   # Windows
uvicorn main:app --reload --port 8000
```
API: http://localhost:8000 • Docs: http://localhost:8000/docs

### Frontend
```bash
cd frontend
.\install.bat    # first time only
.\run-dev.bat
```
App: http://localhost:5173

## API URL (frontend)

- **Local:** Uses `http://localhost:8000` by default.
- **Production:** Set `VITE_API_URL` in `.env` or use `.env.production` (points to Railway).

Copy `frontend/.env.example` to `frontend/.env` to override.

## Deployed API (Railway)

- **Live API:** https://student-tracker-production-22ba.up.railway.app  
- **Docs:** https://student-tracker-production-22ba.up.railway.app/docs  

## Docs in this repo

- **STEP-BY-STEP-GUIDE.md** – Run locally, deploy, push to GitHub.
- **RAILWAY-DEPLOY.md** – Railway deployment details.
- **PUSH-TO-GITHUB.md** – GitHub setup and push.
