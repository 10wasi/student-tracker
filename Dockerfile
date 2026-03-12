# Root Dockerfile so Railway builds from repo root (no Root Directory change needed)
FROM python:3.11-slim

WORKDIR /app

# Build backend only
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

EXPOSE 8000

# Railway injects PORT at runtime; use shell so $PORT is expanded
CMD ["/bin/sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
