// File: api-gateway/src/controllers/adminController.js
const asyncHandler = require('express-async-handler');
const { borrowingClient, itemClient, notificationClient } = require('../config/grpcClients');
const { grpcCall } = require('./helper/grpcHelper');

// @desc    Admin: Lihat semua request peminjaman
// @route   GET /api/admin/borrowings
// @access  Admin
const getAllBorrowings = asyncHandler(async (req, res) => {
  const { status_filter } = req.query;
  const response = await grpcCall(borrowingClient, 'GetAllBorrowings', {
    status_filter: status_filter || '',
  });
  res.status(200).json(response.borrow_requests);
});

// @desc    Admin: Menyetujui request peminjaman
// @route   POST /api/admin/borrowings/approve
// @access  Admin
const approveBorrowing = asyncHandler(async (req, res) => {
  const { borrowing_id, admin_notes } = req.body;
  const admin_id = req.user.id;

  // 1. Update status di borrowing-service
  const response = await grpcCall(borrowingClient, 'ApproveBorrowing', {
    borrowing_id,
    admin_id,
    admin_notes: admin_notes || 'Disetujui',
  });
  
  const borrowRequest = response.borrow_request;

  // 2. Ambil data item (stok saat ini)
  const itemData = await grpcCall(itemClient, 'GetItem', { id: borrowRequest.item_id });

  const newTotalQuantity =
      itemData.item.total_quantity - borrowRequest.quantity;

  if (newTotalQuantity < 0) {
    return res.status(400).json({
      message: "Stok barang tidak mencukupi untuk melakukan peminjaman."
    });
  }

  
  await grpcCall(itemClient, 'UpdateItem', {
    id: borrowRequest.item_id,
    total_quantity: newTotalQuantity
  });

  
  await grpcCall(notificationClient, 'SendNotification', {
      user_id: borrowRequest.user_id,
      message: `Peminjaman Anda untuk ${itemData.item.name} (ID: ${borrowRequest.id}) telah disetujui.`,
      type: 'BORROW_APPROVED'
  });

  res.status(200).json(borrowRequest);
});

// @desc    Admin: Menolak request peminjaman
// @route   POST /api/admin/borrowings/reject
const rejectBorrowing = asyncHandler(async (req, res) => {
    const { borrowing_id, admin_notes } = req.body;
    const admin_id = req.user.id;

    const response = await grpcCall(borrowingClient, 'RejectBorrowing', {
        borrowing_id,
        admin_id,
        admin_notes: admin_notes || 'Ditolak',
    });
    
    const borrowRequest = response.borrow_request;
    
    const itemData = await grpcCall(itemClient, 'GetItem', { id: borrowRequest.item_id });

    await grpcCall(notificationClient, 'SendNotification', {
        user_id: borrowRequest.user_id,
        message: `Mohon maaf, peminjaman Anda untuk ${itemData.item.name} (ID: ${borrowRequest.id}) ditolak. Alasan: ${admin_notes || 'N/A'}`,
        type: 'BORROW_REJECTED'
    });

    res.status(200).json(borrowRequest);
});

// @desc    Admin: Menandai barang telah kembali
// @route   POST /api/admin/borrowings/return
const markAsReturnedByAdmin = asyncHandler(async (req, res) => {
    const { borrowing_id, admin_notes } = req.body;
    const admin_id = req.user.id; 

    const response = await grpcCall(borrowingClient, 'ReturnItem', {
        borrowing_id,
        user_id: admin_id,
        admin_notes: admin_notes || 'Dikembalikan oleh admin'
    });
    
    const borrowRequest = response.borrow_request;

    const itemData = await grpcCall(itemClient, 'GetItem', { id: borrowRequest.item_id });

    
    const newTotalQuantity =
        itemData.item.total_quantity + borrowRequest.quantity;

    await grpcCall(itemClient, 'UpdateItem', {
        id: borrowRequest.item_id,
        total_quantity: newTotalQuantity
    });
    
    res.status(200).json(borrowRequest);
});

// @desc    Admin: Lihat riwayat
// @route   GET /api/admin/history
const getHistory = asyncHandler(async (req, res) => {
    const response = await grpcCall(borrowingClient, 'GetHistory', {});
    res.status(200).json(response.borrow_requests);
});

module.exports = {
  getAllBorrowings,
  approveBorrowing,
  rejectBorrowing,
  markAsReturnedByAdmin,
  getHistory,
};
