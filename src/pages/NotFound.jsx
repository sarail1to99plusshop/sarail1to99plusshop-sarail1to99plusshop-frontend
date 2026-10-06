import { Link } from 'react-router-dom';
import { FiHome, FiAlertCircle } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-red-100 text-actionRed flex items-center justify-center text-3xl mx-auto mb-4">
        <FiAlertCircle />
      </div>
      <h1 className="text-4xl font-black text-charcoal mb-2">404</h1>
      <h2 className="text-lg font-bold text-gray-700 mb-2">Page Not Found</h2>
      <p className="text-xs text-gray-500 mb-6">
        Sorry, the gadget page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold uppercase px-6 py-3 rounded-md transition-colors"
      >
        <FiHome />
        <span>Return to Homepage</span>
      </Link>
    </div>
  );
};

export default NotFound;

