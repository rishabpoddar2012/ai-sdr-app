import axios from 'axios';

// Live API URL
const API_URL = 'https://795868fa4a12cfe9-13-48-42-148.serveousercontent.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth APIs
export const authAPI = {
  login: (email, password) => api.post('/api/auth/login', { email, password }),
  register: (data) => api.post('/api/auth/register', data),
  getProfile: () => api.get('/api/auth/me'),
  updateProfile: (data) => api.put('/api/auth/profile', data),
  changePassword: (data) => api.post('/api/auth/change-password', data),
};

// Lead APIs
export const leadsAPI = {
  getLeads: (params) => api.get('/api/leads', { params }),
  getLead: (id) => api.get(`/api/leads/${id}`),
  updateLead: (id, data) => api.put(`/api/leads/${id}`, data),
  deleteLead: (id) => api.delete(`/api/leads/${id}`),
  getStats: () => api.get('/api/leads/stats'),
  exportLeads: (format) => api.get(`/api/leads/export?format=${format}`),
};

// Settings APIs
export const settingsAPI = {
  getSettings: () => api.get('/api/settings'),
  updateSettings: (data) => api.put('/api/settings', data),
  testScoring: (text) => api.post('/api/test/scoring', { text }),
};

// Public API (for integrations)
export const publicAPI = {
  getLeads: (apiKey, params) => api.get('/v1/leads', { 
    headers: { 'X-API-Key': apiKey },
    params 
  }),
};
