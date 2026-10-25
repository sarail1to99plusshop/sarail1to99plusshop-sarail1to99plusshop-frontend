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

/**
 * Detect if a delivery zone is restricted to a specific local district.
 * 
 * @param {object} zone - Delivery zone option { id, location, charge }
 * @returns {string|null} - Target district name (e.g. 'Brahmanbaria', 'Dhaka') or null
 */
export const getTargetDistrictForZone = (zone) => {
  if (!zone) return null;
  const loc = (zone.location || '').toLowerCase();
  const id = (zone.id || '').toLowerCase();

  if (
    loc.includes('outside') ||
    loc.includes('আউটসাইড') ||
    loc.includes('সারা দেশ') ||
    loc.includes('সারাদেশ') ||
    loc.includes('all bangladesh') ||
    loc.includes('whole bangladesh') ||
    loc.includes('nationwide')
  ) {
    return null;
  }

  const hasInsideIndicator =
    loc.includes('inside') ||
    loc.includes('ইনসাইড') ||
    loc.includes('city') ||
    loc.includes('সিটি') ||
    loc.includes('local') ||
    loc.includes('লোকাল') ||
    id.includes('inside');

  if (!hasInsideIndicator) {
    for (const d of BANGLADESH_DISTRICTS) {
      if (loc === d.name.toLowerCase() || loc === d.bn) {
        return d.name;
      }
    }
    return null;
  }

  if (loc.includes('brahmanbaria') || loc.includes('ব্রাহ্মণবাড়িয়া')) return 'Brahmanbaria';
  if (loc.includes('dhaka') || loc.includes('ঢাকা')) return 'Dhaka';
  if (loc.includes('chattogram') || loc.includes('chittagong') || loc.includes('চট্টগ্রাম')) return 'Chattogram';
  if (loc.includes('sylhet') || loc.includes('সিলেট')) return 'Sylhet';

  for (const d of BANGLADESH_DISTRICTS) {
    if (loc.includes(d.name.toLowerCase()) || loc.includes(d.bn)) {
      return d.name;
    }
  }

  if (id.includes('brahmanbaria')) return 'Brahmanbaria';
  if (id.includes('dhaka') && !id.includes('outside')) return 'Dhaka';

  return null;
};

/**
 * Determine if a delivery zone is geographically valid for a customer's district.
 * For example:
 * - "Inside brahmanbaria" is ONLY valid if district is "Brahmanbaria"
 * - "Inside dhaka" is ONLY valid if district is "Dhaka"
 * - "Outside brahmanbaria" is valid for all districts EXCEPT "Brahmanbaria" (and "Dhaka" if Inside dhaka exists)
 * 
 * @param {object} zone - Delivery zone option
 * @param {string} district - Selected district
 * @param {Array} allZones - Optional array of all active delivery zones
 * @returns {boolean}
 */
export const isZoneApplicableForDistrict = (zone, district, allZones = []) => {
  if (!zone) return false;
  if (!district || typeof district !== 'string' || !district.trim()) {
    return true; // No district chosen yet
  }

  const normalizedDistrict = district.trim().toLowerCase();
  const targetDistrict = getTargetDistrictForZone(zone);

  if (targetDistrict) {
    // "Inside [District]" zone is strictly for that district only
    return normalizedDistrict === targetDistrict.toLowerCase();
  }

  const loc = (zone.location || '').toLowerCase();
  if (loc.includes('outside') || loc.includes('আউটসাইড')) {
    // If the customer district has a dedicated inside zone among available zones (e.g. Inside dhaka),
    // then the general outside zone is not applicable for this district.
    if (Array.isArray(allZones) && allZones.length > 0) {
      const hasDedicatedInsideZone = allZones.some(
        (z) => z.isActive !== false && getTargetDistrictForZone(z)?.toLowerCase() === normalizedDistrict
      );
      if (hasDedicatedInsideZone) {
        return false;
      }
    }

    if (loc.includes('brahmanbaria') || loc.includes('ব্রাহ্মণবাড়িয়া')) {
      return normalizedDistrict !== 'brahmanbaria';
    }
    if (loc.includes('dhaka') || loc.includes('ঢাকা')) {
      return normalizedDistrict !== 'dhaka';
    }
  }

  return true;
};

/**
 * Select the optimal, geographically-valid delivery zone for the customer's district.
 * 
 * @param {Array} zones - Delivery zone options
 * @param {string} district - Selected district
 * @returns {object|null}
 */
export const getBestMatchingDeliveryZone = (zones, district) => {
  if (!Array.isArray(zones) || zones.length === 0) return null;
  if (!district || typeof district !== 'string' || !district.trim()) {
    return zones.find((z) => z.isDefault && z.isActive !== false) || zones[0];
  }

  const applicable = zones.filter(
    (z) => z.isActive !== false && isZoneApplicableForDistrict(z, district, zones)
  );

  if (applicable.length === 0) {
    return zones.find((z) => z.isDefault && z.isActive !== false) || zones[0];
  }

  // If customer is in a local district (e.g. Brahmanbaria or Dhaka), prioritize the local inside zone
  const localMatch = applicable.find(
    (z) => getTargetDistrictForZone(z)?.toLowerCase() === district.trim().toLowerCase()
  );
  if (localMatch) return localMatch;

  const defaultApplicable = applicable.find((z) => z.isDefault);
  if (defaultApplicable) return defaultApplicable;

  const outsideZone = applicable.find((z) => {
    const loc = (z.location || '').toLowerCase();
    return loc.includes('outside') || loc.includes('আউটসাইড');
  });
  if (outsideZone) return outsideZone;

  return applicable[0];
};

/**
 * Validate delivery zone eligibility for selected district.
 * 
 * @param {object} zone - Selected delivery zone
 * @param {string} district - Selected district
 * @param {Array} allZones - All delivery options
 * @returns {{ valid: boolean, message?: string, recommendedZone?: object }}
 */
export const validateDeliveryEligibility = (zone, district, allZones = []) => {
  if (!zone) {
    return { valid: false, message: 'ডেলিভারি এরিয়া নির্বাচন করুন।' };
  }
  if (!district) {
    return { valid: true };
  }

  const isValid = isZoneApplicableForDistrict(zone, district);
  if (isValid) {
    return { valid: true };
  }

  const recommendedZone = getBestMatchingDeliveryZone(allZones, district);
  const targetDistrict = getTargetDistrictForZone(zone);

  let message = `আপনার নির্বাচিত জেলা ${district}। "${zone.location}" ডেলিভারি জোনটি শুধুমাত্র ${targetDistrict || 'নির্দিষ্ট'} এলাকার জন্য প্রযোজ্য।`;
  if (recommendedZone) {
    message += ` আপনার জন্য সঠিক জোন: "${recommendedZone.location}" (৳${recommendedZone.charge})।`;
  }

  return {
    valid: false,
    message,
    recommendedZone,
  };
};
