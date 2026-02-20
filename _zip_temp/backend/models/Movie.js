import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  imageUrl: { type: String, required: true },
  videoUrl: { type: String, required: true },
  trailerUrl: { type: String, default: '' },
  category: { 
    type: String, 
    required: true, 
    enum: ['trending', 'popular', 'dramas', 'action', 'comedy'] 
  },
  language: { 
    type: String, 
    default: 'english', 
    enum: ['english', 'hindi', 'kannada'] 
  },
  rating: { type: Number, default: 0, min: 0, max: 10 }
}, { timestamps: true });

export default mongoose.model('Movie', movieSchema);
