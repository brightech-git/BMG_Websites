import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames'
import $ from 'jquery'

import { ShoppingCart, Menu, User } from 'lucide-react';

import Canvas from './Canvas';
import Mobilemenu from './Mobilemenu';

import img1 from '../../assets/img/cart/1.jpg';
import img2 from '../../assets/img/cart/2.jpg';
import img3 from '../../assets/img/cart/3.jpg';
import img4 from '../../assets/img/cart/4.jpg';
// Cart loop
import Logo from '../../assets/img/banner/logo.png'
const cartposts = [
    { img: img1, title: 'Oak Wood Cutting Board', price: '2x 10,000$' },
    { img: img2, title: 'Oak Wood Cutting Board', price: '2x 10,000$' },
    { img: img3, title: 'Oak Wood Cutting Board', price: '2x 10,000$' },
    { img: img4, title: 'Oak Wood Cutting Board', price: '2x 10,000$' },
];
class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            classmethod: false,
            togglemethod: false,
            togglecart: false,
        };
        this.addClass = this.addClass.bind(this);
        this.removeClass = this.removeClass.bind(this);
        this.toggleClass = this.toggleClass.bind(this);
        this.toggleCartm = this.toggleCartm.bind(this);
    }
    addClass() {
        this.setState({
            classmethod: true
        });
    }

    removeClass() {
        this.setState({
            classmethod: false
        });
    }
    toggleClass() {
        this.setState({
            togglemethod: !this.state.togglemethod
        });
    }
    toggleCartm() {
        this.setState({
            togglecart: !this.state.togglecart
        });
    }
    componentDidMount() {
        function megamenu() {
            $('.sigm-megamenu-nav>li').on('mouseover', function (e) {
                e.preventDefault();
                $('.sub-menu .sigm-megamenu-nav').find('.active').removeClass('active');
                $('.sub-menu .tab-content').find('.active').removeClass('active show');

                $(this).find('a').addClass('active');
                $('.sub-menu .tab-item').eq($(this).index()).addClass('active show');
            });
        }
        megamenu();
        window.addEventListener('scroll', () => {
            this.setState({
                isTop: window.scrollY > 110
            });
        }, false);
    }
    render() {
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
                                </ul>
                            </div>
                        </div>
                    </div>
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
                                                            {/* Commented out other home variants
                                                            <ul className="sub-menu">
                                                                <li className="menu-item">
                                                                    <Link to="/">Home 1</Link>
                                                                </li>
                                                                <li className="menu-item">
                                                                    <Link to="/home-two">Home 2</Link>
                                                                </li>
                                                                <li className="menu-item">
                                                                    <Link to="/home-three">Home 3</Link>
                                                                </li>
                                                                <li className="menu-item">
                                                                    <Link to="/home-four">Home 4</Link>
                                                                </li>
                                                            </ul>
                                                            */}
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
                                    {/* search btton */}
                                    {/* <div className="search">
                                        <Link to="#" className="search-icon" id="searchBtn">
                                            <i className="fal fa-search open-icon" />
                                            <i className="fal fa-times close-icon" />
                                        </Link>
                                        <div className="search-form">
                                            <form action="#">
                                                <input type="text" placeholder="Search your keyword..." />
                                                <button type="submit"><i className="far fa-search" /></button>
                                            </form>
                                        </div>
                                    </div> */}
                                    {/* Off canvas Toggle */}
                                    
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
}

export default Header;