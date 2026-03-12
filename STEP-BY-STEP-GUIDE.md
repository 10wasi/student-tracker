# Student Performance Tracker – Step-by-step guide

## 1. Run the project locally

### Step 1.1 – Start the backend (API)

1. Open a terminal (PowerShell or Command Prompt).
2. Go to the backend folder and activate the virtual environment:
   ```powershell
   cd "c:\Users\Tajirz International\OneDrive\Desktop\Student Performance Tracker\backend"
   .\venv\Scripts\Activate.ps1
   ```
3. Start the API server:
   ```powershell
   uvicorn main:app --reload --port 8000
   ```
4. Leave this terminal open. The API will be at **http://localhost:8000**.  
   Docs: **http://localhost:8000/docs**

---

### Step 1.2 – Start the frontend (React app)

1. Open a **second** terminal.
2. Go to the frontend folder:
   ```powershell
   cd "c:\Users\Tajirz International\OneDrive\Desktop\Student Performance Tracker\frontend"
   ```
3. Install dependencies (only needed once, or after pulling new code):
   - Either run: `.\install.bat`  
   - Or: `npm.cmd install`
4. Start the dev server:
   - Either run: `.\run-dev.bat`  
   - Or: `npm.cmd run dev`
5. In your browser open: **http://localhost:5173**

You now have:
- Frontend: http://localhost:5173  
- Backend: http://localhost:8000  

The frontend is set to use `http://localhost:8000` as the API, so it will talk to your local backend.

---

## 2. Use the deployed API on Railway

Your backend is live at:

- **Base URL:** https://student-tracker-production-22ba.up.railway.app  
- **API docs:** https://student-tracker-production-22ba.up.railway.app/docs  

You can:
- Open the docs URL in a browser and try the endpoints.
- Use Postman or any HTTP client with the base URL above.

---

## 3. Point the frontend to the Railway API (optional)

The frontend uses `VITE_API_URL` from the environment (default: `http://localhost:8000`).

**To use the deployed Railway API when running the frontend locally:**

1. In the `frontend` folder, copy `.env.example` to `.env` (or create `.env`).
2. Set: `VITE_API_URL=https://student-tracker-production-22ba.up.railway.app`
3. Restart the dev server (`.\run-dev.bat` or `npm.cmd run dev`).

**Production builds** (`npm run build`) use `frontend/.env.production`, which already points to the Railway API.

---

## 4. Push changes to GitHub and Railway

When you change code and want to update GitHub and Railway:

1. Open a terminal in the project root:
   ```powershell
   cd "c:\Users\Tajirz International\OneDrive\Desktop\Student Performance Tracker"
   ```
2. See what changed:
   ```powershell
   git status
   ```
3. Stage all changes:
   ```powershell
   git add .
   ```
4. Commit with a short message:
   ```powershell
   git commit -m "Describe your change here"
   ```
5. Push to GitHub (Railway will auto-deploy the backend if it’s connected):
   ```powershell
   git push origin main
   ```
6. In the Railway dashboard, check the **Deployments** tab to see the new deployment.

---

## 5. Quick reference

| Task                    | Command / action |
|-------------------------|------------------|
| Run backend locally     | `cd backend` → activate venv → `uvicorn main:app --reload --port 8000` |
| Run frontend locally    | `cd frontend` → `.\run-dev.bat` or `npm.cmd run dev` |
| Install frontend deps   | In `frontend`: `.\install.bat` or `npm.cmd install` |
| Open local app          | http://localhost:5173 |
| Open local API docs     | http://localhost:8000/docs |
| Open deployed API docs  | https://student-tracker-production-22ba.up.railway.app/docs |
| Push and deploy         | `git add .` → `git commit -m "message"` → `git push origin main` |

---

## 6. If something doesn’t work

- **“npm not recognized”**  
  Use `npm.cmd` instead of `npm`, or run `.\install.bat` and `.\run-dev.bat` in the `frontend` folder.

- **“Scripts disabled” in PowerShell**  
  Use the `.bat` files in `frontend` (e.g. `install.bat`, `run-dev.bat`).

- **Frontend can’t reach the API**  
  Check that the backend is running (Step 1.1) and that `API_BASE` in `Dashboard.jsx` matches where the API runs (localhost or Railway URL).

- **Railway deploy fails**  
  Make sure the latest code is pushed: `git push origin main`. Check the **Build logs** in Railway for the exact error.
