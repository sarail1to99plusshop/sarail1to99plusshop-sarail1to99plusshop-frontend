/**
 * High-performance image optimization & fallback utility for Sarail 1 to 99 Plus Shop.
 * - Resolves ImgBB hotlink blocking by bypassing third-party proxy traps.
 * - Maps any flagged legacy image hashes to verified high-resolution e-commerce assets.
 * - Natively optimizes Unsplash CDN images using Imgix WebP parameters.
 */

// Legacy Gemini-generated ImgBB upload hashes that were flagged by ImgBB's email abuse detector
const KNOWN_BLOCKED_IMGBB_HASHES = {
  'k2Mbz0mH': 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600&auto=format&fit=crop&q=80',
  'q3kcHV8G': 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600&auto=format&fit=crop&q=80',
  'xSJwWdwQ': 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&auto=format&fit=crop&q=80',
  'xr6RV9z': 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=600&auto=format&fit=crop&q=80',
  '9mHWNsmy': 'https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=600&auto=format&fit=crop&q=80',
  'Z1L7hS32': 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600&auto=format&fit=crop&q=80',
  'KjhszVFt': 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80',
  'mVKVQ7wS': 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&auto=format&fit=crop&q=80',
  '3Y1vdrdt': 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=80',
};

export const normalizeExternalHost = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();

  // Check if this URL contains any of the blocked legacy ImgBB hashes
  for (const [hash, verifiedAsset] of Object.entries(KNOWN_BLOCKED_IMGBB_HASHES)) {
    if (trimmed.includes(hash)) {
      return verifiedAsset;
    }
  }

  // Normalize i.ibb.co.com to i.ibb.co
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

  // Check and swap flagged legacy ImgBB hashes immediately
  const normalized = normalizeExternalHost(trimmed);

  // Optimize Unsplash URLs directly via native Imgix params (no third-party proxy overhead)
  if (normalized.includes('images.unsplash.com')) {
    const base = normalized.split('?')[0];
    return `${base}?w=${width}&h=${height}&auto=format&fit=crop&q=${quality}&fm=webp`;
  }

  // For genuine ImgBB URLs: return direct URL without passing through wsrv.nl
  // (wsrv.nl triggers ImgBB's automated abuse/hotlinking placeholder banner)
  if (normalized.includes('ibb.co')) {
    return normalized;
  }

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

export const handleOptimizedImageLoad = (
  e,
  fallbackUrl = 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600&auto=format&fit=crop&q=80'
) => {
  const img = e.currentTarget;
  if (!img) return;
  // ImgBB email abuse / pro upgrade placeholder is always exactly 180x180 px
  if (
    (img.src.includes('ibb.co') || img.src.includes('imgbb')) &&
    img.naturalWidth === 180 &&
    img.naturalHeight === 180
  ) {
    img.removeAttribute('srcset');
    img.src = fallbackUrl;
  }
};

export const handleOptimizedImageError = (
  e,
  originalUrl,
  fallbackUrl = 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=400&auto=format&fit=crop&q=75&fm=webp'
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
