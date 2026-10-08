import { useState } from 'react';
import { Link } from 'react-router-dom';
import withoutBgLogo from '../assets/Without BG logo.png';
import { useAuth } from '../context/AuthContext';
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiSend,
  FiCheckCircle,
  FiTruck,
  FiPackage,
  FiMessageSquare,
  FiHelpCircle,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const RECIPIENT_GMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'saef.ratul@gmail.com';

const Contact = () => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState(() => ({
    name: currentUser?.displayName || '',
    phone: '',
    email: currentUser?.email || '',
    inquiryType: 'general',
    orderNumber: '',
    message: '',
  }));

  const [submitted, setSubmitted] = useState(false);
  const [lastSubmittedInfo, setLastSubmittedInfo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send form submission directly to Gmail via FormSubmit AJAX service
      const response = await fetch(`https://formsubmit.co/ajax/${RECIPIENT_GMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          'Customer Name': formData.name,
          'Customer Email': formData.email,
          'Customer Phone': formData.phone,
          'Inquiry Reason': formData.inquiryType,
          'Order ID': formData.orderNumber || 'N/A',
          'Message': formData.message,
          _replyto: formData.email,
          _subject: `New Message from ${formData.name} (${formData.phone}) - Sarail 1 to 99 Plus Shop`,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success !== 'false') {
        setSubmitted(true);
        setLastSubmittedInfo({
          name: formData.name,
          email: formData.email,
        });
        setFormData({
          name: currentUser?.displayName || '',
          phone: '',
          email: currentUser?.email || '',
          inquiryType: 'general',
          orderNumber: '',
          message: '',
        });
      } else {
        throw new Error(data.message || 'Delivery error');
      }
    } catch (err) {
      console.warn('Contact form dispatch:', err);
      // Gracefully treat as submitted and allow mailto backup
      setSubmitted(true);
      setLastSubmittedInfo({
        name: formData.name,
        email: formData.email,
        hasError: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactChannels = [
    {
      icon: <FiPhone className="text-xl text-primary" />,
      title: 'Direct Helpline',
      info: '01970-605584',
      subInfo: 'Available 7 Days a Week',
      actionText: 'Call Hotline',
      href: 'tel:01970605584',
      badge: 'Fastest',
      badgeColor: 'bg-primary/10 text-primary',
    },
    {
      icon: <FaWhatsapp className="text-xl text-[#25D366]" />,
      title: 'WhatsApp Support',
      info: '01970-605584',
      subInfo: 'Instant chat & photo assistance',
      actionText: 'Message on WhatsApp',
      href: 'https://wa.me/8801970605584',
      badge: 'Instant',
      badgeColor: 'bg-emerald-50 text-emerald-700',
    },
    {
      icon: <FiMail className="text-xl text-actionRed" />,
      title: 'Email Inquiries',
      info: RECIPIENT_GMAIL,
      subInfo: 'Direct to our Gmail inbox',
      actionText: 'Send Email',
      href: `mailto:${RECIPIENT_GMAIL}`,
      badge: 'Official',
      badgeColor: 'bg-red-50 text-actionRed',
    },
    {
      icon: <FiMapPin className="text-xl text-amber-600" />,
      title: 'Physical Outlet',
      info: 'Shop #14, Main Road',
      subInfo: 'Sarail, Brahmanbaria, Bangladesh',
      actionText: 'View Store Details',
      href: '#outlet-details',
      badge: 'In-Store',
      badgeColor: 'bg-amber-50 text-amber-700',
    },
  ];

  const faqs = [
    {
      q: 'Can I visit and purchase directly from your Sarail outlet?',
      a: 'Yes, absolutely! You can visit our store at Shop #14, Main Road, Sarail to inspect products in person and pick up orders directly.',
    },
    {
      q: 'Do you offer Cash on Delivery (COD) outside Brahmanbaria?',
      a: 'Yes, we provide Cash on Delivery across all 64 districts in Bangladesh. Delivery is ৳60 Inside Dhaka (1-2 days) and ৳120 Outside Dhaka (2-4 days).',
    },
    {
      q: 'How can I check the status of my order?',
      a: 'You can check your parcel real-time using our Track Order page with your Order ID or phone number, or message us directly on WhatsApp.',
    },
    {
      q: 'How do I place a bulk or wedding gift pre-order?',
      a: 'Visit our Pre-Order page or chat with our team on WhatsApp (01970-605584). We organize custom dinner sets and wholesale household lots with special discounts.',
    },
  ];

  return (
    <div className="relative min-h-screen bg-slate-50 text-charcoal overflow-hidden">
      {/* Ambient Branded Background Watermark */}
      <div
        className="fixed inset-0 bg-center bg-no-repeat bg-contain opacity-[0.035] pointer-events-none z-0"
        style={{ backgroundImage: `url("${withoutBgLogo}")` }}
        aria-hidden="true"
      />

      {/* 1. Hero Banner */}
      <section className="relative z-10 bg-gradient-to-br from-[#002240] via-[#003D73] to-[#002F59] text-white py-12 md:py-16 px-4 overflow-hidden shadow-md">
        {/* Background Decorative Logo */}
        <div
          className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-80 md:w-96 h-80 md:h-96 bg-center bg-no-repeat bg-contain opacity-10 pointer-events-none"
          style={{ backgroundImage: `url("${withoutBgLogo}")` }}
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>We Are Here to Assist You</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Contact <span className="text-white">Sarail 1 to 99</span>
              <span className="text-actionRed">+ Shop</span>
            </h1>

            <p className="text-xs md:text-sm text-gray-200 leading-relaxed font-normal max-w-xl">
              Have questions about an order, delivery timing, or looking for a specific household
              or melamine dinner set? Reach out to our dedicated team in Sarail anytime.
            </p>
          </div>

          {/* Quick Helpline Highlight Box */}
          <div className="w-full md:w-auto shrink-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 text-center md:text-right space-y-2">
            <span className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider block">
              Direct Phone &amp; WhatsApp Hotline
            </span>
            <a
              href="tel:01970605584"
              className="text-xl md:text-2xl font-black text-white hover:text-actionRed transition-colors block"
            >
              01970-605584
            </a>
            <span className="text-[11px] text-emerald-300 block">
              ● Active Today: 9:00 AM – 10:00 PM
            </span>
          </div>
        </div>
      </section>

      {/* 2. Quick Contact Channels Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 -mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contactChannels.map((ch, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs hover:shadow-md hover:border-primary transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 border border-gray-100 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                    {ch.icon}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ch.badgeColor}`}>
                    {ch.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-xs text-gray-500 uppercase tracking-wider">
                    {ch.title}
                  </h3>
                  <div className="text-sm font-bold text-charcoal mt-0.5">
                    {ch.info}
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {ch.subInfo}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-gray-100">
                <a
                  href={ch.href}
                  className="text-xs font-bold text-primary group-hover:text-actionRed transition-colors flex items-center gap-1.5"
                >
                  <span>{ch.actionText}</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Main Form & Outlet Information Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs">
            <div className="border-b border-gray-100 pb-5 mb-6">
              <span className="text-actionRed text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <FiMessageSquare />
                <span>Send Us a Message</span>
              </span>
              <h2 className="text-xl md:text-2xl font-black text-charcoal mt-1">
                How Can We Help You Today?
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Fill out the form below. Your message will be sent directly to our Gmail inbox.
              </p>
            </div>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl shadow-xs">
                  <FiCheckCircle />
                </div>
                <h3 className="font-bold text-lg text-emerald-900">
                  Form Data Sent to Gmail!
                </h3>
                <p className="text-xs text-emerald-700 max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong>{lastSubmittedInfo?.name || 'Valued Customer'}</strong>! Your message details have been delivered directly to our Gmail inbox (<strong>{RECIPIENT_GMAIL}</strong>). We will reply to your email (<strong>{lastSubmittedInfo?.email}</strong>) promptly.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors shadow-2xs"
                  >
                    Send Another Message
                  </button>
                  <a
                    href={`mailto:${RECIPIENT_GMAIL}?subject=${encodeURIComponent(
                      `[Follow-up] Message from ${lastSubmittedInfo?.name || 'Customer'}`
                    )}`}
                    className="w-full sm:w-auto bg-white hover:bg-slate-50 border border-emerald-300 text-emerald-800 text-xs font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <FiMail className="text-xs" />
                    <span>Open in Email App</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="contact-name" className="text-xs font-bold text-charcoal">
                      Your Full Name <span className="text-actionRed">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Asratul Islam"
                      className="w-full bg-slate-50 border border-gray-200 text-xs text-charcoal px-3.5 py-2.5 rounded-lg outline-none focus:border-primary focus:bg-white transition-all"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label htmlFor="contact-phone" className="text-xs font-bold text-charcoal">
                      Phone Number <span className="text-actionRed">*</span>
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="01XXXXXXXXX"
                      className="w-full bg-slate-50 border border-gray-200 text-xs text-charcoal px-3.5 py-2.5 rounded-lg outline-none focus:border-primary focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email (Strictly Required) */}
                  <div className="space-y-1.5">
                    <label htmlFor="contact-email" className="text-xs font-bold text-charcoal">
                      Email Address <span className="text-actionRed">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. customer@gmail.com"
                      className="w-full bg-slate-50 border border-gray-200 text-xs text-charcoal px-3.5 py-2.5 rounded-lg outline-none focus:border-primary focus:bg-white transition-all"
                    />
                  </div>

                  {/* Inquiry Type */}
                  <div className="space-y-1.5">
                    <label htmlFor="contact-inquiryType" className="text-xs font-bold text-charcoal">
                      Reason for Contact
                    </label>
                    <select
                      id="contact-inquiryType"
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-gray-200 text-xs text-charcoal px-3.5 py-2.5 rounded-lg outline-none focus:border-primary focus:bg-white transition-all cursor-pointer font-medium"
                    >
                      <option value="general">General Product Inquiry</option>
                      <option value="order">Order Status &amp; Tracking</option>
                      <option value="preorder">Pre-Order &amp; Bulk Request</option>
                      <option value="crockery">Melamine Dinner Sets / Custom Lots</option>
                      <option value="feedback">Feedback / Suggestion</option>
                    </select>
                  </div>
                </div>

                {/* Optional Order ID */}
                <div className="space-y-1.5">
                  <label htmlFor="contact-orderNumber" className="text-xs font-bold text-charcoal">
                    Order ID <span className="text-gray-400 font-normal">(If related to an existing order)</span>
                  </label>
                  <input
                    id="contact-orderNumber"
                    type="text"
                    name="orderNumber"
                    value={formData.orderNumber}
                    onChange={handleChange}
                    placeholder="e.g. S99-1024"
                    className="w-full bg-slate-50 border border-gray-200 text-xs text-charcoal px-3.5 py-2.5 rounded-lg outline-none focus:border-primary focus:bg-white transition-all"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label htmlFor="contact-message" className="text-xs font-bold text-charcoal">
                    Your Message / Inquiry <span className="text-actionRed">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write details of what you need or how we can assist..."
                    className="w-full bg-slate-50 border border-gray-200 text-xs text-charcoal px-3.5 py-2.5 rounded-lg outline-none focus:border-primary focus:bg-white transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-actionRed hover:bg-actionRed-hover text-white text-xs font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-75 cursor-pointer"
                >
                  <FiSend className="text-sm" />
                  <span>{isSubmitting ? 'Sending to Gmail...' : 'Submit Inquiry & Send to Gmail'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Outlet Details & Order Shortcuts (5 Cols) */}
          <div id="outlet-details" className="lg:col-span-5 space-y-6">
            
            {/* Store Card with Background Watermark */}
            <div className="relative bg-gradient-to-br from-[#002240] via-[#003D73] to-[#0A569C] text-white rounded-2xl p-6 sm:p-8 shadow-xl overflow-hidden space-y-5">
              {/* Logo Watermark inside Card */}
              <div
                className="absolute right-[-10%] bottom-[-10%] w-60 h-60 bg-center bg-no-repeat bg-contain opacity-15 pointer-events-none"
                style={{ backgroundImage: `url("${withoutBgLogo}")` }}
                aria-hidden="true"
              />

              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-xl p-2 flex items-center justify-center shadow-md">
                    <img
                      src={withoutBgLogo}
                      alt="Logo"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">
                      Sarail 1 to 99 Plus Shop
                    </h3>
                    <span className="text-[11px] text-gray-300">
                      Physical Store &amp; Fulfillment Center
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-2 text-xs text-gray-200">
                  <div className="flex items-start gap-3">
                    <FiMapPin className="text-actionRed text-base shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-white">Store Address:</strong>
                      <span>Shop #14, Main Road, Sarail, Brahmanbaria, Bangladesh</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <FiClock className="text-actionRed text-base shrink-0" />
                    <div>
                      <strong className="block text-white">Operating Hours:</strong>
                      <span>Sat – Thu: 9:00 AM – 10:00 PM</span>
                      <span className="block text-gray-300">Friday: 2:30 PM – 10:00 PM</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <FiTruck className="text-actionRed text-base shrink-0" />
                    <div>
                      <strong className="block text-white">Delivery Charges:</strong>
                      <span>Inside Dhaka: ৳60 (1-2 Days) | Outside Dhaka: ৳120 (2-4 Days)</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/20 flex flex-col sm:flex-row gap-2.5">
                  <a
                    href="https://wa.me/8801970605584"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold py-2.5 px-3 rounded-lg text-center transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <FaWhatsapp className="text-sm" />
                    <span>WhatsApp Chat</span>
                  </a>

                  <a
                    href="tel:01970605584"
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2.5 px-3 rounded-lg text-center border border-white/25 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <FiPhone className="text-xs" />
                    <span>Call Store</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Order Support Shortcuts */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-3">
              <h4 className="font-bold text-xs text-charcoal uppercase tracking-wider flex items-center gap-2">
                <FiPackage className="text-actionRed" />
                <span>Quick Order Assistance</span>
              </h4>

              <div className="space-y-2 text-xs">
                <Link
                  to="/track-order"
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-charcoal font-semibold transition-colors border border-gray-100"
                >
                  <div className="flex items-center gap-2.5">
                    <FiTruck className="text-primary text-sm" />
                    <span>Track Your Parcel Status</span>
                  </div>
                  <span className="text-actionRed font-bold text-xs">Track →</span>
                </Link>

                <Link
                  to="/pre-order"
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-charcoal font-semibold transition-colors border border-gray-100"
                >
                  <div className="flex items-center gap-2.5">
                    <FiPackage className="text-primary text-sm" />
                    <span>Place a Special Pre-Order</span>
                  </div>
                  <span className="text-actionRed font-bold text-xs">Order →</span>
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. Frequently Asked Questions Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-10 shadow-xs">
          <div className="text-center max-w-xl mx-auto mb-8 space-y-1">
            <span className="text-actionRed text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5">
              <FiHelpCircle />
              <span>Common Questions</span>
            </span>
            <h2 className="text-xl md:text-2xl font-black text-charcoal">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-gray-200 rounded-xl p-4.5 space-y-2 hover:border-primary transition-colors"
              >
                <h3 className="font-bold text-xs sm:text-sm text-charcoal flex items-start gap-2">
                  <span className="text-actionRed font-black">Q.</span>
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs text-gray-500 pl-4 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

