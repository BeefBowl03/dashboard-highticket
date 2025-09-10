# 🚀 Single Repository Vercel Deployment

## ✅ **Ready for Deployment!**

Your monorepo is now configured for **single-domain Vercel deployment**. Both frontend and backend will be deployed from the same repository to one URL.

## 📋 **Deployment Steps**

### **1. Push to GitHub**
```bash
git add .
git commit -m "Configure monorepo for Vercel deployment"
git push origin main
```

### **2. Deploy to Vercel**

1. **Go to [vercel.com](https://vercel.com)**
2. **Import your GitHub repository**
3. **Vercel will automatically detect the monorepo structure**

### **3. Set Environment Variables**

In Vercel dashboard, add these environment variables:

```
OPENAI_API_KEY=your_openai_api_key_here
NAMECOM_USERNAME=your_namecom_username
NAMECOM_TOKEN=your_namecom_api_token
```

### **4. Deploy**

- Vercel will automatically:
  - Build the React frontend (`dashboard-app`)
  - Deploy the Node.js backend as serverless functions (`dashboard-backend`)
  - Route `/api/*` requests to backend
  - Serve frontend for all other routes

## 🎯 **How It Works**

### **URL Structure**
- **Frontend**: `https://your-app.vercel.app/` (dashboard, policy generator)
- **Backend API**: `https://your-app.vercel.app/api/generate-domains`
- **Domain Generator**: `https://your-app.vercel.app/domain-generator`

### **Automatic Routing**
- `/api/*` → Backend serverless functions
- `/*` → React frontend
- Static assets served from frontend build

## 🔧 **Local Development**

```bash
# Install all dependencies
npm run install:all

# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:frontend  # Port 3000
npm run dev:backend   # Port 3001
```

## ✅ **What's Configured**

- ✅ **Monorepo structure** with workspaces
- ✅ **Vercel deployment config** (`vercel.json`)
- ✅ **API routing** (frontend calls same domain)
- ✅ **Environment detection** (production vs development)
- ✅ **CORS configuration** for same-domain deployment
- ✅ **Build scripts** for both frontend and backend

## 🚀 **Benefits**

- **Single URL**: Everything accessible from one domain
- **No CORS issues**: Frontend and backend on same domain
- **Simplified deployment**: One repository, one deployment
- **Cost effective**: Single Vercel project
- **Easy management**: One set of environment variables

## 🎉 **Ready to Deploy!**

Your unified dashboard with Policy Generator and Domain Generator is ready for Vercel deployment as a single repository!
