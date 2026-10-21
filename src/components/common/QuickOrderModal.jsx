import { useState } from 'react';
import { FiX, FiCheck, FiShoppingBag, FiUser, FiLock, FiMail, FiRefreshCw, FiMapPin } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { useAuth } from '../../context/AuthContext';
import { validateDetailedAddress, validateBdPhone, BANGLADESH_DISTRICTS } from '../../utils/addressValidation';
import {
  optimizeImageUrl,
  handleOptimizedImageError,
} from '../../utils/imageOptimizer';

const QuickOrderModal = () => {
  const {
    isQuickOrderOpen,
    setIsQuickOrderOpen,
    quickOrderProduct,
    createOrder,
    deliveryCharges,
  } = useShop();
  const { currentUser, sendVerificationEmail, reloadUser } = useAuth();
  const navigate = useNavigate();

  const isVerified = Boolean(currentUser?.emailVerified);
  const customerEmail = currentUser?.email || 'Please sign in to order';
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [division, setDivision] = useState('');
  const [district, setDistrict] = useState('');
  const [thana, setThana] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedDeliveryId, setSelectedDeliveryId] = useState('inside-dhaka');
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
        setVerificationStatus('Email verified successfully! You can now place your order.');
      } else {
        setVerificationStatus('Not verified yet. Please click the verification link sent to your email.');
      }
    } catch {
      setVerificationStatus('Unable to refresh verification status. Please check again.');
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!isQuickOrderOpen || !quickOrderProduct) return null;

  const product = quickOrderProduct.product;
  const currentVariant = selectedVariant || quickOrderProduct.selectedVariant || product.variants?.[0];
  const activeImage = currentVariant?.images?.[0] || product.variants?.[0]?.images?.[0] || product.image;

  const orderQuantity = quickOrderProduct.quantity || 1;

  const activeDelivery =
    deliveryCharges?.find((d) => d.id === selectedDeliveryId) ||
    deliveryCharges?.[0] || {
      id: 'inside-dhaka',
      location: 'Inside Dhaka',
      charge: 60,
      estimatedDays: '1-2 Business Days',
    };
  const deliveryFee = activeDelivery.charge;
  const totalAmount = product.price * orderQuantity + deliveryFee;
  const bKashPayNow = bKashPaymentMode === 'delivery' ? deliveryFee : totalAmount;
  const remainingOnDelivery = totalAmount - bKashPayNow;

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) {
      handleClose();
      navigate('/account');
      return;
    }
    if (!isVerified) {
      setVerificationStatus('Your account email must be verified before placing an order.');
      return;
    }
    if (!activeName) {
      const el = document.getElementById('quick-order-name-field');
      if (el) el.focus();
      return;
    }

    const cleanPhone = phone.trim();
    const phoneValidationErr = validateBdPhone(cleanPhone);
    if (phoneValidationErr) {
      setPhoneError(phoneValidationErr);
      const el = document.getElementById('quick-order-phone-field');
      if (el) el.focus();
      return;
    }
    setPhoneError('');

    if (!district.trim()) {
      setDistrictError('অনুগ্রহ করে জেলা (District) নির্বাচন করুন।');
      const el = document.getElementById('quick-order-district-field');
      if (el) el.focus();
      return;
    }
    setDistrictError('');

    if (!thana.trim()) {
      setThanaError('অনুগ্রহ করে থানা বা উপজেলা (Thana/Upazila) লিখুন।');
      const el = document.getElementById('quick-order-thana-field');
      if (el) el.focus();
      return;
    }
    setThanaError('');

    const cleanStreet = (streetAddress || address).trim();
    if (!cleanStreet) {
      setAddressError('অনুগ্রহ করে বাড়ি নং / রোড নং / গ্রাম বা বিস্তারিত ঠিকানা লিখুন।');
      const el = document.getElementById('quick-order-address-field');
      if (el) el.focus();
      return;
    }
    if (cleanStreet.length < 6) {
      setAddressError('বিস্তারিত ঠিকানা অত্যন্ত সংক্ষিপ্ত (কমপক্ষে ৬ অক্ষর আবশ্যক, যেমন: বাড়ি বা রোডের বিবরণ দিন)।');
      const el = document.getElementById('quick-order-address-field');
      if (el) el.focus();
      return;
    }

    // Construct courier-compliant hierarchical recipient address: [Street / Village] + [Thana] + [District]
    const fullAddress = `${cleanStreet}, ${thana.trim()}, ${district.trim()}`;

    const addressValidationErr = validateDetailedAddress(fullAddress);
    if (addressValidationErr) {
      setAddressError(addressValidationErr);
      const el = document.getElementById('quick-order-address-field');
      if (el) el.focus();
      return;
    }
    setAddressError('');

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

    const chosenColorName = currentVariant?.colorName || 'Standard';
    const chosenColorCode = currentVariant?.colorCode || '';

    const singleItem = [
      {
        product: {
          $oid: product._id?.$oid || product.id?.toString(),
        },
        title: product.name,
        price: product.price,
        quantity: orderQuantity,
        color: chosenColorName,
        colorCode: chosenColorCode,
        selectedVariant: {
          colorName: chosenColorName,
          colorCode: chosenColorCode,
        },
        image: activeImage,
        category: product.category || 'General',
      },
    ];

    const order = createOrder({
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
      itemsList: singleItem,
      deliveryFee,
      paymentMethod,
      paymentDetails: {
        trxId: trxId.trim().toUpperCase(),
        senderPhone: senderPhone.trim(),
        bKashNumber: '01998789157',
        mode: paymentMethod === 'bKash' ? bKashPaymentMode : 'full',
      },
    });

    setLoading(false);
    setPlacedOrder(order);
  };

  const handleClose = () => {
    setIsQuickOrderOpen(false);
    setPlacedOrder(null);
    setCustomerName('');
    setPhone('');
    setAddress('');
    setNote('');
    setPaymentMethod('COD');
    setBKashPaymentMode('full');
    setTrxId('');
    setSenderPhone('');
    setPaymentError('');
    setSelectedDeliveryId('inside-dhaka');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto z-10 animate-fadeIn">
        
        {/* Header */}
        <div className="p-4 bg-[#050914] text-white flex items-center justify-between border-b border-gray-800 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <FiShoppingBag className="text-actionRed text-lg" />
            <h3 className="font-bold text-sm md:text-base">
              {placedOrder ? 'Order Confirmed!' : 'Quick Buy Now'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10"
            aria-label="Close modal"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {placedOrder ? (
          /* Order Confirmation View */
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto">
              <FiCheck />
            </div>

            <h4 className="text-xl font-black text-charcoal">
              {placedOrder.paymentMethod === 'bKash' ? 'Order Submitted Successfully!' : 'Thank You for Your Order!'}
            </h4>
            <p className="text-xs text-gray-500">
              {placedOrder.paymentMethod === 'bKash'
                ? "We've received your order and bKash transaction details. Your payment is currently pending verification."
                : 'Your order has been placed successfully. You will pay with Cash on Delivery when received.'}
            </p>

            {/* Ordered Item Details Preview */}
            <div className="bg-gray-50 rounded-lg p-3 text-left border border-gray-200 space-y-2">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                Ordered Item Details
              </span>
              {placedOrder.items?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-white p-2.5 rounded-md border border-gray-100">
                  {item.image && (
                    <img
                      src={optimizeImageUrl(item.image, { width: 120, quality: 75 })}
                      alt={item.title}
                      width="48"
                      height="48"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => handleOptimizedImageError(e, item.image)}
                      className="w-12 h-12 object-cover rounded-md border border-gray-200 bg-white shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-xs text-charcoal line-clamp-1">
                      {item.title}
                    </h5>
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

            <div className="bg-gray-50 rounded-lg p-4 text-left text-xs space-y-2 border border-gray-200">
              <div className="flex justify-between border-b border-gray-200 pb-1.5 font-bold">
                <span className="text-gray-500">Invoice Number:</span>
                <span className="text-primary">{placedOrder.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Recipient:</span>
                <span className="font-semibold">{placedOrder.customerDetails.name} ({placedOrder.customerDetails.phone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email:</span>
                <span className="font-semibold text-slate-700">{placedOrder.customerDetails.email || customerEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Courier Tracking:</span>
                <span className="font-semibold text-actionRed">{placedOrder.courierData.trackingCode} ({placedOrder.courierData.provider})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery Zone:</span>
                <span className="font-semibold text-slate-700">
                  {placedOrder.customerDetails.deliveryLocation || activeDelivery.location} (৳{placedOrder.deliveryFee})
                </span>
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
              <div className="flex justify-between border-t border-gray-200 pt-1.5 font-black text-sm">
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

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  handleClose();
                  navigate('/track-order');
                }}
                className="flex-1 bg-primary hover:bg-primary-dark text-white text-xs font-bold py-2.5 rounded-md transition-colors"
              >
                Track Shipment
              </button>
              <button
                onClick={handleClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-charcoal text-xs font-bold py-2.5 rounded-md transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          /* Order Form */
          <form onSubmit={handleOrderSubmit} className="p-5 space-y-4">
            
            {/* Selected Product Preview */}
            <div className="flex items-center gap-3.5 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <img
                src={optimizeImageUrl(activeImage, { width: 140, quality: 76 })}
                alt={product.name}
                width="64"
                height="64"
                loading="lazy"
                decoding="async"
                onError={(e) => handleOptimizedImageError(e, activeImage)}
                className="w-16 h-16 object-cover rounded-md bg-white border border-gray-200 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-xs md:text-sm text-charcoal line-clamp-1">
                  {product.name}
                </h4>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-sm font-black text-actionRed">
                    ৳{product.price.toLocaleString()}
                  </span>
                  {product.oldPrice && (
                    <span className="text-xs text-gray-400 line-through">
                      ৳{product.oldPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                {currentVariant && (
                  <span className="inline-block text-[10px] bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-600 mt-1">
                    Variant: <strong>{currentVariant.colorName}</strong>
                  </span>
                )}
              </div>
            </div>

            {/* Color Variant Selection if available */}
            {product.variants && product.variants.length > 1 && (
              <div>
                <label className="block text-[11px] font-bold text-charcoal mb-1.5 uppercase tracking-wider">
                  Select Color Variant:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedVariant(variant)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
                        currentVariant?.colorName === variant.colorName
                          ? 'border-actionRed bg-red-50 text-actionRed font-bold ring-1 ring-actionRed'
                          : 'border-gray-200 hover:border-gray-400 bg-white text-gray-700'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-gray-300"
                        style={{ backgroundColor: variant.colorCode }}
                      />
                      <span>{variant.colorName}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Login Required Notice if user is not authenticated */}
            {!currentUser && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-left space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <FiUser className="text-base" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-amber-900">
                      Sign In Required to Place Order
                    </h4>
                    <p className="text-[11px] text-amber-800 leading-snug mt-0.5">
                      You must be logged in to your account to place an order. Please sign in or create an account to proceed.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    navigate('/account');
                  }}
                  className="w-full bg-primary hover:bg-primary-dark text-white text-xs font-bold py-2.5 px-3 rounded-md transition-colors shadow-2xs flex items-center justify-center gap-1.5"
                >
                  <FiLock className="text-xs" />
                  <span>Login / Register to Continue</span>
                </button>
              </div>
            )}

            {/* Email Verification Required Alert if logged in but unverified */}
            {currentUser && !isVerified && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-left space-y-2.5">
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

            {/* Customer Details Fields */}
            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  Customer Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={activeName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Md. Al Saef Ratul"
                  className="w-full bg-gray-50 border border-gray-200 text-xs px-3.5 py-2.5 rounded-md outline-none focus:border-primary"
                />
              </div>

              {/* Customer Email Field (Readonly) */}
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1 flex items-center justify-between">
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
                  type="email"
                  readOnly
                  value={customerEmail}
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
                <label htmlFor="quick-order-phone-field" className="block text-xs font-bold text-charcoal mb-1 flex items-center justify-between">
                  <span>Contact Phone Number (মোবাইল নম্বর) *</span>
                  <span className="text-[11px] text-slate-500 font-normal">১১ ডিজিট (যেমন: 01712345678)</span>
                </label>
                <input
                  id="quick-order-phone-field"
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
                  <label htmlFor="quick-order-division-field" className="block text-xs font-bold text-charcoal mb-1">
                    Division (বিভাগ)
                  </label>
                  <select
                    id="quick-order-division-field"
                    value={division}
                    onChange={(e) => setDivision(e.target.value)}
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
                  <label htmlFor="quick-order-district-field" className="block text-xs font-bold text-charcoal mb-1">
                    District (জেলা) *
                  </label>
                  <select
                    id="quick-order-district-field"
                    required
                    value={district}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDistrict(val);
                      if (districtError) setDistrictError('');
                      const matched = BANGLADESH_DISTRICTS.find((d) => d.name === val);
                      if (matched && matched.division && !division) {
                        setDivision(matched.division);
                      }
                    }}
                    className={`w-full bg-gray-50 border text-xs px-3 py-2.5 rounded-lg outline-none transition-colors cursor-pointer ${
                      districtError
                        ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                        : 'border-gray-200 focus:border-primary focus:bg-white'
                    }`}
                  >
                    <option value="">জেলা নির্বাচন করুন (Select)</option>
                    {BANGLADESH_DISTRICTS.filter((d) => !division || d.division === division).map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.name} ({d.bn})
                      </option>
                    ))}
                  </select>
                  {districtError && (
                    <p className="text-[11px] font-bold text-rose-600 mt-1 flex items-center gap-1 animate-shake">
                      <span>⚠️</span>
                      <span>{districtError}</span>
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="quick-order-thana-field" className="block text-[10px] font-bold text-charcoal mb-1">
                    Thana / Upazila (থানা বা উপজেলা) *
                  </label>
                  <input
                    id="quick-order-thana-field"
                    type="text"
                    required
                    value={thana}
                    onChange={(e) => {
                      setThana(e.target.value);
                      if (thanaError) setThanaError('');
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
                <label htmlFor="quick-order-address-field" className="block text-xs font-bold text-charcoal mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FiMapPin className="text-primary w-3.5 h-3.5" />
                    Detailed Street / Village Address (বাড়ি বা রাস্তার নাম, গ্রাম, ল্যান্ডমার্ক) *
                  </span>
                  <span className="text-[11px] text-slate-500 font-normal">কমপক্ষে ৬ অক্ষর</span>
                </label>
                <textarea
                  id="quick-order-address-field"
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
                  <span className="text-[11px] text-primary font-medium">Select your area</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(deliveryCharges || []).map((option) => {
                    const isSelected = selectedDeliveryId === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setSelectedDeliveryId(option.id)}
                        className={`p-2.5 rounded-lg border text-left transition-all relative ${
                          isSelected
                            ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-2xs'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-bold ${
                              isSelected ? 'text-primary' : 'text-charcoal'
                            }`}
                          >
                            {option.location}
                          </span>
                          <span
                            className={`text-xs font-black ${
                              isSelected ? 'text-actionRed' : 'text-slate-700'
                            }`}
                          >
                            ৳{option.charge}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-500 block mt-0.5">
                          {option.estimatedDays}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  Order Note (Optional)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Any delivery preference or instructions"
                  className="w-full bg-gray-50 border border-gray-200 text-xs px-3.5 py-2 rounded-md outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Payment Option Selection */}
            <div className="space-y-2.5">
              <span className="block text-xs font-bold text-charcoal">
                Payment Method *
              </span>

              {/* Cash on Delivery */}
              <label
                htmlFor="quick-cod-input"
                className={`p-3 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'COD'
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    id="quick-cod-input"
                    type="radio"
                    name="quick-payment"
                    checked={paymentMethod === 'COD'}
                    onChange={() => {
                      setPaymentMethod('COD');
                      setPaymentError('');
                    }}
                    className="accent-actionRed"
                  />
                  <div>
                    <span className="font-bold text-charcoal block">Cash on Delivery (COD)</span>
                    <span className="text-[11px] text-gray-500">Pay when order arrives</span>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded">
                  Pay on delivery
                </span>
              </label>

              {/* Payment via bKash */}
              <label
                htmlFor="quick-bkash-input"
                className={`p-3 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'bKash'
                    ? 'border-[#E2136E] bg-pink-50/50 ring-1 ring-[#E2136E]'
                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    id="quick-bkash-input"
                    type="radio"
                    name="quick-payment"
                    checked={paymentMethod === 'bKash'}
                    onChange={() => {
                      setPaymentMethod('bKash');
                      setPaymentError('');
                    }}
                    className="accent-[#E2136E]"
                  />
                  <div>
                    <span className="font-bold text-[#E2136E] block">Payment via bKash</span>
                    <span className="text-[11px] text-gray-500">Send Money &amp; submit TrxID</span>
                  </div>
                </div>
                <span className="text-[10px] text-[#E2136E] font-bold bg-pink-100 border border-pink-200 px-2 py-0.5 rounded">
                  Manual Verification
                </span>
              </label>

              {/* bKash Payment Details */}
              {paymentMethod === 'bKash' && (
                <div className="p-3 bg-pink-50/40 border border-pink-200 rounded-lg text-xs space-y-2.5 animate-fadeIn">
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
                        name="quick-bkash-mode"
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
                        name="quick-bkash-mode"
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
                    <div className="flex items-center justify-between bg-white px-3 py-1.5 rounded-md border border-pink-200">
                      <strong className="text-sm text-charcoal font-mono tracking-wider">
                        01998789157
                      </strong>
                      <button
                        type="button"
                        onClick={handleCopyBkash}
                        className="bg-[#E2136E] hover:bg-[#C1105D] text-white text-[10px] font-bold px-2.5 py-1 rounded transition-colors"
                      >
                        {copiedNumber ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-700 leading-relaxed bg-white/80 p-2 rounded border border-pink-100">
                    Send <strong className="text-actionRed font-bold">৳{bKashPayNow.toLocaleString()}</strong> {bKashPaymentMode === 'delivery' ? '(delivery charge only)' : '(full order payment)'} to the bKash number above using <strong>Send Money</strong>.
                    {bKashPaymentMode === 'delivery' && (
                      <span className="block mt-1 font-medium">Remaining ৳{remainingOnDelivery.toLocaleString()} is payable on delivery after payment verification.</span>
                    )}
                  </p>

                  <div>
                    <label htmlFor="quick-bkash-trxid" className="block text-xs font-bold text-charcoal mb-1">
                      bKash Transaction ID (TrxID) *
                    </label>
                    <input
                      id="quick-bkash-trxid"
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
                    <label htmlFor="quick-bkash-phone" className="block text-xs font-bold text-charcoal mb-1">
                      Sender bKash Phone Number (Optional)
                    </label>
                    <input
                      id="quick-bkash-phone"
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

            {/* Price Breakdown */}
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Product Price {orderQuantity > 1 ? `(৳${product.price} × ${orderQuantity})` : ''}</span>
                <span className="font-bold text-charcoal">৳{(product.price * orderQuantity).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Home Delivery ({activeDelivery.location})</span>
                <span className="font-bold text-charcoal">৳{deliveryFee}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between font-black text-sm text-charcoal">
                <span>Total Order Amount</span>
                <span className="text-actionRed">৳{totalAmount.toLocaleString()}</span>
              </div>
              {paymentMethod === 'bKash' && (
                <>
                  <div className="flex justify-between font-bold text-[#E2136E]">
                    <span>Send Now via bKash</span>
                    <span>৳{bKashPayNow.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Due on Delivery</span>
                    <span>৳{remainingOnDelivery.toLocaleString()}</span>
                  </div>
                </>
              )}
            </div>

            {/* Submit Button */}
            {!currentUser ? (
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  navigate('/account');
                }}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase py-3 rounded-md transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <FiLock className="text-sm" />
                <span>Sign In to Place Order</span>
              </button>
            ) : !isVerified ? (
              <button
                type="button"
                onClick={handleCheckVerification}
                disabled={isRefreshing}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase py-3 rounded-md transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
                title="Please verify your email before placing an order"
              >
                <FiRefreshCw className={`text-sm ${isRefreshing ? 'animate-spin' : ''}`} />
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
                className="w-full bg-actionRed hover:bg-actionRed-hover text-white font-bold text-xs uppercase py-3 rounded-md transition-colors shadow-md disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Processing Order...' : paymentMethod === 'bKash' ? 'Submit bKash Order' : 'Confirm Cash On Delivery Order'}
              </button>
            )}

          </form>
        )}

      </div>
    </div>
  );
};

export default QuickOrderModal;

