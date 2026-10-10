import { createContext, useContext, useEffect, useState } from 'react';
import { createOrderInDB } from '../services/api';
import { useDeliveryCharges } from '../hooks/useQueries';

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

  // Create order matching the exact schema requested by user with product color, image and essential metadata
  const createOrder = ({ customerDetails, itemsList = null, deliveryFee = 60, paymentMethod = 'COD' }) => {
    const rawItems = itemsList || cartItems;
    if (!rawItems || rawItems.length === 0) return null;

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

      return {
        _id: {
          $oid: item._id?.$oid || generateMongoId(),
        },
        product: {
          $oid:
            item.product?.$oid ||
            item.productId ||
            item.product?.toString() ||
            item._id?.$oid ||
            generateMongoId(),
        },
        title: item.title || item.name,
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
      itemsSubtotal,
      totalAmount,
      totalQuantity: formattedItems.reduce((acc, it) => acc + it.quantity, 0),
      paymentMethod: paymentMethod || 'COD',
      orderStatus: 'Pending',
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

    // Asynchronously persist order to MongoDB backend
    createOrderInDB(newOrder).catch((err) => {
      console.warn('Could not sync order to backend:', err);
    });

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
