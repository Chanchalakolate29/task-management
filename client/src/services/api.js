import axios from 'axios';

// Base API configuration
const API = axios.create({
  baseURL: '/', // Uses Vite dev proxy or absolute URL in production
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for injecting JWT auth token
API.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null;

    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling auth expiration & global errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 Unauthorized handling (Expired/Invalid JWT)
    if (error.response && error.response.status === 401) {
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        localStorage.removeItem('userInfo');
        window.dispatchEvent(new Event('unauthorized-access'));
      }
    }
    return Promise.reject(error);
  }
);

export default API;
