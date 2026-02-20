import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import movieRoutes from './routes/movies.js';
import userRoutes from './routes/users.js';
import Movie from './models/Movie.js';
import { sampleMovies } from './seedData.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

async function ensureMovies() {
  const count = await Movie.countDocuments();
  const expectedCount = sampleMovies.length;
  if (count === 0 || count < expectedCount) {
    await Movie.deleteMany({});
    await Movie.insertMany(sampleMovies);
    console.log(`Catalog updated: ${sampleMovies.length} movies (English, Hindi, Kannada)`);
  }
}

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/streamnest', {
  serverSelectionTimeoutMS: 5000,
})
  .then(() => {
    console.log('MongoDB connected');
    return ensureMovies();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    console.error('Make sure MongoDB is running or check your Atlas connection string.');
  });

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
