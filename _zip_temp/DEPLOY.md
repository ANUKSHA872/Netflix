# Deploy StreamNest (Single Deployment)

Your project is configured to deploy **frontend + backend together** as one app.

## Quick Deploy on Render

1. **Push to GitHub** – Commit and push your code.

2. **Create Web Service** – Go to [render.com](https://render.com) → New → Web Service.

3. **Connect repo** – Link your GitHub repository.

4. **Configure:**
   - **Root Directory:** (leave empty – use project root)
   - **Build Command:** `npm run install:all && npm run build`
   - **Start Command:** `npm run start`

5. **Environment Variables** (Settings → Environment):
   - `MONGODB_URI` – Your MongoDB Atlas connection string
   - `JWT_SECRET` – A strong secret (e.g. `openssl rand -hex 32`)
   - `NODE_ENV` – `production` (Render sets this automatically)

6. **Deploy** – Click Deploy.

## How It Works

- **Build:** Installs frontend + backend deps, builds React to `frontend/dist`
- **Start:** Runs Express server on port 5000
- **Production:** Express serves API at `/api/*` and static files from `frontend/dist` at `/`

## Other Platforms

- **Railway:** Same build/start commands. Add env vars in Railway dashboard.
- **Vercel:** Use a custom server or deploy backend separately. Single deployment is simpler on Render/Railway.
