import React from "react";
import './PrivacyStyles.css';

const PrivacyPolicy = () => (
  <section className="privacy-policy-container">
    <div className="privacy-policy-content">
      <h1 className="privacy-title">Privacy Policy</h1>

      <section className="privacy-section">
        <h2 className="privacy-subheading">1. Introduction</h2>
        <p>
          Your privacy is extremely important to us. This policy outlines how we collect, use, and safeguard your information when you use our website or services.
        </p>
      </section>

      <section className="privacy-section">
        <h2 className="privacy-subheading">2. Data Collected</h2>
        <ul className="privacy-list">
          <li>
            <strong>Name</strong> and contact details
          </li>
          <li>
            <strong>Email address</strong> and <strong>phone number</strong>
          </li>
          <li>
            <strong>Shipping and billing address</strong>
          </li>
          <li>
            <strong>Payment details</strong> (processed securely through third-party gateways)
          </li>
          <li>
            <strong>Device and browser information</strong> (via cookies)
          </li>
        </ul>
      </section>

      <section className="privacy-section">
        <h2 className="privacy-subheading">3. How We Use Your Data</h2>
        <ul className="privacy-list privacy-tick-list">
          <li>
            <span className="tick">✓</span> To <strong>process orders</strong> and payments
          </li>
          <li>
            <span className="tick">✓</span> To <strong>communicate</strong> order updates, offers, and support
          </li>
          <li>
            <span className="tick">✓</span> To <strong>improve our website</strong> and customer experience
          </li>
          <li>
            <span className="tick">✓</span> For <strong>internal analytics</strong> and reporting
          </li>
        </ul>
        <p className="privacy-note">
          We only process data necessary for providing our services to you.
        </p>
      </section>

      <section className="privacy-section">
        <h2 className="privacy-subheading">4. Data Sharing</h2>
        <div className="privacy-sharing">
          <div className="privacy-noshare">
            <span className="cross">✗</span> <strong>We Do Not</strong>
            <ul>
              <li>Sell or rent your personal data</li>
              <li>Share with marketing companies</li>
            </ul>
          </div>
          <div className="privacy-may-share">
            <span className="tick">✓</span> <strong>We May Share With</strong>
            <ul>
              <li>Courier services for delivery</li>
              <li>Payment gateways for processing</li>
              <li>Legal authorities when required</li>
            </ul>
          </div>
        </div>
        <p className="privacy-note">
          All third parties are contractually obligated to protect your data.
        </p>
      </section>

      <section className="privacy-section">
        <h2 className="privacy-subheading">5. Security Measures</h2>
        <ul className="privacy-list">
          <li>
            <strong>Encryption:</strong> All transactions use <strong>SSL (Secure Socket Layer)</strong> technology
          </li>
          <li>
            <strong>Data Storage:</strong> Information stored on <strong>secure servers</strong> with regular monitoring
          </li>
          <li>
            While we implement strong security, no internet transmission is 100% secure
          </li>
        </ul>
      </section>

      <section className="privacy-section">
        <h2 className="privacy-subheading">6. Cookies</h2>
        <p>
          Our website uses cookies for:
        </p>
        <ul className="privacy-list">
          <li>Performance</li>
          <li>Site functionality</li>
          <li>Analytics</li>
          <li>Visitor statistics</li>
          <li>Personalization</li>
          <li>User preferences</li>
        </ul>
        <p>
          You can <strong>disable cookies</strong> in your browser settings, but some site features may not work properly.
        </p>
      </section>
    </div>
  </section>
);

export default PrivacyPolicy;
