import React from "react";
import { Link } from "react-router-dom";
import Backtotop from "./Backtotop";
import logo from "./logo.png";
import "./Footer.css";
import btsLogo from './btsLogo.jpg';
import { useFooterContent } from "../../hook/footer/useFooterContent";
import {  NavLink } from "react-router-dom";
import { useCompanyDetails } from "../../context/clientDetails/clientDetialContext";

const Footer = () => {
  const { data: footerContent } = useFooterContent();
  const { details } = useCompanyDetails();

  // Centralized footer data
  const footerData = {
    company: {
      name: "BMG Jewellers Pvt Ltd",
      logo: `${details?.LOGO ? "https://app.bmgjewellers.com" + details.LOGO : logo}`,
      year: 2025,
      website: "/"
    },

    socialMedia: [
      {
        name: "facebook",
        icon: "fab fa-facebook-f",
        url: details?.FACEBOOKLINK || "https://www.facebook.com/bmgjewellersmadurai"
      },
      {
        name: "instagram",
        icon: "fab fa-instagram",
        url: details?.INSTALINK || "https://www.instagram.com/bmgjewellers_madurai"
      },
      {
        name: "twitter",
        icon: "fab fa-twitter",
        url: details?.TWITTERLINK || "https://x.com/BMGjewellers24"
      },
      {
        name: "youtube",
        icon: "fab fa-youtube",
        url: details?.YOUTUBELINK || "https://youtube.com/@bmgjewellersmadurai"
      }
    ],

    appLinks: {
      appStore: "https://play.google.com/store/apps/details?id=com.jk_08.newapp&pcampaignid=web_share",
      playStore: "https://play.google.com/store/apps/details?id=com.jk_08.newapp&pcampaignid=web_share",
      appStoreImg: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg",
      playStoreImg: "https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
    },

    quickLinks: [
      { name: "About Us", href: "/about" },
      { name: "Why Choose Us", href: "/why-choose-us" },
      { name: "FAQ", href: "/faq" },
      { name: "Scheme", href: "/scheme" }
    ],

    policyLinks: [
      { name: "Privacy Policy", href: "/privacypolicy" },
      { name: "Terms & Conditions", href: "/terms-conditions" },
      { name: "Compliance Policy", href: "/risk-compliance-policy" },
      { name: "Return Policy", href: "/cancellation-return-policy" },
      { name: "Shipping & Returns", href: "/refund-policy" }
    ],

    contactInfo: {
      phone: details?.PHONE || details?.phone || "",
      email: details?.EMAIL || details?.email || "",
      address: {
        line1: details?.ADDRESS1 || "",
        line2: details?.ADDRESS2 || "",
        areaCode: details?.AREACODE || ""
      }
    },

    developer: {
      name: "Brightech Software Solutions",
      website: "https://www.brightechsoftware.com/",
      logo: btsLogo
    }
  };

  const footerCategory = footerContent?.entries || [];

  return (
    <>
      <Backtotop />
      <footer className="footer-two" id="site-footer">
        {/* Main Footer Content */}
        <div className="footer-two-widget-area">
          <div className="footer-container">
            <div className="footer-grid">
              {/* Brand Section */}
              <div className="footer-brand-section">
                <div className="footer-logo">
                  <img
                    src={footerData.company.logo}
                    alt={footerData.company.name}
                    className="footer-logo-img"
                  />
                </div>

                <div className="footer-social-links">
                  {footerData.socialMedia.map((item) => (
                    <a
                      key={item.name}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                      aria-label={item.name}
                    >
                      <i className={item.icon}></i>
                    </a>
                  ))}
                </div>

                {/* Download App Section */}
                <div className="footer-app-section">
                  <h6 className="app-section-title">Download Our App</h6>
                  <div className="app-download-buttons">
                    <a
                      href={footerData.appLinks.appStore}
                      className="app-download-btn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={footerData.appLinks.appStoreImg}
                        alt="Download on App Store"
                        className="app-store-img"
                      />
                    </a>
                    <a
                      href={footerData.appLinks.playStore}
                      className="app-download-btn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={footerData.appLinks.playStoreImg}
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
                <ul className="footer-links-list">
                  {footerData.quickLinks.map((link, index) => (
                    <li key={index} className="footer-link-item">
                      <Link to={link.href} className="footer-link">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
               
              </div>

              {/* Policy Links */}
              <div className="footer-links-section">
                <h4 className="footer-section-title">Policy Links</h4>
                <ul className="footer-links-list">
                  {footerData.policyLinks.map((link, index) => (
                    <li key={index} className="footer-link-item">
                      <Link to={link.href} className="footer-link">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Information */}
              <div className="footer-contact-section">
                <h4 className="footer-section-title">Get In Touch</h4>
                <div className="contact-info-list">
                  {/* Phone */}
                  {footerData.contactInfo.phone && (
                    <div className="contact-info-item">
                      <div className="contact-icon">
                        <i className="flaticon-phone" />
                      </div>
                      <div className="footer-contact-details">
                        <h6 className="footer-contact-label">Phone Number</h6>
                        <div className="contact-numbers">
                          <a
                            href={`tel:${footerData.contactInfo.phone.replace(/\D/g, '')}`}
                            className="contact-link"
                          >
                            {footerData.contactInfo.phone}
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  {footerData.contactInfo.email && (
                    <div className="contact-info-item">
                      <div className="contact-icon">
                        <i className="flaticon-message" />
                      </div>
                      <div className="footer-contact-details">
                        <h6 className="footer-contact-label">Email Address</h6>
                        <a
                          href={`mailto:${footerData.contactInfo.email}`}
                          className="contact-email"
                        >
                          {footerData.contactInfo.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Address */}
                  {(footerData.contactInfo.address.line1 || footerData.contactInfo.address.line2) && (
                    <div className="contact-info-item">
                      <div className="contact-icon">
                        <i className="flaticon-location-pin" />
                      </div>
                      <div className="footer-contact-details">
                        <h6 className="footer-contact-label">Store Location</h6>
                        <address className="contact-address">
                          {footerData.contactInfo.address.line1 && (
                            <>
                              {footerData.contactInfo.address.line1}
                              <br />
                            </>
                          )}
                          {footerData.contactInfo.address.line2 && (
                            <>
                              {footerData.contactInfo.address.line2}
                              <br />
                            </>
                          )}
                          {footerData.contactInfo.address.areaCode && (
                            <>{footerData.contactInfo.address.areaCode}.</>
                          )}
                        </address>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Search Section */}
        <div className="footer-quick-search">
          <div className="footer-container">
            <h5 className="quick-search-title">Quick Search</h5>
            <div className="quick-search-content">
              <span className="search-label">Categories :</span>
              <div className="search categories">
                {footerCategory.map((item, idx) => (
                  <React.Fragment key={idx}>
                    <NavLink
                      to={`/${item.link}`}
                      className="
  text-[var(--primary-text-color)]
  text-xs
  cursor-pointer
  hover:underline
  transition-colors
  duration-200
"
                    >
                      {item.title}
                    </NavLink>
                    {idx !== footerCategory.length - 1 && <span className="separator">|</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="footer-copyright">
          <div className="footer-container">
            <div className="copyright-content">
              <div className="copyright-text">
                <p>
                  © {footerData.company.year}{" "}
                  <Link to={footerData.company.website} className="company-name">
                    {footerData.company.name}
                  </Link>
                  . All rights reserved.
                </p>
              </div>
              <div className="developer-credit">
                <span className="crafted-by">Crafted By</span>
                <img
                  src={footerData.developer.logo}
                  alt={footerData.developer.name}
                  className="developer-logo"
                />
                <a
                  href={footerData.developer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="developer-link"
                >
                  {footerData.developer.name}
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;