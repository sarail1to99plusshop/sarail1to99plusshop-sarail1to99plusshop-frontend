import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiUser, FiMenu } from 'react-icons/fi';
import { BsCart3, BsBoxSeam } from 'react-icons/bs';
import { useShop } from '../../context/ShopContext';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../assets/Website logo.png';

const MainHeader = () => {
  const { cartCount, searchQuery, setSearchQuery, setIsMobileMenuOpen } = useShop();
  const { currentUser } = useAuth();
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchQuery(localSearch.trim());
      navigate(`/shop?search=${encodeURIComponent(localSearch.trim())}`);
    }
  };

  return (
    <div className="bg-white text-charcoal py-3 px-4 border-b border-slate-200/80 shadow-2xs sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4 lg:gap-6">
        
        {/* Mobile Hamburger & Logo Container */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden text-charcoal hover:text-actionRed p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Open Mobile Menu"
          >
            <FiMenu className="text-2xl text-charcoal" />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <img
              src={logoImg}
              alt="Sarail 1 to 99 Plus Shop"
              className="h-10 sm:h-11 md:h-12 max-w-[170px] sm:max-w-[190px] md:max-w-[210px] object-contain transition-transform group-hover:scale-[1.02]"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </Link>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xl mx-2 lg:mx-4">
          <form
            onSubmit={handleSearchSubmit}
            className="relative w-full flex items-center border-2 border-slate-200 hover:border-primary/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 rounded-lg overflow-hidden bg-white shadow-2xs transition-all"
          >
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search for household products, cookware, lifestyle items..."
              className="w-full bg-white text-charcoal placeholder-slate-400 text-xs sm:text-sm px-4 py-2.5 outline-none font-medium"
            />
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 flex items-center justify-center transition-colors shrink-0"
              aria-label="Search button"
            >
              <FiSearch className="text-lg text-white stroke-[2.5]" />
            </button>
          </form>
        </div>

        {/* Right Action Items */}
        <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
          
          {/* Cart Icon with Red Count Badge */}
          <Link
            to="/cart"
            className="relative flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition-colors group"
            aria-label="Shopping Cart"
          >
            <div className="relative flex items-center justify-center">
              <BsCart3 className="text-2xl text-actionRed group-hover:scale-105 transition-transform" />
              <span className="absolute -top-1.5 -right-2 bg-actionRed text-white font-extrabold text-[10px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center shadow-xs border-2 border-white">
                {cartCount}
              </span>
            </div>
            <div className="hidden xl:flex flex-col text-left leading-tight">
              <span className="text-xs font-bold text-charcoal group-hover:text-actionRed transition-colors">
                Cart
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                {cartCount > 0 ? `${cartCount} items` : '৳0.00'}
              </span>
            </div>
          </Link>

          {/* Vertical Divider */}
          <div className="hidden md:block h-7 w-[1px] bg-slate-200 select-none" />

          {/* Pre-Order / Order Today */}
          <Link
            to="/pre-order"
            className="hidden md:flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 group transition-colors"
          >
            <BsBoxSeam className="text-2xl text-primary group-hover:text-actionRed group-hover:scale-105 transition-all" />
            <div className="flex flex-col text-left leading-tight">
              <span className="text-xs font-bold text-charcoal group-hover:text-actionRed transition-colors">
                Pre-Order
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Order Today</span>
            </div>
          </Link>

          {/* Vertical Divider */}
          <div className="hidden md:block h-7 w-[1px] bg-slate-200 select-none" />

          {/* Account / Register or Login */}
          <Link
            to="/account"
            className="hidden md:flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 group transition-colors"
          >
            <FiUser className="text-2xl text-primary group-hover:text-actionRed group-hover:scale-105 transition-all" />
            <div className="flex flex-col text-left leading-tight">
              <span className="text-xs font-bold text-charcoal group-hover:text-actionRed transition-colors max-w-[110px] truncate">
                {currentUser?.displayName || (currentUser ? 'My Account' : 'Account')}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                {currentUser ? (currentUser.emailVerified ? 'Verified' : 'My Profile') : 'Register or Login'}
              </span>
            </div>
          </Link>

        </div>

      </div>

      {/* Mobile Search Bar below header */}
      <div className="mt-2.5 md:hidden">
        <form
          onSubmit={handleSearchSubmit}
          className="relative w-full flex items-center border border-slate-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 rounded-lg overflow-hidden bg-white shadow-2xs"
        >
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search for products"
            className="w-full bg-white text-charcoal placeholder-slate-400 text-xs px-3.5 py-2 outline-none font-medium"
          />
          <button
            type="submit"
            className="bg-primary hover:bg-primary-dark text-white px-3.5 py-2 flex items-center justify-center shrink-0 transition-colors"
            aria-label="Search button"
          >
            <FiSearch className="text-sm stroke-[2.5]" />
          </button>
        </form>
      </div>

    </div>
  );
};

export default MainHeader;

