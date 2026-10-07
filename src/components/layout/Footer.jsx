import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp, FaShieldAlt, FaTruck, FaUndo, FaHeadset, FaPaperPlane } from 'react-icons/fa';
import { HiOutlineMail, HiOutlineLocationMarker, HiOutlinePhone } from 'react-icons/hi';
import logoImg from '../../assets/Without BG logo.png';

const Footer = () => {
  return (
    <footer className="w-full bg-[#050914] text-gray-300 pt-12 border-t border-gray-800 mt-auto">
      
      {/* 1. Value Proposition Strip */}
      <div className="max-w-7xl mx-auto px-4 pb-12 border-b border-gray-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-900/60 border border-gray-800/80">
            <div className="w-12 h-12 rounded-full bg-primary/20 text-primary-light flex items-center justify-center text-xl shrink-0">
              <FaShieldAlt />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">100% Quality Checked</h4>
              <p className="text-gray-400 text-xs mt-0.5">Reliable & durable household items</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-900/60 border border-gray-800/80">
            <div className="w-12 h-12 rounded-full bg-actionRed/20 text-actionRed flex items-center justify-center text-xl shrink-0">
              <FaTruck />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Fast Nationwide Delivery</h4>
              <p className="text-gray-400 text-xs mt-0.5">Speedy delivery across Bangladesh</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-900/60 border border-gray-800/80">
            <div className="w-12 h-12 rounded-full bg-primary/20 text-primary-light flex items-center justify-center text-xl shrink-0">
              <FaUndo />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">7-Day Easy Return</h4>
              <p className="text-gray-400 text-xs mt-0.5">Simple hassle-free replacement</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-900/60 border border-gray-800/80">
            <div className="w-12 h-12 rounded-full bg-actionRed/20 text-actionRed flex items-center justify-center text-xl shrink-0">
              <FaHeadset />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Dedicated Customer Care</h4>
              <p className="text-gray-400 text-xs mt-0.5">Friendly support 7 days a week</p>
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
                alt="Logo"
                className="h-10 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <span className="font-black text-2xl tracking-tight text-white">
                SARAIL 1 TO 99<span className="text-actionRed">+ SHOP</span>
              </span>
            </Link>

            <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
              <strong className="text-white">Sarail 1 to 99 Plus Shop</strong> – your trusted destination for quality kitchenware, melamine dinner sets, cleaning tools, baby items, toys, beauty products, and everyday household essentials at friendly 1 to 99+ prices.
            </p>

            <div className="space-y-2 text-xs text-gray-300 pt-1">
              <div className="flex items-start gap-2.5">
                <HiOutlineLocationMarker className="text-actionRed text-base shrink-0 mt-0.5" />
                <span>Shop #14, Main Road, Sarail, Brahmanbaria, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2.5">
                <HiOutlinePhone className="text-actionRed text-base shrink-0" />
                <span>01970-605584</span>
              </div>
              <div className="flex items-center gap-2.5">
                <HiOutlineMail className="text-actionRed text-base shrink-0" />
                <span>support@sarail1to99plus.com</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center space-x-2 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-[#3B5998] text-white flex items-center justify-center hover:scale-110 transition-transform"
              >
                <FaFacebookF className="text-xs" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-[#6B1D2F] text-white flex items-center justify-center hover:scale-110 transition-transform"
              >
                <FaInstagram className="text-xs" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded-full bg-[#CD201F] text-white flex items-center justify-center hover:scale-110 transition-transform"
              >
                <FaYoutube className="text-xs" />
              </a>
              <a
                href="https://wa.me/8801970605584"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:scale-110 transition-transform"
              >
                <FaWhatsapp className="text-sm" />
              </a>
            </div>
          </div>

          {/* Column 2: Popular Categories (The 8 English Categories) */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-actionRed pl-2.5">
              Categories
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/shop?category=kitchen" className="hover:text-actionRed transition-colors">
                  Kitchen & Dining
                </Link>
              </li>
              <li>
                <Link to="/shop?category=cleaning" className="hover:text-actionRed transition-colors">
                  Cleaning & Hygiene
                </Link>
              </li>
              <li>
                <Link to="/shop?category=baby-kids" className="hover:text-actionRed transition-colors">
                  Baby & Kids
                </Link>
              </li>
              <li>
                <Link to="/shop?category=beauty" className="hover:text-actionRed transition-colors">
                  Beauty & Personal Care
                </Link>
              </li>
              <li>
                <Link to="/shop?category=melamine-crockery" className="hover:text-actionRed transition-colors">
                  Melamine & Crockery
                </Link>
              </li>
              <li>
                <Link to="/shop?category=toys" className="hover:text-actionRed transition-colors">
                  Toys & Games
                </Link>
              </li>
              <li>
                <Link to="/shop?category=home-household" className="hover:text-actionRed transition-colors">
                  Home & Household
                </Link>
              </li>
              <li>
                <Link to="/shop?category=womens-fashion" className="hover:text-actionRed transition-colors">
                  Women's Fashion & Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-actionRed pl-2.5">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-actionRed transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-actionRed transition-colors">
                  Shop All Products
                </Link>
              </li>
              <li>
                <Link to="/best-selling" className="hover:text-actionRed transition-colors">
                  Best Selling
                </Link>
              </li>
              <li>
                <Link to="/new-arrivals" className="hover:text-actionRed transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/brands" className="hover:text-actionRed transition-colors">
                  Popular Brands
                </Link>
              </li>
              <li>
                <Link to="/hot-offers" className="text-actionRed hover:underline font-semibold flex items-center gap-1">
                  🔥 Hot Offers
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-actionRed transition-colors">
                  Latest Blog Posts
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Customer Help & Newsletter */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider border-l-2 border-actionRed pl-2.5">
              Customer Help
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/track-order" className="hover:text-actionRed transition-colors font-medium text-white">
                  🚚 Track My Order
                </Link>
              </li>
              <li>
                <Link to="/pre-order" className="hover:text-actionRed transition-colors">
                  Pre-Order / Special Request
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-actionRed transition-colors">
                  My Account / Login
                </Link>
              </li>
              <li>
                <span className="text-gray-400">Return & Replacement Policy</span>
              </li>
              <li>
                <span className="text-gray-400">Terms & Conditions</span>
              </li>
            </ul>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <h4 className="text-white font-bold text-xs mb-2">Subscribe for Discounts</h4>
              <form onSubmit={(e) => e.preventDefault()} className="flex items-center">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full bg-gray-900 border border-gray-700 text-xs text-white px-3 py-2 rounded-l-md outline-none focus:border-actionRed placeholder-gray-500"
                />
                <button
                  type="submit"
                  className="bg-actionRed hover:bg-actionRed-hover text-white px-3 py-2 rounded-r-md text-xs font-bold flex items-center justify-center transition-colors shrink-0"
                  aria-label="Subscribe"
                >
                  <FaPaperPlane />
                </button>
              </form>
            </div>

          </div>

        </div>
      </div>

      {/* 3. Bottom Bar: Copyright & Payment Badges */}
      <div className="bg-[#020610] py-5 border-t border-gray-800/80">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} <strong className="text-gray-300">Sarail 1 to 99 Plus Shop</strong>. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="px-2 py-1 rounded bg-gray-900 border border-gray-800 text-[10px] font-semibold text-pink-400">bKash</span>
            <span className="px-2 py-1 rounded bg-gray-900 border border-gray-800 text-[10px] font-semibold text-orange-400">Nagad</span>
            <span className="px-2 py-1 rounded bg-gray-900 border border-gray-800 text-[10px] font-semibold text-purple-400">Rocket</span>
            <span className="px-2 py-1 rounded bg-gray-900 border border-gray-800 text-[10px] font-semibold text-blue-400">VISA</span>
            <span className="px-2 py-1 rounded bg-gray-900 border border-gray-800 text-[10px] font-semibold text-red-400">Mastercard</span>
            <span className="px-2 py-1 rounded bg-gray-900 border border-gray-800 text-[10px] font-semibold text-emerald-400">Cash on Delivery</span>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
