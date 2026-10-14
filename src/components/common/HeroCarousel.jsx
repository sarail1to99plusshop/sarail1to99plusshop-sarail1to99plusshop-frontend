import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import carusel1 from '../../assets/carusel1.webp';
import carusel2 from '../../assets/carusel2.webp';
import carusel3 from '../../assets/carusel3.webp';
import carusel4 from '../../assets/carusel4.webp';

const slides = [
  {
    id: 'carousel-slide-1',
    image: carusel3,
    srcSet:
      '/banners/carusel3-640.webp 640w, /banners/carusel3-1024.webp 1024w, /banners/carusel3-1920.webp 1920w',
    alt: 'দৈনন্দিন জিনিস, পছন্দসই দামে - Sarail 1 to 99 Plus Shop',
    link: '/shop',
  },
  {
    id: 'carousel-slide-2',
    image: carusel4,
    srcSet:
      '/banners/carusel4-640.webp 640w, /banners/carusel4-1024.webp 1024w, /banners/carusel4-1920.webp 1920w',
    alt: 'যা দরকার, সবই এখন এক শপে - Sarail 1 to 99 Plus Shop',
    link: '/shop',
  },
  {
    id: 'carousel-slide-3',
    image: carusel1,
    srcSet:
      '/banners/carusel1-640.webp 640w, /banners/carusel1-1024.webp 1024w, /banners/carusel1-1920.webp 1920w',
    alt: 'স্বাগতম প্রয়োজনীয় পণ্যের সেরা ঠিকানায়! - Sarail 1 to 99 Plus Shop',
    link: '/shop',
  },
  {
    id: 'carousel-slide-4',
    image: carusel2,
    srcSet:
      '/banners/carusel2-640.webp 640w, /banners/carusel2-1024.webp 1024w, /banners/carusel2-1920.webp 1920w',
    alt: 'দেশজুড়ে সহজ অর্ডার, নির্ভরযোগ্য ডেলিভারি - Sarail 1 to 99 Plus Shop',
    link: '/shop',
  },
];

const HeroCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);

  const handleGoToSlide = (index, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveIndex(index);
  };

  useEffect(() => {
    // Respect user's reduced-motion preference
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isPaused || prefersReducedMotion) return undefined;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

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
      <div className="w-full rounded-none md:rounded-xl overflow-hidden shadow-md relative bg-slate-100">
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
                <Link
                  to={slide.link}
                  tabIndex={isCurrent ? 0 : -1}
                  aria-label={slide.alt}
                  className="block w-full relative overflow-hidden"
                >
                  <img
                    src={slide.image}
                    srcSet={slide.srcSet}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1280px"
                    alt={slide.alt}
                    width="3264"
                    height="1312"
                    fetchPriority={index === 0 ? 'high' : 'auto'}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding={index === 0 ? 'sync' : 'async'}
                    className="w-full h-auto aspect-[3264/1312] object-cover transition-transform duration-500"
                  />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Subtle, non-intrusive safe-zone pagination dots */}
        <div
          className="absolute bottom-1 sm:bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/20 backdrop-blur-xs pointer-events-auto"
          role="tablist"
          aria-label="Banner slide indicators"
        >
          {slides.map((slide, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to slide ${idx + 1}`}
                onClick={(e) => handleGoToSlide(idx, e)}
                className="p-1 flex items-center justify-center cursor-pointer focus:outline-none"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'w-4 bg-[#e96542]'
                      : 'w-1.5 bg-white/70 hover:bg-white'
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
