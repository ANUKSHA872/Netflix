import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import { moviesAPI } from '../api';
import { getYouTubeEmbedUrl } from '../utils/video';

export default function Watch() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    moviesAPI.getById(id)
      .then(setMovie)
      .catch(() => setMovie(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner fullScreen />;
  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-400 mb-4">Movie not found</p>
          <Link to="/dashboard" className="text-netflix-red hover:underline">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const trailerUrl = movie.trailerUrl || movie.videoUrl;
  const youtubeEmbed = getYouTubeEmbedUrl(trailerUrl);

  return (
    <div className="min-h-screen bg-netflix-black">
      <Navbar />
      <div className="pt-20">
        <div className="aspect-video max-w-6xl mx-auto bg-black">
          {youtubeEmbed ? (
            <iframe
              src={youtubeEmbed}
              title={movie.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          ) : (
            <video
              src={trailerUrl}
              poster={movie.imageUrl}
              controls
              autoPlay
              className="w-full h-full"
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>
        <div className="max-w-6xl mx-auto px-4 md:px-12 py-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-netflix-red rounded text-xs font-medium">Trailer</span>
            <span className="text-gray-400">•</span>
            <span className="px-3 py-1 bg-netflix-red rounded font-medium">
              ★ {movie.rating?.toFixed(1) || 'N/A'}
            </span>
            <span className="text-gray-400 capitalize">{movie.category}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{movie.title}</h1>
          <p className="text-gray-300 leading-relaxed max-w-3xl">
            {movie.description || 'No description available.'}
          </p>
          <Link
            to="/dashboard"
            className="inline-block mt-8 px-6 py-2 border border-gray-500 rounded hover:bg-gray-500/20 transition"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
