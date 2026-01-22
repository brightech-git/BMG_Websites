// src/components/layouts/Header.js
import React, { useState, useEffect, Fragment } from "react";
import { Link, useHistory ,useLocation} from "react-router-dom";
import classNames from "classnames";
import { ChevronDown, ShoppingCart, Menu, User, Heart, Video } from "lucide-react";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import "../../assets/css/header.css";
import Canvas from "./Canvas";
import Mobilemenu from "./Mobilemenu";
import Logo from "./logo.png";
import ItemSearch from "./Search";
import useScreenWidth from "./useScreenWidth";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/userSlice";
import { useFavorites } from "../../hook/favorites/useFavoritesQuery";
import { useCart } from "../../hook/cart/useCartQuery";
import { useRatesQuery } from "../../hook/rate/useRatesQuery"; // Add this import
import './Header.css';
import { useHeaderData } from "../../hook/header/useNavData";
import { motion, AnimatePresence } from "framer-motion";
import { useCompanyDetails } from "../../context/clientDetails/clientDetialContext";
import silvericon from '../../assets/videos/silverIcon.png';
import goldicon from '../../assets/videos/silverIcon.png';


const Header = ({ isAuthenticated }) => {
  const width = useScreenWidth();
  const history = useHistory();
  const [isTop, setIsTop] = useState(false);
  const [classmethod, setClassmethod] = useState(false);
  const [togglemethod, setTogglemethod] = useState(false);
  const [togglecart, setTogglecart] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showRates, setShowRates] = useState(false); // State to toggle rates display
  const dispatch = useDispatch();
  const { data } = useHeaderData();
  const [isScrolled, setIsScrolled] = useState(false);
  const [open ,setOpen] =useState(false);
  const { details } = useCompanyDetails();
