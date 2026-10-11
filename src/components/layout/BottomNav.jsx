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
    `font-bold text-xs tracking-wider uppercase px-3 py-2.5 transition-colors duration-150 relative ${
      isActive
        ? 'text-[#B80D18] after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px] after:bg-[#B80D18]'
        : 'text-charcoal hover:text-[#B80D18]'
    }`;

  return (
    <div className="bg-white border-b border-slate-200 shadow-2xs relative z-30">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        
        {/* Left: CATEGORIES Dropdown Trigger */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            onMouseEnter={() => setDropdownOpen(true)}
            className="bg-primary hover:bg-primary-dark text-white font-bold text-xs tracking-wider uppercase px-4 py-2.5 rounded-t-md flex items-center gap-2.5 cursor-pointer transition-all select-none shadow-2xs hover:shadow-xs focus:outline-none"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            <FiMenu className="text-sm text-white stroke-[2.5]" aria-hidden="true" />
            <span className="tracking-wider">CATEGORIES</span>
            <FiChevronDown
              aria-hidden="true"
              className={`text-sm text-white transition-transform duration-200 ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Interactive Dropdown Menu */}
          {dropdownOpen && (
            <div
              onMouseLeave={() => setDropdownOpen(false)}
              className="absolute left-0 top-full w-64 bg-white border border-slate-200 shadow-xl rounded-b-lg py-2 z-50 animate-fadeIn divide-y divide-slate-100"
            >
              <div className="px-4 py-2 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Browse Departments
              </div>
              {categories.map((cat, idx) => (
                <Link
                  key={idx}
                  to={cat.path}
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2.5 text-xs text-charcoal hover:bg-slate-50 hover:text-[#B80D18] transition-colors font-semibold"
                >
                  <span>{cat.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Center / Right: Nav items with dividers */}
        <nav aria-label="Main navigation" className="hidden lg:flex items-center space-x-1">
          <NavLink to="/" end className={navItemClass}>
            HOME
          </NavLink>

          <span className="text-slate-200 select-none font-light" aria-hidden="true">|</span>

          <NavLink to="/shop" className={navItemClass}>
            SHOP
          </NavLink>

          <span className="text-slate-200 select-none font-light" aria-hidden="true">|</span>

          <NavLink to="/best-selling" className={navItemClass}>
            BEST SELLING
          </NavLink>

          <span className="text-slate-200 select-none font-light" aria-hidden="true">|</span>

          <NavLink to="/new-arrivals" className={navItemClass}>
            NEW ARRIVALS
          </NavLink>

          <span className="text-slate-200 select-none font-light" aria-hidden="true">|</span>

          <NavLink
            to="/hot-offers"
            className={({ isActive }) =>
              `flex items-center gap-1.5 font-bold text-xs tracking-wider uppercase px-3 py-2.5 transition-colors relative ${
                isActive
                  ? 'text-[#B80D18] after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px] after:bg-[#B80D18]'
                  : 'text-[#B80D18] hover:opacity-80'
              }`
            }
          >
            <FaFire className="text-[#B80D18] text-xs" aria-hidden="true" />
            <span>HOT OFFER</span>
          </NavLink>

          <span className="text-slate-200 select-none font-light" aria-hidden="true">|</span>

          <NavLink to="/about" className={navItemClass}>
            ABOUT US
          </NavLink>

          <span className="text-slate-200 select-none font-light" aria-hidden="true">|</span>

          <NavLink to="/contact" className={navItemClass}>
            CONTACT
          </NavLink>
        </nav>

        {/* Subtle right promotion tag */}
        <div className="hidden sm:flex items-center">
          <Link
            to="/hot-offers"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#990B14] bg-red-50 border border-red-200 hover:bg-[#B80D18] hover:text-white px-3 py-1 rounded-full transition-all shadow-2xs"
          >
            <FaFire className="text-xs" aria-hidden="true" />
            <span>FLASH DISCOUNTS</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default BottomNav;
