import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; 
import Header from '../components/Header'; // Impor Header

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuth(); // Ambil fungsi login dari Context

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await login(email, password); 

      if (data.role === 'admin') {
        navigate('/admin/borrowings'); 
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Cek kembali email dan password.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8 m-4">
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Welcome back!
          </h2>
          <p className="text-center text-gray-600 mb-6">Masuk Disini</p>
          
          <form onSubmit={handleLogin}>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col items-center justify-between">
              <button
                className="w-full bg-primary hover:bg-primary-light text-white font-bold py-2 px-4 rounded"
                type="submit"
              >
                Masuk
              </button>
              <Link
                className="inline-block align-baseline font-bold text-sm text-gray-600 hover:text-primary mt-4"
                to="/register"
              >
                Buat Akun Baru
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}