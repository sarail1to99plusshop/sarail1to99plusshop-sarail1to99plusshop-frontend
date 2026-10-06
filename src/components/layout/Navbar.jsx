import TopBar from './TopBar';
import MainHeader from './MainHeader';
import BottomNav from './BottomNav';
import MobileDrawer from './MobileDrawer';

const Navbar = () => {
  return (
    <header className="w-full flex flex-col z-40 bg-white">
      {/* 1. Top Bar (Socials, Phone, Email, Track Order) */}
      <TopBar />

      {/* 2. Middle Bar (Logo, Search Bar, Cart, Pre-Order, Account) */}
      <MainHeader />

      {/* 3. Bottom Bar (Gadgets Dropdown, Menu links with dividers) */}
      <BottomNav />

      {/* Mobile drawer overlay */}
      <MobileDrawer />
    </header>
  );
};

export default Navbar;

