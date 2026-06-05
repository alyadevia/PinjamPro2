const asyncHandler = require('express-async-handler');
const { itemClient } = require('../config/grpcClients');
const { grpcCall } = require('./helper/grpcHelper');

const getBaseUrl = (req) => {
  return req.protocol + '://' + req.get('host');
};

const listItems = asyncHandler(async (req, res) => {
  const { category_filter } = req.query;
  const response = await grpcCall(itemClient, 'ListItems', {
    category_filter: category_filter || '',
  });
  res.status(200).json(response.items);
});

const getItemById = asyncHandler(async (req, res) => {
  const response = await grpcCall(itemClient, 'GetItem', { id: req.params.id });
  res.status(200).json(response.item);
});

const createItem = asyncHandler(async (req, res) => {
  const { name, description, category, total_quantity } = req.body;
  
  let image_url = null;
  if (req.file) {
    image_url = `${getBaseUrl(req)}/uploads/${req.file.filename}`;
  }

  const response = await grpcCall(itemClient, 'CreateItem', {
    name,
    description,
    category,
    total_quantity: parseInt(total_quantity, 10),
    image_url, 
  });
  res.status(201).json(response.item);
});

const updateItem = asyncHandler(async (req, res) => {
  const { name, description, category, total_quantity } = req.body;
  
  let image_url = req.body.image_url || null; 
  if (req.file) {
    image_url = `${getBaseUrl(req)}/uploads/${req.file.filename}`;
  }

  const response = await grpcCall(itemClient, 'UpdateItem', {
    id: req.params.id,
    name,
    description,
    category,
    total_quantity: total_quantity ? parseInt(total_quantity, 10) : undefined,
    image_url,
  });
  res.status(200).json(response.item);
});

const deleteItem = asyncHandler(async (req, res) => {
  await grpcCall(itemClient, 'DeleteItem', { id: req.params.id });
  res.status(200).json({ message: 'Item deleted' });
});

module.exports = {
  listItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};