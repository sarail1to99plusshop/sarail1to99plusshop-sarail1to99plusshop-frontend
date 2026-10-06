import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BsCart3, BsTrash, BsCheckCircleFill } from 'react-icons/bs';
import { FiArrowRight, FiPlus, FiMinus, FiTruck } from 'react-icons/fi';
import { useShop } from '../context/ShopContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, createOrder } = useShop();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [placedOrder, setPlacedOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const deliveryFee = cartItems.length > 0 ? 60 : 0;
  const total = subtotal + deliveryFee;

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (!customerName || !phone || !address) return;

    setLoading(true);
    const order = createOrder({
      customerDetails: {
        name: customerName,
        phone,
        address,
        note,
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

              <form onSubmit={handleCheckoutSubmit} className="space-y-3.5">
                <div>
                  <label htmlFor="customer-name-field" className="block text-xs font-bold text-charcoal mb-1">
                    Customer Full Name *
                  </label>
                  <input
                    id="customer-name-field"
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Md. Al Saef Ratul"
                    className="w-full bg-gray-50 border border-gray-200 text-xs px-3.5 py-2.5 rounded-md outline-none focus:border-primary"
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
                    <span>Home Delivery Fee (Steadfast)</span>
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-actionRed hover:bg-actionRed-hover text-white font-bold text-xs uppercase py-3.5 rounded-md transition-colors shadow-md mt-2 disabled:opacity-50"
                >
                  {loading ? 'Submitting Order...' : 'Confirm Cash on Delivery Order'}
                </button>
              </form>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Cart;
