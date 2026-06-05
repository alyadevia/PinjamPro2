import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const linkClass = ({ isActive }) =>
  isActive
    ? 'block py-2 px-4 bg-primary text-white rounded'
    : 'block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded';

export default function Sidebar() {
  const { isAdmin } = useAuth();

  return (
    <aside className="w-64 bg-white shadow-md rounded-lg p-4">
      <h3 className="font-bold text-lg mb-4">Menu</h3>
      <nav className="space-y-2">
        <NavLink to="/dashboard" className={linkClass} end>
          Dashboard (Barang)
        </NavLink>
        <NavLink to="/my-borrowings" className={linkClass}>
          Peminjaman Saya
        </NavLink>

        {isAdmin && (
          <div className="pt-4 mt-4 border-t">
            <h3 className="font-bold text-lg mb-4 text-primary">Admin Panel</h3>
            <NavLink to="/admin/borrowings" className={linkClass}>
              Kelola Peminjaman
            </NavLink>
            <NavLink to="/admin/items" className={linkClass}>
              Kelola Barang
            </NavLink>
            <NavLink to="/admin/users" className={linkClass}>
              Kelola Pengguna
            </NavLink>
          </div>
        )}
      </nav>
    </aside>
  );
}