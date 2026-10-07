import { useState } from 'react';
import { BsBoxSeam, BsCheckCircle } from 'react-icons/bs';

const PreOrder = () => {
  const [productName, setProductName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-full bg-actionRed/10 text-actionRed flex items-center justify-center text-3xl mx-auto mb-3">
          <BsBoxSeam />
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-charcoal">
          Special Order & Pre-Order Service
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Looking for specific dinner sets, wholesale kitchenware, or party toys? Submit your request below!
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-sm">
        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <BsCheckCircle className="text-5xl text-emerald-500 mx-auto" />
            <h3 className="text-lg font-bold text-charcoal">Pre-Order Request Received!</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Our sourcing team will contact you at <strong>{phone}</strong> within 2 hours with pricing, availability, and delivery estimate.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 bg-primary text-white text-xs px-4 py-2 rounded-md font-semibold"
            >
              Submit Another Request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="preorder-product-name-input" className="block text-xs font-bold text-charcoal mb-1">
                Requested Item / Product Name *
              </label>
              <input
                id="preorder-product-name-input"
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Sharif 32pc Melamine Set / Kiam 7pc Cookware / Electric Vegetable Chopper"
                required
                className="w-full bg-gray-50 border border-gray-200 text-xs px-3.5 py-2.5 rounded-md outline-none focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="preorder-full-name-input" className="block text-xs font-bold text-charcoal mb-1">
                  Your Full Name *
                </label>
                <input
                  id="preorder-full-name-input"
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Rahat Ahmed"
                  required
                  className="w-full bg-gray-50 border border-gray-200 text-xs px-3.5 py-2.5 rounded-md outline-none focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="preorder-mobile-number-input" className="block text-xs font-bold text-charcoal mb-1">
                  Mobile Number *
                </label>
                <input
                  id="preorder-mobile-number-input"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  required
                  className="w-full bg-gray-50 border border-gray-200 text-xs px-3.5 py-2.5 rounded-md outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label htmlFor="preorder-additional-notes-input" className="block text-xs font-bold text-charcoal mb-1">
                Additional Notes or Preferences (Color, Variant, Specs)
              </label>
              <textarea
                id="preorder-additional-notes-input"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Mention desired color or storage model..."
                className="w-full bg-gray-50 border border-gray-200 text-xs px-3.5 py-2.5 rounded-md outline-none focus:border-primary"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-actionRed hover:bg-actionRed-hover text-white font-bold text-xs uppercase py-3 rounded-md transition-colors shadow-sm"
            >
              Submit Pre-Order Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PreOrder;

