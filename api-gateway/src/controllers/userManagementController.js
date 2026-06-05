const asyncHandler = require('express-async-handler');
const { userClient } = require('../config/grpcClients');
const { grpcCall } = require('./helper/grpcHelper');

const listUsers = asyncHandler(async (req, res) => {
  const { role_filter } = req.query;
  const response = await grpcCall(userClient, 'ListUsers', {
    role_filter: role_filter || '',
  });
  res.status(200).json(response.users);
});

const getUserById = asyncHandler(async (req, res) => {
  const response = await grpcCall(userClient, 'GetUser', { id: req.params.id });
  res.status(200).json(response.user);
});

const updateUser = asyncHandler(async (req, res) => {
  const { name, email, role, phone_number } = req.body;
  const response = await grpcCall(userClient, 'UpdateUser', {
    id: req.params.id,
    name,
    email,
    role,
    phone_number,
  });
  res.status(200).json(response.user);
});

const deleteUser = asyncHandler(async (req, res) => {
  await grpcCall(userClient, 'DeleteUser', { id: req.params.id });
  res.status(200).json({ message: 'User removed' });
});

module.exports = {
  listUsers,
  getUserById,
  updateUser,
  deleteUser,
};