import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import Layout from '../components/Layout';

const getStatusClass = (status) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'approved': return 'bg-green-100 text-green-800';
    case 'rejected': return 'bg-red-100 text-red-800';
    case 'returned': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function AdminManageBorrowings() {
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState(''); 

  const fetchAllBorrowings = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllBorrowings(filter);
      setBorrowings(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengambil data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBorrowings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleApprove = async (id) => {
    const notes = prompt("Catatan persetujuan (opsional):");
    try {
      await adminService.approveBorrowing(id, notes || 'Disetujui');
      fetchAllBorrowings(); 
    } catch (err) {
      alert("Gagal: " + (err.response?.data?.message || err.message));
    }
  };

  const handleReject = async (id) => {
    const notes = prompt("Catatan penolakan (WAJIB):");
    if (!notes) {
      alert("Catatan penolakan wajib diisi.");
      return;
    }
    try {
      await adminService.rejectBorrowing(id, notes);
      fetchAllBorrowings(); 
    } catch (err) {
      alert("Gagal: " + (err.response?.data?.message || err.message));
    }
  };

  const handleReturn = async (id) => {
    const notes = prompt("Catatan pengembalian (opsional):");
    try {
      await adminService.markAsReturnedByAdmin(id, notes || 'Dikembalikan oleh admin');
      fetchAllBorrowings();
    } catch (err) {
      alert("Gagal: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <Layout>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4">Kelola Peminjaman</h1>
        
        <div className="mb-4">
          <label className="mr-2">Filter Status:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="p-2 border rounded">
            <option value="">Semua</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="returned">Returned</option>
          </select>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left">User ID</th>
                <th className="py-2 px-4 text-left">Item ID</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {borrowings.map((req) => (
                <tr key={req.id} className="border-b">
                  <td className="py-2 px-4" title={req.user_id}>{req.user_id.substring(0, 8)}...</td>
                  <td className="py-2 px-4" title={req.item_id}>{req.item_id.substring(0, 8)}...</td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusClass(req.status)}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    {req.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button onClick={() => handleApprove(req.id)} className="bg-green-500 hover:bg-green-600 text-white text-sm py-1 px-2 rounded">
                          Approve
                        </button>
                        <button onClick={() => handleReject(req.id)} className="bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-2 rounded">
                          Reject
                        </button>
                      </div>
                    )}
                    {req.status === 'approved' && (
                       <button onClick={() => handleReturn(req.id)} className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 px-2 rounded">
                          Konfirmasi Kembali
                        </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}