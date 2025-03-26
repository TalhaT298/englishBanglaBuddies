
import axios from 'axios';

// Base URL should be updated to your actual Express backend URL when deployed
const API_BASE_URL = 'http://localhost:3030/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Example API methods
export const api = {
  // Auth endpoints
  auth: {
    login: (email: string, password: string) => 
      apiClient.post('/auth/login', { email, password }),
    register: (userData: any) => 
      apiClient.post('/auth/register', userData),
    logout: () => 
      apiClient.post('/auth/logout'),
  },
  
  // User endpoints
  user: {
    getProfile: () => 
      apiClient.get('/user/profile'),
    updateProfile: (data: any) => 
      apiClient.put('/user/profile', data),
  },

  // Example data endpoint - replace with your actual data needs
  data: {
    getItems: () => 
      apiClient.get('/items'),
    getItemById: (id: string) => 
      apiClient.get(`/items/${id}`),
    createItem: (data: any) => 
      apiClient.post('/items', data),
    updateItem: (id: string, data: any) => 
      apiClient.put(`/items/${id}`, data),
    deleteItem: (id: string) => 
      apiClient.delete(`/items/${id}`),
  },

  // Payment endpoints
  payment: {
    // SSLCommerz payment methods
    initSSLCommerz: (paymentData: any) => 
      apiClient.post('/payment/init', paymentData),
    validateSSLCommerz: (validationData: any) => 
      apiClient.post('/payment/validate', validationData),
    initiateRefund: (refundData: any) => 
      apiClient.post('/payment/refund', refundData),
    checkRefundStatus: (refundRefId: string) => 
      apiClient.get(`/payment/refund-status/${refundRefId}`),
    checkTransactionStatus: (tranId: string) => 
      apiClient.get(`/payment/transaction-status/${tranId}`),
  },
  
  // Girlfriend profiles endpoints
  girlfriends: {
    getAll: () => 
      apiClient.get('/girlfriends'),
    getById: (id: string) => 
      apiClient.get(`/girlfriends/${id}`),
    create: (data: any) => 
      apiClient.post('/girlfriends', data),
    update: (id: string, data: any) => 
      apiClient.put(`/girlfriends/${id}`, data),
    delete: (id: string) => 
      apiClient.delete(`/girlfriends/${id}`),
  }
};
