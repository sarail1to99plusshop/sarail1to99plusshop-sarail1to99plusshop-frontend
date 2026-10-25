import { Link } from 'react-router-dom';
import {
  FaFacebookF,
  FaTiktok,
  FaWhatsapp,
  FaShieldAlt,
  FaTruck,
  FaUndo,
  FaHeadset,
  FaPaperPlane,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { HiOutlineMail, HiOutlinePhone } from 'react-icons/hi';
import logoImg from '../../assets/Without BG logo.webp';
import heroStackLogo from '../../assets/herostack-logo.webp';
import { STORE_CONTACT } from '../../utils/contactInfo';

const Footer = () => {
  return (
    <footer className="w-full bg-[#050914] text-slate-200 pt-12 border-t border-gray-800 mt-auto">
      {/* 1. Value Proposition Strip (Approved Section 08 Draft Copy) */}
      <div className="max-w-7xl mx-auto px-4 pb-12 border-b border-gray-800">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-4 p-3 sm:p-4 rounded-lg bg-gray-900/60 border border-gray-800/80">
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-lg sm:text-xl shrink-0"
              aria-hidden="true"
            >
              <FaShieldAlt />
            </div>
            <div>
              <p className="text-white font-bold text-xs sm:text-sm">Quality You Can Trust</p>
              <p className="text-slate-300 text-[11px] sm:text-xs mt-0.5">Carefully selected products for your everyday needs.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-4 p-3 sm:p-4 rounded-lg bg-gray-900/60 border border-gray-800/80">
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-500/20 text-[#FF6B74] flex items-center justify-center text-lg sm:text-xl shrink-0"
              aria-hidden="true"
            >
              <FaTruck />
            </div>
            <div>
              <p className="text-white font-bold text-xs sm:text-sm">Delivery Across Bangladesh</p>
              <p className="text-slate-300 text-[11px] sm:text-xs mt-0.5">Convenient shipping to your doorstep, wherever we deliver.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-4 p-3 sm:p-4 rounded-lg bg-gray-900/60 border border-gray-800/80">
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-lg sm:text-xl shrink-0"
              aria-hidden="true"
            >
              <FaUndo />
            </div>
            <div>
              <p className="text-white font-bold text-xs sm:text-sm">3-Day Return Request</p>
              <p className="text-slate-300 text-[11px] sm:text-xs mt-0.5">Report eligible product issues within 3 days of delivery.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-4 p-3 sm:p-4 rounded-lg bg-gray-900/60 border border-gray-800/80">
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-500/20 text-[#FF6B74] flex items-center justify-center text-lg sm:text-xl shrink-0"
              aria-hidden="true"
            >
              <FaHeadset />
            </div>
            <div>
              <p className="text-white font-bold text-xs sm:text-sm">Here to Help</p>
              <p className="text-slate-300 text-[11px] sm:text-xs mt-0.5">Have a question? Our team is ready to assist you.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" aria-label="Sarail 1 to 99 Plus Shop Home" className="flex items-center gap-2">
              <img
                src={logoImg}
                alt="Sarail 1 to 99 Plus Shop Logo"
                width="40"
                height="40"
                loading="lazy"
                decoding="async"
                className="h-10 w-10 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <span className="font-black text-2xl tracking-tight text-white">
                SARAIL 1 TO 99<span className="text-[#FF6B74]">+ SHOP</span>
              </span>
            </Link>

            <p className="text-slate-200 text-xs leading-relaxed max-w-sm">
              <strong className="text-white">Sarail 1 to 99 Plus Shop</strong> – your trusted destination for quality kitchenware, melamine dinner sets, cleaning tools, baby items, toys, beauty products, and everyday household essentials at friendly 1 to 99+ prices.
            </p>

            <div className="space-y-2 text-xs text-slate-200 pt-1">
              <div className="flex items-start gap-2.5">
                <Link
                  to={STORE_CONTACT.addressRoute}
                  aria-label="Store Location in Munshi Market, Sarail"
                  onClick={() => {
                    const el = document.getElementById('store-location');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="flex items-start gap-2.5 hover:text-white transition-colors"
                >
                  <FaMapMarkerAlt className="text-[#FF6B74] text-base shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{STORE_CONTACT.address}</span>
                </Link>
              </div>
              <div className="flex items-center gap-2.5">
                <HiOutlinePhone className="text-[#FF6B74] text-base shrink-0" aria-hidden="true" />
                <a href={STORE_CONTACT.phoneHref} aria-label={`Call us at ${STORE_CONTACT.phoneDisplay}`} className="hover:text-white transition-colors">
                  {STORE_CONTACT.phoneDisplay}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <HiOutlineMail className="text-[#FF6B74] text-base shrink-0" aria-hidden="true" />
                <a href={STORE_CONTACT.emailHref} aria-label={`Email us at ${STORE_CONTACT.email}`} className="hover:text-white transition-colors">
                  {STORE_CONTACT.email}
                </a>
              </div>
            </div>

            {/* Social Icons (Section 01: Facebook, TikTok, WhatsApp, Store Location) */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={STORE_CONTACT.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Facebook (opens in a new tab)"
                className="w-11 h-11 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 transition-transform"
              >
                <FaFacebookF className="text-sm" aria-hidden="true" />
              </a>
              <a
                href={STORE_CONTACT.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on TikTok (opens in a new tab)"
                className="w-11 h-11 rounded-full bg-black border border-gray-700 text-white flex items-center justify-center hover:scale-110 transition-transform"
              >
                <FaTiktok className="text-sm" aria-hidden="true" />
              </a>
              <a
                href={STORE_CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp (opens in a new tab)"
                className="w-11 h-11 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:scale-110 transition-transform"
              >
                <FaWhatsapp className="text-base" aria-hidden="true" />
              </a>
              <Link
                to={STORE_CONTACT.addressRoute}
                onClick={() => {
                  const el = document.getElementById('store-location');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                aria-label="Find our Store Location on Google Maps"
                title="Store Location"
                className="w-11 h-11 rounded-full bg-[#112b45] border border-slate-700 text-[#FF6B74] flex items-center justify-center hover:scale-110 transition-transform"
              >
                <FaMapMarkerAlt className="text-sm" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Column 2: Categories (The 8 Main Categories) */}
          <div>
            <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-[#FF6B74] pl-2.5">
              Categories
            </h2>
            <ul className="space-y-1 text-xs text-slate-200">
              <li>
                <Link to="/shop?category=kitchen" className="inline-block py-1.5 hover:text-white transition-colors">
                  Kitchen & Dining
                </Link>
              </li>
              <li>
                <Link to="/shop?category=cleaning" className="inline-block py-1.5 hover:text-white transition-colors">
                  Cleaning & Hygiene
                </Link>
              </li>
              <li>
                <Link to="/shop?category=baby-kids" className="inline-block py-1.5 hover:text-white transition-colors">
                  Baby & Kids
                </Link>
              </li>
              <li>
                <Link to="/shop?category=beauty" className="inline-block py-1.5 hover:text-white transition-colors">
                  Beauty & Personal Care
                </Link>
              </li>
              <li>
                <Link to="/shop?category=melamine-crockery" className="inline-block py-1.5 hover:text-white transition-colors">
                  Melamine & Crockery
                </Link>
              </li>
              <li>
                <Link to="/shop?category=toys" className="inline-block py-1.5 hover:text-white transition-colors">
                  Toys & Games
                </Link>
              </li>
              <li>
                <Link to="/shop?category=home-household" className="inline-block py-1.5 hover:text-white transition-colors">
                  Home & Household
                </Link>
              </li>
              <li>
                <Link to="/shop?category=womens-fashion" className="inline-block py-1.5 hover:text-white transition-colors">
                  Women&apos;s Fashion & Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links (Synchronized with Navbar) */}
          <div>
            <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-[#FF6B74] pl-2.5">
              Quick Links
            </h2>
            <ul className="space-y-1 text-xs text-slate-200">
              <li>
                <Link to="/" className="inline-block py-1.5 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="inline-block py-1.5 hover:text-white transition-colors">
                  Shop All Products
                </Link>
              </li>
              <li>
                <Link to="/best-selling" className="inline-block py-1.5 hover:text-white transition-colors">
                  Best Selling
                </Link>
              </li>
              <li>
                <Link to="/new-arrivals" className="inline-block py-1.5 hover:text-white transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/hot-offers" className="inline-flex items-center gap-1 py-1.5 text-[#FF8A92] hover:underline font-semibold">
                  🔥 Hot Offers
                </Link>
              </li>
              <li>
                <Link to="/popular-items" className="inline-block py-1.5 hover:text-white transition-colors">
                  Popular / Hit Items
                </Link>
              </li>
              <li>
                <Link to="/about" className="inline-block py-1.5 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="inline-block py-1.5 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Customer Help (Updated Policy Routes) */}
          <div className="space-y-4">
            <h2 className="text-white font-bold text-sm uppercase tracking-wider border-l-2 border-[#FF6B74] pl-2.5">
              Customer Help
            </h2>
            <ul className="space-y-1 text-xs text-slate-200">
              <li>
                <Link to="/track-order" className="inline-block py-1.5 hover:text-white transition-colors font-medium text-white">
                  🚚 Track My Order
                </Link>
              </li>
              <li>
                <Link to="/pre-order" className="inline-block py-1.5 hover:text-white transition-colors">
                  Pre-Order / Special Request
                </Link>
              </li>
              <li>
                <Link to="/account" className="inline-block py-1.5 hover:text-white transition-colors">
                  My Account / Login
                </Link>
              </li>
              <li>
                <Link to="/return-policy" className="inline-block py-1.5 hover:text-white transition-colors text-amber-200">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="inline-block py-1.5 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <label htmlFor="newsletter-email-input" className="block text-white font-bold text-xs mb-2">
                Subscribe for Discounts
              </label>
              <form
                toolname="subscribe_newsletter"
                tooldescription="Subscribe customer email address for store promotions and discount updates."
                onSubmit={(e) => e.preventDefault()}
                className="flex items-center"
              >
                <input
                  id="newsletter-email-input"
                  type="email"
                  aria-label="Your email address for discount newsletter"
                  placeholder="Your email address"
                  className="w-full bg-gray-900 border border-gray-700 text-xs text-white px-3 py-2.5 min-h-[40px] rounded-l-md outline-none focus:border-[#FF6B74] placeholder-slate-400"
                />
                <button
                  type="submit"
                  className="bg-[#B80D18] hover:bg-[#990B14] text-white min-w-[44px] min-h-[40px] px-3.5 py-2.5 rounded-r-md text-xs font-bold flex items-center justify-center transition-colors shrink-0"
                  aria-label="Subscribe to newsletter"
                >
                  <FaPaperPlane aria-hidden="true" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Bar: Copyright & Agency Credit (Section 09) */}
      <div className="bg-[#020610] py-5 border-t border-gray-800/80">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-300">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} <strong className="text-white">Sarail 1 to 99 Plus Shop</strong>. All rights reserved.
          </p>

          <div className="flex items-center justify-center md:justify-end gap-2.5 text-slate-400">
            <span>Designed & Developed by</span>
            <a
              href={STORE_CONTACT.agencyFacebookUrl}
              className="inline-flex items-center hover:opacity-90 transition-opacity"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="HeroStack Tech (opens in a new tab)"
            >
              <img
                src={heroStackLogo}
                alt="HeroStack"
                width="108"
                height="36"
                className="h-6 sm:h-7 md:h-8 lg:h-9 w-auto object-contain"
                loading="lazy"
                decoding="async"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
