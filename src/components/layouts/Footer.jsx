import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import Backtotop from "./Backtotop";
import logo from "../../assets/icons/logo.png";
import "./Footer.css";
import btsLogo from '../../assets/icons/btsLogo.jpg';
import { useFooterContent } from "../../hook/footer/useFooterContent";
import { useCompanyDetails } from "../../context/clientDetails/clientDetialContext";

const buildLink = (link) => {
  if (!link) return "/";
  return link.startsWith("/") ? link : `/${link}`;
};

// One footer category group — the parent link with its sub-categories listed directly below it.
const FooterCategoryGroup = ({ item }) => {
  const hasChildren = item.subLayers?.length > 0;

  return (
    <div className="footer-category-group">
      <NavLink
        to={buildLink(item.link)}
        className="footer-category-title"
      >
        {item.label}
      </NavLink>

      {hasChildren && (
        <div className="footer-category-children">
          {item.subLayers.map((child) => (
            <NavLink
              key={child.id}
              to={buildLink(child.link)}
              className="footer-category-link"
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

const Footer = () => {
  const { data: footerContent } = useFooterContent();
  const { details } = useCompanyDetails();

  // Centralized footer data
  const footerData = {
    company: {
      name: "BMG Jewellers Pvt Ltd",
      logo: `${details?.LOGO ? "https://app.bmgjewellers.com" + details.LOGO : logo}`,
      year: new Date().getFullYear(),
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
      playStore: "https://play.google.com/store/apps/details?id=com.jk_08.newapp&pcampaignid=web_share",
      playStoreImg: "https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
    },

    quickLinks: [
      { name: "About Us", href: "/about" },
      { name: "Why Choose Us", href: "/why-choose-us" },
      { name: "FAQ", href: "/faq" },
      { name: "Scheme", href: "/scheme" },
      {name: "Contact" ,href:"/contact"}
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
      name: "Brightech Software Services Pvt Ltd",
      website: "https://www.brightechsoftware.com/",
      logo: btsLogo
    }
  };

  const footerCategory = footerContent || [];

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
                <Link to="/" className="footer-logo">
                  <img
                    src={footerData.company.logo}
                    alt={footerData.company.name}
                    className="footer-logo-img"
                  />
                </Link>

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
                      <i className={item.icon} aria-hidden="true" />
                    </a>
                  ))}
                </div>

                {/* Download App Section */}
                <div className="footer-app-section">
                  <h6 className="app-section-title">Download our app</h6>
                  <div className="app-download-buttons">
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
              <nav className="footer-links-section" aria-label="Quick links">
                <h4 className="footer-section-title">Quick links</h4>
                <ul className="footer-links-list">
                  {footerData.quickLinks.map((link, index) => (
                    <li key={index} className="footer-link-item">
                      <Link to={link.href} className="footer-link">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Policy Links */}
              <nav className="footer-links-section" aria-label="Policies">
                <h4 className="footer-section-title">Policies</h4>
                <ul className="footer-links-list">
                  {footerData.policyLinks.map((link, index) => (
                    <li key={index} className="footer-link-item">
                      <Link to={link.href} className="footer-link">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Contact Information */}
              <div className="footer-contact-section">
                <h4 className="footer-section-title">Get in touch</h4>
                <div className="contact-info-list">
                  {/* Phone */}
                  {footerData.contactInfo.phone && (
                    <div className="contact-info-item">
                      <div className="contact-icon">
                        <Phone size={18} aria-hidden="true" />
                      </div>
                      <div className="footer-contact-details">
                        <h6 className="footer-contact-label">Phone Number</h6>
                        <div className="contact-numbers">
                          <a
                            href={`tel:${footerData.contactInfo.phone.replace(/[^+\d]/g, '')}`}
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
                        <Mail size={18} aria-hidden="true" />
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
                        <MapPin size={18} aria-hidden="true" />
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
                            <>{footerData.contactInfo.address.areaCode}</>
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
        {footerCategory.length > 0 && (
        <nav className="footer-quick-search" aria-label="Shop by category">
          <div className="footer-container">
            <h5 className="quick-search-title">Shop by category</h5>
            <div className="quick-search-content">
              <div className="footer-categories">
                {footerCategory.map((item) => (
                  <FooterCategoryGroup key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>
        </nav>
        )}

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