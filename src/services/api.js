import axios from 'axios';

// API URL - uses environment variable or falls back to production
const API_URL = process.env.REACT_APP_API_URL || 'https://ai-sdr-backend.onrender.com';

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
  getAiSettings: () => api.get('/api/settings/ai'),
  updateAiSettings: (data) => api.put('/api/settings/ai', data),
  testAiConnection: () => api.post('/api/settings/ai/test'),
  getApiCredentials: () => api.get('/api/settings/api-credentials'),
  regenerateApiKey: () => api.post('/api/settings/api-key/regenerate'),
  updateWebhook: (url) => api.put('/api/settings/webhook', { webhookUrl: url }),
  getIntegrations: () => api.get('/api/settings/integrations'),
};

// Subscription APIs
export const subscriptionAPI = {
  getSubscription: () => api.get('/api/subscription'),
  getPlans: () => api.get('/api/subscription/plans'),
  createCheckout: (planKey, billingPeriod = 'monthly') => 
    api.post('/api/subscription/checkout', { planKey, billingPeriod }),
  createPortalSession: () => api.post('/api/subscription/portal'),
  cancelSubscription: () => api.post('/api/subscription/cancel'),
  reactivateSubscription: () => api.post('/api/subscription/reactivate'),
};

// Scraper APIs
export const scraperAPI = {
  getConfig: () => api.get('/api/scraper/config'),
  updateConfig: (data) => api.put('/api/scraper/config', data),
  testScraper: () => api.post('/api/scraper/test'),
  getLeadTypes: () => api.get('/api/scraper/lead-types'),
};

// Public API (for integrations)
export const publicAPI = {
  getLeads: (apiKey, params) => api.get('/v1/leads', { 
    headers: { 'X-API-Key': apiKey },
    params 
  }),
};
