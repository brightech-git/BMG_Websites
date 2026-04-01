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
import { useGetProductsFilters } from "../../../hook/product/useFilterProducts";
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

  const { data: productsFilterContent, isLoading: productsFilterContentLoading, isError: productsFilterContentError } = useGetProductsFilters({isActive:true , isHeader:true});

  console.log(productsFilterContent, 'productsFilterContent');


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
                filtersData={productsFilterContent || {}}
                onFilterClick={handleFilterClick}
              />    
          </nav>



          // <div className="bg-white border-b border-gray-100 relative ">

          //   {/* Amber accent line on top */}
          //   <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

          //   {/* Strip */}
          //   <div className="flex items-stretch justify-center h-11 overflow-visible text-[16px] ">

          //     {/* HOME */}
          //     <Link
          //       to="/"
          //       onClick={handleNavigation}
          //       className={`relative flex items-center px-5 h-full  font-medium tracking-wide whitespace-nowrap no-underline transition-colors duration-200 group
          //         ${location.pathname === "/" ? "text-amber-700" : "text-stone-700 hover:text-amber-700"}`}
          //     >
          //       Home
          //       <span className={`absolute bottom-0 left-5 right-5 h-0.5 bg-amber-600 rounded-full transition-transform duration-200 origin-center
          //         ${location.pathname === "/" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
          //       />
          //     </Link>

          //     {/* Divider */}
          //     <span className="self-center w-px h-4 bg-gray-200 flex-shrink-0" />

          //     {/* Divider */}
          //     <span className="self-center w-px h-4 bg-gray-200 flex-shrink-0" />

          //     {/* DYNAMIC SECTIONS from API */}
          //     {menuSections.map((section, sIdx) => (
          //       <React.Fragment key={section.label}>

          //         {/* Each section = a nav entry with hover dropdown */}
          //         <div
          //           className="relative flex items-stretch flex-shrink-0 group"
          //           onMouseEnter={() => setHoveredSectionIdx(sIdx)}
          //           onMouseLeave={() => setHoveredSectionIdx(null)}
          //         >
          //           {/* Label button */}
          //           <button
          //             className="relative flex items-center gap-1 px-5 h-full font-medium tracking-wide whitespace-nowrap text-stone-700 group-hover:text-amber-700 transition-colors duration-200 bg-transparent border-none cursor-pointer"
          //           >
          //             {section.label}
          //             {section.items?.length > 0 && (
          //               <ChevronDown
          //                 size={13}
          //                 className="transition-transform duration-200 group-hover:rotate-180 flex-shrink-0"
          //               />
          //             )}
          //             {/* Underline */}
          //             <span className="absolute bottom-0 left-5 right-5 h-0.5 bg-amber-600 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center" />
          //           </button>

          //           {/* ── DROPDOWN PANEL ── */}
          //           {section.items?.length > 0 && (
          //             <div className={`
          //               absolute top-full left-1/2 -translate-x-1/2
          //               w-full bg-white
          //               border border-gray-100 border-t-2 border-t-amber-500
          //               rounded-b-xl shadow-[0_12px_40px_rgba(0,0,0,0.10)]
          //               p-3 
          //               transition-all duration-200 origin-top
          //               ${hoveredSectionIdx === sIdx
          //                 ? "opacity-100 scale-y-100 pointer-events-auto translate-y-0"
          //                 : "opacity-0 scale-y-95 pointer-events-none -translate-y-1"
          //               }
          //             `}>



          //               {/* Items grid */}
          //               <div className="flex flex-col gap-2">
          //                 {section.items.map((item, iIdx) => (
          //                   <button
          //                     key={iIdx}
          //                     onClick={() => handleCategoryClick(item.keyName, item.keyValue)}
          //                     className="group/item flex flex-row items-center gap-2 p-2 rounded-lg border border-transparent hover:border-amber-100 hover:bg-amber-50 transition-all duration-150 cursor-pointer bg-transparent"
          //                   >
          //                     {/* Circular image */}
          //                     <div className="w-8 h-8 overflow-hidden bg-amber-50 flex items-center justify-center flex-shrink-0 group-hover/item:border-amber-400 transition-colors duration-150">
          //                       {item.image ? (
          //                         <img
          //                           src={`${baseUrl}${item.image}`}
          //                           alt={item.name || item.label}
          //                           className="w-full h-full object-cover"
          //                           onError={(e) => {
          //                             e.target.onerror = null;
          //                             e.target.src = "/fallback-image.jpg";
          //                           }}
          //                         />
          //                       ) : (
          //                         <span className="text-amber-400 text-[14px] font-semibold">
          //                           {(item.name || item.label || "?").charAt(0).toUpperCase()}
          //                         </span>
          //                       )}
          //                     </div>

          //                     {/* Label */}
          //                     <span className="text-[13px] font-medium text-stone-700 group-hover/item:text-amber-700 text-center leading-tight transition-colors duration-150">
          //                       {item.name || item.label}
          //                     </span>
          //                   </button>
          //                 ))}
          //               </div>

          //               {/* View all */}
          //               <div className="flex justify-end mt-3 pt-2.5 border-t border-gray-100">
          //                 <button
          //                   onClick={() => {
          //                     navigate("/products-page");
          //                     setHoveredSectionIdx(null);
          //                   }}
          //                   className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 hover:text-amber-800 tracking-wide transition-colors duration-150 bg-transparent border-none cursor-pointer group/va"
          //                 >
          //                   View all {section.label}
          //                   <ChevronDown
          //                     size={12}
          //                     className="-rotate-90 group-hover/va:translate-x-0.5 transition-transform duration-150"
          //                   />
          //                 </button>
          //               </div>
          //             </div>
          //           )}
          //         </div>

          //         {/* Divider between sections */}
          //         {sIdx < menuSections.length - 1 && (
          //           <span className="self-center w-px h-4 bg-gray-200 flex-shrink-0" />
          //         )}
          //       </React.Fragment>
          //     ))}
          //   </div>
          // </div>
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
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;