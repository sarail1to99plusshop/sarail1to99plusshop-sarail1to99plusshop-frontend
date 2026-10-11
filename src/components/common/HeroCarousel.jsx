import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FaArrowRight,
  FaShoppingBag,
  FaUtensils,
  FaHeart,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';

const slides = [
  {
    id: 'delivery-slide',
    type: 'image-banner',
    image: '/banners/delivery-banner-1024.webp',
    srcSet:
      '/banners/delivery-banner-640.webp 640w, /banners/delivery-banner-768.webp 768w, /banners/delivery-banner-1024.webp 1024w',
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1024px',
    alt: 'Fast nationwide delivery across Dhaka and all of Bangladesh - Sarail 1 to 99 Plus Shop',
    link: '/',
  },
  {
    id: 'kitchen-crockery',
    type: 'content-banner',
    bgColor: 'from-[#002B52] via-[#003D73] to-[#0A5296]',
    badge: 'Super Variety Offer',
    badgeIcon: FaUtensils,
    title: 'Kitchen & Crockery Festival',
    subtitle:
      'Exclusive discounts on Melamine Dinner Sets, Non-stick Cookware, Spatulas & Household Utilities.',
    discount: 'Save Up to 35%',
    buttonText: 'Shop Kitchen Items',
    buttonLink: '/',
  },
  {
    id: 'home-cleaning',
    type: 'content-banner',
    bgColor: 'from-[#0F172A] via-[#1E293B] to-[#003D73]',
    badge: 'Sarail 1 to 99 Plus Shop',
    badgeIcon: FaShoppingBag,
    title: 'Home, Cleaning & Kids Toys',
    subtitle:
      'Find everything for daily housekeeping, Spin Mops, Organizers, Baby Care & Educational Toys.',
    discount: 'Starting from ৳99',
    buttonText: 'Explore All Categories',
    buttonLink: '/',
  },
  {
    id: 'womens-fashion',
    type: 'content-banner',
    bgColor: 'from-[#68080F] via-[#990B14] to-[#7A0C14]',
    badge: 'New Arrivals',
    badgeIcon: FaHeart,
    title: "Women's Fashion & Beauty Care",
    subtitle:
      'Trending Party Handbags, Hair Accessories, Cosmetic Organizers & Personal Care Grooming sets.',
    discount: 'Special 20% Off',
    buttonText: 'View Collection',
    buttonLink: '/',
  },
];

const HeroCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);

  const handleNext = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveIndex((prev) => (prev + 1) % slides.length);
  }, []);

  const handlePrev = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const handleGoToSlide = (index, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveIndex(index);
  };

  useEffect(() => {
    if (isPaused) return undefined;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const diff = touchStartX.current - endX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        setActiveIndex((prev) => (prev + 1) % slides.length);
      } else {
        setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
      }
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="w-full relative select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      role="region"
      aria-roledescription="carousel"
      aria-label="Promotional Banners"
    >
      <div className="w-full rounded-none md:rounded-xl overflow-hidden shadow-md relative bg-white">
        {/* GPU-composited slide track (zero forced reflow) */}
        <div
          className="flex transition-transform duration-500 ease-out will-change-transform"
          style={{ transform: `translate3d(-${activeIndex * 100}%, 0, 0)` }}
        >
          {slides.map((slide, index) => {
            const isCurrent = index === activeIndex;
            return (
              <div
                key={slide.id}
                className="w-full shrink-0"
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${slides.length}`}
                aria-hidden={!isCurrent}
              >
                {slide.type === 'image-banner' ? (
                  /* Image-based banner (Primary LCP Element) */
                  <Link
                    to={slide.link}
                    tabIndex={isCurrent ? 0 : -1}
                    aria-label={slide.alt}
                    className="block w-full group relative overflow-hidden bg-white"
                  >
                    <div className="w-full h-[220px] sm:h-[320px] md:h-[400px] lg:h-[430px] flex items-center justify-center bg-gray-50">
                      <img
                        src={slide.image}
                        srcSet={slide.srcSet}
                        sizes={slide.sizes}
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
                    className={`relative w-full h-[220px] sm:h-[320px] md:h-[400px] lg:h-[430px] bg-gradient-to-r ${slide.bgColor} text-white flex items-center overflow-hidden`}
                  >
                    <div className="max-w-7xl mx-auto px-14 sm:px-16 w-full flex flex-col items-start justify-center relative z-10 space-y-2.5 sm:space-y-4">
                      {/* Badge */}
                      <div className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-xs text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-white/25">
                        <slide.badgeIcon
                          className="text-amber-300 text-xs"
                          aria-hidden="true"
                        />
                        <span>{slide.badge}</span>
                        <span className="bg-[#990B14] text-white text-[10px] px-2 py-0.5 rounded-full font-black border border-white/20">
                          {slide.discount}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight max-w-2xl">
                        {slide.title}
                      </h2>

                      {/* Subtitle */}
                      <p className="text-xs sm:text-sm md:text-base text-white max-w-lg line-clamp-2 sm:line-clamp-3 leading-relaxed">
                        {slide.subtitle}
                      </p>

                      {/* CTA Button */}
                      <div className="pt-1 sm:pt-2">
                        <Link
                          to={slide.buttonLink}
                          tabIndex={isCurrent ? 0 : -1}
                          className="inline-flex items-center gap-2 bg-[#B80D18] hover:bg-[#990B14] text-white font-bold text-xs sm:text-sm px-5 py-2.5 sm:px-6 sm:py-3 min-h-[44px] rounded-md shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                          <span>{slide.buttonText}</span>
                          <FaArrowRight className="text-xs" aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Previous Slide Button (Never disabled — wraps around & stops propagation so it never clicks through to /shop) */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous promotional banner"
          className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-900/75 hover:bg-slate-900 text-white flex items-center justify-center shadow-md transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-white"
        >
          <FaChevronLeft className="text-sm" aria-hidden="true" />
        </button>

        {/* Next Slide Button */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next promotional banner"
          className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-900/75 hover:bg-slate-900 text-white flex items-center justify-center shadow-md transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-white"
        >
          <FaChevronRight className="text-sm" aria-hidden="true" />
        </button>

        {/* Accessible 44x44px Touch-Target Pagination Dots */}
        <div
          className="absolute bottom-1 left-1/2 -translate-x-1/2 z-20 flex items-center"
          role="tablist"
          aria-label="Choose banner slide"
        >
          {slides.map((slide, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to banner ${idx + 1}`}
                onClick={(e) => handleGoToSlide(idx, e)}
                className="w-11 h-11 flex items-center justify-center cursor-pointer focus:outline-none"
              >
                <span
                  className={`block h-2.5 rounded-full transition-all duration-300 shadow-xs ${
                    isActive
                      ? 'w-6 bg-[#B80D18] ring-1 ring-white/80'
                      : 'w-2.5 bg-slate-900/65 hover:bg-slate-900/90 ring-1 ring-white/70'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;
