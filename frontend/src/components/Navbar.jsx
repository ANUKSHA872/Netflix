import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ transparent, showSearch }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showBrowseMenu, setShowBrowseMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowProfileMenu(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() && user) {
      navigate(`/dashboard?search=1&q=${encodeURIComponent(searchQuery.trim())}`);
    } else if (user) {
      navigate('/dashboard?search=1');
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-3 transition-all duration-300 ${
      transparent ? 'bg-transparent' : 'bg-netflix-black/95 backdrop-blur-sm'
    }`}>
      <div className="flex items-center gap-8">
        <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-3">
          <span className="w-8 h-8 flex items-center justify-center bg-netflix-red text-white font-bold text-lg rounded">S</span>
          <span className="text-lg font-semibold text-white hidden sm:inline">SERIES</span>
        </Link>
        {user && (
          <div className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className="text-sm text-gray-300 hover:text-white transition">
              Home
            </Link>
            <div className="relative">
              <button
                onMouseEnter={() => setShowBrowseMenu(true)}
                onMouseLeave={() => setShowBrowseMenu(false)}
                className="flex items-center gap-1 text-sm text-gray-300 hover:text-white transition"
              >
                Browse
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              {showBrowseMenu && (
                <div
                  onMouseEnter={() => setShowBrowseMenu(true)}
                  onMouseLeave={() => setShowBrowseMenu(false)}
                  className="absolute top-full left-0 mt-1 py-2 w-40 bg-netflix-dark rounded shadow-xl"
                >
                  <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-300 hover:bg-netflix-gray hover:text-white">
                    Movies
                  </Link>
                  <Link to="/dashboard?search=1" className="block px-4 py-2 text-sm text-gray-300 hover:bg-netflix-gray hover:text-white">
                    Search
                  </Link>
                  {user?.isAdmin && (
                    <Link to="/admin" className="block px-4 py-2 text-sm text-gray-300 hover:bg-netflix-gray hover:text-white">
                      Admin
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {showSearch && user && (
          <form onSubmit={handleSearch} className="flex items-center">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-32 md:w-40 bg-netflix-gray/80 border border-gray-600 rounded-l px-3 py-1.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-netflix-red"
            />
            <Link
              to={searchQuery.trim() ? `/dashboard?search=1&q=${encodeURIComponent(searchQuery.trim())}` : '/dashboard?search=1'}
              className="bg-netflix-gray/80 border border-l-0 border-gray-600 rounded-r px-2 py-1.5 text-gray-300 hover:text-white transition"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
          </form>
        )}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition"
            >
              <div className="w-8 h-8 rounded bg-netflix-red flex items-center justify-center text-sm font-bold">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span className="hidden sm:inline text-sm">{user.name}</span>
              <svg className={`w-4 h-4 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            {showProfileMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                <div className="absolute right-0 top-full mt-2 py-2 w-48 bg-netflix-dark rounded shadow-xl z-50 border border-gray-700">
                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                  {user.isAdmin && (
                    <Link to="/admin" className="block px-4 py-2 text-sm text-gray-300 hover:bg-netflix-gray hover:text-white" onClick={() => setShowProfileMenu(false)}>
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-netflix-gray hover:text-white"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="text-gray-300 hover:text-white transition font-medium text-sm">
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-netflix-red hover:bg-red-600 rounded font-medium text-sm transition"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
