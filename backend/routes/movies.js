import express from 'express';
import { sampleMovies } from '../seedData.js';
import { db } from '../db.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

function filterMovies(movies, { category, language, search }) {
  let list = [...movies];
  if (category) list = list.filter(m => m.category === category);
  if (language) {
    if (language === 'english') {
      list = list.filter(m => !m.language || m.language === 'english');
    } else {
      list = list.filter(m => m.language === language);
    }
  }
  if (search && typeof search === 'string' && search.trim()) {
    const s = search.trim().toLowerCase();
    list = list.filter(m =>
      (m.title || '').toLowerCase().includes(s) ||
      (m.description || '').toLowerCase().includes(s)
    );
  }
  return list;
}

router.post('/seed', protect, adminOnly, async (req, res) => {
  try {
    db.movies.deleteAll();
    db.movies.insertMany(sampleMovies);
    res.json({ message: `Seeded ${sampleMovies.length} movies` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const movies = db.movies.getAll();
    const filtered = filterMovies(movies, req.query);
    res.json(filtered.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const movies = db.movies.getAll();
    const categories = ['trending', 'popular', 'dramas', 'action', 'comedy'];
    const result = {};
    for (const cat of categories) {
      result[cat] = movies.filter(m => m.category === cat).slice(0, 12);
    }
    result.recently = [...movies].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)).slice(0, 12);
    result.languages = {
      english: movies.filter(m => !m.language || m.language === 'english').slice(0, 12),
      hindi: movies.filter(m => m.language === 'hindi').slice(0, 12),
      kannada: movies.filter(m => m.language === 'kannada').slice(0, 12),
    };
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const movie = db.movies.getById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, description, imageUrl, videoUrl, trailerUrl, category, language, rating } = req.body;
    if (!title || !imageUrl || !videoUrl || !category) {
      return res.status(400).json({ message: 'Title, imageUrl, videoUrl and category required' });
    }
    const movie = db.movies.create({
      title,
      description: description || '',
      imageUrl,
      videoUrl,
      trailerUrl: trailerUrl || '',
      category,
      language: language || 'english',
      rating: rating || 0
    });
    res.status(201).json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const movie = db.movies.update(req.params.id, req.body);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const existed = db.movies.getById(req.params.id);
    if (!existed) return res.status(404).json({ message: 'Movie not found' });
    db.movies.delete(req.params.id);
    res.json({ message: 'Movie deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
