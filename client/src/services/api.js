import axios from 'axios';

// Live Render production backend fallback URL
const RENDER_BACKEND_URL = 'https://task-management-srv-dappcgbbc2fs73bivrfg.onrender.com';

const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // If running in production (e.g. on Vercel), automatically target live Render backend
  if (
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1'
  ) {
    return RENDER_BACKEND_URL;
  }
  return '/';
};

const API = axios.create({
  baseURL: getBaseURL(),
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
