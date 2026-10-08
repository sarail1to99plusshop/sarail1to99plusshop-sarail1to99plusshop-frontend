import { Link } from 'react-router-dom';
import { FaFire, FaArrowRight, FaShieldAlt, FaTruck, FaUndo, FaTag } from 'react-icons/fa';
import { BsBoxSeam } from 'react-icons/bs';
import { sampleProducts, categoriesList } from '../data/mockData';
import ProductCard from '../components/common/ProductCard';
import HeroCarousel from '../components/common/HeroCarousel';

const Home = () => {
  const hotOffers = sampleProducts
    .filter(
      (p) =>
        p.discount ||
        p.tag?.toLowerCase().includes('hot') ||
        p.tag?.toLowerCase().includes('deal')
    )
    .slice(0, 4);

  const bestSellers = sampleProducts
    .filter(
      (p) =>
        p.tag?.toLowerCase().includes('best') ||
        p.tag?.toLowerCase().includes('popular') ||
        p.tag?.toLowerCase().includes('top')
    )
    .slice(0, 4);

  const newArrivals = sampleProducts
    .filter(
      (p) =>
        p.tag?.toLowerCase().includes('trending') ||
        p.tag?.toLowerCase().includes('essential') ||
        p.tag?.toLowerCase().includes('special')
    )
    .slice(0, 4);

  return (
    <div className="w-full pb-16 space-y-10">
      
      {/* 1. Hero Swiper Carousel Banner */}
      <section className="max-w-7xl mx-auto px-0 md:px-4 pt-0 md:pt-4">
        <HeroCarousel />
      </section>

      {/* 2. Value Strip */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg shrink-0">
              <FaTruck />
            </div>
            <div>
              <h4 className="font-bold text-xs md:text-sm text-charcoal">Nationwide Delivery</h4>
              <p className="text-[11px] text-gray-400">Fast shipping in 24-48 hours</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-full bg-actionRed/10 text-actionRed flex items-center justify-center text-lg shrink-0">
              <FaTag />
            </div>
            <div>
              <h4 className="font-bold text-xs md:text-sm text-charcoal">Affordable 1 to 99+</h4>
              <p className="text-[11px] text-gray-400">Best wholesale & retail rates</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg shrink-0">
              <FaShieldAlt />
            </div>
            <div>
              <h4 className="font-bold text-xs md:text-sm text-charcoal">100% Quality Checked</h4>
              <p className="text-[11px] text-gray-400">Durable household items</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-full bg-actionRed/10 text-actionRed flex items-center justify-center text-lg shrink-0">
              <FaUndo />
            </div>
            <div>
              <h4 className="font-bold text-xs md:text-sm text-charcoal">Easy Replacement</h4>
              <p className="text-[11px] text-gray-400">7-day simple return warranty</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 8 Main Categories */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-charcoal">
              Explore Our 8 Departments
            </h2>
            <p className="text-xs text-gray-500">Pick from our variety store collections</p>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-primary hover:text-actionRed flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <FaArrowRight className="text-[10px]" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {categoriesList.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.id}`}
              className="bg-white border border-gray-200 hover:border-primary rounded-lg p-3 text-center shadow-2xs hover:shadow-md transition-all duration-200 group flex flex-col items-center justify-center min-h-[72px]"
            >
              <h3 className="font-bold text-xs text-charcoal group-hover:text-primary transition-colors text-center line-clamp-2 leading-snug">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Flash Sale & Hot Offers */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-[#DE111E] via-[#E52D27] to-[#F27121] text-white p-6 rounded-xl shadow-lg mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white text-actionRed flex items-center justify-center text-2xl shrink-0 shadow-md">
              <FaFire />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                FLASH SALE & HOT DEALS
              </h2>
              <p className="text-xs text-red-100">
                Special limited-time discounts on kitchen appliances, melamine & household organizers
              </p>
            </div>
          </div>

          <Link
            to="/hot-offers"
            className="bg-white hover:bg-gray-100 text-actionRed font-bold text-xs uppercase px-5 py-2.5 rounded-full shadow-md transition-all shrink-0"
          >
            Explore All Deals
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {hotOffers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Best Selling Products */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-charcoal">
              Best Selling Daily Needs
            </h2>
            <p className="text-xs text-gray-500">Most purchased cookware, cleaning tools & baby accessories</p>
          </div>
          <Link
            to="/best-selling"
            className="text-xs font-bold text-primary hover:text-actionRed flex items-center gap-1 transition-colors"
          >
            <span>See More</span>
            <FaArrowRight className="text-[10px]" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. Special Pre-Order Banner */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-[#00274B] text-white rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-primary-light/30">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-actionRed-light">
              Special Order Booking
            </span>
            <h3 className="text-2xl font-bold text-white">
              Need Specific Dinner Sets or Wholesale Lots?
            </h3>
            <p className="text-xs text-gray-300">
              We arrange custom party crockery, wedding gifts, baby toys & bulk household items directly from leading manufacturers.
            </p>
          </div>

          <Link
            to="/pre-order"
            className="bg-actionRed hover:bg-actionRed-hover text-white font-bold text-xs uppercase px-6 py-3 rounded-md shadow-md transition-all flex items-center gap-2 shrink-0"
          >
            <BsBoxSeam className="text-base" />
            <span>Place Special Request</span>
          </Link>
        </div>
      </section>

      {/* 7. New Arrivals */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-charcoal">
              New Arrivals This Week
            </h2>
            <p className="text-xs text-gray-500">Fresh stock just unpacked at Sarail 1 to 99 Plus Shop</p>
          </div>
          <Link
            to="/new-arrivals"
            className="text-xs font-bold text-primary hover:text-actionRed flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <FaArrowRight className="text-[10px]" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;
