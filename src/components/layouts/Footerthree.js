import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import Backtotop from "./Backtotop";
import logo from "./logo.png";
import './Footer.css'

class Footertwo extends Component {
  render() {
    return (
      <Fragment>
        <Backtotop />
        <footer className="footer-two">
          {/* Main Footer Content */}
          <div className="footer-widget-area pt-100 pb-50">
            <div className="container">
              <div className="row">
                {/* Site Info */}
                <div className="col-lg-3 col-sm-6 order-1">
                  <div className="widget site-info-widget mb-50">
                    <div className="footer-logo mb-50">
                      <img src={logo} alt="Logo" />
                    </div>
                    {/* <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </p> */}
                    <div className="social-links mt-40">
                      <a href="https://www.facebook.com/bmgjewellersmadurai?mibextid=ZbWKwL" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-facebook-f" />
                      </a>
                      <a href="https://x.com/BMGjewellers24?t=bMxPT0NbhA5RzvLl5pCdLA&s=09" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-twitter" />
                      </a>
                      <a href="https://www.instagram.com/bmgjewellers_madurai?igsh=MWxyZGIxbnl5aDc5Nw==" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-instagram" />
                      </a>
                      {/* <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-linkedin" />
                      </a> */}
                      <a href="https://youtube.com/@bmgjewellersmadurai?si=FvRFbXc7tEAkzSUu" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-youtube" />
                      </a>
                    </div>
                    
                    {/* Download App Section */}
                    <div className="download-app-section mt-30">
                      <h6 className="mb-3" style={{fontWeight: '600', color: '#000'}}>Download Our App</h6>
                      <div className="app-download-links">
                        <a 
                          href="https://play.google.com/store/apps/details?id=com.jk_08.newapp&pcampaignid=web_share" 
                          className="app-download-link"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-block',
                            marginRight: '10px',
                            marginBottom: '10px'
                          }}
                        >
                          <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" 
                            alt="Download on App Store" 
                            style={{height: '40px'}}
                          />
                        </a>
                        <a 
                          href="https://play.google.com/store/apps/details?id=com.jk_08.newapp&pcampaignid=web_share" 
                          className="app-download-link"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-block',
                            marginBottom: '10px'
                          }}
                        >
                          <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                            alt="Get it on Google Play" 
                            style={{height: '40px'}}
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Useful Links */}
                <div className="col-lg-6 order-3 order-lg-2">
                  <div className="widget nav-widget mb-50">
                    <h4 className="widget-title">Useful Links</h4>
                    <ul className="useful-links">
                     
                      <li>
                        <Link to="/privacypolicy">Privacy Policy</Link>
                      </li>
                      <li>
                        <Link to="/terms-conditions">Terms & Conditions</Link>
                      </li>
                      {/* <li>
                        <Link to="/delivery&shipping">Delivery-Shiiping Policy</Link>
                      </li> */}
                      <li>
                        <Link to="/cancellation-return-policy">Cancellation & Return Policy</Link>
                      </li>
                      <li>
                        <Link to="/refund-policy">Shipping and Returns</Link>
                      </li>
                      <li>
                        <Link to="/why-choose-us">why choose us</Link>
                      </li>
                    
                    
                    </ul>

                  
                  </div>
                </div>

                {/* Contact Info */}
                <div className="col-lg-3 col-sm-6 order-2 order-lg-3">
                  <div className="widget contact-widget mb-50">
                    <h4 className="widget-title">Contact Us.</h4>
                    <div className="contact-lists">
                      <div className="contact-box">
                        <div className="icon">
                          <i className="flaticon-phone" />
                        </div>
                        <div className="desc">
                          <h6 className="title">Phone Number</h6>
                          <span> +91-95143 33601,</span>
                          <span> +91-95143 336097</span>
                        </div>
                      </div>
                      <div className="contact-box">
                        <div className="icon">
                          <i className="flaticon-message" />
                        </div>
                        <div className="desc">
                          <h6 className="title">Email Address</h6>
                          <Link to="#">Contact@bmgjewellers.in</Link>
                        </div>
                      </div>
                      <div className="contact-box">
                        <div className="icon">
                          <i className="flaticon-location-pin" />
                        </div>
                        <div className="desc">
                          <h6 className="title">Office Address</h6>
                          M/s. BMG Jewellers Pvt Ltd, 160, Melamasi St,
                          Madurai-625001
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Popular Searches Section */}
          <div
            className="popular-searches py-5"
            style={{ backgroundColor: "#f5f6f0" }}
          >
            <div className="container">
              <h5
                className="mb-4 text-uppercase"
                style={{ fontWeight: 600, color: "#000000" }}
              >
                Popular Searches
              </h5>

              <div className="row">
                {/* Column 1 */}
                <div className="col-lg-3 col-sm-6 mb-3">
                  <h6 className="text-dark font-weight-bold">Rings</h6>
                  <ul className="footer-links">
                    <li>
                      <Link to="/shop-left?itemName=RINGS&subItemName=DAILY WEAR">
                        Daily Wear
                      </Link>
                    </li>
                    <li>
                      <Link to="/shop-left?itemName=RINGS&subItemName=STATEMENT RINGS">
                        Statement Rings
                      </Link>
                    </li>
                    <li>
                      <Link to="/shop-left?itemName=RINGS&subItemName=COUPLE RINGS">
                        Couple Rings
                      </Link>
                    </li>
                    <li>
                      <Link to="/shop-left?itemName=RINGS&subItemName=ENGAGEMENT RINGS">
                        Engagement Rings
                      </Link>
                    </li>
                    <li>
                      <Link to="/shop-left?itemName=RINGS&subItemName=WEDDING RINGS">
                        Wedding Rings
                      </Link>
                    </li>
                  </ul>

                  <h6 className="text-dark font-weight-bold mt-3">Earrings</h6>
                  <ul className="footer-links">
                    <li>
                      <Link to="/shop-left?itemName=EARRINGS&subItemName=JHUMAKAS">
                        Jhumkas
                      </Link>
                    </li>
                    <li>
                      <Link to="/shop-left?itemName=EARRINGS&subItemName=STUDS">
                        Studs
                      </Link>
                    </li>
                    <li>
                      <Link to="/shop-left?itemName=EARRINGS&subItemName=CHANDBALIS">
                        Chandbalis
                      </Link>
                    </li>
                    <li>
                      <Link to="/shop-left?itemName=EARRINGS&subItemName=DANGLERS">
                        Danglers
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 2 */}
                <div className="col-lg-3 col-sm-6 mb-3">
                  <h6 className="text-dark font-weight-bold">
                    Necklaces & Sets
                  </h6>
                  <ul className="footer-links">
                    <li>
                      <Link to="/shop-left?itemName=NECKLACES&subItemName=CHOCKER SETS">
                        Chocker sets
                      </Link>
                    </li>
                    <li>
                      <Link to="/shop-left?itemName=NECKLACES&subItemName=LONG HARAM">
                        Long Haram
                      </Link>
                    </li>
                    <li>
                      <Link to="/shop-left?itemName=NECKLACES&subItemName=SHORT CHAINS">
                        Short Chains
                      </Link>
                    </li>
                    <li>
                      <Link to="/shop-left?itemName=NECKLACES&subItemName=TEMPLE SETS">
                        Temple sets
                      </Link>
                    </li>
                  </ul>

                  <h6 className="text-dark font-weight-bold mt-3">
                    Bangles & Bracelets
                  </h6>
                  <ul className="footer-links">
                    <li>
                      <Link to="/shop-left?itemName=BANGLES&subItemName=KADAS">
                        Kadas
                      </Link>
                    </li>
                    <li>
                      <Link to="/shop-left?itemName=BANGLES&subItemName=CLOSED BANGLES">
                        Closed Bangles
                      </Link>
                    </li>
                    <li>
                      <Link to="/shop-left?itemName=BANGLES&subItemName=OPENABLE BANGLES">
                        Openable Bangles
                      </Link>
                    </li>
                    <li>
                      <Link to="/shop-left?itemName=BANGLES&subItemName=ADJUSTABLE BRACELETS">
                        Adjustable Bracelets
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 3 */}
                <div className="col-lg-3 col-sm-6 mb-3">
                  <h6 className="text-dark font-weight-bold">
                    Ankles & Toe Rings
                  </h6>
                  <ul className="footer-links">
                    <li>
                      <Link to="/shop-left?itemName=ANKLES&subItemName=TRADITIONAL ANKLETS">
                        Traditional Anklets
                      </Link>
                    </li>
                    <li>
                      <Link to="/shop-left?itemName=ANKLES&subItemName=FANCY ANKLETS">
                        Fancy Anklets
                      </Link>
                    </li>
                    <li>
                      <Link to="/shop-left?itemName=ANKLES&subItemName=TOE RINGS">
                        Toe Rings
                      </Link>
                    </li>
                  </ul>

                  <h6 className="text-dark font-weight-bold mt-3">
                    Pendants & Chains
                  </h6>
                  <ul className="footer-links">
                    <li>
                      <Link to="/shop-left?itemName=PENDANTS&subItemName=NAME PENDANTS">
                        Name Pendants
                      </Link>
                    </li>
                    <li>
                      <Link to="/shop-left?itemName=PENDANTS&subItemName=STONE PENDANTS">
                        Stone Pendants
                      </Link>
                    </li>
                    <li>
                      <Link to="/shop-left?itemName=PENDANTS&subItemName=PLAIN CHAINS">
                        Plain Chains
                      </Link>
                    </li>
                  </ul>

                  <h6 className="text-dark font-weight-bold mt-3">
                    Maang Tikka & Hair
                  </h6>
                  <ul className="footer-links">
                    <li>
                      <Link to="/shop-left?itemName=MAANG TIKKA&subItemName=BRIDAL">
                        Bridal
                      </Link>
                    </li>
                    <li>
                      <Link to="/shop-left?itemName=MAANG TIKKA&subItemName=FESTIVE LOOK">
                        Festive Look
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 4 */}
                <div className="col-lg-3 col-sm-6 mb-3">
                  <h6 className="text-dark font-weight-bold">
                    Bridal Collection
                  </h6>
                  <ul className="footer-links">
                    <li>
                      <Link to="/shop-left?itemName=BRIDAL&subItemName=FULL SETS">
                        Full Sets
                      </Link>
                    </li>
                    <li>
                      <Link to="/shop-left?itemName=BRIDAL&subItemName=BRIDAL EARRINGS">
                        Bridal Earrings
                      </Link>
                    </li>
                    <li>
                      <Link to="/shop-left?itemName=BRIDAL&subItemName=BRIDAL BANGLES">
                        Bridal Bangles
                      </Link>
                    </li>
                  </ul>

                  <h6 className="text-dark font-weight-bold mt-3">
                    Temple Jewellery
                  </h6>
                  <ul className="footer-links">
                    <li>
                      <Link to="/shop-left?itemName=TEMPLE&subItemName=TRADITIONAL KEMP">
                        Traditional Kemp
                      </Link>
                    </li>
                    <li>
                      <Link to="/shop-left?itemName=TEMPLE&subItemName=MATTE GOLD FINISH">
                        Matte Gold Finish
                      </Link>
                    </li>
                  </ul>

                  <h6 className="text-dark font-weight-bold mt-3">
                    Men's Jewellery
                  </h6>
                  <ul className="footer-links">
                    <li>
                      <Link to="/shop-left?itemName=MEN&subItemName=CHAINS">
                        Chains
                      </Link>
                    </li>
                    <li>
                      <Link to="/shop-left?itemName=MEN&subItemName=KADA">
                        Kada
                      </Link>
                    </li>
                    <li>
                      <Link to="/shop-left?itemName=MEN&subItemName=RINGS">
                        Rings
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Second Row */}
              <div className="row mt-3">
                {/* Column 1 */}
                <div className="col-lg-3 col-sm-6 mb-3">
                  <h6 className="text-dark font-weight-bold">Kids Jewellery</h6>
                  <ul className="footer-links">
                    <li>
                      <Link to="/shop-left?itemName=KIDS&subItemName=CUTE NECKPIECES">
                        Cute Neckpieces
                      </Link>
                    </li>
                    <li>
                      <Link to="/shop-left?itemName=KIDS&subItemName=MINI BANGLES">
                        Mini Bangles
                      </Link>
                    </li>
                    <li>
                      <Link to="/shop-left?itemName=KIDS&subItemName=STUDS">
                        Studs
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 2 */}
                <div className="col-lg-3 col-sm-6 mb-3">
                  <h6 className="text-dark font-weight-bold">
                    Oxidised Jewellery
                  </h6>
                  <ul className="footer-links">
                    <li>
                      <Link to="/shop-left?itemName=OXIDISED&subItemName=GERMAN SILVER">
                        German Silver
                      </Link>
                    </li>
                    <li>
                      <Link to="/shop-left?itemName=OXIDISED&subItemName=ANTIQUE LOOK SETS">
                        Antique Look Sets
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 3 */}
                <div className="col-lg-3 col-sm-6 mb-3">
                  <h6 className="text-dark font-weight-bold">
                    Customised Jewellery
                  </h6>
                  <ul className="footer-links">
                    <li>
                      <Link to="/shop-left?itemName=CUSTOMISED&subItemName=NAME JEWELLERY">
                        Name Jewellery
                      </Link>
                    </li>
                    <li>
                      <Link to="/shop-left?itemName=CUSTOMISED&subItemName=ALPHABET PENDANTS">
                        Alphabet Pendants
                      </Link>
                    </li>
                    <li>
                      <Link to="/shop-left?itemName=CUSTOMISED&subItemName=BIRTHSTONE RINGS">
                        BirthStone Rings
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 4 */}
                <div className="col-lg-3 col-sm-6 mb-3">
                  <h6 className="text-dark font-weight-bold">Gift Ideas</h6>
                  <ul className="footer-links">
                    <li>
                      <Link to="/shop-left?maxGrandTotal=999">
                        Under Rs.999
                      </Link>
                    </li>
                    <li>
                      <Link to="/shop-left?maxGrandTotal=1999">
                        Under Rs.1999
                      </Link>
                    </li>
                    <li>
                      <Link to="/shop-left?maxGrandTotal=2999">
                        Under Rs.2999
                      </Link>
                    </li>
                    <li>
                      <Link to="/shop-left?minGrandTotal=3000">
                        Above Rs.3000
                      </Link>
                    </li>
                    {/* <li>
                      <Link to="/shop-left?itemName=GIFTS&subItemName=FOR HIM">
                        For Him
                      </Link>
                    </li>
                    <li>
                      <Link to="/shop-left?itemName=GIFTS&subItemName=FOR HER">
                        For Her
                      </Link>
                    </li> */}
                  </ul>
                </div>
              </div>

             {/* Third Row */}
