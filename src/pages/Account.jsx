import { useState } from 'react';
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
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAuthErrorMessage } from '../utils/authErrors';

const Account = () => {
  const {
    currentUser,
    userLoading,
    signUp,
    signIn,
    signInWithGoogle,
    resetPassword,
    sendVerificationEmail,
    reloadUser,
    logOut,
  } = useAuth();

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
