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
  const [isInteracting, setIsInteracting] = useState(false);
  const [isDraggingActive, setIsDraggingActive] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const isPointerDown = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const hasDraggedFar = useRef(false);
  const containerRef = useRef(null);

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

    if (isPaused || isInteracting || prefersReducedMotion) return undefined;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, isInteracting]);

  const handlePointerDown = (e) => {
    // Only handle primary button for mouse (button === 0)
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    isPointerDown.current = true;
    startX.current = e.clientX;
    startY.current = e.clientY;
    hasDraggedFar.current = false;
    setIsInteracting(true);
  };

  const handlePointerMove = (e) => {
    if (!isPointerDown.current) return;

    const diffX = e.clientX - startX.current;
    const diffY = e.clientY - startY.current;

    // Check if user is scrolling vertically on touch/trackpad
    if (!hasDraggedFar.current && Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 10) {
      isPointerDown.current = false;
      setIsInteracting(false);
      setIsDraggingActive(false);
      setDragOffset(0);
      return;
    }

    if (Math.abs(diffX) > 8) {
      hasDraggedFar.current = true;
      setIsDraggingActive(true);
      setDragOffset(diffX);
    }
  };

  const handlePointerUpOrCancel = () => {
    if (!isPointerDown.current) return;

    isPointerDown.current = false;
    setIsDraggingActive(false);
    const finalDiff = dragOffset;
    setDragOffset(0);

    // Movement threshold (35–55px per V1.1 specification)
    const threshold = 40;
    if (Math.abs(finalDiff) >= threshold) {
      if (finalDiff < 0) {
        // Dragged left -> advance to next slide
        setActiveIndex((prev) => (prev + 1) % slides.length);
      } else {
        // Dragged right -> go to previous slide
        setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
      }
    }

    // Brief timeout so click event on link can check hasDraggedFar before resetting
    setTimeout(() => {
      hasDraggedFar.current = false;
      setIsInteracting(false);
    }, 150);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`w-full relative select-none touch-pan-y ${
        isDraggingActive ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUpOrCancel}
      onPointerCancel={handlePointerUpOrCancel}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Promotional Banners (Use Left/Right arrow keys or drag horizontally to change slides)"
    >
      <div className="w-full rounded-none md:rounded-xl overflow-hidden shadow-md relative bg-slate-100">
        {/* GPU-composited slide track with smooth drag feedback */}
        <div
          className={`flex will-change-transform ${
            isDraggingActive ? 'transition-none' : 'transition-transform duration-500 ease-out'
          }`}
          style={{
            transform: isDraggingActive
              ? `translate3d(calc(-${activeIndex * 100}% + ${dragOffset}px), 0, 0)`
              : `translate3d(-${activeIndex * 100}%, 0, 0)`,
          }}
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
                  onClick={(e) => {
                    // Prevent navigation if the user was dragging the slide
                    if (hasDraggedFar.current) {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                  className="block w-full relative overflow-hidden"
                >
                  <img
                    src={slide.image}
                    srcSet={slide.srcSet}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1280px"
                    alt={slide.alt}
                    width="3264"
                    height="1312"
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                    fetchPriority={index === 0 ? 'high' : 'auto'}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding={index === 0 ? 'sync' : 'async'}
                    className="w-full h-auto aspect-[3264/1312] object-cover transition-transform duration-500 pointer-events-none"
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
