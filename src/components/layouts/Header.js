// src/components/layouts/Header.js
import React, { useState, useEffect, Fragment } from "react";
import { Link, useHistory } from "react-router-dom";
import classNames from "classnames";
import { ChevronDown, ShoppingCart, Menu, User, Heart ,Video} from "lucide-react";
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
  const { data} = useHeaderData();
  const NavData = data
  console.log('NacData',NavData)

  const baseUrl= "https://app.bmgjewellers.com"

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
            keyName: "itemName",
            keyValue: "rings",
            image: "/images/categories/rings.jpg",
          },
          {
            name: "Necklaces",
            value: "necklaces",
            keyName: "itemName",
            keyValue: "necklaces",
            image: "/images/categories/necklaces.jpg",
          },
          {
            name: "Bracelets",
            value: "bracelets",
            keyName: "itemName",
            keyValue: "bracelets",
            image: "/images/categories/bracelets.jpg",
          },
          {
            name: "Earrings",
            value: "earrings",
            keyName: "itemName",
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
            keyName: "itemName",
            keyValue: "bridal",
            image: "/images/special/bridal.jpg",
          },
          {
            name: "Clearance",
            keyName: "itemName",
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
    history.push(`/shop-left?${queryParams.toString()}`);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsTop(window.scrollY > 110);
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
        className={`header-three header-absolute sticky-header sigma-header ${
          isTop ? "sticky-active" : ""
        }`}
        id="header"
      >
{width >= 992 && (
  <div className="header-top">
    <div className="container-fluid container-custom-three">
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
               
               

        {/* Enhanced Precious Metals Ticker */}
        <div className="precious-metals-ticker-wrapper">
          <div className="precious-metals-ticker">
            <div className="ticker-header">
              <span className="ticker-title">Live Rates</span>
            </div>
            <div className="ticker-container">
              {ratesData && !ratesLoading && !ratesError ? (
                <div className="ticker-content">
                  {/* Duplicate content for seamless loop */}
                  {[...Array(2)].map((_, duplicateIndex) => 
                    Object.entries(ratesData).map(([key, value], index) => (
                      <div 
                        key={`${duplicateIndex}-${key}-${index}`} 
                        className="ticker-item"
                      >
                        <span
                          className={`metal-badge ${
                            key.toLowerCase().includes("silver") ? "silver" : "gold"
                          }`}
                        >
                          {/* {key.toLowerCase().includes("silver") ? "Ag" : "Au"} */}
                        </span>
                        <span className="ticker-name">
                          {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                        <span className="ticker-value">₹{value}</span>
                      </div>
                    ))
                  )}
                </div>
              ) : ratesLoading ? (
                <div className="ticker-loading">
                  <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span>Loading rates...</span>
                </div>
              ) : (
                <div className="ticker-error">
                  <span>⚠️ Unable to load rates</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div>
                 
        </div>
                
        <div className="auth-actions">
          {isAuthenticated ? (
                    <div className="auth-button logout-trigger" onClick={handleLogout}>
                      <span className="auth-icon logout-icon"></span>
                      <span className="auth-text">Log Out</span>
                    </div>
          ) : (
            <div
              className="auth-button login-trigger"
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
)}      <div className="header-main">
        <div className="main-menu-area sticky-header">
          <div className="container-fluid p-0">
            <div className="nav-container d-flex align-items-center justify-content-between">
              <div className="nav-menu d-lg-flex align-items-center justify-content-between">
                <div className="navbar-close">
                
                </div>
                <div className="sigma-header-nav">
                  <div className="container">
                    <div className="sigma-header-nav-inner">
                      <nav>
                        <ul className="sigma-main-menu">
                          <li className="menu-item">
                            <Link to="/home">Home</Link>
                          </li>
                        

                          <li className="menu-item menu-item-has-children menu-item-has-megamenu">
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
                                                  className="enhanced-card"
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
                                                  <span className="menu-card-label">
                                                    {item.name || item.label}
                                                  </span>
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


                          <li className="menu-item menu-item-has-children">
                            <Link to="/shop-left">Shop</Link>
                          </li>
                          <li className="menu-item">
                            <Link to="/contact">Contact</Link>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </div>
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
                <div style={{ marginLeft: "20px" }} className="headersearch">
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
                      <span className="icon-badge">{wishlistCount}</span>
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
                      <span className="cart-icon-badge">{cartCount}</span>
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
                  <span className="icon-badge">{wishlistCount}</span>
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
                  <span className="cart-icon-badge">{cartCount}</span>
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
              background: "#f6f5f0",
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
        {togglemethod && (
          <aside className="s active">
            <Mobilemenu onClose={() => setTogglemethod(false)} />
          </aside>
        )}
      </header>
      <div
        className={classNames("offcanvas-wrapper", {
          "show-offcanvas": classmethod,
        })}
      >
        <div
          className={classNames("offcanvas-overly", {
            "show-overly": classmethod,
          })}
          onClick={removeClass}
        />
        <div className="offcanvas-widget">
          <Link to="#" className="offcanvas-close" onClick={removeClass}>
            <i className="fal fa-times" />
          </Link>
          <Canvas />
        </div>
      </div>
      <style jsx>{`
        :root {
          --primary-hover-color: #cd865c;
          --primary-text-color: #041f60;
        }
        
        .welcome-section {
          flex: 0 0 auto;
          background-color: var(--primary-hover-color);
          padding: 0.2rem 1rem;
          border-radius: 30px;
          display: flex;
          align-items: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .welcome-text {
          color: var(--primary-text-color);
          font-size: 12px;
          font-weight: 600;
          opacity: 0.9;
          margin-left: 5px;
        }

        /* Pulse Animation */
        .welcome-pulse {
          animation: welcomePulse 2s infinite;
        }

        @keyframes welcomePulse {
          0% {
            box-shadow: 0 0 0 0 rgba(205, 134, 92, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(205, 134, 92, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(205, 134, 92, 0);
          }
        }

        /* Glow Animation */
        .welcome-glow {
          animation: welcomeGlow 2s ease-in-out infinite alternate;
        }

        @keyframes welcomeGlow {
          from {
            box-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px var(--primary-hover-color), 0 0 20px var(--primary-hover-color);
          }
          to {
            box-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px var(--primary-hover-color), 0 0 40px var(--primary-hover-color);
          }
        }

        /* Bounce Animation */
        .welcome-bounce {
          animation: welcomeBounce 2s infinite;
        }

        @keyframes welcomeBounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-5px);
          }
          60% {
            transform: translateY(-3px);
          }
        }

        /* Shake Animation */
        .welcome-shake {
          animation: welcomeShake 2s infinite;
        }

        @keyframes welcomeShake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          50% { transform: translateX(2px); }
          75% { transform: translateX(-2px); }
          100% { transform: translateX(0); }
        }

        /* Color Change Animation */
        .welcome-color-change {
          animation: welcomeColorChange 4s infinite alternate;
        }

        @keyframes welcomeColorChange {
          0% {
            background-color: var(--primary-hover-color);
          }
          100% {
            background-color: #e39f7b;
          }
        }

        /* Hover Effects */
        .welcome-section:hover {
          transform: scale(1.05);
        }

        .welcome-hover {
          animation: none !important; /* Stop animation on hover */
        }
      `}</style>
    </Fragment>
  );
};

export default Header;
