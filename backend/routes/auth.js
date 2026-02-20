import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '7d' }
  );
};

const isDbError = (err) =>
  err?.message?.includes('buffering') ||
  err?.message?.includes('timed out') ||
  err?.name === 'MongoServerSelectionError' ||
  err?.name === 'MongoNetworkError';

const getDbErrorMessage = () =>
  'Database connection failed. Please ensure MongoDB is running (or check your connection string) and try again.';

router.post('/register', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: getDbErrorMessage() });
  }
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password' });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    const isFirstUser = (await User.countDocuments()) === 0;
    const user = await User.create({ name, email, password, isAdmin: isFirstUser });
    const token = generateToken(user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token
    });
  } catch (err) {
    const message = isDbError(err) ? getDbErrorMessage() : err.message;
    res.status(isDbError(err) ? 503 : 500).json({ message });
  }
});

router.post('/login', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: getDbErrorMessage() });
  }
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    const user = await User.findOne({ email }).populate('myList');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user._id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      myList: user.myList,
      token
    });
  } catch (err) {
    const message = isDbError(err) ? getDbErrorMessage() : err.message;
    res.status(isDbError(err) ? 503 : 500).json({ message });
  }
});

export default router;
