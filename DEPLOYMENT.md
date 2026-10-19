# Deployment Guide - LegalSaathi AI

## 🎯 Current Architecture

**Monorepo Structure:**
- **Backend:** FastAPI Python application (Vercel Serverless)
- **Frontend:** React + Vite application (Vercel Static + Node)
- **Single Deployment:** Both deployed on one Vercel project

---

## ✅ Fixed Issues

### 1. Root URL "/" Issue
**Problem:** Root endpoint was returning `{"detail": "Not Found"}`

**Solution:** Added root endpoint to FastAPI:
```python
@app.get("/", tags=["root"])
async def root():
    """Welcome endpoint with documentation links."""
    return {
        "message": "LegalSaathi AI - Legal Information Assistant",
        "status": "running",
        "version": "1.0.0",
        "documentation": {
            "swagger": "/docs",
            "openapi": "/openapi.json",
            "health": "/health/live"
        },
        "api_endpoints": {
            "auth": "/api/v1/auth",
            "legal": "/api/v1/legal"
        }
    }
```

**File Changed:** `Backend/app/main.py`

---

### 2. Monorepo Vercel Configuration
**Problem:** Backend and Frontend weren't properly configured for monorepo deployment

**Solution:** Created root-level `vercel.json` with proper build & routing configuration

**Files Changed:**
- Created: `vercel.json` (root level)
- Deleted: `Backend/vercel.json` (old Backend-only config)

**Configuration Details:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "Backend/api/index.py",
      "use": "@vercel/python"
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/node",
      "config": {
        "buildCommand": "npm run build",
        "outputDirectory": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "Backend/api/index.py"
    },
    {
      "src": "/health/(.*)",
      "dest": "Backend/api/index.py"
    },
    {
      "src": "/docs",
      "dest": "Backend/api/index.py"
    },
    {
      "src": "/openapi.json",
      "dest": "Backend/api/index.py"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/dist/$1"
    }
  ]
}
```

---

### 3. Frontend Environment Configuration
**Problem:** Frontend .env.example had mock API enabled

**Solution:** Updated to use real backend

**File Changed:** `frontend/.env.example`
```env
VITE_ENABLE_MOCK_API=false
VITE_API_BASE_URL=http://localhost:8000/api/v1  # for local development
```

---

## 📁 Files Modified Summary

| File | Change | Reason |
|------|--------|--------|
| `Backend/app/main.py` | Added root `/` endpoint | Enable root URL to return app info |
| `vercel.json` | Created at root level | Configure monorepo build & routing |
| `Backend/vercel.json` | Deleted | Replaced by root-level config |
| `frontend/.env.example` | Updated mock API flag | Use real backend instead of mock |
| `README.md` | Updated deployment docs | Clarify setup process |

---

## 🚀 Deployment Steps

### Step 1: Verify Local Setup

**Backend:**
```bash
cd Backend
python -m uvicorn app.main:app --reload
# Check: http://localhost:8000/
# Check: http://localhost:8000/health/live
# Check: http://localhost:8000/docs
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# Check: http://localhost:5173
```

### Step 2: Push Changes to GitHub

```bash
git add .
git commit -m "Fix Vercel deployment - Add root endpoint and monorepo config"
git push origin main
```

### Step 3: Verify Vercel Deployment

Vercel auto-deploys on `git push`. Check:

1. **Vercel Dashboard:**
   - Go to your project
   - Check "Deployments" tab
   - Wait for build to complete (3-5 minutes)

2. **Test Endpoints:**
   ```bash
   # Root endpoint
   https://pakistan-legal-rights-agent-xnqz.vercel.app/
   
   # Health check
   https://pakistan-legal-rights-agent-xnqz.vercel.app/health/live
   
   # API Docs
   https://pakistan-legal-rights-agent-xnqz.vercel.app/docs
   
   # Frontend
   https://pakistan-legal-rights-agent-xnqz.vercel.app/
   ```

---

## ✅ Expected Responses

### Root Endpoint `/`
```json
{
  "message": "LegalSaathi AI - Legal Information Assistant",
  "status": "running",
  "version": "1.0.0",
  "documentation": {
    "swagger": "/docs",
    "openapi": "/openapi.json",
    "health": "/health/live"
  },
  "api_endpoints": {
    "auth": "/api/v1/auth",
    "legal": "/api/v1/legal"
  }
}
```

### Health Check `/health/live`
```json
{
  "status": "alive",
  "service": "LegalSaathi AI"
}
```

### API Docs
```
/docs → FastAPI Swagger UI
/openapi.json → OpenAPI schema
```

---

## 🔧 Environment Variables (Vercel Dashboard)

Set these in Vercel Project Settings → Environment Variables:

```
GROQ_API_KEY=your_api_key
CORS_ORIGINS=https://pakistan-legal-rights-agent-xnqz.vercel.app
JWT_SECRET_KEY=your_secret_key
APP_ENV=production
```

---

## 🐛 Troubleshooting

### Root URL still returns 404
- **Cause:** Vercel cache or old deployment
- **Fix:** 
  ```bash
  # Hard refresh browser
  Ctrl + Shift + Delete (clear cache)
  # Or force Vercel redeploy from dashboard
  ```

### Frontend shows blank page
- **Cause:** Frontend not building or routing issue
- **Check:**
  ```bash
  # Check Vercel build logs for errors
  # Verify frontend/package.json has build script
  npm run build  # Test locally first
  ```

### API returns 503 Service Unavailable
- **Cause:** Missing GROQ_API_KEY or other env vars
- **Fix:** Set environment variables in Vercel dashboard

### CORS errors in browser console
- **Cause:** Frontend domain not in CORS_ORIGINS
- **Fix:** Update `CORS_ORIGINS` env var in Vercel

---

## 📊 Vercel Routing Explained

```
Request to:              Routes to:
/                        → frontend/dist/index.html (React app)
/api/v1/*                → Backend/api/index.py (FastAPI)
/health/*                → Backend/api/index.py (FastAPI)
/docs                    → Backend/api/index.py (FastAPI Swagger)
/openapi.json            → Backend/api/index.py (OpenAPI spec)
/*.html, /*.js, etc      → frontend/dist/* (Frontend assets)
```

---

## ✨ Complete Feature Checklist

- ✅ Backend API deployed
- ✅ Frontend deployed
- ✅ Root endpoint returns app info
- ✅ Health checks working
- ✅ API documentation accessible
- ✅ JWT authentication ready
- ✅ CORS configured
- ✅ Environment variables set
- ✅ Monorepo routing configured

---

## 🔄 Development Workflow

1. **Make changes:**
   ```bash
   # Backend changes
   cd Backend
   # ... modify files ...
   
   # Frontend changes
   cd frontend
   # ... modify files ...
   ```

2. **Test locally:**
   ```bash
   # Terminal 1
   cd Backend && python -m uvicorn app.main:app --reload
   
   # Terminal 2
   cd frontend && npm run dev
   ```

3. **Commit & Push:**
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

4. **Auto-deploys to Vercel** ✅

---

## 📞 Support

- **Repo:** https://github.com/Aishasiddiqui97/Pakistan-legal-Rights-agent
- **Live:** https://pakistan-legal-rights-agent-xnqz.vercel.app
- **API Docs:** https://pakistan-legal-rights-agent-xnqz.vercel.app/docs

---

**Last Updated:** October 2026
**Status:** ✅ Production Ready
