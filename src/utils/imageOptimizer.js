/**
 * High-performance image optimization & fallback utility for Sarail 1 to 99 Plus Shop.
 * - Passes through all database and CDN image URLs faithfully.
 * - Normalizes alias hosts (e.g. i.ibb.co.com -> i.ibb.co).
 * - Detects and filters out store logos / placeholder graphics from being mistakenly used as product images.
 * - Guarantees that product cards always display the true uploaded ImgBB photo, never the website logo.
 */

export const isInvalidProductImage = (url) => {
  if (!url || typeof url !== 'string') return true;
  const lower = url.trim().toLowerCase();
  return (
    lower === '' ||
    lower === 'undefined' ||
    lower === 'null' ||
    lower.includes('without-bg') ||
    lower.includes('without bg') ||
    lower.includes('/logo.png') ||
    lower.endsWith('logo.png') ||
    lower.endsWith('logo.webp') ||
    lower.includes('website logo') ||
    lower.includes('product-placeholder')
  );
};

export const normalizeExternalHost = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();

  // Normalize i.ibb.co.com alias to direct i.ibb.co
  return trimmed.replace('://i.ibb.co.com/', '://i.ibb.co/');
};

/**
 * Extracts a clean, valid product image URL from a product object.
 * Checks thumbnail, variant images, and product.images array.
 * Rejects any store logo or invalid placeholder so products never display the site logo.
 */
export const getCleanProductImageUrl = (
  product,
  fallback = '/product-placeholder.svg'
) => {
  if (!product) return fallback;

  // 1. Check product.thumbnail
  if (product.thumbnail && !isInvalidProductImage(product.thumbnail)) {
    return normalizeExternalHost(product.thumbnail);
  }

  // 2. Check variants
  if (Array.isArray(product.variants)) {
    for (const v of product.variants) {
      if (Array.isArray(v?.images)) {
        const found = v.images.find((img) => !isInvalidProductImage(img));
        if (found) return normalizeExternalHost(found);
      }
    }
  }

  // 3. Check product.images array
  if (Array.isArray(product.images)) {
    const found = product.images.find((img) => !isInvalidProductImage(img));
    if (found) return normalizeExternalHost(found);
  }

  // 4. Check product.image
  if (product.image && !isInvalidProductImage(product.image)) {
    return normalizeExternalHost(product.image);
  }

  return fallback;
};

export const optimizeImageUrl = (
  rawUrl,
  { width = 240, height = 240, quality = 75 } = {}
) => {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();

  if (isInvalidProductImage(trimmed)) {
    return '/product-placeholder.svg';
  }

  if (
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('/')
  ) {
    return trimmed;
  }

  const normalized = normalizeExternalHost(trimmed);

  // Optimize Unsplash URLs directly via native Imgix params (no third-party proxy overhead)
  if (normalized.includes('images.unsplash.com')) {
    const base = normalized.split('?')[0];
    return `${base}?w=${width}&h=${height}&auto=format&fit=crop&q=${quality}&fm=webp`;
  }

  // For all other image hosts (ImgBB, Cloudinary, Firebase, etc.), return direct normalized URL
  return normalized;
};

export const getOptimizedImageSrcSet = (
  rawUrl,
  widths = [180, 240, 320],
  quality = 75
) => {
  if (!rawUrl || typeof rawUrl !== 'string') return undefined;
  if (isInvalidProductImage(rawUrl)) return undefined;

  const normalized = normalizeExternalHost(rawUrl.trim());

  // Only Unsplash supports dynamic Imgix width-based srcSets reliably without proxy traps
  if (normalized.includes('images.unsplash.com')) {
    const base = normalized.split('?')[0];
    return widths
      .map(
        (w) =>
          `${base}?w=${w}&h=${Math.round(w * 1.15)}&auto=format&fit=crop&q=${quality}&fm=webp ${w}w`
      )
      .join(', ');
  }

  return undefined;
};

export const handleOptimizedImageLoad = (e) => {
  // Successful image load — faithfully render all user uploaded product images
  const img = e?.currentTarget;
  if (!img) return;
  img.dataset.loaded = 'true';
};

export const handleOptimizedImageError = (
  e,
  originalUrl,
  fallbackUrl = '/product-placeholder.svg'
) => {
  const img = e.currentTarget;
  if (!img) return;

  // Ensure fallback is NEVER a site logo
  const safeFallback = isInvalidProductImage(fallbackUrl)
    ? '/product-placeholder.svg'
    : fallbackUrl;

  const normalized = normalizeExternalHost(originalUrl);
  if (
    normalized &&
    normalized !== originalUrl &&
    img.src !== normalized &&
    !isInvalidProductImage(normalized) &&
    !img.dataset.triedNormalized
  ) {
    img.dataset.triedNormalized = 'true';
    img.removeAttribute('srcset');
    img.src = normalized;
    return;
  }

  if (!img.dataset.triedFallback) {
    img.dataset.triedFallback = 'true';
    img.removeAttribute('srcset');
    img.src = safeFallback;
  }
};
