import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import movieRoutes from './routes/movies.js';
import userRoutes from './routes/users.js';
import { db } from './db.js';
import { sampleMovies } from './seedData.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: (origin, cb) => cb(null, true),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

function ensureMovies() {
  const movies = db.movies.getAll();
  const expectedCount = sampleMovies.length;
  if (movies.length === 0 || movies.length < expectedCount) {
    db.movies.deleteAll();
    db.movies.insertMany(sampleMovies);
  }
}

ensureMovies();

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/users', userRoutes);

export default app;
