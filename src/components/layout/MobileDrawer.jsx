import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FiX, FiUser, FiPhoneCall, FiChevronRight, FiChevronDown } from 'react-icons/fi';
import { BsBoxSeam } from 'react-icons/bs';
import { FaFire, FaWhatsapp } from 'react-icons/fa';
import { TbTruckDelivery } from 'react-icons/tb';
import { useShop } from '../../context/ShopContext';
import { categoriesList } from '../../data/mockData';
import logoImg from '../../assets/Without BG logo.png';

const MobileDrawer = () => {
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useShop();
  const [categoriesOpen, setCategoriesOpen] = useState(true);

  if (!isMobileMenuOpen) return null;

  const closeDrawer = () => setIsMobileMenuOpen(false);

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={closeDrawer}
      />

      {/* Drawer panel */}
      <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col overflow-y-auto animate-slideIn">
        
        {/* Drawer Header */}
        <div className="p-4 bg-[#050914] text-white flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-2">
            <img src={logoImg} alt="Logo" className="h-8 object-contain" />
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight leading-tight">
                SARAIL 1 TO 99+
              </span>
              <span className="text-[9px] text-gray-400">Variety & Household Shop</span>
            </div>
          </div>
          <button
            onClick={closeDrawer}
            className="p-2 text-gray-300 hover:text-white rounded-full hover:bg-white/10"
            aria-label="Close menu"
          >
            <FiX className="text-2xl" />
          </button>
        </div>

        {/* Action Highlights */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <Link
            to="/pre-order"
            onClick={closeDrawer}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold py-2.5 px-4 rounded-md shadow-xs transition-colors"
          >
            <BsBoxSeam />
            <span>Pre-Order & Special Requests</span>
          </Link>
        </div>

        {/* Collapsible Categories Section */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => setCategoriesOpen(!categoriesOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-100/70 hover:bg-gray-100 text-xs font-bold uppercase tracking-wider text-charcoal"
          >
            <span>All Categories (8)</span>
            <FiChevronDown
              className={`text-sm transition-transform ${categoriesOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {categoriesOpen && (
            <div className="bg-white py-1">
              {categoriesList.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/shop?category=${cat.id}`}
                  onClick={closeDrawer}
                  className="flex items-center justify-between px-6 py-2.5 text-xs font-medium text-gray-700 hover:text-actionRed hover:bg-gray-50 border-b border-gray-50 transition-colors"
                >
                  <span className="font-medium text-charcoal hover:text-actionRed">
                    {cat.name}
                  </span>
                  <span className="text-[10px] text-gray-400">{cat.count} items</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Main Nav Links */}
        <div className="py-2 flex-1">
          <div className="px-4 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Menu Navigation
          </div>
          <nav className="flex flex-col">
            <NavLink
              to="/"
              onClick={closeDrawer}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-2.5 text-sm font-semibold border-b border-gray-100 ${
                  isActive ? 'text-actionRed bg-red-50/50' : 'text-charcoal hover:bg-gray-50'
                }`
              }
            >
              <span>HOME</span>
              <FiChevronRight className="text-gray-400 text-xs" />
            </NavLink>

            <NavLink
              to="/shop"
              onClick={closeDrawer}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-2.5 text-sm font-semibold border-b border-gray-100 ${
                  isActive ? 'text-actionRed bg-red-50/50' : 'text-charcoal hover:bg-gray-50'
                }`
              }
            >
              <span>SHOP</span>
              <FiChevronRight className="text-gray-400 text-xs" />
            </NavLink>

            <NavLink
              to="/best-selling"
              onClick={closeDrawer}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-2.5 text-sm font-semibold border-b border-gray-100 ${
                  isActive ? 'text-actionRed bg-red-50/50' : 'text-charcoal hover:bg-gray-50'
                }`
              }
            >
              <span>BEST SELLING</span>
              <FiChevronRight className="text-gray-400 text-xs" />
            </NavLink>

            <NavLink
              to="/new-arrivals"
              onClick={closeDrawer}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-2.5 text-sm font-semibold border-b border-gray-100 ${
                  isActive ? 'text-actionRed bg-red-50/50' : 'text-charcoal hover:bg-gray-50'
                }`
              }
            >
              <span>NEW ARRIVALS</span>
              <FiChevronRight className="text-gray-400 text-xs" />
            </NavLink>

            <NavLink
              to="/brands"
              onClick={closeDrawer}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-2.5 text-sm font-semibold border-b border-gray-100 ${
                  isActive ? 'text-actionRed bg-red-50/50' : 'text-charcoal hover:bg-gray-50'
                }`
              }
            >
              <span>BRANDS</span>
              <FiChevronRight className="text-gray-400 text-xs" />
            </NavLink>

            <NavLink
              to="/hot-offers"
              onClick={closeDrawer}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-2.5 text-sm font-bold border-b border-gray-100 ${
                  isActive ? 'text-actionRed bg-red-50/50' : 'text-actionRed hover:bg-red-50/30'
                }`
              }
            >
              <div className="flex items-center gap-2">
                <FaFire className="text-actionRed" />
                <span>HOT OFFER</span>
              </div>
              <FiChevronRight className="text-gray-400 text-xs" />
            </NavLink>

            <NavLink
              to="/blog"
              onClick={closeDrawer}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-2.5 text-sm font-semibold border-b border-gray-100 ${
                  isActive ? 'text-actionRed bg-red-50/50' : 'text-charcoal hover:bg-gray-50'
                }`
              }
            >
              <span>BLOG</span>
              <FiChevronRight className="text-gray-400 text-xs" />
            </NavLink>

            <NavLink
              to="/track-order"
              onClick={closeDrawer}
              className="flex items-center justify-between px-4 py-2.5 text-sm font-semibold border-b border-gray-100 text-charcoal hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <TbTruckDelivery className="text-base text-primary" />
                <span>TRACK ORDER</span>
              </div>
              <FiChevronRight className="text-gray-400 text-xs" />
            </NavLink>

            <NavLink
              to="/account"
              onClick={closeDrawer}
              className="flex items-center justify-between px-4 py-2.5 text-sm font-semibold border-b border-gray-100 text-charcoal hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <FiUser className="text-base text-actionRed" />
                <span>My Account / Login</span>
              </div>
              <FiChevronRight className="text-gray-400 text-xs" />
            </NavLink>
          </nav>
        </div>

        {/* Footer Support Info */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-600">
          <div className="font-semibold text-charcoal mb-2">Need Assistance?</div>
          <a href="tel:01970605584" className="flex items-center gap-2 mb-1.5 hover:text-primary">
            <FiPhoneCall />
            <span>01970-605584</span>
          </a>
          <a href="https://wa.me/8801970605584" className="flex items-center gap-2 text-emerald-600 font-medium">
            <FaWhatsapp />
            <span>WhatsApp Support</span>
          </a>
        </div>

      </div>
    </div>
  );
};

export default MobileDrawer;
