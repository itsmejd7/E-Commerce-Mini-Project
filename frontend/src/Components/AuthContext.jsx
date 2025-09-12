import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null); // { _id, name, email, role }

  const login = async (email, password) => {
    const res = await fetch('http://localhost:5000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const msg = await res.json().catch(() => ({}));
      throw new Error(msg.message || 'Login failed');
    }
    const data = await res.json();
    setToken(data.token);
    localStorage.setItem('jwt', data.token);
    const me = await fetchMe(data.token);
    return me;
  };

  const signup = async (name, email, password, _adminSecret, role) => {
    const res = await fetch('http://localhost:5000/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });
    if (!res.ok) {
      const msg = await res.json().catch(() => ({}));
      throw new Error(msg.message || 'Signup failed');
    }
    const data = await res.json();
    setToken(data.token);
    localStorage.setItem('jwt', data.token);
    const me = await fetchMe(data.token);
    return me;
  };

  const fetchMe = async (jwt) => {
    const res = await fetch('http://localhost:5000/auth/me', {
      headers: { 'x-auth-token': jwt }
    });
    if (res.ok) {
      const me = await res.json();
      setUser(me);
      return me;
    }
    return null;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('jwt');
    // Consumers should redirect after calling logout
  };

  const value = useMemo(() => ({ token, user, login, signup, logout }), [token, user]);

  useEffect(() => {
    const existing = localStorage.getItem('jwt');
    if (existing && !token) {
      setToken(existing);
      fetchMe(existing);
    }
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


