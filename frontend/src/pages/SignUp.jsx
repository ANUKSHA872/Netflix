import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api';

export default function SignUp() {
  const location = useLocation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const name = `${firstName.trim()} ${lastName.trim()}`.trim() || firstName || lastName || 'User';
    try {
      const data = await authAPI.register(name, email, password);
      if (data.message && !data.token) {
        setError(data.message);
        return;
      }
      login(data);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Sign up"
      linkText="Already have an Account?"
      linkTo="/login"
      linkLabel="Sign in"
    >
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500 rounded text-red-400 text-sm">
            {error}
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full bg-netflix-gray/80 border border-gray-600 rounded pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-netflix-red"
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full bg-netflix-gray/80 border border-gray-600 rounded pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-netflix-red"
            />
          </div>
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </span>
          <input
            type="email"
            placeholder="Email or Phone No"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-netflix-gray/80 border border-gray-600 rounded pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-netflix-red"
          />
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </span>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Create New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full bg-netflix-gray/80 border border-gray-600 rounded pl-10 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-netflix-red"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.12 9.12l-2.086 2.086M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-netflix-red hover:bg-red-600 text-white font-semibold rounded transition disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Continue'}
        </button>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="rounded" />
          <span className="text-gray-400 text-sm">Remember me</span>
        </label>
        <p className="text-center text-gray-500 text-sm">Or</p>
        <button
          type="button"
          className="w-full py-3 bg-white text-gray-800 font-medium rounded flex items-center justify-center gap-2 hover:bg-gray-100 transition"
        >
          <span className="text-blue-600 font-bold text-xl">f</span>
          Facebook
        </button>
        <p className="text-gray-500 text-xs text-center mt-4">
          This page is protected by Google reCAPTCHA to ensure you're not a bot.{' '}
          <a href="#" className="text-blue-400 hover:underline">Learn more</a>.
        </p>
      </form>
    </AuthLayout>
  );
}
