import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import adminService from '../services/adminService'; 
import itemService from '../services/itemService';
import { useAuth } from '../hooks/useAuth';

export default function ReceiptPage() {
  const { borrowingId } = useParams();
  const { user } = useAuth(); 

  const [borrowing, setBorrowing] = useState(null);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReceiptData = async () => {
      try {
        if (!borrowingId) return;
        setLoading(true);
        
        // TODO: Buat endpoint baru 'getBorrowingById' di backend
        // Untuk sekarang, kita akan filter dari semua request admin
        const b_res = await adminService.getAllBorrowings();
        const b_data = b_res.data.find(b => b.id === borrowingId);
        
        if (!b_data) throw new Error("Data peminjaman tidak ditemukan.");
        setBorrowing(b_data);

        const i_res = await itemService.getItemById(b_data.item_id);
        setItem(i_res.data);
        
      } catch (err) {
        setError(err.message || "Gagal memuat data");
      } finally {
        setLoading(false);
      }
    };
    fetchReceiptData();
  }, [borrowingId]);

  if (loading) return <div className="p-10">Loading...</div>;
  if (error) return <div className="p-10 text-red-500">{error}</div>;
  if (!borrowing || !item) return <div className="p-10">Data tidak ada.</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg p-8 border-t-8 border-primary">
        <h1 className="text-3xl font-bold text-center mb-2">BUKTI PERSETUJUAN</h1>
        <p className="text-center text-gray-500 mb-6">PINJAMPRO</p>
        
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Peminjam:</h2>
          <p className="text-lg">{user?.name || borrowing.user_id}</p>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Status:</h2>
          <p className="text-lg font-bold text-green-600">DISETUJUI</p>
        </div>
        
        <div className="border-t border-b my-6 py-4">
          <h2 className="text-xl font-bold mb-4">Detail Barang:</h2>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Nama Barang:</span>
            <span className="font-semibold">{item.name}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Kategori:</span>
            <span className="font-semibold">{item.category}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Jumlah:</span>
            <span className="font-semibold">{borrowing.quantity}</span>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Detail Peminjaman:</h2>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">ID Peminjaman:</span>
            <span className="font-mono text-sm">{borrowing.id}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Tanggal Pinjam:</span>
            <span className="font-semibold">{new Date(borrowing.start_date).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Tanggal Kembali:</span>
            <span className="font-semibold">{new Date(borrowing.end_date).toLocaleDateString()}</span>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm">
          Tunjukkan bukti ini kepada admin saat mengambil barang.
        </p>
      </div>
    </div>
  );
}