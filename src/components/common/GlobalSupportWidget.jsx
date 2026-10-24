import { useState, useRef, useEffect } from 'react';
import { FaFacebookMessenger, FaWhatsapp } from 'react-icons/fa';
import { FiMessageSquare, FiX } from 'react-icons/fi';
import { STORE_CONTACT } from '../../utils/contactInfo';

const GlobalSupportWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const widgetRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Periodic subtle tooltip ("Chat with us") when collapsed (Section 15)
  useEffect(() => {
    if (isOpen) {
      return undefined;
    }

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      return undefined;
    }

    let showTimeoutId;
    let hideTimeoutId;
    let isCancelled = false;

    const scheduleTooltipCycle = () => {
      if (isCancelled || document.hidden) return;

      // Wait 3 seconds before showing tooltip
      showTimeoutId = setTimeout(() => {
        if (isCancelled || document.hidden) return;
        setShowTooltip(true);

        // Keep visible for ~1.8 seconds
        hideTimeoutId = setTimeout(() => {
          if (isCancelled) return;
          setShowTooltip(false);
          // Repeat cycle
          scheduleTooltipCycle();
        }, 1800);
      }, 3000);
    };

    scheduleTooltipCycle();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setShowTooltip(false);
        clearTimeout(showTimeoutId);
        clearTimeout(hideTimeoutId);
      } else {
        scheduleTooltipCycle();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isCancelled = true;
      clearTimeout(showTimeoutId);
      clearTimeout(hideTimeoutId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isOpen]);

  const messengerUrl =
    import.meta.env.VITE_MESSENGER_URL || 'https://m.me/61565363597487';
  const whatsappUrl = STORE_CONTACT.whatsappPrefillUrl;

  return (
    <aside
      ref={widgetRef}
      aria-label="Customer Support Help Widget"
      className="fixed bottom-6 right-5 sm:bottom-8 sm:right-8 z-40 select-none print:hidden pointer-events-auto"
    >
      <div className="flex flex-col items-end gap-3 relative">
        {/* Expanded Support Options */}
        {isOpen && (
          <div
            id="support-channel-options"
            className="flex flex-col items-end gap-3 transition-all duration-200 animate-in fade-in slide-in-from-bottom-2"
          >
            {/* Messenger Option */}
            <a
              href={messengerUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with us on Facebook Messenger (opens in a new tab)"
              className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-[#0084FF] rounded-full"
            >
              <span className="bg-white text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-md border border-slate-200 opacity-90 group-hover:opacity-100 group-hover:shadow-lg transition-all">
                Messenger
              </span>
              <div className="w-12 h-12 rounded-full bg-[#0084FF] hover:bg-[#0073e6] text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 active:scale-95">
                <FaFacebookMessenger className="text-2xl text-white" aria-hidden="true" />
              </div>
            </a>

            {/* WhatsApp Option */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Chat with us on WhatsApp ${STORE_CONTACT.phoneDisplay} (opens in a new tab)`}
              className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-[#25D366] rounded-full"
            >
              <span className="bg-white text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-md border border-slate-200 opacity-90 group-hover:opacity-100 group-hover:shadow-lg transition-all">
                WhatsApp
              </span>
              <div className="w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 active:scale-95">
                <FaWhatsapp className="text-2xl text-white" aria-hidden="true" />
              </div>
            </a>
          </div>
        )}

        {/* Floating Support Trigger Button & Message Tooltip Container */}
        <div className={`relative flex items-center ${!isOpen ? 'animate-float-subtle' : ''}`}>
          {/* Subtle Periodic Message Tooltip (Section 15) */}
          {showTooltip && !isOpen && (
            <div
              aria-hidden="true"
              className="absolute right-[62px] top-1/2 -translate-y-1/2 whitespace-nowrap bg-white text-slate-800 font-bold text-xs py-1.5 px-3 rounded-full shadow-lg border border-slate-200 pointer-events-none transition-all duration-300 animate-fadeIn flex items-center gap-1.5"
            >
              <span>Chat with us</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              {/* Tooltip caret pointing to the trigger button */}
              <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-white border-t border-r border-slate-200 rotate-45" />
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-controls="support-channel-options"
            aria-label={isOpen ? 'Close support options' : 'Need help? Open support chat options'}
            className={`w-[52px] h-[52px] rounded-full text-white flex items-center justify-center shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#112b45] cursor-pointer ${
              isOpen
                ? 'bg-[#112b45] rotate-90 scale-95'
                : 'bg-[#112b45] hover:bg-[#1a3d60] hover:scale-105 active:scale-95'
            }`}
          >
            {isOpen ? (
              <FiX className="text-2xl text-white stroke-[2.5]" aria-hidden="true" />
            ) : (
              <FiMessageSquare className="text-2xl text-white fill-white/20" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default GlobalSupportWidget;

