import api from './api'; 

// MANAJEMEN PEMINJAMAN
const getAllBorrowings = (status_filter = '') => {
  return api.get('/admin/borrowings', {
    params: { status_filter }
  });
};

const approveBorrowing = (borrowing_id, admin_notes) => {
  return api.post('/admin/borrowings/approve', { borrowing_id, admin_notes });
};

const rejectBorrowing = (borrowing_id, admin_notes) => {
  return api.post('/admin/borrowings/reject', { borrowing_id, admin_notes });
};

const markAsReturnedByAdmin = (borrowing_id, admin_notes) => {
  return api.post('/admin/borrowings/return', { borrowing_id, admin_notes });
};

const getHistory = () => {
  return api.get('/admin/history');
};

// MANAJEMEN USER
const listUsers = (role_filter = '') => {
  return api.get('/admin/users', {
    params: { role_filter }
  });
};

const getUserById = (id) => {
  return api.get(`/admin/users/${id}`);
};

const updateUser = (id, userData) => {
  return api.put(`/admin/users/${id}`, userData);
};

const deleteUser = (id) => {
  return api.delete(`/admin/users/${id}`);
};

const adminService = {
  getAllBorrowings,
  approveBorrowing,
  rejectBorrowing,
  markAsReturnedByAdmin,
  getHistory,
  listUsers,
  getUserById,
  updateUser,
  deleteUser,
};

export default adminService;