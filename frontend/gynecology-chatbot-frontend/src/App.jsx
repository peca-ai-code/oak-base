// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

// Auth components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PrivateRoute from './components/auth/PrivateRoute';

// Main app components
import NavBar from './components/layout/NavBar';
import ChatInterface from './components/chat/ChatInterface';
import ChatHistory from './components/chat/ChatHistory';
import DoctorList from './components/doctors/DoctorList';
import UserProfile from './components/user/UserProfile';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <NavBar />
          <div className="container mt-4">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes */}
              <Route path="/" element={
                <PrivateRoute>
                  <ChatInterface />
                </PrivateRoute>
              } />
              <Route path="/chat/:sessionId" element={
                <PrivateRoute>
                  <ChatInterface />
                </PrivateRoute>
              } />
              <Route path="/history" element={
                <PrivateRoute>
                  <ChatHistory />
                </PrivateRoute>
              } />
              <Route path="/doctors" element={
                <PrivateRoute>
                  <DoctorList />
                </PrivateRoute>
              } />
              <Route path="/profile" element={
                <PrivateRoute>
                  <UserProfile />
                </PrivateRoute>
              } />
              
              {/* Redirect any unknown routes to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;