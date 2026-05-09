import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor để thêm token vào headers
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

// Interceptor để xử lý response
apiClient.interceptors.response.use(
  (response) => {
    return response.data; // unwrap data
  },
  (error) => {
    // Xử lý lỗi chung (VD: 401 Unauthorized)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // Tùy chọn: redirect về login
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export default apiClient;
