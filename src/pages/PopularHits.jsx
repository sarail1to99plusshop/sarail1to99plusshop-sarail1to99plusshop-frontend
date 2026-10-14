import { Link } from 'react-router-dom';
import { FaFire } from 'react-icons/fa';
import { FiShoppingBag } from 'react-icons/fi';
import { useAllProducts } from '../hooks/useQueries';
import ProductCard from '../components/common/ProductCard';
import { ProductGridSkeleton } from '../components/common/ProductCardSkeleton';

const PopularHits = () => {
  const { data: sampleProducts = [], isLoading } = useAllProducts();

  // Curated Popular items: checked in collections.popular or tagged 'popular'
  const popularItems = sampleProducts.filter(
    (p) =>
      p.collections?.popular === true ||
      p.tag?.toLowerCase().includes('popular')
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6 border-b border-gray-200 pb-4">
        <div className="w-10 h-10 rounded-full bg-red-100 text-[#B80D18] flex items-center justify-center text-xl shrink-0">
          <FaFire aria-hidden="true" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-[#B80D18] text-white px-2 py-0.5 rounded shadow-2xs">
              Trending &amp; Favorites
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-charcoal mt-1">
            Popular &amp; Hit Items
          </h1>
          <p className="text-xs text-gray-600 mt-0.5 max-w-2xl">
            Discover the products everyone&apos;s talking about. Explore trending finds, customer favorites, and exciting everyday essentials, all in one place.
          </p>
        </div>
      </div>

      {isLoading ? (
        <ProductGridSkeleton
          count={8}
          columnsClass="grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        />
      ) : popularItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {popularItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center max-w-md mx-auto space-y-4 my-8">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-2xl mx-auto">
            <FiShoppingBag />
          </div>
          <h2 className="text-lg font-bold text-charcoal">
            No popular items available right now.
          </h2>
          <p className="text-xs text-gray-500">
            Explore our shop to discover more products.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase px-5 py-2.5 rounded-md transition-colors shadow-2xs"
          >
            <FiShoppingBag />
            <span>Explore All Products</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default PopularHits;

