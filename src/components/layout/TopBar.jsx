import { Link } from 'react-router-dom';
import { FaFacebookF, FaWhatsapp, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { FaTiktok } from 'react-icons/fa6';
import { HiOutlineMail } from 'react-icons/hi';
import { TbTruckDelivery } from 'react-icons/tb';

const TopBar = () => {
  return (
    <div className="bg-slate-50 border-b border-slate-200/90 text-xs text-slate-700 py-1.5 px-4 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Social Media Circles & Store Location */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <a
            href="https://www.facebook.com/profile.php?id=61565363597487"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Official Facebook Page"
            className="w-7 h-7 rounded-full bg-[#1558B0] text-white flex items-center justify-center hover:opacity-90 transition-all hover:scale-105 shadow-2xs"
          >
            <FaFacebookF className="text-[11px]" aria-hidden="true" />
          </a>
          <a
            href="https://www.tiktok.com/@.1.to.99.shop"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Official TikTok Profile"
            className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center hover:opacity-90 transition-all hover:scale-105 shadow-2xs"
          >
            <FaTiktok className="text-[11px]" aria-hidden="true" />
          </a>
          <a
            href="https://wa.me/8801998789157"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="w-7 h-7 rounded-full bg-[#0F7A52] text-white flex items-center justify-center hover:opacity-90 transition-all hover:scale-105 shadow-2xs"
          >
            <FaWhatsapp className="text-[13px]" aria-hidden="true" />
          </a>

          <Link
            to="/about#store-location"
            onClick={() => {
              const el = document.getElementById('store-location');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="inline-flex items-center gap-1.5 py-1 px-2.5 min-h-[28px] rounded-full bg-slate-200/80 hover:bg-slate-300/80 text-charcoal text-[11px] font-bold transition-all shadow-2xs"
            aria-label="Navigate to store location on map"
          >
            <FaMapMarkerAlt className="text-actionRed text-[11px]" aria-hidden="true" />
            <span>Store Location</span>
          </Link>
        </div>

        {/* Right: Contact & Track Order */}
        <div className="flex items-center gap-3 text-slate-700 text-[11px] sm:text-xs">
          <a
            href="tel:+8801998789157"
            className="inline-flex items-center gap-1.5 py-1 px-1 min-h-[28px] hover:text-primary transition-colors font-semibold"
          >
            <FaPhoneAlt className="text-primary text-[10px]" aria-hidden="true" />
            <span className="tracking-tight">+880 1998-789157</span>
          </a>

          <span className="hidden sm:inline text-slate-300 select-none" aria-hidden="true">|</span>

          <a
            href="mailto:support@sarail1to99plus.com"
            className="hidden sm:inline-flex items-center gap-1.5 py-1 px-1 min-h-[28px] hover:text-primary transition-colors font-semibold"
          >
            <HiOutlineMail className="text-primary text-sm" aria-hidden="true" />
            <span>support@sarail1to99plus.com</span>
          </a>

          <span className="text-slate-300 select-none" aria-hidden="true">|</span>

          <Link
            to="/track-order"
            className="inline-flex items-center gap-1.5 py-1 px-1 min-h-[28px] font-bold text-charcoal hover:text-[#B80D18] transition-colors tracking-wider"
          >
            <TbTruckDelivery className="text-base text-[#B80D18]" aria-hidden="true" />
            <span>TRACK ORDER</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
