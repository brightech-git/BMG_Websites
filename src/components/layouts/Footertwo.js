import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import Backtotop from "./Backtotop";
import logo from "../../assets/img/logo1.jpg";

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
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </p>
                    <div className="social-links mt-40">
                      <Link to="#">
                        <i className="fab fa-facebook-f" />
                      </Link>
                      <Link to="#">
                        <i className="fab fa-twitter" />
                      </Link>
                      <Link to="#">
                        <i className="fab fa-behance" />
                      </Link>
                      <Link to="#">
                        <i className="fab fa-linkedin" />
                      </Link>
                      <Link to="#">
                        <i className="fab fa-youtube" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Useful Links */}
                <div className="col-lg-6 order-3 order-lg-2">
                  <div className="widget nav-widget mb-50">
                    <h4 className="widget-title">Useful Links</h4>
                    <ul className="useful-links">
                      <li>
                        <Link to="#">Contact Us</Link>
                      </li>
                      <li>
                        <Link to="#">About Us</Link>
                      </li>
                      <li>
                        <Link to="#">Shipping & Returns</Link>
                      </li>
                      <li>
                        <Link to="#">Refund Policy</Link>
                      </li>
                      <li>
                        <Link to="#">Terms & Conditions</Link>
                      </li>
                      <li>
                        <Link to="faq">FAQ</Link>
                      </li>
                    </ul>

                    {/* ✅ PAYMENT ICONS BELOW LINKS */}
                    <div className="payment-icons mt-4">
                      <i className="fab fa-cc-visa"></i>
                      <i className="fab fa-cc-mastercard"></i>
                      <i className="fab fa-cc-paypal"></i>
                      <i className="fab fa-cc-apple-pay"></i>
                    </div>
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
                {/* Gifts For Women */}
                <div className="col-lg-3 col-sm-6 mb-3">
                  <h6 className="text-dark font-weight-bold">
                    Gifts For Women
                  </h6>
                  <ul className="footer-links" >
                    <li>
                      <Link to="#">Rings For Women</Link>
                    </li>
                    <li>
                      <Link to="#">925 Silver Ring For Women</Link>
                    </li>
                    <li>
                      <Link to="#">Gold Ring For Women</Link>
                    </li>
                    <li>
                      <Link to="#">Rose Gold Ring For Women</Link>
                    </li>
                    <li>
                      <Link to="#">Earrings For Women</Link>
                    </li>
                    <li>
                      <Link to="#">Bracelet For Women</Link>
                    </li>
                    <li>
                      <Link to="#">Pendants For Women</Link>
                    </li>
                    <li>
                      <Link to="#">Necklaces For Women</Link>
                    </li>
                    <li>
                      <Link to="#">Maang Tikka</Link>
                    </li>
                  </ul>
                </div>

                {/* Gifts For Men */}
                <div className="col-lg-3 col-sm-6 mb-3">
                  <h6 className="text-dark font-weight-bold">Gifts For Men</h6>
                  <ul className="footer-links">
                    <li>
                      <Link to="#">Rings For Men</Link>
                    </li>
                    <li>
                      <Link to="#">Earrings For Men</Link>
                    </li>
                    <li>
                      <Link to="#">Bracelet For Men</Link>
                    </li>
                    <li>
                      <Link to="#">Mens Chain</Link>
                    </li>
                  </ul>
                </div>

                {/* Mangalsutra & Pendants */}
                <div className="col-lg-3 col-sm-6 mb-3">
                  <h6 className="text-dark font-weight-bold">Mangalsutra</h6>
                  <ul className="footer-links">
                    <li>
                      <Link to="#">Modern Mangalsutra</Link>
                    </li>
                    <li>
                      <Link to="#">Gold Mangalsutra</Link>
                    </li>
                    <li>
                      <Link to="#">Mangalsutra Bracelet</Link>
                    </li>
                  </ul>
                  <h6 className="text-dark font-weight-bold mt-3">Pendants</h6>
                  <ul className="footer-links">
                    <li>
                      <Link to="#">Gold Pendants</Link>
                    </li>
                    <li>
                      <Link to="#">Evil Eye Pendants</Link>
                    </li>
                    <li>
                      <Link to="#">Customized Pendants</Link>
                    </li>
                  </ul>
                </div>

                {/* Bangles & Others */}
                <div className="col-lg-3 col-sm-6 mb-3">
                  <h6 className="text-dark font-weight-bold">
                    Bracelets & More
                  </h6>
                  <ul className="footer-links">
                    <li>
                      <Link to="#">Daily Wear Bangles</Link>
                    </li>
                    <li>
                      <Link to="#">Bridal Bangles</Link>
                    </li>
                    <li>
                      <Link to="#">Pearl Bracelets</Link>
                    </li>
                    <li>
                      <Link to="#">Evil Eye Bracelets</Link>
                    </li>
                    <li>
                      <Link to="#">18k Gold Necklace</Link>
                    </li>
                    <li>
                      <Link to="#">Solitaire Rings</Link>
                    </li>
                    <li>
                      <Link to="#">Engagement Rings</Link>
                    </li>
                    <li>
                      <Link to="#">Kids Earrings</Link>
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
                  <div className="footer-menu text-center text-md-right">
                    <ul>
                      <li>
                        <Link to="#">Today's Deal</Link>
                      </li>
                      <li>
                        <Link to="#">Our Collections</Link>
                      </li>
                      <li>
                        <Link to="#">Deal of the Day</Link>
                      </li>
                    </ul>
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
