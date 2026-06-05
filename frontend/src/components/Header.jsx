import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Header() {
  const { isLoggedIn, user, logout } = useAuth(); 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to={isLoggedIn ? "/" : "/"} className="text-2xl font-bold text-primary">
          PinjamPro
        </Link>
        
        {isLoggedIn ? (
          // Tampilan Jika Sudah Login
          <div className="flex items-center space-x-6">
            <span className="text-gray-700">Halo, {user.name}!</span>
            
            <Link to="/dashboard" className="text-gray-700 hover:text-primary">Dashboard</Link>
            <Link to="/my-borrowings" className="text-gray-700 hover:text-primary">Peminjaman Saya</Link>
            {user.role === 'admin' && (
              <Link to="/admin/borrowings" className="text-primary font-bold hover:underline">Admin Panel</Link>
            )}

            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        ) : (
          // Tampilan Jika Belum Login (Guest)
          <div>
            <Link to="/" className="px-3 text-gray-700 hover:text-primary">Home</Link>
            <Link to="/#faq" className="px-3 text-gray-700 hover:text-primary">FAQ</Link>
            <Link to="/register" className="ml-2 border border-primary text-primary px-4 py-2 rounded-md hover:bg-primary-light hover:text-white">
              Sign Up
            </Link>
            <Link to="/login" className="ml-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light">
              Login
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}