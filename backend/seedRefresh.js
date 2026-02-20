import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Movie from './models/Movie.js';
import { sampleMovies } from './seedData.js';

dotenv.config();

async function refresh() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/streamnest');
  await Movie.deleteMany({});
  await Movie.insertMany(sampleMovies);
  console.log('Movies refreshed with new image URLs');
  await mongoose.disconnect();
}

refresh().catch(console.error);
