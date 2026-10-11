import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp, FaShieldAlt, FaTruck, FaUndo, FaHeadset, FaPaperPlane } from 'react-icons/fa';
import { HiOutlineMail, HiOutlineLocationMarker, HiOutlinePhone } from 'react-icons/hi';
import logoImg from '../../assets/Without BG logo.webp';

const Footer = () => {
  return (
    <footer className="w-full bg-[#050914] text-slate-300 pt-12 border-t border-gray-800 mt-auto cv-auto">
      
      {/* 1. Value Proposition Strip */}
      <div className="max-w-7xl mx-auto px-4 pb-12 border-b border-gray-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-900/60 border border-gray-800/80">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-xl shrink-0" aria-hidden="true">
              <FaShieldAlt />
            </div>
            <div>
              <p className="text-white font-bold text-sm">100% Quality Checked</p>
              <p className="text-slate-300 text-xs mt-0.5">Reliable &amp; durable household items</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-900/60 border border-gray-800/80">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-[#FF6B74] flex items-center justify-center text-xl shrink-0" aria-hidden="true">
              <FaTruck />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Fast Nationwide Delivery</p>
              <p className="text-slate-300 text-xs mt-0.5">Speedy delivery across Bangladesh</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-900/60 border border-gray-800/80">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-xl shrink-0" aria-hidden="true">
              <FaUndo />
            </div>
            <div>
              <p className="text-white font-bold text-sm">7-Day Easy Return</p>
              <p className="text-slate-300 text-xs mt-0.5">Simple hassle-free replacement</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-900/60 border border-gray-800/80">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-[#FF6B74] flex items-center justify-center text-xl shrink-0" aria-hidden="true">
              <FaHeadset />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Dedicated Customer Care</p>
              <p className="text-slate-300 text-xs mt-0.5">Friendly support 7 days a week</p>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
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

            <p className="text-slate-300 text-xs leading-relaxed max-w-sm">
              <strong className="text-white">Sarail 1 to 99 Plus Shop</strong> – your trusted destination for quality kitchenware, melamine dinner sets, cleaning tools, baby items, toys, beauty products, and everyday household essentials at friendly 1 to 99+ prices.
            </p>

            <div className="space-y-2 text-xs text-slate-300 pt-1">
              <div className="flex items-start gap-2.5">
                <HiOutlineLocationMarker className="text-[#FF6B74] text-base shrink-0 mt-0.5" aria-hidden="true" />
                <span>Shop #14, Main Road, Sarail, Brahmanbaria, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2.5">
                <HiOutlinePhone className="text-[#FF6B74] text-base shrink-0" aria-hidden="true" />
                <span>01970-605584</span>
              </div>
              <div className="flex items-center gap-2.5">
                <HiOutlineMail className="text-[#FF6B74] text-base shrink-0" aria-hidden="true" />
                <span>support@sarail1to99plus.com</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Facebook"
                className="w-10 h-10 rounded-full bg-[#3B5998] text-white flex items-center justify-center hover:scale-110 transition-transform"
              >
                <FaFacebookF className="text-xs" aria-hidden="true" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className="w-10 h-10 rounded-full bg-[#6B1D2F] text-white flex items-center justify-center hover:scale-110 transition-transform"
              >
                <FaInstagram className="text-xs" aria-hidden="true" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Subscribe on YouTube"
                className="w-10 h-10 rounded-full bg-[#B80D18] text-white flex items-center justify-center hover:scale-110 transition-transform"
              >
                <FaYoutube className="text-xs" aria-hidden="true" />
              </a>
              <a
                href="https://wa.me/8801970605584"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                className="w-10 h-10 rounded-full bg-[#0F7A52] text-white flex items-center justify-center hover:scale-110 transition-transform"
              >
                <FaWhatsapp className="text-sm" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Column 2: Popular Categories (The 8 English Categories) */}
          <div>
            <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-[#FF6B74] pl-2.5">
              Categories
            </h2>
            <ul className="space-y-1 text-xs text-slate-300">
              <li>
                <Link to="/shop?category=kitchen" className="inline-block py-1.5 hover:text-white transition-colors">
                  Kitchen &amp; Dining
                </Link>
              </li>
              <li>
                <Link to="/shop?category=cleaning" className="inline-block py-1.5 hover:text-white transition-colors">
                  Cleaning &amp; Hygiene
                </Link>
              </li>
              <li>
                <Link to="/shop?category=baby-kids" className="inline-block py-1.5 hover:text-white transition-colors">
                  Baby &amp; Kids
                </Link>
              </li>
              <li>
                <Link to="/shop?category=beauty" className="inline-block py-1.5 hover:text-white transition-colors">
                  Beauty &amp; Personal Care
                </Link>
              </li>
              <li>
                <Link to="/shop?category=melamine-crockery" className="inline-block py-1.5 hover:text-white transition-colors">
                  Melamine &amp; Crockery
                </Link>
              </li>
              <li>
                <Link to="/shop?category=toys" className="inline-block py-1.5 hover:text-white transition-colors">
                  Toys &amp; Games
                </Link>
              </li>
              <li>
                <Link to="/shop?category=home-household" className="inline-block py-1.5 hover:text-white transition-colors">
                  Home &amp; Household
                </Link>
              </li>
              <li>
                <Link to="/shop?category=womens-fashion" className="inline-block py-1.5 hover:text-white transition-colors">
                  Women&apos;s Fashion &amp; Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-[#FF6B74] pl-2.5">
              Quick Links
            </h2>
            <ul className="space-y-1 text-xs text-slate-300">
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
                <Link to="/about" className="inline-block py-1.5 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/hot-offers" className="inline-flex items-center gap-1 py-1.5 text-[#FF6B74] hover:underline font-semibold">
                  🔥 Hot Offers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="inline-block py-1.5 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Customer Help & Newsletter */}
          <div className="space-y-4">
            <h2 className="text-white font-bold text-sm uppercase tracking-wider border-l-2 border-[#FF6B74] pl-2.5">
              Customer Help
            </h2>
            <ul className="space-y-1 text-xs text-slate-300">
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
              <li className="py-1">
                <span className="text-slate-300">Return &amp; Replacement Policy</span>
              </li>
              <li className="py-1">
                <span className="text-slate-300">Terms &amp; Conditions</span>
              </li>
            </ul>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <label htmlFor="newsletter-email-input" className="block text-white font-bold text-xs mb-2">
                Subscribe for Discounts
              </label>
              <form onSubmit={(e) => e.preventDefault()} className="flex items-center">
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

      {/* 3. Bottom Bar: Copyright & Payment Badges */}
      <div className="bg-[#020610] py-5 border-t border-gray-800/80">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-300">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} <strong className="text-white">Sarail 1 to 99 Plus Shop</strong>. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="px-2 py-1 rounded bg-gray-900 border border-gray-800 text-[10px] font-semibold text-pink-300">bKash</span>
            <span className="px-2 py-1 rounded bg-gray-900 border border-gray-800 text-[10px] font-semibold text-orange-300">Nagad</span>
            <span className="px-2 py-1 rounded bg-gray-900 border border-gray-800 text-[10px] font-semibold text-purple-300">Rocket</span>
            <span className="px-2 py-1 rounded bg-gray-900 border border-gray-800 text-[10px] font-semibold text-blue-300">VISA</span>
            <span className="px-2 py-1 rounded bg-gray-900 border border-gray-800 text-[10px] font-semibold text-red-300">Mastercard</span>
            <span className="px-2 py-1 rounded bg-gray-900 border border-gray-800 text-[10px] font-semibold text-emerald-300">Cash on Delivery</span>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
