import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HeroBanner from '../components/HeroBanner';
import MovieRow from '../components/MovieRow';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { moviesAPI } from '../api';

const CATEGORY_LABELS = {
  trending: 'Trending Now',
  popular: 'Popular on StreamNest',
  dramas: 'Dramas',
  action: 'Action',
  comedy: 'Comedy',
  recently: 'New this week',
};

export default function Dashboard() {
  const [categories, setCategories] = useState(null);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const myListIds = (user?.myList || []).map(m => m._id || m);

  useEffect(() => {
    setError(null);
    moviesAPI.getCategories()
      .then((data) => {
        if (data?.message) {
          setError(data.message);
          setCategories({});
          return;
        }
        setCategories(data || {});
        const first = data?.trending?.[0] || data?.popular?.[0] || data?.recently?.[0] || Object.values(data || {}).flat().filter(Array.isArray).flat().filter(Boolean)[0];
        setFeaturedMovie(first);
      })
      .catch((err) => {
        setError('Unable to load movies. Make sure the backend is running on port 5000.');
        setCategories({});
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (searchParams.get('search') === '1') setShowSearch(true);
  }, [searchParams]);

  const hasMovies = categories && Object.values(categories).some(v => Array.isArray(v) && v.length > 0);

  if (loading) return <LoadingSpinner fullScreen />;

  if (error || !hasMovies) {
    return (
      <div className="min-h-screen bg-netflix-black">
        <Navbar showSearch />
        <div className="pt-24 px-6 text-center">
          <p className="text-xl text-gray-400 mb-4">
            {error || 'No movies yet.'}
          </p>
          <p className="text-gray-500 mb-6">
            Restart the backend server to auto-load sample movies, or add movies in Admin.
          </p>
          {user?.isAdmin && (
            <Link to="/admin" className="inline-block px-6 py-3 bg-netflix-red hover:bg-red-600 rounded font-medium">
              Add Movies
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-black pb-20">
      <Navbar showSearch />
      {showSearch && (
        <SearchBar
          initialQuery={searchParams.get('q') || ''}
          onClose={() => {
            setShowSearch(false);
            setSearchParams({});
          }}
          myListIds={myListIds}
        />
      )}
      <div className="pt-16">
        {featuredMovie && <HeroBanner movie={featuredMovie} />}
        <div className="mt-2">
          {myListIds.length > 0 && (
            <MovieRow
              title="My List"
              movies={user?.myList || []}
              myListIds={myListIds}
            />
          )}
          {categories?.recently?.length > 0 && (
            <MovieRow
              title="New this week"
              movies={categories.recently}
              myListIds={myListIds}
              badge
            />
          )}
          {categories?.languages?.english?.length > 0 && (
            <MovieRow
              title="English Movies"
              movies={categories.languages.english}
              myListIds={myListIds}
              badge
            />
          )}
          {categories?.languages?.hindi?.length > 0 && (
            <MovieRow
              title="Hindi Movies"
              movies={categories.languages.hindi}
              myListIds={myListIds}
              badge
            />
          )}
          {categories?.languages?.kannada?.length > 0 && (
            <MovieRow
              title="Kannada Movies"
              movies={categories.languages.kannada}
              myListIds={myListIds}
              badge
            />
          )}
          {categories && ['trending', 'popular', 'dramas', 'action', 'comedy'].map((key) => (
            <MovieRow
              key={key}
              title={CATEGORY_LABELS[key]}
              movies={categories[key] || []}
              myListIds={myListIds}
              badge={key === 'trending' || key === 'popular'}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
