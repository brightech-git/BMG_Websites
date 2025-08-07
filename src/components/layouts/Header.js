// src/components/layouts/Header.js
import React, { useState, useEffect, Fragment } from 'react';
import { Link, useHistory } from 'react-router-dom';
import classNames from 'classnames';
import { ChevronDown, ShoppingCart, Menu, User, Heart} from 'lucide-react';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import '../../assets/css/header.css';
import Canvas from './Canvas';
import Mobilemenu from './Mobilemenu';
import Logo from './logo.png';
import ItemSearch from './Search';
import useScreenWidth from './useScreenWidth';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/userSlice';
import { useFavorites } from '../../hook/favorites/useFavoritesQuery';
import { useCart } from '../../hook/cart/useCartQuery';


const Header = ({ isAuthenticated }) => {
  const width = useScreenWidth();
  const history = useHistory();
  const [isTop, setIsTop] = useState(false);
  const [classmethod, setClassmethod] = useState(false);
  const [togglemethod, setTogglemethod] = useState(false);
  const [togglecart, setTogglecart] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const dispatch = useDispatch();



  const {
    data: favoritesData,
    error: favoritesError,
    refetch: refetchFavorites,
    isLoading: favoritesLoading,
  } = useFavorites({ enabled: isAuthenticated });

  const { cartItems, error: cartError, isLoading: cartLoading } = useCart({
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

    const headerNavData = {
        shopId: 2,
        menuSections: [
            {
                label: "Shop by Category",
                items: [
                    { name: "Rings", value: "rings", keyName: "itemName", keyValue: "rings", image: "/images/categories/rings.jpg" },
                    { name: "Necklaces", value: "necklaces", keyName: "itemName", keyValue: "necklaces", image: "/images/categories/necklaces.jpg" },
                    { name: "Bracelets", value: "bracelets", keyName: "itemName", keyValue: "bracelets", image: "/images/categories/bracelets.jpg" },
                    { name: "Earrings", value: "earrings", keyName: "itemName", keyValue: "earrings", image: "/images/categories/earrings.jpg" }
                ]
            },
            {
                label: "Shop by Price",
                items: [
                    { label: "Under ₹199", keyName: "maxGrandTotal", keyValue: 199, image: "/images/price/199.jpg" },
                    { label: "Under ₹299", keyName: "maxGrandTotal", keyValue: 299, image: "/images/price/299.jpg" },
                    { label: "Under ₹399", keyName: "maxGrandTotal", keyValue: 399, image: "/images/price/399.jpg" },
                    { label: "Under ₹599", keyName: "maxGrandTotal", keyValue: 599, image: "/images/price/599.jpg" }
                ]
            },
            {
                label: "Shop by Gender",
                items: [
                    { name: "Men", value: "men", keyName: "gender", keyValue: "men", image: "/images/gender/men.jpg" },
                    { name: "Women", value: "women", keyName: "gender", keyValue: "women", image: "/images/gender/women.jpg" },
                    { name: "Kids", value: "kids", keyName: "gender", keyValue: "kids", image: "/images/gender/kids.jpg" }
                ]
            },
            {
                label: "Featured Collections",
                items: [
                    { name: "Trending", keyName: "top_trending", keyValue: "true", image: "/images/collections/trending.jpg" },
                    { name: "New Arrivals", keyName: "new_arrivals", keyValue: "true", image: "/images/collections/new_arrivals.jpg" },
                    { name: "Best Designs", keyName: "best_design", keyValue: "true", image: "/images/collections/best_design.jpg" },
                    { name: "Featured", keyName: "featured", keyValue: "true", image: "/images/collections/featured.jpg" }
                ]
            },
            {
                label: "Special Editions",
                items: [
                    { name: "Bridal", keyName: "itemName", keyValue: "bridal", image: "/images/special/bridal.jpg" },
                    { name: "Clearance", keyName: "itemName", keyValue: "clearance", image: "/images/special/clearance.jpg" }
                ]
            },
            {
                label: "Current Offers",
                items: [
                    { name: "50% Off", keyName: "subItemName", keyValue: "matching sets", image: "/images/offers/50percent.jpg" },
                    { name: "Buy 1 Get 1", keyName: "subItemName", keyValue: "Buy 2 Get 1", image: "/images/offers/b1g1.jpg" }
                ]
            },
            {
                label: "Gift Ideas",
                items: [
                    { name: "For Him", keyName: "giftIdeas", keyValue: "for_him", image: "/images/giftIdeas/for_him.jpg" },
                    { name: "For Her", keyName: "giftIdeas", keyValue: "for_her", image: "/images/giftIdeas/for_her.jpg" }
                ]
            }
        ]
    };
  const handleLogout = () => {
    dispatch(logout());         // Clear user state
    history.push('/login');     // Navigate to login
    window.location.reload();   // Force reload to reset app state
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
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Fragment>
      <header className={`header-three header-absolute sticky-header sigma-header ${isTop ? 'sticky-active' : ''}`} id="header">
        {width>=992 &&(<div className="header-top">
          <div className="container-fluid container-custom-three">
            <div className="d-md-flex align-items-center justify-content-between px-4">
              <p className="welcome-text">Free Shipping For All Products</p>
              <ul className="header-top-info">
                <li>Today's Deal</li>
                <li>Great Deal</li>
                {isAuthenticated ? (<li onClick={handleLogout}> LogOut</li>):( <li onClick={()=>history.push('/login')}>LogIn</li>)} 
              </ul>
            </div>
          </div>
        </div>)}
        <div className="main-menu-area sticky-header">
          <div className="container-fluid p-0">
            <div className="nav-container d-flex align-items-center justify-content-between">
              <div className="nav-menu d-lg-flex align-items-center justify-content-between">
                <div className="navbar-close">
                  <div className="cross-wrap">
                    <span className="top" />
                    <span className="bottom" />
                  </div>
                </div>
                <div className="sigma-header-nav">
                  <div className="container">
                    <div className="sigma-header-nav-inner">
                      <nav>
                        <ul className="sigma-main-menu">
                          <li className="menu-item">
                            <Link to="/">Home</Link>
                          </li>
                          <li className="menu-item menu-item-has-children menu-item-has-megamenu">
                            <Link to="#">
                              Categories <ChevronDown size={16} className="dropdown-icon" />
                            </Link>
                            <div className="sub-menu">
                              <div className="container">
                                <div className="row">
                                  <div className="col-lg-3">
                                    <ul className="sigm-megamenu-nav nav nav-tabs">
                                      {headerNavData.menuSections.map((section, index) => (
                                        <li className="nav-item" key={section.label}>
                                          <Link
                                            to="#"
                                            className={`nav-link ${activeTab === index ? 'active' : ''}`}
                                            onClick={() => setActiveTab(index)}
                                            onMouseEnter={() => setActiveTab(index)}
                                          >
                                             {section.label}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div className="col-lg-9">
                                    <div className="tab-content">
                                      {headerNavData.menuSections.map((section, index) => (
                                        <div
                                          className={`tab-pane fade ${activeTab === index ? 'show active' : ''}`}
                                          id={`tab${index + 1}`}
                                          key={section.label}
                                        >
                                          <div className="row g-2"> {/* Use g-2 or g-1 for tighter spacing */}
                                            {section.items.map((item, idx) => (
                                              <div className="col-6 col-sm-3 col-md-2" key={idx}>
                                                <div
                                                  className="enhanced-card"
                                                  onClick={() => handleClick(item.keyName, item.keyValue)}
                                                >
                                                  {item.image && (
                                                    <div className="menu-card-img-wrapper">
                                                      <img
                                                        src={item.image}
                                                        alt={item.name || item.label}
                                                        className="menu-card-img"
                                                        onError={(e) => {
                                                          e.target.onerror = null;
                                                          e.target.src = '/fallback.jpg';
                                                        }}
                                                      />
                                                    </div>
                                                  )}
                                                  <p className="menu-card-label">{item.name || item.label}</p>
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
                            <Link to="/shop-left">
                              Shop 
                            </Link>
                         
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
                        width: '100px',
                        height: 'auto',
                        marginRight: '10px',
                      }}
                    />
                    
                  </Link>
                </div>
                <div style={{ marginLeft: '20px' }} className="headersearch">
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
                      <FaHeart size={20} color={'#fa858fff'} />
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
                      <FaShoppingCart size={20} color={'#f78790ff'} />
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
        <div className="sigma-mobile-header">
          <div className="sigma-mobile-header-inner">
            <div className="site-logo site-logo-text">
              <Link to="/">
                <img
                  src={Logo}
                  alt="Diamond Icon"
                  style={{
                    width: '100px',
                    height: 'auto',
                    marginRight: '10px',
                  }}
                />
                
              </Link>
            </div>
            <div className="search-container" >
              {width >= 768 && (
                <div className="search-item" style={{ marginLeft: '-300px', marginRight: '20px' }}>
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
                  <FaHeart size={20} color={'#f78790ff'} />
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
                  <FaShoppingCart size={20} color={ '#f78790ff' } />
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
                className={classNames('lucide-hamburger', { active: togglemethod })}
              />
            </div>
          </div>
        </div>
        {width < 768 && (
          <div
            style={{ background: '#f6f5f0', justifyContent: 'center', alignItems: 'center', padding: '5px 25px 5px 10px' ,width:'105%', margin:'0px -10px 0px -10px'}}
            className="search-items"
          >
            <ItemSearch />
          </div>
        )}
        <aside className={classNames('sigma-mobile-menu', { active: togglemethod })}>
          <Mobilemenu />
        </aside>
      </header>
      <div className={classNames('offcanvas-wrapper', { 'show-offcanvas': classmethod })}>
        <div className={classNames('offcanvas-overly', { 'show-overly': classmethod })} onClick={removeClass} />
        <div className="offcanvas-widget">
          <Link to="#" className="offcanvas-close" onClick={removeClass}>
            <i className="fal fa-times" />
          </Link>
          <Canvas />
        </div>
      </div>
    </Fragment>
  );
};

export default Header;