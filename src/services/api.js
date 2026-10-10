import axios from 'axios';

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create Axios client configured with backend base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
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

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

// ---------------------------------------------------------------------------
// 1. USER REGISTRATION & LOGIN TIME TRACKING (MongoDB 'users' collection)
// ---------------------------------------------------------------------------
export const registerUserInDB = async (userData) => {
  const payload = {
    uid: userData.uid,
    email: userData.email,
    displayName:
      userData.displayName || userData.email?.split('@')[0] || 'Sarail Customer',
    photoURL: userData.photoURL || '',
    phone: userData.phone || '',
    authProvider: userData.authProvider || 'password',
    emailVerified: Boolean(userData.emailVerified),
  };

  const res = await api.post('/api/users/register', payload);
  return res.data.user;
};

export const updateUserLoginTimeInDB = async (userData) => {
  const payload = {
    uid: userData.uid,
    email: userData.email,
    displayName: userData.displayName || '',
    photoURL: userData.photoURL || '',
    authProvider: userData.authProvider || 'password',
    emailVerified: Boolean(userData.emailVerified),
  };

  const res = await api.patch('/api/users/login', payload);
  return res.data.user;
};

export const fetchUserProfileFromDB = async (uidOrEmail) => {
  if (!uidOrEmail) return null;
  const res = await api.get(`/api/users/${encodeURIComponent(uidOrEmail)}`);
  return res.data.user;
};

// ---------------------------------------------------------------------------
// 2. PRODUCTS & 10-PRODUCT PAGINATION (MongoDB 'products' collection)
// ---------------------------------------------------------------------------
export const fetchPaginatedProducts = async ({
  page = 1,
  limit = 10,
  category = 'all',
  tag = 'all',
  search = '',
  sort = 'featured',
  all = false,
} = {}) => {
  const res = await api.get('/api/products', {
    params: {
      page,
      limit,
      category,
      tag,
      search,
      sort,
      all: all ? 'true' : 'false',
    },
  });
  return res.data;
};

export const fetchProducts = async () => {
  const data = await fetchPaginatedProducts({ all: true });
  return data.products || [];
};

export const fetchProductById = async (id) => {
  const res = await api.get(`/api/products/${id}`);
  return res.data.product;
};

// ---------------------------------------------------------------------------
// 3. PRODUCT REVIEWS & DYNAMIC STAR RATINGS (MongoDB 'reviews' collection)
// ---------------------------------------------------------------------------
export const fetchProductReviews = async (productId) => {
  const pid = Number(productId);
  const res = await api.get(`/api/products/${pid}/reviews`);
  return res.data;
};

export const submitProductReview = async (productId, reviewPayload) => {
  const pid = Number(productId);
  const numericRating = Math.min(5, Math.max(1, Number(reviewPayload.rating) || 5));

  const res = await api.post(`/api/products/${pid}/reviews`, {
    ...reviewPayload,
    rating: numericRating,
  });
  return res.data;
};

// ---------------------------------------------------------------------------
// 4. CATEGORIES, DELIVERY CHARGES & ORDERS (MongoDB collections)
// ---------------------------------------------------------------------------
export const fetchCategories = async () => {
  const res = await api.get('/api/categories');
  return res.data.categories || [];
};

export const fetchDeliveryCharges = async () => {
  const res = await api.get('/api/delivery-charges');
  return res.data.deliveryCharges || [];
};

export const createOrderInDB = async (orderPayload) => {
  const res = await api.post('/api/orders', orderPayload);
  return res.data.order;
};

export const fetchOrdersFromDB = async () => {
  const res = await api.get('/api/orders');
  return res.data.orders || [];
};

export const trackOrderInDB = async ({ invoiceNumber, phone }) => {
  const res = await api.get('/api/orders/track', {
    params: { invoiceNumber, phone },
  });
  return res.data.order;
};

export const createPreOrderInDB = async (preOrderPayload) => {
  const res = await api.post('/api/pre-orders', preOrderPayload);
  return res.data.preOrder;
};

export default api;
