import api from './api';

const register = (name, email, password, phoneNumber) => {
  return api.post('/auth/register', {
    name,
    email,
    password,
    phone_number: phoneNumber,
  });
};

const login = (email, password) => {
  return api.post('/auth/login', {
    email,
    password,
  }).then((response) => {
    return response.data;
  });
};

const getMe = () => {
  return api.get('/auth/me');
};

const authService = {
  register,
  login,
  getMe,
};

export default authService;