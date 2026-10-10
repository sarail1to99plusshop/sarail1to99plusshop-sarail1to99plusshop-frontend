import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Home from '../pages/Home';
import Shop from '../pages/Shop';
import BestSelling from '../pages/BestSelling';
import NewArrivals from '../pages/NewArrivals';
import About from '../pages/About';
import HotOffers from '../pages/HotOffers';
import Contact from '../pages/Contact';
import TrackOrder from '../pages/TrackOrder';
import Cart from '../pages/Cart';
import PreOrder from '../pages/PreOrder';
import Account from '../pages/Account';
import ProductDetailsPage from '../pages/ProductDetailsPage';
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  return (
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
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
