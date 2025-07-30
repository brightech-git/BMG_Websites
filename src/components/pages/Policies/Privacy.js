import React from 'react';
import './PrivacyStyles.css';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-wrapper">
      <div className="privacy-container">
        <h1 className="privacy-heading">Privacy Policy</h1>

        <section className="privacy-block">
          <h2 className="privacy-subtitle">Information We Collect</h2>
          <ul className="privacy-bullet-list">
            <li>Personal identification details (name, email, phone number, etc.)</li>
            <li>Device information and browsing history</li>
            <li>Location and IP address</li>
          </ul>
        </section>

        <section className="privacy-block">
          <h2 className="privacy-subtitle">How We Use Your Data</h2>
          <ul className="privacy-check-list">
            <li><span className="privacy-icon tick">✔</span>To improve our services and personalize your experience</li>
            <li><span className="privacy-icon tick">✔</span>To communicate offers, promotions, or important updates</li>
            <li><span className="privacy-icon tick">✔</span>For analytics and security enhancement</li>
          </ul>
        </section>

        <section className="privacy-block">
          <h2 className="privacy-subtitle">What We Don’t Do</h2>
          <ul className="privacy-check-list">
            <li><span className="privacy-icon cross">✖</span>We do not sell your personal information</li>
            <li><span className="privacy-icon cross">✖</span>We do not track your location without consent</li>
          </ul>
        </section>

        <section className="privacy-block">
          <h2 className="privacy-subtitle">Data Sharing</h2>
          <div className="privacy-sharing-grid">
            <div className="privacy-box no-share">
              <h4 className="privacy-box-title">We Do Not Share With</h4>
              <ul>
                <li>Unaffiliated third parties</li>
                <li>Social media platforms</li>
              </ul>
            </div>
            <div className="privacy-box may-share">
              <h4 className="privacy-box-title">We May Share With</h4>
              <ul>
                <li>Trusted service providers</li>
                <li>Legal authorities (when required)</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="privacy-note-box">
          Note: Your data is encrypted and securely stored as per industry standards.
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
