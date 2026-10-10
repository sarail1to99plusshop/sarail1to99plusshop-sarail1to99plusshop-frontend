import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Zap, Check } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

const ProductCard = ({ product }) => {
  const { addToCart, buyNow } = useShop();
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  // Use ONLY 'product.thumbnail' as the display image
  const displayImage =
    product.thumbnail ||
    product.variants?.[0]?.images?.[0] ||
    'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&auto=format&fit=crop&q=80';

  const productLink = `/product/${product.id}`;
  const defaultVariant = product.variants?.[0] || null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, defaultVariant, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    buyNow(product, defaultVariant, 1);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col group h-full">
      {/* Product Image & Badges */}
      <div className="relative aspect-square w-full bg-white flex items-center justify-center p-2.5 sm:p-3 overflow-hidden border-b border-slate-100">
        <Link to={productLink} className="w-full h-full flex items-center justify-center">
          <img
            src={displayImage}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 ease-out"
            loading="lazy"
          />
        </Link>

        {/* Top-Left: Discount Badge */}
        {product.discount && (
          <span className="absolute top-2 left-2 bg-actionRed text-white text-[10px] sm:text-[11px] font-black px-1.5 sm:px-2 py-0.5 rounded shadow-xs uppercase tracking-wide pointer-events-none z-10">
            {product.discount}
          </span>
        )}

        {/* Top-Right: Product Tag Badge */}
        {product.tag && (
          <Link
            to={`/shop?tag=${encodeURIComponent(product.tag)}`}
            onClick={(e) => e.stopPropagation()}
            className={`absolute top-2 right-2 text-white text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded shadow-xs uppercase tracking-wider z-10 hover:brightness-110 transition-all ${
              product.tag.toLowerCase().includes('hot') || product.tag.toLowerCase().includes('deal')
                ? 'bg-amber-600'
                : product.tag.toLowerCase().includes('best')
                ? 'bg-[#003D73]'
                : product.tag.toLowerCase().includes('trending')
                ? 'bg-purple-600'
                : product.tag.toLowerCase().includes('top')
                ? 'bg-rose-600'
                : product.tag.toLowerCase().includes('special') || product.tag.toLowerCase().includes('discount')
                ? 'bg-orange-600'
                : 'bg-emerald-600'
            }`}
            title={`View ${product.tag} products`}
          >
            {product.tag}
          </Link>
        )}

        {/* Bottom-Left: Category Pill */}
        {product.category && (
          <Link
            to={`/shop?category=${encodeURIComponent(product.category.toLowerCase().replace(/[\s&]+/g, '-'))}`}
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-2 left-2 bg-black/60 hover:bg-black/80 backdrop-blur-xs text-white text-[9px] sm:text-[10px] font-medium px-1.5 sm:px-2 py-0.5 rounded capitalize transition-colors z-10"
          >
            {product.category.replace(/-/g, ' ')}
          </Link>
        )}
      </div>

      {/* Product Details */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1 justify-between gap-2.5 sm:gap-3">
        <div>
          {/* Title */}
          <Link to={productLink} className="block">
            <h3 className="font-bold text-xs sm:text-sm text-charcoal line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] group-hover:text-actionRed transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Dynamic Rating Stars (0.0 when no reviews, logically calculated when reviewed) */}
          {(() => {
            const reviewCount = Number(product.reviews || 0);
            const ratingValue = reviewCount > 0 ? Number(product.rating || 0) : 0;
            return (
              <div className="flex items-center gap-1 sm:gap-1.5 mt-1 sm:mt-2">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-colors ${
                        i < Math.round(ratingValue)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-200 fill-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[11px] sm:text-xs font-semibold text-slate-500">
                  {ratingValue.toFixed(1)}
                </span>
                <span className="text-[10px] sm:text-xs text-slate-400">
                  ({reviewCount})
                </span>
              </div>
            );
          })()}

          {/* Pricing */}
          <div className="flex items-baseline gap-1.5 sm:gap-2 mt-1 sm:mt-2">
            <span className="text-sm sm:text-base md:text-lg font-black text-actionRed">
              ৳{product.price?.toLocaleString()}
            </span>
            {product.oldPrice && (
              <span className="text-[11px] sm:text-xs md:text-sm text-slate-400 line-through">
                ৳{product.oldPrice?.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Dual Actions: Add to Cart & Buy Now */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 pt-1">
          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={`w-full text-[11px] sm:text-xs font-bold py-1.5 sm:py-2 px-1 sm:px-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-1 shadow-2xs active:scale-95 border ${
              isAdded
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-primary/10 hover:bg-primary text-primary hover:text-white border-primary/25'
            }`}
            title="Add to Cart"
          >
            {isAdded ? (
              <>
                <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3] shrink-0" />
                <span className="truncate">Added</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                <span className="truncate sm:hidden">Cart</span>
                <span className="hidden sm:inline truncate">Add to Cart</span>
              </>
            )}
          </button>

          {/* Buy Now Button */}
          <button
            type="button"
            onClick={handleBuyNow}
            className="w-full bg-actionRed hover:bg-actionRed-hover text-white text-[11px] sm:text-xs font-bold py-1.5 sm:py-2 px-1 sm:px-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-1 shadow-2xs hover:shadow-sm active:scale-95"
            title="Buy Now (Cash on Delivery)"
          >
            <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white shrink-0" />
            <span className="truncate">Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
