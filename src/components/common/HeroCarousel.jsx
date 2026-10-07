import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaShoppingBag, FaUtensils, FaHeart } from 'react-icons/fa';
import deliveryBanner from '../../assets/delivery-banner.png';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const HeroCarousel = () => {
  const slides = [
    {
      id: 'delivery-slide',
      type: 'image-banner',
      image: deliveryBanner,
      alt: 'ঢাকা কিংবা সারাদেশ ডেলিভারি সেই স্পিডে',
      link: '/shop',
    },
    {
      id: 'kitchen-crockery',
      type: 'content-banner',
      bgColor: 'from-[#002B52] via-[#003D73] to-[#0A5296]',
      badge: 'Super Variety Offer',
      badgeIcon: FaUtensils,
      title: 'Kitchen & Crockery Festival',
      subtitle: 'Exclusive discounts on Melamine Dinner Sets, Non-stick Cookware, Spatulas & Household Utilities.',
      discount: 'Save Up to 35%',
      buttonText: 'Shop Kitchen Items',
      buttonLink: '/shop?category=kitchen',
      bgPattern: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&auto=format&fit=crop&q=80',
    },
    {
      id: 'home-cleaning',
      type: 'content-banner',
      bgColor: 'from-[#0F172A] via-[#1E293B] to-[#003D73]',
      badge: 'Sarail 1 to 99 Plus Shop',
      badgeIcon: FaShoppingBag,
      title: 'Home, Cleaning & Kids Toys',
      subtitle: 'Find everything for daily housekeeping, Spin Mops, Organizers, Baby Care & Educational Toys.',
      discount: 'Starting from ৳99',
      buttonText: 'Explore All Categories',
      buttonLink: '/shop',
      bgPattern: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&auto=format&fit=crop&q=80',
    },
    {
      id: 'womens-fashion',
      type: 'content-banner',
      bgColor: 'from-[#7A0C14] via-[#DE111E] to-[#B80D18]',
      badge: 'New Arrivals',
      badgeIcon: FaHeart,
      title: "Women's Fashion & Beauty Care",
      subtitle: 'Trending Party Handbags, Hair Accessories, Cosmetic Organizers & Personal Care Grooming sets.',
      discount: 'Special 20% Off',
      buttonText: 'View Collection',
      buttonLink: '/shop?category=womens-fashion',
      bgPattern: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="w-full relative hero-carousel-wrapper">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
          bulletActiveClass: 'swiper-pagination-bullet-active !bg-actionRed !w-6 !rounded-md',
        }}
        navigation={true}
        className="w-full rounded-none md:rounded-xl overflow-hidden shadow-md"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            {slide.type === 'image-banner' ? (
              /* Image-based banner matching the uploaded delivery speed banner */
              <Link to={slide.link} className="block w-full group relative overflow-hidden bg-white">
                <div className="w-full h-[220px] sm:h-[320px] md:h-[400px] lg:h-[430px] flex items-center justify-center bg-gray-50">
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    className="w-full h-full object-contain md:object-cover group-hover:scale-[1.01] transition-transform duration-500"
                  />
                </div>
              </Link>
            ) : (
              /* Rich styled promotional banner slide */
              <div
                className={`relative w-full h-[240px] sm:h-[320px] md:h-[400px] lg:h-[430px] bg-gradient-to-r ${slide.bgColor} text-white flex items-center overflow-hidden`}
              >
                {/* Background image overlay */}
                <div
                  className="absolute inset-0 opacity-15 mix-blend-overlay bg-cover bg-center pointer-events-none"
                  style={{ backgroundImage: `url(${slide.bgPattern})` }}
                />

                <div className="max-w-7xl mx-auto px-6 sm:px-12 w-full flex flex-col items-start justify-center relative z-10 space-y-3 sm:space-y-4">
                  
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xs text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-white/20">
                    <slide.badgeIcon className="text-amber-300 text-xs" />
                    <span>{slide.badge}</span>
                    <span className="bg-actionRed text-white text-[10px] px-2 py-0.5 rounded-full font-black">
                      {slide.discount}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight max-w-2xl">
                    {slide.title}
                  </h2>

                  {/* Subtitle */}
                  <p className="text-xs sm:text-sm md:text-base text-gray-100 max-w-lg line-clamp-2 sm:line-clamp-3 leading-relaxed">
                    {slide.subtitle}
                  </p>

                  {/* CTA Button */}
                  <div className="pt-2">
                    <Link
                      to={slide.buttonLink}
                      className="inline-flex items-center gap-2 bg-actionRed hover:bg-actionRed-hover text-white font-bold text-xs sm:text-sm px-6 py-2.5 sm:py-3 rounded-md shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <span>{slide.buttonText}</span>
                      <FaArrowRight className="text-xs" />
                    </Link>
                  </div>

                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroCarousel;
