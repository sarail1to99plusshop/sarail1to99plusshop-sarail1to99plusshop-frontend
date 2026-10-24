// Fallback product catalog for immediate (<15ms) response when backend is sleeping
const fallbackProducts = [
  {
    id: 1,
    name: 'ট্যাপ ওয়াটার ফিল্টার - 360° রোটেটিং কিচেন কল ফিল্টার',
    price: 150,
    thumbnail: 'https://sarail1to99plus-shop.com/Without-BG-logo.png',
    description: 'সহজেই কিচেনের যেকোনো পানির কলে সেট করা যায়। পানি পরিষ্কার ও ব্যাকটেরিয়ামুক্ত রাখতে কার্যকর এবং পানির অপচয় রোধ করে।',
  },
  {
    id: 2,
    name: 'ফ্রিজ ম্যাট ৪ পিস সেট - অ্যান্টি-ব্যাকটেরিয়াল ও ওয়াশেবল',
    price: 180,
    thumbnail: 'https://sarail1to99plus-shop.com/Without-BG-logo.png',
    description: 'উন্নত মানের ওয়াটারপ্রুফ এবং ইজি-টু-ক্লিন ফ্রিজ ম্যাট সেট। ফ্রিজের তাকে দাগ ও ময়লা পড়া থেকে রক্ষা করে।',
  },
  {
    id: 3,
    name: 'হেভি ডিউটি কিচেন ক্লিনার স্প্রে - অয়েল ও গ্রীস রিমুভার',
    price: 280,
    thumbnail: 'https://sarail1to99plus-shop.com/Without-BG-logo.png',
    description: 'রান্নাঘরের তেলচিটে ও জেদি ময়লা নিমিষেই পরিষ্কার করতে অত্যন্ত কার্যকরী পাওয়ারফুল ক্লিনার।',
  },
  {
    id: 4,
    name: 'টয়লেট ফ্লাশ ক্লিনার ট্যাবলেট - ডিওডোরাইজার ও ডিসইনফেক্টেন্ট',
    price: 180,
    thumbnail: 'https://sarail1to99plus-shop.com/Without-BG-logo.png',
    description: 'কমোডে সুগন্ধি ও দীর্ঘস্থায়ী পরিচ্ছন্নতা বজায় রাখে। প্রতিটি ফ্লাশে জীবাণু ধ্বংস করে।',
  },
  {
    id: 5,
    name: 'প্রিমিয়াম মেলামাইন জগ (২.২ লিটার রাউন্ড শেপ)',
    price: 320,
    thumbnail: 'https://sarail1to99plus-shop.com/Without-BG-logo.png',
    description: 'টেকসই ও আকর্ষণীয় ডিজাইনের ২.২ লিটার ফুড-গ্রেড মেলামাইন পানির জগ। দৈনন্দিন ব্যবহার ও মেহমানদারির জন্য উপযুক্ত।',
  },
  {
    id: 6,
    name: 'Smart Scalp Massager - ইলেকট্রিক হেড ম্যাসাজার',
    price: 580,
    thumbnail: 'https://sarail1to99plus-shop.com/Without-BG-logo.png',
    description: 'মাথার রক্ত সঞ্চালন বৃদ্ধি ও মানসিক ক্লান্তি দূর করতে স্মার্ট স্কাল্প ম্যাসাজার। আরামদায়ক ঘুমের জন্য সহায়ক।',
  },
  {
    id: 7,
    name: 'আইস ফেইস রোলার - স্কিন গ্লো অ্যান্ড পাফিনেস রিমুভার',
    price: 150,
    thumbnail: 'https://sarail1to99plus-shop.com/Without-BG-logo.png',
    description: 'মুখের ফোলাভাব দূর করতে এবং ত্বক টানটান ও উজ্জ্বল রাখতে সিলিকন আইস ফেস রোলার।',
  },
  {
    id: 8,
    name: 'মেলামাইন ৯ ইঞ্চি স্যুপ প্লেট - ব্রেক রেজিস্ট্যান্ট',
    price: 90,
    thumbnail: 'https://sarail1to99plus-shop.com/Without-BG-logo.png',
    description: 'উচ্চমানের ফুড-গ্রেড মেলামাইন দিয়ে তৈরি ৯ ইঞ্চি ডীপ স্যুপ প্লেট। দীর্ঘস্থায়ী ও সহজে ভাঙে না।',
  },
  {
    id: 9,
    name: 'বাচ্চাদের অ্যান্টি-স্লিপ হাঁটুর মোজা (নি-প্যাড প্রোটেক্টর)',
    price: 120,
    thumbnail: 'https://sarail1to99plus-shop.com/Without-BG-logo.png',
    description: 'বাচ্চারা যখন হাঁটু গেড়ে হামাগুড়ি দেয় তখন হাঁটুকে মেঝেতে ঘষা ও আঘাত থেকে বাঁচাতে সফট অ্যান্টি-স্লিপ নি-প্যাড মোজা।',
  },
  {
    id: 10,
    name: 'প্রিমিয়াম মেলামাইন ডিনার প্লেট সেট (৬ পিস ফ্লোরাল ডিজাইন)',
    price: 540,
    thumbnail: 'https://sarail1to99plus-shop.com/Without-BG-logo.png',
    description: '১০০% ফুড-গ্রেড হেভি ওয়েট মেলামাইন ডিনার প্লেট সেট। আকর্ষণীয় ফ্লোরাল প্রিন্ট ও তাপ নিরোধক।',
  },
  {
    id: 11,
    name: 'ম্যাজিক সিলিকন ডিশ ওয়াশিং গ্লাভস (স্ক্রাবারসহ ১ জোড়া)',
    price: 220,
    thumbnail: 'https://sarail1to99plus-shop.com/Without-BG-logo.png',
    description: 'হাতের ত্বক সুরক্ষিত রেখে থালা-বাসন, ফলমূল ও কিচেন সিঙ্ক পরিষ্কার করার জন্য সিলিকন গ্লাভস।',
  },
  {
    id: 12,
    name: 'বাচ্চাদের শিক্ষণীয় কাঠের বর্ণমালা ও নম্বর পাজল বোর্ড',
    price: 250,
    thumbnail: 'https://sarail1to99plus-shop.com/Without-BG-logo.png',
    description: 'শিশুদের মেধা বিকাশ ও খেলার ছলে অক্ষর এবং সংখ্যা শেখার জন্য নিরাপদ রঙের এডুকেশনাল পাজল বোর্ড।',
  },
  {
    id: 13,
    name: 'মাল্টিফাংশনাল ওয়াল মাউন্ট স্টোরেজ র‍্যাক ও অর্গানাইজার',
    price: 199,
    thumbnail: 'https://sarail1to99plus-shop.com/Without-BG-logo.png',
    description: 'ড্রিল ছাড়াই দেয়ালে সহজে লাগানো যায় এমন শক্তিশালী অ্যাডহেসিভ স্টোরেজ র‍্যাক।',
  },
  {
    id: 14,
    name: 'কোরিয়ান স্টাইল পার্ল হেয়ার ক্লিপ ও ক্রিস্টাল ব্যান্ড সেট (৬ পিস)',
    price: 140,
    thumbnail: 'https://sarail1to99plus-shop.com/Without-BG-logo.png',
    description: 'আধুনিক ও মার্জিত ডিজাইনের মুক্তা এবং ক্রিস্টাল খচিত প্রিমিয়াম হেয়ার ক্লিপ সেট।',
  },
  {
    id: 15,
    name: 'স্টেইনলেস স্টিল অয়েল ডিসপেনসার বোতল (৫০০ মিলি লিক-প্রুফ)',
    price: 290,
    thumbnail: 'https://sarail1to99plus-shop.com/Without-BG-logo.png',
    description: 'রান্নার তেল পরিমিত ও ঝামেলাহীনভাবে ঢালার জন্য ড্রিপ-ফ্রি নজলযুক্ত প্রিমিয়াম অয়েল ডিসপেনসার বোতল।',
  },
  {
    id: 16,
    name: 'মেলামাইন কারি ও সার্ভিং বোল সেট ঢাকনাসহ (৩ পিস)',
    price: 450,
    thumbnail: 'https://sarail1to99plus-shop.com/Without-BG-logo.png',
    description: 'খাবার গরম ও সতেজ রাখতে এয়ার-টাইট ঢাকনাসহ ৩টি ভিন্ন সাইজের মেলামাইন সার্ভিং বোল সেট।',
  },
];

