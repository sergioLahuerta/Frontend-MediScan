import axios, { AxiosInstance } from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5073/api',
  headers: {
    'Accept': 'application/json'
  }
});

// Attach JWT token to every request
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

// Auto-logout on 401, surface error messages on other failures
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    // Re-throw with a clean message from the backend or a default
    const message =
      error.response?.data?.message ||
      error.response?.data?.Message ||
      error.message ||
      'Network error. Please check if the backend is running.';

    // Preserve the original AxiosError object so callers can read error.response.status
    error.message = message;
    return Promise.reject(error);
  }
);

export default apiClient;
