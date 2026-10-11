import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, A11y } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaShoppingBag, FaUtensils, FaHeart } from 'react-icons/fa';
import deliveryBanner from '../../assets/delivery-banner.webp';

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
      alt: 'Fast nationwide delivery across Dhaka and all of Bangladesh - Sarail 1 to 99 Plus Shop',
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
    },
    {
      id: 'womens-fashion',
      type: 'content-banner',
      bgColor: 'from-[#68080F] via-[#990B14] to-[#7A0C14]',
      badge: 'New Arrivals',
      badgeIcon: FaHeart,
      title: "Women's Fashion & Beauty Care",
      subtitle: 'Trending Party Handbags, Hair Accessories, Cosmetic Organizers & Personal Care Grooming sets.',
      discount: 'Special 20% Off',
      buttonText: 'View Collection',
      buttonLink: '/shop?category=womens-fashion',
    },
  ];

  return (
    <div className="w-full relative hero-carousel-wrapper">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, A11y]}
        spaceBetween={0}
        slidesPerView={1}
        loop={false}
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
          bulletActiveClass: 'swiper-pagination-bullet-active !bg-[#B80D18] !w-6 !rounded-md',
        }}
        navigation={true}
        a11y={{
          enabled: true,
          prevSlideMessage: 'Previous promotional banner',
          nextSlideMessage: 'Next promotional banner',
          firstSlideMessage: 'This is the first banner',
          lastSlideMessage: 'This is the last banner',
          paginationBulletMessage: 'Go to banner {{index}}',
        }}
        className="w-full rounded-none md:rounded-xl overflow-hidden shadow-md"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            {slide.type === 'image-banner' ? (
              /* Image-based banner (Primary LCP Element) */
              <Link
                to={slide.link}
                aria-label={slide.alt}
                className="block w-full group relative overflow-hidden bg-white"
              >
                <div className="w-full h-[220px] sm:h-[320px] md:h-[400px] lg:h-[430px] flex items-center justify-center bg-gray-50">
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    width="1024"
                    height="333"
                    fetchPriority="high"
                    loading="eager"
                    decoding="sync"
                    className="w-full h-full object-contain md:object-cover group-hover:scale-[1.01] transition-transform duration-500"
                  />
                </div>
              </Link>
            ) : (
              /* Rich styled promotional banner slide */
              <div
                className={`relative w-full h-[240px] sm:h-[320px] md:h-[400px] lg:h-[430px] bg-gradient-to-r ${slide.bgColor} text-white flex items-center overflow-hidden`}
              >
                <div className="max-w-7xl mx-auto px-6 sm:px-12 w-full flex flex-col items-start justify-center relative z-10 space-y-3 sm:space-y-4">
                  
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-xs text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-white/25">
                    <slide.badgeIcon className="text-amber-300 text-xs" aria-hidden="true" />
                    <span>{slide.badge}</span>
                    <span className="bg-[#990B14] text-white text-[10px] px-2 py-0.5 rounded-full font-black border border-white/20">
                      {slide.discount}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight max-w-2xl">
                    {slide.title}
                  </h2>

                  {/* Subtitle */}
                  <p className="text-xs sm:text-sm md:text-base text-white max-w-lg line-clamp-2 sm:line-clamp-3 leading-relaxed">
                    {slide.subtitle}
                  </p>

                  {/* CTA Button */}
                  <div className="pt-2">
                    <Link
                      to={slide.buttonLink}
                      className="inline-flex items-center gap-2 bg-[#B80D18] hover:bg-[#990B14] text-white font-bold text-xs sm:text-sm px-6 py-2.5 sm:py-3 rounded-md shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <span>{slide.buttonText}</span>
                      <FaArrowRight className="text-xs" aria-hidden="true" />
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
