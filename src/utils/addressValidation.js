/**
 * Address & Bangladeshi Mobile Validation Utilities
 * Designed for Bangladesh Courier (Steadfast, Pathao, RedX) delivery requirements.
 */

/**
 * 64 Districts of Bangladesh with English, Bengali names and Administrative Divisions
 */
export const BANGLADESH_DISTRICTS = [
  { name: 'Brahmanbaria', bn: 'ব্রাহ্মণবাড়িয়া', division: 'Chattogram' },
  { name: 'Dhaka', bn: 'ঢাকা', division: 'Dhaka' },
  { name: 'Gazipur', bn: 'গাজীপুর', division: 'Dhaka' },
  { name: 'Narayanganj', bn: 'নারায়ণগঞ্জ', division: 'Dhaka' },
  { name: 'Narsingdi', bn: 'নরসিংদী', division: 'Dhaka' },
  { name: 'Chattogram', bn: 'চট্টগ্রাম', division: 'Chattogram' },
  { name: 'Cumilla', bn: 'কুমিল্লা', division: 'Chattogram' },
  { name: 'Sylhet', bn: 'সিলেট', division: 'Sylhet' },
  { name: 'Bagerhat', bn: 'বাগেরহাট', division: 'Khulna' },
  { name: 'Bandarban', bn: 'বান্দরবান', division: 'Chattogram' },
  { name: 'Barguna', bn: 'বরগুনা', division: 'Barishal' },
  { name: 'Barishal', bn: 'বরিশাল', division: 'Barishal' },
  { name: 'Bhola', bn: 'ভোলা', division: 'Barishal' },
  { name: 'Bogura', bn: 'বগুড়া', division: 'Rajshahi' },
  { name: 'Chandpur', bn: 'চাঁদপুর', division: 'Chattogram' },
  { name: 'Chapainawabganj', bn: 'চাঁপাইনবাবগঞ্জ', division: 'Rajshahi' },
  { name: 'Chuadanga', bn: 'চুয়াডাঙ্গা', division: 'Khulna' },
  { name: "Cox's Bazar", bn: 'কক্সবাজার', division: 'Chattogram' },
  { name: 'Dinajpur', bn: 'দিনাজপুর', division: 'Rangpur' },
  { name: 'Faridpur', bn: 'ফরিদপুর', division: 'Dhaka' },
  { name: 'Feni', bn: 'ফেনী', division: 'Chattogram' },
  { name: 'Gaibandha', bn: 'গাইবান্ধা', division: 'Rangpur' },
  { name: 'Gopalganj', bn: 'গোপালগঞ্জ', division: 'Dhaka' },
  { name: 'Habiganj', bn: 'হবিগঞ্জ', division: 'Sylhet' },
  { name: 'Jamalpur', bn: 'জামালপুর', division: 'Mymensingh' },
  { name: 'Jashore', bn: 'যশোর', division: 'Khulna' },
  { name: 'Jhalokati', bn: 'ঝালকাঠি', division: 'Barishal' },
  { name: 'Jhenaidah', bn: 'ঝিনাইদহ', division: 'Khulna' },
  { name: 'Joypurhat', bn: 'জয়পুরহাট', division: 'Rajshahi' },
  { name: 'Khagrachhari', bn: 'খাগড়াছড়ি', division: 'Chattogram' },
  { name: 'Khulna', bn: 'খুলনা', division: 'Khulna' },
  { name: 'Kishoreganj', bn: 'কিশোরগঞ্জ', division: 'Dhaka' },
  { name: 'Kurigram', bn: 'কুড়িগ্রাম', division: 'Rangpur' },
  { name: 'Kushtia', bn: 'কুষ্টিয়া', division: 'Khulna' },
  { name: 'Lakshmipur', bn: 'লক্ষ্মীপুর', division: 'Chattogram' },
  { name: 'Lalmonirhat', bn: 'লালমনিরহাট', division: 'Rangpur' },
  { name: 'Madaripur', bn: 'মাদারীপুর', division: 'Dhaka' },
  { name: 'Magura', bn: 'মাগুরা', division: 'Khulna' },
  { name: 'Manikganj', bn: 'মানিকগঞ্জ', division: 'Dhaka' },
  { name: 'Meherpur', bn: 'মেহেরপুর', division: 'Khulna' },
  { name: 'Moulvibazar', bn: 'মৌলভীবাজার', division: 'Sylhet' },
  { name: 'Munshiganj', bn: 'মুন্সীগঞ্জ', division: 'Dhaka' },
  { name: 'Mymensingh', bn: 'ময়মনসিংহ', division: 'Mymensingh' },
  { name: 'Naogaon', bn: 'নওগাঁ', division: 'Rajshahi' },
  { name: 'Narail', bn: 'নড়াইল', division: 'Khulna' },
  { name: 'Natore', bn: 'নাটোর', division: 'Rajshahi' },
  { name: 'Netrokona', bn: 'নেত্রকোণা', division: 'Mymensingh' },
  { name: 'Nilphamari', bn: 'নীলফামারী', division: 'Rangpur' },
  { name: 'Noakhali', bn: 'নোয়াখালী', division: 'Chattogram' },
  { name: 'Pabna', bn: 'পাবনা', division: 'Rajshahi' },
  { name: 'Panchagarh', bn: 'পঞ্চগড়', division: 'Rangpur' },
  { name: 'Patuakhali', bn: 'পটুয়াখালী', division: 'Barishal' },
  { name: 'Pirojpur', bn: 'পিরোজপুর', division: 'Barishal' },
  { name: 'Rajbari', bn: 'রাজবাড়ী', division: 'Dhaka' },
  { name: 'Rajshahi', bn: 'রাজশাহী', division: 'Rajshahi' },
  { name: 'Rangamati', bn: 'রাঙ্গামাটি', division: 'Chattogram' },
  { name: 'Rangpur', bn: 'রংপুর', division: 'Rangpur' },
  { name: 'Satkhira', bn: 'সাতক্ষীরা', division: 'Khulna' },
  { name: 'Shariatpur', bn: 'শরীয়তপুর', division: 'Dhaka' },
  { name: 'Sherpur', bn: 'শেরপুর', division: 'Mymensingh' },
  { name: 'Sirajganj', bn: 'সিরাজগঞ্জ', division: 'Rajshahi' },
  { name: 'Sunamganj', bn: 'সুনামগঞ্জ', division: 'Sylhet' },
  { name: 'Tangail', bn: 'টাঙ্গাইল', division: 'Dhaka' },
  { name: 'Thakurgaon', bn: 'ঠাকুরগাঁও', division: 'Rangpur' },
];

