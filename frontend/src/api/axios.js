import axios from 'axios';

// Main API instance connected to our Node backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true, // Important for cookies (JWT)
});

// Request interceptor to handle errors globally if needed
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // We could capture 401s here and dispatch a logout action if desired
    return Promise.reject(error);
  }
);

export default api;
