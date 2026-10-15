import { Link } from 'react-router-dom';
import { FiArrowLeft, FiPhone, FiMail, FiCheckCircle } from 'react-icons/fi';
import { FaWhatsapp, FaFacebookF } from 'react-icons/fa';
import { STORE_CONTACT } from '../utils/contactInfo';

const ReturnPolicy = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8 text-slate-800" lang="bn">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-10 md:p-12 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-primary transition-colors">
            <FiArrowLeft />
            <span>হোমে ফিরে যান</span>
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">রিটার্ন নীতিমালা</span>
        </div>

        {/* Header */}
        <div className="border-b border-gray-200 pb-6 space-y-2">
          <div className="inline-block bg-[#fff0e9] text-[#b74a28] font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
            গ্রাহক সহায়তা ও নীতি
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#102338] leading-tight">
            রিটার্ন, রিফান্ড ও অর্ডার বাতিল নীতিমালা
          </h1>
          <p className="text-sm font-semibold text-slate-600">
            Return, Refund &amp; Cancellation Policy | Sarail 1 to 99+ Shop
          </p>
        </div>

        {/* Intro */}
        <div className="text-sm md:text-base leading-relaxed text-slate-700 space-y-3">
          <p>
            <strong>Sarail 1 to 99+ Shop</strong>-এ আপনাকে স্বাগতম। আমরা চাই আপনার প্রতিটি কেনাকাটা হোক সহজ, নিরাপদ ও সন্তোষজনক। সঠিক পণ্য সরবরাহ এবং গ্রাহকের সন্তুষ্টি নিশ্চিত করা আমাদের অন্যতম অগ্রাধিকার। কোনো কারণে ভুল, ত্রুটিপূর্ণ, ক্ষতিগ্রস্ত বা অর্ডারের বিবরণের সঙ্গে অসামঞ্জস্যপূর্ণ পণ্য পেলে আপনি আমাদের কাছে অভিযোগ জানাতে পারবেন। আপনার অভিযোগ যাচাই করে প্রযোজ্য নিয়ম অনুযায়ী পণ্য পরিবর্তন, রিটার্ন অথবা রিফান্ডের ব্যবস্থা করা হবে।
          </p>
        </div>

        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#102338] border-l-4 border-[#e96542] pl-3">
            ১. অর্ডার ও ডেলিভারি সংক্রান্ত নিয়ম
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <li>অর্ডার দেওয়ার সময় সঠিক নাম, মোবাইল নম্বর ও ডেলিভারি ঠিকানা প্রদান করতে হবে।</li>
            <li>অর্ডার নিশ্চিত করতে প্রয়োজনে আমাদের প্রতিনিধি আপনার সঙ্গে যোগাযোগ করতে পারেন।</li>
            <li>পণ্যের প্রাপ্যতা, ডেলিভারি এলাকা ও কুরিয়ার কার্যক্রম অনুযায়ী ডেলিভারির সময় পরিবর্তিত হতে পারে।</li>
            <li>পণ্য সরবরাহ সম্ভব না হলে গ্রাহককে জানানো হবে এবং অগ্রিম অর্থ থাকলে প্রযোজ্য নিয়ম অনুযায়ী ফেরত দেওয়া হবে।</li>
            <li>ডেলিভারি চার্জ ও প্রযোজ্য অতিরিক্ত খরচ অর্ডার নিশ্চিত করার আগে জানানো হবে।</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#102338] border-l-4 border-[#e96542] pl-3">
            ২. ডেলিভারির সময় পণ্য পরীক্ষা
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <li>পণ্য গ্রহণের সময় পার্সেলের বাহ্যিক অবস্থা পরীক্ষা করুন। প্যাকেট ছেঁড়া, ভেজা, খোলা বা ক্ষতিগ্রস্ত কি না দেখুন।</li>
            <li>ডেলিভারি কর্মীর সামনে পার্সেল খোলা বা পণ্য পরীক্ষা করার সুযোগ সংশ্লিষ্ট কুরিয়ার প্রতিষ্ঠানের নিয়ম ও অনুমতির ওপর নির্ভর করবে।</li>
            <li>কুরিয়ার অনুমতি দিলে তাদের নির্দেশনা অনুযায়ী পণ্য পরীক্ষা করতে পারবেন।</li>
            <li>পার্সেলে দৃশ্যমান ক্ষতি বা সন্দেহজনক সমস্যা থাকলে দ্রুত আমাদের জানান।</li>
            <li>সম্ভব হলে আনবক্সিং ভিডিও বা ছবি সংরক্ষণ করুন; এতে অভিযোগ যাচাই সহজ হয়।</li>
          </ul>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5 text-xs sm:text-sm text-amber-900">
            <strong>গুরুত্বপূর্ণ:</strong> সব কুরিয়ার প্রতিষ্ঠানে ডেলিভারির সময় পার্সেল খোলার অনুমতি থাকে না। কুরিয়ারের নিয়মের বাইরে পণ্য খোলার নিশ্চয়তা দেওয়া হচ্ছে না।
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#102338] border-l-4 border-[#e96542] pl-3">
            ৩. রিটার্ন আবেদনের সময়সীমা
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            পণ্য হাতে পাওয়ার পরবর্তী <strong>৩ ক্যালেন্ডার দিনের মধ্যে</strong> সাধারণ রিটার্নের আবেদন করতে হবে। উদাহরণস্বরূপ, ১০ তারিখে পণ্য গ্রহণ করলে ১৩ তারিখের মধ্যে আবেদন জানাতে পারবেন। নির্ধারিত সময়ের মধ্যে অভিযোগ জানালে পণ্যের অবস্থা, অভিযোগের কারণ ও প্রযোজ্য শর্ত যাচাই করে ব্যবস্থা নেওয়া হবে। এই ৩ দিনের সময়সীমা সাধারণ রিটার্ন আবেদন প্রক্রিয়ার জন্য; প্রযোজ্য ওয়ারেন্টি বা আইনগত অধিকার এতে বাতিল হবে না।
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#102338] border-l-4 border-[#e96542] pl-3">
            ৪. কোন কোন কারণে পণ্য রিটার্ন করা যাবে?
          </h2>
          <ol className="list-decimal pl-5 space-y-1.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <li><strong>ভুল পণ্য:</strong> অর্ডার করা পণ্যের বদলে অন্য পণ্য, মডেল, সাইজ বা রং সরবরাহ করা হলে।</li>
            <li><strong>ত্রুটিপূর্ণ পণ্য:</strong> উৎপাদনগত ত্রুটি বা স্বাভাবিক ব্যবহার বাধাগ্রস্ত করে এমন সমস্যা থাকলে।</li>
            <li><strong>ক্ষতিগ্রস্ত পণ্য:</strong> ডেলিভারির সময় পণ্য ভাঙা বা ক্ষতিগ্রস্ত অবস্থায় পাওয়া গেলে।</li>
            <li><strong>অসম্পূর্ণ অর্ডার:</strong> প্রয়োজনীয় অংশ বা অন্তর্ভুক্ত অ্যাক্সেসরিজ অনুপস্থিত থাকলে।</li>
            <li><strong>বিবরণের সঙ্গে অমিল:</strong> ওয়েবসাইটে প্রদর্শিত গুরুত্বপূর্ণ বৈশিষ্ট্যের সঙ্গে না মিললে।</li>
            <li><strong>মেয়াদোত্তীর্ণ পণ্য:</strong> প্রযোজ্য ক্ষেত্রে মেয়াদ শেষ হওয়া পণ্য সরবরাহ করা হলে।</li>
          </ol>
          <p className="text-xs text-slate-600">
            প্রতিটি আবেদন যাচাই করে অভিযোগের ধরন অনুযায়ী উপযুক্ত সমাধান দেওয়া হবে।
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#102338] border-l-4 border-[#e96542] pl-3">
            ৫. রিটার্ন গ্রহণের সাধারণ শর্ত
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <li>পণ্য অপ্রয়োজনীয়ভাবে ব্যবহার, পরিবর্তন বা ক্ষতিগ্রস্ত করা যাবে না।</li>
            <li>সম্ভব হলে মূল প্যাকেজিং, বক্স, ট্যাগ, ইনভয়েস ও অ্যাক্সেসরিজ সংরক্ষণ করুন।</li>
            <li>পণ্যের সঙ্গে দেওয়া প্রয়োজনীয় যন্ত্রাংশ বা অন্যান্য সামগ্রী থাকলে ফেরত দিতে হবে।</li>
            <li>ত্রুটি পরীক্ষা করার জন্য প্রয়োজনীয় সীমিত ব্যবহারকে স্বয়ংক্রিয়ভাবে রিটার্ন বাতিলের কারণ ধরা হবে না।</li>
            <li>গ্রাহকের অসাবধানতা, অনুপযুক্ত ব্যবহার বা ইচ্ছাকৃত ক্ষতিতে সাধারণ রিটার্ন প্রযোজ্য নাও হতে পারে।</li>
          </ul>
          <p className="text-xs text-slate-600">
            ভুল বা ত্রুটিপূর্ণ পণ্যের ক্ষেত্রে শুধু প্যাকেট খোলা হয়েছে বলে অভিযোগ বাতিল করা হবে না। প্রকৃত সমস্যা ও প্রমাণ বিবেচনা করা হবে।
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#102338] border-l-4 border-[#e96542] pl-3">
            ৬. পণ্যের ধরন অনুযায়ী রিটার্নের শর্ত
          </h2>
          <div className="space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <p><strong>কিচেন ও গৃহস্থালি পণ্য:</strong> ভুল, ভাঙা, ত্রুটিপূর্ণ বা অসম্পূর্ণ পণ্যের অভিযোগ করা যাবে। স্বাভাবিক ব্যবহারের বাইরে ক্ষতিগ্রস্ত পণ্য সাধারণ রিটার্নের আওতায় নাও আসতে পারে।</p>
            <p><strong>ইলেকট্রনিক ও বৈদ্যুতিক পণ্য:</strong> ডেলিভারির সময় ত্রুটিপূর্ণ, ভুল বা ক্ষতিগ্রস্ত পণ্য পাওয়া গেলে যাচাই করে সমাধান দেওয়া হবে। প্রযোজ্য ব্র্যান্ড বা বিক্রেতার ওয়ারেন্টি অনুসরণ করা হবে।</p>
            <p><strong>ব্যক্তিগত ব্যবহার ও স্বাস্থ্যবিধি-সংশ্লিষ্ট পণ্য:</strong> স্বাস্থ্য ও নিরাপত্তার কারণে ব্যবহার করা বা সিল খোলা কিছু পণ্য শুধু মত পরিবর্তনের কারণে ফেরত নেওয়া নাও হতে পারে। ভুল, ত্রুটিপূর্ণ বা ক্ষতিগ্রস্ত পণ্যের অভিযোগ গ্রহণ করা হবে।</p>
            <p><strong>খাদ্য ও মেয়াদযুক্ত পণ্য:</strong> ভুল, ক্ষতিগ্রস্ত, অনিরাপদ বা মেয়াদোত্তীর্ণ পণ্যের অভিযোগ করা যাবে। সঠিক ও অক্ষত খাদ্যপণ্য শুধু মত পরিবর্তনের কারণে ফেরতযোগ্য নাও হতে পারে।</p>
            <p><strong>অফার, ডিসকাউন্ট ও বিশেষ পণ্য:</strong> আলাদা শর্ত থাকতে পারে, তবে ত্রুটি, ভুল সরবরাহ বা প্রযোজ্য আইনগত অধিকার অফারের কারণে বাতিল হবে না।</p>
          </div>
        </section>

        {/* Section 7 */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#102338] border-l-4 border-[#e96542] pl-3">
            ৭. কোন পরিস্থিতিতে সাধারণ রিটার্ন গ্রহণযোগ্য নাও হতে পারে?
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <li>পণ্যটি মত পরিবর্তনের কারণে রিটার্নযোগ্য না হলে শুধুমাত্র ব্যক্তিগত পছন্দ পরিবর্তন।</li>
            <li>গ্রাহকের ব্যবহারে পণ্য নষ্ট বা ক্ষতিগ্রস্ত হলে।</li>
            <li>পণ্যের প্রয়োজনীয় অংশ ইচ্ছাকৃতভাবে সরিয়ে ফেললে।</li>
            <li>যথাযথ কারণ ছাড়া অভিযোগ যাচাইয়ের প্রয়োজনীয় তথ্য না দিলে।</li>
            <li>সাধারণ রিটার্ন সময়সীমা পেরিয়ে গেলে এবং অন্য কোনো আইনগত অধিকার বা ওয়ারেন্টি প্রযোজ্য না হলে।</li>
          </ul>
        </section>

        {/* Section 8 */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#102338] border-l-4 border-[#e96542] pl-3">
            ৮. রিটার্নের আবেদন কীভাবে করবেন?
          </h2>
          <ol className="list-decimal pl-5 space-y-1.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <li>পণ্য হাতে পাওয়ার পর নির্ধারিত ৩ দিনের মধ্যে অফিসিয়াল যোগাযোগমাধ্যমে অভিযোগ জানান।</li>
            <li>অর্ডার নম্বর, অর্ডারে ব্যবহৃত নাম ও মোবাইল নম্বর, পণ্যের নাম, সমস্যার বিবরণ এবং ছবি বা ভিডিও দিন।</li>
            <li>আমাদের প্রতিনিধি তথ্য যাচাই করে দ্রুত আপনার সঙ্গে যোগাযোগ করবেন।</li>
            <li>অভিযোগ গ্রহণযোগ্য হলে পণ্য ফেরত, পরিবর্তন বা রিফান্ডের নির্দেশনা দেওয়া হবে।</li>
          </ol>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs sm:text-sm text-red-900">
            <strong>বিশেষ অনুরোধ:</strong> আমাদের নিশ্চিত নির্দেশনা পাওয়ার আগে নিজ উদ্যোগে কোনো ঠিকানায় পণ্য ফেরত পাঠাবেন না।
          </div>
        </section>

        {/* Section 9 */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#102338] border-l-4 border-[#e96542] pl-3">
            ৯. রিটার্ন ও অভিযোগ যাচাই
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            অর্ডারের তথ্য, পণ্যের বিবরণ, সরবরাহের অবস্থা, ছবি/ভিডিও এবং প্রয়োজনে সরাসরি পণ্য পরীক্ষা করা হতে পারে। যাচাই শেষে সঠিক পণ্য পুনরায় সরবরাহ, ত্রুটিপূর্ণ পণ্য পরিবর্তন, অনুপস্থিত অংশ সরবরাহ, সম্পূর্ণ/আংশিক রিফান্ড অথবা ওয়ারেন্টি সহায়তা দেওয়া হতে পারে। আবেদন গ্রহণ সম্ভব না হলে কারণ ব্যাখ্যা করা হবে।
          </p>
        </section>

        {/* Section 10 */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#102338] border-l-4 border-[#e96542] pl-3">
            ১০. রিফান্ড বা টাকা ফেরতের নিয়ম
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <li>রিটার্ন বা বাতিল অনুমোদিত হলে প্রযোজ্য নিয়ম অনুযায়ী অর্থ ফেরত দেওয়া হবে।</li>
            <li>অগ্রিম অর্থ সাধারণত মূল পেমেন্ট মাধ্যম অথবা সম্মত উপযুক্ত মাধ্যমে ফেরত দেওয়া হবে।</li>
            <li>COD অর্ডারের অনুমোদিত রিফান্ড ব্যাংক অ্যাকাউন্ট বা অনুমোদিত মোবাইল ফাইন্যান্সিয়াল সার্ভিসে দেওয়া যেতে পারে।</li>
            <li>আংশিক সমস্যায় প্রযোজ্য আংশিক রিফান্ড দেওয়া হতে পারে।</li>
            <li>রিফান্ডের সময়সীমা প্রযোজ্য আইন, পেমেন্ট মাধ্যম ও লেনদেনের ধরন অনুযায়ী নির্ধারিত হবে; আইনগত বাধ্যতামূলক সময়সীমা প্রাধান্য পাবে।</li>
          </ul>
        </section>

        {/* Section 11 */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#102338] border-l-4 border-[#e96542] pl-3">
            ১১. রিটার্ন ডেলিভারি চার্জ
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <li>আমাদের ভুলে ভুল, ত্রুটিপূর্ণ, অসম্পূর্ণ বা ক্ষতিগ্রস্ত পণ্য সরবরাহ হলে গ্রহণযোগ্য অভিযোগে প্রয়োজনীয় রিটার্ন পরিবহন খরচ আমরা বহন করব।</li>
            <li>শুধু পছন্দ পরিবর্তনের কারণে অনুমোদিত রিটার্নে গ্রাহককে প্রযোজ্য পরিবহন খরচ বহন করতে হতে পারে।</li>
            <li>পরিবহন পদ্ধতি ও চার্জ আগেই জানানো হবে; কুরিয়ার প্রতিষ্ঠানের নিয়ম অনুসরণ করা হবে।</li>
          </ul>
        </section>

        {/* Section 12 */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#102338] border-l-4 border-[#e96542] pl-3">
            ১২. অর্ডার বাতিলের নিয়ম (Order Cancellation)
          </h2>
          <div className="space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <p><strong>পণ্য পাঠানোর আগে:</strong> অর্ডার প্রসেসিং বা শিপমেন্টের আগে বাতিলের আবেদন করা যাবে। অগ্রিম অর্থ থাকলে প্রযোজ্য নিয়ম অনুযায়ী রিফান্ড হবে।</p>
            <p><strong>পণ্য পাঠানোর পরে:</strong> কুরিয়ারে হস্তান্তরের পর সরাসরি বাতিল সব ক্ষেত্রে সম্ভব নাও হতে পারে। আমাদের সঙ্গে যোগাযোগ করে কুরিয়ারের নিয়ম অনুযায়ী ব্যবস্থা নিতে হবে।</p>
            <p><strong>দোকানের পক্ষ থেকে বাতিল:</strong> স্টক না থাকা বা সরবরাহে অক্ষমতার মতো যুক্তিসংগত কারণে বাতিল হলে জানানো হবে এবং অগ্রিম অর্থ প্রযোজ্য নিয়মে ফেরত দেওয়া হবে।</p>
          </div>
        </section>

        {/* Section 13 */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#102338] border-l-4 border-[#e96542] pl-3">
            ১৩. কুরিয়ার সংক্রান্ত গুরুত্বপূর্ণ তথ্য
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            আমরা তৃতীয় পক্ষের কুরিয়ার সেবা ব্যবহার করি। ডেলিভারির সময় পার্সেল খোলা, পণ্য পরীক্ষা, ফেরত সংগ্রহ বা পরিবহনের সুযোগ সংশ্লিষ্ট কুরিয়ার প্রতিষ্ঠানের নিয়মের ওপর নির্ভর করবে। পরিবহনজনিত সমস্যায় আমাদের সঙ্গে যোগাযোগ করুন। কুরিয়ারের নিয়মের পাশাপাশি গ্রাহকের প্রযোজ্য আইনগত অধিকারও বিবেচিত হবে।
          </p>
        </section>

        {/* Section 14 */}
        <section className="space-y-4 pt-2 border-t border-gray-200">
          <h2 className="text-lg sm:text-xl font-bold text-[#102338] border-l-4 border-[#e96542] pl-3">
            ১৪. অভিযোগ ও গ্রাহক সহায়তা
          </h2>
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
              <span className="block text-slate-900 font-bold">সরাসরি চ্যাট করুন:</span>
              <div className="flex flex-col gap-2">
                <a
                  href={STORE_CONTACT.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] text-white px-3 py-2 rounded-lg font-bold text-xs hover:bg-[#20ba59] transition-colors"
                >
                  <FaWhatsapp className="text-base" />
                  <span>WhatsApp এ মেসেজ দিন</span>
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61565363597487"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#1877F2] text-white px-3 py-2 rounded-lg font-bold text-xs hover:bg-[#166fe5] transition-colors"
                >
                  <FaFacebookF className="text-sm" />
                  <span>অফিসিয়াল Facebook পেজ</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Section 15 */}
        <section className="space-y-3 pt-4 border-t border-gray-200">
          <h2 className="text-lg sm:text-xl font-bold text-[#102338] border-l-4 border-[#e96542] pl-3">
            ১৫. নীতিমালা পরিবর্তন ও আইনগত অধিকার
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Sarail 1 to 99+ Shop প্রয়োজন অনুযায়ী নীতিমালা সংশোধন বা হালনাগাদ করতে পারে; সংশোধিত সংস্করণ ওয়েবসাইটে প্রকাশ করা হবে। এটি বাংলাদেশের প্রযোজ্য ভোক্তা অধিকার সংরক্ষণ আইন, ডিজিটাল কমার্স পরিচালনা সংক্রান্ত নির্দেশনা এবং অন্যান্য প্রযোজ্য বিধানের অধীন থাকবে। কোনো শর্তের সঙ্গে বাধ্যতামূলক আইনগত বিধানের অসামঞ্জস্য হলে আইনগত বিধান প্রাধান্য পাবে।
          </p>
          <div className="p-3.5 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-xs sm:text-sm text-green-900">
            <FiCheckCircle className="text-green-700 shrink-0 text-base" />
            <span><strong>আমাদের প্রতিশ্রুতি:</strong> আপনার অভিযোগ গুরুত্বের সঙ্গে বিবেচনা করা এবং প্রতিটি বৈধ সমস্যার যুক্তিসংগত ও ন্যায্য সমাধান দেওয়া।</span>
          </div>
        </section>

      </div>
    </div>
  );
};

export default ReturnPolicy;

