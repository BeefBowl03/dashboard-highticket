# Vercel Deployment Guide

## 🚀 **Deployment Strategy**

You have two options for deploying to Vercel:

### **Option A: Separate Deployments (Recommended)**
Deploy frontend and backend as separate Vercel projects.

### **Option B: Monorepo Deployment**
Deploy both frontend and backend from the same repository.

---

## 📋 **Option A: Separate Deployments**

### **1. Deploy Backend First**

1. **Create new Vercel project** for backend:
   ```bash
   cd dashboard-backend
   vercel
   ```

2. **Set Environment Variables** in Vercel dashboard:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   NAMECOM_USERNAME=your_namecom_username (optional)
   NAMECOM_TOKEN=your_namecom_api_token (optional)
   FRONTEND_URL=https://your-frontend-app.vercel.app
   ```

3. **Deploy backend**:
   ```bash
   vercel --prod
   ```

### **2. Deploy Frontend**

1. **Create new Vercel project** for frontend:
   ```bash
   cd dashboard-app
   vercel
   ```

2. **Set Environment Variables** in Vercel dashboard:
   ```
   REACT_APP_API_URL=https://your-backend-app.vercel.app
   ```

3. **Deploy frontend**:
   ```bash
   vercel --prod
   ```

---

## 📋 **Option B: Monorepo Deployment**

### **1. Configure Vercel for Monorepo**

Create `vercel.json` in root directory:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "dashboard-app/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "build" }
    },
    {
      "src": "dashboard-backend/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/dashboard-backend/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/dashboard-app/$1"
    }
  ]
}
```

### **2. Set Environment Variables**
```
# Backend
OPENAI_API_KEY=your_openai_api_key_here
NAMECOM_USERNAME=your_namecom_username
NAMECOM_TOKEN=your_namecom_api_token

# Frontend
REACT_APP_API_URL=https://your-app.vercel.app
```

---

## ✅ **What's Already Configured**

- ✅ Backend is Vercel-ready with `vercel.json`
- ✅ CORS configured for production URLs
- ✅ Environment variables support
- ✅ SQLite fallback for serverless
- ✅ API endpoints properly configured

---

## 🔧 **Post-Deployment Steps**

1. **Test API endpoints**:
   - Visit `https://your-backend-app.vercel.app/api/test`
   - Should return: `{"message": "Server is running!", "timestamp": "..."}`

2. **Test frontend**:
   - Visit your frontend URL
   - Try the Domain Generator
   - Should connect to backend automatically

---

## 🚨 **Important Notes**

- **API Keys**: Make sure to set your OpenAI API key in Vercel environment variables
- **CORS**: Backend automatically allows your frontend domain
- **Database**: Uses in-memory storage on Vercel (no SQLite file system)
- **Cold Starts**: First request might be slower due to serverless cold start

---

## 🎯 **Recommended: Option A (Separate Deployments)**

This gives you:
- ✅ Independent scaling
- ✅ Separate domains/subdomains
- ✅ Easier debugging
- ✅ Better performance
- ✅ Cleaner separation of concerns
