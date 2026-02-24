// Same origin on Vercel (backend at /api). Use VITE_API_URL only for external backend (e.g. Render).
const API = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '') + '/api';

const getToken = () => localStorage.getItem('token');

async function authFetch(url, options) {
  const r = await fetch(url, options);
  let data;
  try {
    data = await r.json();
  } catch {
    throw new Error(r.ok ? 'Invalid response' : `API error (${r.status})`);
  }
  if (!r.ok) throw new Error(data.message || `API error (${r.status})`);
  return data;
}

export const authAPI = {
  login: (email, password) =>
    authFetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }),

  register: (name, email, password) =>
    authFetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    }),
};

export const moviesAPI = {
  getAll: async (params = {}) => {
    const q = new URLSearchParams(params).toString();
    const url = `${API}/movies${q ? '?' + q : ''}`;
    const r = await fetch(url);
    const data = await r.json();
    if (!r.ok) throw new Error(data.message || 'Failed to fetch movies');
    return Array.isArray(data) ? data : [];
  },
  getCategories: () => fetch(`${API}/movies/categories`).then(r => r.json()),
  getById: (id) => fetch(`${API}/movies/${id}`).then(r => r.json()),
  create: (data) =>
    fetch(`${API}/movies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    }).then(r => r.json()),
  update: (id, data) =>
    fetch(`${API}/movies/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    }).then(r => r.json()),
  delete: (id) =>
    fetch(`${API}/movies/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` },
    }).then(r => r.json()),
  seed: () =>
    fetch(`${API}/movies/seed`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
    }).then(r => r.json()),
};

export const usersAPI = {
  getMe: () =>
    fetch(`${API}/users/me`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    }).then(r => r.json()),
  toggleMyList: (movieId) =>
    fetch(`${API}/users/mylist/${movieId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
    }).then(r => r.json()),
  getMyList: () =>
    fetch(`${API}/users/mylist`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    }).then(r => r.json()),
};