const location =useLocation();
  const getMetalIcon = (key) => {
    const k = key.toLowerCase();
    console.log(k,'rates')
    if (k.includes("silver")) return silvericon ;
    if (k.includes("gold")) return goldicon ;
    return "/icons/gold.png"; // deault gold
  };
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const companyData = details ||{};
  console.log(companyData, 'detailsAboutcompany');
  const NavData = data
  //console.log('NacData', NavData)

  const baseUrl = "https://app.bmgjewellers.com"

  // Add rates query
  const {
    data: ratesData,
    isLoading: ratesLoading,
    error: ratesError,
  } = useRatesQuery();

  const {
    data: favoritesData,
    error: favoritesError,
    refetch: refetchFavorites,
    isLoading: favoritesLoading,
  } = useFavorites({ enabled: isAuthenticated });

  const {
    cartItems,
    error: cartError,
    isLoading: cartLoading,
  } = useCart({
    enabled: isAuthenticated,
  });

  const wishlistCount = favoritesLoading
    ? 0
    : isAuthenticated && Array.isArray(favoritesData?.data)
      ? favoritesData.data.length
      : 0;

  const cartCount = cartLoading
    ? 0
    : isAuthenticated && Array.isArray(cartItems?.data)
      ? cartItems.data.length
      : 0;

  const addClass = () => setClassmethod(true);
  const removeClass = () => setClassmethod(false);
  const toggleClass = () => setTogglemethod((prev) => !prev);
  const toggleCartm = () => setTogglecart((prev) => !prev);

  const headerNavData = NavData || {
    shopId: 2,
    menuSections: [
      {
        label: "Shop by Category",
        items: [
          {
            name: "Rings",
            value: "rings",
            keyName: "itemCtrName",
            keyValue: "rings",
            image: "/images/categories/rings.jpg",
          },
          {
            name: "Necklaces",
            value: "necklaces",
            keyName: "itemCtrName",
            keyValue: "necklaces",
            image: "/images/categories/necklaces.jpg",
          },
          {
            name: "Bracelets",
            value: "bracelets",
            keyName: "itemCtrName",
            keyValue: "bracelets",
            image: "/images/categories/bracelets.jpg",
          },
          {
            name: "Earrings",
            value: "earrings",
            keyName: "itemCtrName",
            keyValue: "earrings",
            image: "/images/categories/earrings.jpg",
          },
        ],
      },
      {
        label: "Shop by Price",
        items: [
          {
            label: "Under ₹199",
            keyName: "maxGrandTotal",
            keyValue: 199,
            image: "/images/price/199.jpg",
          },
          {
            label: "Under ₹299",
            keyName: "maxGrandTotal",
            keyValue: 299,
            image: "/images/price/299.jpg",
          },
          {
            label: "Under ₹399",
            keyName: "maxGrandTotal",
            keyValue: 399,
            image: "/images/price/399.jpg",
          },
          {
            label: "Under ₹599",
            keyName: "maxGrandTotal",
            keyValue: 599,
            image: "/images/price/599.jpg",
          },
        ],
      },
      {
        label: "Shop by Gender",
        items: [
          {
            name: "Men",
            value: "men",
            keyName: "gender",
            keyValue: "men",
            image: "/images/gender/men.jpg",
          },
          {
            name: "Women",
            value: "women",
            keyName: "gender",
            keyValue: "women",
            image: "/images/gender/women.jpg",
          },
          {
            name: "Kids",
            value: "kids",
            keyName: "gender",
            keyValue: "kids",
            image: "/images/gender/kids.jpg",
          },
        ],
      },
      {
        label: "Featured Collections",
        items: [
          {
            name: "Trending",
            keyName: "top_trending",
            keyValue: "true",
            image: "/images/collections/trending.jpg",
          },
          {
            name: "New Arrivals",
            keyName: "new_arrivals",
            keyValue: "true",
            image: "/images/collections/new_arrivals.jpg",
          },
          {
            name: "Best Designs",
            keyName: "best_design",
            keyValue: "true",
            image: "/images/collections/best_design.jpg",
          },
          {
            name: "Featured",
            keyName: "featured",
            keyValue: "true",
            image: "/images/collections/featured.jpg",
          },
        ],
      },
      {
        label: "Special Editions",
        items: [
          {
            name: "Bridal",
            keyName: "itemCtrName",
            keyValue: "bridal",
            image: "/images/special/bridal.jpg",
          },
          {
            name: "Clearance",
            keyName: "itemCtrName",
            keyValue: "clearance",
            image: "/images/special/clearance.jpg",
          },
        ],
      },
      {
        label: "Current Offers",
        items: [
          {
            name: "50% Off",
            keyName: "subItemName",
            keyValue: "matching sets",
            image: "/images/offers/50percent.jpg",
          },
          {
            name: "Buy 1 Get 1",
            keyName: "subItemName",
            keyValue: "Buy 2 Get 1",
            image: "/images/offers/b1g1.jpg",
          },
        ],
      },
    ],
  };


  const handleLogout = (e) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(logout()); // Clear user state
    history.push("/login"); // Navigate to login page
    window.location.reload(); // Reset app state (optional)
  };



  const handleClick = (keyName, keyValue) => {
    const queryParams = new URLSearchParams();
    queryParams.append(keyName, keyValue);
    history.push(`/products-page?${queryParams.toString()}`);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsTop(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const [animationType, setAnimationType] = useState('pulse'); // Default animation
  const [isHovered, setIsHovered] = useState(false);

  // Optional: Cycle through animations for demonstration
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationType(prev => {
        const animations = ['pulse', 'glow', 'bounce', 'shake', 'color-change'];
        const currentIndex = animations.indexOf(prev);
        return animations[(currentIndex + 1) % animations.length];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Fragment>
      <header
        className={`header-three header-absolute sticky-header sigma-header ${isTop ? "sticky-active" : ""
          }`}
        id="header"
      >
        {width > 991 && (
          <div className={isScrolled ? "header-top-hide":"header-top"}>
        
              <div className="header-top-content">

                <div
                  className={`welcome-section welcome-${animationType} ${isHovered ? 'welcome-hover' : ''}`}
                  onClick={() => history.push("/appointment")}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <Video size={22} />
                  <span className="welcome-text">
                    BMG Live
                  </span>

                </div>
              


               

                <div className="header-top-right-container">
                <div className="rates-horizontal-container">
                  {ratesData && Object.entries(ratesData).map(([key, value], index) => (
                    <div key={index} className="rate-item-horizontal">
                      <img  src={getMetalIcon(key)} className="rate-icon coin " alt="" />
                      
                      <span className="rate-text primary-text">
                        {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        &nbsp;- ₹ {value}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="auth-actions">
                  {isAuthenticated ? (
                    <div className="authLogin-button logout-trigger" onClick={handleLogout}>
                      <span className="auth-icon logout-icon"></span>
                      <span className="auth-text">Log Out</span>
                    </div>
                  ) : (
                    <div
                      className="authLogin-button login-trigger"
                      onClick={() => history.push("/login")}
                    >
                      <span className="auth-icon login-icon">🔐</span>
                      <span className="auth-text">Log In</span>
                    </div>

                  )}
                </div>
              </div>
              </div>
         
          </div>
        )}
        <div className={`${isScrolled ? "main-header" : ""}`}>
          <div className="main-menu-area">
          
              <div className="nav-container d-flex align-items-center  justify-content-between">
                <div className="nav-menu d-lg-flex align-items-center justify-content-between">
                  <div className="navbar-close">

                  </div>
                  <div className="site-logo site-logo-text">
                    <Link to="/">
                      <img
                        src={Logo}
                        alt="Diamond Icon"
                        style={{
                          width: "100px",
                          height: "auto",
                          marginRight: "10px",
                        }}
                      />
                    </Link>
                  </div>
                  <div className="sigma-header-nav">
                    <div className="container">
                      <div className="sigma-header-nav-inner">
                        <nav>
                          <ul className="sigma-main-menu">
                            <li className={location.pathname ==="/" ? "menu-item-active":"menu-item"}>
                              <Link to="/">Home</Link>
                            </li>


                          <li className={location.pathname === "/#" ? "menu-item-active":"menu-item  menu-item-has-children menu-item-has-megamenu"}>
                              <Link to="#">
                                Categories{" "}
                                <ChevronDown size={16} className="dropdown-icon" />
                              </Link>

                              <div className="sub-menu">
                                <div className="container">
                                  <div className="row">
                                    {/* Left side nav tabs */}
                                    <div className="col-lg-3">
                                      <ul className="sigm-megamenu-nav nav nav-tabs">
                                        {headerNavData?.menuSections?.map((section, index) => (
                                          <li className="nav-item" key={section.label}>
                                            <Link
                                              to="#"
                                              className={`nav-link ${activeTab === index ? "active" : ""
                                                }`}
                                              onClick={() => setActiveTab(index)}
                                              onMouseEnter={() => setActiveTab(index)}
                                            >
                                              {section.label}
                                            </Link>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>

                                    {/* Right side tab content */}
                                    <div className="col-lg-9">
                                      <div className="tab-content">
                                        {headerNavData?.menuSections?.map((section, index) => (
                                          <div
                                            className={`tab-pane fade ${activeTab === index ? "show active" : ""
                                              }`}
                                            id={`tab${index + 1}`}
                                            key={section.label}
                                          >
                                            <div className="row g-1">
                                              {section.items?.map((item, idx) => (
                                                <div
                                                  className="col-6 col-sm-4 col-md-3 col-lg-2"
                                                  key={idx}
                                                >
                                                  <div
                                                    className="header-enhanced-card"
                                                    onClick={() =>
                                                      handleClick(item.keyName, item.keyValue)
                                                    }
                                                  >
                                                    {item.image && (
                                                      <div className="menu-card-img-wrapper">
                                                        <img
                                                          src={`${baseUrl}${item.image}`}
                                                          alt={item.name || item.label}
                                                          className="menu-card-img"
                                                          onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = "/fallback-image.jpg";
                                                          }}
                                                        />

                                                      </div>
                                                    )}
                                                    {/* <span className="menu-card-label">
                                                      {item.name || item.label}
                                                    </span> */}
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>


                          <li className={location.pathname === "/products-page" ? "menu-item-active":"menu-item"}>
                              <Link to="/products-page">Shop</Link>
                            </li>
                          <li className={location.pathname === "/contactstore" ? "menu-item-active" : "menu-item"}>
                              <Link to="/contactstore">Contact</Link>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    </div>
                  </div>
                 
                  <div  className="headersearch">
                    <ItemSearch />
                  </div>
                </div>
                <div className="menu-right-buttons">
                  <div className="login-btn">
                    <Link to="/account">
                      <User size={20} strokeWidth={1.8} />
                    </Link>
                  </div>
                  <div className="login-btn">
                    <Link to="/wishlist">
                      {wishlistCount > 0 ? (
                        <FaHeart size={20} color={"#fa858fff"} />
                      ) : (
                        <Heart size={20} strokeWidth={1.8} />
                      )}
                      {wishlistCount > 0 && (
                        <span className={`icon-badge ${isTop ? "sticky-active" : ""
                          }`}>{wishlistCount}</span>
                      )}
                    </Link>
                  </div>

                  <div className="login-btn">
                    <Link to="/cart">
                      {cartCount > 0 ? (
                        <FaShoppingCart size={20} color={"#f78790ff"} />
                      ) : (
                        <ShoppingCart size={20} strokeWidth={1.8} />
                      )}
                      {cartCount > 0 && (
                        <span className={`cart-icon-badge ${isTop ? "sticky-active" : ""
                          }`}>{cartCount}</span>
                      )}
                    </Link>
                  </div>

                  <div className="navbar-toggler" onClick={toggleClass}>
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
           
          </div>
        </div>
        <div className="sigma-mobile-header">
          <div className="sigma-mobile-header-inner">
            <div className="site-logo site-logo-text">
              <Link to="/home">
                <img
                  src={Logo}
                  alt="Diamond Icon"
                  style={{
                    width: "100px",
                    height: "auto",
                    marginRight: "10px",
                  }}
                />
              </Link>
            </div>
            <div className="search-container">
              {width >= 768 && (
                <div
                  className="search-item"
                  style={{ marginLeft: "-300px", marginRight: "20px" }}
                >
                  <ItemSearch />
                </div>
              )}
            </div>
            <div className="login-btns">
              <Link to="/account">
                <User size={16} strokeWidth={1.8} />
              </Link>
            </div>
            <div className="login-btns">
              <Link to="/wishlist">
                {wishlistCount > 0 ? (
                  <FaHeart size={20} color={"#f78790ff"} />
                ) : (
                  <Heart size={20} strokeWidth={1.8} />
                )}
                {wishlistCount > 0 && (
                  <span className={`icon-badge ${isTop ? "sticky-active" : ""
                    }`}>{wishlistCount}</span>
                )}
              </Link>
            </div>

            <div className="login-btns">
              <Link to="/cart">
                {cartCount > 0 ? (
                  <FaShoppingCart size={20} color={"#f78790ff"} />
                ) : (
                  <ShoppingCart size={20} strokeWidth={1.8} />
                )}
                {cartCount > 0 && (
                  <span className={`cart-icon-badge ${isTop ? "sticky-active" : ""
                    }`}>{cartCount}</span>
                )}
              </Link>
            </div>

            <div className="sigma-hamburger-menu" onClick={toggleClass}>
              <Menu
                size={20}
                strokeWidth={1.8}
                className={classNames("lucide-hamburger", {
                  active: togglemethod,
                })}
              />
            </div>
          </div>
        </div>
        {width < 768 && (
          <div
            style={{
              background: "#fff",
              justifyContent: "center",
              alignItems: "center",
              padding: "5px 25px 5px 10px",
              width: "105%",
              margin: "0px -10px 0px -10px",
            }}
            className="search-items"
          >
            <ItemSearch />
          </div>
        )}
        <AnimatePresence>
          {togglemethod && (
            <>
              {/* Background Overlay */}
              <motion.div
                key="overlay"
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                onClick={() => setTogglemethod(false)}
              />

              {/* Sidebar */}
              <motion.aside
                key="mobile-menu"
                className="fixed top-0 left-0 h-full w-[70%] sm:w-[60%]  z-[70] shadow-2xl overflow-y-auto"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{
                  type: "spring",
                  stiffness: 90,
                  damping: 15,
                  mass: 0.7,
                }}
              >
                <Mobilemenu onClose={() => setTogglemethod(false)} />
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </header>
    
   
    </Fragment>
  );
};

export default Header;
