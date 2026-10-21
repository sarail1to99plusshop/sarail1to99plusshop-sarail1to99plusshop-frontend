// In development mode on localhost, use empty base URL so requests go to the same origin (http://localhost:5173/api/...)
// and are proxied by Vite dev server directly to the backend. This eliminates CORS preflight issues entirely.
const isDev = import.meta.env.DEV;
export const API_BASE_URL = isDev
  ? ''
  : (import.meta.env.VITE_API_URL || 'https://store-backend-taupe-six.vercel.app');

const buildUrl = (path, params) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const base = API_BASE_URL
    ? API_BASE_URL.replace(/\/+$/, '')
    : (typeof window !== 'undefined' && window.location?.origin
        ? window.location.origin
        : 'http://localhost:5173');
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
    const isAdminPath = path.startsWith('/api/admin');
    const adminToken = localStorage.getItem('admin_token');
    const userToken = localStorage.getItem('token');
    const token = isAdminPath ? (adminToken || userToken) : (userToken || adminToken);

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
        if (path.startsWith('/api/admin')) {
          localStorage.removeItem('admin_token');
        } else {
          localStorage.removeItem('token');
        }
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
  put: (path, data, config = {}) => request('PUT', path, { ...config, data }),
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

// ---------------------------------------------------------------------------
// 5. ADMIN PANEL API METHODS (MongoDB & Real-time Operations)
// ---------------------------------------------------------------------------
export const adminLoginAPI = async ({ email, password }) => {
  const res = await api.post('/api/admin/login', { email, password });
  if (res.data?.token) {
    try {
      localStorage.setItem('admin_token', res.data.token);
      localStorage.setItem('admin_user', JSON.stringify(res.data.admin));
    } catch {
      // ignore
    }
  }
  return res.data;
};

export const fetchSystemStatusAPI = async () => {
  const res = await api.get('/api/admin/system-status');
  return res.data;
};

export const fetchAdminProductsAPI = async ({
  search = '',
  category = 'all',
  stockFilter = 'all',
} = {}) => {
  const res = await api.get('/api/admin/products', {
    params: { search, category, stockFilter },
  });
  return res.data.products || [];
};

export const createAdminProductAPI = async (productData) => {
  const res = await api.post('/api/admin/products', productData);
  return res.data.product;
};

export const updateAdminProductAPI = async (id, productData) => {
  const res = await api.put(`/api/admin/products/${id}`, productData);
  return res.data.product;
};

export const updateAdminProductStockAPI = async (id, { stock, delta }) => {
  const res = await api.patch(`/api/admin/products/${id}/stock`, {
    stock,
    delta,
  });
  return res.data.product;
};

export const deleteAdminProductAPI = async (id) => {
  const res = await api.delete(`/api/admin/products/${id}`);
  return res.data;
};

export const fetchAdminOrdersAPI = async ({
  status = 'all',
  paymentStatus = 'all',
  search = '',
  page = 1,
  limit = 50,
} = {}) => {
  const res = await api.get('/api/admin/orders', {
    params: { status, paymentStatus, search, page, limit },
  });
  return res.data;
};

export const shipOrderSteadfastAPI = async (
  invoiceNumber,
  { consignmentId, trackingCode, codAmount, note, forceReship } = {}
) => {
  const res = await api.post(
    `/api/admin/orders/${encodeURIComponent(invoiceNumber)}/ship-steadfast`,
    { consignmentId, trackingCode, codAmount, note, forceReship }
  );
  return res.data;
};

export const updateOrderStatusAPI = async (invoiceNumber, orderStatus) => {
  const res = await api.patch(
    `/api/admin/orders/${encodeURIComponent(invoiceNumber)}/status`,
    { orderStatus }
  );
  return res.data;
};

export const updateOrderPaymentStatusAPI = async (
  invoiceNumber,
  { paymentStatus, verificationNote }
) => {
  const res = await api.patch(
    `/api/admin/orders/${encodeURIComponent(invoiceNumber)}/payment-status`,
    { paymentStatus, verificationNote }
  );
  return res.data;
};

export const fetchMonthlyDeliveredReportAPI = async ({
  year = '',
  month = '',
} = {}) => {
  const res = await api.get('/api/admin/reports/monthly', {
    params: { year, month },
  });
  return res.data;
};

export const pollRecentOrdersAPI = async (sinceTimestamp) => {
  const res = await api.get('/api/admin/orders/poll', {
    params: { since: sinceTimestamp },
  });
  return res.data;
};

export default api;
