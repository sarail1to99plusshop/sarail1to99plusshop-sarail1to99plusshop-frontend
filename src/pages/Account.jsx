import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  LogOut,
  RefreshCw,
  ArrowLeft,
  ShieldCheck,
  Package,
  ShoppingCart,
  Clock,
  Sparkles,
  FileText,
  MapPin,
  Phone,
  Truck,
  ExternalLink,
  ShoppingBag,
  XCircle,
  Ban,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { getAuthErrorMessage } from '../utils/authErrors';
import { useUserProfile, useUserOrders } from '../hooks/useQueries';
import { OrderCardSkeleton } from '../components/common/ProductCardSkeleton';

const Account = () => {
  const {
    currentUser,
    dbUser,
    userLoading,
    signUp,
    signIn,
    signInWithGoogle,
    resetPassword,
    sendVerificationEmail,
    reloadUser,
    logOut,
  } = useAuth();

  const { orders: sessionOrders, cancelOrder } = useShop();

  const { data: queriedUser } = useUserProfile(currentUser?.uid);
  const activeDbUser = dbUser || queriedUser;

  const {
    data: dbOrders = [],
    isLoading: ordersLoading,
    isFetching: ordersFetching,
    refetch: refetchOrders,
  } = useUserOrders({
    email: currentUser?.email,
    userId: currentUser?.uid,
  });

  // Merge MongoDB orders with any session orders belonging to the user
  const userOrders = useMemo(() => {
    if (!currentUser) return [];
    const map = new Map();

    dbOrders.forEach((order) => {
      if (order?.invoiceNumber) {
        map.set(order.invoiceNumber, order);
      }
    });

    sessionOrders.forEach((order) => {
      const matchesUser =
        (order?.userId && order.userId === currentUser.uid) ||
        (order?.customerDetails?.email &&
          currentUser.email &&
          order.customerDetails.email.toLowerCase() === currentUser.email.toLowerCase());
      if (matchesUser && order?.invoiceNumber) {
        if (!map.has(order.invoiceNumber)) {
          map.set(order.invoiceNumber, order);
        } else if (order.orderStatus === 'Cancelled') {
          map.set(order.invoiceNumber, {
            ...map.get(order.invoiceNumber),
            orderStatus: 'Cancelled',
          });
        }
      }
    });

    return Array.from(map.values()).sort(
      (a, b) =>
        new Date(b.createdAt?.$date || b.createdAt || 0) -
        new Date(a.createdAt?.$date || a.createdAt || 0)
    );
  }, [currentUser, dbOrders, sessionOrders]);

  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [cancellingInvoice, setCancellingInvoice] = useState('');
  const [confirmCancelInvoice, setConfirmCancelInvoice] = useState('');

  const filteredOrders = useMemo(() => {
    if (orderStatusFilter === 'All') return userOrders;
    return userOrders.filter(
      (o) => (o.orderStatus || 'Pending').toLowerCase() === orderStatusFilter.toLowerCase()
    );
  }, [userOrders, orderStatusFilter]);

  // Mode: 'login' | 'signup' | 'forgot-password'
  const [authMode, setAuthMode] = useState('login');

  // Form states
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status & Feedback states
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isRefreshingVerification, setIsRefreshingVerification] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Handle Cancel Order (Allowed when Pending/Processing; blocked when Shipped/Delivered)
  const handleCancelOrder = async (order) => {
    if (!order?.invoiceNumber) return;
    const status = order.orderStatus || 'Pending';

    if (status === 'Shipped' || status === 'Delivered') {
      setErrorMessage(
        `Order #${order.invoiceNumber} cannot be cancelled because its status is already ${status}.`
      );
      setConfirmCancelInvoice('');
      return;
    }

    setCancellingInvoice(order.invoiceNumber);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await cancelOrder(order.invoiceNumber);
      await refetchOrders();
      setSuccessMessage(`Order #${order.invoiceNumber} has been cancelled successfully.`);
      setConfirmCancelInvoice('');
    } catch (err) {
      setErrorMessage(err?.message || 'Could not cancel order. Please try again.');
    } finally {
      setCancellingInvoice('');
    }
  };

  // Handle Sign In with Email & Password
  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      await signIn(email.trim(), password);
    } catch (err) {
      setErrorMessage(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Handle Sign Up with Email, Password & Display Name
  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify and try again.');
      return;
    }

    setLoading(true);

    try {
      await signUp(email.trim(), password, displayName.trim());
      setSuccessMessage(
        'Account created successfully! A verification email has been sent to your email address. Please check your inbox.'
      );
    } catch (err) {
      setErrorMessage(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }

    setLoading(true);

    try {
      await resetPassword(email.trim());
      setSuccessMessage(
        'Password reset link has been sent to your email! Please check your inbox and follow the instructions.'
      );
    } catch (err) {
      setErrorMessage(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sign-in
  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      await signInWithGoogle();
    } catch (err) {
      setErrorMessage(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Handle Resend Verification Email
  const handleResendVerification = async () => {
    if (resendCooldown > 0) return;
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await sendVerificationEmail();
      setSuccessMessage('Verification email sent successfully! Please check your inbox.');
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setErrorMessage(getAuthErrorMessage(err));
    }
  };

  // Handle Reload/Check Email Verification Status
  const handleRefreshVerification = async () => {
    setIsRefreshingVerification(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const user = await reloadUser();
      if (user?.emailVerified) {
        setSuccessMessage('Congratulations! Your email has been verified successfully.');
      } else {
        setErrorMessage('Email is not verified yet. Please click the link in your verification email.');
      }
    } catch (err) {
      setErrorMessage(getAuthErrorMessage(err));
    } finally {
      setIsRefreshingVerification(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await logOut();
      setAuthMode('login');
      setSuccessMessage('');
      setErrorMessage('');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Loading state while Firebase auth resolves
  if (userLoading) {
    return (
      <div className="min-h-[60vh] bg-[#F8FAFC] flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#003D73] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-[#0F172A]">Loading account...</p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW A: LOGGED IN USER PROFILE & DASHBOARD
  // -------------------------------------------------------------
  if (currentUser) {
    const isVerified = currentUser.emailVerified;
    const initialLetter = (currentUser.displayName || currentUser.email || 'U')[0].toUpperCase();

    return (
      <div className="min-h-[75vh] bg-[#F8FAFC] py-8 sm:py-12 px-4 sm:px-6 font-sans">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* Feedback messages */}
          {successMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 text-[#DE111E] rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="w-5 h-5 text-[#DE111E] shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Email Verification Warning Alert Banner if Not Verified */}
          {!isVerified && (
            <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl shadow-2xs space-y-3">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-xs sm:text-sm text-amber-900">
                    Email Verification Required
                  </h4>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Your email address <strong>{currentUser.email}</strong> is not verified yet. Please click the verification link sent to your inbox (or spam folder) to activate full account features.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={resendCooldown > 0}
                  className="px-4 py-2 bg-[#003D73] hover:bg-[#002b52] text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-2xs"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>
                    {resendCooldown > 0
                      ? `Please wait (${resendCooldown}s)`
                      : 'Resend Verification Email'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleRefreshVerification}
                  disabled={isRefreshingVerification}
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-[#0F172A] border border-slate-300 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${
                      isRefreshingVerification ? 'animate-spin text-[#003D73]' : ''
                    }`}
                  />
                  <span>I Have Verified (Refresh Status)</span>
                </button>
              </div>
            </div>
          )}

          {/* User Profile Overview Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 border-b border-slate-100 pb-6 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User'}
                    className="w-18 h-18 rounded-full object-cover border-2 border-[#003D73] shadow-sm"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[#003D73] text-white flex items-center justify-center font-black text-2xl shadow-sm">
                    {initialLetter}
                  </div>
                )}

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h2 className="text-lg sm:text-xl font-bold text-[#0F172A]">
                      {currentUser.displayName || 'Sarail Customer'}
                    </h2>
                    {isVerified ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verified</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Unverified</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 font-medium">
                    {currentUser.email}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    User ID: <span className="font-mono">{currentUser.uid.slice(0, 14)}...</span>
                  </p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium">
                      <span>Registered:</span>
                      <strong className="text-[#0F172A]">
                        {activeDbUser?.registeredAt
                          ? new Date(activeDbUser.registeredAt).toLocaleString()
                          : currentUser.metadata?.creationTime
                          ? new Date(currentUser.metadata.creationTime).toLocaleString()
                          : 'Just now'}
                      </strong>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-[#003D73] text-[11px] font-medium border border-blue-100">
                      <Clock className="w-3 h-3" />
                      <span>Last Login:</span>
                      <strong className="font-bold">
                        {activeDbUser?.lastLoginAt
                          ? new Date(activeDbUser.lastLoginAt).toLocaleString()
                          : currentUser.metadata?.lastSignInTime
                          ? new Date(currentUser.metadata.lastSignInTime).toLocaleString()
                          : 'Just now'}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-red-200 text-[#DE111E] hover:bg-red-50 text-xs font-bold rounded-lg transition-colors shadow-2xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>

            {/* Account Quick Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                to="/track-order"
                className="p-4 rounded-xl border border-slate-200 hover:border-[#003D73] bg-[#F8FAFC] hover:bg-white transition-all group shadow-2xs flex flex-col justify-between"
              >
                <div className="w-9 h-9 rounded-lg bg-[#003D73]/10 text-[#003D73] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#0F172A] group-hover:text-[#003D73] transition-colors">
                    Track Orders
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Check your courier shipment status
                  </p>
                </div>
              </Link>

              <Link
                to="/cart"
                className="p-4 rounded-xl border border-slate-200 hover:border-[#DE111E] bg-[#F8FAFC] hover:bg-white transition-all group shadow-2xs flex flex-col justify-between"
              >
                <div className="w-9 h-9 rounded-lg bg-[#DE111E]/10 text-[#DE111E] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#0F172A] group-hover:text-[#DE111E] transition-colors">
                    My Cart
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Review and checkout your cart items
                  </p>
                </div>
              </Link>

              <Link
                to="/shop"
                className="p-4 rounded-xl border border-slate-200 hover:border-emerald-600 bg-[#F8FAFC] hover:bg-white transition-all group shadow-2xs flex flex-col justify-between"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#0F172A] group-hover:text-emerald-700 transition-colors">
                    Shop Products
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Explore 1 to 99+ top collections
                  </p>
                </div>
              </Link>
            </div>
          </div>

          {/* My Order History Section */}
          <div
            id="order-history"
            className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 sm:p-8 space-y-6"
          >
            {/* Header & Refresh */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#003D73]/10 text-[#003D73] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-extrabold text-[#0F172A]">
                      My Order History
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[#0F172A] text-[11px] font-bold">
                      {userOrders.length} {userOrders.length === 1 ? 'Order' : 'Orders'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    View all your placed orders, status updates, and shipment tracking
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => refetchOrders()}
                disabled={ordersFetching}
                className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-[#003D73] text-xs font-bold text-[#0F172A] hover:text-[#003D73] bg-[#F8FAFC] hover:bg-white transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${ordersFetching ? 'animate-spin text-[#003D73]' : ''}`}
                />
                <span>Refresh</span>
              </button>
            </div>

            {/* Filter Pills */}
            {userOrders.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(
                  (status) => {
                    const count =
                      status === 'All'
                        ? userOrders.length
                        : userOrders.filter(
                            (o) =>
                              (o.orderStatus || 'Pending').toLowerCase() === status.toLowerCase()
                          ).length;
                    const isActive = orderStatusFilter === status;
                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setOrderStatusFilter(status)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                          isActive
                            ? 'bg-[#003D73] text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <span>{status}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                            isActive ? 'bg-white/20 text-white' : 'bg-white text-slate-700'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  }
                )}
              </div>
            )}

            {/* Loading State: YouTube-Style Shimmer Skeleton */}
            {ordersLoading ? (
              <OrderCardSkeleton count={3} />
            ) : filteredOrders.length === 0 ? (
              /* Empty State */
              <div className="text-center py-12 px-4 bg-[#F8FAFC] rounded-xl border border-dashed border-slate-200 space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-200/70 text-slate-500 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[#0F172A]">
                    {userOrders.length === 0
                      ? 'You have not placed any orders yet'
                      : `No ${orderStatusFilter.toLowerCase()} orders found`}
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {userOrders.length === 0
                      ? 'When you place an order, it will automatically appear here with its invoice and live tracking details.'
                      : 'Try switching to the "All" filter tab to view all of your orders.'}
                  </p>
                </div>
                {userOrders.length === 0 && (
                  <div className="pt-2">
                    <Link
                      to="/shop"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#DE111E] hover:bg-[#bf0e19] text-white text-xs font-extrabold uppercase tracking-wider rounded-lg transition-colors shadow-2xs"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Start Shopping</span>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              /* Order Cards List */
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const status = order.orderStatus || 'Pending';
                  const canCancel = status === 'Pending' || status === 'Processing';
                  const isShippedOrDelivered = status === 'Shipped' || status === 'Delivered';
                  const isCancelling = cancellingInvoice === order.invoiceNumber;
                  const isConfirmingCancel = confirmCancelInvoice === order.invoiceNumber;
                  const rawDate = order.createdAt?.$date || order.createdAt;

                  const statusBadgeStyle =
                    status === 'Delivered' || status === 'Shipped'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : status === 'Cancelled'
                      ? 'bg-red-50 text-[#DE111E] border-red-200'
                      : status === 'Processing'
                      ? 'bg-blue-50 text-[#003D73] border-blue-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200';

                  return (
                    <div
                      key={order._id?.$oid || order._id || order.invoiceNumber}
                      className="rounded-xl border border-slate-200 overflow-hidden bg-white hover:border-slate-300 transition-all shadow-2xs"
                    >
                      {/* Order Card Top Bar */}
                      <div className="bg-[#F8FAFC] px-4 sm:px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
                          <div>
                            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                              Invoice Number
                            </span>
                            <span className="text-xs sm:text-sm font-black text-[#003D73] font-mono">
                              {order.invoiceNumber}
                            </span>
                          </div>

                          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

                          <div>
                            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                              Order Date
                            </span>
                            <span className="text-xs font-semibold text-[#0F172A]">
                              {rawDate
                                ? new Date(rawDate).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })
                                : 'Recent'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusBadgeStyle}`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            <span>{status}</span>
                          </span>
                        </div>
                      </div>

                      {/* Order Items List */}
                      <div className="p-4 sm:p-5 space-y-4">
                        <div className="divide-y divide-slate-100">
                          {(order.items || []).map((item, idx) => (
                            <div
                              key={`${order.invoiceNumber}-item-${idx}`}
                              className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-12 h-12 rounded-lg object-cover border border-slate-200 bg-slate-50 shrink-0"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                                    <Package className="w-5 h-5" />
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <p className="text-xs sm:text-sm font-bold text-[#0F172A] line-clamp-1">
                                    {item.title}
                                  </p>
                                  <div className="flex flex-wrap items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                                    <span>
                                      Qty: <strong className="text-[#0F172A]">{item.quantity}</strong>
                                    </span>
                                    <span>•</span>
                                    <span>৳{Number(item.price || 0).toLocaleString()} each</span>
                                    {(item.color || item.selectedVariant?.colorName) && (
                                      <>
                                        <span>•</span>
                                        <span className="inline-flex items-center gap-1">
                                          {(item.colorCode || item.selectedVariant?.colorCode) && (
                                            <span
                                              className="w-2.5 h-2.5 rounded-full border border-slate-300 inline-block"
                                              style={{
                                                backgroundColor:
                                                  item.colorCode || item.selectedVariant?.colorCode,
                                              }}
                                            />
                                          )}
                                          <span>
                                            {item.color || item.selectedVariant?.colorName}
                                          </span>
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <span className="text-xs sm:text-sm font-extrabold text-[#0F172A]">
                                  ৳{(Number(item.price || 0) * Number(item.quantity || 1)).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Delivery & Summary Footer */}
                        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60 -mx-4 sm:-mx-5 -mb-4 sm:-mb-5 px-4 sm:px-5 py-3.5">
                          <div className="space-y-1 text-[11px] text-slate-600">
                            {order.customerDetails?.address && (
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="line-clamp-1">
                                  <strong>Delivery to:</strong> {order.customerDetails.name} —{' '}
                                  {order.customerDetails.address}
                                </span>
                              </div>
                            )}
                            {order.customerDetails?.phone && (
                              <div className="flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>{order.customerDetails.phone}</span>
                                {order.courierData?.trackingCode && (
                                  <>
                                    <span className="text-slate-300">|</span>
                                    <Truck className="w-3.5 h-3.5 text-[#003D73] shrink-0" />
                                    <span className="font-semibold text-[#003D73]">
                                      Tracking: {order.courierData.trackingCode}
                                    </span>
                                  </>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/70">
                            <div className="text-left sm:text-right mr-1">
                              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                                Total Amount
                              </span>
                              <span className="text-sm sm:text-base font-black text-[#DE111E]">
                                ৳{Number(order.totalAmount || 0).toLocaleString()}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              {/* Cancel Order Action: Allowed when Pending/Processing */}
                              {canCancel && !isConfirmingCancel && (
                                <button
                                  type="button"
                                  disabled={isCancelling}
                                  onClick={() => setConfirmCancelInvoice(order.invoiceNumber)}
                                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-200 bg-white hover:bg-red-50 text-[#DE111E] text-xs font-bold transition-colors shadow-2xs disabled:opacity-50"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>{isCancelling ? 'Cancelling...' : 'Cancel Order'}</span>
                                </button>
                              )}

                              {/* Inline Confirmation Step */}
                              {canCancel && isConfirmingCancel && (
                                <div className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 px-2.5 py-1.5 rounded-lg">
                                  <span className="text-[11px] font-bold text-[#DE111E]">
                                    Cancel this order?
                                  </span>
                                  <button
                                    type="button"
                                    disabled={isCancelling}
                                    onClick={() => handleCancelOrder(order)}
                                    className="px-2.5 py-1 rounded-md bg-[#DE111E] hover:bg-[#bf0e19] text-white text-[11px] font-extrabold transition-colors disabled:opacity-50"
                                  >
                                    {isCancelling ? 'Wait...' : 'Yes, Cancel'}
                                  </button>
                                  <button
                                    type="button"
                                    disabled={isCancelling}
                                    onClick={() => setConfirmCancelInvoice('')}
                                    className="px-2 py-1 rounded-md bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 text-[11px] font-bold transition-colors"
                                  >
                                    No
                                  </button>
                                </div>
                              )}

                              {/* Locked Notice: Cannot cancel once Shipped or Delivered */}
                              {isShippedOrDelivered && (
                                <span
                                  title={`Order cannot be cancelled because it is already ${status}`}
                                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-slate-100 text-slate-400 text-xs font-semibold cursor-not-allowed select-none"
                                >
                                  <Ban className="w-3.5 h-3.5" />
                                  <span>Cannot Cancel ({status})</span>
                                </span>
                              )}

                              <Link
                                to={`/track-order?invoice=${encodeURIComponent(order.invoiceNumber)}`}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#003D73] hover:bg-[#002b52] text-white text-xs font-bold transition-colors shadow-2xs shrink-0"
                              >
                                <Truck className="w-3.5 h-3.5" />
                                <span>Track Order</span>
                                <ExternalLink className="w-3 h-3 opacity-80" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW B: AUTHENTICATION FORMS (SIGN IN / SIGN UP / FORGOT PASSWORD)
  // -------------------------------------------------------------
  return (
    <div className="min-h-[80vh] bg-[#F8FAFC] py-8 sm:py-14 px-4 font-sans">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Top Tabs (Sign In vs Create Account) */}
          {authMode !== 'forgot-password' && (
            <div className="grid grid-cols-2 text-center text-xs font-bold border-b border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className={`py-3.5 transition-colors uppercase tracking-wider ${
                  authMode === 'login'
                    ? 'bg-white text-[#DE111E] border-b-2 border-[#DE111E]'
                    : 'bg-slate-50 text-slate-500 hover:text-[#0F172A]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className={`py-3.5 transition-colors uppercase tracking-wider ${
                  authMode === 'signup'
                    ? 'bg-white text-[#DE111E] border-b-2 border-[#DE111E]'
                    : 'bg-slate-50 text-slate-500 hover:text-[#0F172A]'
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          <div className="p-6 sm:p-8 space-y-5">
            {/* Header info */}
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-red-50 text-[#DE111E] flex items-center justify-center text-xl mx-auto mb-2 border border-red-100">
                <User className="w-5 h-5" />
              </div>

              <h2 className="text-xl font-black text-[#0F172A]">
                {authMode === 'login' && 'Welcome Back!'}
                {authMode === 'signup' && 'Create Your Account'}
                {authMode === 'forgot-password' && 'Reset Password'}
              </h2>

              <p className="text-xs text-slate-500">
                {authMode === 'login' && 'Sign in to access order tracking, wishlists & speedy checkout'}
                {authMode === 'signup' && 'Join Sarail 1 to 99 Plus Shop to enjoy special discounts & perks'}
                {authMode === 'forgot-password' && 'Enter your registered email to receive a password reset link'}
              </p>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-[#DE111E] rounded-xl text-xs font-semibold flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#DE111E]" />
                <span className="leading-snug">{errorMessage}</span>
              </div>
            )}

            {/* Success Message Alert */}
            {successMessage && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-start gap-2.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <span className="leading-snug">{successMessage}</span>
              </div>
            )}

            {/* FORM 1: SIGN IN */}
            {authMode === 'login' && (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@domain.com"
                      className="w-full bg-[#F8FAFC] border border-slate-200 text-xs px-3.5 py-2.5 pl-9 rounded-lg outline-none focus:border-[#003D73] text-[#0F172A]"
                    />
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#F8FAFC] border border-slate-200 text-xs px-3.5 py-2.5 pl-9 pr-9 rounded-lg outline-none focus:border-[#003D73] text-[#0F172A]"
                    />
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('forgot-password');
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className="text-xs font-semibold text-[#003D73] hover:text-[#DE111E] transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#DE111E] hover:bg-[#bf0e19] text-white font-extrabold text-xs uppercase py-3 rounded-lg transition-colors shadow-2xs disabled:opacity-50 tracking-wider flex items-center justify-center gap-2"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
            )}

            {/* FORM 2: SIGN UP */}
            {authMode === 'signup' && (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Asratul Islam"
                      className="w-full bg-[#F8FAFC] border border-slate-200 text-xs px-3.5 py-2.5 pl-9 rounded-lg outline-none focus:border-[#003D73] text-[#0F172A]"
                    />
                    <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@domain.com"
                      className="w-full bg-[#F8FAFC] border border-slate-200 text-xs px-3.5 py-2.5 pl-9 rounded-lg outline-none focus:border-[#003D73] text-[#0F172A]"
                    />
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">
                    Password (Minimum 6 characters) *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#F8FAFC] border border-slate-200 text-xs px-3.5 py-2.5 pl-9 pr-9 rounded-lg outline-none focus:border-[#003D73] text-[#0F172A]"
                    />
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#F8FAFC] border border-slate-200 text-xs px-3.5 py-2.5 pl-9 pr-9 rounded-lg outline-none focus:border-[#003D73] text-[#0F172A]"
                    />
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#003D73] shrink-0" />
                  <span>A verification email will be sent to your inbox immediately upon registration.</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#003D73] hover:bg-[#002b52] text-white font-extrabold text-xs uppercase py-3 rounded-lg transition-colors shadow-2xs disabled:opacity-50 tracking-wider flex items-center justify-center gap-2"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            )}

            {/* FORM 3: FORGOT PASSWORD */}
            {authMode === 'forgot-password' && (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">
                    Registered Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@domain.com"
                      className="w-full bg-[#F8FAFC] border border-slate-200 text-xs px-3.5 py-2.5 pl-9 rounded-lg outline-none focus:border-[#003D73] text-[#0F172A]"
                    />
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#DE111E] hover:bg-[#bf0e19] text-white font-extrabold text-xs uppercase py-3 rounded-lg transition-colors shadow-2xs disabled:opacity-50 tracking-wider"
                >
                  {loading ? 'Sending Link...' : 'Send Password Reset Link'}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#003D73] hover:text-[#DE111E] transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Sign In</span>
                  </button>
                </div>
              </form>
            )}

            {/* Google Social Sign-in Divider (for login & signup) */}
            {authMode !== 'forgot-password' && (
              <div className="space-y-4 pt-1">
                <div className="relative flex items-center justify-center">
                  <div className="border-t border-slate-200 w-full" />
                  <span className="bg-white px-3 text-[11px] uppercase font-bold text-slate-400 shrink-0">
                    OR
                  </span>
                  <div className="border-t border-slate-200 w-full" />
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full bg-white hover:bg-slate-50 border border-slate-300 text-[#0F172A] font-bold text-xs py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-3 shadow-2xs disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
