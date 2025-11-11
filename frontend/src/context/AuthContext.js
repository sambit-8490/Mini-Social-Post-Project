import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// API base URL - NOW FROM .ENV
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        // Set token for all future axios requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          // Get user details from token
          const res = await axios.get(`${API_URL}/auth/me`);
          setUser(res.data.data);
        } catch (err) {
          console.error('Failed to fetch user', err);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const signup = async (username, email, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/signup`, {
        username,
        email,
        password,
      });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return { success: true };
    } catch (err) {
      console.error('Signup failed', err.response.data);
      // Return the specific error messages from the backend
      return { success: false, errors: err.response.data.errors || [{ msg: 'Signup failed. Please try again.' }] };
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return { success: true };
    } catch (err) {
      console.error('Login failed', err.response.data);
      // Return the specific error messages from the backend
      return { success: false, errors: err.response.data.errors || [{ msg: 'Invalid credentials.' }] };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    token,
    loading,
    signup,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};