# Deploy Student Performance Tracker on Railway

## Why the build failed

Railway was using **Railpack** from the repo root. The root has no single app (only `backend/` and `frontend/`), so "Error creating build plan with Railpack" appeared.

## Fix applied in this repo

1. **`Dockerfile`** at repo root – builds and runs the FastAPI backend.
2. **`railway.toml`** at repo root – forces Railway to use the Dockerfile builder (not Railpack).
3. **`.dockerignore`** – keeps the image small and avoids copying `node_modules`/`venv`.

## Steps to deploy

### 1. Commit and push everything

```powershell
cd "c:\Users\Tajirz International\OneDrive\Desktop\Student Performance Tracker"
git add Dockerfile .dockerignore railway.toml RAILWAY-DEPLOY.md
git status
git commit -m "Railway: force Dockerfile build, add railway.toml"
git push origin main
```

### 2. Railway dashboard

- **Root Directory:** Leave **empty** (build from repo root).
- **Redeploy:** After push, redeploy the service (or wait for auto-deploy).

### 3. If it still uses Railpack

In your service → **Settings** → **Build** (or **Builder**):

- Set builder to **Dockerfile** / **Docker** if there is an option.
- Save and **Redeploy**.

## Deploying the frontend (optional)

To run the React app on Railway as well:

1. Create a **second service** in the same project.
2. Connect it to the same GitHub repo.
3. Set that service’s **Root Directory** to: `frontend`
4. Set **Build Command**: `npm install && npm run build`
5. Set **Start Command** (static): `npx serve -s dist -l $PORT`
6. Add `serve` to the frontend: `npm install -g serve` or add it in `package.json` and use `npx serve -s dist -l $PORT`.

For now, fixing the API by setting Root Directory to `backend` is enough to resolve the “Error creating build plan with Railpack” failure.
