import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').populate('myList');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/mylist/:movieId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { movieId } = req.params;
    const idx = user.myList.indexOf(movieId);
    if (idx === -1) {
      user.myList.push(movieId);
    } else {
      user.myList.splice(idx, 1);
    }
    await user.save();
    const updated = await User.findById(req.user._id).populate('myList');
    res.json(updated.myList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/mylist', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('myList');
    res.json(user.myList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
