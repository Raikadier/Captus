// API client for making HTTP requests to the backend
import axios from 'axios';

const getBaseUrl = () => {
  let url = import.meta.env.VITE_API_BASE_URL || '/api';
  // Ensure it ends with /api if it's a full URL and doesn't have it
  if (url.startsWith('http') && !url.endsWith('/api')) {
    url = `${url}/api`;
  }
  return url;
};

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
