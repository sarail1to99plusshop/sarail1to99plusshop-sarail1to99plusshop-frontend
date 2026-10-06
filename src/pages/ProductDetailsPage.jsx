import { useState, useId } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Plus,
  Minus,
  ShoppingCart,
  Zap,
  ChevronRight,
  Share2,
  Heart,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { sampleProducts } from '../data/mockData';
import ProductCard from '../components/common/ProductCard';

const ProductDetailsPage = ({ product: initialProduct }) => {
  const { id } = useParams();
  const { addToCart, buyNow } = useShop();

  // Find product by id from route params or fallback to prop / first sample product
  const product =
    initialProduct ||
    sampleProducts.find(
      (p) => p.id?.toString() === id || p._id?.$oid === id
    ) ||
    sampleProducts[0];

  // State management
  const [selectedVariant, setSelectedVariant] = useState(
    () => product?.variants?.[0] || null
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showAddedToast, setShowAddedToast] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Generate unique ID for toast accessible naming
  const toastTitleId = useId();

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-charcoal">পণ্যটি পাওয়া যায়নি (Product Not Found)</h2>
        <p className="text-slate-500 mt-2">The product you are looking for does not exist or has been moved.</p>
        <Link
          to="/shop"
          className="inline-block mt-6 px-6 py-2.5 bg-primary text-white font-bold rounded-lg shadow hover:bg-primary-dark transition-colors"
        >
          দোকানে ফিরে যান (Back to Shop)
        </Link>
      </div>
    );
  }

  // Active color variant (defaults to selectedVariant or first variant)
  const activeVariant = selectedVariant || product.variants?.[0] || null;

  // Active images: 3 photos for current variant
  const variantImages =
    activeVariant?.images?.slice(0, 3) ||
    [product.thumbnail, product.thumbnail, product.thumbnail].filter(Boolean);

  // Main active preview image
  const mainPreviewImage =
    variantImages[selectedImageIndex] ||
    variantImages[0] ||
    product.thumbnail ||
    'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=800&auto=format&fit=crop&q=80';

  // Handler for color selection:
  // a) Updates selected variant state
  // b) Instantly updates preview image to the first photo of the selected color variant
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

  // Add to cart handler
  const handleAddToCart = () => {
    addToCart(product, activeVariant, quantity);
    setShowAddedToast(true);
    setTimeout(() => {
      setShowAddedToast(false);
    }, 2500);
  };

  // Buy now handler (opens Instant Cash on Delivery modal)
  const handleBuyNow = () => {
    buyNow(product, activeVariant, quantity);
  };

  // Image zoom effect coordinates
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  // Related products
  const relatedProducts = sampleProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  return (
    <div className="bg-canvas min-h-screen py-4 md:py-8">
      {/* Toast Notification */}
      {showAddedToast && (
        <div
          role="region"
          aria-labelledby={toastTitleId}
          className="fixed top-20 right-4 md:right-8 z-50 bg-charcoal text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-slideDown"
        >
          <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
          <div>
            <h3 id={toastTitleId} className="font-bold text-xs md:text-sm">কার্ট-এ যোগ করা হয়েছে!</h3>
            <p className="text-[11px] text-slate-300">
              {quantity}x {product.name.slice(0, 28)}...
            </p>
          </div>
          <Link
            to="/cart"
            className="ml-3 text-xs font-bold text-actionRed hover:underline"
          >
            কার্ট দেখুন
          </Link>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center text-xs text-slate-500 overflow-x-auto py-1"
        >
          <Link to="/" className="hover:text-primary transition-colors shrink-0">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 mx-1.5 shrink-0 text-slate-400" />
          <Link to="/shop" className="hover:text-primary transition-colors shrink-0">
            Shop
          </Link>
          {product.category && (
            <>
              <ChevronRight className="w-3.5 h-3.5 mx-1.5 shrink-0 text-slate-400" />
              <Link
                to={`/shop?category=${product.category}`}
                className="hover:text-primary transition-colors shrink-0 capitalize"
              >
                {product.category.replace('-', ' ')}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5 mx-1.5 shrink-0 text-slate-400" />
          <span className="text-charcoal font-semibold truncate max-w-xs">
            {product.name}
          </span>
        </nav>

        {/* Main Product Section: Dual Column Layout */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* 1. Left Column: Interactive Image Gallery */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              {/* Main Large Preview Image */}
              <div
                className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-50 border border-slate-200 cursor-crosshair group select-none"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
              >
                <img
                  src={mainPreviewImage}
                  alt={`${product.name} - ${activeVariant?.colorName || 'Default'}`}
                  className={`w-full h-full object-cover transition-transform duration-300 ${
                    isZoomed ? 'scale-125' : 'scale-100'
                  }`}
                  style={
                    isZoomed
                      ? {
                          transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                        }
                      : undefined
                  }
                />

                {/* Badges on main preview */}
                <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 pointer-events-none">
                  {product.discount && (
                    <span className="bg-actionRed text-white text-xs font-black px-2.5 py-1 rounded shadow-sm tracking-wide">
                      {product.discount}
                    </span>
                  )}
                  {product.tag && (
                    <span className="bg-primary text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-sm">
                      {product.tag}
                    </span>
                  )}
                </div>

                <div className="absolute top-3.5 right-3.5 flex gap-2">
                  <button
                    type="button"
                    className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs text-slate-600 hover:text-actionRed flex items-center justify-center shadow-sm border border-slate-200 transition-colors"
                    title="Add to Wishlist"
                    aria-label="Add to Wishlist"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs text-slate-600 hover:text-primary flex items-center justify-center shadow-sm border border-slate-200 transition-colors"
                    title="Share Product"
                    aria-label="Share Product"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 3 Small Thumbnail Previews Underneath */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {variantImages.map((imgUrl, idx) => {
                  const isActive = selectedImageIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative aspect-square rounded-lg overflow-hidden bg-slate-50 border-2 transition-all duration-200 group ${
                        isActive
                          ? 'border-actionRed ring-2 ring-actionRed/20 shadow-xs'
                          : 'border-slate-200 hover:border-primary/50'
                      }`}
                      aria-label={`View photo ${idx + 1} of ${activeVariant?.colorName || 'selected color'}`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${product.name} view ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                      />
                      {isActive && (
                        <span className="absolute inset-0 bg-primary/5 pointer-events-none" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Right Column: Product Information & Controls */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                
                {/* Title */}
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-charcoal leading-tight">
                  {product.name}
                </h1>

                {/* Rating & Stock Status */}
                <div className="flex flex-wrap items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < (product.rating || 5)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-200 fill-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-charcoal">
                      {product.rating ? Number(product.rating).toFixed(1) : '5.0'}
                    </span>
                    <span className="text-slate-400">
                      ({product.reviews || 78} কাস্টমার রিভিউ)
                    </span>
                  </div>

                  <span className="text-slate-300">|</span>

                  <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>স্টকে আছে (In Stock: {product.stock || 45})</span>
                  </div>
                </div>

                {/* Pricing Block */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex flex-wrap items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-black text-actionRed">
                    ৳{product.price?.toLocaleString()}
                  </span>
                  {product.oldPrice && (
                    <span className="text-base sm:text-lg text-slate-400 line-through">
                      ৳{product.oldPrice?.toLocaleString()}
                    </span>
                  )}
                  {product.discount && (
                    <span className="bg-red-100 text-actionRed font-bold text-xs px-2.5 py-1 rounded-md">
                      {product.discount} ছাড়
                    </span>
                  )}
                </div>

                {/* Description Preview */}
                <div className="text-sm text-slate-600 leading-relaxed pt-1">
                  <p>{product.description}</p>
                </div>

                {/* Color Selector Section */}
                {product.variants && product.variants.length > 0 && (
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-charcoal">
                        কালার সিলেক্ট করুন (Select Color):
                      </span>
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                        {activeVariant?.colorName}
                      </span>
                    </div>

                    {/* Circular Color Swatches */}
                    <div className="flex items-center gap-3">
                      {product.variants.map((variant, idx) => {
                        const isSelected =
                          activeVariant?.colorName === variant.colorName;

                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelectVariant(variant)}
                            className={`w-10 h-10 rounded-full transition-all duration-200 relative flex items-center justify-center ${
                              isSelected
                                ? 'ring-2 ring-offset-2 ring-actionRed scale-110 shadow-md'
                                : 'ring-1 ring-slate-300 hover:scale-105 opacity-85 hover:opacity-100'
                            }`}
                            style={{ backgroundColor: variant.colorCode }}
                            title={variant.colorName}
                            aria-label={`Select color ${variant.colorName}`}
                          >
                            {isSelected && (
                              <span className="w-3 h-3 rounded-full bg-white shadow-xs border border-black/20 flex items-center justify-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-actionRed" />
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quantity Selector Section */}
                <div className="pt-3 border-t border-slate-100">
                  <span className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-2">
                    পরিমাণ (Quantity):
                  </span>
                  <div className="inline-flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden shadow-2xs">
                    <button
                      type="button"
                      onClick={handleQuantityDecrease}
                      disabled={quantity <= 1}
                      className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-12 text-center text-sm font-bold text-charcoal select-none">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={handleQuantityIncrease}
                      disabled={quantity >= (product.stock || 99)}
                      className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Dual eCommerce Action Buttons */}
                <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Add to Cart */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="w-full bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/30 font-bold text-sm py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-2xs active:scale-[0.99]"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>কার্ট-এ যোগ করুন (Add to Cart)</span>
                  </button>

                  {/* Prominent Cash on Delivery Button */}
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="w-full bg-actionRed hover:bg-actionRed-hover text-white font-extrabold text-sm py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.99]"
                  >
                    <Zap className="w-4 h-4 fill-white" />
                    <span>অর্ডার করুন (Cash on Delivery)</span>
                  </button>
                </div>

              </div>

              {/* Trust Badges & Guarantee Policy */}
              <div className="pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-charcoal">ক্যাশ অন ডেলিভারি</h4>
                    <p className="text-[10px] text-slate-500">পণ্য হাতে পেয়ে মূল্য দিন</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
                  <div className="w-8 h-8 rounded-full bg-actionRed/10 text-actionRed flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-charcoal">১০০% প্রিমিয়াম পণ্য</h4>
                    <p className="text-[10px] text-slate-500">কোয়ালিটি যাচাইকৃত</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-charcoal">৭ দিনের রিপ্লেসমেন্ট</h4>
                    <p className="text-[10px] text-slate-500">সহজ পরিবর্তনের সুবিধা</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Detailed Information & Key Features */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-4">
          <h2 className="text-lg md:text-xl font-bold text-charcoal border-b border-slate-200 pb-3">
            পণ্যের বিবরণ ও বৈশিষ্ট্য (Product Specifications)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm text-slate-600">
            <div className="space-y-2">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="font-semibold text-charcoal">মডেল / সাইজ:</span>
                <span>24cm Non-Stick Standard</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="font-semibold text-charcoal">কোটিং ম্যাটেরিয়াল:</span>
                <span>Granite PFOA-Free Ultra Durable</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="font-semibold text-charcoal">হ্যান্ডেল টাইপ:</span>
                <span>Heat-Resistant Wooden Stay-Cool Handle</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="font-semibold text-charcoal">উপযুক্ততা:</span>
                <span>Gas Stove & Induction Compatible</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="font-semibold text-charcoal">ক্লিনিং:</span>
                <span>Easy Sponge Wash & Dishwasher Safe</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="font-semibold text-charcoal">ওয়ারেন্টি:</span>
                <span>Official Replacement Warranty</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-black text-charcoal">
                একই ক্যাটাগরির অন্যান্য পণ্য (Related Products)
              </h2>
              <Link
                to={`/shop?category=${product.category}`}
                className="text-xs font-bold text-primary hover:text-actionRed transition-colors"
              >
                সবগুলো দেখুন →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2.5 z-40 flex items-center justify-between gap-3 shadow-lg">
        <div>
          <span className="text-[10px] text-slate-400 block">মোট মূল্য</span>
          <span className="text-base font-black text-actionRed">
            ৳{(product.price * quantity).toLocaleString()}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-1 justify-end">
          <button
            type="button"
            onClick={handleAddToCart}
            className="bg-primary/10 text-primary border border-primary/30 p-2.5 rounded-lg active:scale-95"
            title="Add to Cart"
            aria-label="Add to Cart"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            className="bg-actionRed text-white font-black text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-md active:scale-95 flex-1 justify-center"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span>অর্ডার করুন (COD)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;

