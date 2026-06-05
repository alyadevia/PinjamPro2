import axios from 'axios';

const API_URL = 'https://backend-production-cf75a.up.railway.app'; // URL API Gateway

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