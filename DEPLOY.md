# Deploy Guide

## GitHub Pages (with API)

GitHub Pages serves only static files. To make login/signup work, connect to the Vercel API.

### Step 1: Deploy to Vercel (get API URL)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import your repo
3. Deploy (use default settings, Root Directory: empty)
4. Copy your Vercel URL (e.g. `https://netflix-xxx.vercel.app`)

### Step 2: Deploy to GitHub Pages with API

**Option A – Use config file**

```powershell
cd d:\Netflix\frontend
copy .env.gh.example .env.gh
# Edit .env.gh and set: VITE_API_URL=https://your-vercel-app.vercel.app

cd d:\Netflix
npm run deploy:api
```

**Option B – Use environment variable**

```powershell
cd d:\Netflix
$env:VITE_API_URL="https://your-vercel-app.vercel.app"
npm run deploy:api
```

Replace `your-vercel-app` with your actual Vercel project URL.

### Step 3: Configure GitHub Pages

1. GitHub repo → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **gh-pages**, Folder: **/ (root)**
4. Save

Your site: **https://anuksha872.github.io/Netflix/**
