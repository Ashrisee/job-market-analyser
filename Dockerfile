# ── Stage 1: Build React frontend ─────────────────────────────
FROM node:20-slim AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./

# Build with /api as the base (same origin, no CORS)
ENV VITE_API_URL=""
RUN npm run build

# ── Stage 2: Python backend + serve frontend ──────────────────
FROM python:3.11-slim

WORKDIR /app

# Install Python deps
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY backend/ ./backend/

# Copy built React app into backend/static/ui
COPY --from=frontend-builder /app/frontend/dist ./backend/static/ui

# HuggingFace Spaces uses port 7860
ENV PORT=7860
ENV FLASK_DEBUG=false

EXPOSE 7860

# Run from backend directory
WORKDIR /app/backend
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:7860", "--workers", "2", "--timeout", "120"]
