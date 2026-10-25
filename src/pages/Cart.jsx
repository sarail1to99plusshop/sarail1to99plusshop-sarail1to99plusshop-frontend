import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BsCart3, BsTrash, BsCheckCircleFill } from 'react-icons/bs';
import { FiArrowRight, FiPlus, FiMinus, FiTruck, FiUser, FiLock, FiMail, FiRefreshCw, FiMapPin } from 'react-icons/fi';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import {
  validateDetailedAddress,
  validateBdPhone,
  BANGLADESH_DISTRICTS,
  isZoneApplicableForDistrict,
  getBestMatchingDeliveryZone,
  validateDeliveryEligibility,
  getTargetDistrictForZone,
} from '../utils/addressValidation';
import { useDistricts } from '../hooks/useQueries';
import { trackPurchase } from '../utils/pixel';

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    createOrder,
    saveOrderLocally,
    deliveryCharges,
  } = useShop();
  const { currentUser, sendVerificationEmail, reloadUser } = useAuth();
  const navigate = useNavigate();

  const isVerified = Boolean(currentUser?.emailVerified);
  const customerEmail = currentUser?.email || '';

  // 64 Bangladesh Districts dynamically loaded from Express API / MongoDB
  const { data: dbDistricts = [] } = useDistricts();
  const availableDistricts = dbDistricts.length > 0 ? dbDistricts : BANGLADESH_DISTRICTS;

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [division, setDivision] = useState('');
  const [district, setDistrict] = useState('');
  const [thana, setThana] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [bKashPaymentMode, setBKashPaymentMode] = useState('full');
  const [trxId, setTrxId] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [districtError, setDistrictError] = useState('');
  const [thanaError, setThanaError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [selectedDeliveryId, setSelectedDeliveryId] = useState('inside-brahmanbaria');
  const [placedOrder, setPlacedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const activeName = customerName !== '' ? customerName : (currentUser?.displayName || '');

  const handleCopyBkash = () => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText('01998789157');
    }
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleResendVerification = async () => {
    if (resendCooldown > 0) return;
    setIsResending(true);
    setVerificationStatus('');
    try {
      await sendVerificationEmail();
      setVerificationStatus('Verification link sent! Please check your inbox or spam folder.');
      setResendCooldown(60);
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setVerificationStatus(err?.message || 'Failed to send verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckVerification = async () => {
    setIsRefreshing(true);
    setVerificationStatus('');
    try {
      const user = await reloadUser();
      if (user?.emailVerified) {
        setVerificationStatus('Email verified successfully! You can now complete your order.');
      } else {
        setVerificationStatus('Email is not verified yet. Please check your inbox and click the verification link.');
      }
    } catch {
      setVerificationStatus('Unable to refresh verification status. Please check your connection.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const candidateDelivery = deliveryCharges?.find((d) => d.id === selectedDeliveryId);
  const activeDelivery =
    (candidateDelivery && isZoneApplicableForDistrict(candidateDelivery, district, deliveryCharges))
      ? candidateDelivery
      : getBestMatchingDeliveryZone(deliveryCharges, district, thana) ||
        deliveryCharges?.[0] || {
          id: 'inside-brahmanbaria',
          location: 'Inside Brahmanbaria City',
          charge: 60,
          estimatedDays: '1-2 Business Days',
        };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const deliveryFee = cartItems.length > 0 ? activeDelivery.charge : 0;
  const total = subtotal + deliveryFee;
  const bKashPayNow = bKashPaymentMode === 'delivery' ? deliveryFee : total;
  const remainingOnDelivery = total - bKashPayNow;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      navigate('/account');
      return;
    }
    if (!isVerified) {
      setVerificationStatus('Your account email must be verified before placing an order.');
      return;
    }
    if (!activeName) {
      const el = document.getElementById('customer-name-field');
      if (el) el.focus();
      return;
    }

    const cleanPhone = phone.trim();
    const phoneValidationErr = validateBdPhone(cleanPhone);
    if (phoneValidationErr) {
      setPhoneError(phoneValidationErr);
      const el = document.getElementById('customer-phone-field');
      if (el) el.focus();
      return;
    }
    setPhoneError('');

    if (!district.trim()) {
      setDistrictError('অনুগ্রহ করে জেলা (District) নির্বাচন করুন।');
      const el = document.getElementById('customer-district-field');
      if (el) el.focus();
      return;
    }
    const selectedDistrictObj = availableDistricts.find((d) => d.name.toLowerCase() === district.trim().toLowerCase());
    if (selectedDistrictObj && selectedDistrictObj.isActive === false) {
      setDistrictError(`দুঃখিত, "${district}" জেলায় আমাদের হোম ডেলিভারি সেবা সাময়িকভাবে বন্ধ রয়েছে (Delivery currently unavailable in this district)।`);
      const el = document.getElementById('customer-district-field');
      if (el) el.focus();
      return;
    }
    setDistrictError('');

    if (!thana.trim()) {
      setThanaError('অনুগ্রহ করে থানা বা উপজেলা (Thana/Upazila) লিখুন।');
      const el = document.getElementById('customer-thana-field');
      if (el) el.focus();
      return;
    }
    setThanaError('');

    const cleanStreet = (streetAddress || address).trim();
    if (!cleanStreet) {
      setAddressError('অনুগ্রহ করে বাড়ি নং / রোড নং / গ্রাম বা বিস্তারিত ঠিকানা লিখুন।');
      const el = document.getElementById('customer-address-field');
      if (el) el.focus();
      return;
    }
    if (cleanStreet.length < 6) {
      setAddressError('বিস্তারিত ঠিকানা অত্যন্ত সংক্ষিপ্ত (কমপক্ষে ৬ অক্ষর আবশ্যক, যেমন: বাড়ি বা রোডের বিবরণ দিন)।');
      const el = document.getElementById('customer-address-field');
      if (el) el.focus();
      return;
    }

    // Construct courier-compliant hierarchical recipient address: [Street / Village] + [Thana] + [District]
    const fullAddress = `${cleanStreet}, ${thana.trim()}, ${district.trim()}`;

    const addressValidationErr = validateDetailedAddress(fullAddress);
    if (addressValidationErr) {
      setAddressError(addressValidationErr);
      const el = document.getElementById('customer-address-field');
      if (el) el.focus();
      return;
    }
    setAddressError('');

    // Strict Geographic Delivery Zone Verification
    const deliveryEligibility = validateDeliveryEligibility(activeDelivery, district, deliveryCharges);
    if (!deliveryEligibility.valid) {
      setAddressError(deliveryEligibility.message);
      if (deliveryEligibility.recommendedZone) {
        setSelectedDeliveryId(deliveryEligibility.recommendedZone.id);
      }
      return;
    }

    if (paymentMethod === 'bKash') {
      if (bKashPaymentMode === 'delivery' && deliveryFee <= 0) {
        setPaymentError('Delivery charge only is unavailable when the delivery fee is zero. Please choose Full Payment.');
        return;
      }
      const cleanTrx = trxId.trim();
      if (!cleanTrx) {
        setPaymentError('Please enter your bKash Transaction ID (TrxID).');
        return;
      }
      if (cleanTrx.length < 6) {
        setPaymentError('Please enter a valid bKash Transaction ID.');
        return;
      }
    }
    setPaymentError('');

    setLoading(true);
    let order = null;
    try {
      order = await createOrder({
        userId: currentUser?.uid || '',
        customerDetails: {
          name: activeName,
          email: customerEmail,
          phone: cleanPhone,
          district: district.trim(),
          thana: thana.trim(),
          streetAddress: cleanStreet,
          fullAddress,
          address: fullAddress, // Backwards compatible alias
          division: division.trim(),
          note: note.trim(),
          deliveryLocation: activeDelivery.location,
        },
        deliveryFee,
        paymentMethod,
        paymentDetails: {
          trxId: trxId.trim().toUpperCase(),
          senderPhone: senderPhone.trim(),
          bKashNumber: '01998789157',
          mode: paymentMethod === 'bKash' ? bKashPaymentMode : 'full',
        },
      });
    } catch (orderErr) {
      console.error('Order creation failed:', orderErr);
      setLoading(false);
      setPaymentError(
        orderErr.response?.data?.message ||
        orderErr.message ||
        'Failed to place order. Please check your delivery address and details and try again.'
      );
      return;
    }

    if (order) {
      saveOrderLocally(order);
    }

    // 1. Safe Meta Pixel Integration ('window.fbq') & 2. Correct Purchase Payload Format
    const finalAmount = Number(order?.totalAmount || order?.total || total || 0);
    const contentIds = cartItems
      .map((item) => String(item.id || item.productId || item._id || item.product?._id || item.product || ''))
      .filter(Boolean);

    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      try {
        const purchasePayload = {
          content_type: 'product',
          content_ids: contentIds,
          value: Number(finalAmount), // Must be a valid Number, not a string or undefined
          currency: 'BDT',             // Must be uppercase 'BDT'
          num_items: cartItems.length,
        };
        window.fbq('track', 'Purchase', purchasePayload);
        // 4. Debug Logging
        console.log('[Meta Pixel] Purchase event dispatched successfully:', purchasePayload);
      } catch (pixelErr) {
        console.warn('[Meta Pixel] Error dispatching Purchase event:', pixelErr);
      }
    } else {
      console.log('[Meta Pixel] window.fbq not available (adblocker or dev environment).');
    }

    // Also notify modular pixel helper for deduplication cache
    trackPurchase(order);

    // 3. Async Race Condition Prevention (The 400ms Delay Trick):
    // Wrap the success state transition, UI confirmation, and cart clearing inside a 400ms setTimeout.
    // This gives the browser networking thread sufficient time to transmit the Meta Pixel beacon
    // before the page unloads, redirects, or tears down the active context.
    setTimeout(() => {
      setLoading(false);
      setPlacedOrder(order);
      clearCart();
      console.log('[Checkout] 400ms beacon window completed. Cart cleared and confirmation rendered.');
    }, 400);
  };

  const handleCheckoutSubmit = handlePlaceOrder;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-red-100 text-actionRed flex items-center justify-center text-xl">
          <BsCart3 />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-charcoal">
            Shopping Cart & Checkout
          </h1>
          <p className="text-xs text-gray-500">
            Review your household items and place Cash on Delivery order
          </p>
        </div>
      </div>

      {placedOrder ? (
        /* Order Confirmed Screen matching exact invoice data structure */
        <div className="bg-white rounded-xl border border-gray-200 p-8 sm:p-10 max-w-xl mx-auto text-center shadow-md animate-fadeIn space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto">
            <BsCheckCircleFill />
          </div>

          <h2 className="text-2xl font-black text-charcoal">
            Order Placed Successfully!
          </h2>
          <p className="text-xs text-gray-500">
            Your invoice has been created and will be handed over to Steadfast courier.
          </p>

          {/* Ordered Products Breakdown */}
          <div className="bg-gray-50 rounded-lg p-4 text-left text-xs space-y-2 border border-gray-200">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block border-b border-gray-200 pb-1.5">
              Ordered Package Items ({placedOrder.items?.length || 0})
            </span>
            <div className="space-y-2">
              {placedOrder.items?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-white p-2.5 rounded-md border border-gray-100">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                      className="w-12 h-12 object-cover rounded-md border border-gray-200 bg-white shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-charcoal line-clamp-1">
                      {item.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 mt-0.5">
                      {item.color && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded font-medium">
                          {item.colorCode && (
                            <span
                              className="w-2 h-2 rounded-full border border-gray-300"
                              style={{ backgroundColor: item.colorCode }}
                            />
                          )}
                          <span>Color: <strong>{item.color}</strong></span>
                        </span>
                      )}
                      <span className="text-[10px] text-gray-500">
                        Qty: <strong>{item.quantity}</strong>
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-actionRed shrink-0">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-5 text-left text-xs space-y-2.5 border border-gray-200">
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="font-bold text-gray-500">Invoice Number:</span>
              <span className="font-black text-primary text-sm">{placedOrder.invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Customer Name:</span>
              <span className="font-bold text-charcoal">{placedOrder.customerDetails.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Email:</span>
              <span className="font-bold text-charcoal">{placedOrder.customerDetails.email || 'None (Cash on Delivery)'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Contact Phone:</span>
              <span className="font-bold text-charcoal">{placedOrder.customerDetails.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Delivery Address:</span>
              <span className="font-semibold text-charcoal">{placedOrder.customerDetails.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Courier Partner:</span>
              <span className="font-bold text-actionRed">{placedOrder.courierData.provider} ({placedOrder.courierData.trackingCode})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Delivery Zone:</span>
              <span className="font-semibold text-charcoal">{placedOrder.customerDetails.deliveryLocation || activeDelivery.location} (৳{placedOrder.deliveryFee})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payment Mode:</span>
              <span className={`font-bold ${placedOrder.paymentMethod === 'bKash' ? 'text-[#E2136E]' : 'text-emerald-600'}`}>
                {placedOrder.paymentMethod === 'bKash' ? 'bKash (Send Money)' : 'Cash on Delivery (COD)'}
              </span>
            </div>
            {placedOrder.paymentMethod === 'bKash' && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-500">Transaction ID (TrxID):</span>
                  <span className="font-mono font-bold text-charcoal">{placedOrder.paymentDetails?.trxId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">bKash Payment Option:</span>
                  <span className="font-semibold">{placedOrder.paymentDetails?.mode === 'delivery' || (!placedOrder.paymentDetails?.mode && bKashPaymentMode === 'delivery') ? 'Delivery Charge Only' : 'Full Payment'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount to Verify:</span>
                  <span className="font-bold">৳{(placedOrder.paymentDetails?.mode === 'delivery' || (!placedOrder.paymentDetails?.mode && bKashPaymentMode === 'delivery') ? placedOrder.deliveryFee : placedOrder.totalAmount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Due on Delivery:</span>
                  <span className="font-bold">৳{(placedOrder.paymentDetails?.mode === 'delivery' || (!placedOrder.paymentDetails?.mode && bKashPaymentMode === 'delivery') ? placedOrder.totalAmount - placedOrder.deliveryFee : 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Status:</span>
                  <span className="font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[10px]">
                    Pending Verification
                  </span>
                </div>
              </>
            )}
            <div className="flex justify-between border-t border-gray-200 pt-2 font-black text-sm">
              <span>Total Order Amount:</span>
              <span className="text-actionRed">৳{placedOrder.totalAmount.toLocaleString()}</span>
            </div>
          </div>

          {placedOrder.paymentMethod === 'bKash' && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-left text-xs space-y-1">
              <p className="font-bold text-amber-900">Payment Pending Verification</p>
              <p className="text-amber-800 text-[11px] leading-relaxed">
                We&apos;ve received your order and bKash transaction details. Your payment is currently pending verification. We&apos;ll proceed with your order once the payment has been verified.
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-3">
            <button
              onClick={() => navigate('/track-order')}
              className="flex-1 bg-primary hover:bg-primary-dark text-white text-xs font-bold py-3 rounded-md transition-colors"
            >
              Track Order Status
            </button>
            <Link
              to="/shop"
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-charcoal text-xs font-bold py-3 rounded-md transition-colors text-center"
            >
              Back to Shopping
            </Link>
          </div>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center max-w-lg mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-2xl mx-auto mb-4">
            <BsCart3 />
          </div>
          <h3 className="font-bold text-base text-charcoal mb-1">
            Your cart is currently empty
          </h3>
          <p className="text-xs text-gray-500 mb-6">
            Looks like you haven't added any products yet.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-actionRed hover:bg-actionRed-hover text-white text-xs font-bold uppercase px-6 py-3 rounded-md transition-colors"
          >
            <span>Start Shopping</span>
            <FiArrowRight />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Cart Items Table/List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 shadow-xs overflow-hidden">
              <div className="p-4 bg-gray-50 font-bold text-xs uppercase tracking-wider text-charcoal flex justify-between">
                <span>Products in Cart ({cartItems.length})</span>
                <span className="text-gray-400 font-normal">Free 7-Day Replacement</span>
              </div>

              {cartItems.map((item, idx) => {
                const itemKey = item._id?.$oid || item.product?.$oid || idx;
                return (
                  <div
                    key={itemKey}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 justify-between"
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 rounded-lg object-cover bg-gray-50 shrink-0 border border-gray-100"
                      />
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-charcoal line-clamp-1">
                          {item.title}
                        </h4>
                        {item.selectedVariant && (
                          <span className="text-[10px] text-gray-500 block">
                            Color: <strong>{item.selectedVariant.colorName}</strong>
                          </span>
                        )}
                        <span className="text-xs font-bold text-actionRed mt-0.5 inline-block">
                          ৳{item.price.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Quantity selector & remove button */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                      <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-gray-50">
                        <button
                          onClick={() => updateQuantity(item._id?.$oid || itemKey, -1)}
                          className="p-2 hover:bg-gray-200 text-gray-600 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <FiMinus className="text-xs" />
                        </button>
                        <span className="px-3 text-xs font-bold text-charcoal bg-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id?.$oid || itemKey, 1)}
                          className="p-2 hover:bg-gray-200 text-gray-600 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <FiPlus className="text-xs" />
                        </button>
                      </div>

                      <div className="font-black text-sm text-charcoal min-w-[70px] text-right">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </div>

                      <button
                        onClick={() => removeFromCart(item._id?.$oid || itemKey)}
                        className="text-gray-400 hover:text-actionRed p-1 transition-colors"
                        title="Remove product"
                        aria-label="Remove item"
                      >
                        <BsTrash className="text-base" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Checkout & Customer Details Form */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-wider text-charcoal border-b border-gray-100 pb-3 flex items-center justify-between">
                <span>Delivery & Customer Details</span>
                <FiTruck className="text-actionRed text-lg" />
              </h3>

              {/* Login Required Alert if not authenticated */}
              {!currentUser && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-left space-y-2 mb-4">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                      <FiUser className="text-base" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-amber-900">
                        Sign In Required to Place Order
                      </h4>
                      <p className="text-[11px] text-amber-800 leading-snug mt-0.5">
                        You must be logged in to your account to checkout and place an order.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/account')}
                    className="w-full bg-primary hover:bg-primary-dark text-white text-xs font-bold py-2 px-3 rounded-md transition-colors shadow-2xs flex items-center justify-center gap-1.5"
                  >
                    <FiLock className="text-xs" />
                    <span>Login or Register to Continue</span>
                  </button>
                </div>
              )}

              {/* Email Verification Required Alert if logged in but unverified */}
              {currentUser && !isVerified && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-left space-y-2.5 mb-4">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                      <FiMail className="text-base" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-xs sm:text-sm text-amber-900">
                        Email Verification Required
                      </h4>
                      <p className="text-[11px] text-amber-800 leading-snug">
                        Your email address (<strong>{currentUser.email}</strong>) is not verified. Please verify your email before placing an order.
                      </p>
                    </div>
                  </div>

                  {verificationStatus && (
                    <div
                      className={`p-2.5 rounded-md text-[11px] font-semibold leading-relaxed ${
                        verificationStatus.includes('successfully')
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100/90 text-amber-900 border border-amber-300'
                      }`}
                    >
                      {verificationStatus}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={handleResendVerification}
                      disabled={isResending || resendCooldown > 0}
                      className="px-3 py-1.5 bg-[#003D73] hover:bg-[#002b52] text-white text-[11px] font-bold rounded-md transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <FiMail className="text-xs" />
                      <span>
                        {isResending
                          ? 'Sending...'
                          : resendCooldown > 0
                          ? `Wait (${resendCooldown}s)`
                          : 'Resend Verification Email'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCheckVerification}
                      disabled={isRefreshing}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-[11px] font-bold rounded-md transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <FiRefreshCw
                        className={`text-xs ${isRefreshing ? 'animate-spin text-[#003D73]' : ''}`}
                      />
                      <span>I Have Verified (Refresh)</span>
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handleCheckoutSubmit} className="space-y-3.5">
                <div>
                  <label htmlFor="customer-name-field" className="block text-xs font-bold text-charcoal mb-1">
                    Customer Full Name *
                  </label>
                  <input
                    id="customer-name-field"
                    type="text"
                    required
                    value={activeName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Md. Al Saef Ratul"
                    className="w-full bg-gray-50 border border-gray-200 text-xs px-3.5 py-2.5 rounded-md outline-none focus:border-primary"
                  />
                </div>

                {/* Readonly Customer Email with Verification Status */}
                <div>
                  <label htmlFor="customer-email-field" className="block text-xs font-bold text-charcoal mb-1 flex items-center justify-between">
                    <span>Customer Email</span>
                    {currentUser ? (
                      isVerified ? (
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          ✓ Verified
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-800 font-bold bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          ⚠️ Unverified
                        </span>
                      )
                    ) : (
                      <span className="text-[10px] text-slate-400 font-normal">
                        Account required
                      </span>
                    )}
                  </label>
                  <input
                    id="customer-email-field"
                    type="email"
                    readOnly
                    value={customerEmail || (currentUser ? '' : 'Cash on Delivery (No sign-in required)')}
                    className={`w-full border text-xs px-3.5 py-2.5 rounded-md outline-none cursor-not-allowed select-none font-medium ${
                      currentUser
                        ? isVerified
                          ? 'bg-slate-100 border-slate-200 text-slate-700'
                          : 'bg-amber-50/70 border-amber-200 text-amber-900'
                        : 'bg-amber-50/70 border-amber-200 text-amber-800'
                    }`}
                    placeholder="customer@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="customer-phone-field" className="block text-xs font-bold text-charcoal mb-1 flex items-center justify-between">
                    <span>Contact Phone Number (মোবাইল নম্বর) *</span>
                    <span className="text-[11px] text-slate-500 font-normal">১১ ডিজিট (যেমন: 01712345678)</span>
                  </label>
                  <input
                    id="customer-phone-field"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (phoneError) setPhoneError('');
                    }}
                    placeholder="01XXXXXXXXX"
                    className={`w-full bg-gray-50 border text-xs px-3.5 py-2.5 rounded-lg outline-none transition-colors ${
                      phoneError
                        ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                        : 'border-gray-200 focus:border-primary focus:bg-white'
                    }`}
                  />
                  {phoneError && (
                    <p className="text-[11px] font-bold text-rose-600 mt-1 flex items-center gap-1 animate-shake">
                      <span>⚠️</span>
                      <span>{phoneError}</span>
                    </p>
                  )}
                </div>

                {/* Structured Division, District & Thana/Upazila inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label htmlFor="customer-division-field" className="block text-xs font-bold text-charcoal mb-1">
                      Division (বিভাগ)
                    </label>
                    <select
                      id="customer-division-field"
                      value={division}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDivision(val);
                        const matchedCurrent = availableDistricts.find((d) => d.name === district);
                        if (matchedCurrent && val && matchedCurrent.division !== val) {
                          setDistrict('');
                          const best = getBestMatchingDeliveryZone(deliveryCharges, '');
                          if (best) setSelectedDeliveryId(best.id);
                        }
                      }}
                      className="w-full bg-gray-50 border border-gray-200 text-xs px-3 py-2.5 rounded-lg outline-none focus:border-primary focus:bg-white transition-colors cursor-pointer"
                    >
                      <option value="">নির্বাচন করুন (Select)</option>
                      <option value="Dhaka">Dhaka (ঢাকা)</option>
                      <option value="Chattogram">Chattogram (চট্টগ্রাম)</option>
                      <option value="Rajshahi">Rajshahi (রাজশাহী)</option>
                      <option value="Khulna">Khulna (খুলনা)</option>
                      <option value="Barishal">Barishal (বরিশাল)</option>
                      <option value="Sylhet">Sylhet (সিলেট)</option>
                      <option value="Rangpur">Rangpur (রংপুর)</option>
                      <option value="Mymensingh">Mymensingh (ময়মনসিংহ)</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="customer-district-field" className="block text-xs font-bold text-charcoal mb-1">
                      District (জেলা) *
                    </label>
                    <select
                      id="customer-district-field"
                      required
                      value={district}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDistrict(val);
                        if (districtError) setDistrictError('');
                        const matched = availableDistricts.find((d) => d.name === val);
                        if (matched && matched.division && !division) {
                          setDivision(matched.division);
                        }
                        // Automatically select the geographically valid delivery zone
                        if (val) {
                          const best = getBestMatchingDeliveryZone(deliveryCharges, val, thana);
                          if (best) setSelectedDeliveryId(best.id);
                        }
                      }}
                      className={`w-full bg-gray-50 border text-xs px-3 py-2.5 rounded-lg outline-none transition-colors cursor-pointer ${
                        districtError
                          ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                          : 'border-gray-200 focus:border-primary focus:bg-white'
                      }`}
                    >
                      <option value="">জেলা নির্বাচন করুন (Select)</option>
                      {availableDistricts
                        .filter((d) => !division || d.division === division)
                        .map((d) => {
                          const isAvailable = d.isActive !== false;
                          return (
                            <option
                              key={d.name}
                              value={d.name}
                              disabled={!isAvailable}
                              className={!isAvailable ? 'text-slate-400 bg-slate-100 font-normal' : 'text-slate-900'}
                            >
                              {d.name} ({d.bn}){isAvailable ? '' : ' - ডেলিভারি অনুপলব্ধ (Not Available)'}
                            </option>
                          );
                        })}
                    </select>
                    {districtError && (
                      <p className="text-[11px] font-bold text-rose-600 mt-1 flex items-center gap-1 animate-shake">
                        <span>⚠️</span>
                        <span>{districtError}</span>
                      </p>
                    )}
                    {availableDistricts.find((d) => d.name === district)?.isActive === false && (
                      <div className="mt-2 p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-medium leading-relaxed">
                        ⚠️ দুঃখিত, আপনার নির্বাচিত জেলাটিতে (<strong>{district}</strong>) বর্তমানে ডেলিভারি সেবা সাময়িকভাবে বন্ধ রয়েছে (Delivery currently unavailable in this district)।
                      </div>
                    )}
                  </div>
                  <div>
                    <label htmlFor="customer-thana-field" className="block text-xs font-bold text-charcoal mb-1">
                      Thana / Upazila (থানা বা উপজেলা) *
                    </label>
                    <input
                      id="customer-thana-field"
                      type="text"
                      required
                      value={thana}
                      onChange={(e) => {
                        const val = e.target.value;
                        setThana(val);
                        if (thanaError) setThanaError('');
                        if (district) {
                          const best = getBestMatchingDeliveryZone(deliveryCharges, district, val);
                          if (best) setSelectedDeliveryId(best.id);
                        }
                      }}
                      placeholder="যেমন: সরাইল, মিরপুর, রায়পুরা"
                      className={`w-full bg-gray-50 border text-xs px-3.5 py-2.5 rounded-lg outline-none transition-colors ${
                        thanaError
                          ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                          : 'border-gray-200 focus:border-primary focus:bg-white'
                      }`}
                    />
                    {thanaError && (
                      <p className="text-[11px] font-bold text-rose-600 mt-1 flex items-center gap-1 animate-shake">
                        <span>⚠️</span>
                        <span>{thanaError}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Detailed Street / Village Address */}
                <div>
                  <label htmlFor="customer-address-field" className="block text-xs font-bold text-charcoal mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <FiMapPin className="text-primary w-3.5 h-3.5" />
                      Detailed Street / Village Address (বাড়ি বা রাস্তার নাম, গ্রাম, ল্যান্ডমার্ক) *
                    </span>
                    <span className="text-[11px] text-slate-500 font-normal">কমপক্ষে ৬ অক্ষর</span>
                  </label>
                  <textarea
                    id="customer-address-field"
                    rows={3}
                    required
                    value={streetAddress || address}
                    onChange={(e) => {
                      const val = e.target.value;
                      setStreetAddress(val);
                      setAddress(val);
                      if (addressError) setAddressError('');
                    }}
                    placeholder="বাড়ি নং / রোড নং / গ্রাম, পোস্ট অফিস, পরিচিত ল্যান্ডমার্ক (যেমন: বাজারের উত্তর পাশে)"
                    className={`w-full bg-gray-50 border text-xs px-3.5 py-2.5 rounded-lg outline-none transition-colors leading-relaxed ${
                      addressError
                        ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                        : 'border-gray-200 focus:border-primary focus:bg-white'
                    }`}
                  />
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    <span className="font-semibold text-slate-700">কুরিয়ার ডেলিভারি ম্যানের সুবিধার জন্য বিস্তারিত সঠিক ঠিকানা দিন।</span>
                  </p>
                  {addressError && (
                    <p className="text-[11px] font-bold text-rose-600 mt-1.5 flex items-center gap-1 animate-shake">
                      <span>⚠️</span>
                      <span>{addressError}</span>
                    </p>
                  )}
                </div>

                {/* Delivery Area Selection */}
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1.5 flex items-center justify-between">
                    <span>Delivery Destination *</span>
                    <span className="text-[11px] text-primary font-medium">
                      {district ? `জেলা: ${district}` : 'Choose delivery zone'}
                    </span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {(deliveryCharges || []).map((option) => {
                      const isSelected = selectedDeliveryId === option.id;
                      const isApplicable = isZoneApplicableForDistrict(option, district, deliveryCharges);
                      const targetDistrict = getTargetDistrictForZone(option);

                      // Helper text for distinct user clarity
                      const isInsideBrahmanbaria = option.id === 'inside-brahmanbaria' || (option.charge === 60 && option.location.toLowerCase().includes('brahmanbaria'));
                      const isWithoutBrahmanbaria = option.id === 'without-brahmanbaria-city' || option.charge === 130;
                      const isInsideDhaka = option.id === 'inside-dhaka' || (option.charge === 120 && option.location.toLowerCase().includes('dhaka'));

                      const areaHint = isInsideBrahmanbaria
                        ? 'সদর / সিটি এলাকা'
                        : isWithoutBrahmanbaria
                        ? 'সরাইল, কসবা ও সারাদেশ'
                        : isInsideDhaka
                        ? 'ঢাকা সিটি এলাকা'
                        : null;

                      return (
                        <button
                          key={option.id}
                          type="button"
                          disabled={!isApplicable}
                          onClick={() => {
                            if (!isApplicable) return;
                            setSelectedDeliveryId(option.id);
                          }}
                          className={`p-2.5 rounded-lg border text-left transition-all relative flex flex-col justify-between ${
                            !isApplicable
                              ? 'opacity-40 bg-slate-50 border-slate-200 cursor-not-allowed select-none'
                              : isSelected
                              ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-2xs cursor-pointer'
                              : 'border-gray-200 bg-white hover:border-gray-300 cursor-pointer'
                          }`}
                          title={
                            !isApplicable
                              ? targetDistrict
                                ? `শুধুমাত্র ${targetDistrict} জেলার জন্য প্রযোজ্য`
                                : `${district || 'আপনার'} জেলার জন্য প্রযোজ্য নয়`
                              : option.location
                          }
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1">
                              <span
                                className={`text-xs font-bold ${
                                  !isApplicable
                                    ? 'text-slate-400 line-through'
                                    : isSelected
                                    ? 'text-primary'
                                    : 'text-charcoal'
                                }`}
                              >
                                {option.location}
                              </span>
                              <span
                                className={`text-xs font-black shrink-0 ${
                                  !isApplicable
                                    ? 'text-slate-400'
                                    : isSelected
                                    ? 'text-actionRed'
                                    : 'text-slate-700'
                                }`}
                              >
                                ৳{option.charge}
                              </span>
                            </div>
                            {areaHint && (
                              <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                                {areaHint}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-100">
                            <span className="text-[10px] text-gray-500 block">
                              {option.estimatedDays}
                            </span>
                            {!isApplicable ? (
                              <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-1 py-0.2 rounded">
                                {targetDistrict ? `শুধু ${targetDistrict}` : 'অনুপযুক্ত'}
                              </span>
                            ) : isSelected ? (
                              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded">
                                নির্বাচিত
                              </span>
                            ) : null}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {district && (
                    <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>
                        আপনার নির্বাচিত জেলা (<strong>{district}</strong>) অনুযায়ী ডেলিভারি চার্জ স্বয়ংক্রিয়ভাবে নির্ধারিত হয়েছে।
                      </span>
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="customer-note-field" className="block text-xs font-bold text-charcoal mb-1">
                    Order Note (Optional)
                  </label>
                  <input
                    id="customer-note-field"
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Special instructions..."
                    className="w-full bg-gray-50 border border-gray-200 text-xs px-3.5 py-2 rounded-md outline-none focus:border-primary"
                  />
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-gray-100 pt-3 space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-charcoal">৳{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Home Delivery ({activeDelivery.location})</span>
                    <span className="font-bold text-charcoal">৳{deliveryFee}</span>
                  </div>
                  <div className="border-t border-gray-100 pt-2 flex justify-between text-sm font-black text-charcoal">
                    <span>Total Amount</span>
                    <span className="text-actionRed">৳{total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Payment Option Selection */}
                <div className="space-y-2.5">
                  <span className="block text-xs font-bold text-charcoal">
                    Payment Method *
                  </span>

                  {/* Cash on Delivery */}
                  <label
                    htmlFor="cod-radio-input"
                    className={`p-3 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === 'COD'
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        id="cod-radio-input"
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'COD'}
                        onChange={() => {
                          setPaymentMethod('COD');
                          setPaymentError('');
                        }}
                        className="accent-actionRed"
                      />
                      <div>
                        <span className="font-bold text-charcoal block">Cash on Delivery (COD)</span>
                        <span className="text-[11px] text-gray-500">Pay when your order arrives</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded">
                      Pay upon receipt
                    </span>
                  </label>

                  {/* Payment via bKash */}
                  <label
                    htmlFor="bkash-radio-input"
                    className={`p-3 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === 'bKash'
                        ? 'border-[#E2136E] bg-pink-50/50 ring-1 ring-[#E2136E]'
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        id="bkash-radio-input"
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'bKash'}
                        onChange={() => {
                          setPaymentMethod('bKash');
                          setPaymentError('');
                        }}
                        className="accent-[#E2136E]"
                      />
                      <div>
                        <span className="font-bold text-[#E2136E] block">Payment via bKash</span>
                        <span className="text-[11px] text-gray-500">Send Money &amp; submit Transaction ID</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#E2136E] font-bold bg-pink-100 border border-pink-200 px-2 py-0.5 rounded">
                      Manual Verification
                    </span>
                  </label>

                  {/* bKash Payment Instructions & Input fields */}
                  {paymentMethod === 'bKash' && (
                    <div className="p-3.5 bg-pink-50/40 border border-pink-200 rounded-lg text-xs space-y-3 animate-fadeIn">
                    {/* Choose how much to pay in advance */}
                    <fieldset className="space-y-2">
                      <legend className="text-xs font-bold text-charcoal">
                        bKash Payment Option *
                      </legend>
                      <label className={`flex items-start gap-2 rounded-md border p-2.5 cursor-pointer ${
                        bKashPaymentMode === 'full' ? 'border-[#E2136E] bg-pink-50' : 'border-gray-200 bg-white'
                      }`}>
                        <input
                          type="radio"
                          name="cart-bkash-mode"
                          value="full"
                          checked={bKashPaymentMode === 'full'}
                          onChange={() => { setBKashPaymentMode('full'); setPaymentError(''); }}
                          className="mt-0.5 accent-[#E2136E]"
                        />
                        <span><strong className="block">Full Payment</strong>
                          <span className="text-[11px] text-gray-600">Pay the entire order total now.</span>
                        </span>
                      </label>
                      <label className={`flex items-start gap-2 rounded-md border p-2.5 cursor-pointer ${
                        bKashPaymentMode === 'delivery' ? 'border-[#E2136E] bg-pink-50' : 'border-gray-200 bg-white'
                      }`}>
                        <input
                          type="radio"
                          name="cart-bkash-mode"
                          value="delivery"
                          checked={bKashPaymentMode === 'delivery'}
                          disabled={deliveryFee <= 0}
                          onChange={() => { setBKashPaymentMode('delivery'); setPaymentError(''); }}
                          className="mt-0.5 accent-[#E2136E]"
                        />
                        <span><strong className="block">Delivery Charge Only</strong>
                          <span className="text-[11px] text-gray-600">Pay the delivery charge now and the product price on delivery.</span>
                        </span>
                      </label>
                    </fieldset>

                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                          Send Money to:
                        </span>
                        <div className="flex items-center justify-between bg-white px-3 py-2 rounded-md border border-pink-200">
                          <strong className="text-base text-charcoal font-mono tracking-wider">
                            01998789157
                          </strong>
                          <button
                            type="button"
                            onClick={handleCopyBkash}
                            className="bg-[#E2136E] hover:bg-[#C1105D] text-white text-[11px] font-bold px-3 py-1 rounded transition-colors"
                          >
                            {copiedNumber ? '✓ Copied!' : 'Copy Number'}
                          </button>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-700 leading-relaxed bg-white/80 p-2.5 rounded border border-pink-100">
                        Send <strong className="text-actionRed font-bold">৳{bKashPayNow.toLocaleString()}</strong> {bKashPaymentMode === 'delivery' ? '(delivery charge only)' : '(full order payment)'} to the bKash number above using <strong>Send Money</strong>.
                        {bKashPaymentMode === 'delivery' && (
                          <span className="block mt-1 font-medium">Remaining ৳{remainingOnDelivery.toLocaleString()} is payable on delivery after payment verification.</span>
                        )}
                      </p>

                      <div>
                        <label htmlFor="bkash-trxid-field" className="block text-xs font-bold text-charcoal mb-1">
                          bKash Transaction ID (TrxID) *
                        </label>
                        <input
                          id="bkash-trxid-field"
                          type="text"
                          required
                          value={trxId}
                          onChange={(e) => {
                            setTrxId(e.target.value.toUpperCase());
                            setPaymentError('');
                          }}
                          placeholder="e.g. 9J54AKL980"
                          className="w-full bg-white border border-pink-300 text-xs px-3 py-2 rounded-md font-mono tracking-wider outline-none focus:border-[#E2136E]"
                        />
                      </div>

                      <div>
                        <label htmlFor="bkash-sender-phone" className="block text-xs font-bold text-charcoal mb-1">
                          Sender bKash Phone Number (Optional)
                        </label>
                        <input
                          id="bkash-sender-phone"
                          type="tel"
                          value={senderPhone}
                          onChange={(e) => setSenderPhone(e.target.value)}
                          placeholder="01XXXXXXXXX"
                          className="w-full bg-white border border-gray-200 text-xs px-3 py-2 rounded-md outline-none focus:border-[#E2136E]"
                        />
                      </div>

                      {paymentError && (
                        <p className="text-[11px] font-bold text-actionRed">
                          ⚠️ {paymentError}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {paymentMethod === 'bKash' && (
                  <div className="rounded-lg border border-pink-200 bg-pink-50/40 p-3 space-y-1.5 text-xs">
                    <div className="flex justify-between font-bold text-[#E2136E]">
                      <span>Send Now via bKash</span>
                      <span>৳{bKashPayNow.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Due on Delivery</span>
                      <span>৳{remainingOnDelivery.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                {!currentUser ? (
                  <button
                    type="button"
                    onClick={() => navigate('/account')}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase py-3.5 rounded-md transition-colors shadow-md mt-2 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FiLock className="text-base" />
                    <span>Sign In to Place Order</span>
                  </button>
                ) : !isVerified ? (
                  <button
                    type="button"
                    onClick={handleCheckVerification}
                    disabled={isRefreshing}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase py-3.5 rounded-md transition-colors shadow-md mt-2 flex items-center justify-center gap-2 cursor-pointer"
                    title="Please verify your email before placing an order"
                  >
                    <FiRefreshCw className={`text-base ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span>
                      {isRefreshing
                        ? 'Checking Verification Status...'
                        : 'Verify Email to Place Order (Click to Refresh)'}
                    </span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-actionRed hover:bg-actionRed-hover text-white font-bold text-xs uppercase py-3.5 rounded-md transition-colors shadow-md mt-2 disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? 'Submitting Order...' : paymentMethod === 'bKash' ? 'Submit bKash Order' : 'Confirm Cash on Delivery Order'}
                  </button>
                )}
              </form>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Cart;
