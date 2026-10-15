import { Link } from 'react-router-dom';
import { FaFire, FaArrowRight, FaWhatsapp } from 'react-icons/fa';
import { useAllProducts, useCategories } from '../hooks/useQueries';
import ProductCard from '../components/common/ProductCard';
import { ProductGridSkeleton } from '../components/common/ProductCardSkeleton';
import HeroCarousel from '../components/common/HeroCarousel';

const categoryMetadata = {
  kitchen: {
    number: '01',
    name: 'Kitchen & Dining',
    desc: 'Cookware, utensils, storage essentials, and everyday kitchen accessories.',
  },
  cleaning: {
    number: '02',
    name: 'Cleaning & Hygiene',
    desc: 'Spin mops, multi-surface brushes, organizers, and home sanitizers.',
  },
  'baby-kids': {
    number: '03',
    name: 'Baby & Kids',
    desc: 'BPA-free feeding bottles, gentle silicon bibs, and play accessories.',
  },
  beauty: {
    number: '04',
    name: 'Beauty & Personal Care',
    desc: 'Skincare tools, grooming accessories, mirrors, and daily beauty essentials.',
  },
  'melamine-crockery': {
    number: '05',
    name: 'Melamine & Crockery',
    desc: 'Durable floral dinner sets, serving trays, plates, and bowls.',
  },
  toys: {
    number: '06',
    name: 'Toys & Games',
    desc: 'Engaging educational toys, building blocks, and family board games.',
  },
  'home-household': {
    number: '07',
    name: 'Home & Household',
    desc: 'Space-saving wardrobe organizers, multi-tier shoe racks, and decor.',
  },
  'womens-fashion': {
    number: '08',
    name: "Women's Fashion & Accessories",
    desc: 'Everyday jewelry, hair accessories, travel pouches, and lifestyle items.',
  },
};

