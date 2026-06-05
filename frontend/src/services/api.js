import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // URL API Gateway

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor untuk menambahkan Token ke setiap request
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers['Authorization'] = 'Bearer ' + user.token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;