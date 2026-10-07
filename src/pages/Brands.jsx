import { brandsList } from '../data/mockData';
import { Link } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';

const Brands = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-black text-charcoal">
          Authorized & Official Brands
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          100% Genuine guarantee with manufacturer warranty support
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {brandsList.map((brand, idx) => (
          <Link
            key={idx}
            to={`/shop?search=${encodeURIComponent(brand.name)}`}
            className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-primary hover:shadow-md transition-all group"
          >
            <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center font-black text-lg text-primary group-hover:scale-110 transition-transform mb-3">
              {brand.logo}
            </div>
            <h3 className="font-bold text-sm text-charcoal group-hover:text-primary transition-colors flex items-center gap-1.5">
              <span>{brand.name}</span>
              <FiCheckCircle className="text-actionRed text-xs" />
            </h3>
            <span className="text-[11px] text-gray-400 mt-1">
              {brand.productsCount} Products Available
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Brands;

