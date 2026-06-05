import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import itemService from '../services/itemService';
import borrowingService from '../services/borrowingService';
import Layout from '../components/Layout';
import ItemCard from '../components/ItemCard';
import Modal from '../components/Modal';

export default function DashboardPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  const [quantity, setQuantity] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await itemService.listItems();
        setItems(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal mengambil data barang.');
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const openPinjamModal = (item) => {
    setSelectedItem(item);
    setQuantity(1); 
    setStartDate('');
    setEndDate('');
    setNotes('');
    setFormError('');
    setIsModalOpen(true);
  };

  const closePinjamModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleSubmitPeminjaman = async (e) => {
    e.preventDefault();
    setFormError('');

    if (quantity > selectedItem.available_quantity) {
      setFormError(`Jumlah pinjam tidak boleh lebih dari ${selectedItem.available_quantity}`);
      return;
    }

    try {
      await borrowingService.createBorrowRequest(
        selectedItem.id,
        parseInt(quantity, 10),
        startDate,
        endDate,
        notes
      );
      closePinjamModal();
      navigate('/my-borrowings'); 
    } catch (err) {
      setFormError(err.response?.data?.message || 'Gagal membuat request.');
    }
  };

  if (loading) {
    return <Layout><div className="p-8">Loading...</div></Layout>;
  }

  if (error) {
    return <Layout><div className="p-8 text-red-500">{error}</div></Layout>;
  }

  return (
    <Layout>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6">Inventaris Barang</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} onPinjamClick={openPinjamModal} />
          ))}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closePinjamModal}
        title={`Pinjam: ${selectedItem?.name}`}
      >
        <form onSubmit={handleSubmitPeminjaman}>
          {formError && <p className="text-red-500 text-sm mb-4">{formError}</p>}
          
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Jumlah (Maks: {selectedItem?.available_quantity})</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              max={selectedItem?.available_quantity}
              className="shadow appearance-none border rounded w-full py-2 px-3"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Tanggal Mulai Pinjam</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Tanggal Selesai Pinjam</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Catatan (Opsional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-light text-white font-bold py-2 px-4 rounded"
          >
            Ajukan Peminjaman
          </button>
        </form>
      </Modal>
    </Layout>
  );
}