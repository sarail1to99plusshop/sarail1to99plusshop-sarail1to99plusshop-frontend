import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiUser, FiMenu } from 'react-icons/fi';
import { BsCart3, BsBoxSeam } from 'react-icons/bs';
import { useShop } from '../../context/ShopContext';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../assets/Without BG logo.png';

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
    <div className="bg-[#050914] text-white py-3 px-4 shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 lg:gap-6">
        
        {/* Mobile Hamburger & Logo Container */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden text-white hover:text-actionRed p-1 transition-colors"
            aria-label="Open Mobile Menu"
          >
            <FiMenu className="text-2xl" />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <img
              src={logoImg}
              alt="Sarail 1 to 99 Plus Shop"
              className="h-10 md:h-12 max-w-[170px] md:max-w-[210px] object-contain transition-transform group-hover:scale-[1.02]"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            {/* Branded typography */}
            <div className="flex flex-col select-none">
              <span className="font-black text-lg md:text-xl tracking-tight text-white font-sans flex items-center">
                SARAIL 1 TO 99<span className="text-[#DE111E]">+</span>
              </span>
              <span className="text-[9px] uppercase tracking-wider text-gray-400 font-medium">
                Super Variety Store
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xl mx-2">
          <form onSubmit={handleSearchSubmit} className="relative w-full flex items-center">
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search for products"
              className="w-full bg-white text-gray-800 placeholder-gray-400 text-sm px-4 py-2.5 rounded-l-md outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
            <button
              type="submit"
              className="bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-r-md flex items-center justify-center transition-colors border border-black border-l-0"
              aria-label="Search button"
            >
              <FiSearch className="text-lg text-white" />
            </button>
          </form>
        </div>

        {/* Right Action Items */}
        <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-5">
          
          {/* Cart Icon with Red Count Badge */}
          <Link
            to="/cart"
            className="relative flex items-center justify-center p-2 text-actionRed hover:opacity-90 transition-opacity"
            aria-label="Shopping Cart"
          >
            <BsCart3 className="text-2xl text-actionRed hover:scale-105 transition-transform" />
            <span className="absolute -top-1 -right-1 bg-actionRed text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs border border-[#050914]">
              {cartCount}
            </span>
          </Link>

          {/* Vertical Divider */}
          <span className="hidden md:inline-block text-gray-700 font-light select-none">|</span>

          {/* Pre-Order / Order Today */}
          <Link
            to="/pre-order"
            className="hidden md:flex items-center gap-2 group hover:opacity-95 transition-opacity"
          >
            <BsBoxSeam className="text-2xl text-actionRed group-hover:scale-105 transition-transform" />
            <div className="flex flex-col text-left leading-tight">
              <span className="text-xs font-bold text-white group-hover:text-actionRed transition-colors">
                Pre-Order
              </span>
              <span className="text-[10px] text-gray-400">Order Today</span>
            </div>
          </Link>

          {/* Vertical Divider */}
          <span className="hidden md:inline-block text-gray-700 font-light select-none">|</span>

          {/* Account / Register or Login */}
          <Link
            to="/account"
            className="hidden md:flex items-center gap-2 group hover:opacity-95 transition-opacity"
          >
            <FiUser className="text-2xl text-actionRed group-hover:scale-105 transition-transform" />
            <div className="flex flex-col text-left leading-tight">
              <span className="text-xs font-bold text-white group-hover:text-actionRed transition-colors max-w-[110px] truncate">
                {currentUser?.displayName || (currentUser ? 'My Account' : 'Account')}
              </span>
              <span className="text-[10px] text-gray-400">
                {currentUser ? (currentUser.emailVerified ? 'Verified' : 'My Profile') : 'Register or Login'}
              </span>
            </div>
          </Link>

        </div>

      </div>

      {/* Mobile Search Bar below header */}
      <div className="mt-2.5 md:hidden">
        <form onSubmit={handleSearchSubmit} className="relative w-full flex items-center">
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search for products"
            className="w-full bg-white text-gray-800 placeholder-gray-400 text-xs px-3 py-2 rounded-l-md outline-none"
          />
          <button
            type="submit"
            className="bg-black text-white px-3.5 py-2 rounded-r-md flex items-center justify-center border border-black"
          >
            <FiSearch className="text-sm" />
          </button>
        </form>
      </div>

    </div>
  );
};

export default MainHeader;

