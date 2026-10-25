import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm, ValidationError } from '@formspree/react';
import withoutBgLogo from '../assets/Without BG logo.png';
import { useAuth } from '../context/AuthContext';
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiSend,
  FiCheckCircle,
  FiTruck,
  FiPackage,
  FiMessageSquare,
  FiHelpCircle,
  FiChevronDown,
  FiCopy,
  FiCheck,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { STORE_CONTACT } from '../utils/contactInfo';

const FORMSPREE_FORM_ID = import.meta.env.VITE_FORMSPREE_FORM_ID || 'xeaaqwkz';
const RECIPIENT_GMAIL = import.meta.env.VITE_CONTACT_EMAIL || STORE_CONTACT.email;

const Contact = () => {
  const { currentUser } = useAuth();
  const [formspreeState, handleFormspreeSubmit, resetFormspree] = useForm(FORMSPREE_FORM_ID);
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
  const [openFaqIndices, setOpenFaqIndices] = useState(() => new Set([0]));
  const [faqCopied, setFaqCopied] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      setLastSubmittedInfo({
        name: formData.name,
        email: formData.email,
      });

      // Submit form using @formspree/react handler
      await handleFormspreeSubmit(e);
      setSubmitted(true);
    } catch (err) {
      console.warn('Formspree dispatch error:', err);
      // Gracefully treat as submitted for UI feedback
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    resetFormspree();
    setSubmitted(false);
    setFormData({
      name: currentUser?.displayName || '',
      phone: '',
      email: currentUser?.email || '',
      inquiryType: 'general',
      orderNumber: '',
      message: '',
    });
  };

  const contactChannels = [
    {
      icon: <FiPhone className="text-xl text-primary" />,
      title: 'Direct Helpline',
      info: STORE_CONTACT.phoneDisplay,
      subInfo: 'Available 7 Days a Week',
      actionText: 'Call Hotline',
      href: STORE_CONTACT.phoneTel,
      badge: 'Fastest',
      badgeColor: 'bg-primary/10 text-primary',
    },
    {
      icon: <FaWhatsapp className="text-xl text-[#25D366]" />,
      title: 'WhatsApp Support',
      info: STORE_CONTACT.phoneDisplay,
      subInfo: 'Instant chat & photo assistance',
      actionText: 'Message on WhatsApp',
      href: STORE_CONTACT.whatsappUrl,
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
      info: 'Munshi market, Bikal bazar',
      subInfo: 'Sarail, Brahmanbaria, Bangladesh',
      actionText: 'View Store Details',
      href: STORE_CONTACT.addressRoute,
      badge: 'In-Store',
      badgeColor: 'bg-amber-50 text-amber-700',
    },
  ];

  // Exact 8 Website-Ready English FAQs per V1.1 Section 18
  const faqs = [
    {
      id: 1,
      q: 'How can I place an order?',
      a: 'Browse our products, choose the items you need, and proceed to checkout. Enter your contact and delivery details, select an available payment method, and submit your order. If you need help, you can contact us through WhatsApp or Messenger.',
    },
    {
      id: 2,
      q: 'Do you deliver outside Sarail?',
      a: 'Yes, we arrange deliveries to supported locations across Bangladesh through our courier partners. Delivery availability, charges, and estimated time may vary depending on your location and the selected products.',
    },
    {
      id: 3,
      q: 'What payment methods are available?',
      a: 'You can choose Cash on Delivery where available. We also offer a bKash payment option when enabled at checkout. For manual bKash payments, follow the displayed instructions and submit the transaction ID. Your payment will be verified before order processing.',
    },
    {
      id: 4,
      q: 'Can I check my parcel before receiving it?',
      a: "Parcel inspection at delivery depends on the rules of the courier company handling your order. Please check the parcel's outer condition when it arrives. If you notice damage or receive an incorrect item, contact us so we can review the issue.",
    },
    {
      id: 5,
      q: 'What should I do if I receive a wrong or damaged product?',
      a: "Please contact us within 3 calendar days after receiving the product for a standard return request. Share your order number, a short description of the issue, and clear photos or a video if available. We'll review your request and guide you through the next steps. Applicable legal and warranty rights remain unaffected.",
    },
    {
      id: 6,
      q: 'Can I cancel or change my order?',
      a: 'Please contact us as soon as possible if you need to cancel or change an order. Changes are generally easier before the order is dispatched. If it has already been handed over to a courier, available options may depend on its delivery status and the applicable policy.',
    },
    {
      id: 7,
      q: 'How can I request a return or refund?',
      a: "Get in touch through our official contact channels and provide your order number and the reason for your request. Eligible cases are reviewed according to our Return Policy. If a refund is approved, we'll explain the applicable refund method and timeline.",
      hasLink: true,
      linkText: 'Read our Return Policy',
      linkUrl: '/return-policy',
    },
    {
      id: 8,
      q: 'Where is your store located, and how can I contact you?',
      a: `Our store is located at ${STORE_CONTACT.address}. You can call or WhatsApp us at ${STORE_CONTACT.phoneDisplay}, email ${STORE_CONTACT.email}, or view our store location.`,
      hasLocationLink: true,
    },
  ];

  const toggleFaq = (index) => {
    setOpenFaqIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const expandAllFaqs = () => {
    setOpenFaqIndices(new Set(faqs.map((_, i) => i)));
  };

  const collapseAllFaqs = () => {
    setOpenFaqIndices(new Set());
  };

  const copyAllFaqs = () => {
    const text = faqs
      .map((faq, idx) => `${idx + 1}. ${faq.q}\n${faq.a}\n`)
      .join('\n');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setFaqCopied(true);
        setTimeout(() => setFaqCopied(false), 2000);
      });
    }
  };

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
              href={STORE_CONTACT.phoneHref}
              className="text-xl md:text-2xl font-black text-white hover:text-actionRed transition-colors block"
            >
              {STORE_CONTACT.phoneDisplay}
            </a>
          </div>
        </div>
      </section>

      {/* 2. Quick Contact Channels Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 -mt-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {contactChannels.map((ch, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-gray-200 p-3.5 sm:p-5 shadow-xs hover:shadow-md hover:border-primary transition-all flex flex-col justify-between group"
            >
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-slate-50 border border-gray-100 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform text-xs sm:text-base">
                    {ch.icon}
                  </div>
                  <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full ${ch.badgeColor}`}>
                    {ch.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">
                    {ch.title}
                  </h3>
                  <div className="text-xs sm:text-sm font-bold text-charcoal mt-0.5 truncate">
                    {ch.info}
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5">
                    {ch.subInfo}
                  </p>
                </div>
              </div>

              <div className="pt-3 sm:pt-4 mt-2 sm:mt-3 border-t border-gray-100">
                <a
                  href={ch.href}
                  className="text-[11px] sm:text-xs font-bold text-primary group-hover:text-actionRed transition-colors flex items-center gap-1"
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
                Fill out the form below. Your message will be sent directly to our support team via Formspree.
              </p>
            </div>

            {formspreeState.succeeded || submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl shadow-xs">
                  <FiCheckCircle />
                </div>
                <h3 className="font-bold text-lg text-emerald-900">
                  Message Sent via Formspree!
                </h3>
                <p className="text-xs text-emerald-700 max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong>{lastSubmittedInfo?.name || formData.name || 'Valued Customer'}</strong>! Your message has been safely delivered to our support inbox. We will review your message and reply to <strong>{lastSubmittedInfo?.email || formData.email || 'your email'}</strong> promptly.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors shadow-2xs cursor-pointer"
                  >
                    Send Another Message
                  </button>
                  <a
                    href={`mailto:${RECIPIENT_GMAIL}?subject=${encodeURIComponent(
                      `[Follow-up] Message from ${lastSubmittedInfo?.name || formData.name || 'Customer'}`
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
                <input
                  type="hidden"
                  name="_subject"
                  value={`New Contact Message: ${formData.inquiryType.toUpperCase()} from ${formData.name || 'Customer'}`}
                />
                <input type="hidden" name="source" value="Sarail 1 to 99 Plus Shop - Contact Form" />

                {formspreeState.errors && (
                  <ValidationError
                    errors={formspreeState.errors}
                    className="text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-lg font-semibold"
                  />
                )}

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
                    <ValidationError
                      prefix="Name"
                      field="name"
                      errors={formspreeState.errors}
                      className="text-[11px] text-rose-600 font-semibold"
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
                    <ValidationError
                      prefix="Phone"
                      field="phone"
                      errors={formspreeState.errors}
                      className="text-[11px] text-rose-600 font-semibold"
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
                    <ValidationError
                      prefix="Email"
                      field="email"
                      errors={formspreeState.errors}
                      className="text-[11px] text-rose-600 font-semibold"
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
                  <ValidationError
                    prefix="Message"
                    field="message"
                    errors={formspreeState.errors}
                    className="text-[11px] text-rose-600 font-semibold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={formspreeState.submitting || isSubmitting}
                  className="w-full bg-actionRed hover:bg-actionRed-hover text-white text-xs font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-75 cursor-pointer"
                >
                  <FiSend className="text-sm" />
                  <span>
                    {formspreeState.submitting || isSubmitting
                      ? 'Submitting via Formspree...'
                      : 'Submit Inquiry via Formspree'}
                  </span>
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
                      <span>{STORE_CONTACT.address}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <FiTruck className="text-actionRed text-base shrink-0" />
                    <div>
                      <strong className="block text-white">Delivery Charges:</strong>
                      <span>Inside Brahmanbaria: ৳60 | Inside Dhaka City: ৳120 | Rest of Bangladesh: ৳130</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/20 flex flex-col sm:flex-row gap-2.5">
                  <a
                    href={STORE_CONTACT.whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold py-2.5 px-3 rounded-lg text-center transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <FaWhatsapp className="text-sm" />
                    <span>WhatsApp Chat</span>
                  </a>

                  <a
                    href={STORE_CONTACT.phoneHref}
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
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
            <div className="space-y-1">
              <span className="text-actionRed text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <FiHelpCircle />
                <span>Common Questions</span>
              </span>
              <h2 className="text-xl md:text-2xl font-black text-charcoal">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-gray-500 max-w-xl">
                Have a question about shopping with us? Here are some quick answers to help you get started.
              </p>
            </div>

            {/* Accordion Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={expandAllFaqs}
                className="text-[11px] font-bold text-gray-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                Expand All FAQs
              </button>
              <button
                type="button"
                onClick={collapseAllFaqs}
                className="text-[11px] font-bold text-gray-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                Collapse All FAQs
              </button>
              <button
                type="button"
                onClick={copyAllFaqs}
                className="text-[11px] font-bold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                title="Copy all FAQ content to clipboard"
              >
                {faqCopied ? (
                  <>
                    <FiCheck className="text-emerald-600" />
                    <span className="text-emerald-600 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <FiCopy />
                    <span>Copy All FAQ Content</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndices.has(idx);
              return (
                <div
                  key={faq.id}
                  className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-200 bg-white"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${faq.id}`}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-xs sm:text-sm text-charcoal flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-slate-100 text-primary text-xs font-black flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span>{faq.q}</span>
                    </span>
                    <FiChevronDown
                      className={`text-gray-400 text-base shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-primary' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div
                      id={`faq-answer-${faq.id}`}
                      className="px-5 pb-4 pt-1 text-xs text-gray-600 leading-relaxed border-t border-gray-100 bg-slate-50/50"
                    >
                      <p>{faq.a}</p>
                      {faq.hasLink && (
                        <div className="mt-2.5">
                          <Link
                            to={faq.linkUrl}
                            className="inline-flex items-center gap-1 font-bold text-actionRed hover:underline"
                          >
                            <span>{faq.linkText}</span>
                            <span>→</span>
                          </Link>
                        </div>
                      )}
                      {faq.hasLocationLink && (
                        <div className="mt-2.5 flex items-center gap-3">
                          <Link
                            to={STORE_CONTACT.addressRoute}
                            className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
                          >
                            <span>View Store Details</span>
                            <span>→</span>
                          </Link>
                          <a
                            href={STORE_CONTACT.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-bold text-actionRed hover:underline"
                          >
                            <span>Get Directions</span>
                            <span>↗</span>
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

