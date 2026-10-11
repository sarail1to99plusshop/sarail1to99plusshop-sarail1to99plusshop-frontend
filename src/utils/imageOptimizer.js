/**
 * Optimizes external product image URLs (i.ibb.co, i.ibb.co.com, unsplash)
 * using Cloudflare/wsrv.nl global image proxy to convert multi-megabyte PNGs
 * into tiny, fast-loading WebP images at exact display dimensions.
 */
const normalizeExternalHost = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();
  // i.ibb.co.com is an alias for i.ibb.co; normalize for faster CDN resolution
  return trimmed.replace('://i.ibb.co.com/', '://i.ibb.co/');
};

export const optimizeImageUrl = (
  rawUrl,
  { width = 240, height = 240, quality = 72 } = {}
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

  // Already optimized via wsrv.nl
  if (trimmed.includes('wsrv.nl/?url=')) {
    return trimmed;
  }

  // Optimize Unsplash URLs directly via Unsplash Imgix params
  if (trimmed.includes('images.unsplash.com')) {
    const base = trimmed.split('?')[0];
    return `${base}?w=${width}&h=${height}&auto=format&fit=max&q=${quality}&fm=webp`;
  }

  // Proxy external images (e.g., i.ibb.co.com / i.ibb.co) through wsrv.nl WebP optimizer
  // Using both w and h with fit=inside guarantees portrait images never exceed displayed height
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    const normalized = normalizeExternalHost(trimmed);
    return `https://wsrv.nl/?url=${encodeURIComponent(
      normalized
    )}&w=${width}&h=${height}&fit=inside&we&q=${quality}&output=webp`;
  }

  return trimmed;
};

/**
 * Generates a responsive srcSet string for product card thumbnails so mobile
 * and desktop viewports download the exact image resolution they need.
 */
export const getOptimizedImageSrcSet = (
  rawUrl,
  widths = [180, 240, 320],
  quality = 72
) => {
  if (!rawUrl || typeof rawUrl !== 'string') return undefined;
  const trimmed = rawUrl.trim();
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return undefined;
  }
  return widths
    .map(
      (w) =>
        `${optimizeImageUrl(trimmed, {
          width: w,
          height: Math.round(w * 1.15),
          quality,
        })} ${w}w`
    )
    .join(', ');
};

/**
 * Fallback handler for <img onError> in case the CDN proxy fails
 */
export const handleOptimizedImageError = (
  e,
  originalUrl,
  fallbackUrl = 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=300&auto=format&fit=max&q=70&fm=webp'
) => {
  const img = e.currentTarget;
  if (!img) return;

  const normalizedOriginal = normalizeExternalHost(originalUrl);
  if (
    originalUrl &&
    img.src !== originalUrl &&
    img.src !== normalizedOriginal &&
    !img.dataset.triedOriginal
  ) {
    img.dataset.triedOriginal = 'true';
    img.removeAttribute('srcset');
    img.src = normalizedOriginal || originalUrl;
    return;
  }

  if (!img.dataset.triedFallback) {
    img.dataset.triedFallback = 'true';
    img.removeAttribute('srcset');
    img.src = fallbackUrl;
  }
};
