
import {
  User,
  LogOut,
  Home,
  ShoppingBag,
  Lock,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { Link } from 'react-router-dom';
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom.min";


export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useHistory();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      navigate("/");
      setIsProfileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="text-lg font-bold text-blue-600 flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                E
              </div>
              ShopHub
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                to="/"
                className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-colors ${
                  isActive("/")
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                }`}
              >
                <Home size={18} />
                Home
              </Link>
              <Link
                to="/dashboard"
                className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-colors ${
                  isActive("/dashboard")
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                }`}
              >
                <ShoppingBag size={18} />
                Dashboard
              </Link>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 py-2 px-3 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors"
                >
                  <User size={18} />
                  Account
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      isProfileMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <User size={16} />
                      My Dashboard
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <ShoppingBag size={16} />
                      My Orders
                    </Link>
                    <Link
                      to="/change-password"
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <Lock size={16} />
                      Change Password
                    </Link>
                    <div className="border-t border-gray-200 my-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-600 hover:text-blue-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden pb-4 space-y-2 border-t border-gray-200 pt-4">
              <Link
                to="/"
                className={`block py-2 px-3 rounded-lg transition-colors ${
                  isActive("/")
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <Home size={18} />
                  Home
                </div>
              </Link>
              <Link
                to="/dashboard"
                className={`block py-2 px-3 rounded-lg transition-colors ${
                  isActive("/dashboard")
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag size={18} />
                  Dashboard
                </div>
              </Link>
              <Link
                to="/orders"
                className={`block py-2 px-3 rounded-lg transition-colors ${
                  isActive("/orders")
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag size={18} />
                  My Orders
                </div>
              </Link>
              <Link
                to="/change-password"
                className={`block py-2 px-3 rounded-lg transition-colors ${
                  isActive("/change-password")
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <Lock size={18} />
                  Change Password
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left py-2 px-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div>
              <h3 className="text-white text-sm font-semibold mb-3">
                About ShopHub
              </h3>
              <p className="text-xs text-gray-400">
                Your ultimate destination for online shopping with quality
                products and fast delivery.
              </p>
            </div>
            <div>
              <h3 className="text-white text-sm font-semibold mb-3">
                Quick Links
              </h3>
              <ul className="text-xs space-y-2">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard"
                    className="hover:text-white transition-colors"
                  >
                    My Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-sm font-semibold mb-3">
                Customer Care
              </h3>
              <ul className="text-xs space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    FAQs
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-sm font-semibold mb-3">Legal</h3>
              <ul className="text-xs space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-400">
            <p>&copy; 2024 ShopHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
