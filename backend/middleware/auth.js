import jwt from 'jsonwebtoken';
import { db } from '../db.js';

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = db.users.getById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    const { password, ...safe } = user;
    req.user = safe;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const adminOnly = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};
