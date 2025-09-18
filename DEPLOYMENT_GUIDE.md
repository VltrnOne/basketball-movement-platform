# 🚀 Basketball Movement Intelligence Platform - Deployment Guide

## ✅ Current Status

**GitHub Repository**: ✅ **COMPLETED**
- Repository: `https://github.com/VltrnOne/basketball-movement-platform`
- All code committed and pushed
- Ready for deployment

## 🎯 Next Steps for Deployment

### 1. **Vercel Deployment (Frontend Staging)**

**Option A: Vercel CLI (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend directory
cd frontend

# Deploy to Vercel
vercel --prod

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? [Your account]
# - Link to existing project? N
# - Project name: basketball-movement-platform
# - Directory: ./frontend
# - Override settings? N
```

**Option B: Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import from GitHub: `VltrnOne/basketball-movement-platform`
4. Set Root Directory: `frontend`
5. Deploy

**Environment Variables for Vercel:**
```
VITE_SUPABASE_URL=https://qijavtpkszgpaqeohrwt.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_API_URL=https://your-backend-url.com
```

### 2. **SiteGround Deployment (Frontend Production)**

**Files Ready for Upload:**
- `siteground-deployment.zip` (116 KB) - Contains built frontend files
- `basketball-platform-deployment.zip` (116 KB) - Alternative package

**Upload Process:**
1. **Login to SiteGround cPanel**
2. **Open File Manager**
3. **Navigate to `public_html`** (or your domain folder)
4. **Upload and extract** `siteground-deployment.zip`
5. **Set permissions** (644 for files, 755 for folders)

**Files to Upload:**
```
public_html/
├── index.html
├── vite.svg
└── assets/
    ├── index-[hash].css
    └── index-[hash].js
```

### 3. **Backend Deployment (Supabase + Railway)**

**Option A: Railway (Recommended)**
1. Go to [railway.app](https://railway.app)
2. Connect GitHub repository
3. Select `backend` folder
4. Set environment variables:
   ```
   SUPABASE_URL=https://qijavtpkszgpaqeohrwt.supabase.co
   SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```
5. Deploy

**Option B: Render**
1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Set Root Directory: `backend`
5. Deploy

### 4. **Domain Configuration**

**SiteGround Domain Setup:**
1. **Point Domain**: `datdatit.com` → SiteGround server
2. **SSL Certificate**: Enable HTTPS in cPanel
3. **DNS Settings**: Update A record to SiteGround IP

**Vercel Domain Setup:**
1. **Custom Domain**: Add `staging.datdatit.com` in Vercel dashboard
2. **DNS**: Point subdomain to Vercel

## 📦 Deployment Packages Ready

### For SiteGround:
- **File**: `siteground-deployment.zip` (116 KB)
- **Contents**: Built frontend files ready for upload
- **Location**: Project root directory

### For Complete Backup:
- **File**: `basketball-platform-complete.zip` (14.2 MB)
- **Contents**: Full project with source code
- **Use**: Development and backup purposes

## 🔧 Build Commands

### Frontend Build:
```bash
cd frontend
npm install
npm run build
# Output: dist/ folder with production files
```

### Backend Run:
```bash
cd backend
pip install -r requirements.txt
python main.py
# Runs on http://localhost:8000
```

## 🌐 Expected URLs After Deployment

- **GitHub**: `https://github.com/VltrnOne/basketball-movement-platform`
- **Vercel Staging**: `https://basketball-movement-platform.vercel.app`
- **SiteGround Production**: `https://datdatit.com`
- **Backend API**: `https://your-backend-url.railway.app` (or render.com)

## 🚨 Troubleshooting

### Common Issues:

1. **Build Errors**: Run `npm run build` locally first
2. **Environment Variables**: Ensure all required variables are set
3. **CORS Issues**: Update backend CORS settings for production domains
4. **File Permissions**: Set 644 for files, 755 for folders on SiteGround

### Rollback Strategy:
- **Vercel**: Revert to previous deployment in dashboard
- **SiteGround**: Upload previous build files
- **GitHub**: Revert to previous commit

## 📊 Monitoring

### Vercel Analytics:
- Page views and performance metrics
- Core Web Vitals monitoring
- User behavior tracking

### Supabase Monitoring:
- Database performance
- API usage statistics
- Authentication metrics

## 🎉 Success Checklist

- [x] GitHub repository created and code pushed
- [x] Frontend build working locally
- [x] Deployment packages created
- [ ] Vercel deployment completed
- [ ] SiteGround deployment completed
- [ ] Backend deployment completed
- [ ] Domain configuration completed
- [ ] End-to-end testing completed

---

**Your Basketball Movement Intelligence Platform is ready for deployment!** 🏀✨

All the hard work is done - now it's just a matter of following the deployment steps above to get your platform live on the web.
