# Vercel Setup - Fix API 404

If you see **"API error (404)"** on signup/login, the backend is not deployed. Check these settings:

## 1. Root Directory MUST be empty

In Vercel → Your Project → **Settings** → **General**:

- **Root Directory:** Leave **empty** or set to `.`
- If it's set to `frontend`, the `api/` folder won't be deployed → 404

## 2. Verify project structure

Your repo should have at the root:
```
Netflix/
├── api/
│   └── index.js      ← Backend (required)
├── backend/
├── frontend/
├── dist/             ← Created by build
└── vercel.json
```

## 3. Redeploy

After fixing Root Directory:
1. Go to **Deployments**
2. Click **⋮** on latest deployment → **Redeploy**

## 4. Test the API

Visit: `https://your-app.vercel.app/api/movies`

If you see JSON (movie list), the API works. If you see 404, Root Directory is still wrong.
