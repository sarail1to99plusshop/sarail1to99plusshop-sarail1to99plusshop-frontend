import { createContext, useContext, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createOrderInDB, cancelOrderInDB } from '../services/api';
import { useDeliveryCharges } from '../hooks/useQueries';
import { trackAddToCart, trackPurchase } from '../utils/pixel';

const ShopContext = createContext();

// Helper to generate a 24-character hexadecimal ObjectId
const generateMongoId = () => {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  const randomHex = Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
  return (timestamp + randomHex).slice(0, 24);
};

export const ShopProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const { data: deliveryCharges = [] } = useDeliveryCharges();
  // Lazy initialize cart items from localStorage (or empty array)
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('sarail_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      console.error('Failed to load cart from localStorage:', e);
      return [];
    }
  });

  // Persist cart items to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('sarail_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [cartItems]);

  // Sync cart across browser tabs if changed in another window/tab
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'sarail_cart') {
        try {
          const newCart = e.newValue ? JSON.parse(e.newValue) : [];
          setCartItems(newCart);
        } catch (err) {
          console.error('Error syncing cart from storage event:', err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Lazy initialize orders from localStorage to avoid calling setState in effect
  const [orders, setOrders] = useState(() => {
    try {
      const savedOrders = localStorage.getItem('sarail_orders');
      return savedOrders ? JSON.parse(savedOrders) : [];
    } catch {
      return [];
    }
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [quickOrderProduct, setQuickOrderProduct] = useState(null);
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Add product to cart with variant support and exact MongoDB structure
  const addToCart = (product, variant = null, quantity = 1) => {
    const qtyToAdd = Math.max(1, Number(quantity) || 1);
    
    // Track Meta Pixel AddToCart event
    trackAddToCart(product, qtyToAdd);

    const productId = product._id?.$oid || product.id?.toString() || generateMongoId();
    const chosenVariant = variant || product.variants?.[0] || null;
    const itemImage =
      chosenVariant?.images?.[0] ||
      product.variants?.[0]?.images?.[0] ||
      product.thumbnail ||
      product.image;

    const chosenColorName = chosenVariant?.colorName || 'Standard';
    const chosenColorCode = chosenVariant?.colorCode || '';

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product?.$oid === productId &&
          (item.color === chosenColorName ||
            item.selectedVariant?.colorName === chosenColorName)
      );

      if (existingIndex > -1) {
        return prev.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + qtyToAdd }
            : item
        );
      }

      const newItem = {
        _id: { $oid: generateMongoId() },
        product: { $oid: productId },
        title: product.name,
        price: product.price,
        quantity: qtyToAdd,
        image: itemImage,
        color: chosenColorName,
        colorCode: chosenColorCode,
        selectedVariant: chosenVariant
          ? {
              colorName: chosenColorName,
              colorCode: chosenColorCode,
            }
          : null,
        category: product.category || 'General',
      };

      return [...prev, newItem];
    });
  };

  const removeFromCart = (itemIdOrOid) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          item._id?.$oid !== itemIdOrOid &&
          item.product?.$oid !== itemIdOrOid &&
          item.id !== itemIdOrOid
      )
    );
  };

  const updateQuantity = (itemIdOrOid, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          const matches =
            item._id?.$oid === itemIdOrOid ||
            item.product?.$oid === itemIdOrOid ||
            item.id === itemIdOrOid;
          if (matches) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
      );
  };

  const clearCart = () => setCartItems([]);

  // Buy Now trigger: opens instant order modal
  const buyNow = (product, variant = null, quantity = 1) => {
    setQuickOrderProduct({
      product,
      selectedVariant: variant || product.variants?.[0] || null,
      quantity: Math.max(1, Number(quantity) || 1),
    });
    setIsQuickOrderOpen(true);
  };

  // Create order matching backend schema, persist directly in MongoDB, and synchronize with local cache
  const createOrder = async ({
    userId = '',
    customerDetails,
    itemsList = null,
    deliveryFee = 60,
    paymentMethod = 'COD',
    paymentDetails = {},
  }) => {
    const rawItems = itemsList || cartItems;
    if (!rawItems || rawItems.length === 0) {
      throw new Error('Your cart is empty. Please add items before placing an order.');
    }

    const formattedItems = rawItems.map((item) => {
      const color =
        item.color ||
        item.selectedVariant?.colorName ||
        item.variants?.[0]?.colorName ||
        'Standard';

      const colorCode =
        item.colorCode ||
        item.selectedVariant?.colorCode ||
        item.variants?.[0]?.colorCode ||
        '';

      const image =
        item.image ||
        item.selectedVariant?.images?.[0] ||
        item.variants?.[0]?.images?.[0] ||
        item.thumbnail ||
        '';

      const category = item.category || 'General';
      const unitPrice = Number(item.price) || 0;
      const quantity = Math.max(1, Number(item.quantity) || 1);

      const pid =
        item.productId ||
        item.id ||
        (typeof item.product === 'object'
          ? item.product?._id || item.product?.id || item.product?.$oid
          : item.product) ||
        (typeof item._id === 'object' ? item._id?.$oid : item._id);

      return {
        id: pid,
        productId: Number(item.productId || item.id) || undefined,
        product: pid,
        title: item.title || item.name || 'Product',
        price: unitPrice,
        quantity,
        color,
        colorCode,
        selectedVariant: {
          colorName: color,
          colorCode,
        },
        image,
        category,
        subtotal: unitPrice * quantity,
      };
    });

    const itemsSubtotal = formattedItems.reduce(
      (acc, it) => acc + it.price * it.quantity,
      0
    );
    const totalAmount = itemsSubtotal + deliveryFee;

    const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const randPart = Math.floor(1000 + Math.random() * 9000);
    const invoiceNumber = `SAR-${datePart}-${randPart}`;

    const consignmentId = Math.floor(500000 + Math.random() * 90000);
    const trackingCode = `SF${Math.floor(10000000 + Math.random() * 90000000)}`;

    const isBkash = paymentMethod === 'bKash';
    const submittedTrx = (paymentDetails.trxId || '').trim().toUpperCase();

    const rawStreet = (customerDetails.streetAddress || customerDetails.address || '').trim();
    const rawThana = (customerDetails.thana || '').trim();
    const rawDistrict = (customerDetails.district || '').trim();
    const fullAddress =
      customerDetails.fullAddress ||
      (rawStreet && rawThana && rawDistrict
        ? `${rawStreet}, ${rawThana}, ${rawDistrict}`
        : rawStreet);

    const orderPayload = {
      invoiceNumber,
      userId: String(userId || '').trim(),
      customerDetails: {
        name: (customerDetails.name || '').trim(),
        email: (customerDetails.email || '').trim().toLowerCase(),
        phone: (customerDetails.phone || '').trim(),
        district: rawDistrict,
        thana: rawThana,
        streetAddress: rawStreet,
        fullAddress,
        address: fullAddress,
        division: (customerDetails.division || '').trim(),
        note: (customerDetails.note || '').trim(),
        deliveryLocation:
          customerDetails.deliveryLocation ||
          (deliveryFee === 120 ? 'Outside Dhaka' : 'Inside Dhaka'),
      },
      items: formattedItems,
      deliveryFee,
      itemsSubtotal,
      totalAmount,
      totalQuantity: formattedItems.reduce((acc, it) => acc + it.quantity, 0),
      paymentMethod: isBkash ? 'bKash' : 'COD',
      paymentStatus: isBkash ? 'Pending Verification' : 'Pending',
      paymentDetails: {
        mode: paymentDetails.mode || 'full',
        bKashNumber: '01998789157',
        trxId: submittedTrx,
        senderPhone: (paymentDetails.senderPhone || '').trim(),
        expectedAmount:
          isBkash && paymentDetails.mode === 'delivery'
            ? deliveryFee
            : isBkash
            ? totalAmount
            : 0,
      },
      courierData: {
        provider: 'Steadfast',
        consignmentId,
        trackingCode,
        trackingUrl: `https://steadfast.com.bd/t/${trackingCode}`,
      },
    };

    // Persist order directly into MongoDB via backend API
    const savedOrder = await createOrderInDB(orderPayload);
    const finalOrder = savedOrder || {
      ...orderPayload,
      _id: `ord_${Date.now()}`,
      orderStatus: 'Pending',
      createdAt: new Date().toISOString(),
    };

    // Update state and localStorage with the confirmed database order
    setOrders((prev) => {
      const filtered = prev.filter((o) => o.invoiceNumber !== finalOrder.invoiceNumber);
      const updated = [finalOrder, ...filtered];
      try {
        localStorage.setItem('sarail_orders', JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving order to localStorage:', e);
      }
      return updated;
    });

    queryClient.invalidateQueries({ queryKey: ['userOrders'] });
    trackPurchase(finalOrder);

    return finalOrder;
  };

  // Cancel an order if its status is not Shipped or Delivered
  const cancelOrder = async (invoiceNumber) => {
    const cleanInvoice = (invoiceNumber || '').trim();
    if (!cleanInvoice) {
      throw new Error('Invoice number is required to cancel order.');
    }

    // Check if the order in local state is already Shipped or Delivered
    const localMatch = orders.find(
      (o) => o.invoiceNumber?.toLowerCase() === cleanInvoice.toLowerCase()
    );
    if (
      localMatch &&
      (localMatch.orderStatus === 'Shipped' || localMatch.orderStatus === 'Delivered')
    ) {
      throw new Error(
        `Cannot cancel order because it is already ${localMatch.orderStatus}.`
      );
    }

    let backendOrder = null;
    try {
      const res = await cancelOrderInDB(cleanInvoice);
      backendOrder = res?.order || null;
    } catch (err) {
      const serverMsg = err?.response?.data?.message;
      // If backend explicitly rejected (e.g. already Shipped or Delivered), rethrow
      if (err?.response?.status === 400) {
        throw new Error(serverMsg || 'Cannot cancel this order.', { cause: err });
      }
      // If 404 in DB (e.g., only in local session), allow local update if localMatch exists
      if (!localMatch) {
        throw new Error(serverMsg || 'Failed to cancel order.', { cause: err });
      }
    }

    // Update local orders state & localStorage
    const updatedOrders = orders.map((o) =>
      o.invoiceNumber?.toLowerCase() === cleanInvoice.toLowerCase()
        ? {
            ...o,
            orderStatus: 'Cancelled',
            updatedAt: new Date().toISOString(),
          }
        : o
    );
    setOrders(updatedOrders);
    try {
      localStorage.setItem('sarail_orders', JSON.stringify(updatedOrders));
    } catch (e) {
      console.error('Error updating cancelled order in localStorage:', e);
    }

    queryClient.invalidateQueries({ queryKey: ['userOrders'] });
    return backendOrder || { ...(localMatch || {}), orderStatus: 'Cancelled' };
  };

  return (
    <ShopContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        buyNow,
        createOrder,
        cancelOrder,
        orders,
        deliveryCharges,
        defaultDeliveryCharge:
          deliveryCharges.find((d) => d.isDefault) || deliveryCharges[0] || null,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        searchQuery,
        setSearchQuery,
        quickOrderProduct,
        setQuickOrderProduct,
        isQuickOrderOpen,
        setIsQuickOrderOpen,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
