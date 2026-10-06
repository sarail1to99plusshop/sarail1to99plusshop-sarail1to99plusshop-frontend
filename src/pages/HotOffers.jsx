import { sampleProducts } from '../data/mockData';
import ProductCard from '../components/common/ProductCard';
import { FaFire } from 'react-icons/fa';

const HotOffers = () => {
  const deals = sampleProducts.filter((p) => p.discount);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#DE111E] via-[#E52D27] to-[#F27121] text-white p-6 sm:p-8 rounded-xl shadow-lg mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white text-actionRed flex items-center justify-center text-3xl shrink-0 shadow-md">
            <FaFire className="animate-bounce" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-red-200">
              Limited Time Deals
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              HOT OFFERS & MEGA DISCOUNTS
            </h1>
            <p className="text-xs text-red-100 mt-1">
              Save up to 30% on bestselling wireless gadgets, smartwatches & accessories.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {deals.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default HotOffers;

