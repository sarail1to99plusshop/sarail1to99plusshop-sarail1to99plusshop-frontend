import axios from 'axios';

// Create Axios client configured with base URL and timeout
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor: add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

// Data fetching helpers for public JSON endpoints
export const fetchProducts = async () => {
  try {
    const res = await api.get('/data/products.json');
    return res.data;
  } catch {
    const res = await api.get('/products.json');
    return res.data;
  }
};

export const fetchProductById = async (id) => {
  const products = await fetchProducts();
  const searchId = id?.toString();
  return (
    products.find(
      (p) => p.id?.toString() === searchId || p._id?.$oid === searchId
    ) || null
  );
};

export const fetchCategories = async () => {
  const res = await api.get('/data/categories.json');
  return res.data;
};

export const fetchBrands = async () => {
  const res = await api.get('/data/brands.json');
  return res.data;
};

export default api;
