import { useRef } from 'react';
import MovieCard from './MovieCard';

export default function MovieRow({ title, movies, myListIds = [], badge }) {
  const rowRef = useRef(null);

  const scroll = (dir) => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: dir * 400, behavior: 'smooth' });
    }
  };

  if (!movies?.length) return null;

  return (
    <section className="mb-8 pt-2">
      {title && (
        <h2 className="text-xl md:text-2xl font-bold mb-4 px-4 md:px-12 text-white">{title}</h2>
      )}
      <div className="relative group/row">
        <button
          onClick={() => scroll(-1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white opacity-0 group-hover/row:opacity-100 transition z-10"
          aria-label="Scroll left"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
          </svg>
        </button>
        <div
          ref={rowRef}
          className="movie-row px-4 md:px-12 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie, idx) => {
            let badgeText;
            if (badge) {
              const variants = ['StreamNest', 'StreamNest | WATCH NOW', 'StreamNest'];
              badgeText = variants[idx % variants.length];
            }
            return (
              <MovieCard
                key={movie._id}
                movie={movie}
                inMyList={myListIds.includes(movie._id)}
                badge={badgeText}
              />
            );
          })}
        </div>
        <button
          onClick={() => scroll(1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white opacity-0 group-hover/row:opacity-100 transition z-10"
          aria-label="Scroll right"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
          </svg>
        </button>
      </div>
    </section>
  );
}
