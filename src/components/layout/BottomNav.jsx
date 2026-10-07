import { useState, useRef, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FiMenu, FiChevronDown } from 'react-icons/fi';
import { FaFire } from 'react-icons/fa';

const categories = [
  { name: 'Kitchen & Dining', path: '/shop?category=kitchen' },
  { name: 'Cleaning & Hygiene', path: '/shop?category=cleaning' },
  { name: 'Baby & Kids', path: '/shop?category=baby-kids' },
  { name: 'Beauty & Personal Care', path: '/shop?category=beauty' },
  { name: 'Melamine & Crockery', path: '/shop?category=melamine-crockery' },
  { name: 'Toys & Games', path: '/shop?category=toys' },
  { name: 'Home & Household', path: '/shop?category=home-household' },
  { name: "Women's Fashion & Accessories", path: '/shop?category=womens-fashion' },
];

const BottomNav = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItemClass = ({ isActive }) =>
    `font-semibold text-xs tracking-wider uppercase px-2.5 py-2.5 transition-colors duration-150 ${
      isActive
        ? 'text-actionRed font-bold'
        : 'text-charcoal hover:text-actionRed'
    }`;

  return (
    <div className="bg-white border-b border-gray-200 shadow-2xs relative z-30">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        
        {/* Left: CATEGORIES Dropdown Trigger (No category icon) */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            onMouseEnter={() => setDropdownOpen(true)}
            className="bg-[#EDEDED] hover:bg-gray-200 text-charcoal font-bold text-xs tracking-wider uppercase px-4 py-2.5 rounded-t-sm flex items-center gap-2 cursor-pointer transition-colors select-none focus:outline-none"
            aria-expanded={dropdownOpen}
          >
            <FiMenu className="text-sm text-gray-800" />
            <span>CATEGORIES</span>
            <FiChevronDown
              className={`text-sm text-gray-700 transition-transform duration-200 ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Interactive Dropdown Menu */}
          {dropdownOpen && (
            <div
              onMouseLeave={() => setDropdownOpen(false)}
              className="absolute left-0 top-full w-64 bg-white border border-gray-200 shadow-xl rounded-b-md py-2 z-50 animate-fadeIn divide-y divide-gray-50"
            >
              <div className="px-4 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Browse Departments
              </div>
              {categories.map((cat, idx) => (
                <Link
                  key={idx}
                  to={cat.path}
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2.5 text-xs text-charcoal hover:bg-gray-50 hover:text-actionRed transition-colors font-medium"
                >
                  <span>{cat.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Center / Right: Nav items with dividers */}
        <nav className="hidden lg:flex items-center space-x-1">
          <NavLink to="/" end className={navItemClass}>
            HOME
          </NavLink>

          <span className="text-gray-300 select-none">|</span>

          <NavLink to="/shop" className={navItemClass}>
            SHOP
          </NavLink>

          <span className="text-gray-300 select-none">|</span>

          <NavLink to="/best-selling" className={navItemClass}>
            BEST SELLING
          </NavLink>

          <span className="text-gray-300 select-none">|</span>

          <NavLink to="/new-arrivals" className={navItemClass}>
            NEW ARRIVALS
          </NavLink>

          <span className="text-gray-300 select-none">|</span>

          <NavLink to="/brands" className={navItemClass}>
            BRANDS
          </NavLink>

          <span className="text-gray-300 select-none">|</span>

          <NavLink to="/hot-offers" className={({ isActive }) =>
            `flex items-center gap-1.5 font-bold text-xs tracking-wider uppercase px-2.5 py-2.5 transition-colors ${
              isActive ? 'text-actionRed' : 'text-charcoal hover:text-actionRed'
            }`
          }>
            <FaFire className="text-actionRed text-xs" />
            <span>HOT OFFER</span>
          </NavLink>

          <span className="text-gray-300 select-none">|</span>

          <NavLink to="/blog" className={navItemClass}>
            BLOG
          </NavLink>
        </nav>

        {/* Subtle right promotion tag */}
        <div className="hidden sm:flex lg:hidden items-center text-xs font-semibold text-actionRed">
          <FaFire className="mr-1" />
          <span>Flash Offers</span>
        </div>

      </div>
    </div>
  );
};

export default BottomNav;
