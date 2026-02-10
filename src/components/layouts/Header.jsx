// src/components/layouts/Header.js
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ChevronDown,
  ShoppingCart,
  Menu,
  User,
  Heart,
  Video,
  LogOut,
  LogIn,
  MapPin
} from "lucide-react";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Mobilemenu from "./Mobilemenu";
import Logo from "./logo.png";
import ItemSearch from "./Search";
import useScreenWidth from "./useScreenWidth";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/userSlice";
import { useFavorites } from "../../hook/favorites/useFavoritesQuery";
import { useCart } from "../../hook/cart/useCartQuery";
import { useRatesQuery } from "../../hook/rate/useRatesQuery";
import { useCompanyDetails } from "../../context/clientDetails/clientDetialContext";
import PincodeModal from "./DeliveryPincodeHeader";
import useHeaderNavByShopId from "./headerNavByShopId";
import './HeaderScroll.css'
import RatesDropdown from "./RatesDropdown";


const Header = ({ isAuthenticated }) => {
  const width = useScreenWidth();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const headerNavData = useHeaderNavByShopId();

  const headerRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [isCategoriesHovered, setIsCategoriesHovered] = useState(false);
  const [pincode, setPincode] = useState(localStorage.getItem("userPincode") || "");
  const [headerHeight, setHeaderHeight] = useState(0);
  const [shouldShow, setShouldShow] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);


  const { details } = useCompanyDetails();

  // Queries
  const { data: ratesData } = useRatesQuery();
  const { data: favoritesData, isLoading: favoritesLoading } = useFavorites({ enabled: isAuthenticated });

  console.log(favoritesData,'favoritesData')
  const { cartItems, isLoading: cartLoading } = useCart({ enabled: isAuthenticated });

  // Measure header height on mount and resize
  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);

    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

  // Reset header visibility on page navigation
  useEffect(() => {
    setShouldShow(true);
    setIsNavigating(false);
  }, [location.pathname]);

  // Smooth scroll tracking with RAF for better performance
  useEffect(() => {
    let ticking = false;
    let lastScrollTop = 0;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          setScrollY(currentScrollY);

          // Don't hide header during navigation or when at top
          if (currentScrollY === 0 || isNavigating) {
            setShouldShow(true);
          } else if (currentScrollY > 100) {
            if (currentScrollY > lastScrollTop) {
              // Scrolling down
              setShouldShow(false);
            } else {
              // Scrolling up
              setShouldShow(true);
            }
          } else {
            setShouldShow(true);
          }

          lastScrollTop = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isNavigating]);

  // Update pincode in localStorage
  useEffect(() => {
    if (pincode) {
      localStorage.setItem("userPincode", pincode);
    }
  }, [pincode]);

  // Set navigating state when clicking links
  const handleNavigation = (e) => {
    setIsNavigating(true);
  };

  // Derived states from scroll position
  const isTopBarHidden = scrollY > 30;
  const isSticky = scrollY > 100;

  // Calculate opacity and translate based on scroll
  const headerTranslate = shouldShow ? 0 : -5;

  // Calculate counts
  const wishlistCount = favoritesLoading ? 0 : favoritesData?.data?.totalItems;
  const cartCount = cartLoading ? 0 : cartItems?.data?.totalItems;

  

  const handleLogout = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(logout());
    navigate("/login");
  };

  const handleCategoryClick = (keyName, keyValue) => {
    setIsNavigating(true);
    const queryParams = new URLSearchParams();
    queryParams.append(keyName, keyValue);
    navigate(`/products-page?${queryParams.toString()}`);
    setIsCategoriesHovered(false);
  };

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/products-page", label: "Shop" },
    { path: "/contactstore", label: "Contact" },
  ];

  const baseUrl = "https://app.bmgjewellers.com";



  return (
    <>
      <style>
        {`
          body {
            transition: padding-top 0.3s ease;
          }
          
          @keyframes slideDown {
            from {
              transform: translateY(-100%);
            }
            to {
              transform: translateY(0);
            }
          }
          
          @keyframes slideUp {
            from {
              transform: translateY(0);
            }
            to {
              transform: translateY(-100%);
            }
          }
        `}
      </style>

      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${isSticky ? 'bg-white shadow-lg' : 'bg-gradient-to-b from-white/95 via-white/90 to-white '
          }`}
        style={{
          transform: `translateY(${headerTranslate}px)`,
          backdropFilter: 'blur(10px)',
        }}
      >
        {/* Top Bar - Desktop Only */}
        <motion.div
          className={`bg-gradient-to-r from-orange-600 to-orange-500 p-1 text-white overflow-hidden ${width > 991 ? '' : 'hidden'
            }`}
          animate={{
            height: isTopBarHidden ? 0 : 'auto',
            opacity: isTopBarHidden ? 0 : 1
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="mx-auto px-2 py-2">
            <div className="flex items-center justify-between">
              {/* BMG Live Button */}
              <motion.button
                onClick={() => {
                  setIsNavigating(true);
                  navigate("/appointment");
                }}
                className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-amber-700 to-amber-600 rounded-full hover:from-amber-600 hover:to-amber-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Video size={18} className="animate-pulse" />
                <span className="font-semibold tracking-wide">BMG Live</span>
              </motion.button>

              {/* Rates and Auth */}
              <div className="flex items-center gap-6">
                {/* Rates */}
                <RatesDropdown ratesData={ratesData} />

                {/* Auth Button */}
                <div>
                  {isAuthenticated ? (
                    <motion.button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-red-600 to-red-500 rounded-full hover:from-red-500 hover:to-red-400 transition-all duration-300 hover:scale-105 active:scale-95"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <LogOut size={16} />
                      <span className="font-medium">Log Out</span>
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={() => {
                        setIsNavigating(true);
                        navigate("/login");
                      }}
                      className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-green-600 to-green-500 rounded-full hover:from-green-500 hover:to-green-400 transition-all duration-300 hover:scale-105 active:scale-95"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <LogIn size={16} />
                      <span className="font-medium">Log In</span>
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Header */}
        <div className={`border-b border-gray-200/50 transition-all duration-300 ${isSticky ? 'shadow-md' : ''
          }`}>
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-1 lg:py-3">
              {/* Logo */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Link to="/" onClick={handleNavigation} className="flex items-center flex-shrink-0">
                  <img
                    src={Logo}
                    alt="BMG Jewellers"
                    className="w-20 lg:w-28 h-auto transition-all duration-300"
                  />
                </Link>
              </motion.div>

              {/* Desktop Navigation */}
              {width > 991 && (
                <nav className="flex-1 flex items-center justify-between ml-8">
                  {/* Left Nav Items */}
                  <div className="flex items-center space-x-6 xl:space-x-8">
                    {navItems.map((item) => (
                      <motion.div
                        key={item.path}
                        whileHover={{ y: -2 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <Link
                          to={item.path}
                          onClick={handleNavigation}
                          className={`font-medium sm:text-base no-underline transition-all duration-200 hover:text-amber-700 relative group ${location.pathname === item.path
                            ? 'text-amber-700'
                            : 'text-gray-700'
                            }`}
                        >
                          {item.label}
                          <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-700 transition-all duration-300 group-hover:w-full ${location.pathname === item.path ? 'w-full' : ''
                            }`} />
                        </Link>
                      </motion.div>
                    ))}

                    {/* Categories Dropdown */}
                    <div
                      className="relative group"
                      onMouseEnter={() => setIsCategoriesHovered(true)}
                      onMouseLeave={() => setIsCategoriesHovered(false)}
                    >
                      <motion.button
                        className="flex items-center sm:text-base font-medium text-gray-700 hover:text-amber-700 transition-all duration-200 relative group"
                        whileHover={{ y: -2 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        Categories
                        <ChevronDown
                          size={16}
                          className={`ml-1 transition-transform duration-300 ${isCategoriesHovered ? 'rotate-180' : ''
                            }`}
                        />
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-700 transition-all duration-300 group-hover:w-full" />
                      </motion.button>

                      {/* Mega Menu */}
                      <AnimatePresence>
                        {isCategoriesHovered && (
                          <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 25,
                              mass: 0.8
                            }}
                            className="absolute w-[800px] left-0 top-full mt-2 bg-white shadow-2xl rounded-lg p-6 z-50"

                          >
                            <div className="flex gap-2">
                              {/* Left Tabs */}
                              <div className="w-1/4">
                                <div className="space-y-1">
                                  {headerNavData.menuSections.map((section, index) => (
                                    <motion.button
                                      key={section.label}
                                      onClick={() => setActiveTab(index)}
                                      onMouseEnter={() => setActiveTab(index)}
                                      className={`w-full text-left px-2 py-3 rounded-lg transition-all duration-200 ${activeTab === index
                                        ? 'bg-amber-50 text-amber-700 font-medium shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                      whileHover={{ x: 4 }}
                                      whileTap={{ scale: 0.98 }}
                                    >
                                      {section.label}
                                    </motion.button>
                                  ))}
                                </div>
                              </div>

                              {/* Right Content */}
                              <div className="w-3/4">
                                <AnimatePresence mode="wait">
                                  <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className="grid grid-cols-4 gap-3"
                                  >
                                    {headerNavData.menuSections[activeTab]?.items.map((item, idx) => (
                                      <motion.button
                                        key={idx}
                                        onClick={() => handleCategoryClick(item.keyName, item.keyValue)}
                                        className="group flex flex-col items-center p-1 rounded-lg hover:bg-amber-50 transition-all duration-200 hover:shadow-sm"
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                      >
                                        {item.image && (
                                          <div className="w-20 h-20 mb-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                            <img
                                              src={`${baseUrl}${item.image}`}
                                              alt={item.name || item.label}
                                              className="w-20 h-20 object-cover"
                                              onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "/fallback-image.jpg";
                                              }}
                                            />
                                          </div>
                                        )}
                                        <span className="text-xs font-semibold text-[var(--primary-text-color)] text-center transition-colors duration-200">
                                          {item.name || item.label}
                                        </span>
                                      </motion.button>
                                    ))}
                                  </motion.div>
                                </AnimatePresence>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Right Side */}
                  <div className="flex items-center gap-2">
                    {/* Pincode Modal */}
                    <PincodeModal
                      isOpen={modalOpen}
                      onClose={() => setModalOpen(false)}
                      pincode={pincode}
                      setPincode={setPincode}
                    />

                    {/* Search */}
                    <motion.div
                      className="w-64 sm:w-80"
                      whileHover={{ scale: 1.02 }}
                    >
                      <ItemSearch />
                    </motion.div>

                    {/* Icons */}
                    <div className="flex items-center gap-3">
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <Link
                          to="/account"
                          onClick={handleNavigation}
                          className="p-2 text-gray-600 hover:text-amber-700 transition-all duration-200"
                        >
                          <User size={20} />
                        </Link>
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <Link
                          to="/wishlist"
                          onClick={handleNavigation}
                          className="relative p-2 text-gray-600 hover:text-amber-700 transition-all duration-200"
                        >
                          {wishlistCount > 0 ? (
                            <FaHeart size={20} className="text-red-500" />
                          ) : (
                            <Heart size={20} />
                          )}
                          {wishlistCount > 0 && (
                            <motion.span
                              className="absolute top-4 -right-5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center "
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500 }}
                            >
                              {wishlistCount}
                            </motion.span>
                          )}
                        </Link>
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <Link
                          to="/cart"
                          onClick={handleNavigation}
                          className="relative p-2 text-gray-600 hover:text-amber-700 transition-all duration-200"
                        >
                          {cartCount > 0 ? (
                            <FaShoppingCart size={20} className="text-red-500" />
                          ) : (
                            <ShoppingCart size={20} />
                          )}
                          {cartCount > 0 && (
                            <motion.span
                              className="absolute top-4 -right-6 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500 }}
                            >
                              {cartCount}
                            </motion.span>
                          )}
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </nav>
              )}

              {/* Mobile Menu Toggle */}
              {width <= 991 && (
                <div className="flex items-center gap-3">
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Link to="/account" onClick={handleNavigation} className="p-2">
                      <User size={20} />
                    </Link>
                  </motion.div>
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Link to="/wishlist" onClick={handleNavigation} className="relative p-2">
                      {wishlistCount > 0 ? (
                        <FaHeart size={20} className="text-red-500" />
                      ) : (
                        <Heart size={20} />
                      )}
                      {wishlistCount > 0 && (
                        <span className="absolute top-4 -right-6 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>
                  </motion.div>
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Link to="/cart" onClick={handleNavigation} className="relative p-2">
                      {cartCount > 0 ? (
                        <FaShoppingCart size={20} className="text-red-500" />
                      ) : (
                        <ShoppingCart size={20} />
                      )}
                      {cartCount > 0 && (
                        <span className="absolute top-4 -right-5 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                  </motion.div>
                  <motion.button
                    onClick={() => setMobileMenuOpen(true)}
                    className="p-2 text-gray-700"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Menu size={24} />
                  </motion.button>
                </div>
              )}
            </div>

            {/* Mobile Search and Pincode - Grouped together */}
            {width <= 991 && (
              <motion.div
                className="pb-2 flex flex-col gap-1"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {/* Pincode Button */}
                <div className="flex items-center justify-between">
                  <motion.button
                    className="flex items-center gap-1 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg text-amber-700 hover:from-amber-100 hover:to-amber-200 transition-all duration-200"

                  >
                    <PincodeModal
                      isOpen={modalOpen}
                      onClose={() => setModalOpen(false)}
                      pincode={pincode}
                      setPincode={setPincode}

                    />

                  </motion.button>
                </div>

                {/* Search Bar */}
                <motion.div whileHover={{ scale: 1.01 }}>
                  <ItemSearch />
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (

          <Mobilemenu onClose={() => setMobileMenuOpen(false)} cartCount={cartCount} wishlistCount={wishlistCount} ratesData={ratesData} />
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;