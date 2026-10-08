import { Link } from 'react-router-dom';
import withoutBgLogo from '../assets/Without BG logo.png';
import {
  FiCheckCircle,
  FiShoppingBag,
  FiTruck,
  FiShield,
  FiHeart,
  FiClock,
  FiMapPin,
  FiPhone,
  FiMail,
  FiArrowRight,
  FiAward,
} from 'react-icons/fi';
import { FaFire } from 'react-icons/fa';

const About = () => {
  const highlights = [
    {
      icon: <FiAward className="text-xl text-primary" />,
      title: 'Authentic 1 to 99+ Pricing',
      desc: 'Transparent, honest prices designed to give every household in Sarail and across Bangladesh maximum value on everyday items.',
    },
    {
      icon: <FiShield className="text-xl text-actionRed" />,
      title: 'Handpicked Quality',
      desc: 'Each kitchen tool, melamine dinnerware piece, baby item, and organizer is strictly inspected before dispatch.',
    },
    {
      icon: <FiTruck className="text-xl text-primary" />,
      title: 'Reliable Nationwide Delivery',
      desc: 'Fast island & nationwide courier service with Cash on Delivery (COD) inside Dhaka (৳60) and outside Dhaka (৳120).',
    },
    {
      icon: <FiHeart className="text-xl text-actionRed" />,
      title: 'Customer-First Care',
      desc: 'Local friendly support ready 7 days a week to help with custom orders, inquiries, and prompt pre-orders.',
    },
  ];

  const categories = [
    {
      name: 'Kitchen & Dining',
      desc: 'Non-stick pans, knife sets, spatulas, spice jars, and cooking tools.',
      link: '/shop?category=kitchen',
    },
    {
      name: 'Melamine & Crockery',
      desc: 'Durable floral dinner sets, serving trays, plates, and bowls.',
      link: '/shop?category=melamine-crockery',
    },
    {
      name: 'Cleaning & Hygiene',
      desc: 'Spin mops, multi-surface brushes, organizers, and home sanitizers.',
      link: '/shop?category=cleaning',
    },
    {
      name: 'Baby & Kids Essentials',
      desc: 'BPA-free feeding bottles, gentle silicon bibs, and play accessories.',
      link: '/shop?category=baby-kids',
    },
    {
      name: 'Toys & Games',
      desc: 'Engaging educational toys, building blocks, and family board games.',
      link: '/shop?category=toys',
    },
    {
      name: 'Home & Household',
      desc: 'Space-saving wardrobe organizers, multi-tier shoe racks, and decor.',
      link: '/shop?category=home-household',
    },
  ];

  return (
    <div className="relative min-h-screen bg-slate-50 text-charcoal overflow-hidden">
      {/* Ambient Branded Background Watermark */}
      <div
        className="fixed inset-0 bg-center bg-no-repeat bg-contain opacity-[0.03] pointer-events-none z-0"
        style={{ backgroundImage: `url("${withoutBgLogo}")` }}
        aria-hidden="true"
      />

      {/* 1. Hero Section */}
      <section className="relative z-10 bg-gradient-to-br from-[#002240] via-[#003D73] to-[#002F59] text-white py-14 md:py-20 px-4 overflow-hidden shadow-md">
        {/* Decorative Ambient Background Logo in Hero */}
        <div
          className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-[350px] md:w-[500px] h-[350px] md:h-[500px] bg-center bg-no-repeat bg-contain opacity-10 pointer-events-none"
          style={{ backgroundImage: `url("${withoutBgLogo}")` }}
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="max-w-2xl space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-actionRed animate-pulse" />
              <span>Sarail&apos;s #1 Lifestyle &amp; Variety Destination</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              About <span className="text-white">Sarail 1 to 99</span>
              <span className="text-actionRed">+ Shop</span>
            </h1>

            <p className="text-sm md:text-base text-gray-200 leading-relaxed font-normal">
              Welcome to <strong>Sarail 1 to 99 Plus Shop</strong> — your trusted family shopping
              destination based in the heart of Sarail, Brahmanbaria. We bridge premium household
              quality with honest, budget-friendly 1 to 99+ prices.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                to="/shop"
                className="bg-actionRed hover:bg-actionRed-hover text-white text-xs md:text-sm font-bold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 group"
              >
                <FiShoppingBag className="text-base" />
                <span>Explore All Products</span>
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/hot-offers"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/25 text-xs md:text-sm font-bold px-5 py-3 rounded-lg backdrop-blur-sm transition-all flex items-center gap-2"
              >
                <FaFire className="text-amber-400" />
                <span>Hot Offers &amp; Deals</span>
              </Link>
            </div>
          </div>

          {/* Hero Branding Showcase Card */}
          <div className="w-full lg:w-96 shrink-0">
            <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl text-center space-y-4">
              <div className="relative mx-auto w-36 h-36 flex items-center justify-center bg-white rounded-2xl shadow-lg p-3">
                <img
                  src={withoutBgLogo}
                  alt="Sarail 1 to 99 Plus Shop"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div>
                <h2 className="text-lg font-bold text-white flex items-center justify-center gap-1.5">
                  <span>Sarail 1 to 99+ Shop</span>
                  <FiCheckCircle className="text-actionRed text-sm" />
                </h2>
                <p className="text-xs text-gray-300 mt-1">
                  Shop #14, Main Road, Sarail, Brahmanbaria
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/15 text-left text-xs">
                <div className="bg-white/5 rounded-lg p-2.5">
                  <span className="block text-[10px] text-gray-300 uppercase">Pricing Rule</span>
                  <strong className="text-white font-bold text-xs">1 to 99+ Value</strong>
                </div>
                <div className="bg-white/5 rounded-lg p-2.5">
                  <span className="block text-[10px] text-gray-300 uppercase">Shipping</span>
                  <strong className="text-white font-bold text-xs">All Bangladesh</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Metrics Bar */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 -mt-6">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100 p-2">
          <div className="p-4 text-center">
            <span className="block text-xl md:text-2xl font-black text-primary">5,000+</span>
            <span className="text-xs text-gray-500 font-medium">Happy Customers</span>
          </div>
          <div className="p-4 text-center">
            <span className="block text-xl md:text-2xl font-black text-actionRed">1,000+</span>
            <span className="text-xs text-gray-500 font-medium">Household Products</span>
          </div>
          <div className="p-4 text-center">
            <span className="block text-xl md:text-2xl font-black text-primary">100%</span>
            <span className="text-xs text-gray-500 font-medium">Quality Inspected</span>
          </div>
          <div className="p-4 text-center">
            <span className="block text-xl md:text-2xl font-black text-actionRed">64 Districts</span>
            <span className="text-xs text-gray-500 font-medium">Fast Island &amp; Nationwide Delivery</span>
          </div>
        </div>
      </section>

      {/* 3. Our Story & Purpose */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 py-14 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-actionRed text-xs font-bold uppercase tracking-wider">
              <span className="h-0.5 w-6 bg-actionRed" />
              <span>Who We Are</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-charcoal tracking-tight">
              A Trusted Partner for Everyday Home &amp; Family Essentials
            </h2>

            <div className="space-y-3 text-xs md:text-sm text-gray-600 leading-relaxed">
              <p>
                Founded in <strong>Sarail, Brahmanbaria</strong>, <strong>Sarail 1 to 99 Plus Shop </strong>
                was born from a simple yet powerful idea: households shouldn&apos;t have to overpay for
                everyday essentials. Whether it&apos;s a durable melamine dinner set to host family gatherings,
                non-stick cookware for the kitchen, gentle items for a newborn, or sturdy organizers for the home,
                we curate products that combine dependability with true budget-friendliness.
              </p>
              <p>
                The name <strong>&quot;1 to 99+&quot;</strong> signifies our value-driven approach. We believe
                in fair, transparent pricing that empowers families to shop comfortably with confidence.
                Every item showcased on our platform is carefully verified for build quality and practical utility.
              </p>
              <p>
                With both an in-person outlet on Main Road, Sarail and a fast-growing digital store, we proudly
                serve shoppers in Sarail, across Brahmanbaria, and through reliable delivery across all 64
                districts of Bangladesh.
              </p>
            </div>

            <div className="pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2 bg-white p-3 rounded-lg border border-gray-200">
                  <FiCheckCircle className="text-actionRed shrink-0" />
                  <span>Transparent 1 to 99+ Pricing</span>
                </div>
                <div className="flex items-center gap-2 bg-white p-3 rounded-lg border border-gray-200">
                  <FiCheckCircle className="text-actionRed shrink-0" />
                  <span>Secure Cash on Delivery</span>
                </div>
                <div className="flex items-center gap-2 bg-white p-3 rounded-lg border border-gray-200">
                  <FiCheckCircle className="text-actionRed shrink-0" />
                  <span>Fast Delivery Across Bangladesh</span>
                </div>
                <div className="flex items-center gap-2 bg-white p-3 rounded-lg border border-gray-200">
                  <FiCheckCircle className="text-actionRed shrink-0" />
                  <span>Dedicated Pre-Order Service</span>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Side Banner with Logo Background */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-[#003D73] to-[#001D38] text-white rounded-2xl p-8 md:p-10 shadow-xl overflow-hidden space-y-6">
              {/* Background Logo Texture inside Card */}
              <div
                className="absolute inset-0 bg-center bg-no-repeat bg-contain opacity-15 pointer-events-none"
                style={{ backgroundImage: `url("${withoutBgLogo}")` }}
                aria-hidden="true"
              />

              <div className="relative z-10 space-y-4">
                <span className="inline-block bg-actionRed text-white text-[10px] font-black uppercase px-2.5 py-1 rounded">
                  Our Quality Promise
                </span>

                <h3 className="text-xl md:text-2xl font-black leading-snug">
                  &ldquo;Every product in your home should bring comfort, durability, and true value.&rdquo;
                </h3>

                <p className="text-xs text-gray-300 leading-relaxed">
                  We don&apos;t just sell goods; we inspect every shipment, test utility, and ensure you get
                  the exact product you ordered with total peace of mind.
                </p>

                <div className="pt-4 border-t border-white/20 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-white">Sarail 1 to 99+ Shop</h4>
                    <span className="text-[11px] text-gray-300">Management &amp; Quality Team</span>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center p-2">
                    <img
                      src={withoutBgLogo}
                      alt="Badge"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Core Values Grid */}
      <section className="relative z-10 bg-white py-14 md:py-20 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <div className="inline-flex items-center gap-1.5 text-actionRed text-xs font-bold uppercase tracking-wider">
              <span>Why Customers Choose Us</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-charcoal">
              Our Core Commitments
            </h2>
            <p className="text-xs text-gray-500">
              Built on customer trust, uncompromised durability, and affordable daily utility.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-primary transition-all group space-y-3"
              >
                <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="font-bold text-sm text-charcoal group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. What We Offer (Categories Preview) */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 py-14 md:py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-actionRed text-xs font-bold uppercase tracking-wider mb-1">
              Curated Collections
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-charcoal">
              What You&apos;ll Find In Our Store
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Carefully organized collections covering all essential areas of everyday living.
            </p>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-actionRed transition-colors self-start md:self-auto"
          >
            <span>View All Collections</span>
            <FiArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={cat.link}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:border-primary hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                  0{idx + 1}
                </div>
                <h3 className="font-bold text-sm text-charcoal group-hover:text-primary transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {cat.desc}
                </p>
              </div>

              <div className="pt-4 mt-2 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-actionRed group-hover:translate-x-0.5 transition-transform">
                <span>Browse Products</span>
                <FiArrowRight />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. Physical Store Location & Contact Card */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 pb-16">
        <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white rounded-2xl p-8 md:p-12 shadow-xl overflow-hidden relative">
          {/* Subtle Logo in background */}
          <div
            className="absolute right-0 bottom-0 w-80 h-80 bg-center bg-no-repeat bg-contain opacity-10 pointer-events-none"
            style={{ backgroundImage: `url("${withoutBgLogo}")` }}
            aria-hidden="true"
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-actionRed text-white text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider">
                Visit Us In Person
              </div>

              <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-snug">
                Welcome to Our Physical Outlet in Sarail
              </h2>

              <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                Prefer to inspect products in person or pick up your order directly? Visit our Sarail store!
                Our team is always delighted to assist you with friendly recommendations.
              </p>

              <div className="space-y-3 pt-2 text-xs text-gray-200">
                <div className="flex items-start gap-3">
                  <FiMapPin className="text-actionRed text-base shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Store Address:</strong>
                    <span>Shop #14, Main Road, Sarail, Brahmanbaria, Bangladesh</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FiPhone className="text-actionRed text-base shrink-0" />
                  <div>
                    <strong className="block text-white">Call / WhatsApp:</strong>
                    <span>01970-605584</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FiMail className="text-actionRed text-base shrink-0" />
                  <div>
                    <strong className="block text-white">Support Email:</strong>
                    <span>support@sarail1to99plus.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FiClock className="text-actionRed text-base shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Operating Hours:</strong>
                    <span>Sat – Thu: 9:00 AM – 10:00 PM | Fri: 2:30 PM – 10:00 PM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions / Order Help */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 md:p-8 space-y-4 text-center lg:text-left">
              <h3 className="font-bold text-base text-white">
                Looking for a Specific Item?
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                If you can&apos;t find an item currently in stock, use our Pre-Order feature or reach out directly.
                We frequently source high-demand items upon request.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  to="/pre-order"
                  className="bg-primary hover:bg-primary-light text-white text-xs font-bold px-5 py-2.5 rounded-lg text-center transition-colors"
                >
                  Place a Pre-Order
                </Link>

                <a
                  href="https://wa.me/8801970605584"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold px-5 py-2.5 rounded-lg text-center transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

