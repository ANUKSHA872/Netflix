import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isVercel = !!process.env.VERCEL;

const id = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

// In-memory storage for Vercel (serverless filesystem is read-only)
let _users = [];
let _movies = [];

const DATA_DIR = isVercel ? null : path.join(__dirname, 'data');

function ensureDataDir() {
  if (!isVercel && DATA_DIR && !fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function read(file) {
  if (isVercel) {
    return file === 'users.json' ? _users : _movies;
  }
  ensureDataDir();
  const p = path.join(DATA_DIR, file);
  if (!fs.existsSync(p)) return file === 'users.json' ? [] : [];
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function write(file, data) {
  if (isVercel) {
    if (file === 'users.json') _users = data;
    else _movies = data;
    return;
  }
  ensureDataDir();
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2));
}

export const db = {
  users: {
    getAll: () => read('users.json'),
    getByEmail: (email) => {
      const u = read('users.json').find(x => x.email?.toLowerCase() === email?.toLowerCase());
      return u ? { ...u, _id: u.id } : null;
    },
    getById: (id) => {
      const u = read('users.json').find(x => x.id === id);
      return u ? { ...u, _id: u.id } : null;
    },
    create: (user) => {
      const users = read('users.json');
      const newUser = { ...user, id: id(), myList: [] };
      users.push(newUser);
      write('users.json', users);
      return { ...newUser, _id: newUser.id };
    },
    update: (id, updates) => {
      const users = read('users.json');
      const i = users.findIndex(u => u.id === id);
      if (i === -1) return null;
      users[i] = { ...users[i], ...updates };
      write('users.json', users);
      return { ...users[i], _id: users[i].id };
    }
  },
  movies: {
    getAll: () => read('movies.json').map(m => ({ ...m, _id: m.id })),
    getById: (id) => {
      const m = read('movies.json').find(x => x.id === id);
      return m ? { ...m, _id: m.id } : null;
    },
    create: (movie) => {
      const movies = read('movies.json');
      const newMovie = { ...movie, id: id(), createdAt: Date.now() };
      movies.push(newMovie);
      write('movies.json', movies);
      return { ...newMovie, _id: newMovie.id };
    },
    update: (id, updates) => {
      const movies = read('movies.json');
      const i = movies.findIndex(m => m.id === id);
      if (i === -1) return null;
      movies[i] = { ...movies[i], ...updates };
      write('movies.json', movies);
      return { ...movies[i], _id: movies[i].id };
    },
    delete: (id) => {
      const movies = read('movies.json').filter(m => m.id !== id);
      write('movies.json', movies);
      return true;
    },
    deleteAll: () => write('movies.json', []),
    insertMany: (items) => {
      const movies = read('movies.json');
      const newOnes = items.map(m => ({ ...m, id: id(), createdAt: Date.now() }));
      write('movies.json', [...movies, ...newOnes]);
      return newOnes.map(m => ({ ...m, _id: m.id }));
    }
  }
};
