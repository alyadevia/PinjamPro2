import React from 'react';

export default function ItemCard({ item, onPinjamClick }) {
  const imageUrl = item.image_url || 'https://via.placeholder.com/300x200.png?text=No+Image';

  // Fokus hanya cek stok dari total_quantity
  const totalQty = item.total_quantity ?? 0;
  const isAvailable = totalQty > 0;

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <img className="w-full h-48 object-cover" src={imageUrl} alt={item.name} />

      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{item.category || 'Uncategorized'}</p>

        {isAvailable ? (
          <p className="text-green-600 font-semibold">
            Tersedia: {totalQty}
          </p>
        ) : (
          <p className="text-red-600 font-semibold">
            Stok Habis
          </p>
        )}

        <button
          onClick={() => onPinjamClick(item)}
          disabled={!isAvailable}
          className={`
            w-full mt-4 py-2 px-4 rounded font-bold text-white
            ${isAvailable 
              ? 'bg-primary hover:bg-primary-light' 
              : 'bg-gray-400 cursor-not-allowed'}
          `}
        >
          Pinjam
        </button>
      </div>
    </div>
  );
}
