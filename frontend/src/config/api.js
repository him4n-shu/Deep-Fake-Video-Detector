// API configuration for different environments
const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:8000',
    timeout: 30000
  },
  production: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://your-backend-url.onrender.com',
    timeout: 60000
  }
};

// Get current environment
const isDevelopment = import.meta.env.DEV;
const currentConfig = isDevelopment ? API_CONFIG.development : API_CONFIG.production;

// Export API configuration
export const API_BASE_URL = currentConfig.baseURL;
export const API_TIMEOUT = currentConfig.timeout;

// Helper function to build full API URLs
export const buildApiUrl = (endpoint) => {
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

// API endpoints
export const API_ENDPOINTS = {
  ANALYZE_VIDEO: '/analyze-video',
  VERIFICATION: (id) => `/verification/${id}`,
  VERIFICATIONS: '/verifications',
  STATISTICS: '/statistics',
  HEALTH: '/health'
};

export default {
  API_BASE_URL,
  API_TIMEOUT,
  buildApiUrl,
  API_ENDPOINTS
};
