/**
 * High-performance image optimization & fallback utility for Sarail 1 to 99 Plus Shop.
 * - Passes through all database and CDN image URLs faithfully.
 * - Normalizes alias hosts (e.g. i.ibb.co.com -> i.ibb.co).
 * - Natively optimizes Unsplash CDN images only if an Unsplash image is explicitly supplied.
 */

export const normalizeExternalHost = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();

  // Normalize i.ibb.co.com alias to direct i.ibb.co
  return trimmed.replace('://i.ibb.co.com/', '://i.ibb.co/');
};

export const optimizeImageUrl = (
  rawUrl,
  { width = 240, height = 240, quality = 75 } = {}
) => {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();

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

  const normalized = normalizeExternalHost(originalUrl);
  if (normalized && normalized !== originalUrl && img.src !== normalized && !img.dataset.triedNormalized) {
    img.dataset.triedNormalized = 'true';
    img.removeAttribute('srcset');
    img.src = normalized;
    return;
  }

  if (!img.dataset.triedFallback) {
    img.dataset.triedFallback = 'true';
    img.removeAttribute('srcset');
    img.src = fallbackUrl;
  }
};
