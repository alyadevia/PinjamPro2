const grpc = require('@grpc/grpc-js');
const Borrowing = require('../models/borrowingModel');
const { Op } = require('sequelize');

const mapBorrowingToProto = (b) => ({
  id: b.id,
  user_id: b.userId,
  item_id: b.itemId,
  quantity: b.quantity,
  start_date: b.startDate,
  end_date: b.endDate,
  status: b.status,
  notes: b.notes,
  admin_notes: b.adminNotes,
  created_at: b.createdAt,
});

// ================= CREATE =================
const CreateBorrowRequest = async (call, callback) => {
  try {
    const { user_id, item_id, quantity, start_date, end_date, notes } = call.request;

    if (!user_id || !item_id || !quantity || !start_date || !end_date) {
      return callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: 'Missing required fields',
      });
    }

    const borrow = await Borrowing.create({
      userId: user_id,
      itemId: item_id,
      quantity,
      startDate: new Date(start_date),
      endDate: new Date(end_date),
      notes: notes || '',
      status: 'pending',
    });

    callback(null, {
      borrow_request: mapBorrowingToProto(borrow.toJSON()),
    });
  } catch (err) {
    console.error(err);
    callback({ code: grpc.status.INTERNAL, message: err.message });
  }
};

// ================= UPDATE STATUS (CORE FIX) =================
const UpdateBorrowStatus = async (borrowing_id, status, admin_notes = '') => {
  const borrow = await Borrowing.findByPk(borrowing_id);

  if (!borrow) {
    throw new Error('Borrowing request not found');
  }

  borrow.status = status;

  if (admin_notes) {
    borrow.adminNotes = admin_notes;
  }

  await borrow.save();
  return borrow;
};

// ================= APPROVE =================
const ApproveBorrowing = async (call, callback) => {
  try {
    const { borrowing_id, admin_notes } = call.request;

    const result = await UpdateBorrowStatus(
      borrowing_id,
      'approved',
      admin_notes
    );

    callback(null, {
      borrow_request: mapBorrowingToProto(result.toJSON()),
    });
  } catch (err) {
    console.error(err);
    callback({ code: grpc.status.INTERNAL, message: err.message });
  }
};

// ================= REJECT =================
const RejectBorrowing = async (call, callback) => {
  try {
    const { borrowing_id, admin_notes } = call.request;

    const result = await UpdateBorrowStatus(
      borrowing_id,
      'rejected',
      admin_notes
    );

    callback(null, {
      borrow_request: mapBorrowingToProto(result.toJSON()),
    });
  } catch (err) {
    console.error(err);
    callback({ code: grpc.status.INTERNAL, message: err.message });
  }
};

// ================= RETURN =================
const ReturnItem = async (call, callback) => {
  try {
    const { borrowing_id, admin_notes } = call.request;

    const result = await UpdateBorrowStatus(
      borrowing_id,
      'returned',
      admin_notes
    );

    callback(null, {
      borrow_request: mapBorrowingToProto(result.toJSON()),
    });
  } catch (err) {
    console.error(err);
    callback({ code: grpc.status.INTERNAL, message: err.message });
  }
};

// ================= GET USER =================
const GetMyBorrowings = async (call, callback) => {
  try {
    const data = await Borrowing.findAll({
      where: { userId: call.request.user_id },
      order: [['createdAt', 'DESC']],
    });

    callback(null, {
      borrow_requests: data.map((r) => mapBorrowingToProto(r.toJSON())),
    });
  } catch (err) {
    console.error(err);
    callback({ code: grpc.status.INTERNAL, message: err.message });
  }
};

// ================= GET ALL =================
const GetAllBorrowings = async (call, callback) => {
  try {
    const { status_filter } = call.request;

    const where = {};
    if (status_filter) where.status = status_filter;

    const data = await Borrowing.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });

    callback(null, {
      borrow_requests: data.map((r) => mapBorrowingToProto(r.toJSON())),
    });
  } catch (err) {
    console.error(err);
    callback({ code: grpc.status.INTERNAL, message: err.message });
  }
};

// ================= HISTORY =================
const GetHistory = async (call, callback) => {
  try {
    const { user_id } = call.request;

    const where = {
      status: { [Op.in]: ['returned', 'rejected', 'late'] },
    };

    if (user_id) {
      where.userId = user_id;
    }

    const data = await Borrowing.findAll({
      where,
      order: [['updatedAt', 'DESC']],
    });

    callback(null, {
      borrow_requests: data.map((r) => mapBorrowingToProto(r.toJSON())),
    });
  } catch (err) {
    console.error(err);
    callback({ code: grpc.status.INTERNAL, message: err.message });
  }
};

module.exports = {
  CreateBorrowRequest,
  UpdateBorrowStatus,
  ApproveBorrowing,
  RejectBorrowing,
  ReturnItem,
  GetMyBorrowings,
  GetAllBorrowings,
  GetHistory,
};