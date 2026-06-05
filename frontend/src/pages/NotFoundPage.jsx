import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <p className="text-2xl md:text-3xl font-light text-gray-700 mt-4">
          Halaman Tidak Ditemukan
        </p>
        <p className="text-gray-500 mt-2">Maaf, halaman yang Anda cari tidak ada.</p>
        <Link
          to="/"
          className="mt-6 inline-block bg-primary text-white font-bold px-6 py-3 rounded-md hover:bg-primary-light transition-colors"
        >
          Kembali ke Home
        </Link>
      </div>
    </div>
  );
}