// YouTube-style Shimmer Shadow Skeleton Loaders for Products, Categories, Details & Orders

export const ProductCardSkeleton = () => {
  return (
    <div
      className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-2xs flex flex-col h-full select-none"
      aria-hidden="true"
    >
      {/* Square Thumbnail Shadow Box */}
      <div className="relative aspect-square w-full bg-slate-100 border-b border-slate-100 overflow-hidden">
        <div className="w-full h-full yt-skeleton" />
        {/* Badge placeholders */}
        <div className="absolute top-2 left-2 w-11 h-4 rounded bg-white/70" />
        <div className="absolute top-2 right-2 w-16 h-4 rounded bg-white/70" />
      </div>

      {/* Card Body Placeholders */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1 justify-between gap-2.5 sm:gap-3">
        <div className="space-y-2">
          {/* Two-line title bar */}
          <div className="h-3.5 sm:h-4 w-11/12 rounded-md yt-skeleton" />
          <div className="h-3.5 sm:h-4 w-3/4 rounded-md yt-skeleton" />

          {/* Star rating & review count bar */}
          <div className="flex items-center gap-1.5 pt-1">
            <div className="h-3 w-20 rounded yt-skeleton" />
            <div className="h-3 w-8 rounded yt-skeleton" />
          </div>

          {/* Price bar */}
          <div className="flex items-center gap-2 pt-1">
            <div className="h-5 w-16 rounded-md yt-skeleton" />
            <div className="h-3.5 w-12 rounded-md yt-skeleton" />
          </div>
        </div>

        {/* Dual Action Buttons (Cart + Buy Now) */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 pt-1">
          <div className="h-7 sm:h-8 rounded-lg yt-skeleton" />
          <div className="h-7 sm:h-8 rounded-lg yt-skeleton" />
        </div>
      </div>
    </div>
  );
};

export const ProductGridSkeleton = ({
  count = 8,
  columnsClass = 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
}) => {
  return (
    <div className={`grid ${columnsClass} gap-3 sm:gap-4`}>
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
};

export const CategoryCardSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3.5 shadow-2xs"
          aria-hidden="true"
        >
          <div className="w-12 h-12 rounded-lg yt-skeleton shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-3/4 rounded yt-skeleton" />
            <div className="h-2.5 w-1/2 rounded yt-skeleton" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const ProductDetailsSkeleton = () => {
  return (
    <div className="bg-[#F8FAFC] min-h-screen py-4 md:py-8 font-sans" aria-hidden="true">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Breadcrumb Skeleton */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            <div className="h-4 w-14 rounded yt-skeleton" />
            <div className="h-4 w-24 rounded yt-skeleton" />
            <div className="h-4 w-44 rounded yt-skeleton" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-20 rounded yt-skeleton" />
          </div>
        </div>

        {/* Main Two-Column Product Card Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Gallery Skeleton */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between shadow-2xs">
            <div className="flex flex-col sm:flex-row gap-5 items-center my-auto">
              <div className="flex sm:flex-col gap-3.5 order-2 sm:order-1 shrink-0">
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl yt-skeleton" />
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl yt-skeleton" />
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl yt-skeleton" />
              </div>
              <div className="flex-1 w-full order-1 sm:order-2">
                <div className="w-full h-72 sm:h-96 rounded-xl yt-skeleton" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-center">
              <div className="h-5 w-32 rounded yt-skeleton" />
            </div>
          </div>

          {/* Right Info Skeleton */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 flex flex-col justify-between shadow-2xs space-y-5">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-6 w-24 rounded-lg yt-skeleton" />
                <div className="h-6 w-20 rounded-lg yt-skeleton" />
              </div>
              <div className="space-y-2">
                <div className="h-6 w-11/12 rounded-md yt-skeleton" />
                <div className="h-6 w-2/3 rounded-md yt-skeleton" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-28 rounded yt-skeleton" />
                <div className="h-4 w-32 rounded yt-skeleton" />
              </div>
              <div className="flex items-center gap-3 pt-1">
                <div className="h-8 w-28 rounded-md yt-skeleton" />
                <div className="h-5 w-16 rounded-md yt-skeleton" />
              </div>
              <div className="h-6 w-28 rounded-full yt-skeleton" />
              <div className="flex items-center gap-3 pt-2">
                <div className="h-4 w-12 rounded yt-skeleton" />
                <div className="w-7 h-7 rounded-full yt-skeleton" />
                <div className="w-7 h-7 rounded-full yt-skeleton" />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <div className="h-11 w-28 rounded-xl yt-skeleton" />
                <div className="h-11 flex-1 rounded-xl yt-skeleton" />
                <div className="h-11 flex-1 rounded-xl yt-skeleton" />
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="h-11 w-full rounded-xl yt-skeleton" />
              <div className="h-16 w-full rounded-xl yt-skeleton" />
            </div>
          </div>
        </div>

        {/* Description / Reviews Tab Skeleton */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-4">
          <div className="h-5 w-48 rounded yt-skeleton" />
          <div className="h-3.5 w-full rounded yt-skeleton" />
          <div className="h-3.5 w-11/12 rounded yt-skeleton" />
          <div className="h-3.5 w-4/5 rounded yt-skeleton" />
        </div>
      </div>
    </div>
  );
};

export const OrderCardSkeleton = ({ count = 2 }) => {
  return (
    <div className="space-y-4" aria-hidden="true">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-2xs"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="space-y-1.5">
              <div className="h-4 w-36 rounded yt-skeleton" />
              <div className="h-3 w-28 rounded yt-skeleton" />
            </div>
            <div className="h-6 w-20 rounded-full yt-skeleton" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg yt-skeleton shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-2/3 rounded yt-skeleton" />
              <div className="h-3 w-1/3 rounded yt-skeleton" />
            </div>
            <div className="h-4 w-16 rounded yt-skeleton" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductCardSkeleton;

