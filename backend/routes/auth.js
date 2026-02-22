import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from '../db.js';

const router = express.Router();

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password' });
    }
    const exists = db.users.getByEmail(email);
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    const isFirstUser = db.users.getAll().length === 0;
    const hashed = await bcrypt.hash(password, 10);
    const user = db.users.create({ name, email, password: hashed, isAdmin: isFirstUser });
    const token = generateToken(user.id);
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    const user = db.users.getByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const movies = db.movies.getAll();
    const myList = (user.myList || []).map(id => movies.find(m => m.id === id || m._id === id)).filter(Boolean);
    const token = generateToken(user.id);
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      myList,
      token
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
