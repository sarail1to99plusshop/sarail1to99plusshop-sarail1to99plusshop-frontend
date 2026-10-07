import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp, FaPhoneAlt } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
import { TbTruckDelivery } from 'react-icons/tb';

const TopBar = () => {
  return (
    <div className="bg-white border-b border-gray-200 text-xs text-gray-700 py-1.5 px-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Social Media Circles */}
        <div className="flex items-center space-x-2">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="w-6 h-6 rounded-full bg-[#3B5998] text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-xs"
          >
            <FaFacebookF className="text-[11px]" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="w-6 h-6 rounded-full bg-[#6B1D2F] text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-xs"
          >
            <FaInstagram className="text-[12px]" />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="w-6 h-6 rounded-full bg-[#CD201F] text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-xs"
          >
            <FaYoutube className="text-[11px]" />
          </a>
          <a
            href="https://wa.me/8801970605584"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="w-6 h-6 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-xs"
          >
            <FaWhatsapp className="text-[13px]" />
          </a>
        </div>

        {/* Right: Contact & Track Order */}
        <div className="flex items-center space-x-3 text-gray-700 text-[11px] sm:text-xs">
          <a
            href="tel:01970605584"
            className="flex items-center gap-1.5 hover:text-primary transition-colors"
          >
            <FaPhoneAlt className="text-gray-600 text-[10px]" />
            <span className="font-medium tracking-tight">01970-605584</span>
          </a>

          <span className="text-gray-300">|</span>

          <a
            href="mailto:support@sarail1to99plus.com"
            className="flex items-center gap-1.5 hover:text-primary transition-colors"
          >
            <HiOutlineMail className="text-gray-600 text-sm" />
            <span>support@sarail1to99plus.com</span>
          </a>

          <span className="text-gray-300">|</span>

          <Link
            to="/track-order"
            className="flex items-center gap-1.5 font-semibold text-gray-800 hover:text-actionRed transition-colors tracking-wider"
          >
            <TbTruckDelivery className="text-base text-gray-700" />
            <span>TRACK ORDER</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TopBar;

