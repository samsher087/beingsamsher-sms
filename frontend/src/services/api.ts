import axios from 'axios';

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    const trimmed = envUrl.trim().replace(/\/+$/, '');
    return trimmed.endsWith('/api/v1') ? trimmed : `${trimmed}/api/v1`;
  }
  return '/api/v1';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sms_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const tenantCode = localStorage.getItem('sms_tenant_code') || 'dps-rkp';
  if (tenantCode) {
    config.headers['x-tenant-code'] = tenantCode;
  }

  const tenantId = localStorage.getItem('sms_tenant_id');
  if (tenantId) {
    config.headers['x-tenant-id'] = tenantId;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/public')) {
      // Optional auto cleanup
      // localStorage.removeItem('sms_token');
    }
    return Promise.reject(error);
  }
);

export default api;
