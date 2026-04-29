import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateDonation from './pages/CreateDonation';
import WastagePrediction from './pages/WastagePrediction';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

const AppRoutes = () => {
  const { user } = useAuth();
  const showNavbar = user !== null;

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Homepage />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/donations/create"
          element={
            <PrivateRoute allowedRoles={['restaurant', 'admin']}>
              <CreateDonation />
            </PrivateRoute>
          }
        />

        <Route
          path="/predict-wastage"
          element={
            <PrivateRoute allowedRoles={['restaurant', 'admin']}>
              <WastagePrediction />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
