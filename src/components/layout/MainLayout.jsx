import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import AutoScrol from './AutoScrol';
import { useShop } from '../../context/ShopContext';

const QuickOrderModal = lazy(() => import('../common/QuickOrderModal'));

const MainLayout = () => {
  const { isQuickOrderOpen } = useShop();

  return (
    <div className="min-h-screen flex flex-col bg-surface text-charcoal font-sans antialiased selection:bg-actionRed selection:text-white">
      <AutoScrol />
      {/* Top Navbar Header */}
      <Navbar />

      {/* Main Page Body */}
      <main id="main-content" className="flex-1 w-full bg-surface">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Quick Buy Now Modal (loaded on demand) */}
      {isQuickOrderOpen && (
        <Suspense fallback={null}>
          <QuickOrderModal />
        </Suspense>
      )}
    </div>
  );
};

export default MainLayout;