/**
 * Validate 11-digit Bangladeshi mobile number
 * Allowed operator prefixes: 013 (GP), 014 (Banglalink), 015 (Teletalk),
 * 016 (Airtel), 017 (GP), 018 (Robi), 019 (Banglalink)
 * Regex: /^01[3-9]\d{8}$/
 * 
 * @param {string} rawPhone
 * @returns {string|null} - Error message if invalid, null if valid
 */
export const validateBdPhone = (rawPhone) => {
  if (!rawPhone || typeof rawPhone !== 'string') {
    return 'মোবাইল নম্বর আবশ্যক (Phone number is required)।';
  }

  const clean = rawPhone.replace(/[\s-]/g, '').replace(/^\+?88/, '');
  const bdPhoneRegex = /^01[3-9]\d{8}$/;

  if (!bdPhoneRegex.test(clean)) {
    return 'সঠিক ১১ ডিজিটের বাংলাদেশী মোবাইল নম্বর দিন (যেমন: 01712345678)।';
  }

  return null;
};

/**
 * Validate detailed street / village address (minimum 6 characters)
 * 
 * @param {string} streetAddress
 * @returns {string|null}
 */
export const validateStreetAddress = (streetAddress) => {
  if (!streetAddress || typeof streetAddress !== 'string') {
    return 'বাড়ি নং / রোড নং / গ্রাম বা বিস্তারিত ঠিকানা লিখুন।';
  }
  const clean = streetAddress.trim();
  if (!clean) {
    return 'বাড়ি নং / রোড নং / গ্রাম বা বিস্তারিত ঠিকানা লিখুন।';
  }
  if (clean.length < 6) {
    return 'বিস্তারিত ঠিকানা অত্যন্ত সংক্ষিপ্ত (কমপক্ষে ৬ অক্ষর আবশ্যক, যেমন: বাড়ি বা রোডের বিবরণ দিন)।';
  }
  return null;
};

