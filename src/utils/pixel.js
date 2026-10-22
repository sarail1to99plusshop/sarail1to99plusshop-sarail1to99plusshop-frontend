/**
 * Meta (Facebook) Pixel Helper Utility for SPA E-Commerce
 * Pixel ID: 4096200450685804
 * 
 * Compliant with Meta Pixel Standard Events Specification:
 * - PageView (SPA Dynamic Route Transitions)
 * - ViewContent (Product Details View)
 * - AddToCart (Product Added to Cart)
 * - Purchase (Checkout Order Completed)
 */

export const META_PIXEL_ID = '4096200450685804';

// In-memory cache for event deduplication
let lastTrackedPath = null;
const trackedPurchaseInvoices = new Set();

/**
 * Safe generic wrapper for Meta Pixel `fbq('track', ...)`
 * Verifies window.fbq exists before dispatching to prevent runtime errors
 * when ad-blockers, brave shields, or offline environments are present.
 * 
 * @param {string} eventName - Standard or custom event name (e.g., 'PageView', 'ViewContent')
 * @param {object} [data] - Event parameter payload
 */
export const trackPixelEvent = (eventName, data = {}) => {
  if (typeof window === 'undefined') return;

  if (typeof window.fbq === 'function') {
    try {
      if (data && Object.keys(data).length > 0) {
        window.fbq('track', eventName, data);
      } else {
        window.fbq('track', eventName);
      }
    } catch (err) {
      console.warn(`[Meta Pixel] Error dispatching event "${eventName}":`, err);
    }
  } else if (import.meta.env?.DEV) {
    console.debug(`[Meta Pixel (Dev)] "${eventName}":`, data);
  }
};

/**
 * SPA Dynamic Route Tracking (PageView)
 * Fires a PageView event on route navigation without duplicating initial render.
 * 
 * @param {string} [path] - Full pathname and query string
 */
export const trackPageView = (path) => {
  if (typeof window === 'undefined') return;

  const currentPath =
    path || window.location.pathname + window.location.search;

  if (lastTrackedPath === currentPath) {
    return; // Prevent duplicate PageView firing for the same URL in the same view
  }

  lastTrackedPath = currentPath;
  trackPixelEvent('PageView');
};

/**
 * Standard ViewContent Event
 * Triggered when a customer views a product details page.
 * 
 * @param {object} product - Product data object
 */
export const trackViewContent = (product) => {
  if (!product) return;

  const rawId = product.id || product._id?.$oid || product._id || product.productId || '';
  const productId = String(rawId).trim();
  const title = (product.name || product.title || 'Product').trim();
  const price = Number(product.price) || 0;

  trackPixelEvent('ViewContent', {
    content_name: title,
    content_ids: productId ? [productId] : [],
    content_type: 'product',
    value: price,
    currency: 'BDT',
  });
};

/**
 * Standard AddToCart Event
 * Triggered when a customer adds an item or variant to their shopping cart.
 * 
 * @param {object} product - Product data object
 * @param {number} [quantity=1] - Quantity added
 */
export const trackAddToCart = (product, quantity = 1) => {
  if (!product) return;

  const rawId = product.id || product._id?.$oid || product._id || product.productId || '';
  const productId = String(rawId).trim();
  const title = (product.name || product.title || 'Product').trim();
  const unitPrice = Number(product.price) || 0;
  const qty = Math.max(1, Number(quantity) || 1);
  const totalValue = unitPrice * qty;

  trackPixelEvent('AddToCart', {
    content_name: title,
    content_ids: productId ? [productId] : [],
    content_type: 'product',
    value: totalValue,
    currency: 'BDT',
  });
};

/**
 * Standard Purchase Event
 * Triggered immediately after the checkout API returns success.
 * Automatically deduplicated by invoice number to prevent double conversion reporting.
 * 
 * @param {object} order - Complete verified order object
 */
export const trackPurchase = (order) => {
  if (!order) return;

  const invoice = String(
    order.invoiceNumber || order.id || order._id?.$oid || order._id || ''
  ).trim();

  // Deduplicate using invoice number so re-renders or repeated callbacks don't fire twice
  if (invoice && trackedPurchaseInvoices.has(invoice)) {
    return;
  }
  if (invoice) {
    trackedPurchaseInvoices.add(invoice);
  }

  const items = Array.isArray(order.items) ? order.items : [];
  const content_ids = items
    .map((it) => {
      const id = it.productId || it.product?.$oid || it.product?._id || it.product || it.id || '';
      return id ? String(id).trim() : null;
    })
    .filter(Boolean);

  const num_items = items.reduce(
    (acc, it) => acc + (Number(it.quantity) || 1),
    0
  ) || Number(order.totalQuantity) || 1;

  const totalAmount = Number(order.totalAmount || order.total || 0);

  const purchasePayload = {
    content_type: 'product',
    content_ids: content_ids.length > 0 ? content_ids : undefined,
    value: Number(totalAmount),
    currency: 'BDT',
    num_items,
  };

  trackPixelEvent('Purchase', purchasePayload);
  console.log('[Meta Pixel] Purchase helper dispatched event:', purchasePayload);
};

/**
 * Reusable Async Purchase Dispatcher with Beacon Delay
 * Dispatches the Purchase event and delays callback execution (navigation, cart clearing)
 * by 400ms to allow network beacons to transmit before page unload or component unmount.
 *
 * @param {object} params
 * @param {Array} params.cartItems - Array of cart items
 * @param {number|string} params.finalAmount - Total order amount
 * @param {function} [params.onComplete] - Callback to execute after the delay
 * @param {number} [params.delayMs=400] - Delay in milliseconds
 */
export const dispatchPurchaseWithDelay = ({
  cartItems = [],
  finalAmount = 0,
  onComplete,
  delayMs = 400,
}) => {
  const content_ids = cartItems
    .map((item) => String(item.id || item.productId || item._id || item.product?._id || item.product || ''))
    .filter(Boolean);

  const payload = {
    content_type: 'product',
    content_ids: content_ids.length > 0 ? content_ids : undefined,
    value: Number(finalAmount), // Must be a valid Number, not a string or undefined
    currency: 'BDT',             // Must be uppercase 'BDT'
    num_items: cartItems.length,
  };

  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    try {
      window.fbq('track', 'Purchase', payload);
      console.log('[Meta Pixel] Purchase event dispatched successfully:', payload);
    } catch (err) {
      console.warn('[Meta Pixel] Error dispatching Purchase event:', err);
    }
  } else if (import.meta.env?.DEV) {
    console.debug('[Meta Pixel (Dev)] Purchase simulated payload:', payload);
  }

  if (typeof onComplete === 'function') {
    setTimeout(() => {
      onComplete();
    }, delayMs);
  }
};

