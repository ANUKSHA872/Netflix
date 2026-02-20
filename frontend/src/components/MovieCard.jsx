import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../api';

const FALLBACK_IMAGE = 'https://placehold.co/400x225/1a1a1a/555555?text=No+Image';

export default function MovieCard({ movie, inMyList, badge }) {
  const { user, updateMyList } = useAuth();
  const [imgError, setImgError] = useState(false);

  const handleMyList = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    try {
      const list = await usersAPI.toggleMyList(movie._id);
      updateMyList(list);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Link
      to={`/watch/${movie._id}`}
      className="group flex-shrink-0 w-[160px] md:w-[200px] transition-transform duration-300 hover:scale-105 hover:z-10"
    >
      <div className="relative rounded overflow-hidden bg-netflix-gray aspect-video">
        {imgError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-netflix-dark">
            <span className="text-sm md:text-base font-medium text-white text-center line-clamp-3">{movie.title}</span>
          </div>
        ) : (
          <img
            src={movie.imageUrl || FALLBACK_IMAGE}
            alt={movie.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        )}
        {badge && (
          <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-netflix-red text-[10px] font-bold uppercase">
            {badge}
          </div>
        )}
        {movie.language && movie.language !== 'english' && (
          <div className="absolute top-1 right-1 px-1.5 py-0.5 bg-black/70 text-[10px] font-medium capitalize">
            {movie.language}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-sm font-medium truncate">{movie.title}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-netflix-black hover:bg-white transition flex-shrink-0">
              <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            {user && (
              <button
                onClick={handleMyList}
                className="w-9 h-9 rounded-full border-2 border-white/80 flex items-center justify-center hover:bg-white/20 transition flex-shrink-0"
                title={inMyList ? 'Remove from My List' : 'Add to My List'}
              >
                {inMyList ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