const BACKEND_URL =
  (typeof process !== 'undefined' && process.env?.VITE_API_URL) ||
  'https://store-backend-taupe-six.vercel.app';
const SITE_URL = 'https://sarail1to99plus-shop.com';

// Normalize image URLs for optimal social scraper compatibility (FB, WhatsApp, Twitter, Telegram)
const formatImageUrl = (url) => {
  if (!url) return `${SITE_URL}/Without-BG-logo.png`;
  let formatted = String(url).trim();
  // Normalize i.ibb.co.com alias to direct i.ibb.co for reliable CDN scraping
  formatted = formatted.replace('://i.ibb.co.com/', '://i.ibb.co/');
  if (formatted.startsWith('//')) return `https:${formatted}`;
  if (formatted.startsWith('/')) return `${SITE_URL}${formatted}`;
  return formatted;
};

// Fetch product with 2-second timeout and instant fallback
async function fetchProduct(id) {
  const numericId = Number(id);
  const fallback =
    fallbackProducts.find((p) => p.id === numericId) ||
    fallbackProducts.find((p) => String(p.id) === String(id));

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

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
    // If live fetch fails or times out, seamlessly use fallback
  }

  return (
    fallback || {
      id: id || 1,
      name: 'Sarail 1 to 99 Plus Shop - Best Daily Deals',
      price: 99,
      thumbnail: `${SITE_URL}/Without-BG-logo.png`,
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

