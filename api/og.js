// Real active products in Sarail 1 to 99 Plus Shop with authentic ImgBB images
const fallbackProducts = [
  {
    id: 101,
    name: 'ট্যাপ ওয়াটার ফিল্টার - 360° রোটেটিং কিচেন কল ফিল্টার',
    price: 110,
    thumbnail: 'https://i.ibb.co/KzjmL6Jt/image.webp',
    description: 'সহজেই কিচেনের যেকোনো পানির কলে সেট করা যায়। পানি পরিষ্কার ও ব্যাকটেরিয়ামুক্ত রাখতে কার্যকর এবং পানির অপচয় রোধ করে।',
  },
  {
    id: 102,
    name: 'ফ্রিজ ম্যাট ৪ পিস সেট - অ্যান্টি-ব্যাকটেরিয়াল ও ওয়াশেবল',
    price: 180,
    thumbnail: 'https://i.ibb.co/ZRRcM2W8/image-1.webp',
    description: 'উন্নত মানের ওয়াটারপ্রুফ এবং ইজি-টু-ক্লিন ফ্রিজ ম্যাট সেট। ফ্রিজের তাকে দাগ ও ময়লা পড়া থেকে রক্ষা করে এবং পরিষ্কার রাখা সহজ করে।',
  },
  {
    id: 103,
    name: 'হেভি ডিউটি কিচেন ক্লিনার স্প্রে - অয়েল ও গ্রীস রিমুভার',
    price: 280,
    thumbnail: 'https://i.ibb.co/bg1ZgJ6n/image-2.webp',
    description: 'রান্নাঘরের তেলচিটে ও জেদি ময়লা নিমিষেই পরিষ্কার করতে অত্যন্ত কার্যকরী পাওয়ারফুল ক্লিনার। চুলা, সিঙ্ক ও কিচেন টাইলসের জন্য উপযুক্ত।',
  },
  {
    id: 104,
    name: 'টয়লেট ফ্লাশ ক্লিনার ট্যাবলেট - ডিওডোরাইজার ও ডিসইনফেক্টেন্ট',
    price: 180,
    thumbnail: 'https://i.ibb.co/NdBm30LW/image-3.webp',
    description: 'কমোডে সুগন্ধি ও দীর্ঘস্থায়ী পরিচ্ছন্নতা বজায় রাখে। প্রতিটি ফ্লাশে জীবাণু ধ্বংস করে এবং দুর্গন্ধ দূর করতে সাহায্য করে।',
  },
  {
    id: 105,
    name: 'প্রিমিয়াম মেলামাইন জগ (২.২ লিটার রাউন্ড শেপ)',
    price: 315,
    thumbnail: 'https://i.ibb.co/0y1DhhGR/Gemini-Generated-Image.webp',
    description: 'টেকসই ও আকর্ষণীয় ডিজাইনের ২.২ লিটার ফুড-গ্রেড মেলামাইন পানির জগ। দৈনন্দিন ব্যবহার ও মেহমানদারির জন্য উপযুক্ত।',
  },
];

const BACKEND_URL =
  (typeof process !== 'undefined' && process.env?.VITE_API_URL) ||
  'https://store-backend-taupe-six.vercel.app';
const SITE_URL = 'https://sarail1to99plus-shop.com';

// Normalize image URLs for optimal social scraper compatibility (FB, WhatsApp, Twitter, Telegram)
const formatImageUrl = (url) => {
  if (!url) return `${SITE_URL}/logo.png`;
  let formatted = String(url).trim();
  // Normalize i.ibb.co.com alias to direct i.ibb.co for reliable CDN scraping
  formatted = formatted.replace('://i.ibb.co.com/', '://i.ibb.co/');
  if (formatted.startsWith('//')) return `https:${formatted}`;
  if (formatted.startsWith('/')) return `${SITE_URL}${formatted}`;
  return formatted;
};

