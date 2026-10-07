import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { sampleProducts, categoriesList } from '../data/mockData';
import ProductCard from '../components/common/ProductCard';
import { FiFilter, FiSearch } from 'react-icons/fi';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('featured');

  const filteredProducts = useMemo(() => {
    return sampleProducts
      .filter((product) => {
        const matchesCategory =
          selectedCategory === 'all' || product.category === selectedCategory;
        const matchesSearch =
          searchTerm === '' ||
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        return 0;
      });
  }, [selectedCategory, searchTerm, sortBy]);

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    if (catId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catId);
    }
    setSearchParams(searchParams);
  };

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
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                All Products ({sampleProducts.length})
              </button>

              {categoriesList.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`w-full text-left px-3 py-2 rounded-md font-medium flex items-center justify-between transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] opacity-75">{cat.count}</span>
                </button>
              ))}
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
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter by keyword..."
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

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-lg border border-gray-200">
              <p className="text-gray-500 text-sm">No products matched your criteria.</p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchTerm('');
                }}
                className="mt-3 bg-actionRed text-white text-xs px-4 py-2 rounded-md font-semibold"
              >
                Reset Filters
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default Shop;

