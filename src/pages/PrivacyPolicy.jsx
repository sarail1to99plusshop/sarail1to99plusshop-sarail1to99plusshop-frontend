import { Link } from 'react-router-dom';
import { FiArrowLeft, FiPhone, FiMail, FiShield } from 'react-icons/fi';
import { FaWhatsapp, FaFacebookF } from 'react-icons/fa';
import { STORE_CONTACT } from '../utils/contactInfo';

const PrivacyPolicy = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8 text-slate-800">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-10 md:p-12 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-primary transition-colors">
            <FiArrowLeft />
            <span>Back to Home</span>
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Privacy Policy</span>
        </div>

        {/* Header */}
        <div className="border-b border-gray-200 pb-6 space-y-2">
          <div className="inline-block bg-[#e9eff4] text-[#33536c] font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
            Legal &amp; Privacy
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#102338] leading-tight">
            Privacy Policy
          </h1>
          <p className="text-sm font-semibold text-slate-600">
            Sarail 1 to 99+ Shop
          </p>
        </div>

        {/* 1. Introduction */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#102338] border-l-4 border-[#112b45] pl-3">
            1. Introduction
          </h2>
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
            <p>Welcome to <strong>Sarail 1 to 99+ Shop</strong>!</p>
            <p>
              Your privacy matters to us. We understand that when you shop online, you&apos;re trusting us with your personal information, and we take that responsibility seriously.
            </p>
            <p>
              This Privacy Policy explains what information we collect, why we collect it, how we use it, and what we do to keep it safe when you visit our website, browse our products, or place an order.
            </p>
            <p>
              By using our website, you acknowledge the information practices described in this policy. We encourage you to read it so you can shop with confidence and understand how your information is handled.
            </p>
          </div>
        </section>

        {/* 2. Information We Collect */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#102338] border-l-4 border-[#112b45] pl-3">
            2. Information We Collect
          </h2>
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3">
            <p>
              To provide a smooth and reliable shopping experience, we may collect certain information when you interact with our website.
            </p>

            <h3 className="font-bold text-slate-900 text-sm">Personal Information</h3>
            <p>When you place an order, contact us, or create an account (if available), we may collect:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Your full name</li>
              <li>Mobile phone number</li>
              <li>Email address, if provided</li>
              <li>Billing and delivery address</li>
              <li>Order details and purchase history</li>
              <li>Information you share when contacting customer support</li>
            </ul>
            <p>We only ask for information reasonably necessary to process orders, deliver products, and provide customer service.</p>

            <h3 className="font-bold text-slate-900 text-sm pt-2">Payment Information</h3>
            <p>
              Depending on the available options, you may pay through Cash on Delivery (COD), mobile financial services (such as bKash), or other supported payment methods. When you make a payment, relevant transaction information may be processed to confirm your order and maintain accurate payment records. If payments are handled by third-party providers, their systems and privacy practices may also apply. <strong>We do not ask customers to share payment passwords, PINs, or one-time verification codes.</strong>
            </p>

            <h3 className="font-bold text-slate-900 text-sm pt-2">Automatically Collected Information</h3>
            <p>When you visit our website, certain technical information may be collected automatically, such as:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>IP address</li>
              <li>Browser type and device information</li>
              <li>Pages visited and browsing activity</li>
              <li>Date and time of visits</li>
              <li>Cookies and similar website technologies</li>
            </ul>
            <p>This information helps us understand how visitors use our website, identify technical issues, and improve the shopping experience.</p>
          </div>
        </section>

        {/* 3. How We Use Your Information */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#102338] border-l-4 border-[#112b45] pl-3">
            3. How We Use Your Information
          </h2>
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
            <p>We use customer information to operate our online store and provide the services you expect. This may include:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Processing and confirming orders</li>
              <li>Arranging packaging, shipping, and delivery</li>
              <li>Contacting you about order status</li>
              <li>Responding to questions, complaints, and support requests</li>
              <li>Handling returns, refunds, and cancellations</li>
              <li>Maintaining order and transaction records</li>
              <li>Improving website performance and usability</li>
              <li>Detecting suspicious activity and preventing fraud</li>
              <li>Meeting applicable legal and regulatory requirements</li>
            </ul>
            <p>
              We may also use your contact information to share relevant offers, promotions, or store updates where permitted by law and, when required, with your consent. You can request to stop receiving promotional communications at any time. We do not use personal information for unrelated purposes without an appropriate legal basis.
            </p>
          </div>
        </section>

        {/* 4. How We Share Your Information */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#102338] border-l-4 border-[#112b45] pl-3">
            4. How We Share Your Information
          </h2>
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
            <p>
              We respect your privacy and <strong>do not sell</strong> your personal information to third parties. However, we may share limited information with trusted service providers when necessary to complete an order or operate our website:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Delivery and Courier Partners:</strong> We may share your name, phone number, delivery address, and relevant order information with courier or delivery partners (including Steadfast or other providers we use) so they can deliver your products.</li>
              <li><strong>Payment Service Providers:</strong> When you use an online payment method, relevant payment and transaction details may be processed by the payment provider to complete or verify the transaction.</li>
              <li><strong>Website and Technical Service Providers:</strong> Our hosting, website maintenance, security, analytics, or other technical service providers may process limited information as needed to provide their services.</li>
              <li><strong>Legal Requirements:</strong> We may disclose information when required by applicable law, a valid legal process, or an authorized government authority.</li>
            </ul>
          </div>
        </section>

        {/* 5. Cookies and Website Technologies */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#102338] border-l-4 border-[#112b45] pl-3">
            5. Cookies and Website Technologies
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Our website may use cookies and similar technologies to make browsing easier and improve functionality. Cookies are small files stored on your device that help websites remember certain information. Depending on the features enabled, cookies may be used to keep your shopping cart working properly, remember website preferences, understand website traffic, and improve the shopping experience. You can manage or disable cookies through your browser settings.
          </p>
        </section>

        {/* 6. How We Protect Your Information */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#102338] border-l-4 border-[#112b45] pl-3">
            6. How We Protect Your Information
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Keeping your information secure is important to us. We aim to use reasonable technical and organizational safeguards to protect personal information from unauthorized access, misuse, alteration, or disclosure. These include secure website connections (HTTPS/SSL), restricted access to customer records, and appropriate measures provided by our hosting and service partners.
          </p>
        </section>

        {/* 7. How Long We Keep Your Information */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#102338] border-l-4 border-[#112b45] pl-3">
            7. How Long We Keep Your Information
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            We retain personal information only for as long as reasonably necessary to fulfill the purposes described in this policy, such as processing deliveries and refunds, maintaining business and accounting records, resolving disputes, and meeting legal or regulatory obligations. When information is no longer needed, we take reasonable steps to delete, anonymize, or securely dispose of it.
          </p>
        </section>

        {/* 8. Your Privacy Rights and Choices */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#102338] border-l-4 border-[#112b45] pl-3">
            8. Your Privacy Rights and Choices
          </h2>
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-1">
            <p>Subject to applicable laws and verification requirements, you may contact us to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Request access to personal information we hold about you</li>
              <li>Correct inaccurate or outdated information</li>
              <li>Request deletion of information that is no longer required</li>
              <li>Withdraw consent for activities that rely on your consent</li>
              <li>Opt out of promotional messages</li>
            </ul>
          </div>
        </section>

        {/* 9. Third-Party Websites and Services */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#102338] border-l-4 border-[#112b45] pl-3">
            9. Third-Party Websites and Services
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Our website may contain links to external websites, social media platforms, courier services, or payment providers. These services operate independently and have their own privacy policies. We recommend reviewing their privacy policies before sharing personal information.
          </p>
        </section>

        {/* 10. Children's Privacy */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#102338] border-l-4 border-[#112b45] pl-3">
            10. Children&apos;s Privacy
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Our website is intended for general shopping purposes and is not specifically designed for children. We do not knowingly collect personal information directly from children in circumstances where parental or guardian consent is required by applicable law.
          </p>
        </section>

        {/* 11. Order Communication */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#102338] border-l-4 border-[#112b45] pl-3">
            11. Order Communication and Customer Support
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            We may contact you using the phone number, email address, or other details you provide when placing an order. These communications may include order confirmations, delivery updates, payment-related information, product availability updates, return and refund assistance, and responses to inquiries.
          </p>
        </section>

        {/* 12. Changes to This Privacy Policy */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#102338] border-l-4 border-[#112b45] pl-3">
            12. Changes to This Privacy Policy
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            We may update this Privacy Policy from time to time to reflect changes in our services, website features, business practices, or applicable legal requirements. When changes are made, the updated version will be published on this page with a revised &quot;Last Updated&quot; date.
          </p>
        </section>

        {/* 13. Contact Us */}
        <section className="space-y-4 pt-2 border-t border-gray-200">
          <h2 className="text-lg sm:text-xl font-bold text-[#102338] border-l-4 border-[#112b45] pl-3">
            13. Contact Us
          </h2>
          <p className="text-xs sm:text-sm text-slate-700">
            If you have questions, concerns, or requests regarding this Privacy Policy or how we handle your personal information, please feel free to reach out to us:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <strong className="block text-slate-900 font-bold">Sarail 1 to 99+ Shop</strong>
              <p className="text-slate-600">{STORE_CONTACT.address}</p>
              <div className="flex items-center gap-2 text-slate-700">
                <FiPhone className="text-actionRed shrink-0" />
                <a href={STORE_CONTACT.phoneHref} className="hover:underline font-semibold">
                  {STORE_CONTACT.phoneDisplay}
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <FiMail className="text-actionRed shrink-0" />
                <a href={STORE_CONTACT.emailHref} className="hover:underline">
                  {STORE_CONTACT.email}
                </a>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <span className="block text-slate-900 font-bold">Connect with Us Directly:</span>
              <div className="flex flex-col gap-2">
                <a
                  href={STORE_CONTACT.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] text-white px-3 py-2 rounded-lg font-bold text-xs hover:bg-[#20ba59] transition-colors"
                >
                  <FaWhatsapp className="text-base" />
                  <span>Message on WhatsApp</span>
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61565363597487"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#1877F2] text-white px-3 py-2 rounded-lg font-bold text-xs hover:bg-[#166fe5] transition-colors"
                >
                  <FaFacebookF className="text-sm" />
                  <span>Official Facebook Page</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Commitment Banner */}
        <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed flex items-start gap-3">
          <FiShield className="text-primary text-xl shrink-0 mt-0.5" />
          <div>
            <strong className="block text-slate-900 font-bold mb-1">Our Commitment to Your Privacy</strong>
            <p>
              At Sarail 1 to 99+ Shop, we believe that a good shopping experience begins with trust. We&apos;re committed to handling your personal information responsibly, respecting your privacy, and making your online shopping experience as safe, simple, and convenient as possible. Thank you for choosing Sarail 1 to 99+ Shop.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;

