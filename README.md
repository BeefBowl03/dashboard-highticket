# 🚀 Unified Dashboard

A comprehensive dashboard combining multiple AI-powered tools for high-ticket dropshipping businesses.

## 🛠️ **Tools Included**

- **📋 Store Policy Generator**: Generate legal policies (Privacy Policy, Terms of Service, etc.)
- **🌐 Domain Generator**: AI-powered domain name generation with competitor analysis
- **🎨 Website Image Creator**: Create product images for your store
- **💡 Product Ideation**: Generate product ideas and market research

## 🏗️ **Architecture**

This is a **monorepo** containing:
- `dashboard-app/` - React frontend (Port 3000)
- `dashboard-backend/` - Node.js backend (Port 3001)

## 🚀 **Quick Start**

### **Local Development**

1. **Install all dependencies**:
   ```bash
   npm run install:all
   ```

2. **Start both frontend and backend**:
   ```bash
   npm run dev
   ```

3. **Or start individually**:
   ```bash
   # Frontend only
   npm run dev:frontend
   
   # Backend only  
   npm run dev:backend
   ```

4. **Access the dashboard**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

### **Environment Setup**

1. **Backend Environment** (`dashboard-backend/.env`):
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   NAMECOM_USERNAME=your_namecom_username
   NAMECOM_TOKEN=your_namecom_api_token
   PORT=3001
   FRONTEND_URL=http://localhost:3000
   ```

2. **Frontend Environment** (`dashboard-app/.env`):
   ```env
   REACT_APP_API_URL=http://localhost:3001
   ```

## 🌐 **Vercel Deployment**

This monorepo is configured for **single-domain Vercel deployment**:

### **Deploy to Vercel**

1. **Connect your repository** to Vercel
2. **Set Environment Variables** in Vercel dashboard:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   NAMECOM_USERNAME=your_namecom_username
   NAMECOM_TOKEN=your_namecom_api_token
   ```
3. **Deploy** - Vercel will automatically:
   - Build the React frontend
   - Deploy the Node.js backend as serverless functions
   - Route `/api/*` to backend, everything else to frontend

### **Post-Deployment**

- **Frontend**: Available at your Vercel URL
- **Backend API**: Available at `your-vercel-url.com/api/*`
- **Domain Generator**: `your-vercel-url.com/api/generate-domains`
- **Policy Generator**: Works entirely in frontend

## 🔧 **API Endpoints**

### **Domain Generator**
- `POST /api/generate-domains` - Generate domain suggestions
- `POST /api/generate-more` - Generate additional domains
- `GET /api/test` - Health check

### **Policy Generator**
- Works entirely in frontend (no backend required)

## 📁 **Project Structure**

```
├── dashboard-app/           # React Frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── data/          # Policy templates & questions
│   │   └── types/         # TypeScript interfaces
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── dashboard-backend/      # Node.js Backend
│   ├── server.js          # Main server file
│   ├── competitor-finder.js
│   ├── namecom-api.js
│   ├── domain-databases.js
│   └── package.json       # Backend dependencies
├── vercel.json            # Vercel deployment config
├── package.json           # Monorepo management
└── README.md             # This file
```

## 🎯 **Features**

### **Domain Generator**
- ✅ AI-powered competitor analysis
- ✅ Real-time domain availability checking
- ✅ Premium domain suggestions
- ✅ Pattern recognition
- ✅ Multiple generation options

### **Policy Generator**
- ✅ Multi-step questionnaire
- ✅ Multiple policy types
- ✅ HTML output generation
- ✅ Copy-to-clipboard functionality
- ✅ Professional templates

## 🔑 **Required API Keys**

- **OpenAI API**: Required for AI-powered domain generation
- **Name.com API**: Optional, for real-time domain availability
- **Google Search API**: Optional, for enhanced competitor finding

## 🚨 **Important Notes**

- **Monorepo**: Both frontend and backend in single repository
- **Single Domain**: Deploys to one Vercel URL
- **Serverless**: Backend runs as Vercel serverless functions
- **Environment**: Automatically detects production vs development

## 📞 **Support**

For issues or questions, check the individual tool documentation or create an issue in the repository.