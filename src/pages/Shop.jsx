import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/common/ProductCard';
import {
  usePaginatedProducts,
  useCategories,
} from '../hooks/useQueries';
import {
  FiFilter,
  FiSearch,
  FiTag,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';

const PRODUCTS_PER_PAGE = 10;

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'all';
  const selectedTag = searchParams.get('tag') || 'all';
  const searchTerm = searchParams.get('search') || '';
  const currentPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const [sortBy, setSortBy] = useState('featured');

  // Fetch categories via TanStack Query
  const { data: categoriesList = [] } = useCategories();

  // Fetch paginated products (10 per page) via TanStack Query
  const { data, isLoading, isFetching } = usePaginatedProducts({
    page: currentPage,
    limit: PRODUCTS_PER_PAGE,
    category: selectedCategory,
    tag: selectedTag,
    search: searchTerm,
    sort: sortBy,
  });

  const paginatedProducts = data?.products || [];
  const tagList = data?.tags || [];
  const pagination = data?.pagination || {
    totalProducts: paginatedProducts.length,
    totalPages: 1,
    currentPage: 1,
    limit: PRODUCTS_PER_PAGE,
    hasNextPage: false,
    hasPrevPage: false,
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (newPage === 1) {
        next.delete('page');
      } else {
        next.set('page', String(newPage));
      }
      return next;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (catId) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (catId === 'all') {
        next.delete('category');
      } else {
        next.set('category', catId);
      }
      next.delete('page'); // Reset to page 1 on filter change
      return next;
    });
  };

  const handleTagChange = (tagName) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (tagName === 'all') {
        next.delete('tag');
      } else {
        next.set('tag', tagName);
      }
      next.delete('page'); // Reset to page 1 on filter change
      return next;
    });
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (!val) {
          next.delete('search');
        } else {
          next.set('search', val);
        }
        next.delete('page'); // Reset to page 1 on search
        return next;
      },
      { replace: true }
    );
  };

  const handleClearSearch = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('search');
      next.delete('page');
      return next;
    });
  };

  const handleResetFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters =
    selectedCategory !== 'all' || selectedTag !== 'all' || searchTerm !== '';

  const startItem =
    pagination.totalProducts === 0
      ? 0
      : (pagination.currentPage - 1) * PRODUCTS_PER_PAGE + 1;
  const endItem = Math.min(
    pagination.currentPage * PRODUCTS_PER_PAGE,
    pagination.totalProducts
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Title & Breadcrumb */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-charcoal">
            Shop All Products
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Showing {startItem}–{endItem} of {pagination.totalProducts} authentic household, kitchenware &amp; lifestyle items
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full self-start sm:self-auto">
          Page {pagination.currentPage} of {pagination.totalPages} ({PRODUCTS_PER_PAGE} per page)
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar Filter */}
        <aside className="w-full lg:w-64 shrink-0 space-y-6">
          {/* Categories Card */}
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-2xs">
            <h3 className="font-bold text-sm text-charcoal flex items-center gap-2 mb-4">
              <FiFilter className="text-actionRed" />
              <span>Categories</span>
            </h3>

            <div className="space-y-1.5 text-xs">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`w-full text-left px-3 py-2 rounded-md font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-primary text-white font-bold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                All Categories
              </button>

              {categoriesList.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`w-full text-left px-3 py-2 rounded-md font-medium transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-primary text-white font-bold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Product Tags Card */}
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-2xs">
            <h3 className="font-bold text-sm text-charcoal flex items-center gap-2 mb-4">
              <FiTag className="text-actionRed" />
              <span>Popular Tags</span>
            </h3>

            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => handleTagChange('all')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                  selectedTag === 'all'
                    ? 'bg-actionRed text-white shadow-2xs'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                All Tags
              </button>

              {tagList.map((tag) => {
                const isSelected =
                  selectedTag.toLowerCase() === tag.toLowerCase();
                return (
                  <button
                    key={tag}
                    onClick={() => handleTagChange(tag)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-actionRed text-white shadow-2xs'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Right Product Grid */}
        <div className="flex-1 space-y-6">
          {/* Controls Bar: Search & Sort */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search name, category, or tag..."
                className="w-full bg-gray-50 border border-gray-200 text-xs text-charcoal px-3 py-2 pl-8 rounded-md outline-none focus:border-primary"
              />
              <FiSearch className="absolute left-2.5 top-2.5 text-gray-400 text-xs" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <label
                htmlFor="shop-sort-dropdown"
                className="text-xs text-gray-500 font-medium whitespace-nowrap"
              >
                Sort By:
              </label>
              <select
                id="shop-sort-dropdown"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  handlePageChange(1);
                }}
                className="bg-gray-50 border border-gray-200 text-xs text-charcoal px-3 py-2 rounded-md outline-none font-medium cursor-pointer"
              >
                <option value="featured">Featured / Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Active Filter Badges Strip */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="font-bold text-gray-500 text-[11px] uppercase tracking-wider">
                Active Filters:
              </span>

              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-white border border-gray-300 text-primary px-2 py-0.5 rounded text-xs font-semibold">
                  <span>Category: {selectedCategory.replace(/-/g, ' ')}</span>
                  <button
                    onClick={() => handleCategoryChange('all')}
                    className="hover:text-actionRed"
                    aria-label="Clear category filter"
                  >
                    <FiX className="text-xs" />
                  </button>
                </span>
              )}

              {selectedTag !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-actionRed/10 border border-actionRed/30 text-actionRed px-2 py-0.5 rounded text-xs font-semibold">
                  <FiTag className="text-[10px]" />
                  <span>Tag: {selectedTag}</span>
                  <button
                    onClick={() => handleTagChange('all')}
                    className="hover:text-black"
                    aria-label="Clear tag filter"
                  >
                    <FiX className="text-xs" />
                  </button>
                </span>
              )}

              {searchTerm && (
                <span className="inline-flex items-center gap-1 bg-white border border-gray-300 text-slate-700 px-2 py-0.5 rounded text-xs font-semibold">
                  <span>Query: &quot;{searchTerm}&quot;</span>
                  <button
                    onClick={handleClearSearch}
                    className="hover:text-actionRed"
                    aria-label="Clear search query"
                  >
                    <FiX className="text-xs" />
                  </button>
                </span>
              )}

              <button
                onClick={handleResetFilters}
                className="text-[11px] font-bold text-actionRed hover:underline ml-auto"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Product Grid (10 products per page) */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {[...Array(6)].map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-slate-200 p-4 h-72 animate-pulse flex flex-col justify-between"
                >
                  <div className="bg-slate-100 rounded-lg h-40 w-full" />
                  <div className="space-y-2">
                    <div className="bg-slate-100 h-4 w-3/4 rounded" />
                    <div className="bg-slate-100 h-4 w-1/2 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : paginatedProducts.length > 0 ? (
            <>
              <div
                className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 transition-opacity duration-200 ${
                  isFetching ? 'opacity-80' : 'opacity-100'
                }`}
              >
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination Controls (10 Products Per Page) */}
              {pagination.totalPages > 1 && (
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                  <span className="text-xs text-gray-500 font-medium">
                    Showing{' '}
                    <strong className="text-charcoal">{startItem}</strong> to{' '}
                    <strong className="text-charcoal">{endItem}</strong> of{' '}
                    <strong className="text-charcoal">
                      {pagination.totalProducts}
                    </strong>{' '}
                    products
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrevPage}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-charcoal disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                    >
                      <FiChevronLeft className="text-sm" />
                      <span>Prev</span>
                    </button>

                    {Array.from(
                      { length: pagination.totalPages },
                      (_, idx) => idx + 1
                    ).map((pageNum) => {
                      const isActive = pageNum === pagination.currentPage;
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-9 h-9 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                            isActive
                              ? 'bg-primary text-white shadow-sm scale-105'
                              : 'bg-gray-50 hover:bg-gray-100 text-charcoal border border-gray-200'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-charcoal disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                    >
                      <span>Next</span>
                      <FiChevronRight className="text-sm" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white p-12 text-center rounded-lg border border-gray-200 space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-xl">
                <FiTag />
              </div>
              <h4 className="font-bold text-charcoal text-base">
                No Products Found
              </h4>
              <p className="text-gray-500 text-xs max-w-sm mx-auto">
                No items matched your selected filter criteria. Try choosing another category or tag.
              </p>
              <button
                onClick={handleResetFilters}
                className="bg-actionRed hover:bg-actionRed-hover text-white text-xs font-bold px-4 py-2 rounded-md transition-colors shadow-2xs"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