const Home = () => {
  const { data: sampleProducts = [], isLoading: productsLoading } = useAllProducts();
  const { data: categoriesList = [], isLoading: categoriesLoading } = useCategories();

  const hotOffers = sampleProducts
    .filter(
      (p) =>
        p.collections?.hotOffer === true ||
        p.discount ||
        p.tag?.toLowerCase().includes('hot') ||
        p.tag?.toLowerCase().includes('deal')
    )
    .slice(0, 4);

  const bestSellers = sampleProducts
    .filter(
      (p) =>
        p.collections?.bestSelling === true ||
        p.tag?.toLowerCase().includes('best') ||
        p.tag?.toLowerCase().includes('popular') ||
        p.tag?.toLowerCase().includes('top')
    )
    .slice(0, 4);

  const newArrivals = sampleProducts
    .filter(
      (p) =>
        p.collections?.newArrival === true ||
        p.tag?.toLowerCase().includes('trending') ||
        p.tag?.toLowerCase().includes('essential') ||
        p.tag?.toLowerCase().includes('special')
    )
    .slice(0, 4);

  return (
    <div className="w-full pb-16 space-y-12">
      <h1 className="sr-only">
        Sarail 1 to 99 Plus Shop - Best Household, Kitchen &amp; Daily Deals in Bangladesh
      </h1>

      {/* 1. Hero Swiper Carousel Banner */}
      <section className="max-w-7xl mx-auto px-0 md:px-4 pt-0 md:pt-4" aria-label="Featured Promotions">
        <HeroCarousel />
      </section>

      {/* 2. Featured Categories (Redesigned per Section 06) */}
      <section className="max-w-7xl mx-auto px-4" aria-label="Featured Categories">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-[11px] font-bold text-[#e96542] uppercase tracking-wider block mb-1">
              Shop by category
            </span>
            <h2 className="text-xl md:text-2xl font-black text-charcoal">
              Find What You Need, All in One Place
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl">
              Explore our collections of everyday essentials, useful finds, and more. Something for every home, every need, and every budget.
            </p>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-primary hover:text-[#B80D18] inline-flex items-center gap-1 py-1 transition-colors self-start sm:self-auto shrink-0"
          >
            <span>View All Categories</span>
            <FaArrowRight className="text-[10px]" aria-hidden="true" />
          </Link>
        </div>

        {categoriesLoading ? (
          <div className="grid grid-cols-4 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-2 sm:p-5 min-h-[80px] sm:min-h-[160px] flex flex-col justify-between shadow-2xs"
              >
                <div className="space-y-1.5 sm:space-y-3">
                  <div className="hidden sm:block h-6 w-8 rounded yt-skeleton" />
                  <div className="h-3 sm:h-4 w-full sm:w-3/4 rounded yt-skeleton" />
                  <div className="hidden sm:block h-3 w-full rounded yt-skeleton" />
                </div>
                <div className="h-2.5 sm:h-4 w-2/3 sm:w-1/3 rounded yt-skeleton pt-1 sm:pt-3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
            {categoriesList.map((cat, idx) => {
              const meta = categoryMetadata[cat.id] || {
                number: String(idx + 1).padStart(2, '0'),
                name: cat.name,
                desc: 'Everyday household items and useful finds for the whole family.',
              };
              return (
                <Link
                  key={cat.id}
                  to={`/shop?category=${cat.id}`}
                  className="bg-white border border-gray-200 hover:border-primary/80 hover:shadow-md rounded-lg sm:rounded-xl p-2 sm:p-5 transition-all group flex flex-col justify-between min-h-[84px] sm:min-h-[164px] focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label={`${cat.name} category`}
                >
                  <div className="space-y-1 sm:space-y-2">
                    {/* Number hidden on mobile per Section 21.2 */}
                    <div className="hidden sm:block text-2xl font-black text-[#e96542]">
                      {meta.number}
                    </div>
                    {/* Multiline title on mobile with appropriate text scaling and wrapping */}
                    <h3 className="font-bold text-[10px] sm:text-base text-charcoal group-hover:text-primary transition-colors leading-tight sm:leading-snug break-words hyphens-auto">
                      {cat.name}
                    </h3>
                    {/* Description hidden on mobile per Section 21.2 */}
                    <p className="hidden sm:block text-xs text-slate-500 leading-relaxed line-clamp-3">
                      {meta.desc}
                    </p>
                  </div>

                  {/* Compact Browse action */}
                  <div className="pt-1.5 sm:pt-4 mt-1 sm:mt-3 border-t border-gray-100 flex items-center justify-between text-[10px] sm:text-xs font-bold text-primary group-hover:text-[#B80D18] transition-colors">
                    <span className="truncate">
                      Browse <span className="hidden sm:inline">Products</span>
                    </span>
                    <span aria-hidden="true" className="group-hover:translate-x-1 transition-transform ml-0.5 shrink-0">→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. Flash Sale & Hot Offers */}
      <section className="max-w-7xl mx-auto px-4 cv-auto">
        <div className="bg-gradient-to-r from-[#990B14] via-[#B80D18] to-[#C20E1A] text-white p-6 rounded-xl shadow-lg mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white text-[#990B14] flex items-center justify-center text-2xl shrink-0 shadow-md">
              <FaFire aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                FLASH SALE &amp; HOT DEALS
              </h2>
              <p className="text-xs text-white/95">
                Special limited-time discounts on kitchen appliances, melamine &amp; household organizers
              </p>
            </div>
          </div>

          <Link
            to="/hot-offers"
            className="bg-white hover:bg-gray-100 text-[#990B14] font-bold text-xs uppercase px-5 py-2.5 min-h-[40px] inline-flex items-center rounded-full shadow-md transition-all shrink-0"
          >
            Explore All Deals
          </Link>
        </div>

        {productsLoading ? (
          <ProductGridSkeleton
            count={4}
            columnsClass="grid-cols-2 sm:grid-cols-2 md:grid-cols-4"
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {hotOffers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Best Selling Products */}
      <section className="max-w-7xl mx-auto px-4 cv-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-charcoal">
              Best Selling Daily Needs
            </h2>
            <p className="text-xs text-slate-600">Most purchased cookware, cleaning tools &amp; baby accessories</p>
          </div>
          <Link
            to="/best-selling"
            className="text-xs font-bold text-primary hover:text-[#B80D18] inline-flex items-center gap-1 py-2 px-2 min-h-[36px] transition-colors"
          >
            <span>See More Best Sellers</span>
            <FaArrowRight className="text-[10px]" aria-hidden="true" />
          </Link>
        </div>

        {productsLoading ? (
          <ProductGridSkeleton
            count={4}
            columnsClass="grid-cols-2 sm:grid-cols-2 md:grid-cols-4"
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 5. Custom Product Request (Updated per Section 07) */}
      <section className="max-w-7xl mx-auto px-4 cv-auto" aria-label="Custom Product Assistance">
        <div className="bg-[#102338] text-white rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-700 shadow-md">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#e96542] block">
              Need something else?
            </span>
            <h2 className="text-2xl font-bold text-white">
              Looking for Something Special?
            </h2>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Can&apos;t find what you&apos;re looking for? Let us know what you need. We&apos;re always happy to help you explore available options and find the right products.
            </p>
          </div>

          <a
            href="https://wa.me/8801998789157?text=Hello%2C%20I%27m%20looking%20for%20a%20product%20and%20would%20like%20some%20assistance."
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase px-6 py-3 min-h-[44px] rounded-lg shadow-md transition-all flex items-center justify-center gap-2 shrink-0 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <FaWhatsapp className="text-base" aria-hidden="true" />
            <span>Contact Us</span>
          </a>
        </div>
      </section>

      {/* 6. New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 cv-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-charcoal">
              New Arrivals This Week
            </h2>
            <p className="text-xs text-slate-600">Fresh stock just unpacked at Sarail 1 to 99 Plus Shop</p>
          </div>
          <Link
            to="/new-arrivals"
            className="text-xs font-bold text-primary hover:text-[#B80D18] inline-flex items-center gap-1 py-2 px-2 min-h-[36px] transition-colors"
          >
            <span>View All New Arrivals</span>
            <FaArrowRight className="text-[10px]" aria-hidden="true" />
          </Link>
        </div>

        {productsLoading ? (
          <ProductGridSkeleton
            count={4}
            columnsClass="grid-cols-2 sm:grid-cols-2 md:grid-cols-4"
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
