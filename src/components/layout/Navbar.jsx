import { lazy, Suspense } from 'react';
import TopBar from './TopBar';
import MainHeader from './MainHeader';
import BottomNav from './BottomNav';
import { useShop } from '../../context/ShopContext';

const MobileDrawer = lazy(() => import('./MobileDrawer'));

const Navbar = () => {
  const { isMobileMenuOpen } = useShop();

  return (
    <header className="w-full flex flex-col z-40 bg-white">
      {/* 1. Top Bar (Socials, Phone, Email, Track Order) */}
      <TopBar />

      {/* 2. Middle Bar (Logo, Search Bar, Cart, Pre-Order, Account) */}
      <MainHeader />

      {/* 3. Bottom Bar (Gadgets Dropdown, Menu links with dividers) */}
      <BottomNav />

      {/* Mobile drawer overlay (loaded on demand) */}
      {isMobileMenuOpen && (
        <Suspense fallback={null}>
          <MobileDrawer />
        </Suspense>
      )}
    </header>
  );
};

export default Navbar;

