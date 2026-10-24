import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FiX, FiUser, FiPhoneCall, FiChevronRight, FiChevronDown } from 'react-icons/fi';
import { BsBoxSeam } from 'react-icons/bs';
import { FaFire, FaWhatsapp, FaFacebookF, FaMapMarkerAlt } from 'react-icons/fa';
import { FaTiktok } from 'react-icons/fa6';
import { TbTruckDelivery } from 'react-icons/tb';
import { useShop } from '../../context/ShopContext';
import { useAuth } from '../../context/AuthContext';
import { useCategories } from '../../hooks/useQueries';
import logoImg from '../../assets/Without BG logo.webp';
import { STORE_CONTACT } from '../../utils/contactInfo';

const MobileDrawer = () => {
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useShop();
  const { currentUser } = useAuth();
  const { data: categoriesList = [] } = useCategories();
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  if (!isMobileMenuOpen) return null;

  const closeDrawer = () => setIsMobileMenuOpen(false);

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Mobile navigation menu">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={closeDrawer}
      />

      {/* Drawer panel */}
      <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col overflow-y-auto animate-slideIn">
        
        {/* Drawer Header with My Account / Login button (Section 23.3) */}
        <div className="p-4 bg-primary text-white flex items-center justify-between border-b border-primary-dark">
          <div className="flex items-center gap-2">
            <img src={logoImg} alt="Sarail 1 to 99 Plus Shop Logo" width="32" height="32" className="h-8 w-8 object-contain" />
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight leading-tight">
                SARAIL 1 TO 99+
              </span>
              <span className="text-[10px] text-slate-200">Variety & Household Shop</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              to="/account"
              onClick={closeDrawer}
              aria-label={currentUser ? 'My Account' : 'Login / My Account'}
              title={currentUser ? (currentUser.displayName || 'My Account') : 'My Account / Login'}
              className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            >
              <FiUser className="text-sm shrink-0" />
              <span className="max-w-[70px] truncate">
                {currentUser ? (currentUser.displayName ? currentUser.displayName.split(' ')[0] : 'Account') : 'Login'}
              </span>
            </Link>

            <button
              type="button"
              onClick={closeDrawer}
              className="p-1.5 text-white hover:text-white rounded-full hover:bg-white/10 cursor-pointer"
              aria-label="Close menu"
            >
              <FiX className="text-2xl" />
            </button>
          </div>
        </div>

        {/* Action Highlights */}
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <Link
            to="/pre-order"
            onClick={closeDrawer}
            className="w-full flex items-center justify-center gap-2 bg-actionRed hover:bg-actionRed-hover text-white text-xs font-bold py-2.5 px-4 rounded-lg shadow-xs transition-colors"
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
                  className="block px-6 py-2.5 text-xs font-medium text-charcoal hover:text-actionRed hover:bg-gray-50 border-b border-gray-50 transition-colors"
                >
                  {cat.name}
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
                  isActive ? 'text-primary bg-primary/10 font-bold' : 'text-charcoal hover:bg-gray-50'
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
                  isActive ? 'text-primary bg-primary/10 font-bold' : 'text-charcoal hover:bg-gray-50'
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
                  isActive ? 'text-primary bg-primary/10 font-bold' : 'text-charcoal hover:bg-gray-50'
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
                  isActive ? 'text-primary bg-primary/10 font-bold' : 'text-charcoal hover:bg-gray-50'
                }`
              }
            >
              <span>NEW ARRIVALS</span>
              <FiChevronRight className="text-gray-400 text-xs" />
            </NavLink>

            <NavLink
              to="/about"
              onClick={closeDrawer}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-2.5 text-sm font-semibold border-b border-gray-100 ${
                  isActive ? 'text-primary bg-primary/10 font-bold' : 'text-charcoal hover:bg-gray-50'
                }`
              }
            >
              <span>ABOUT US</span>
              <FiChevronRight className="text-gray-400 text-xs" />
            </NavLink>

            <NavLink
              to="/hot-offers"
              onClick={closeDrawer}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-2.5 text-sm font-bold border-b border-gray-100 ${
                  isActive ? 'text-actionRed bg-primary/10 font-bold' : 'text-actionRed hover:bg-red-50/30'
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
              to="/popular-items"
              onClick={closeDrawer}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-2.5 text-sm font-bold border-b border-gray-100 ${
                  isActive ? 'text-[#B80D18] bg-primary/10 font-bold' : 'text-[#B80D18] hover:bg-red-50/30'
                }`
              }
            >
              <div className="flex items-center gap-2">
                <span className="text-xs bg-[#B80D18] text-white px-1.5 py-0.5 rounded text-[10px] uppercase font-black">
                  POPULAR
                </span>
                <span>POPULAR / HIT ITEMS</span>
              </div>
              <FiChevronRight className="text-gray-400 text-xs" />
            </NavLink>

            <NavLink
              to="/contact"
              onClick={closeDrawer}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-2.5 text-sm font-semibold border-b border-gray-100 ${
                  isActive ? 'text-primary bg-primary/10 font-bold' : 'text-charcoal hover:bg-gray-50'
                }`
              }
            >
              <span>CONTACT</span>
              <FiChevronRight className="text-gray-400 text-xs" />
            </NavLink>

            <NavLink
              to={STORE_CONTACT.addressRoute}
              onClick={() => {
                closeDrawer();
                setTimeout(() => {
                  const el = document.getElementById('store-location');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 100);
              }}
              className="flex items-center justify-between px-4 py-2.5 text-sm font-semibold border-b border-gray-100 text-charcoal hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-base text-actionRed" />
                <span>STORE LOCATION</span>
              </div>
              <FiChevronRight className="text-gray-400 text-xs" />
            </NavLink>

            <NavLink
              to="/track-order"
              onClick={closeDrawer}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-2.5 text-sm font-semibold border-b border-gray-100 ${
                  isActive ? 'text-primary bg-primary/10 font-bold' : 'text-charcoal hover:bg-gray-50'
                }`
              }
            >
              <div className="flex items-center gap-2">
                <TbTruckDelivery className="text-base text-primary" />
                <span>TRACK ORDER</span>
              </div>
              <FiChevronRight className="text-gray-400 text-xs" />
            </NavLink>
          </nav>
        </div>

        {/* Footer Support Info */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-600 space-y-3">
          <div>
            <div className="font-semibold text-charcoal mb-1">Customer Support</div>
            <a
              href={STORE_CONTACT.phoneHref}
              aria-label={`Call customer support at ${STORE_CONTACT.phoneDisplay}`}
              className="flex items-center gap-2 mb-1 hover:text-primary font-medium"
            >
              <FiPhoneCall className="text-primary" aria-hidden="true" />
              <span>{STORE_CONTACT.phoneDisplay}</span>
            </a>
            <a
              href={STORE_CONTACT.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with customer support on WhatsApp (opens in a new tab)"
              className="flex items-center gap-2 text-emerald-600 font-semibold"
            >
              <FaWhatsapp className="text-base" aria-hidden="true" />
              <span>WhatsApp Chat</span>
            </a>
          </div>

          {/* Social Row */}
          <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
            <a
              href={STORE_CONTACT.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-[#1558B0] text-white flex items-center justify-center hover:opacity-90"
              aria-label="Facebook"
            >
              <FaFacebookF className="text-xs" />
            </a>
            <a
              href={STORE_CONTACT.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:opacity-90"
              aria-label="TikTok"
            >
              <FaTiktok className="text-xs" />
            </a>
            <a
              href={STORE_CONTACT.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-[#0F7A52] text-white flex items-center justify-center hover:opacity-90"
              aria-label="WhatsApp"
            >
              <FaWhatsapp className="text-sm" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MobileDrawer;
