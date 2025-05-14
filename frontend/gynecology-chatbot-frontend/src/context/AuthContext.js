// src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setCurrentUser(JSON.parse(user));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      // Get token using OAuth
      const tokenResponse = await api.post('/api/auth/token/', {
        grant_type: 'password',
        username: email,
        password: password,
        client_id: 'your-client-id', // This would be configured in Django
        client_secret: 'your-client-secret', // This would be configured in Django
      });
      
      const { access_token, expires_in } = tokenResponse.data;
      
      // Set token in axios headers
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      // Get user details
      const userResponse = await api.get('/api/users/me/');
      const userData = userResponse.data;
      
      // Save to localStorage
      localStorage.setItem('token', access_token);
      localStorage.setItem('tokenExpiry', new Date().getTime() + (expires_in * 1000));
      localStorage.setItem('user', JSON.stringify(userData));
      
      setCurrentUser(userData);
      return userData;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error_description || 'Failed to login. Please check your credentials.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      
      // Register user
      await api.post('/api/users/', userData);
      
      // Login after successful registration
      return await login(userData.email, userData.password);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.detail || 'Failed to register. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('user');
    
    // Clear current user
    setCurrentUser(null);
    
    // Clear authorization header
    delete api.defaults.headers.common['Authorization'];
  };

  const updateProfile = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await api.patch(`/api/users/${currentUser.id}/`, userData);
      const updatedUser = response.data;
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update context state
      setCurrentUser(updatedUser);
      
      return updatedUser;
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.response?.data?.detail || 'Failed to update profile. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};