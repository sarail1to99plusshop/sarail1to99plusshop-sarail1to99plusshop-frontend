import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Home from '../pages/Home';
import { ProductGridSkeleton } from '../components/common/ProductCardSkeleton';

// Lazy-load secondary pages to keep initial JS bundle fast for mobile & desktop LCP
const Shop = lazy(() => import('../pages/Shop'));
const BestSelling = lazy(() => import('../pages/BestSelling'));
const NewArrivals = lazy(() => import('../pages/NewArrivals'));
const About = lazy(() => import('../pages/About'));
const HotOffers = lazy(() => import('../pages/HotOffers'));
const Contact = lazy(() => import('../pages/Contact'));
const TrackOrder = lazy(() => import('../pages/TrackOrder'));
const Cart = lazy(() => import('../pages/Cart'));
const PreOrder = lazy(() => import('../pages/PreOrder'));
const Account = lazy(() => import('../pages/Account'));
const ProductDetailsPage = lazy(() => import('../pages/ProductDetailsPage'));
const NotFound = lazy(() => import('../pages/NotFound'));

const PageLoaderFallback = () => (
  <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
    <div className="h-8 w-56 rounded-lg yt-skeleton" />
    <ProductGridSkeleton
      count={8}
      columnsClass="grid-cols-2 sm:grid-cols-2 md:grid-cols-4"
    />
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoaderFallback />}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Navigate to="/" replace />} />
          <Route path="shop" element={<Shop />} />
          <Route path="products" element={<Shop />} />
          <Route path="product/:id" element={<ProductDetailsPage />} />
          <Route path="products/:id" element={<ProductDetailsPage />} />
          <Route path="product-details/:id" element={<ProductDetailsPage />} />
          <Route path="best-selling" element={<BestSelling />} />
          <Route path="bestselling" element={<BestSelling />} />
          <Route path="new-arrivals" element={<NewArrivals />} />
          <Route path="newarrivals" element={<NewArrivals />} />
          <Route path="about" element={<About />} />
          <Route path="about-us" element={<About />} />
          <Route path="brands" element={<Navigate to="/about" replace />} />
          <Route path="hot-offers" element={<HotOffers />} />
          <Route path="hotoffers" element={<HotOffers />} />
          <Route path="offers" element={<HotOffers />} />
          <Route path="contact" element={<Contact />} />
          <Route path="contact-us" element={<Contact />} />
          <Route path="blog" element={<Navigate to="/contact" replace />} />
          <Route path="track-order" element={<TrackOrder />} />
          <Route path="track" element={<TrackOrder />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Cart />} />
          <Route path="pre-order" element={<PreOrder />} />
          <Route path="preorder" element={<PreOrder />} />
          <Route path="power-play" element={<Navigate to="/hot-offers" replace />} />
          <Route path="account" element={<Account />} />
          <Route path="login" element={<Account />} />
          <Route path="register" element={<Account />} />
          <Route path="signup" element={<Account />} />
          <Route path="profile" element={<Account />} />
          <Route path="orders" element={<Account />} />
          <Route path="order-history" element={<Account />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
