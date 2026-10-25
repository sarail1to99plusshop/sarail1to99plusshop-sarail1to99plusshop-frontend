<?php
/**
 * Sarail 1 to 99 Plus Shop - Social Media Open Graph (OG) Generator
 * Generates dynamic Open Graph meta tags for Facebook, WhatsApp, Messenger,
 * Twitter/X, Telegram, LinkedIn, Discord, and Googlebot.
 *
 * Automatically fetches the real product title, price, description, and ImgBB photo
 * from MongoDB backend, ensuring rich social cards when shared.
 */

error_reporting(0);
ini_set('display_errors', '0');

$productId = isset($_GET['id']) ? trim($_GET['id']) : '101';
$productId = preg_replace('/[^a-zA-Z0-9_-]/', '', $productId);
if (empty($productId)) {
    $productId = '101';
}

$siteUrl = 'https://sarail1to99plus-shop.com';
$backendUrl = 'https://store-backend-taupe-six.vercel.app';
$pageUrl = $siteUrl . '/product/' . $productId;

// Built-in catalog for instant 0ms fallback
$fallbackCatalog = [
    '101' => [
        'id' => 101,
        'name' => 'ট্যাপ ওয়াটার ফিল্টার - 360° রোটেটিং কিচেন কল ফিল্টার',
        'price' => 110,
        'thumbnail' => 'https://i.ibb.co/KzjmL6Jt/image.webp',
        'description' => 'সহজেই কিচেনের যেকোনো পানির কলে সেট করা যায়। পানি পরিষ্কার ও ব্যাকটেরিয়ামুক্ত রাখতে কার্যকর এবং পানির অপচয় রোধ করে।'
    ],
    '102' => [
        'id' => 102,
        'name' => 'ফ্রিজ ম্যাট ৪ পিস সেট - অ্যান্টি-ব্যাকটেরিয়াল ও ওয়াশেবল',
        'price' => 180,
        'thumbnail' => 'https://i.ibb.co/ZRRcM2W8/image-1.webp',
        'description' => 'উন্নত মানের ওয়াটারপ্রুফ এবং ইজি-টু-ক্লিন ফ্রিজ ম্যাট সেট। ফ্রিজের তাকে দাগ ও ময়লা পড়া থেকে রক্ষা করে এবং পরিষ্কার রাখা সহজ করে।'
    ],
    '103' => [
        'id' => 103,
        'name' => 'হেভি ডিউটি কিচেন ক্লিনার স্প্রে - অয়েল ও গ্রীস রিমুভার',
        'price' => 280,
        'thumbnail' => 'https://i.ibb.co/bg1ZgJ6n/image-2.webp',
        'description' => 'রান্নাঘরের তেলচিটে ও জেদি ময়লা নিমিষেই পরিষ্কার করতে অত্যন্ত কার্যকরী পাওয়ারফুল ক্লিনার। চুলা, সিঙ্ক ও কিচেন টাইলসের জন্য উপযুক্ত।'
    ],
    '104' => [
        'id' => 104,
        'name' => 'টয়লেট ফ্লাশ ক্লিনার ট্যাবলেট - ডিওডোরাইজার ও ডিসইনফেক্টেন্ট',
        'price' => 180,
        'thumbnail' => 'https://i.ibb.co/NdBm30LW/image-3.webp',
        'description' => 'কমোডে সুগন্ধি ও দীর্ঘস্থায়ী পরিচ্ছন্নতা বজায় রাখে। প্রতিটি ফ্লাশে জীবাণু ধ্বংস করে এবং দুর্গন্ধ দূর করতে সাহায্য করে।'
    ],
    '105' => [
        'id' => 105,
        'name' => 'প্রিমিয়াম মেলামাইন জগ (২.২ লিটার রাউন্ড শেপ)',
        'price' => 315,
        'thumbnail' => 'https://i.ibb.co/0y1DhhGR/Gemini-Generated-Image.webp',
        'description' => 'টেকসই ও আকর্ষণীয় ডিজাইনের ২.২ লিটার ফুড-গ্রেড মেলামাইন পানির জগ। দৈনন্দিন ব্যবহার ও মেহমানদারির জন্য উপযুক্ত।'
    ]
];

$product = isset($fallbackCatalog[$productId]) ? $fallbackCatalog[$productId] : [
    'id' => $productId,
    'name' => 'Sarail 1 to 99 Plus Shop',
    'price' => 110,
    'thumbnail' => 'https://i.ibb.co/KzjmL6Jt/image.webp',
    'description' => 'ক্যাশ অন ডেলিভারিতে সেরা মূল্যে প্রয়োজনীয় পণ্য কিনুন সারাইল ১ টু ৯৯ প্লাস শপ থেকে।'
];

function fetchJson($url) {
    if (function_exists('curl_init')) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 3);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 2);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (compatible; SarailOG/1.0)');
        $res = curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if ($code == 200 && !empty($res)) {
            return json_decode($res, true);
        }
    }
    
    $ctx = stream_context_create([
        'http' => [
            'timeout' => 3,
            'header' => "User-Agent: Mozilla/5.0 (compatible; SarailOG/1.0)\r\nAccept: application/json\r\n"
        ],
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false
        ]
    ]);
    $res = @file_get_contents($url, false, $ctx);
    if (!empty($res)) {
        return json_decode($res, true);
    }
    return null;
}