/**
 * Construct courier-compliant hierarchical recipient address:
 * [Detailed Street / Village / Landmark] + [Thana / Upazila] + [District]
 * 
 * @param {{ streetAddress?: string, thana?: string, district?: string }} param0
 * @returns {string}
 */
export const formatRecipientAddress = ({ streetAddress = '', thana = '', district = '' }) => {
  return `${(streetAddress || '').trim()}, ${(thana || '').trim()}, ${(district || '').trim()}`.replace(/^[\s,]+|[\s,]+$/g, '');
};

/**
 * Detailed Address Validation Utility for Bangladesh Courier & Home Delivery
 * Enforces detailed street, house/road, village/area, landmark, thana, and district.
 * Prevents short addresses (< 15 chars) and generic comma-separated location strings (e.g. "Dhaka, Narsingdi, Raipura").
 * 
 * @param {string} rawAddress
 * @returns {string|null} - Error message if invalid, null if valid
 */
export const validateDetailedAddress = (rawAddress) => {
  if (!rawAddress || typeof rawAddress !== 'string') {
    return 'অনুগ্রহ করে সম্পূর্ণ ডেলিভারি ঠিকানা প্রদান করুন।';
  }

  const clean = rawAddress.trim().replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ');
  if (!clean) {
    return 'অনুগ্রহ করে সম্পূর্ণ ডেলিভারি ঠিকানা প্রদান করুন।';
  }

  // Minimum length check: at least 15 characters
  if (clean.length < 15) {
    return 'ঠিকানাটি অত্যন্ত সংক্ষিপ্ত (কমপক্ষে ১৫ অক্ষর আবশ্যক)। অনুগ্রহ করে বাড়ি নং / রোড নং / গ্রাম ও পরিচিত ল্যান্ডমার্ক উল্লেখ করুন।';
  }

  const words = clean.split(/[\s,.-]+/).filter(Boolean);

  const bdDistrictOrHubs = [
    'dhaka', 'gazipur', 'narayanganj', 'chittagong', 'chattogram', 'sylhet',
    'comilla', 'cumilla', 'brahmanbaria', 'rajshahi', 'khulna', 'barisal',
    'rangpur', 'mymensingh', 'jashore', 'bogra', 'sadar', 'ctg', 'dhk',
    'narsingdi', 'raipura', 'savar', 'keraniganj', 'tongi', 'ashulia',
    'feni', 'noakhali', 'coxsbazar', 'tangail', 'faridpur', 'sirajganj',
    'pabna', 'kushtia', 'dinajpur', 'naogaon', 'natore', 'bagerhat',
    'bandarban', 'barguna', 'bhola', 'chandpur', 'chuadanga', 'habiganj',
    'jamalpur', 'jhalokati', 'jhenaidah', 'joypurhat', 'khagrachhari',
    'kurigram', 'kushtia', 'lakshmipur', 'lalmonirhat', 'madaripur',
    'magura', 'manikganj', 'meherpur', 'moulvibazar', 'munshiganj',
    'netrokona', 'nilphamari', 'panchagarh', 'patuakhali', 'pirojpur',
    'rajbari', 'shariatpur', 'sherpur', 'sunamganj', 'thakurgaon',
  ];

  // If address has less than 3 components or all words are solely district/hub names (e.g. "Dhaka, Narsingdi, Raipura")
  const isAllHubWords =
    words.length <= 4 &&
    words.every((w) => bdDistrictOrHubs.includes(w.toLowerCase()));

  if (words.length < 3 || isAllHubWords) {
    return 'কুরিয়ার হোম ডেলিভারির জন্য বাড়ি নং / রোড নং / গ্রাম বা পরিচিত স্থান উল্লেখ করা আবশ্যক। শুধু জেলা বা থানার নাম (যেমন: ঢাকা, নরসিংদী, রায়পুরা) দিলে কুরিয়ার ডেলিভারি সম্ভব হবে না।';
  }

  return null;
};
