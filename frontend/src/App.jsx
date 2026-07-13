import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Prediction from './pages/PrediccionModule';
import { theme } from './styles/themes';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: theme.colors.text.secondary,
      }}>
        Cargando...
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Login />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Prediction"
              element={
                <ProtectedRoute>
                  <Prediction />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
  );
}

export default App;
