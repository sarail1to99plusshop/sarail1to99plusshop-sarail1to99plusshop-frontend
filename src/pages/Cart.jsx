import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BsCart3, BsTrash, BsCheckCircleFill } from 'react-icons/bs';
import { FiArrowRight, FiPlus, FiMinus, FiTruck, FiUser, FiLock, FiMail, FiRefreshCw } from 'react-icons/fi';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    createOrder,
    deliveryCharges,
  } = useShop();
  const { currentUser, sendVerificationEmail, reloadUser } = useAuth();
  const navigate = useNavigate();

  const isVerified = Boolean(currentUser?.emailVerified);
  const customerEmail = currentUser?.email || 'Please sign in to order';
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [selectedDeliveryId, setSelectedDeliveryId] = useState('inside-dhaka');
  const [placedOrder, setPlacedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const activeName = customerName !== '' ? customerName : (currentUser?.displayName || '');

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

  const activeDelivery =
    deliveryCharges?.find((d) => d.id === selectedDeliveryId) ||
    deliveryCharges?.[0] || {
      id: 'inside-dhaka',
      location: 'Inside Dhaka',
      charge: 60,
      estimatedDays: '1-2 Business Days',
    };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const deliveryFee = cartItems.length > 0 ? activeDelivery.charge : 0;
  const total = subtotal + deliveryFee;

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) {
      navigate('/account');
      return;
    }
    if (!isVerified) {
      setVerificationStatus('Your account email must be verified before placing an order.');
      return;
    }
    if (!activeName || !phone || !address) return;

    setLoading(true);
    const order = createOrder({
      customerDetails: {
        name: activeName,
        email: customerEmail,
        phone,
        address,
        note,
        deliveryLocation: activeDelivery.location,
      },
      deliveryFee,
      paymentMethod,
    });

    setLoading(false);
    setPlacedOrder(order);
    clearCart();
  };

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
              <span className="font-bold text-charcoal">{placedOrder.customerDetails.email || customerEmail}</span>
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
              <span className="font-bold text-emerald-600">{placedOrder.paymentMethod} (Cash on Delivery)</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 font-black text-sm">
              <span>Total Payable Amount:</span>
              <span className="text-actionRed">৳{placedOrder.totalAmount.toLocaleString()}</span>
            </div>
          </div>

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
                  <label htmlFor="customer-phone-field" className="block text-xs font-bold text-charcoal mb-1">
                    Contact Phone Number *
                  </label>
                  <input
                    id="customer-phone-field"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="018XXXXXXXX"
                    className="w-full bg-gray-50 border border-gray-200 text-xs px-3.5 py-2.5 rounded-md outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label htmlFor="customer-address-field" className="block text-xs font-bold text-charcoal mb-1">
                    Full Delivery Address *
                  </label>
                  <textarea
                    id="customer-address-field"
                    rows={2}
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Dhaka, Narsingdi"
                    className="w-full bg-gray-50 border border-gray-200 text-xs px-3.5 py-2 rounded-md outline-none focus:border-primary"
                  />
                </div>

                {/* Delivery Area Selection */}
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1.5 flex items-center justify-between">
                    <span>Delivery Destination *</span>
                    <span className="text-[11px] text-primary font-medium">Choose delivery zone</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(deliveryCharges || []).map((option) => {
                      const isSelected = selectedDeliveryId === option.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setSelectedDeliveryId(option.id)}
                          className={`p-2.5 rounded-lg border text-left transition-all ${
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

                {/* Payment Option */}
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs flex items-center justify-between">
                  <label htmlFor="cod-radio-input" className="flex items-center gap-2 cursor-pointer font-bold text-charcoal">
                    <input
                      id="cod-radio-input"
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="accent-actionRed"
                    />
                    <span>Cash on Delivery (COD)</span>
                  </label>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    Pay upon receipt
                  </span>
                </div>

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
                    {loading ? 'Submitting Order...' : 'Confirm Cash on Delivery Order'}
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
