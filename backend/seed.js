import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { db } from './db.js';
import { sampleMovies } from './seedData.js';

dotenv.config();

async function seed() {
  const adminExists = db.users.getAll().some(u => u.isAdmin);
  if (!adminExists) {
    const hashed = await bcrypt.hash('admin123', 10);
    db.users.create({
      name: 'Admin',
      email: 'admin@streamnest.com',
      password: hashed,
      isAdmin: true,
    });
    console.log('Admin created: admin@streamnest.com / admin123');
  }

  const movies = db.movies.getAll();
  if (movies.length === 0) {
    db.movies.insertMany(sampleMovies);
    console.log('Sample movies added (with YouTube trailers)');
  } else {
    console.log('Movies already exist. Delete movies in Admin to re-seed.');
  }

  console.log('Seed complete');
}

seed().catch(console.error);