<div className="row mt-3">
  <div className="col-lg-3 col-sm-6 mb-3">
    <h6 className="text-dark font-weight-bold">
      Festival Specials
    </h6>
    <ul className="footer-links">
      <li>
        <Link to="/shop-left?itemName=FESTIVAL&subItemName=NAVARATRI">
          Navaratri
        </Link>
      </li>
      <li>
        <Link to="/shop-left?itemName=FESTIVAL&subItemName=DIWALI">
          Diwali
        </Link>
      </li>
      <li>
        <Link to="/shop-left?itemName=FESTIVAL&subItemName=WEDDING SEASON">
          Wedding Season Picks
        </Link>
      </li>
    </ul>
  </div>

  <div className="col-lg-3 col-sm-6 mb-3">
    <h6 className="text-dark font-weight-bold">Clearance Sale</h6>
    <ul className="footer-links">
      <li>
        <Link to="/shop-left?itemName=CLEARANCE&subItemName=HEAVY DISCOUNT">
          Heavy Discount
        </Link>
      </li>
      <li>
        <Link to="/shop-left?itemName=CLEARANCE&subItemName=LAST STOCK">
          Last Stock Items
        </Link>
      </li>
    </ul>
  </div>

  <div className="col-lg-3 col-sm-6 mb-3">
    <h6 className="text-dark font-weight-bold">Offers</h6>
    <ul className="footer-links">
      <li>
        <Link to="/shop-left?itemName=OFFERS&subItemName=BUY 2 GET 1">
          Buy 2 Get 1
        </Link>
      </li>
      <li>
                      <Link to="/shop-left?itemName=OFFER&subItemName=50%25OFFER">
          50% Off
        </Link>
      </li>
    </ul>
  </div>

  <div className="col-lg-3 col-sm-6 mb-3">
    <h6 className="text-dark font-weight-bold">New Arrivals</h6>
    <ul className="footer-links">
      <li>
        <Link to="/shop-left?itemName=NEW&subItemName=TRENDING">
          Trending Now
        </Link>
      </li>
      <li>
        <Link to="/shop-left?itemName=NEW&subItemName=JUST IN">
          Just In
        </Link>
      </li>
    </ul>
  </div>
</div>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="copyright-area pt-30 pb-30">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-6 col-md-5 order-2 order-md-1">
                  <p className="copyright-text copyright-two">
                    © 2025, <Link to="#">BMG Jewellers Pvt Ltd</Link>
                  </p>
                </div>
                <div className="col-lg-6 col-md-7 order-1 order-md-2">
                  <div className="footer-menu text-center text-md-right py-3">
                    <span style={{ color: '#cd865c', fontSize: '16px', fontWeight: 'bold' }}>
                      Powered By
                    </span>{' '}
                    <a
                      href="https://www.brightechsoftware.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#404040',
                        fontSize: '16px',
                        textDecoration: 'none',
                        fontWeight: '600',
                        marginLeft: '4px',
                      }}
                    >
                      BrightechSoftwareSolution
                    </a>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </footer>
      </Fragment>
    );
  }
}

export default Footertwo;