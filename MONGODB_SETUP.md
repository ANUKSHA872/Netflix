# Fix "Database connection failed"

## 1. MongoDB Atlas – Allow your IP

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) and log in
2. Click **Network Access** (left sidebar)
3. Click **Add IP Address**
4. Choose **Allow Access from Anywhere** → `0.0.0.0/0`
5. Click **Confirm**

## 2. Check your connection string

1. In Atlas, go to **Database** → **Connect** → **Connect your application**
2. Copy the connection string
3. Replace `<password>` with your actual database password
4. If your password has special characters (`@`, `#`, `:`, etc.), URL-encode them:
   - `@` → `%40`
   - `#` → `%23`
   - `:` → `%3A`

## 3. Update `.env`

Edit `backend/.env`:

```
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/streamnest?retryWrites=true&w=majority
```

## 4. Restart the backend

```powershell
# Stop the server (Ctrl+C), then:
npm run dev
```

## 5. Check the backend console

- **MongoDB connected** → connection is working
- **MongoDB connection error** → follow steps 1–3 again
