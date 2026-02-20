import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import { moviesAPI } from '../api';

const CATEGORIES = ['trending', 'popular', 'dramas', 'action', 'comedy'];
const LANGUAGES = [
  { value: 'english', label: 'English' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'kannada', label: 'Kannada' },
];

export default function Admin() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: '',
    description: '',
    imageUrl: '',
    videoUrl: '',
    trailerUrl: '',
    category: 'action',
    language: 'english',
    rating: 5,
  });
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = () => {
    moviesAPI.getAll()
      .then(setMovies)
      .catch(() => setMovies([]))
      .finally(() => setLoading(false));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setSubmitting(true);
    try {
      const data = await moviesAPI.create(form);
      if (data.message && !data._id) {
        setMessage(data.message);
        return;
      }
      setForm({ title: '', description: '', imageUrl: '', videoUrl: '', trailerUrl: '', category: 'action', language: 'english', rating: 5 });
      setMessage('Movie added successfully!');
      loadMovies();
    } catch (err) {
      setMessage('Failed to add movie');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this movie?')) return;
    try {
      await moviesAPI.delete(id);
      loadMovies();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReseed = async () => {
    if (!confirm('This will replace ALL movies with the sample catalog. Continue?')) return;
    setMessage('');
    setSubmitting(true);
    try {
      const data = await moviesAPI.seed();
      if (data.message) {
        setMessage(data.message);
        loadMovies();
      } else {
        setMessage('Reseed failed');
      }
    } catch (err) {
      setMessage('Reseed failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-netflix-black pb-20">
      <Navbar />
      <div className="pt-24 max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Add Movie</h1>
          <button
            onClick={handleReseed}
            disabled={submitting}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded font-medium disabled:opacity-50"
          >
            Reseed Catalog (43 movies)
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 mb-12">
          {message && (
            <div className={`p-3 rounded ${message.includes('success') || message.includes('Seeded') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {message}
            </div>
          )}
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
            required
            className="w-full bg-netflix-gray border border-gray-600 rounded px-4 py-3 text-white"
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
            rows={3}
            className="w-full bg-netflix-gray border border-gray-600 rounded px-4 py-3 text-white resize-none"
          />
          <input
            type="url"
            placeholder="Image URL"
            value={form.imageUrl}
            onChange={(e) => setForm(f => ({ ...f, imageUrl: e.target.value }))}
            required
            className="w-full bg-netflix-gray border border-gray-600 rounded px-4 py-3 text-white"
          />
          <input
            type="url"
            placeholder="Video URL (full movie or sample)"
            value={form.videoUrl}
            onChange={(e) => setForm(f => ({ ...f, videoUrl: e.target.value }))}
            required
            className="w-full bg-netflix-gray border border-gray-600 rounded px-4 py-3 text-white"
          />
          <input
            type="url"
            placeholder="Trailer URL (YouTube link, e.g. https://youtube.com/watch?v=...)"
            value={form.trailerUrl}
            onChange={(e) => setForm(f => ({ ...f, trailerUrl: e.target.value }))}
            className="w-full bg-netflix-gray border border-gray-600 rounded px-4 py-3 text-white"
          />
          <div className="flex gap-4 flex-wrap">
            <select
              value={form.category}
              onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
              className="bg-netflix-gray border border-gray-600 rounded px-4 py-3 text-white"
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={form.language}
              onChange={(e) => setForm(f => ({ ...f, language: e.target.value }))}
              className="bg-netflix-gray border border-gray-600 rounded px-4 py-3 text-white"
            >
              {LANGUAGES.map(l => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Rating (0-10)"
              min={0}
              max={10}
              step={0.1}
              value={form.rating}
              onChange={(e) => setForm(f => ({ ...f, rating: parseFloat(e.target.value) || 0 }))}
              className="bg-netflix-gray border border-gray-600 rounded px-4 py-3 text-white w-32"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-netflix-red hover:bg-red-600 rounded font-medium disabled:opacity-50"
          >
            {submitting ? 'Adding...' : 'Add Movie'}
          </button>
        </form>

        <h2 className="text-2xl font-bold mb-4">All Movies ({movies.length})</h2>
        <div className="space-y-4">
          {movies.map((m) => (
            <div
              key={m._id}
              className="flex items-center gap-4 p-4 bg-netflix-dark rounded"
            >
              <img src={m.imageUrl} alt={m.title} className="w-16 h-24 object-cover rounded" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{m.title}</p>
                <p className="text-sm text-gray-400 capitalize">{m.category}</p>
              </div>
              <button
                onClick={() => handleDelete(m._id)}
                className="px-3 py-1 text-sm bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
