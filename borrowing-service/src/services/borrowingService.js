const grpc = require('@grpc/grpc-js');
const Borrowing = require('../models/borrowingModel');
const { Op } = require('sequelize');

const mapBorrowingToProto = (borrowingJSON) => {
  return {
    id: borrowingJSON.id,
    user_id: borrowingJSON.userId, 
    item_id: borrowingJSON.itemId, 
    quantity: borrowingJSON.quantity,
    start_date: borrowingJSON.startDate, 
    end_date: borrowingJSON.endDate, 
    status: borrowingJSON.status,
    notes: borrowingJSON.notes,
    admin_notes: borrowingJSON.adminNotes, 
    created_at: borrowingJSON.createdAt, 
  };
};

const borrowingService = {
  CreateBorrowRequest: async (call, callback) => {
    const { user_id, item_id, quantity, start_date, end_date, notes } = call.request;
    try {
      if (!user_id || !item_id || !quantity || !start_date || !end_date) {
        return callback({
          code: grpc.status.INVALID_ARGUMENT,
          message: 'Missing required fields',
        });
      }
      const newBorrowing = await Borrowing.create({
        userId: user_id,
        itemId: item_id,
        quantity: quantity,
        startDate: new Date(start_date),
        endDate: new Date(end_date),
        notes: notes || '',
        status: 'pending',
      });
      callback(null, { borrow_request: mapBorrowingToProto(newBorrowing.toJSON()) });
    } catch (error) {
      console.error(error);
      callback({ code: grpc.status.INTERNAL, message: error.message });
    }
  },

  UpdateBorrowStatus: async (borrowing_id, new_status, admin_notes = '', callback) => {
    try {
      const borrowRequest = await Borrowing.findByPk(borrowing_id);
      if (!borrowRequest) {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: 'Borrowing request not found',
        });
      }

      borrowRequest.status = new_status;
      if (admin_notes) {
        borrowRequest.adminNotes = admin_notes;
      }
      await borrowRequest.save();
      callback(null, { borrow_request: mapBorrowingToProto(borrowRequest.toJSON()) });
    } catch (error) {
      console.error(error);
      callback({ code: grpc.status.INTERNAL, message: error.message });
    }
  },
  
  ApproveBorrowing: (call, callback) => {
    const { borrowing_id, admin_notes } = call.request;
    borrowingService.UpdateBorrowStatus(borrowing_id, 'approved', admin_notes, callback);
  },

  RejectBorrowing: (call, callback) => {
    const { borrowing_id, admin_notes } = call.request;
    borrowingService.UpdateBorrowStatus(borrowing_id, 'rejected', admin_notes, callback);
  },

  ReturnItem: (call, callback) => {
    const { borrowing_id, admin_notes } = call.request;
    borrowingService.UpdateBorrowStatus(borrowing_id, 'returned', admin_notes, callback);
  },

  GetMyBorrowings: async (call, callback) => {
    try {
      const requests = await Borrowing.findAll({
        where: { userId: call.request.user_id },
        order: [['createdAt', 'DESC']],
      });
      callback(null, { borrow_requests: requests.map(r => mapBorrowingToProto(r.toJSON())) });
    } catch (error) {
      console.error(error);
      callback({ code: grpc.status.INTERNAL, message: error.message });
    }
  },

  GetAllBorrowings: async (call, callback) => {
    const { status_filter } = call.request;
    try {
      let whereCondition = {};
      if (status_filter) {
        whereCondition.status = status_filter;
      }
      const requests = await Borrowing.findAll({
        where: whereCondition,
        order: [['createdAt', 'DESC']],
      });
      callback(null, { borrow_requests: requests.map(r => mapBorrowingToProto(r.toJSON())) });
    } catch (error) {
      console.error(error);
      callback({ code: grpc.status.INTERNAL, message: error.message });
    }
  },
  
  GetHistory: async (call, callback) => {
     const { user_id, start_date_filter, end_date_filter } = call.request;
     try {
       let whereCondition = {
           status: {
               [Op.in]: ['returned', 'rejected', 'late']
           }
       };
       if (user_id) {
           whereCondition.userId = user_id;
       }
       // ... (logika filter tanggal) ...
       const requests = await Borrowing.findAll({
           where: whereCondition,
           order: [['updatedAt', 'DESC']]
       });
       callback(null, { borrow_requests: requests.map(r => mapBorrowingToProto(r.toJSON())) });
     } catch (error) {
        console.error(error);
        callback({ code: grpc.status.INTERNAL, message: error.message });
     }
  },
};

module.exports = borrowingService;