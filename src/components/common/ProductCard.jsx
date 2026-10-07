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
      {/* Product Image & Discount Badge */}
      <Link
        to={productLink}
        className="relative pt-[90%] bg-slate-50 overflow-hidden block"
      >
        <img
          src={displayImage}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        {/* Discount Badge */}
        {product.discount && (
          <span className="absolute top-2.5 left-2.5 bg-actionRed text-white text-[11px] font-extrabold px-2 py-0.5 rounded shadow-sm uppercase tracking-wide">
            {product.discount}
          </span>
        )}
        {/* Category tag */}
        {product.category && (
          <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded capitalize">
            {product.category.replace('-', ' ')}
          </span>
        )}
      </Link>

      {/* Product Details */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Title */}
          <Link to={productLink} className="block">
            <h3 className="font-bold text-xs md:text-sm text-charcoal line-clamp-2 group-hover:text-actionRed transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < (product.rating || 5)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-200 fill-slate-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {product.rating ? Number(product.rating).toFixed(1) : '5.0'}
            </span>
            <span className="text-xs text-slate-400">
              ({product.reviews || 0})
            </span>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-base md:text-lg font-black text-actionRed">
              ৳{product.price?.toLocaleString()}
            </span>
            {product.oldPrice && (
              <span className="text-xs md:text-sm text-slate-400 line-through">
                ৳{product.oldPrice?.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Dual Actions: Add to Cart & Buy Now */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={`w-full text-xs font-bold py-2 px-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-1 shadow-2xs active:scale-95 border ${
              isAdded
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-primary/10 hover:bg-primary text-primary hover:text-white border-primary/25'
            }`}
            title="Add to Cart"
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span className="truncate">Added!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span className="truncate">Add to Cart</span>
              </>
            )}
          </button>

          {/* Buy Now Button */}
          <button
            type="button"
            onClick={handleBuyNow}
            className="w-full bg-actionRed hover:bg-actionRed-hover text-white text-xs font-bold py-2 px-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-1 shadow-2xs hover:shadow-sm active:scale-95"
            title="Buy Now (Cash on Delivery)"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span className="truncate">Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
