# StreamNest

A Netflix-like full-stack streaming web application built with React, Node.js, Express, and MongoDB.

## Features

- **Landing Page** - Hero banner, Get Started, Sign In
- **Authentication** - JWT-based Sign Up / Login
- **User Dashboard** - Movie categories (Trending, Popular, Dramas, Action, Comedy)
- **Movie Player** - Watch videos with description
- **Admin Panel** - Add movies (title, category, image, video URL, description)
- **My List** - Save movies to your list
- **Search** - Find movies by title
- **Protected Routes** - Dashboard requires login
- **Responsive Design** - Mobile and desktop

## Tech Stack

- **Frontend:** React, Tailwind CSS, React Router
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Auth:** JWT

## Setup

### Prerequisites

- Node.js 18+
- **MongoDB** (local or Atlas) — **must be running** before starting the app
  - Local: Install MongoDB and run `mongod`, or use MongoDB Atlas and set `MONGODB_URI` in `backend/.env`

### Installation

1. Install dependencies:
   ```bash
   npm run install:all
   ```

2. Create `.env` in `backend/` (or copy from `.env.example`):
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/streamnest
   JWT_SECRET=your-secret-key
   ```

3. Seed the database (creates admin user + sample movies):
   ```bash
   cd backend && npm run seed
   ```
   - Admin: `admin@streamnest.com` / `admin123`

4. Start the app:
   ```bash
   npm run dev
   ```

5. Open http://localhost:5173

### Making a User Admin

To make an existing user admin via MongoDB:

```javascript
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { isAdmin: true } }
)
```

## Project Structure

```
├── backend/
│   ├── models/       # User, Movie
│   ├── routes/       # auth, movies, users
│   ├── middleware/   # JWT auth
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── api.js
│   └── ...
└── package.json
```

## API Endpoints

- `POST /api/auth/register` - Sign up
- `POST /api/auth/login` - Login
- `GET /api/movies` - List movies (optional: ?category=, ?search=)
- `GET /api/movies/categories` - Movies by category
- `GET /api/movies/:id` - Get movie
- `POST /api/movies` - Add movie (admin)
- `POST /api/users/mylist/:movieId` - Toggle My List
