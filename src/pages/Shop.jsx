import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { sampleProducts, categoriesList } from '../data/mockData';
import ProductCard from '../components/common/ProductCard';
import { FiFilter, FiSearch, FiTag, FiX } from 'react-icons/fi';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'all';
  const selectedTag = searchParams.get('tag') || 'all';
  const searchTerm = searchParams.get('search') || '';
  const [sortBy, setSortBy] = useState('featured');

  // Extract all unique product tags
  const tagList = useMemo(() => {
    const tags = new Set();
    sampleProducts.forEach((p) => {
      if (p.tag) {
        tags.add(p.tag);
      }
    });
    return Array.from(tags);
  }, []);

  const filteredProducts = useMemo(() => {
    return sampleProducts
      .filter((product) => {
        // Category matching (handles both slug and text formats)
        const matchesCategory =
          selectedCategory === 'all' ||
          product.category === selectedCategory ||
          product.category?.toLowerCase().replace(/[\s&]+/g, '-') ===
            selectedCategory.toLowerCase().replace(/[\s&]+/g, '-');

        // Tag matching
        const matchesTag =
          selectedTag === 'all' ||
          (product.tag &&
            product.tag.toLowerCase() === selectedTag.toLowerCase());

        // Search matching (searches name, category, and tag)
        const matchesSearch =
          searchTerm === '' ||
          product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.tag?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesCategory && matchesTag && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        return 0;
      });
  }, [selectedCategory, selectedTag, searchTerm, sortBy]);

  const handleCategoryChange = (catId) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (catId === 'all') {
        next.delete('category');
      } else {
        next.set('category', catId);
      }
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
        return next;
      },
      { replace: true }
    );
  };

  const handleClearSearch = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('search');
      return next;
    });
  };

  const handleResetFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters =
    selectedCategory !== 'all' || selectedTag !== 'all' || searchTerm !== '';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Page Title & Breadcrumb */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-black text-charcoal">
          Shop All Products
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Showing {filteredProducts.length} authentic household, kitchenware & lifestyle items
        </p>
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
        <div className="flex-1 space-y-4">
          
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
              <label htmlFor="shop-sort-dropdown" className="text-xs text-gray-500 font-medium whitespace-nowrap">Sort By:</label>
              <select
                id="shop-sort-dropdown"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
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

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-lg border border-gray-200 space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-xl">
                <FiTag />
              </div>
              <h4 className="font-bold text-charcoal text-base">No Products Found</h4>
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

