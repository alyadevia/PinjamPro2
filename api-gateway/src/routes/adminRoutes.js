const express = require('express');
const router = express.Router();

const {
  getAllBorrowings,
  approveBorrowing,
  rejectBorrowing,
  markAsReturnedByAdmin,
  getHistory,
} = require('../controllers/adminController');

const {
  listUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userManagementController');

// Rute Manajemen Peminjaman
router.get('/borrowings', getAllBorrowings);
router.post('/borrowings/approve', approveBorrowing);
router.post('/borrowings/reject', rejectBorrowing);
router.post('/borrowings/return', markAsReturnedByAdmin);
router.get('/history', getHistory);

// Rute Manajemen User
router.get('/users', listUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;