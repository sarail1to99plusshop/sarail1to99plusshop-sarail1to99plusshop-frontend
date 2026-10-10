import { useState } from 'react';
import { TbTruckDelivery } from 'react-icons/tb';
import { FiCheckCircle, FiExternalLink } from 'react-icons/fi';
import { useShop } from '../context/ShopContext';
import { trackOrderInDB } from '../services/api';

const TrackOrder = () => {
  const { orders } = useShop();
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [notFoundError, setNotFoundError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId && !phone) return;

    setLoading(true);
    setNotFoundError('');
    setTrackingResult(null);
    try {
      // 1. Check backend MongoDB first
      const dbOrder = await trackOrderInDB({
        invoiceNumber: orderId.trim(),
        phone: phone.trim(),
      });

      if (dbOrder) {
        setTrackingResult(dbOrder);
        return;
      }

      // 2. Search in current session orders if any
      const matched = orders.find(
        (o) =>
          o.invoiceNumber?.toLowerCase() === orderId.trim().toLowerCase() ||
          (phone && o.customerDetails?.phone?.includes(phone.trim()))
      );

      if (matched) {
        setTrackingResult(matched);
      } else {
        setNotFoundError(
          'No shipment found matching this Invoice Number or Phone Number. Please verify your details and try again.'
        );
      }
    } catch {
      const matched = orders.find(
        (o) =>
          o.invoiceNumber?.toLowerCase() === orderId.trim().toLowerCase() ||
          (phone && o.customerDetails?.phone?.includes(phone.trim()))
      );
      if (matched) {
        setTrackingResult(matched);
      } else {
        setNotFoundError(
          'No shipment found matching this Invoice Number or Phone Number in our database.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl mx-auto mb-3">
          <TbTruckDelivery />
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-charcoal">
          Track Your Shipment
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Enter your Invoice Number (e.g. <strong>SAR-261003-3994</strong>) or Mobile Number
        </p>
      </div>

      {/* Form */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-sm mb-8">
        <form onSubmit={handleTrack} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="track-order-id-input" className="block text-xs font-bold text-charcoal mb-1">
                Invoice Number *
              </label>
              <input
                id="track-order-id-input"
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="SAR-261003-3994"
                className="w-full bg-gray-50 border border-gray-200 text-xs px-3.5 py-2.5 rounded-md outline-none focus:border-primary uppercase"
              />
            </div>
            <div>
              <label htmlFor="track-phone-number-input" className="block text-xs font-bold text-charcoal mb-1">
                Recipient Phone Number *
              </label>
              <input
                id="track-phone-number-input"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01867781018"
                className="w-full bg-gray-50 border border-gray-200 text-xs px-3.5 py-2.5 rounded-md outline-none focus:border-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-actionRed hover:bg-actionRed-hover text-white font-bold text-xs uppercase py-3 rounded-md transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? 'Fetching Steadfast Tracking Data...' : 'Track My Shipment'}
          </button>

          {notFoundError && (
            <p className="text-xs text-actionRed font-semibold text-center pt-2">
              {notFoundError}
            </p>
          )}
        </form>
      </div>

      {/* Result Display matching user order schema */}
      {trackingResult && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-fadeIn space-y-6">
          
          {/* Header Summary */}
          <div className="flex flex-wrap items-center justify-between border-b border-gray-100 pb-4 gap-2">
            <div>
              <span className="text-xs text-gray-400">Invoice Number:</span>
              <h3 className="font-black text-lg text-primary">{trackingResult.invoiceNumber}</h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400">Status:</span>
              <span className="block font-bold text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-sm">
                {trackingResult.orderStatus}
              </span>
            </div>
          </div>

          {/* Courier Details Card */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-gray-400 block">Courier Partner:</span>
              <span className="font-bold text-charcoal text-sm">{trackingResult.courierData.provider} Courier</span>
              <span className="text-gray-500 block text-[11px] mt-0.5">
                Consignment ID: #{trackingResult.courierData.consignmentId}
              </span>
            </div>

            <div className="sm:text-right">
              <span className="text-gray-400 block">Tracking Code:</span>
              <span className="font-black text-actionRed text-sm">{trackingResult.courierData.trackingCode}</span>
              <a
                href={trackingResult.courierData.trackingUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-semibold mt-1"
              >
                <span>Live Steadfast Tracking</span>
                <FiExternalLink />
              </a>
            </div>
          </div>

          {/* Customer Details */}
          <div className="border border-gray-100 rounded-lg p-4 space-y-1.5 text-xs">
            <h4 className="font-bold text-charcoal mb-2 uppercase text-[11px] tracking-wider text-gray-400">
              Recipient Information
            </h4>
            <div className="flex justify-between">
              <span className="text-gray-500">Customer Name:</span>
              <span className="font-bold text-charcoal">{trackingResult.customerDetails.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Phone Number:</span>
              <span className="font-bold text-charcoal">{trackingResult.customerDetails.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Address:</span>
              <span className="font-medium text-charcoal">{trackingResult.customerDetails.address}</span>
            </div>
          </div>

          {/* Ordered Items */}
          <div className="space-y-2">
            <h4 className="font-bold text-charcoal text-xs uppercase tracking-wider text-gray-400">
              Package Contents
            </h4>
            <div className="divide-y divide-gray-100 border border-gray-100 rounded-lg overflow-hidden">
              {trackingResult.items.map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between text-xs bg-white gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-11 h-11 object-cover rounded-md border border-gray-100 bg-gray-50 shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-charcoal line-clamp-1">{item.title}</p>
                      {(item.color || item.selectedVariant?.colorName) && (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {(item.colorCode || item.selectedVariant?.colorCode) && (
                            <span
                              className="w-2 h-2 rounded-full border border-gray-300 shrink-0"
                              style={{ backgroundColor: item.colorCode || item.selectedVariant?.colorCode }}
                            />
                          )}
                          <span className="text-[11px] text-gray-500">
                            Color: <strong className="text-gray-700">{item.color || item.selectedVariant?.colorName}</strong>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-gray-400 mr-2">Qty: {item.quantity}</span>
                    <span className="font-bold text-actionRed">৳{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-charcoal text-xs uppercase tracking-wider text-gray-400">
              Delivery Progress
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs">
                  <FiCheckCircle />
                </div>
                <div>
                  <span className="text-xs font-bold text-charcoal">Order Verified & Packed</span>
                  <span className="text-[10px] text-gray-400 block">Warehouse Sarail 1 to 99 Plus</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs">
                  <FiCheckCircle />
                </div>
                <div>
                  <span className="text-xs font-bold text-charcoal">Handed over to Steadfast Courier</span>
                  <span className="text-[10px] text-gray-400 block">In transit to destination hub</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center text-xs">
                  3
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-500">Out for Delivery</span>
                  <span className="text-[10px] text-gray-400 block">Delivery rider assigning</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default TrackOrder;