// 1. Try single product fetch
$data = fetchJson($backendUrl . '/api/products/' . urlencode($productId));
if (!empty($data['product']['name'])) {
    $product = $data['product'];
} else {
    // 2. Try fetching all products
    $allData = fetchJson($backendUrl . '/api/products?all=true');
    if (!empty($allData['products']) && is_array($allData['products'])) {
        foreach ($allData['products'] as $p) {
            if ((string)$p['id'] === (string)$productId || (string)$p['_id'] === (string)$productId) {
                $product = $p;
                break;
            }
        }
    }
}

// Extract real product thumbnail
$image = '';
if (!empty($product['thumbnail'])) {
    $image = $product['thumbnail'];
} elseif (!empty($product['images'][0])) {
    $image = $product['images'][0];
} elseif (!empty($product['variants'][0]['images'][0])) {
    $image = $product['variants'][0]['images'][0];
} else {
    $image = 'https://i.ibb.co/KzjmL6Jt/image.webp';
}

$image = str_replace('://i.ibb.co.com/', '://i.ibb.co/', $image);

$title = htmlspecialchars($product['name'] . ' - ৳' . $product['price'] . ' | Sarail 1 to 99 Plus Shop', ENT_QUOTES, 'UTF-8');
$description = !empty($product['description'])
    ? htmlspecialchars($product['description'] . ' | ক্যাশ অন ডেলিভারিতে সারাদেশে হোম ডেলিভারি।', ENT_QUOTES, 'UTF-8')
    : htmlspecialchars('Buy ' . $product['name'] . ' at ৳' . $product['price'] . ' with Cash on Delivery from Sarail 1 to 99 Plus Shop.', ENT_QUOTES, 'UTF-8');
$safeName = htmlspecialchars($product['name'], ENT_QUOTES, 'UTF-8');
$price = (int)$product['price'];

header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: public, max-age=86400, s-maxage=86400');
?>
<!doctype html>
<html lang="bn">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title><?php echo $title; ?></title>
  <meta name="description" content="<?php echo $description; ?>" />
  <link rel="canonical" href="<?php echo $pageUrl; ?>" />
  <meta name="robots" content="index, follow" />

  <!-- Open Graph / Facebook / WhatsApp / Messenger / Telegram -->
  <meta property="og:site_name" content="Sarail 1 to 99 Plus Shop" />
  <meta property="og:type" content="product" />
  <meta property="og:url" content="<?php echo $pageUrl; ?>" />
  <meta property="og:title" content="<?php echo $title; ?>" />
  <meta property="og:description" content="<?php echo $description; ?>" />
  <meta property="og:image" content="<?php echo $image; ?>" />
  <meta property="og:image:secure_url" content="<?php echo $image; ?>" />
  <meta property="og:image:alt" content="<?php echo $safeName; ?>" />
  <meta property="og:image:type" content="image/webp" />
  <meta property="og:image:width" content="600" />
  <meta property="og:image:height" content="600" />
  <meta property="og:locale" content="bn_BD" />
  <meta property="product:price:amount" content="<?php echo $price; ?>" />
  <meta property="product:price:currency" content="BDT" />

  <!-- Twitter / X Cards -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="<?php echo $pageUrl; ?>" />
  <meta name="twitter:title" content="<?php echo $title; ?>" />
  <meta name="twitter:description" content="<?php echo $description; ?>" />
  <meta name="twitter:image" content="<?php echo $image; ?>" />

  <!-- Schema.org Product Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": <?php echo json_encode($product['name'], JSON_UNESCAPED_UNICODE); ?>,
    "image": [<?php echo json_encode($image); ?>],
    "description": <?php echo json_encode($product['description'] ?? $title, JSON_UNESCAPED_UNICODE); ?>,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "BDT",
      "price": "<?php echo $price; ?>",
      "availability": "https://schema.org/InStock",
      "url": <?php echo json_encode($pageUrl); ?>
    }
  }
  </script>
</head>
<body style="font-family: system-ui, -apple-system, sans-serif; background: #f8fafc; color: #0f172a; margin: 0; padding: 24px; text-align: center;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
    <h1 style="font-size: 1.25rem; font-weight: 800; color: #003d73; margin-bottom: 8px;"><?php echo $safeName; ?></h1>
    <p style="font-size: 1.5rem; font-weight: 900; color: #b80d18; margin: 8px 0;">৳<?php echo $price; ?></p>
    <img src="<?php echo $image; ?>" alt="<?php echo $safeName; ?>" style="max-width: 100%; height: auto; max-height: 400px; border-radius: 8px; object-fit: contain; margin: 16px 0;" />
    <p style="font-size: 0.875rem; color: #475569; line-height: 1.5;"><?php echo $description; ?></p>
    <div style="margin-top: 20px;">
      <a href="<?php echo $pageUrl; ?>" style="display: inline-block; background: #003d73; color: white; padding: 12px 24px; font-weight: bold; border-radius: 8px; text-decoration: none; text-transform: uppercase;">View Product in Shop</a>
    </div>
  </div>

  <script>
    if (typeof window !== 'undefined' && !/bot|crawl|spider|facebook|whatsapp|twitter|telegram|discord|slack|linkedin|pinterest/i.test(navigator.userAgent)) {
      window.location.replace(<?php echo json_encode($pageUrl); ?>);
    }
  </script>
</body>
</html>

