import { useState } from 'react';
import { FiX, FiCheck, FiShoppingBag } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';

const QuickOrderModal = () => {
  const {
    isQuickOrderOpen,
    setIsQuickOrderOpen,
    quickOrderProduct,
    createOrder,
    deliveryCharges,
  } = useShop();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedDeliveryId, setSelectedDeliveryId] = useState('inside-dhaka');
  const [placedOrder, setPlacedOrder] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    if (!customerName || !phone || !address) return;

    setLoading(true);

    const singleItem = [
      {
        product: {
          $oid: product._id?.$oid || product.id?.toString(),
        },
        title: product.name,
        price: product.price,
        quantity: orderQuantity,
        selectedVariant: currentVariant,
        image: activeImage,
      },
    ];

    const order = createOrder({
      customerDetails: {
        name: customerName,
        phone,
        address,
        note,
        deliveryLocation: activeDelivery.location,
      },
      itemsList: singleItem,
      deliveryFee,
      paymentMethod: 'COD',
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
              {placedOrder ? 'Order Confirmed!' : 'Quick Buy Now (Cash on Delivery)'}
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
              Thank You for Your Order!
            </h4>
            <p className="text-xs text-gray-500">
              Your order has been placed successfully. You will pay with Cash on Delivery when received.
            </p>

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
                <span className="text-gray-500">Courier Tracking:</span>
                <span className="font-semibold text-actionRed">{placedOrder.courierData.trackingCode} ({placedOrder.courierData.provider})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery Zone:</span>
                <span className="font-semibold text-slate-700">
                  {placedOrder.customerDetails.deliveryLocation || activeDelivery.location} (৳{placedOrder.deliveryFee})
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-1.5 font-black text-sm">
                <span>Total Payable:</span>
                <span className="text-actionRed">৳{placedOrder.totalAmount.toLocaleString()}</span>
              </div>
            </div>

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
                src={activeImage}
                alt={product.name}
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

            {/* Customer Details Fields */}
            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  Customer Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Md. Al Saef Ratul"
                  className="w-full bg-gray-50 border border-gray-200 text-xs px-3.5 py-2.5 rounded-md outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full bg-gray-50 border border-gray-200 text-xs px-3.5 py-2.5 rounded-md outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  Full Delivery Address *
                </label>
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. House #12, Road #4, Dhaka, Narsingdi"
                  className="w-full bg-gray-50 border border-gray-200 text-xs px-3.5 py-2 rounded-md outline-none focus:border-primary"
                />
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
                <span>Total Amount (Cash on Delivery)</span>
                <span className="text-actionRed">৳{totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-actionRed hover:bg-actionRed-hover text-white font-bold text-xs uppercase py-3 rounded-md transition-colors shadow-md disabled:opacity-50"
            >
              {loading ? 'Processing Order...' : 'Confirm Cash On Delivery Order'}
            </button>

          </form>
        )}

      </div>
    </div>
  );
};

export default QuickOrderModal;

