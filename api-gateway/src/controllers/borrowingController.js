const asyncHandler = require('express-async-handler');
const { borrowingClient, itemClient } = require('../config/grpcClients');
const { grpcCall } = require('./helper/grpcHelper');

const createBorrowRequest = asyncHandler(async (req, res) => {
  const { item_id, quantity, start_date, end_date, notes } = req.body;
  const user_id = req.user.id; 

  let itemData;
  try {
    itemData = await grpcCall(itemClient, 'GetItem', { id: item_id });
  } catch (error) {
    res.status(404);
    throw new Error('Item not found');
  }

  if (itemData.item.available_quantity < quantity) {
    res.status(400);
    throw new Error('Not enough items available');
  }

  const response = await grpcCall(borrowingClient, 'CreateBorrowRequest', {
    user_id,
    item_id,
    quantity: parseInt(quantity, 10),
    start_date,
    end_date,
    notes,
  });
  
  res.status(201).json(response.borrow_request);
});

const getMyBorrowings = asyncHandler(async (req, res) => {
  const user_id = req.user.id;
  const response = await grpcCall(borrowingClient, 'GetMyBorrowings', { user_id });
  res.status(200).json(response.borrow_requests);
});



module.exports = {
  createBorrowRequest,
  getMyBorrowings,
};