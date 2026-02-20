import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const POSTER_MOSAIC = [
  'https://image.tmdb.org/t/p/w185/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
  'https://image.tmdb.org/t/p/w185/9gk7adHYeDvHkCSEqAvQNLV5u4m.jpg',
  'https://image.tmdb.org/t/p/w185/9O7gLzmreU0nGkIB6K3BsJbzvNv.jpg',
  'https://image.tmdb.org/t/p/w185/dM2w364MScsjFf8pfMbaWUcWrR.jpg',
  'https://image.tmdb.org/t/p/w185/uhl6p0aTvb8g94xJdBSX4b1bP0.jpg',
  'https://image.tmdb.org/t/p/w185/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
  'https://image.tmdb.org/t/p/w185/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
  'https://image.tmdb.org/t/p/w185/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
  'https://image.tmdb.org/t/p/w185/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
  'https://image.tmdb.org/t/p/w185/1E5baAaEse26fej7uHcjOgEE2t2.jpg',
  'https://image.tmdb.org/t/p/w185/6oom5QYh2L1HUjD0qnkP2m4sTzO.jpg',
  'https://image.tmdb.org/t/p/w185/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
];

export default function Landing() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      navigate('/signup', { state: { email: email.trim() } });
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-12 py-4">
        <Link to="/" className="flex items-center">
          <span className="text-2xl md:text-3xl font-bold text-netflix-red" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            StreamNest
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border border-gray-500 rounded px-3 py-1.5">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0h.5a2.5 2.5 0 0010.5-4V3.935M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <select className="bg-transparent text-white text-sm border-none outline-none cursor-pointer appearance-none pr-6">
              <option>English</option>
            </select>
          </div>
          <Link
            to="/login"
            className="px-4 py-2 bg-netflix-red hover:bg-red-600 text-white text-sm font-medium rounded transition"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Poster mosaic background */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1 p-2 transform scale-105 -rotate-3">
          {[...POSTER_MOSAIC, ...POSTER_MOSAIC, ...POSTER_MOSAIC].map((src, i) => (
            <div key={i} className="aspect-[2/3] rounded overflow-hidden bg-netflix-gray">
              <img src={src} alt="" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
            </div>
          ))}
        </div>
      </div>
      <div className="absolute inset-0 bg-black/50" />

      {/* Center content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-12 text-center">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 max-w-2xl">
          Unlimited movies, TV shows, and more.
        </h1>
        <p className="text-xl md:text-2xl text-white mb-2">
          Watch anywhere. Cancel anytime.
        </p>
        <p className="text-base md:text-lg text-white/90 mb-6">
          Ready to watch? Enter your email to create or restart your membership.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-xl">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 min-w-0 px-4 py-4 bg-white text-black placeholder-gray-500 rounded-sm text-base focus:outline-none"
          />
          <button
            type="submit"
            className="px-8 py-4 bg-netflix-red hover:bg-red-600 text-white text-lg font-semibold rounded-sm flex items-center justify-center gap-1 whitespace-nowrap"
          >
            Get Started
            <span className="text-xl">&gt;</span>
          </button>
        </form>
      </div>
    </div>
  );
}
