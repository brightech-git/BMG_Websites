import React from "react";
import { Link } from "react-router-dom";
import Backtotop from "./Backtotop";
import logo from "./logo.png";
import "./Footer.css";
import btsLogo from './btsLogo.jpg';
import { useFooterContent } from "../../hook/footer/useFooterContent";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useCompanyDetails } from "../../context/clientDetails/clientDetialContext";

const Footertwo = () => {

  const history =useHistory();
  const { data: footerContent } = useFooterContent();
  const {details} = useCompanyDetails();



  const footerCategory = footerContent?.entries|| [];

  const itemNames = footerCategory.map((item)=>{
    console.log(item.title ,'itemnames');
  })
  console.log(itemNames,'itemNames');
  return (
    <>
      <Backtotop />
      <footer className="footer-two">
        {/* Main Footer Content */}
        <div className="footer-widget-area">
          <div className="footer-container">
            <div className="footer-grid">
              {/* Brand Section */}
              <div className="footer-brand-section">
                <div className="footer-logo">
                  <img src={logo} alt="BMG Jewellers" className="footer-logo-img" />
                </div>
                <p className="footer-brand-description">
                  Your trusted partner in exquisite jewelry since inception.
                  Crafting timeless pieces with unparalleled craftsmanship.
                </p>
                <div className="footer-social-links">
                  <a
                    href="https://www.facebook.com/bmgjewellersmadurai?mibextid=ZbWKwL"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                    aria-label="Facebook"
                  >
                    <i className="fab fa-facebook-f" />
                  </a>
                  <a
                    href="https://x.com/BMGjewellers24?t=bMxPT0NbhA5RzvLl5pCdLA&s=09"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                    aria-label="Twitter"
                  >
                    <i className="fab fa-twitter" />
                  </a>
                  <a
                    href="https://www.instagram.com/bmgjewellers_madurai?igsh=MWxyZGIxbnl5aDc5Nw=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                    aria-label="Instagram"
                  >
                    <i className="fab fa-instagram" />
                  </a>
                  <a
                    href="https://youtube.com/@bmgjewellersmadurai?si=FvRFbXc7tEAkzSUu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                    aria-label="YouTube"
                  >
                    <i className="fab fa-youtube" />
                  </a>
                </div>

                {/* Download App Section */}
                <div className="footer-app-section">
                  <h6 className="app-section-title">Download Our App</h6>
                  <div className="app-download-buttons">
                    <a
                      href="https://play.google.com/store/apps/details?id=com.jk_08.newapp&pcampaignid=web_share"
                      className="app-download-btn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                        alt="Download on App Store"
                        className="app-store-img"
                      />
                    </a>
                    <a
                      href="https://play.google.com/store/apps/details?id=com.jk_08.newapp&pcampaignid=web_share"
                      className="app-download-btn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                        alt="Get it on Google Play"
                        className="play-store-img"
                      />
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="footer-links-section">
                <h4 className="footer-section-title">Quick Links</h4>
                <div className="footer-links-grid">
                  <ul className="footer-links-list">
                    <li className="footer-link-item">
                      <Link to="/about" className="footer-link">About Us</Link>
                    </li>
                    <li className="footer-link-item">
                      <Link to="/why-choose-us" className="footer-link">Why Choose Us</Link>
                    </li>
                    <li className="footer-link-item">
                      <Link to="/privacypolicy" className="footer-link">Privacy Policy</Link>
                    </li>
                    <li className="footer-link-item">
                      <Link to="/terms-conditions" className="footer-link">Terms & Conditions</Link>
                    </li>
                
             
                    <li className="footer-link-item">
                      <Link to="/risk-compliance-policy" className="footer-link">Compliance Policy</Link>
                    </li>
                    <li className="footer-link-item">
                      <Link to="/cancellation-return-policy" className="footer-link">
                        Return Policy
                      </Link>
                    </li>
                    <li className="footer-link-item">
                      <Link to="/refund-policy" className="footer-link">Shipping & Returns</Link>
                    </li>
                    {/* <li className="footer-link-item">
                      <Link to="/size-guide" className="footer-link">Size Guide</Link>
                    </li> */}
                  </ul>
                </div>
              </div>

              {/* Contact Information */}
              <div className="footer-contact-section">
                <h4 className="footer-section-title">Get In Touch</h4>
                <div className="contact-info-list">
                  <div className="contact-info-item">
                    <div className="contact-icon">
                      <i className="flaticon-phone" />
                    </div>
                    <div className="footer-contact-details">
                      <h6 className="footer-contact-label">Phone Number</h6>
                      <div className="contact-numbers">
                        <span>{details?.phone || ""}</span>
                        {/* <span>+91-95143 33609</span> */}
                      </div>
                    </div>
                  </div>
                  <div className="contact-info-item">
                    <div className="contact-icon">
                      <i className="flaticon-message" />
                    </div>
                    <div className="footer-contact-details">
                      <h6 className="footer-contact-label">Email Address</h6>
                      <Link to="mailto:Contact@bmgjewellers.in" className="contact-email">
                        {details?.email || ""}
                      </Link>
                    </div>
                  </div>
                  <div className="contact-info-item">
                    <div className="contact-icon">
                      <i className="flaticon-location-pin" />
                    </div>
                    <div className="footer-contact-details">
                      <h6 className="footer-contact-label">Store Location</h6>
                      <address className="contact-address">
                        {details?.address1 || ""}<br />
                        {details?.address2 || ""}<br />
                        {details?.areaCode || ""}
                      </address>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=" bg-white p-2 border-b">
          <h5 className="text-md ">Quick Search</h5>
        <div className="flex items-center p-1" >

          <h6 className="text-sm items-center mr-5" > Categories</h6>
          {footerCategory.map((item, idx) => (
            <React.Fragment key={idx}>
              <span
                style={{ cursor: "pointer" }}
                onClick={() => {
                  if (item.link) {
                    history.push(item.link)
                  }
                }}
                className="flex row-reverse text-xs"
              >
                {item.title}
              </span>

              {/* Add separator "|" ONLY between items, not after last one */}
              {idx !== footerCategory.length - 1 && <span> | </span>}
            </React.Fragment>
          ))}
        </div>
        </div>

        {/* Copyright Section */}
        <div className="footer-copyright">
          <div className="footer-container">
            <div className="copyright-content">
              <div className="copyright-text">
                <p>
                  © 2025 <Link to="/" className="company-name">BMG Jewellers Pvt Ltd</Link>.
                  All rights reserved.
                </p>
              </div>
              <div className="developer-credit">
                <span className="crafted-by">Crafted By</span>
                <img
                  src={btsLogo}
                  alt="Brightech Software Solutions"
                  className="developer-logo"
                />
                <a
                  href="https://www.brightechsoftware.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="developer-link"
                >
                  Brightech Software Solutions
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footertwo;