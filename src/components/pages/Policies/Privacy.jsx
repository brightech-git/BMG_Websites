import React from "react";
import "./PrivacyStyles.css";
import HeaderWithAuth from "../../layouts/HeaderWithAuth";
import Footertwo from "../../layouts/Footer";

const PrivacyPolicy = () => {
  return (
    <>
      <HeaderWithAuth />

      <div className="privacy-wrapper">
        <h1 className="privacy-heading">Privacy Policy</h1>

        <div className="privacy-accordion">

          <details className="privacy-item">
            <summary className="privacy-title">
              Information We Collect
              <span className="privacy-arrow-icon">▼</span>
            </summary>
            <ul className="privacy-content">
              <li>Personal identification details (name, email, phone number)</li>
              <li>Device information and browsing history</li>
              <li>Location and IP address</li>
            </ul>
          </details>

          <details className="privacy-item">
            <summary className="privacy-title">
              How We Use Your Data
              <span className="privacy-arrow-icon">▼</span>
            </summary>
            <ul className="privacy-content">
              <li>To improve our services and personalize user experience</li>
              <li>To communicate offers or important updates</li>
              <li>For analytics and security enhancement</li>
            </ul>
          </details>

          <details className="privacy-item">
            <summary className="privacy-title">
              What We Don't Do
              <span className="privacy-arrow-icon">▼</span>
            </summary>
            <ul className="privacy-content">
              <li>We do not sell your personal information</li>
              <li>We do not track your location without consent</li>
            </ul>
          </details>

          <details className="privacy-item">
            <summary className="privacy-title">
              Data Sharing
              <span className="privacy-arrow-icon">▼</span>
            </summary>
            <ul className="privacy-content">
              <li>We do not share your data with unaffiliated third parties</li>
              <li>We may share data with trusted service providers</li>
              <li>We may share data when legally required</li>
            </ul>
          </details>

        </div>

        <p className="privacy-note">
          Note: Your data is encrypted and securely stored as per industry standards.
        </p>
      </div>

      <Footertwo />
    </>
  );
};

export default PrivacyPolicy;
