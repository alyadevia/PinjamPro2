import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout & Proteksi
import ProtectedRoute from './utils/ProtectedRoute';
import AdminRoute from './utils/AdminRoute';

// Halaman Publik
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import ReceiptPage from './pages/ReceiptPage'; // Halaman "Surat"

// Halaman User (Dashboard)
import DashboardPage from './pages/DashboardPage';
import MyBorrowingsPage from './pages/MyBorrowingsPage';

// Halaman Admin
import AdminManageBorrowings from './pages/AdminManageBorrowings';
import AdminManageItems from './pages/AdminManageItems';
import AdminManageUsers from './pages/AdminManageUsers';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rute Publik */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/receipt/:borrowingId" element={<ReceiptPage />} />

        {/* Rute User (Perlu Proteksi Login) */}
        <Route 
          path="/dashboard" 
          element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} 
        />
        <Route 
          path="/my-borrowings" 
          element={<ProtectedRoute><MyBorrowingsPage /></ProtectedRoute>} 
        />
        
        {/* Rute Admin (Perlu Proteksi Admin) */}
        <Route 
          path="/admin/borrowings" 
          element={<AdminRoute><AdminManageBorrowings /></AdminRoute>} 
        />
        <Route 
          path="/admin/items" 
          element={<AdminRoute><AdminManageItems /></AdminRoute>} 
        />
        <Route 
          path="/admin/users" 
          element={<AdminRoute><AdminManageUsers /></AdminRoute>} 
        />
        <Route 
          path="/admin" 
          element={<AdminRoute><Navigate to="/admin/borrowings" replace /></AdminRoute>} 
        />

        {/* Rute 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;