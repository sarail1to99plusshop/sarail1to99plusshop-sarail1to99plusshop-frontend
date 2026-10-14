import { useState, useRef, useEffect } from 'react';
import { FaFacebookMessenger, FaWhatsapp } from 'react-icons/fa';
import { FiMessageSquare, FiX } from 'react-icons/fi';

const GlobalSupportWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
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

  const messengerUrl =
    import.meta.env.VITE_MESSENGER_URL || 'https://m.me/61565363597487';
  const whatsappUrl =
    'https://wa.me/8801998789157?text=Hello%2C%20I%20need%20assistance%20with%20Sarail%201%20to%2099%2B%20Shop.';

  return (
    <aside
      ref={widgetRef}
      aria-label="Customer Support Help Widget"
      className="fixed bottom-6 right-5 sm:bottom-8 sm:right-8 z-40 select-none print:hidden pointer-events-auto"
    >
      <div className="flex flex-col items-end gap-3">
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
              aria-label="Chat with us on WhatsApp +880 1998-789157 (opens in a new tab)"
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

        {/* Floating Support Trigger Button */}
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
    </aside>
  );
};

export default GlobalSupportWidget;

