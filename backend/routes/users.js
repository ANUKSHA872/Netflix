import express from 'express';
import { db } from '../db.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/me', protect, async (req, res) => {
  try {
    const user = db.users.getById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const movies = db.movies.getAll();
    const myList = (user.myList || []).map(id => movies.find(m => m.id === id)).filter(Boolean);
    const { password, ...safe } = user;
    res.json({ ...safe, myList });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/mylist/:movieId', protect, async (req, res) => {
  try {
    const { movieId } = req.params;
    const user = db.users.getById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const list = user.myList || [];
    const idx = list.indexOf(movieId);
    const newList = idx === -1 ? [...list, movieId] : list.filter((_, i) => i !== idx);
    db.users.update(req.user.id, { myList: newList });
    const movies = db.movies.getAll();
    const populated = newList.map(id => movies.find(m => m.id === id)).filter(Boolean);
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/mylist', protect, async (req, res) => {
  try {
    const user = db.users.getById(req.user.id);
    const movies = db.movies.getAll();
    const myList = (user?.myList || []).map(id => movies.find(m => m.id === id)).filter(Boolean);
    res.json(myList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
