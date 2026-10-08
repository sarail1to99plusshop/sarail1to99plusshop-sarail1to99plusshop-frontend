import { FaFacebookMessenger } from 'react-icons/fa';

const MessengerChatButton = () => {
  const messengerUrl = import.meta.env.VITE_MESSENGER_URL || 'https://m.me/sarail1to99plus';

  return (
    <aside
      aria-label="Customer Support via Messenger"
      className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 z-50 select-none"
    >
      <a
        href={messengerUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat With Us on Messenger"
        title="Chat With Us on Messenger"
        className="group flex items-center gap-2 sm:gap-2.5 transition-all duration-300 ease-out hover:-translate-y-1 focus:outline-none"
      >
        {/* Left Pill: "Chat With Us" */}
        <div className="bg-white border-2 border-[#007AFF] text-[#007AFF] font-bold text-xs sm:text-sm px-4 py-2 sm:px-5 sm:py-2.5 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.08)] group-hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)] group-hover:border-[#0066d6] group-hover:text-[#0066d6] transition-all duration-300 whitespace-nowrap">
          Chat With Us
        </div>

        {/* Right Circle: Messenger Button with Concentric Radial Halo */}
        <div className="relative flex items-center justify-center">
          {/* Smooth Radial Halo Glow */}
          <div
            aria-hidden="true"
            className="absolute -inset-3 sm:-inset-3.5 rounded-full bg-[radial-gradient(circle,rgba(0,122,255,0.28)_0%,rgba(0,122,255,0.12)_60%,rgba(0,122,255,0)_100%)] pointer-events-none transition-transform duration-300 group-hover:scale-110"
          />

          {/* Solid Gradient Messenger Circle */}
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-b from-[#009DFF] to-[#006AFF] text-white flex items-center justify-center shadow-[0_4px_16px_rgba(0,106,255,0.38)] group-hover:shadow-[0_8px_24px_rgba(0,106,255,0.48)] transition-all duration-300 group-hover:scale-105 active:scale-95">
            <FaFacebookMessenger className="text-2xl sm:text-[26px] text-white drop-shadow-xs" />
          </div>
        </div>
      </a>
    </aside>
  );
};

export default MessengerChatButton;
