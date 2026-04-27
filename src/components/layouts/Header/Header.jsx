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
} from "lucide-react";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Mobilemenu from "../Mobilemenu";
import Logo from "../../../assets/icons/logo.png";
import ItemSearch from "../Search";
import useScreenWidth from "./../useScreenWidth";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/slices/userSlice";
import { useFavorites } from "../../../hook/favorites/useFavoritesQuery";
import { useCart } from "../../../hook/cart/useCartQuery";
import { useRatesQuery } from "../../../hook/rate/useRatesQuery";
import PincodeModal from "../DeliveryPincodeHeader";
import useHeaderNavByShopId from "../headerNavByShopId";
import "../HeaderScroll.css";
import RatesDropdown from "../RatesDropdown";
import { usePincode } from "../../../context/pinocde/PincodeContext";
import { queryClient } from "../../../component/reactQuery/queryClient";
import LogoutModal from "../../../component/logout/Logout";
import { useGetProductsFilters, useGetHeaderFilters } from "../../../hook/product/useFilterProducts";
import { ProductFiltersNav } from "./ProductFiltersNav";


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
  const [isCategoriesHovered, setIsCategoriesHovered] = useState(false);
  const [shouldShow, setShouldShow] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [hoveredSectionIdx, setHoveredSectionIdx] = useState(null);

  const { data: ratesData } = useRatesQuery();
  const { isLoading: favoriteLoading, favoritesCount } = useFavorites({ enabled: isAuthenticated });
  const { pincode } = usePincode();
  const { isLoading: cartLoading, cartCount } = useCart({ enabled: isAuthenticated });


  const {data : headerFitlers } =useGetHeaderFilters();

  const { data: productsFilterContent, isLoading: productsFilterContentLoading, isError: productsFilterContentError } = useGetProductsFilters({isActive:true , isHeader:true});

  console.log(headerFitlers, 'headerFitlers');


  const handleFilterClick = (filterKey, filterId, filterValue) => {
    console.log('Filter clicked:', { filterKey, filterId, filterValue });
    // Add your navigation logic here
    // navigate(`/products-page?filterIds=${filterId}`)
  };
  useEffect(() => {
    setShouldShow(true);
    setIsNavigating(false);
  }, [location.pathname]);

  useEffect(() => {
    let ticking = false;
    let lastScrollTop = 0;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          setScrollY(currentScrollY);
          if (currentScrollY === 0 || isNavigating) {
            setShouldShow(true);
          } else if (currentScrollY > 100) {
            setShouldShow(currentScrollY <= lastScrollTop);
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

  useEffect(() => {
    if (pincode) localStorage.setItem("userPincode", pincode);
  }, [pincode]);

  const handleNavigation = () => setIsNavigating(true);

  const isTopBarHidden = scrollY > 30;
  const isSticky = scrollY > 100;
  const headerTranslate = shouldShow ? 0 : -5;
  const wishlistCount = favoriteLoading ? 0 : favoritesCount;

  const handleLogout = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(logout());
    ["user", "user_token", "userMobileNumber", "pendingUser"].forEach((k) =>
      localStorage.removeItem(k)
    );
    queryClient.clear();
    navigate("/login");
  };

  const openLogoutModal = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLogoutModalOpen(true);
  };
  const closeLogoutModal = () => setIsLogoutModalOpen(false);
  const confirmLogout = () => handleLogout(new Event("submit"));

  const handleCategoryClick = (keyName, keyValue) => {
    setIsNavigating(true);
    const queryParams = new URLSearchParams();
    queryParams.append(keyName, keyValue);
    navigate(`/products-page?${queryParams.toString()}`);
    setIsCategoriesHovered(false);
    setHoveredSectionIdx(null);
  };

  const baseUrl = "https://app.bmgjewellers.com";
  const menuSections = headerNavData?.menuSections || [];

  return (
    <>
      <style>{`
        body { transition: padding-top 0.3s ease; }
        @keyframes slideDown { from { transform: translateY(-100%); } to { transform: translateY(0); } }
        @keyframes slideUp { from { transform: translateY(0); } to { transform: translateY(-100%); } }
      `}</style>

      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-20 transition-all duration-300 ease-out ${isSticky
          ? "bg-white shadow-lg"
          : "bg-gradient-to-b from-white/95 via-white/90 to-white"
          }`}
        style={{
          transform: `translateY(${headerTranslate}px)`,
          backdropFilter: "blur(10px)",
        }}
      >
        {/* ── TOP BAR ── */}
        <motion.div
          className={`bg-gradient-to-r from-orange-600 to-orange-500 p-1 text-white overflow-hidden ${width > 991 ? "" : "hidden"
            }`}
          animate={{
            height: isTopBarHidden ? 0 : "auto",
            opacity: isTopBarHidden ? 0 : 1,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="mx-auto px-2 py-2">
            <div className="flex items-center justify-between">
              <motion.button
                onClick={() => { setIsNavigating(true); navigate("/appointment"); }}
                className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-amber-700 to-amber-600 rounded-full hover:from-amber-600 hover:to-amber-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Video size={18} className="animate-pulse" />
                <span className="font-semibold tracking-wide">BMG Live</span>
              </motion.button>

              <div className="flex items-center gap-6">
                <RatesDropdown ratesData={ratesData} />
                <div>
                  {isAuthenticated ? (
                    <>
                      <motion.button
                        onClick={openLogoutModal}
                        className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-red-600 to-red-500 rounded-full hover:from-red-500 hover:to-red-400 transition-all duration-300 hover:scale-105 active:scale-95"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <LogOut size={16} />
                        <span className="font-medium">Log Out</span>
                      </motion.button>
                      <LogoutModal
                        isOpen={isLogoutModalOpen}
                        onClose={closeLogoutModal}
                        onConfirm={confirmLogout}
                        title="Ready to Leave?"
                        message="Are you sure you want to logout? You'll need to login again to access your account."
                        confirmText="Yes, Logout"
                        cancelText="Stay Logged In"
                        size="md"
                        confirmButtonClass="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400"
                        icon={<LogOut className="text-4xl text-red-500" />}
                      />
                    </>
                  ) : (
                    <motion.button
                      onClick={() => { setIsNavigating(true); navigate("/login"); }}
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

        {/* ── MAIN HEADER ── */}
        <div
          className={`border-b border-gray-200/50 transition-all duration-300 ${isSticky ? "shadow-md" : ""
            }`}
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-1 ">

              {/* Logo */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Link to="/" onClick={handleNavigation} className="flex items-center flex-shrink-0">
                  <img
                    src={Logo}
                    alt="BMG Jewellers"
                    className="w-28 h-auto transition-all duration-300"
                  />
                </Link>
              </motion.div>

              {/* Desktop Nav */}
              {width > 991 && (
                <nav className="flex-1 flex items-center justify-between ml-8">
                  {/* Left links */}

                  <motion.div className="w-64 sm:w-[100%] md:w-[60%] lg:w-[60%] z-[99]" whileHover={{ scale: 1.02 }}>
                    <ItemSearch />
                  </motion.div>
                  {/* Right: Pincode + Search + Icons */}
                  <div className="flex items-center gap-2">
                    <PincodeModal />

                    <div className="flex items-center gap-3">
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <Link to="/account" onClick={handleNavigation} className="p-2 text-gray-600 hover:text-amber-700 transition-all duration-200">
                          <User size={20} />
                        </Link>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <Link to="/wishlist" onClick={handleNavigation} className="relative p-2 text-gray-600 hover:text-amber-700 transition-all duration-200">
                          {wishlistCount > 0 ? <FaHeart size={20} className="text-red-500" /> : <Heart size={20} />}
                          {wishlistCount > 0 && (
                            <motion.span
                              className="absolute top-4 -right-5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
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
                        <Link to="/cart" onClick={handleNavigation} className="relative p-2 text-gray-600 hover:text-amber-700 transition-all duration-200">
                          {cartCount > 0 ? <FaShoppingCart size={20} className="text-red-500" /> : <ShoppingCart size={20} />}
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

              {/* Mobile Toggle */}
              {width <= 991 && (
                <div className="flex items-center gap-3">
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Link to="/account" onClick={handleNavigation} className="p-2">
                      <User size={20} />
                    </Link>
                  </motion.div>
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Link to="/wishlist" onClick={handleNavigation} className="relative p-2">
                      {wishlistCount > 0 ? <FaHeart size={20} className="text-red-500" /> : <Heart size={20} />}
                      {wishlistCount > 0 && (
                        <span className="absolute top-4 -right-6 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>
                  </motion.div>
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Link to="/cart" onClick={handleNavigation} className="relative p-2">
                      {cartCount > 0 ? <FaShoppingCart size={20} className="text-red-500" /> : <ShoppingCart size={20} />}
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

            {/* Mobile Search + Pincode */}
            {width <= 991 && (
              <motion.div
                className="pb-2 flex flex-col gap-1"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <motion.button className="flex items-center gap-1 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg text-amber-700 hover:from-amber-100 hover:to-amber-200 transition-all duration-200">
                    <PincodeModal />
                  </motion.button>
                </div>
                <motion.div whileHover={{ scale: 1.01 }}>
                  <ItemSearch />
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════
            SECONDARY NAV STRIP — Desktop only
            Home · Shop · [API section labels with dropdowns]
            No wrap, no break, centered, pure Tailwind
        ══════════════════════════════════════════ */}

        {width > 991 && (
          <nav className="w-full flex justify-center  bg-white">
            
              <ProductFiltersNav
            
                headers={headerFitlers?.headers || []}
                // onFilterClick={handleFilterClick}
              />    
          </nav>

        )}
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <Mobilemenu
            onClose={() => setMobileMenuOpen(false)}
            cartCount={cartCount}
            wishlistCount={wishlistCount}
            ratesData={ratesData}
            headers={headerFitlers?.headers || []}
            // filtersData={productsFilterContent}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;