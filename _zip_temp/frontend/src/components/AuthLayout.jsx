import { Link } from 'react-router-dom';

export default function AuthLayout({ children, title, linkText, linkTo, linkLabel }) {
  const CHARACTER_IMAGES = [
    'https://image.tmdb.org/t/p/w300/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg',
    'https://image.tmdb.org/t/p/w300/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    'https://image.tmdb.org/t/p/w300/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    'https://image.tmdb.org/t/p/w300/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
  ];

  const POSTER_BG = [
    'https://image.tmdb.org/t/p/w185/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
    'https://image.tmdb.org/t/p/w185/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
    'https://image.tmdb.org/t/p/w185/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left panel - Character collage */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black overflow-hidden">
        <div className="flex gap-2 p-8 w-full justify-center items-center">
          {CHARACTER_IMAGES.map((src, i) => (
            <div key={i} className="flex-1 max-w-[180px] aspect-[2/3] rounded overflow-hidden">
              <img src={src} alt="" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span
            className="text-white/20 text-8xl font-bold uppercase tracking-widest transform -rotate-90 whitespace-nowrap select-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            StreamNest
          </span>
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="flex-1 relative min-h-screen flex flex-col">
        {/* Blurred poster background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 grid grid-cols-3 gap-2 p-4 transform scale-110 blur-2xl opacity-30">
            {[...POSTER_BG, ...POSTER_BG, ...POSTER_BG].map((src, i) => (
              <div key={i} className="aspect-[2/3] rounded overflow-hidden bg-netflix-gray">
                <img src={src} alt="" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-black/80" />
        </div>

        {/* Form content */}
        <div className="relative z-10 flex flex-col flex-1 p-8 md:p-12">
          <p className="text-right text-gray-400 text-sm mb-4">
            {linkText}{' '}
            <Link to={linkTo} className="text-netflix-red font-medium hover:underline">
              {linkLabel}
            </Link>
          </p>
          <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl font-bold text-netflix-red" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                S
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-white">{title}</h1>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
