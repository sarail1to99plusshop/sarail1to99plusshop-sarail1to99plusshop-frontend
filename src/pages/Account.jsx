import { useState } from 'react';
import { FiUser, FiLock, FiMail } from 'react-icons/fi';

const Account = () => {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    phoneOrEmail: '',
    password: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      isLoginTab
        ? `Logged in as ${formData.phoneOrEmail}`
        : `Account created for ${formData.name}!`
    );
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Tab Headers */}
        <div className="grid grid-cols-2 text-center text-xs font-bold border-b border-gray-200">
          <button
            onClick={() => setIsLoginTab(true)}
            className={`py-3.5 transition-colors uppercase tracking-wider ${
              isLoginTab
                ? 'bg-white text-actionRed border-b-2 border-actionRed'
                : 'bg-gray-50 text-gray-500 hover:text-charcoal'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLoginTab(false)}
            className={`py-3.5 transition-colors uppercase tracking-wider ${
              !isLoginTab
                ? 'bg-white text-actionRed border-b-2 border-actionRed'
                : 'bg-gray-50 text-gray-500 hover:text-charcoal'
            }`}
          >
            Create Account
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-red-100 text-actionRed flex items-center justify-center text-xl mx-auto mb-2">
              <FiUser />
            </div>
            <h2 className="text-xl font-black text-charcoal">
              {isLoginTab ? 'Welcome Back!' : 'Join Sarail 1 to 99 Plus Shop'}
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              {isLoginTab
                ? 'Access order tracking, wishlists & speedy checkout'
                : 'Register now to receive ৳100 first-purchase coupon'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginTab && (
              <div>
                <label htmlFor="account-full-name" className="block text-xs font-bold text-charcoal mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    id="account-full-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Asratul Islam"
                    className="w-full bg-gray-50 border border-gray-200 text-xs px-3.5 py-2.5 pl-9 rounded-md outline-none focus:border-primary"
                  />
                  <FiUser className="absolute left-3 top-3 text-gray-400 text-xs" />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="account-phone-or-email" className="block text-xs font-bold text-charcoal mb-1">
                Phone Number or Email
              </label>
              <div className="relative">
                <input
                  id="account-phone-or-email"
                  type="text"
                  required
                  value={formData.phoneOrEmail}
                  onChange={(e) => setFormData({ ...formData, phoneOrEmail: e.target.value })}
                  placeholder="01XXXXXXXXX or email@domain.com"
                  className="w-full bg-gray-50 border border-gray-200 text-xs px-3.5 py-2.5 pl-9 rounded-md outline-none focus:border-primary"
                />
                <FiMail className="absolute left-3 top-3 text-gray-400 text-xs" />
              </div>
            </div>

            <div>
              <label htmlFor="account-password" className="block text-xs font-bold text-charcoal mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="account-password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-200 text-xs px-3.5 py-2.5 pl-9 rounded-md outline-none focus:border-primary"
                />
                <FiLock className="absolute left-3 top-3 text-gray-400 text-xs" />
              </div>
            </div>

            {isLoginTab && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-[11px] text-gray-500 hover:text-actionRed"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-actionRed hover:bg-actionRed-hover text-white font-bold text-xs uppercase py-3 rounded-md transition-colors shadow-xs mt-2"
            >
              {isLoginTab ? 'Login to Account' : 'Register Now'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Account;

