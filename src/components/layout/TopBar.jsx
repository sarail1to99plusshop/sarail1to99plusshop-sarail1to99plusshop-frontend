import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp, FaPhoneAlt } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
import { TbTruckDelivery } from 'react-icons/tb';

const TopBar = () => {
  return (
    <div className="bg-slate-50 border-b border-slate-200/90 text-xs text-slate-600 py-1.5 px-4 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Social Media Circles */}
        <div className="flex items-center space-x-2">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="w-6 h-6 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90 transition-all hover:scale-105 shadow-2xs"
          >
            <FaFacebookF className="text-[11px]" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="w-6 h-6 rounded-full bg-[#E1306C] text-white flex items-center justify-center hover:opacity-90 transition-all hover:scale-105 shadow-2xs"
          >
            <FaInstagram className="text-[12px]" />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="w-6 h-6 rounded-full bg-[#FF0000] text-white flex items-center justify-center hover:opacity-90 transition-all hover:scale-105 shadow-2xs"
          >
            <FaYoutube className="text-[11px]" />
          </a>
          <a
            href="https://wa.me/8801970605584"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="w-6 h-6 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:opacity-90 transition-all hover:scale-105 shadow-2xs"
          >
            <FaWhatsapp className="text-[13px]" />
          </a>
        </div>

        {/* Right: Contact & Track Order */}
        <div className="flex items-center space-x-3 text-slate-600 text-[11px] sm:text-xs">
          <a
            href="tel:01970605584"
            className="flex items-center gap-1.5 hover:text-primary transition-colors font-medium"
          >
            <FaPhoneAlt className="text-primary text-[10px]" />
            <span className="tracking-tight">01970-605584</span>
          </a>

          <span className="text-slate-300">|</span>

          <a
            href="mailto:support@sarail1to99plus.com"
            className="flex items-center gap-1.5 hover:text-primary transition-colors font-medium"
          >
            <HiOutlineMail className="text-primary text-sm" />
            <span>support@sarail1to99plus.com</span>
          </a>

          <span className="text-slate-300">|</span>

          <Link
            to="/track-order"
            className="flex items-center gap-1.5 font-bold text-charcoal hover:text-actionRed transition-colors tracking-wider"
          >
            <TbTruckDelivery className="text-base text-actionRed" />
            <span>TRACK ORDER</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TopBar;


