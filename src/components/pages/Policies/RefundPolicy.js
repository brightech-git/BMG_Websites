import React from 'react';
import {
  FaMoneyBillWave,
  FaClock,
  FaShippingFast,
  FaExclamationTriangle,
  FaCheckCircle
} from 'react-icons/fa';

import './RefundPolicy.css';

const RefundPolicy = () => {
  return (
    <div className="refund-wrapper">
      <div className="refund-container">
        <h1 className="refund-heading">Refund Policy</h1>

        {/* Refund Eligibility */}
        <section className="refund-section">
          <div className="refund-icon-box">
            <FaCheckCircle className="refund-icon eligibility" />
          </div>
          <div className="refund-content">
            <h2 className="refund-title">Refund Eligibility</h2>
            <p>Refunds are provided only for:</p>
            <ul className="refund-list">
              <li><span className="refund-badge">1</span> Cancelled prepaid orders (before dispatch)</li>
              <li><span className="refund-badge">2</span> Returned items approved under our Return Policy</li>
            </ul>
            <div className="refund-warning">
              <FaExclamationTriangle className="refund-alert-icon" />
              Refunds not applicable after dispatch or for custom-made products.
            </div>
          </div>
        </section>

        {/* Refund Mode and Time */}
        <section className="refund-section">
          <div className="refund-icon-box">
            <FaMoneyBillWave className="refund-icon mode" />
          </div>
          <div className="refund-content">
            <h2 className="refund-title">Refund Mode and Time</h2>
            <div className="refund-grid">
              <div className="refund-box">
                <h3>Prepaid Orders</h3>
                <p>
                  Refunded to <strong>original payment method</strong><br />
                  <span className="refund-time">
                    <FaClock /> 7–10 business days
                  </span>
                </p>
              </div>
              <div className="refund-box">
                <h3>Cash on Delivery (COD)</h3>
                <p>
                  Refunded via <strong>NEFT/IMPS</strong><br />
                  <span className="refund-time">
                    <FaClock /> 7–10 business days
                  </span>
                </p>
              </div>
            </div>
            <div className="refund-note">
              Refund time depends on bank/payment gateway; may take 2–3 extra days to reflect.
            </div>
          </div>
        </section>

        {/* Shipping Refunds */}
        <section className="refund-section">
          <div className="refund-icon-box">
            <FaShippingFast className="refund-icon shipping" />
          </div>
          <div className="refund-content">
            <h2 className="refund-title">Shipping Charge Refunds</h2>
            <ul className="refund-list">
              <li><span className="refund-cross">✗</span> Shipping charges are non-refundable</li>
              <li><span className="refund-check">✓</span> Refunded if return is due to <strong>our mistake</strong></li>
            </ul>
            <div className="refund-example">
              <strong>Example:</strong> If you received a wrong item, both product and shipping costs are refunded.
            </div>
          </div>
        </section>

        {/* Delayed Refunds */}
        <section className="refund-section">
          <div className="refund-icon-box">
            <FaExclamationTriangle className="refund-icon delay" />
          </div>
          <div className="refund-content">
            <h2 className="refund-title">Delayed or Missing Refunds</h2>
            <p>If you haven't received your refund yet:</p>
            <ol className="refund-steps">
              <li>Check your bank or UPI inbox/spam</li>
              <li>Contact your bank or payment gateway</li>
              <li>
                Contact our support team with:
                <ul>
                  <li>Order number</li>
                  <li>Refund request date</li>
                  <li>Payment method</li>
                </ul>
              </li>
            </ol>
            <div className="refund-warning">
              <FaClock className="refund-alert-icon" />
              Allow up to <strong>10 business days</strong> before contacting support.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RefundPolicy;
