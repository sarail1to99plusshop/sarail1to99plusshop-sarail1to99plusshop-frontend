import { Link } from 'react-router-dom';
import { FaFacebookF, FaWhatsapp, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { FaTiktok } from 'react-icons/fa6';
import { HiOutlineMail } from 'react-icons/hi';
import { TbTruckDelivery } from 'react-icons/tb';
import { STORE_CONTACT } from '../../utils/contactInfo';

const TopBar = () => {
  return (
    <div className="bg-slate-50 border-b border-slate-200/90 text-xs text-slate-700 py-1 sm:py-1.5 px-2.5 sm:px-4 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Left: Social Media Circles & Store Location */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <a
            href={STORE_CONTACT.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Official Facebook Page"
            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#1558B0] text-white flex items-center justify-center hover:opacity-90 transition-all hover:scale-105 shadow-2xs"
          >
            <FaFacebookF className="text-[10px] sm:text-[11px]" aria-hidden="true" />
          </a>
          <a
            href={STORE_CONTACT.tiktokUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Official TikTok Profile"
            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black text-white flex items-center justify-center hover:opacity-90 transition-all hover:scale-105 shadow-2xs"
          >
            <FaTiktok className="text-[10px] sm:text-[11px]" aria-hidden="true" />
          </a>
          <a
            href={STORE_CONTACT.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#0F7A52] text-white flex items-center justify-center hover:opacity-90 transition-all hover:scale-105 shadow-2xs"
          >
            <FaWhatsapp className="text-[11px] sm:text-[13px]" aria-hidden="true" />
          </a>

          <Link
            to={STORE_CONTACT.addressRoute}
            onClick={() => {
              const el = document.getElementById('store-location');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="inline-flex items-center gap-1 py-0.5 px-1.5 sm:py-1 sm:px-2.5 min-h-[24px] sm:min-h-[28px] rounded-full bg-slate-200/80 hover:bg-slate-300/80 text-charcoal text-[10px] sm:text-[11px] font-bold transition-all shadow-2xs"
            aria-label="Navigate to store location on map"
          >
            <FaMapMarkerAlt className="text-actionRed text-[10px] sm:text-[11px]" aria-hidden="true" />
            <span className="hidden sm:inline">Store Location</span>
            <span className="sm:hidden">Location</span>
          </Link>
        </div>

        {/* Right: Phone (Always visible on mobile & desktop), Email & Track Order (Desktop only) */}
        <div className="flex items-center gap-2 sm:gap-3 text-slate-700 text-[11px] sm:text-xs">
          <a
            href={STORE_CONTACT.phoneTel}
            className="inline-flex items-center gap-1 sm:gap-1.5 py-0.5 px-1 min-h-[24px] sm:min-h-[28px] hover:text-primary transition-colors font-bold tracking-tight text-[11px] sm:text-xs whitespace-nowrap"
            aria-label={`Call us at ${STORE_CONTACT.phoneDisplay}`}
          >
            <FaPhoneAlt className="text-primary text-[9px] sm:text-[10px]" aria-hidden="true" />
            <span>{STORE_CONTACT.phoneDisplay}</span>
          </a>

          <span className="hidden md:inline text-slate-300 select-none" aria-hidden="true">|</span>

          <a
            href={STORE_CONTACT.emailMailto}
            className="hidden md:inline-flex items-center gap-1.5 py-1 px-1 min-h-[28px] hover:text-primary transition-colors font-semibold"
          >
            <HiOutlineMail className="text-primary text-sm" aria-hidden="true" />
            <span>{STORE_CONTACT.email}</span>
          </a>

          <span className="hidden md:inline text-slate-300 select-none" aria-hidden="true">|</span>

          {/* Track order is hidden on mobile header per V1.1 section 21.1 (already present in mobile drawer) */}
          <Link
            to="/track-order"
            className="hidden md:inline-flex items-center gap-1.5 py-1 px-1 min-h-[28px] font-bold text-charcoal hover:text-[#B80D18] transition-colors tracking-wider"
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
