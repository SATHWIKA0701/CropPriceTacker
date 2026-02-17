import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ManageMarkets from './pages/ManageMarkets';
import ManageCrops from './pages/ManageCrops';
import ManagePrices from './pages/ManagePrices';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/markets"
            element={
              <ProtectedRoute requiredRole="admin">
                <ManageMarkets />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/crops"
            element={
              <ProtectedRoute requiredRole="admin">
                <ManageCrops />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/prices"
            element={
              <ProtectedRoute requiredRole="admin">
                <ManagePrices />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
