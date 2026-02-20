import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../api';

export default function HeroBanner({ movie }) {
  const { user, updateMyList } = useAuth();
  const inMyList = user?.myList?.some(m => (m._id || m) === movie?._id);

  const handleMyList = async (e) => {
    e.preventDefault();
    if (!user || !movie) return;
    try {
      const list = await usersAPI.toggleMyList(movie._id);
      updateMyList(list);
    } catch (err) {
      console.error(err);
    }
  };

  if (!movie) return null;

  return (
    <div className="relative h-[75vh] min-h-[500px] mb-4 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${movie.imageUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-12 pb-12">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-wide mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            {movie.title}
          </h1>
          <p className="text-gray-300 text-lg mb-4 capitalize">{movie.category}</p>
          <div className="flex items-center gap-4 mb-6">
            <span className="flex items-center gap-1.5 px-2 py-1 bg-amber-500/20 rounded text-amber-400 text-sm font-medium">
              <span className="text-amber-500 font-bold">★</span> {movie.rating?.toFixed(1) || 'N/A'}/10
            </span>
            <span className="text-netflix-red font-semibold text-sm">Streaming Now</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to={`/watch/${movie._id}`}
              className="flex items-center gap-2 px-8 py-3 bg-netflix-red hover:bg-red-600 text-white font-semibold rounded transition"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Play
            </Link>
            <Link
              to={`/watch/${movie._id}`}
              className="flex items-center gap-2 px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded hover:bg-white/10 transition"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch Trailer
            </Link>
            {user && (
              <button
                onClick={handleMyList}
                className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-400 bg-black/50 hover:bg-gray-500/30 transition"
                title={inMyList ? 'Remove from My List' : 'Add to My List'}
              >
                {inMyList ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
