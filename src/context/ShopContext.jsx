import { createContext, useContext, useState } from 'react';
import { deliveryChargesList } from '../data/mockData';

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
  // Initial cart items aligned with the requested MongoDB item structure
  const [cartItems, setCartItems] = useState([
    {
      _id: { $oid: '6ac179335ff7b1545279002f' },
      product: { $oid: '6ac17295d401196628509671' },
      title: 'Granite Coating Non-Stick Fry Pan with Heat-Resistant Wooden Handle (24cm)',
      price: 850,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&auto=format&fit=crop&q=80',
      selectedVariant: {
        colorName: 'Granite Black',
        colorCode: '#2B2B2B',
      },
    },
  ]);

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
    const productId = product._id?.$oid || product.id?.toString() || generateMongoId();
    const chosenVariant = variant || product.variants?.[0] || null;
    const itemImage =
      chosenVariant?.images?.[0] ||
      product.variants?.[0]?.images?.[0] ||
      product.thumbnail ||
      product.image;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product?.$oid === productId &&
          item.selectedVariant?.colorName === chosenVariant?.colorName
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
        selectedVariant: chosenVariant
          ? {
              colorName: chosenVariant.colorName,
              colorCode: chosenVariant.colorCode,
            }
          : null,
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

  // Create order matching the exact schema requested by user
  const createOrder = ({ customerDetails, itemsList = null, deliveryFee = 60, paymentMethod = 'COD' }) => {
    const rawItems = itemsList || cartItems;
    if (!rawItems || rawItems.length === 0) return null;

    const formattedItems = rawItems.map((item) => ({
      product: {
        $oid: item.product?.$oid || item._id?.$oid || generateMongoId(),
      },
      title: item.title || item.name,
      price: item.price,
      quantity: item.quantity || 1,
      _id: {
        $oid: item._id?.$oid || generateMongoId(),
      },
    }));

    const itemsSubtotal = formattedItems.reduce(
      (acc, it) => acc + it.price * it.quantity,
      0
    );
    const totalAmount = itemsSubtotal + deliveryFee;

    const invoiceNumber = `SAR-${new Date()
      .toISOString()
      .slice(2, 10)
      .replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const consignmentId = Math.floor(500000 + Math.random() * 90000);
    const trackingCode = `SF${Math.floor(10000000 + Math.random() * 90000000)}`;

    const newOrder = {
      _id: {
        $oid: generateMongoId(),
      },
      invoiceNumber,
      customerDetails: {
        name: customerDetails.name,
        email: customerDetails.email || '',
        phone: customerDetails.phone,
        address: customerDetails.address,
        note: customerDetails.note || '',
        deliveryLocation:
          customerDetails.deliveryLocation ||
          (deliveryFee === 120 ? 'Outside Dhaka' : 'Inside Dhaka'),
      },
      items: formattedItems,
      deliveryFee,
      totalAmount,
      paymentMethod: paymentMethod || 'COD',
      orderStatus: 'Shipped',
      courierData: {
        provider: 'Steadfast',
        consignmentId,
        trackingCode,
        trackingUrl: `https://steadfast.com.bd/t/${trackingCode}`,
        shippedAt: {
          $date: new Date().toISOString(),
        },
      },
      createdAt: {
        $date: new Date().toISOString(),
      },
      updatedAt: {
        $date: new Date().toISOString(),
      },
    };

    // Save to state and localStorage
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    try {
      localStorage.setItem('sarail_orders', JSON.stringify(updatedOrders));
    } catch (e) {
      console.error('Error saving order:', e);
    }

    return newOrder;
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
        orders,
        deliveryCharges: deliveryChargesList,
        defaultDeliveryCharge:
          deliveryChargesList.find((d) => d.isDefault) || deliveryChargesList[0],
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
