import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TbTruckDelivery } from 'react-icons/tb';
import { FiCheckCircle, FiExternalLink, FiXCircle, FiSlash } from 'react-icons/fi';
import { useShop } from '../context/ShopContext';
import { trackOrderInDB } from '../services/api';

const TrackOrder = () => {
  const { orders, cancelOrder, saveOrderLocally } = useShop();
  const [searchParams] = useSearchParams();
  const initialInvoice = searchParams.get('invoice') || '';
  const [orderId, setOrderId] = useState(initialInvoice);
  const [phone, setPhone] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [notFoundError, setNotFoundError] = useState('');
  const [loading, setLoading] = useState(Boolean(initialInvoice));
  const [cancelling, setCancelling] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cancelFeedback, setCancelFeedback] = useState({ type: '', message: '' });

  useEffect(() => {
    const cleanInvoice = initialInvoice.trim();
    if (!cleanInvoice) return;

    let cancelled = false;

    trackOrderInDB({ invoiceNumber: cleanInvoice, phone: '' })
      .then((dbOrder) => {
        if (cancelled) return;
        if (dbOrder) {
          saveOrderLocally?.(dbOrder);
          setTrackingResult(dbOrder);
          setNotFoundError('');
          return;
        }
        const matched = orders.find(
          (o) => o.invoiceNumber?.toLowerCase() === cleanInvoice.toLowerCase()
        );
        if (matched) {
          setTrackingResult(matched);
          setNotFoundError('');
        } else {
          setNotFoundError(
            'No shipment found matching this Invoice Number. Please verify your details and try again.'
          );
        }
      })
      .catch(() => {
        if (cancelled) return;
        const matched = orders.find(
          (o) => o.invoiceNumber?.toLowerCase() === cleanInvoice.toLowerCase()
        );
        if (matched) {
          setTrackingResult(matched);
          setNotFoundError('');
        } else {
          setNotFoundError(
            'No shipment found matching this Invoice Number in our database.'
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [initialInvoice, orders]);

  const handleTrack = async (e) => {
    e.preventDefault();
    const cleanInvoice = orderId.trim();
    const cleanPhone = phone.trim();
    if (!cleanInvoice && !cleanPhone) return;

    setLoading(true);
    setNotFoundError('');
    setTrackingResult(null);
    try {
      // 1. Check backend MongoDB first
      const dbOrder = await trackOrderInDB({
        invoiceNumber: cleanInvoice,
        phone: cleanPhone,
      });

      if (dbOrder) {
        saveOrderLocally?.(dbOrder);
        setTrackingResult(dbOrder);
        return;
      }

      // 2. Search in current session orders if any
      const matched = orders.find(
        (o) =>
          (cleanInvoice &&
            o.invoiceNumber?.toLowerCase() === cleanInvoice.toLowerCase()) ||
          (cleanPhone && o.customerDetails?.phone?.includes(cleanPhone))
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
          (cleanInvoice &&
            o.invoiceNumber?.toLowerCase() === cleanInvoice.toLowerCase()) ||
          (cleanPhone && o.customerDetails?.phone?.includes(cleanPhone))
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

  const handleCancelTrackedOrder = async () => {
    if (!trackingResult?.invoiceNumber) return;
    const currentStatus = trackingResult.orderStatus || 'Pending';

    if (currentStatus === 'Shipped' || currentStatus === 'Delivered') {
      setCancelFeedback({
        type: 'error',
        message: `Cannot cancel order because it is already ${currentStatus}.`,
      });
      setConfirmCancel(false);
      return;
    }

    setCancelling(true);
    setCancelFeedback({ type: '', message: '' });
    try {
      const updated = await cancelOrder(trackingResult.invoiceNumber);
      setTrackingResult((prev) =>
        prev ? { ...prev, orderStatus: updated?.orderStatus || 'Cancelled' } : prev
      );
      setCancelFeedback({
        type: 'success',
        message: `Order #${trackingResult.invoiceNumber} has been cancelled successfully.`,
      });
      setConfirmCancel(false);
    } catch (err) {
      setCancelFeedback({
        type: 'error',
        message: err?.message || 'Could not cancel order.',
      });
    } finally {
      setCancelling(false);
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
          
          {cancelFeedback.message && (
            <div
              className={`p-3.5 rounded-lg text-xs font-semibold border ${
                cancelFeedback.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-red-50 border-red-200 text-actionRed'
              }`}
            >
              {cancelFeedback.message}
            </div>
          )}

          {/* Header Summary */}
          <div className="flex flex-wrap items-center justify-between border-b border-gray-100 pb-4 gap-3">
            <div>
              <span className="text-xs text-gray-400">Invoice Number:</span>
              <h3 className="font-black text-lg text-primary">{trackingResult.invoiceNumber}</h3>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Cancel Order Button (when Pending or Processing) */}
              {(trackingResult.orderStatus === 'Pending' ||
                trackingResult.orderStatus === 'Processing' ||
                !trackingResult.orderStatus) &&
                !confirmCancel && (
                  <button
                    type="button"
                    disabled={cancelling}
                    onClick={() => setConfirmCancel(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-red-200 bg-white hover:bg-red-50 text-actionRed text-xs font-bold transition-colors disabled:opacity-50"
                  >
                    <FiXCircle />
                    <span>{cancelling ? 'Cancelling...' : 'Cancel Order'}</span>
                  </button>
                )}

              {(trackingResult.orderStatus === 'Pending' ||
                trackingResult.orderStatus === 'Processing' ||
                !trackingResult.orderStatus) &&
                confirmCancel && (
                  <div className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 px-2.5 py-1 rounded-md">
                    <span className="text-[11px] font-bold text-actionRed">Cancel order?</span>
                    <button
                      type="button"
                      disabled={cancelling}
                      onClick={handleCancelTrackedOrder}
                      className="px-2 py-0.5 rounded bg-actionRed text-white text-[11px] font-bold"
                    >
                      {cancelling ? 'Wait...' : 'Yes'}
                    </button>
                    <button
                      type="button"
                      disabled={cancelling}
                      onClick={() => setConfirmCancel(false)}
                      className="px-2 py-0.5 rounded bg-white border border-gray-200 text-gray-600 text-[11px] font-bold"
                    >
                      No
                    </button>
                  </div>
                )}

              {/* Locked Notice when Shipped or Delivered */}
              {(trackingResult.orderStatus === 'Shipped' ||
                trackingResult.orderStatus === 'Delivered') && (
                <span
                  title={`Order cannot be cancelled because it is already ${trackingResult.orderStatus}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-200 bg-gray-100 text-gray-400 text-xs font-semibold cursor-not-allowed"
                >
                  <FiSlash />
                  <span>Cannot Cancel ({trackingResult.orderStatus})</span>
                </span>
              )}

              <div className="text-right">
                <span className="text-xs text-gray-400 block">Status:</span>
                <span
                  className={`inline-block font-bold text-xs px-2.5 py-1 rounded-sm ${
                    trackingResult.orderStatus === 'Shipped' ||
                    trackingResult.orderStatus === 'Delivered'
                      ? 'text-emerald-700 bg-emerald-50'
                      : trackingResult.orderStatus === 'Cancelled'
                      ? 'text-actionRed bg-red-50'
                      : 'text-amber-800 bg-amber-50'
                  }`}
                >
                  {trackingResult.orderStatus || 'Pending'}
                </span>
              </div>
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
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
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
