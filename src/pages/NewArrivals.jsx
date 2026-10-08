import { sampleProducts } from '../data/mockData';
import ProductCard from '../components/common/ProductCard';
import { FiZap } from 'react-icons/fi';

const NewArrivals = () => {
  const newArrivals = sampleProducts.filter(
    (p) =>
      p.tag?.toLowerCase().includes('trending') ||
      p.tag?.toLowerCase().includes('essential') ||
      p.tag?.toLowerCase().includes('special')
  );
  const displayProducts = newArrivals.length > 0 ? newArrivals : [...sampleProducts].reverse();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6 border-b border-gray-200 pb-4">
        <div className="w-10 h-10 rounded-full bg-primary-50 text-primary flex items-center justify-center text-xl">
          <FiZap />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-charcoal">
            New Arrivals
          </h1>
          <p className="text-xs text-gray-500">
            Freshly released household gadgets, trending tools & lifestyle accessories
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {displayProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default NewArrivals;

