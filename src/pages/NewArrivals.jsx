import { sampleProducts } from '../data/mockData';
import ProductCard from '../components/common/ProductCard';
import { FiZap } from 'react-icons/fi';

const NewArrivals = () => {
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
            Freshly released gadgets, earphones, and tech gear added to our store
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...sampleProducts].reverse().map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default NewArrivals;

