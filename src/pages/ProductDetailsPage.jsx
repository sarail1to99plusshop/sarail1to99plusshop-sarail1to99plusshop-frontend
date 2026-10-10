import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Check,
  Plus,
  Minus,
  Play,
  Copy,
  CheckCheck,
  X,
  ShieldCheck,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { FaFacebookF, FaWhatsapp } from 'react-icons/fa';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import {
  useProductDetails,
  useAllProducts,
  useProductReviews,
  useAddReviewMutation,
} from '../hooks/useQueries';

const formatReviewDate = (dateStr) => {
  if (!dateStr) return 'Recently';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-BD', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, buyNow } = useShop();
  const { currentUser } = useAuth();

  // Fetch product, all products, and dynamic reviews via TanStack Query
  const {
    data: product,
    isLoading: loading,
    error: queryError,
  } = useProductDetails(id);
  const { data: allProducts = [] } = useAllProducts();
  const { data: reviewsData } = useProductReviews(product?.id || id);
  const addReviewMutation = useAddReviewMutation();

  const error = queryError ? 'Failed to fetch dynamic data' : null;

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewName, setReviewName] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [showReviewSuccess, setShowReviewSuccess] = useState(false);

  // Logically calculate dynamic review list, average star rating, and star breakdown from user reviews
  const reviewsList = reviewsData?.reviews || [];
  const dynamicReviewCount = reviewsList.length;
  const totalRatingSum = reviewsList.reduce(
    (acc, r) => acc + (Number(r.rating) || 0),
    0
  );
  const dynamicRating =
    dynamicReviewCount > 0
      ? Number((totalRatingSum / dynamicReviewCount).toFixed(1))
      : 0;

  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => {
    const count = reviewsList.filter(
      (r) => Math.round(Number(r.rating) || 0) === star
    ).length;
    const percentage =
      dynamicReviewCount > 0 ? Math.round((count / dynamicReviewCount) * 100) : 0;
    return { star, count, percentage };
  });

  const activeReviewerName =
    reviewName !== '' ? reviewName : currentUser?.displayName || '';

  // Update document title and Open Graph meta tags dynamically
  useEffect(() => {
    if (!product?.name) return;

    const pageTitle = `${product.name} - ৳${product.price} | Sarail 1 to 99 Plus Shop`;
    document.title = pageTitle;

    const setMetaTag = (selector, attribute, value) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        const [attrName, attrVal] = selector.replace(/[meta[\]"]/g, '').split('=');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, value);
    };

    const imageUrl =
      product.thumbnail ||
      product.variants?.[0]?.images?.[0] ||
      'https://i.ibb.co.com/q3kcHV8G/Gemini-Generated-Image-yw9arcyw9arcyw9a.png';
    const description =
      product.description ||
      `Buy ${product.name} for ৳${product.price} at Sarail 1 to 99 Plus Shop. Fast Cash on Delivery across Bangladesh.`;

    setMetaTag('meta[property="og:title"]', 'content', pageTitle);
    setMetaTag('meta[property="og:description"]', 'content', description);
    setMetaTag('meta[property="og:image"]', 'content', imageUrl);
    setMetaTag('meta[property="og:url"]', 'content', window.location.href);
    setMetaTag('meta[name="twitter:title"]', 'content', pageTitle);
    setMetaTag('meta[name="twitter:description"]', 'content', description);
    setMetaTag('meta[name="twitter:image"]', 'content', imageUrl);

    return () => {
      document.title = 'Sarail 1 to 99 Plus Shop - Best Household, Kitchen & Daily Deals';
    };
  }, [product]);

  // Active variant (automatically falls back to first variant when navigating between products)
  const activeVariant =
    product?.variants?.find((v) => v.colorName === selectedVariant?.colorName) ||
    product?.variants?.[0] ||
    null;

  // 3 Photos for active variant
  const variantImages =
    activeVariant?.images?.slice(0, 3) ||
    [product?.thumbnail, product?.thumbnail, product?.thumbnail].filter(Boolean);

  // Active main preview image
  const mainPreviewImage =
    variantImages[selectedImageIndex] ||
    variantImages[0] ||
    product?.thumbnail ||
    'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=800&auto=format&fit=crop&q=80';

  // Navigation handlers for next/prev product dynamically
  const currentIndex = allProducts.findIndex((p) => p.id === product?.id);
  const prevProductId =
    currentIndex > 0
      ? allProducts[currentIndex - 1].id
      : allProducts[allProducts.length - 1]?.id || product?.id;
  const nextProductId =
    currentIndex < allProducts.length - 1
      ? allProducts[currentIndex + 1].id
      : allProducts[0]?.id || product?.id;

  const handlePrevProduct = () => {
    navigate(`/product/${prevProductId}`);
    setSelectedImageIndex(0);
  };

  const handleNextProduct = () => {
    navigate(`/product/${nextProductId}`);
    setSelectedImageIndex(0);
  };

  // Color selection
  const handleSelectVariant = (variant) => {
    setSelectedVariant(variant);
    setSelectedImageIndex(0);
  };

  // Quantity controls
  const handleQuantityDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleQuantityIncrease = () => {
    const maxStock = product.stock || 99;
    setQuantity((prev) => Math.min(maxStock, prev + 1));
  };

  // Add to cart
  const handleAddToCart = () => {
    addToCart(product, activeVariant, quantity);
  };

  // Buy now (Cash on Delivery)
  const handleBuyNow = () => {
    buyNow(product, activeVariant, quantity);
  };

  // Copy link
  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Submit review via TanStack Query mutation & dynamically update rating stars
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const reviewer = activeReviewerName.trim();
    if (!reviewer || !reviewComment.trim()) return;

    try {
      await addReviewMutation.mutateAsync({
        productId: product.id,
        reviewData: {
          name: reviewer,
          rating: reviewRating,
          comment: reviewComment.trim(),
          userId: currentUser?.uid || 'guest',
          userEmail: currentUser?.email || '',
          userPhoto: currentUser?.photoURL || '',
        },
      });
      setReviewComment('');
      setShowReviewSuccess(true);
      setTimeout(() => setShowReviewSuccess(false), 3500);
    } catch (err) {
      console.error('Review submit error:', err);
    }
  };

  if (loading && !product) {
    return (
      <div className="bg-[#F8FAFC] min-h-screen py-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#003D73] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-[#0F172A]">লোড হচ্ছে... (Loading product...)</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-[#F8FAFC] min-h-screen py-20 flex items-center justify-center text-center px-4">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A]">পণ্যটি পাওয়া যায়নি (Product Not Found)</h2>
          <p className="text-sm text-slate-500 mt-2">{error || 'The product could not be found or has been moved.'}</p>
          <Link
            to="/shop"
            className="inline-block mt-4 px-6 py-2.5 bg-[#003D73] text-white font-bold rounded-lg hover:bg-[#002b52] transition-colors"
          >
            দোকানে ফিরে যান (Back to Shop)
          </Link>
        </div>
      </div>
    );
  }

  // Related products dynamically derived from allProducts
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 6);

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-4 md:py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* 1. Breadcrumbs & Top Header Bar */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 py-1">
          {/* Left: Breadcrumbs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link to="/" className="hover:text-[#003D73] transition-colors">
              Home
            </Link>
            <span className="text-slate-400">/</span>
            <Link
              to={`/shop?category=${product.category}`}
              className="hover:text-[#003D73] capitalize transition-colors"
            >
              {product.category || 'Household'}
            </Link>
            <span className="text-slate-400">/</span>
            <span className="text-[#0F172A] font-semibold truncate max-w-xs md:max-w-md">
              {product.name}
            </span>
          </div>

          {/* Right: Prev, Grid, Next icons */}
          <div className="flex items-center gap-2 text-slate-500">
            <button
              onClick={handlePrevProduct}
              className="p-1 hover:text-[#003D73] transition-colors"
              title="Previous Product"
              aria-label="Previous Product"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <Link
              to="/shop"
              className="p-1 hover:text-[#003D73] transition-colors"
              title="View All Products"
              aria-label="View All Products"
            >
              <LayoutGrid className="w-4 h-4" />
            </Link>
            <button
              onClick={handleNextProduct}
              className="p-1 hover:text-[#003D73] transition-colors"
              title="Next Product"
              aria-label="Next Product"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Main Product Section: Two Independent Rounded White Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT CARD: Vertical Thumbnails + Main Image Preview + Watch Video */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 p-6 relative flex flex-col justify-between shadow-2xs">
            {/* Tag Badge on Top-Left */}
            {product.tag && (
              <Link
                to={`/shop?tag=${encodeURIComponent(product.tag)}`}
                className="absolute top-4 left-4 bg-[#003D73] hover:bg-[#002b52] text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-2xs uppercase tracking-wider transition-colors"
              >
                ★ {product.tag}
              </Link>
            )}

            {/* Discount Badge on Top-Right */}
            {product.discount && (
              <span className="absolute top-4 right-4 bg-[#DE111E] text-white text-xs font-bold px-2.5 py-0.5 rounded-full z-10 shadow-2xs">
                {product.discount}
              </span>
            )}

            {/* Gallery area: Vertical thumbnails on left, Main image on right */}
            <div className="flex flex-col sm:flex-row gap-5 items-center my-auto">
              {/* Vertical 3 Thumbnails */}
              <div className="flex sm:flex-col gap-3.5 order-2 sm:order-1 shrink-0">
                {variantImages.map((imgUrl, idx) => {
                  const isActive = selectedImageIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all p-1 bg-white flex items-center justify-center ${
                        isActive
                          ? 'border-[#003D73] ring-2 ring-[#003D73]/20 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      aria-label={`View photo ${idx + 1}`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    </button>
                  );
                })}
              </div>

              {/* Main Preview Image */}
              <div className="flex-1 flex items-center justify-center p-4 order-1 sm:order-2 min-h-[280px] sm:min-h-[360px] w-full">
                <img
                  src={mainPreviewImage}
                  alt={product.name}
                  className="max-h-[340px] w-auto max-w-full object-contain transition-transform duration-300 hover:scale-105 select-none"
                />
              </div>
            </div>

            {/* Watch Video Button at Bottom Center */}
            <div className="flex justify-center mt-4">
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-red-50 hover:bg-red-100 text-[#DE111E] text-xs font-semibold transition-colors border border-red-100 shadow-2xs active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-[#DE111E] text-[#DE111E]" />
                <span>Watch video</span>
              </button>
            </div>
          </div>

          {/* RIGHT CARD: Product Details, Color Swatches, Quantity & Dual CTAs */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 flex flex-col justify-between shadow-2xs space-y-4">
            <div className="space-y-4">
              {/* Product Badges (Tag & Category) */}
              <div className="flex items-center gap-2 flex-wrap">
                {product.tag && (
                  <Link
                    to={`/shop?tag=${encodeURIComponent(product.tag)}`}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-500 text-[#0F172A] font-black text-xs uppercase tracking-wider shadow-2xs transition-colors"
                  >
                    <span>★</span>
                    <span>{product.tag}</span>
                  </Link>
                )}
                {product.category && (
                  <Link
                    to={`/shop?category=${encodeURIComponent(product.category.toLowerCase().replace(/[\s&]+/g, '-'))}`}
                    className="inline-flex items-center px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs capitalize tracking-wide transition-colors"
                  >
                    {product.category.replace(/-/g, ' ')}
                  </Link>
                )}
              </div>

              {/* Product Title */}
              <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] leading-snug">
                {product.name}
              </h1>

              {/* Dynamic Star Rating & Review Count */}
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 transition-colors ${
                        i < Math.round(dynamicRating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-slate-200 text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold text-[#0F172A]">
                  {dynamicRating.toFixed(1)}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('reviews')}
                  className="text-slate-500 hover:text-[#003D73] font-medium underline-offset-2 hover:underline cursor-pointer"
                >
                  ({dynamicReviewCount} customer reviews)
                </button>
              </div>

              {/* Pricing Section */}
              <div className="flex items-baseline gap-3">
                {product.oldPrice && (
                  <span className="text-base sm:text-lg text-rose-500 line-through font-medium">
                    {product.oldPrice.toLocaleString()}৳
                  </span>
                )}
                <span className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                  {product.price.toLocaleString()}৳
                </span>
              </div>

              {/* In Stock Badge */}
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-2xs">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>{product.stock || 61} in stock</span>
                </span>
              </div>

              {/* Color Swatch Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="flex items-center gap-4 py-1">
                  <span className="text-xs font-bold text-slate-700">Color:</span>
                  <div className="flex items-center gap-2.5">
                    {product.variants.map((variant, idx) => {
                      const isSelected =
                        activeVariant?.colorName === variant.colorName;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectVariant(variant)}
                          className={`w-7 h-7 rounded-full transition-all relative flex items-center justify-center ${
                            isSelected
                              ? 'ring-2 ring-offset-2 ring-[#003D73] scale-110 shadow-sm'
                              : 'ring-1 ring-slate-300 hover:scale-105'
                          }`}
                          style={{ backgroundColor: variant.colorCode }}
                          title={variant.colorName}
                          aria-label={`Select ${variant.colorName}`}
                        >
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-white shadow-xs" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-xs text-slate-500 italic">
                    {activeVariant?.colorName}
                  </span>
                </div>
              )}

              {/* Warranty Badge */}
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-700">Warranty:</span>
                <span className="px-3.5 py-1 rounded-full border border-slate-300 text-xs text-slate-700 bg-white font-medium">
                  {product.warranty || '12 Months Replacement'}
                </span>
              </div>

              {/* eCommerce Actions: Quantity Counter + ADD TO CART + BUY NOW */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                {/* Quantity Selector Counter */}
                <div className="inline-flex items-center border border-slate-300 rounded-md bg-white shadow-2xs">
                  <button
                    type="button"
                    onClick={handleQuantityDecrease}
                    disabled={quantity <= 1}
                    className="px-2.5 py-2 text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-xs font-bold text-[#0F172A] select-none">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={handleQuantityIncrease}
                    disabled={quantity >= (product.stock || 99)}
                    className="px-2.5 py-2 text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* ADD TO CART (Solid Primary Navy) */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 min-w-[130px] bg-[#003D73] hover:bg-[#002b52] text-white text-xs font-bold py-2.5 px-4 rounded-md uppercase tracking-wider transition-all duration-200 shadow-2xs hover:shadow-md flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <span>ADD TO CART</span>
                </button>

                {/* BUY NOW (Solid Action Red) */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="flex-1 min-w-[130px] bg-[#DE111E] hover:bg-[#bf0e19] text-white text-xs font-bold py-2.5 px-4 rounded-md uppercase tracking-wider transition-all duration-200 shadow-2xs hover:shadow-md flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <span>BUY NOW</span>
                </button>
              </div>
            </div>

            {/* Delivery Charge Info Box */}
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <Truck className="w-4 h-4 text-[#003D73]" />
                <span>Delivery Charges:</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-0.5">
                <div className="bg-white p-2 rounded border border-slate-200/70 flex flex-col">
                  <span className="font-bold text-[#0F172A]">Inside Dhaka</span>
                  <span className="text-[#DE111E] font-extrabold text-xs">৳60</span>
                  <span className="text-[10px] text-slate-400">1-2 Business Days</span>
                </div>
                <div className="bg-white p-2 rounded border border-slate-200/70 flex flex-col">
                  <span className="font-bold text-[#0F172A]">Outside Dhaka</span>
                  <span className="text-[#DE111E] font-extrabold text-xs">৳120</span>
                  <span className="text-[10px] text-slate-400">2-4 Business Days</span>
                </div>
              </div>
            </div>

            {/* Bottom Metadata: SKU, Category & Social Sharing */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="text-xs text-slate-500 flex items-center gap-4">
                <span>
                  <strong className="text-slate-700">SKU:</strong>{' '}
                  {product.sku || `SAR-${product.id}099`}
                </span>
                <span>
                  <strong className="text-slate-700">Category:</strong>{' '}
                  <span className="capitalize">{product.category}</span>
                </span>
              </div>

              {/* Share icons */}
              <div className="flex items-center gap-3 text-xs text-slate-600">
                <span className="font-bold">Share :</span>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    typeof window !== 'undefined' ? window.location.href : ''
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90 shadow-2xs"
                  title="Share on Facebook"
                  aria-label="Share on Facebook"
                >
                  <FaFacebookF className="text-xs" />
                </a>
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    product.name + ' ' + (typeof window !== 'undefined' ? window.location.href : '')
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:opacity-90 shadow-2xs"
                  title="Share on WhatsApp"
                  aria-label="Share on WhatsApp"
                >
                  <FaWhatsapp className="text-sm" />
                </a>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-colors shadow-2xs"
                >
                  {copiedLink ? (
                    <>
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>COPIED!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>COPY LINK</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* 3. Middle Section: DESCRIPTION / REVIEWS Tabs */}
        <div className="space-y-4 pt-4">
          {/* Centered Tab Buttons */}
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('description')}
              className={`px-7 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'description'
                  ? 'border-2 border-[#003D73] text-[#003D73] bg-[#003D73]/10 shadow-xs'
                  : 'border border-slate-300 text-slate-600 bg-white hover:border-slate-400'
              }`}
            >
              DESCRIPTION
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`px-7 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'reviews'
                  ? 'border-2 border-[#003D73] text-[#003D73] bg-[#003D73]/10 shadow-xs'
                  : 'border border-slate-300 text-slate-600 bg-white hover:border-slate-400'
              }`}
            >
              REVIEWS ({dynamicReviewCount})
            </button>
          </div>

          {/* Tab Content Box */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-10 shadow-2xs">
            {activeTab === 'description' ? (
              <div className="space-y-8 text-sm text-slate-700 leading-relaxed">
                {/* Features list */}
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#0F172A] mb-3">
                    {product.name} Features
                  </h3>
                  <p>{product.description}</p>
                </div>

                {/* Pricing in BD */}
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#0F172A] mb-2">
                    {product.name} Price in Bangladesh
                  </h3>
                  <p className="text-slate-600">
                    Buy original <strong className="text-[#0F172A]">{product.name}</strong> at the best price in Bangladesh from <strong>Sarail 1 to 99+ Shop</strong>. Special retail rate of <strong>৳{product.price.toLocaleString()}</strong> (regular price ৳{product.oldPrice?.toLocaleString() || (product.price + 300).toLocaleString()}). Order online for 100% authentic products, fast home delivery, and unbeatable deals across all 64 districts.
                  </p>
                </div>

                {/* Why choose store */}
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <h3 className="text-sm sm:text-base font-bold text-[#0F172A]">
                    Why Choose Sarail 1 to 99+ Shop in Bangladesh
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Looking for the best affordable lifestyle, crockery, kitchenware, and household items in Bangladesh? Sarail 1 to 99+ Shop guarantees verified authentic merchandise, transparent Cash on Delivery service, prompt 24-48 hours courier shipping via Steadfast, and hassle-free 7-day replacement support.
                  </p>
                </div>
              </div>
            ) : (
              /* REVIEWS TAB (DYNAMIC STARS & REVIEWS) */
              <div className="space-y-8">
                {/* Dynamic Rating Summary & Logical Breakdown Banner */}
                <div className="bg-slate-50 p-5 sm:p-6 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-5 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#003D73] text-white flex flex-col items-center justify-center shadow-xs shrink-0">
                      <span className="text-xl font-black leading-none">
                        {dynamicRating.toFixed(1)}
                      </span>
                      <span className="text-[10px] text-slate-200 mt-0.5">
                        out of 5
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 transition-colors ${
                              i < Math.round(dynamicRating)
                                ? 'fill-amber-400 text-amber-400'
                                : 'fill-slate-200 text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-[#0F172A] mt-1">
                        {dynamicReviewCount > 0
                          ? `Based on ${dynamicReviewCount} ${
                              dynamicReviewCount === 1 ? 'Review' : 'Reviews'
                            }`
                          : 'No Reviews Yet (0.0 / 5)'}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {dynamicReviewCount > 0
                          ? `Total Score: ${totalRatingSum} ★ ÷ ${dynamicReviewCount} = ${dynamicRating.toFixed(
                              1
                            )} ★`
                          : 'Submit the first review below to calculate rating'}
                      </p>
                    </div>
                  </div>

                  {/* Star Breakdown Progress Bars */}
                  <div className="md:col-span-7 space-y-1.5 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6">
                    {ratingBreakdown.map(({ star, count, percentage }) => (
                      <div key={star} className="flex items-center gap-2.5 text-xs">
                        <span className="w-10 font-bold text-slate-600 flex items-center gap-0.5 shrink-0">
                          <span>{star}</span>
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        </span>
                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="w-14 text-right text-[11px] text-slate-500 font-medium shrink-0">
                          {count} ({percentage}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review Form */}
                <form
                  onSubmit={handleReviewSubmit}
                  className="bg-slate-50 p-5 sm:p-6 rounded-xl border border-slate-200 space-y-4"
                >
                  <h4 className="font-bold text-sm text-[#0F172A]">
                    Leave a Review &amp; Rating for this Product
                  </h4>
                  {showReviewSuccess && (
                    <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-md border border-emerald-200">
                      Thank you! Your review has been saved and the product&apos;s star rating has been recalculated dynamically.
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-bold text-slate-700">
                      Select Your Star Rating:
                    </span>
                    <div className="flex items-center text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="p-1 hover:scale-110 transition-transform cursor-pointer"
                          aria-label={`Rate ${star} stars`}
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= reviewRating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300 fill-slate-200'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-[#003D73] bg-white px-2.5 py-1 rounded-full border border-slate-200">
                      {reviewRating} {reviewRating === 1 ? 'Star' : 'Stars'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Your Full Name *"
                      value={activeReviewerName}
                      onChange={(e) => setReviewName(e.target.value)}
                      className="bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-lg outline-none focus:border-[#003D73]"
                    />
                  </div>

                  <textarea
                    rows={3}
                    required
                    placeholder="Write your honest review about this product..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-xs px-3.5 py-2 rounded-lg outline-none focus:border-[#003D73]"
                  />

                  <button
                    type="submit"
                    disabled={addReviewMutation.isPending}
                    className="bg-[#003D73] hover:bg-[#002b52] text-white text-xs font-bold py-2.5 px-6 rounded-lg uppercase tracking-wider transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
                  >
                    {addReviewMutation.isPending ? 'Submitting Review...' : 'Submit Review'}
                  </button>
                </form>

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviewsList.length === 0 ? (
                    <div className="p-8 text-center rounded-xl border border-dashed border-slate-200 bg-white">
                      <p className="text-sm font-bold text-slate-700">
                        No customer reviews yet
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Be the first to rate and review this product using the form above!
                      </p>
                    </div>
                  ) : (
                    reviewsList.map((rev, idx) => (
                      <div
                        key={rev._id || rev.id || idx}
                        className="p-4 rounded-xl border border-slate-100 bg-white space-y-2 shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-[#0F172A]">
                              {rev.name}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                              Verified
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400">
                            {rev.date || formatReviewDate(rev.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-amber-400 text-xs">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < Number(rev.rating)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-200 fill-slate-200'
                              }`}
                            />
                          ))}
                          <span className="text-[11px] font-bold text-slate-600 ml-1">
                            ({rev.rating}/5)
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {rev.comment}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4. Bottom Section: Related Products with Pill Header & Navigation */}
        <div className="space-y-5 pt-4">
          <div className="flex items-center justify-between">
            {/* Red Pill Header matching screenshot */}
            <div className="inline-block">
              <span className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-[#DE111E] text-white font-extrabold text-sm sm:text-base tracking-wide shadow-xs">
                Related Products
              </span>
            </div>

            <Link
              to="/shop"
              className="text-xs font-bold text-[#003D73] hover:text-[#DE111E] transition-colors"
            >
              See All →
            </Link>
          </div>

          {/* Related Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {relatedProducts.map((relProd) => {
              const relImage =
                relProd.thumbnail ||
                relProd.variants?.[0]?.images?.[0] ||
                'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&auto=format&fit=crop&q=80';

              return (
                <Link
                  key={relProd.id}
                  to={`/product/${relProd.id}`}
                  className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group p-2.5 text-center"
                >
                  <div className="relative pt-[100%] bg-slate-50 rounded-lg overflow-hidden mb-2">
                    <img
                      src={relImage}
                      alt={relProd.name}
                      className="absolute inset-0 w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    {relProd.discount && (
                      <span className="absolute top-1.5 left-1.5 bg-[#DE111E] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                        {relProd.discount}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-[11px] sm:text-xs text-[#0F172A] line-clamp-1 group-hover:text-[#DE111E] transition-colors">
                      {relProd.name}
                    </h4>
                    <div className="flex items-center justify-center gap-1.5 mt-1">
                      {relProd.oldPrice && (
                        <span className="text-[10px] text-slate-400 line-through">
                          ৳{relProd.oldPrice}
                        </span>
                      )}
                      <span className="text-xs font-black text-[#DE111E]">
                        ৳{relProd.price}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

      </div>

      {/* Watch Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
          <div className="relative bg-white rounded-2xl max-w-2xl w-full p-4 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-bold text-sm text-[#0F172A]">
                {product.name} - Product Showcase Video
              </h4>
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video w-full rounded-xl overflow-hidden mt-3 bg-black">
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Product video preview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Floating Trust Badge Strip on Desktop Bottom */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#003D73]/10 text-[#003D73] flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-bold text-[#0F172A]">ক্যাশ অন ডেলিভারি (COD)</h5>
              <p className="text-[11px] text-slate-400">সারা দেশে পণ্য দেখে পেমেন্ট করুন</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#DE111E]/10 text-[#DE111E] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-bold text-[#0F172A]">১০০% অথেন্টিক প্রোডাক্ট</h5>
              <p className="text-[11px] text-slate-400">কোয়ালিটি যাচাইকৃত আসল পণ্য</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-bold text-[#0F172A]">৭ দিনের রিপ্লেসমেন্ট গ্যারান্টি</h5>
              <p className="text-[11px] text-slate-400">সহজ পরিবর্তনের সুযোগ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
