/**
 * Optimizes external product/banner image URLs (ImgBB, Unsplash, etc.)
 * into lightweight WebP images with explicit dimensions for fast mobile & desktop loading.
 */
export const optimizeImageUrl = (url, { width = 400, quality = 78 } = {}) => {
  if (!url || typeof url !== 'string') return '';

  // Local bundled assets or data/blob URLs are already optimized
  if (
    url.startsWith('/') ||
    url.startsWith('data:') ||
    url.startsWith('blob:') ||
    url.includes('wsrv.nl')
  ) {
    return url;
  }

  try {
    // 1. Unsplash URLs: use native WebP & width parameters
    if (url.includes('images.unsplash.com')) {
      const parsed = new URL(url);
      parsed.searchParams.set('w', String(width));
      parsed.searchParams.set('q', String(quality));
      parsed.searchParams.set('fm', 'webp');
      parsed.searchParams.set('auto', 'format');
      parsed.searchParams.set('fit', 'crop');
      return parsed.toString();
    }

    // 2. ImgBB URLs (i.ibb.co.com / i.ibb.co): convert large raw PNGs to compressed WebP via Cloudflare wsrv.nl CDN
    if (url.includes('i.ibb.co')) {
      const cleanOriginUrl = url.replace('://i.ibb.co.com/', '://i.ibb.co/');
      return `https://wsrv.nl/?url=${encodeURIComponent(
        cleanOriginUrl
      )}&w=${width}&q=${quality}&output=webp`;
    }
  } catch {
    return url;
  }

  return url;
};

/**
 * Fallback handler for <img onError={...}> so if CDN optimization ever fails,
 * the browser seamlessly loads the original image URL.
 */
export const handleOptimizedImageError = (e, originalUrl) => {
  const img = e.currentTarget;
  if (!originalUrl) {
    img.style.display = 'none';
    return;
  }

  const normalizedOrigin = originalUrl.replace('://i.ibb.co.com/', '://i.ibb.co/');
  if (img.dataset.fallbackStep !== '1' && img.src !== normalizedOrigin) {
    img.dataset.fallbackStep = '1';
    img.src = normalizedOrigin;
    return;
  }

  if (img.dataset.fallbackStep !== '2' && img.src !== originalUrl) {
    img.dataset.fallbackStep = '2';
    img.src = originalUrl;
  }
};

