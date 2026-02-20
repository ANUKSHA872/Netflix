import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Movie from './models/Movie.js';
import { sampleMovies } from './seedData.js';

dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/streamnest');
  
  const adminExists = await User.findOne({ isAdmin: true });
  if (!adminExists) {
    await User.create({
      name: 'Admin',
      email: 'admin@streamnest.com',
      password: 'admin123',
      isAdmin: true,
    });
    console.log('Admin created: admin@streamnest.com / admin123');
  }

  const count = await Movie.countDocuments();
  if (count === 0) {
    await Movie.insertMany(sampleMovies);
    console.log('Sample movies added (with YouTube trailers)');
  } else {
    console.log('Movies already exist. Delete movies in Admin to re-seed.');
  }

  await mongoose.disconnect();
  console.log('Seed complete');
}

seed().catch(console.error);
