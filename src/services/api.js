export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000';

const buildUrl = (path, params) => {
  const base = API_BASE_URL.replace(/\/+$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(`${base}${cleanPath}`);

  if (params && typeof params === 'object') {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
};

const request = async (method, path, { params, data } = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  try {
    const token = localStorage.getItem('token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // ignore storage errors
  }

  const response = await fetch(buildUrl(path, params), {
    method,
    headers,
    body: data !== undefined ? JSON.stringify(data) : undefined,
  });

  const responseData = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      try {
        localStorage.removeItem('token');
      } catch {
        // ignore
      }
    }
    const error = new Error(
      responseData?.message || `Request failed with status ${response.status}`
    );
    error.response = {
      status: response.status,
      data: responseData,
    };
    throw error;
  }

  return { data: responseData, status: response.status };
};

const api = {
  get: (path, config = {}) => request('GET', path, config),
  post: (path, data, config = {}) => request('POST', path, { ...config, data }),
  patch: (path, data, config = {}) =>
    request('PATCH', path, { ...config, data }),
  delete: (path, config = {}) => request('DELETE', path, config),
};

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
  const numericRating = Math.min(
    5,
    Math.max(1, Number(reviewPayload.rating) || 5)
  );

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

export const fetchUserOrdersFromDB = async ({
  email = '',
  userId = '',
} = {}) => {
  if (!email && !userId) return [];
  const res = await api.get('/api/orders', {
    params: { email, userId },
  });
  return res.data.orders || [];
};

export const trackOrderInDB = async ({ invoiceNumber, phone }) => {
  const res = await api.get('/api/orders/track', {
    params: { invoiceNumber, phone },
  });
  return res.data.order;
};

export const cancelOrderInDB = async (invoiceNumber) => {
  const res = await api.patch(
    `/api/orders/${encodeURIComponent(invoiceNumber)}/cancel`
  );
  return res.data;
};

export const createPreOrderInDB = async (preOrderPayload) => {
  const res = await api.post('/api/pre-orders', preOrderPayload);
  return res.data.preOrder;
};

export default api;
