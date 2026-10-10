import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.resolve(__dirname, '../dist');
const TEMPLATE_PATH = path.join(DIST_DIR, 'index.html');
const BASE_URL =
  process.env.VITE_SITE_URL || 'https://sarail1to99plusshop-sarail1to99plus.vercel.app';
const API_URL = process.env.VITE_API_URL || 'http://localhost:5000';

async function run() {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.warn(
      '[OG Pre-generator] dist/index.html not found. Skipping static meta generation.'
    );
    return;
  }

  let products = [];
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${API_URL}/api/products?all=true`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      products = Array.isArray(data?.products) ? data.products : [];
    }
  } catch {
    console.log(
      '[OG Pre-generator] Backend API not running during build; skipping static product OG pre-generation.'
    );
    return;
  }

  if (!Array.isArray(products) || products.length === 0) {
    return;
  }

  const templateHtml = fs.readFileSync(TEMPLATE_PATH, 'utf-8');
  let generatedCount = 0;

  for (const product of products) {
    if (!product || !product.id) continue;

    const pageTitle = `${product.name} - ৳${product.price?.toLocaleString()} | Sarail 1 to 99 Plus Shop`;
    const cleanDesc = (
      product.description ||
      `Buy ${product.name} at ৳${product.price} with Cash on Delivery at Sarail 1 to 99 Plus Shop.`
    )
      .replace(/"/g, '&quot;')
      .replace(/\n/g, ' ')
      .slice(0, 160);

    const imageUrl =
      product.thumbnail ||
      product.variants?.[0]?.images?.[0] ||
      'https://i.ibb.co.com/q3kcHV8G/Gemini-Generated-Image-yw9arcyw9arcyw9a.png';

    const pageUrl = `${BASE_URL}/product/${product.id}`;

    const metaBlock = `
    <!-- Dynamic Product Social Preview -->
    <title>${pageTitle}</title>
    <meta name="description" content="${cleanDesc}" />
    <meta property="og:type" content="product" />
    <meta property="og:site_name" content="Sarail 1 to 99 Plus Shop" />
    <meta property="og:title" content="${pageTitle}" />
    <meta property="og:description" content="${cleanDesc}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:secure_url" content="${imageUrl}" />
    <meta property="og:image:alt" content="${product.name.replace(/"/g, '&quot;')}" />
    <meta property="og:url" content="${pageUrl}" />
    <meta property="product:price:amount" content="${product.price || 0}" />
    <meta property="product:price:currency" content="BDT" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${pageTitle}" />
    <meta name="twitter:description" content="${cleanDesc}" />
    <meta name="twitter:image" content="${imageUrl}" />
    `;

    let customizedHtml = templateHtml;
    customizedHtml = customizedHtml.replace(/<title>.*?<\/title>\s*/is, '');
    customizedHtml = customizedHtml.replace(/<meta\s+name="description".*?>\s*/is, '');
    customizedHtml = customizedHtml.replace(/<!--\s*Open Graph.*?-->\s*/is, '');
    customizedHtml = customizedHtml.replace(/<!--\s*Twitter Cards.*?-->\s*/is, '');
    customizedHtml = customizedHtml.replace(/<meta\s+property="og:[^>]*>\s*/gis, '');
    customizedHtml = customizedHtml.replace(/<meta\s+name="twitter:[^>]*>\s*/gis, '');
    customizedHtml = customizedHtml.replace('</head>', `${metaBlock}\n  </head>`);

    const targetDirs = [
      path.join(DIST_DIR, 'product', String(product.id)),
      path.join(DIST_DIR, 'product-details', String(product.id)),
    ];

    if (product._id) {
      const oid = typeof product._id === 'object' ? product._id.$oid : product._id;
      if (oid) {
        targetDirs.push(path.join(DIST_DIR, 'product', String(oid)));
        targetDirs.push(path.join(DIST_DIR, 'product-details', String(oid)));
      }
    }

    for (const dir of targetDirs) {
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'index.html'), customizedHtml, 'utf-8');
    }

    generatedCount++;
  }

  console.log(
    `[OG Pre-generator] Successfully generated social media preview pages for ${generatedCount} products from API.`
  );
}

run();
