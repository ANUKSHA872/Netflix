import { useState, useEffect } from 'react';
import { moviesAPI } from '../api';
import MovieCard from './MovieCard';

export default function SearchBar({ initialQuery = '', onClose, myListIds = [] }) {
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearchError(null);
      return;
    }
    const timer = setTimeout(() => {
      setLoading(true);
      setSearchError(null);
      moviesAPI.getAll({ search: query.trim() })
        .then((data) => {
          setResults(Array.isArray(data) ? data : []);
        })
        .catch((err) => {
          setResults([]);
          setSearchError('Search failed. Make sure the backend is running on port 5000.');
        })
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 p-4 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-netflix-gray border border-gray-600 rounded px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-netflix-red"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-2 hover:bg-netflix-gray rounded transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {loading && <p className="text-gray-400">Searching...</p>}
        {searchError && (
          <p className="text-amber-400 mb-4">{searchError}</p>
        )}
        {!loading && !searchError && query && results.length === 0 && (
          <p className="text-gray-400">No movies found for "{query}". Try reseeding the catalog from Admin.</p>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {results.map((movie) => (
            <MovieCard
              key={movie._id}
              movie={movie}
              inMyList={myListIds.includes(movie._id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
