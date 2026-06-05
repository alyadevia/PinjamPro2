const asyncHandler = require('express-async-handler');
const { userClient } = require('../config/grpcClients');
const { grpcCall } = require('./helper/grpcHelper'); 

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone_number } = req.body;

  if (!name || !email || !password || !phone_number) {
    res.status(400);
    throw new Error('Please fill all fields');
  }

  const response = await grpcCall(userClient, 'Register', {
    name,
    email,
    password,
    phone_number, 
  });

  res.status(201).json(response.user);
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const response = await grpcCall(userClient, 'Login', { email, password });

  res.status(200).json({
    id: response.user.id,
    name: response.user.name,
    email: response.user.email,
    role: response.user.role,
    phone_number: response.user.phone_number, 
    token: response.token,
  });
});

const getMe = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const response = await grpcCall(userClient, 'GetUser', { id: userId });
  res.status(200).json(response.user);
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
};