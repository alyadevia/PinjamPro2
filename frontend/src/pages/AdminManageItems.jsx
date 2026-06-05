import React, { useState, useEffect } from 'react';
import itemService from '../services/itemService';
import Layout from '../components/Layout';
import Modal from '../components/Modal';

export default function AdminManageItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null); 
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [total_quantity, setTotalQuantity] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await itemService.listItems();
      setItems(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengambil data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openModal = (item = null) => {
    setCurrentItem(item);
    if (item) {
      setName(item.name);
      setDescription(item.description || '');
      setCategory(item.category || '');
      setTotalQuantity(item.total_quantity);
      setExistingImageUrl(item.image_url || null);
    } else {
      setName('');
      setDescription('');
      setCategory('');
      setTotalQuantity(0);
      setExistingImageUrl(null);
    }
    setImageFile(null); 
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('total_quantity', total_quantity);
    
    if (imageFile) {
      formData.append('image', imageFile);
    } else if (existingImageUrl) {
      formData.append('image_url', existingImageUrl);
    }

    try {
      if (currentItem) {
        await itemService.updateItem(currentItem.id, formData);
      } else {
        await itemService.createItem(formData);
      }
      fetchItems();
      closeModal();
    } catch (err) {
      alert("Gagal menyimpan: " + (err.response?.data?.message || err.message));
    }
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus barang ini?")) return;
    try {
        await itemService.deleteItem(id);
        fetchItems();
    } catch (err) {
        alert("Gagal menghapus: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <Layout>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Kelola Barang</h1>
          <button
            onClick={() => openModal(null)}
            className="bg-primary hover:bg-primary-light text-white font-bold py-2 px-4 rounded"
          >
            + Tambah Barang Baru
          </button>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Nama</th>
              <th className="py-2 px-4 text-left">Kategori</th>
              <th className="py-2 px-4 text-left">Tersedia</th>
              <th className="py-2 px-4 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="py-2 px-4">{item.name}</td>
                <td className="py-2 px-4">{item.category}</td>
                <td className="py-2 px-4">{item.total_quantity}</td>
                <td className="py-2 px-4">
                  <button onClick={() => openModal(item)} className="text-blue-600 hover:underline mr-2">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={currentItem ? "Edit Barang" : "Barang Baru"}>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Nama Barang</label>
            <input name="name" value={name} onChange={(e) => setName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Kategori</label>
            <input name="category" value={category} onChange={(e) => setCategory(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Deskripsi</label>
            <textarea name="description" value={description} onChange={(e) => setDescription(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Total Kuantitas</label>
            <input name="total_quantity" type="number" value={total_quantity} onChange={(e) => setTotalQuantity(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3" required min="0" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Foto Barang</label>
            <input 
              type="file" 
              name="image"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="shadow appearance-none border rounded w-full py-2 px-3" 
            />
            {currentItem && existingImageUrl && (
              <p className="text-sm text-gray-500 mt-2">File saat ini: <a href={existingImageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">Lihat</a></p>
            )}
          </div>
          <button type="submit" className="w-full bg-primary hover:bg-primary-light text-white font-bold py-2 px-4 rounded">
            Simpan
          </button>
        </form>
      </Modal>
    </Layout>
  );
}