// Fetch product with 2-second timeout and instant dual fallback
async function fetchProduct(id) {
  const numericId = Number(id);
  const fallback =
    fallbackProducts.find((p) => p.id === numericId) ||
    fallbackProducts.find((p) => String(p.id) === String(id));

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    // 1. Try fetching direct product by ID
    const res = await fetch(`${BACKEND_URL}/api/products/${encodeURIComponent(id)}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const json = await res.json();
      if (json?.product?.name) {
        return json.product;
      }
    }
  } catch {
    // try fallback
  }

  // 2. Try fetching all products list if direct fetch failed
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const resAll = await fetch(`${BACKEND_URL}/api/products?all=true`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeout);
    if (resAll.ok) {
      const jsonAll = await resAll.json();
      if (Array.isArray(jsonAll?.products)) {
        const found = jsonAll.products.find(
          (p) => String(p.id) === String(id) || String(p._id) === String(id)
        );
        if (found) return found;
      }
    }
  } catch {
    // use local fallback
  }

  return (
    fallback || {
      id: id || 101,
      name: 'Sarail 1 to 99 Plus Shop - Best Daily Deals',
      price: 110,
      thumbnail: `${SITE_URL}/logo.png`,
      description:
        'সেরা মানের কিচেনওয়্যার, মেলামাইন ডিনার সেট, ক্লিনিং সামগ্রী, বেবি আইটেম ও খেলনা সারা বাংলাদেশে ক্যাশ অন ডেলিভারিতে অর্ডার করুন।',
    }
  );
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function generateOgHtml(id) {
  const product = await fetchProduct(id);
  const productId = product.id || id;
  const pageUrl = `${SITE_URL}/product/${productId}`;
  const rawImage =
    product.thumbnail ||
    product.image ||
    product.variants?.[0]?.images?.[0] ||
    `${SITE_URL}/Without-BG-logo.png`;
  const imageUrl = formatImageUrl(rawImage);

  const title = `${product.name} - ৳${product.price} | Sarail 1 to 99 Plus Shop`;
  const description = product.description
    ? `${product.description} | ক্যাশ অন ডেলিভারিতে সারা বাংলাদেশে হোম ডেলিভারি।`
    : `Buy ${product.name} at ৳${product.price} with Cash on Delivery from Sarail 1 to 99 Plus Shop.`;

  return `<!doctype html>
<html lang="bn">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <link rel="canonical" href="${pageUrl}" />
  <meta name="robots" content="index, follow" />

  <!-- Open Graph / Facebook / WhatsApp / Messenger -->
  <meta property="og:site_name" content="Sarail 1 to 99 Plus Shop" />
  <meta property="og:type" content="product" />
  <meta property="og:url" content="${pageUrl}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:image:secure_url" content="${imageUrl}" />
  <meta property="og:image:alt" content="${escapeHtml(product.name)}" />
  <meta property="og:image:width" content="1024" />
  <meta property="og:image:height" content="1024" />
  <meta property="og:locale" content="bn_BD" />
  <meta property="product:price:amount" content="${product.price}" />
  <meta property="product:price:currency" content="BDT" />

  <!-- Twitter / X Cards -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${pageUrl}" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${imageUrl}" />

  <!-- Schema.org Product Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": ${JSON.stringify(product.name)},
    "image": [${JSON.stringify(imageUrl)}],
    "description": ${JSON.stringify(description)},
    "offers": {
      "@type": "Offer",
      "priceCurrency": "BDT",
      "price": "${product.price}",
      "availability": "https://schema.org/InStock",
      "url": ${JSON.stringify(pageUrl)}
    }
  }
  </script>
</head>
<body style="font-family: system-ui, -apple-system, sans-serif; background: #f8fafc; color: #0f172a; margin: 0; padding: 24px; text-align: center;">
  <div style="max-w: 600px; margin: 0 auto; background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
    <h1 style="font-size: 1.25rem; font-weight: 800; color: #003d73; margin-bottom: 8px;">${escapeHtml(product.name)}</h1>
    <p style="font-size: 1.5rem; font-weight: 900; color: #b80d18; margin: 8px 0;">৳${product.price}</p>
    <img src="${imageUrl}" alt="${escapeHtml(product.name)}" style="max-width: 100%; height: auto; max-height: 400px; border-radius: 8px; object-fit: contain; margin: 16px 0;" />
    <p style="font-size: 0.875rem; color: #475569; line-height: 1.5;">${escapeHtml(description)}</p>
    <div style="margin-top: 20px;">
      <a href="${pageUrl}" style="display: inline-block; background: #003d73; color: white; padding: 12px 24px; font-weight: bold; border-radius: 8px; text-decoration: none; text-transform: uppercase;">View Product in Shop</a>
    </div>
  </div>
  <script>
    if (typeof window !== 'undefined' && !/bot|crawl|spider|facebook|whatsapp|twitter|telegram|discord/i.test(navigator.userAgent)) {
      window.location.replace(${JSON.stringify(pageUrl)});
    }
  </script>
</body>
</html>`;
}

export default async function handler(req, res) {
  // Support Edge runtime
  if (req && typeof req.url === 'string' && !res) {
    const url = new URL(req.url);
    const id = url.searchParams.get('id') || '1';
    const html = await generateOgHtml(id);
    return new Response(html, {
      status: 200,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, s-maxage=86400, stale-while-revalidate=604800',
      },
    });
  }

  // Support Node.js runtime
  const id = req?.query?.id || req?.url?.split('id=')?.[1] || '1';
  const html = await generateOgHtml(id);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate=604800'
  );
  return res.status(200).send(html);
}

