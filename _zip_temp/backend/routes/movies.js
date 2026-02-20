import express from 'express';
import Movie from '../models/Movie.js';
import { sampleMovies } from '../seedData.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/seed', protect, adminOnly, async (req, res) => {
  try {
    await Movie.deleteMany({});
    await Movie.insertMany(sampleMovies);
    res.json({ message: `Seeded ${sampleMovies.length} movies` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { category, search, language } = req.query;
    let query = {};
    if (category) query.category = category;
    if (language) query.language = language;
    if (search && typeof search === 'string' && search.trim()) {
      const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { title: { $regex: escaped, $options: 'i' } },
        { description: { $regex: escaped, $options: 'i' } }
      ];
    }
    const movies = await Movie.find(query).sort({ createdAt: -1 });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const categories = ['trending', 'popular', 'dramas', 'action', 'comedy'];
    const result = {};
    for (const cat of categories) {
      result[cat] = await Movie.find({ category: cat }).limit(12);
    }
    result.recently = await Movie.find().sort({ createdAt: -1 }).limit(12);
    result.languages = {
      english: await Movie.find({ $or: [{ language: 'english' }, { language: { $exists: false } }] }).limit(12),
      hindi: await Movie.find({ language: 'hindi' }).limit(12),
      kannada: await Movie.find({ language: 'kannada' }).limit(12),
    };
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
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
    const movie = await Movie.create({
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
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json({ message: 'Movie deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
