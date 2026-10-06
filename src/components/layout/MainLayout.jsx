import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import QuickOrderModal from '../common/QuickOrderModal';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-charcoal font-sans antialiased selection:bg-actionRed selection:text-white">
      {/* Top Navbar Header */}
      <Navbar />

      {/* Main Page Body */}
      <main className="flex-1 w-full bg-surface">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Quick Buy Now Modal */}
      <QuickOrderModal />
    </div>
  );
};

export default MainLayout;
