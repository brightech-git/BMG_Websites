<<<<<<< Updated upstream
// src/components/layouts/Header.js
import React, { useState, useEffect, Fragment } from 'react';
import { Link, useHistory } from 'react-router-dom';
import classNames from 'classnames';
import { ChevronDown, ShoppingCart, Menu, User, Heart } from 'lucide-react';
=======
import React, { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import $ from 'jquery';

import { ShoppingCart, Menu, User } from 'lucide-react';
>>>>>>> Stashed changes
import '../../assets/css/header.css';
import Canvas from './Canvas';
import Mobilemenu from './Mobilemenu';
import Logo from './logo.png';
import ItemSearch from './Search';
import useScreenWidth from './useScreenWidth';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/userSlice';

<<<<<<< Updated upstream

const Header = ({ isAuthenticated }) => {
  const width = useScreenWidth();
  const history = useHistory();
  const [isTop, setIsTop] = useState(false);
  const [classmethod, setClassmethod] = useState(false);
  const [togglemethod, setTogglemethod] = useState(false);
  const [togglecart, setTogglecart] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const dispatch = useDispatch();


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
    dispatch(logout());
    history.push('/login');
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
        <div className="header-top">
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
        </div>
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
                              Shop <ChevronDown size={16} className="dropdown-icon" />
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
                                          >
                                            <i className="fal fa-star" /> {section.label}
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
                                          <div className="row">
                                            {section.items.map((item, idx) => (
                                              <div className="col-md-3" key={idx}>
                                                <div
                                                  className="menu-card"
                                                  onClick={() => handleClick(item.keyName, item.keyValue)}
                                                >
                                                  {item.image && (
                                                    <img
                                                      src={item.image}
                                                      alt={item.name || item.label}
                                                      className="img-fluid"
                                                      onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = '/fallback.jpg';
                                                      }}
                                                    />
                                                  )}
                                                  <p>{item.name || item.label}</p>
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
=======
import img1 from '../../assets/img/cart/1.jpg';
import img2 from '../../assets/img/cart/2.jpg';
import img3 from '../../assets/img/cart/3.jpg';
import img4 from '../../assets/img/cart/4.jpg';
import Logo from '../../assets/img/banner/logo.png';

const cartposts = [
    { img: img1, title: 'Oak Wood Cutting Board', price: '2x 10,000$' },
    { img: img2, title: 'Oak Wood Cutting Board', price: '2x 10,000$' },
    { img: img3, title: 'Oak Wood Cutting Board', price: '2x 10,000$' },
    { img: img4, title: 'Oak Wood Cutting Board', price: '2x 10,000$' },
];

const name = localStorage.getItem('userMobileNumber');

const Header = () => {
    const [classmethod, setClassMethod] = useState(false);
    const [togglemethod, setToggleMethod] = useState(false);
    const [togglecart, setToggleCart] = useState(false);
    const [isTop, setIsTop] = useState(false);

    const addClass = () => setClassMethod(true);
    const removeClass = () => setClassMethod(false);
    const toggleClass = () => setToggleMethod(!togglemethod);
    const toggleCartm = () => setToggleCart(!togglecart);

    useEffect(() => {
        $('.sigm-megamenu-nav>li').on('mouseover', function (e) {
            e.preventDefault();
            $('.sub-menu .sigm-megamenu-nav').find('.active').removeClass('active');
            $('.sub-menu .tab-content').find('.active').removeClass('active show');
            $(this).find('a').addClass('active');
            $('.sub-menu .tab-item').eq($(this).index()).addClass('active show');
        });

        const handleScroll = () => {
            setIsTop(window.scrollY > 110);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    
        const stickyheader = this.state.isTop ? 'sticky-active' : '';
        return (
            <Fragment>
                <header className={`header-three header-absolute sticky-header sigma-header ${stickyheader}`} id="header">
                    <div className="header-top">
                        <div className="container-fluid container-custom-three">
                            <div className="d-md-flex align-items-center justify-content-between px-4">
                                <p className="welcome-text">Free Shipping For All  Products</p>
                                <ul className="header-top-info">
                                    <li>
                                     Today's Deal
                                    </li>
                                    <li>
                                      Great Deal  
                                    </li>
                                    <li>
                                        Gift Vouchers
                                    </li>
                                    <li>
                                        {name || 'ash'}
                                    </li>
                                </ul>
>>>>>>> Stashed changes
                            </div>
                          </li>
                          <li className="menu-item">
                            <Link to="/about">About</Link>
                          </li>
                          <li className="menu-item menu-item-has-children">
                            <Link to="#">
                              Pages <ChevronDown size={16} className="dropdown-icon" />
                            </Link>
                            <ul className="sub-menu">
                              <li className="menu-item">
                                <Link to="/faq">FAQ</Link>
                              </li>
                              <li className="menu-item">
                                <Link to="/blog-grid">Blog</Link>
                              </li>
                            </ul>
                          </li>
                          <li className="menu-item">
                            <Link to="/contact">Contact</Link>
                          </li>
                        </ul>
                      </nav>
                    </div>
<<<<<<< Updated upstream
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
                      <Heart size={20} strokeWidth={1.8} />
                    </Link>
                  
                </div>
                <div className="login-btn">
                 
                    <Link to="/cart">
                      <ShoppingCart size={20} strokeWidth={1.8} />
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
            <div className="search-container">
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
                  <Heart size={16} strokeWidth={1.8} />
                </Link>
             
            </div>
            <div className="login-btns">
              
                <Link to="/cart">
                  <ShoppingCart size={16} strokeWidth={1.8} />
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
            style={{ background: '#f6f5f0', justifyContent: 'center', alignItems: 'center', padding: '10px' }}
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
=======
                    <div className="main-menu-area sticky-header">
                        <div className="container-fluid p-0">
                            <div className="nav-container d-flex align-items-center justify-content-between px-4">
                               
                                {/* Main Menu */}
                                <div className="nav-menu d-lg-flex align-items-center justify-content-between">
                                    {/* Navbar Close Icon */}
                                    <div className="navbar-close">
                                        <div className="cross-wrap"><span className="top" /><span className="bottom" /></div>
                                    </div>
                                    {/* Mneu Items */}
                                    <div className="sigma-header-nav">
                                        <div className="container">
                                            <div className="sigma-header-nav-inner">
                                                <nav>
                                                    <ul className="sigma-main-menu">
                                                        <li className="menu-item">
                                                            <Link to="/">
                                                                Home
                                                            </Link>
                                                           
                                                        </li>
                                                        <li className="menu-item menu-item-has-children menu-item-has-megamenu">
                                                            <Link to="#">
                                                                Categories
                                                            </Link>
                                                            <div className="sub-menu">
                                                                <div className="container">
                                                                    <div className="row">
                                                                        <div className="col-lg-3">
                                                                            <ul className="sigm-megamenu-nav nav nav-tabs">
                                                                                <li className="nav-item">
                                                                                    <Link to="#tab1" className="nav-link active" data-toggle="tab"><i className="fal fa-female" /> Rings</Link>
                                                                                </li>
                                                                                <li className="nav-item">
                                                                                    <Link to="#tab2" className="nav-link" data-toggle="tab"><i className="fal fa-user" /> Earrings</Link>
                                                                                </li>
                                                                                <li className="nav-item">
                                                                                    <Link to="#tab3" className="nav-link" data-toggle="tab"><i className="fal fa-baby" /> Bracelets</Link>
                                                                                </li>
                                                                                <li className="nav-item">
                                                                                    <Link to="#tab4" className="nav-link" data-toggle="tab"><i className="fal fa-suitcase-rolling" /> Pendants</Link>
                                                                                </li>
                                                                                <li className="nav-item">
                                                                                    <Link to="#tab5" className="nav-link" data-toggle="tab"><i className="fal fa-badge-check" /> Necklaces</Link>
                                                                                </li>
                                                                            </ul>
                                                                        </div>
                                                                        <div className="col-lg-9">
                                                                            <div className="tab-content">
                                                                                <div className="tab-item show active" id="tab1">
                                                                                    <div className="row">
                                                                                        <div className="col-lg-4">
                                                                                            <div className="sigma-megamenu-navbox menu-item-has-children">
                                                                                                <h5 className="sigma-title">Shop Pages</h5>
                                                                                                <ul className="sub-menu">
                                                                                                    <li className="menu-item">
                                                                                                        <Link to="/shop-left">Shop Left Sidebar</Link>
                                                                                                    </li>
                                                                                                    <li className="menu-item">
                                                                                                        <Link to="/shop-left-two">Shop Left Sidebar v2</Link>
                                                                                                    </li>
                                                                                                    <li className="menu-item">
                                                                                                        <Link to="/shop-right">Shop Right Sidebar</Link>
                                                                                                    </li>
                                                                                                    <li className="menu-item">
                                                                                                        <Link to="/shop-right-two">Shop Right Sidebar v2</Link>
                                                                                                    </li>
                                                                                                    <li className="menu-item">
                                                                                                        <Link to="/shop-detail">Product Details</Link>
                                                                                                    </li>
                                                                                                </ul>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-lg-4">
                                                                                            <div className="sigma-megamenu-navbox menu-item-has-children">
                                                                                                <h5 className="sigma-title">Other Shop Pages</h5>
                                                                                                <ul className="sub-menu">
                                                                                                    <li className="menu-item">
                                                                                                        <Link to="/account">My Account</Link>
                                                                                                    </li>
                                                                                                    <li className="menu-item">
                                                                                                        <Link to="/checkout">Checkout</Link>
                                                                                                    </li>
                                                                                                    <li className="menu-item">
                                                                                                        <Link to="/wishlist">Wishlist</Link>
                                                                                                    </li>
                                                                                                    <li className="menu-item">
                                                                                                        <Link to="/cart">Cart</Link>
                                                                                                    </li>
                                                                                                    <li className="menu-item">
                                                                                                        <Link to="/login">Login</Link>
                                                                                                    </li>
                                                                                                </ul>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-lg-4">
                                                                                            <div className="sigma-megamenu-img">
                                                                                                <Link to="#">
                                                                                                    <img src="assets/img/others/01.png" alt="img" />
                                                                                                </Link>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="tab-item" id="tab2">
                                                                                    <div className="row">
                                                                                        <div className="col-lg-3">
                                                                                            <div className="sigma-megamenu-navbox menu-item-has-children">
                                                                                                <h5 className="sigma-title">Type Of Earrings</h5>
                                                                                                <ul className="sub-menu">
                                                                                                    <li className="menu-item">
                                                                                                        <Link to="/shop-left">Ruby Earrings</Link>
                                                                                                    </li>
                                                                                                    <li className="menu-item">
                                                                                                        <Link to="/shop-left-two">Emareld Earrings</Link>
                                                                                                    </li>
                                                                                                    <li className="menu-item">
                                                                                                        <Link to="/shop-left">Saphire Earrings</Link>
                                                                                                    </li>
                                                                                                    <li className="menu-item">
                                                                                                        <Link to="/shop-left-two">Diamond Earrings</Link>
                                                                                                    </li>
                                                                                                    <li className="menu-item">
                                                                                                        <Link to="/shop-left">Gold Earrings</Link>
                                                                                                    </li>
                                                                                                </ul>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-lg-5">
                                                                                            <div className="sigma-megamenu-navbox">
                                                                                                <h5 className="sigma-title">Size</h5>
                                                                                                <div className="row mb-3">
                                                                                                    <div className="col-md-6 menu-item-has-children">
                                                                                                        <ul className="sub-menu">
                                                                                                            <li className="menu-item">
                                                                                                                <Link to="/shop-left">Hoop Earrings</Link>
                                                                                                            </li>
                                                                                                            <li className="menu-item">
                                                                                                                <Link to="/shop-left-two">Dangle Earrings</Link>
                                                                                                            </li>
                                                                                                            <li className="menu-item">
                                                                                                                <Link to="/shop-left">Stud Earrings</Link>
                                                                                                            </li>
                                                                                                        </ul>
                                                                                                    </div>
                                                                                                    <div className="col-md-6 menu-item-has-children">
                                                                                                        <ul className="sub-menu">
                                                                                                            <li className="menu-item">
                                                                                                                <Link to="/shop-left-two">Barbell Earrings</Link>
                                                                                                            </li>
                                                                                                            <li className="menu-item">
                                                                                                                <Link to="/shop-left">Huggy Earrings</Link>
                                                                                                            </li>
                                                                                                            <li className="menu-item">
                                                                                                                <Link to="/shop-left-two">Ear Thread Earrings</Link>
                                                                                                            </li>
                                                                                                        </ul>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <h5 className="sigma-title">Top Picks</h5>
                                                                                                <div className="row">
                                                                                                    <div className="col-md-6 menu-item-has-children">
                                                                                                        <ul className="sub-menu">
                                                                                                            <li className="menu-item">
                                                                                                                <Link to="/shop-detail">Jiara Blessing</Link>
                                                                                                            </li>
                                                                                                            <li className="menu-item">
                                                                                                                <Link to="/shop-detail">Hentry Firana</Link>
                                                                                                            </li>
                                                                                                            <li className="menu-item">
                                                                                                                <Link to="/shop-detail">Lucrative Li</Link>
                                                                                                            </li>
                                                                                                        </ul>
                                                                                                    </div>
                                                                                                    <div className="col-md-6 menu-item-has-children">
                                                                                                        <ul className="sub-menu">
                                                                                                            <li className="menu-item">
                                                                                                                <Link to="/shop-detail">Mirana Go</Link>
                                                                                                            </li>
                                                                                                            <li className="menu-item">
                                                                                                                <Link to="/shop-detail">Fira Diamond Ring</Link>
                                                                                                            </li>
                                                                                                            <li className="menu-item">
                                                                                                                <Link to="/shop-detail">Fanir Lo</Link>
                                                                                                            </li>
                                                                                                        </ul>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-lg-4">
                                                                                            <div className="sigma-megamenu-img">
                                                                                                <Link to="#">
                                                                                                    <img src="assets/img/others/02.png" alt="img" />
                                                                                                </Link>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="tab-item" id="tab3">
                                                                                    <div className="row">
                                                                                        <div className="col-lg-8">
                                                                                            <div className="sigma-megamenu-navbox">
                                                                                                <h5 className="sigma-title">Type Of Earrings</h5>
                                                                                                <div className="row">
                                                                                                    <div className="col-md-3">
                                                                                                        <div className="sigma-megamenu-image">
                                                                                                            <Link to="/shop-left">
                                                                                                                <img src="assets/img/others/b-1.png" alt="img" />
                                                                                                                <span>Ruby</span>
                                                                                                            </Link>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className="col-md-3">
                                                                                                        <div className="sigma-megamenu-image">
                                                                                                            <Link to="/shop-left">
                                                                                                                <img src="assets/img/others/b-2.png" alt="img" />
                                                                                                                <span>Emarald</span>
                                                                                                            </Link>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className="col-md-3">
                                                                                                        <div className="sigma-megamenu-image">
                                                                                                            <Link to="/shop-left-two">
                                                                                                                <img src="assets/img/others/b-3.png" alt="img" />
                                                                                                                <span>Saphire</span>
                                                                                                            </Link>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className="col-md-3">
                                                                                                        <div className="sigma-megamenu-image">
                                                                                                            <Link to="/shop-left">
                                                                                                                <img src="assets/img/others/b-4.png" alt="img" />
                                                                                                                <span>Diamond</span>
                                                                                                            </Link>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className="col-md-3">
                                                                                                        <div className="sigma-megamenu-image">
                                                                                                            <Link to="/shop-left-two">
                                                                                                                <img src="assets/img/others/b-5.png" alt="img" />
                                                                                                                <span>Topaz</span>
                                                                                                            </Link>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className="col-md-3">
                                                                                                        <div className="sigma-megamenu-image">
                                                                                                            <Link to="/shop-left">
                                                                                                                <img src="assets/img/others/b-6.png" alt="img" />
                                                                                                                <span>Amber</span>
                                                                                                            </Link>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className="col-md-3">
                                                                                                        <div className="sigma-megamenu-image">
                                                                                                            <Link to="/shop-left-two">
                                                                                                                <img src="assets/img/others/b-7.png" alt="img" />
                                                                                                                <span>Gold</span>
                                                                                                            </Link>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className="col-md-3">
                                                                                                        <div className="sigma-megamenu-image">
                                                                                                            <Link to="/shop-left">
                                                                                                                <img src="assets/img/others/b-8.png" alt="img" />
                                                                                                                <span>Silver</span>
                                                                                                            </Link>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-lg-4">
                                                                                            <div className="sigma-megamenu-navbox">
                                                                                                <h5 className="sigma-title">Top picks</h5>
                                                                                                <div className="row mb-4">
                                                                                                    <div className="col-md-6 menu-item-has-children">
                                                                                                        <ul className="sub-menu">
                                                                                                            <li className="menu-item">
                                                                                                                <Link to="/shop-detail">Jiara Blessing</Link>
                                                                                                            </li>
                                                                                                            <li className="menu-item">
                                                                                                                <Link to="/shop-detail">Hentry Firana</Link>
                                                                                                            </li>
                                                                                                            <li className="menu-item">
                                                                                                                <Link to="/shop-detail">Lucrative Li</Link>
                                                                                                            </li>
                                                                                                        </ul>
                                                                                                    </div>
                                                                                                    <div className="col-md-6 menu-item-has-children">
                                                                                                        <ul className="sub-menu">
                                                                                                            <li className="menu-item">
                                                                                                                <Link to="/shop-detail">Mirana Go</Link>
                                                                                                            </li>
                                                                                                            <li className="menu-item">
                                                                                                                <Link to="/shop-detail">Fira Diamond Ring</Link>
                                                                                                            </li>
                                                                                                            <li className="menu-item">
                                                                                                                <Link to="/shop-detail">Fanir Lo</Link>
                                                                                                            </li>
                                                                                                        </ul>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <h5 className="sigma-title">Shape</h5>
                                                                                                <div className="row">
                                                                                                    <div className="col-md-12 menu-item-has-children">
                                                                                                        <ul className="sub-menu">
                                                                                                            <li className="menu-item">
                                                                                                                <Link to="/shop-detail">Lira Jo</Link>
                                                                                                            </li>
                                                                                                            <li className="menu-item">
                                                                                                                <Link to="/shop-detail">Fandi Hambi</Link>
                                                                                                            </li>
                                                                                                        </ul>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="tab-item" id="tab4">
                                                                                    <div className="row">
                                                                                        <div className="col-lg-8">
                                                                                            <div className="sigma-megamenu-navbox">
                                                                                                <h5 className="sigma-title">Pendants Articles <Link to="/blog-grid">View All</Link></h5>
                                                                                                <div className="row">
                                                                                                    <div className="col-md-3">
                                                                                                        <div className="sigma-blog-block">
                                                                                                            <img src="assets/img/others/news-1.png" alt="img" />
                                                                                                            <p>Gold Pendants </p>
                                                                                                            <Link to="/blog-detail">View Post</Link>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className="col-md-3">
                                                                                                        <div className="sigma-blog-block">
                                                                                                            <img src="assets/img/others/news-2.png" alt="img" />
                                                                                                            <p>Gold Pendants </p>
                                                                                                            <Link to="/blog-detail">View Post</Link>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className="col-md-3">
                                                                                                        <div className="sigma-blog-block">
                                                                                                            <img src="assets/img/others/news-3.png" alt="img" />
                                                                                                            <p>Gold Pendants </p>
                                                                                                            <Link to="/blog-detail">View Post</Link>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className="col-md-3">
                                                                                                        <div className="sigma-blog-block">
                                                                                                            <img src="assets/img/others/news-4.png" alt="img" />
                                                                                                            <p>Gold Pendants </p>
                                                                                                            <Link to="/blog-detail">View Post</Link>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-lg-4">
                                                                                            <div className="sigma-megamenu-navbox menu-item-has-children">
                                                                                                <h5 className="sigma-title">Collections</h5>
                                                                                                <ul className="sub-menu">
                                                                                                    <li className="menu-item">
                                                                                                        <Link to="/blog-detail">Vivamus suscipit tortor eget</Link>
                                                                                                    </li>
                                                                                                    <li className="menu-item">
                                                                                                        <Link to="/blog-detail">Vivamus suscipit tortor eget</Link>
                                                                                                    </li>
                                                                                                    <li className="menu-item">
                                                                                                        <Link to="/blog-detail">Vivamus suscipit tortor eget</Link>
                                                                                                    </li>
                                                                                                    <li className="menu-item">
                                                                                                        <Link to="/blog-detail">Vivamus suscipit tortor eget</Link>
                                                                                                    </li>
                                                                                                </ul>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="tab-item" id="tab5">
                                                                                    <div className="row justify-content-center">
                                                                                        <div className="col">
                                                                                            <div className="sigma-megamenu-img">
                                                                                                <Link to="#">
                                                                                                    <img src="assets/img/others/a-1.png" alt="img" />
                                                                                                </Link>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col">
                                                                                            <div className="sigma-megamenu-img">
                                                                                                <Link to="#">
                                                                                                    <img src="assets/img/others/a-2.png" alt="img" />
                                                                                                </Link>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col">
                                                                                            <div className="sigma-megamenu-img">
                                                                                                <Link to="#">
                                                                                                    <img src="assets/img/others/a-3.png" alt="img" />
                                                                                                </Link>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col">
                                                                                            <div className="sigma-megamenu-img">
                                                                                                <Link to="#">
                                                                                                    <img src="assets/img/others/a-4.png" alt="img" />
                                                                                                </Link>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col">
                                                                                            <div className="sigma-megamenu-img">
                                                                                                <Link to="#">
                                                                                                    <img src="assets/img/others/a-5.png" alt="img" />
                                                                                                </Link>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </li>
                                                        <li className="menu-item">
                                                            <Link to="/shop-left">
                                                                Diamond
                                                            </Link>
                                                        </li>
                                                        <li className="menu-item menu-item-has-children">
                                                            <Link to="#">
                                                                Blog
                                                            </Link>
                                                            <ul className="sub-menu">
                                                                <li className="menu-item"> <Link to="/blog-grid-sidebar">Blog Grid Sidebar</Link>
                                                                </li>
                                                                <li className="menu-item"> <Link to="/blog-detail">Blog Details</Link>
                                                                </li>
                                                                <li className="menu-item"> <Link to="/blog-grid">Blog Grid</Link>
                                                                </li>
                                                                <li className="menu-item"> <Link to="/blog-list">Blog List</Link>
                                                                </li>
                                                            </ul>
                                                        </li>
                                                        <li className="menu-item menu-item-has-children">
                                                            <Link to="#">
                                                                Pages
                                                            </Link>
                                                            <ul className="sub-menu">
                                                                <li className="menu-item">
                                                                    <Link to="/about">About</Link>
                                                                </li>
                                                                <li className="menu-item">
                                                                    <Link to="/classification">Classification</Link>
                                                                </li>
                                                                <li className="menu-item">
                                                                    <Link to="/account">Account</Link>
                                                                </li>
                                                                <li className="menu-item menu-item-has-children">
                                                                    <Link to="/gallery">Gallery</Link>
                                                                    <ul className="sub-menu">
                                                                        <li className="menu-item">
                                                                            <Link to="/gallery">Gallery 2 Columns</Link>
                                                                        </li>
                                                                        <li className="menu-item">
                                                                            <Link to="/gallery-two">Gallery 3 Columns</Link>
                                                                        </li>
                                                                    </ul>
                                                                </li>
                                                                <li className="menu-item">
                                                                    <Link to="/team">Team</Link>
                                                                </li>
                                                                <li className="menu-item">
                                                                    <Link to="/typography">Typography</Link>
                                                                </li>
                                                                <li className="menu-item">
                                                                    <Link to="/error">Error 404</Link>
                                                                </li>
                                                                <li className="menu-item">
                                                                    <Link to="/coming-soon">Coming Soon</Link>
                                                                </li>
                                                            </ul>
                                                        </li>
                                                        <li className="menu-item menu-item-has-children">
                                                            <Link to="/about">
                                                                Shop
                                                            </Link>
                                                            <ul className="sub-menu">
                                                                <li className="menu-item">
                                                                    <Link to="/shop-left">Shop Left Sidebar</Link>
                                                                </li>
                                                                <li className="menu-item">
                                                                    <Link to="/shop-left-two">Shop Left Sidebar v2</Link>
                                                                </li>
                                                                <li className="menu-item">
                                                                    <Link to="/shop-right">Shop Right Sidebar</Link>
                                                                </li>
                                                                <li className="menu-item">
                                                                    <Link to="/shop-right-two">Shop Right Sidebar v2</Link>
                                                                </li>
                                                                <li className="menu-item">
                                                                    <Link to="/shop-detail">Product Details</Link>
                                                                </li>
                                                            </ul>
                                                        </li>
                                                        <li className="menu-item">
                                                            <Link to="/contact">
                                                                Contact
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                </nav>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Site Logo */}
                                    <div className="site-logo site-logo-text">
                                        <Link to="/">
                                            <img
                                                src={Logo}
                                                alt="Diamond Icon"
                                                style={{
                                                    width: '50px',
                                                    height: 'auto',
                                                    marginRight: '10px',
                                                }}
                                            />
                                            <div className="site-logo-text">
                                                <h3>Bmg Jewellers</h3>
                                                <h6>Private Limited</h6>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                                {/* navbar right content */}
                                <div className="menu-right-buttons">
                                    {/* Log in icon */}
                                    <div className="login-btn">
                                        <Link to="/login" id="loginBtn"><User size={20} strokeWidth={1.8} /></Link>
                                    </div>
                                   
                                    
                                    <div className="toggle dropdown-btn">
                                        <span className="sigma-notification">0</span>
                                        <Link to="#" onClick={this.toggleCartm}><ShoppingCart size={20}strokeWidth={1.8} /></Link>
                                        <div className={classNames("dropdown-menu cart-dropdown-menu", { "show": this.state.togglecart })}>
                                            <ul className="cart-items-box">
                                                {cartposts.map((item, i) => (
                                                    <li key={i} className="cart-item">
                                                        <div className="img">
                                                            <img src={item.img} alt="img" />
                                                        </div>
                                                        <div className="content">
                                                            <h5><Link to="#">{item.title}</Link></h5>
                                                            <p>{item.price}</p>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="cart-items-box">
                                                <div className="cart-item">
                                                    <span>Subtotal</span>
                                                    <span>20,0000</span>
                                                </div>
                                                <div className="cart-item actions">
                                                    <button type="button" className="main-btn btn-filled">Checkout</button>
                                                    <button type="button" className="main-btn btn-borderd">View Cart</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="toggle">
                                        <Link to="#" id="offCanvasBtn" onClick={this.addClass}> <Menu size={20} strokeWidth={1.8} /></Link>
                                    </div>
                                    {/* Navbar Toggler */}
                                    <div className="navbar-toggler">
                                        <span /><span /><span />
                                    </div>
                                </div>
                            </div >
                        </div >
                    </div >
                    {/* Mobile Header Start */}
                    <div className="sigma-mobile-header" >
                     
                            <div className="sigma-mobile-header-inner">
                                {/* Site Logo */}
                                <div className="site-logo site-logo-text">
                                    <Link to="/">
                                        <img
                                            src={Logo}
                                            alt="Diamond Icon"
                                            style={{
                                                width: '50px',
                                                height: 'auto',
                                                marginRight: '10px',
                                            }}
                                        />
                                        <div className="site-logo-text">
                                            <h3>Bmg Jewellers</h3>
                                            <h6>Private Limited</h6>
                                        </div>
                                    </Link>
                                </div>
                                <div className="sigma-hamburger-menu" onClick={this.toggleClass}>
                                    <Menu
                                        size={20}
                                        strokeWidth={1.8}
                                        className={classNames("lucide-hamburger", { "active": this.state.togglemethod })}
                                    />
                                </div>
                            </div >
                      
                    </div >
                    {/* Mobile Header End */}
                    {/* Mobile Menu Start */}
                    <aside className={classNames("sigma-mobile-menu", { "active": this.state.togglemethod })}>
                        <Mobilemenu />
                    </aside >
                    {/* Mobile Menu End */}
                </header >
                <div className={classNames("offcanvas-wrapper", { "show-offcanvas": this.state.classmethod })}>
                    <div className={classNames("offcanvas-overly", { "show-overly": this.state.classmethod })} onClick={this.removeClass} />
                    <div className="offcanvas-widget">
                        <Link to="#" className="offcanvas-close" onClick={this.removeClass} ><i className="fal fa-times" /></Link>
                        <Canvas />
                    </div >
                </div >
            </Fragment >
        );
    
}
>>>>>>> Stashed changes

export default Header;