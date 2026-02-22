import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import movieRoutes from './routes/movies.js';
import userRoutes from './routes/users.js';
import { db } from './db.js';
import { sampleMovies } from './seedData.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

function ensureMovies() {
  const movies = db.movies.getAll();
  const expectedCount = sampleMovies.length;
  if (movies.length === 0 || movies.length < expectedCount) {
    db.movies.deleteAll();
    db.movies.insertMany(sampleMovies);
    console.log(`Catalog updated: ${sampleMovies.length} movies (English, Hindi, Kannada)`);
  }
}

ensureMovies();

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/users', userRoutes);

// Serve frontend in production (single deployment)
if (isProduction) {
  const frontendPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(frontendPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  if (isProduction) {
    console.log(`\n  ➜  StreamNest: http://localhost:${PORT}\n`);
  } else {
    console.log('\n  ➜  StreamNest: http://localhost:5173');
    console.log('  ➜  API:       http://localhost:5000\n');
  }
});
