import api from './api';

const register = (name, email, password, phoneNumber) => {
  return api.post('/api/auth/register', {
    name,
    email,
    password,
    phone_number: phoneNumber,
  });
};

const login = (email, password) => {
  return api.post('/api/auth/login', {
    email,
    password,
  }).then((response) => {
    return response.data;
  });
};

const getMe = () => {
  return api.get('/api/auth/me');
};

const authService = {
  register,
  login,
  getMe,
};

export default authService;