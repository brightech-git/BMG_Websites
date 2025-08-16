import React from 'react';
import './PrivacyStyles.css';
import HeaderWithAuth from '../../layouts/HeaderWithAuth';
import Footertwo from '../../layouts/Footerthree';

const PrivacyPolicy = () => {
  return (
    <>
      <HeaderWithAuth />
      <div className="privacy-wrapper mt-80">
        <div className="privacy-container">
          <h1 className="privacy-heading">Privacy Policy</h1>

          <section className="privacy-block">
            <h2 className="privacy-subtitle">Information We Collect</h2>
            <ul className="privacy-list">
              <li>Personal identification details (name, email, phone number, etc.)</li>
              <li>Device information and browsing history</li>
              <li>Location and IP address</li>
            </ul>
          </section>

          <section className="privacy-block">
            <h2 className="privacy-subtitle">How We Use Your Data</h2>
            <ul className="privacy-list">
              <li>To improve our services and personalize your experience</li>
              <li>To communicate offers, promotions, or important updates</li>
              <li>For analytics and security enhancement</li>
            </ul>
          </section>

          <section className="privacy-block">
            <h2 className="privacy-subtitle">What We Don't Do</h2>
            <ul className="privacy-list">
              <li>We do not sell your personal information</li>
              <li>We do not track your location without consent</li>
            </ul>
          </section>

          <section className="privacy-block">
            <h2 className="privacy-subtitle">Data Sharing</h2>
            <div className="privacy-sharing-grid">
              <div className="privacy-box">
                <h4 className="privacy-box-title">We Do Not Share With</h4>
                <ul className="privacy-list">
                  <li>Unaffiliated third parties</li>
                  <li>Social media platforms</li>
                </ul>
              </div>
              <div className="privacy-box">
                <h4 className="privacy-box-title">We May Share With</h4>
                <ul className="privacy-list">
                  <li>Trusted service providers</li>
                  <li>Legal authorities (when required)</li>
                </ul>
              </div>
            </div>
          </section>

          <div className="privacy-note">
            Note: Your data is encrypted and securely stored as per industry standards.
          </div>
        </div>
      </div>
      <Footertwo />
    </>
  );
};

export default PrivacyPolicy;