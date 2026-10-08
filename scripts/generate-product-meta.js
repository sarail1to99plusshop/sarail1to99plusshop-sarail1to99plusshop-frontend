import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.resolve(__dirname, '../dist');
const TEMPLATE_PATH = path.join(DIST_DIR, 'index.html');
const PRODUCTS_JSON_PATH = path.resolve(__dirname, '../public/data/products.json');
const BASE_URL = process.env.VITE_SITE_URL || 'https://sarail1to99plusshop-sarail1to99plus.vercel.app';

function run() {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.warn('[OG Pre-generator] dist/index.html not found. Skipping static meta generation.');
    return;
  }

  if (!fs.existsSync(PRODUCTS_JSON_PATH)) {
    console.warn('[OG Pre-generator] products.json not found. Skipping.');
    return;
  }

  const templateHtml = fs.readFileSync(TEMPLATE_PATH, 'utf-8');
  const products = JSON.parse(fs.readFileSync(PRODUCTS_JSON_PATH, 'utf-8'));

  if (!Array.isArray(products) || products.length === 0) {
    console.warn('[OG Pre-generator] No products found in products.json.');
    return;
  }

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

    // Meta tags block to inject
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

    // Replace default title and existing og tags or inject before </head>
    let customizedHtml = templateHtml;

    // Cleanly remove existing title, description, and og/twitter tags from template
    customizedHtml = customizedHtml.replace(/<title>.*?<\/title>\s*/is, '');
    customizedHtml = customizedHtml.replace(/<meta\s+name="description".*?>\s*/is, '');
    customizedHtml = customizedHtml.replace(/<!--\s*Open Graph.*?-->\s*/is, '');
    customizedHtml = customizedHtml.replace(/<!--\s*Twitter Cards.*?-->\s*/is, '');
    customizedHtml = customizedHtml.replace(/<meta\s+property="og:[^>]*>\s*/gis, '');
    customizedHtml = customizedHtml.replace(/<meta\s+name="twitter:[^>]*>\s*/gis, '');

    // Insert new product meta block right before </head>
    customizedHtml = customizedHtml.replace('</head>', `${metaBlock}\n  </head>`);

    // Targets to write
    const targetDirs = [
      path.join(DIST_DIR, 'product', String(product.id)),
      path.join(DIST_DIR, 'product-details', String(product.id)),
    ];

    if (product._id?.$oid) {
      targetDirs.push(path.join(DIST_DIR, 'product', String(product._id.$oid)));
      targetDirs.push(path.join(DIST_DIR, 'product-details', String(product._id.$oid)));
    }

    for (const dir of targetDirs) {
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'index.html'), customizedHtml, 'utf-8');
    }

    // Also write cleanUrl files (e.g. /dist/product/1.html)
    const fileTargets = [
      path.join(DIST_DIR, 'product', `${product.id}.html`),
      path.join(DIST_DIR, 'product-details', `${product.id}.html`),
    ];
    if (product._id?.$oid) {
      fileTargets.push(path.join(DIST_DIR, 'product', `${product._id.$oid}.html`));
      fileTargets.push(path.join(DIST_DIR, 'product-details', `${product._id.$oid}.html`));
    }

    for (const filePath of fileTargets) {
      fs.writeFileSync(filePath, customizedHtml, 'utf-8');
    }

    generatedCount++;
  }

  console.log(`[OG Pre-generator] Successfully generated social media preview pages for ${generatedCount} products.`);
}

run();
