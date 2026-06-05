import React, { useState, useEffect } from 'react';
import borrowingService from '../services/borrowingService';
import Layout from '../components/Layout';

const getStatusClass = (status) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'approved': return 'bg-green-100 text-green-800';
    case 'rejected': return 'bg-red-100 text-red-800';
    case 'returned': return 'bg-blue-100 text-blue-800';
    case 'late': return 'bg-red-200 text-red-900';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function MyBorrowingsPage() {
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBorrowings = async () => {
    try {
      setLoading(true);
      const response = await borrowingService.getMyBorrowings();
      setBorrowings(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengambil data peminjaman.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowings();
  }, []);

  if (loading) {
    return <Layout><div className="p-8">Loading...</div></Layout>;
  }

  if (error) {
    return <Layout><div className="p-8 text-red-500">{error}</div></Layout>;
  }

  return (
    <Layout>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6">Peminjaman Saya</h1>
        <div className="space-y-4">
          {borrowings.length === 0 ? (
            <p>Anda belum memiliki riwayat peminjaman.</p>
          ) : (
            borrowings.map((req) => (
              <div key={req.id} className="border rounded-lg p-4 flex justify-between items-center">
                <div>
                  <p className="font-bold text-lg">Item ID: {req.item_id}</p>
                  <p>Jumlah: {req.quantity}</p>
                  <p>Tanggal: {new Date(req.start_date).toLocaleDateString()} - {new Date(req.end_date).toLocaleDateString()}</p>
                  <p>Catatan Admin: {req.admin_notes || '-'}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusClass(req.status)}`}>
                    {req.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}