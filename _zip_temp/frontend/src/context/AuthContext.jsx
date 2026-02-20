import { createContext, useContext, useState, useEffect } from 'react';
import { usersAPI } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      usersAPI.getMe()
        .then(data => {
          if (data._id) setUser(data);
          else localStorage.removeItem('token');
        })
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem('token', userData.token);
    setUser({ ...userData, myList: userData.myList || [] });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateMyList = (list) => {
    setUser(prev => prev ? { ...prev, myList: list } : null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateMyList }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
