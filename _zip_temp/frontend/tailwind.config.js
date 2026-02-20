/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Netflix Sans', 'Helvetica Neue', 'sans-serif'],
      },
      colors: {
        'netflix': {
          red: '#e50914',
          black: '#141414',
          dark: '#181818',
          gray: '#2f2f2f',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.7) 100%)',
      }
    },
  },
  plugins: [],
};
