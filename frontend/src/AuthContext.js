import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get('http://localhost:5000/api/auth/me')
        .then(res => setUser(res.data))
        .catch(err => {
          console.error("Invalid token session:", err);
          logout();
        });
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const login = async (username, password) => {
    const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
    const { token: newToken, ...userData } = res.data;
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('token', newToken);
  };

  const register = async (usernameOrData, password, extraData = {}) => {
    let payload = {};
    if (typeof usernameOrData === 'object') {
      payload = usernameOrData;
    } else {
      payload = { username: usernameOrData, password, ...extraData };
    }
    const res = await axios.post('http://localhost:5000/api/auth/register', payload);
    const { token: newToken, ...userData } = res.data;
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('token', newToken);
    return userData;
  };

  const logout = () => {
    if (token) {
      axios.post('http://localhost:5000/api/auth/logout').catch(() => {});
    }
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
