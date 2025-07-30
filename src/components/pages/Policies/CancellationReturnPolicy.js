import React from 'react';
import {
  FaTimesCircle,
  FaExchangeAlt,
  FaUndo,
  FaEnvelope,
  FaWhatsapp,
  FaPhone,
} from 'react-icons/fa';
import './CancellationReturnPolicy.css';

const CancellationReturnPolicy = () => {
  return (
    <div className="crp-wrapper">
      <h1 className="crp-heading">Cancellation & Return Policy</h1>

      {/* Order Cancellation */}
      <div className="crp-card">
        <div className="crp-card-body">
          <div className="crp-section">
            <div className="crp-icon-wrapper crp-icon-cancel">
              <FaTimesCircle />
            </div>
            <div>
              <h2 className="crp-section-title">Order Cancellation</h2>
              <ul className="crp-list">
                <li>
                  <span className="crp-badge">1</span>
                  Orders can be cancelled within <strong>2 hours</strong> of placement via:
                  <div className="crp-contact-methods">
                    <span><FaEnvelope /> Email</span>
                    <span><FaWhatsapp /> WhatsApp</span>
                    <span><FaPhone /> Phone</span>
                  </div>
                </li>
                <li>
                  <span className="crp-badge">2</span>
                  Cancellation requests <strong>after dispatch</strong> or for <strong>customized products</strong> will not be entertained
                </li>
                <li>
                  <span className="crp-badge">3</span>
                  For prepaid cancellations within the allowed period, <strong>full refund</strong> will be issued within <strong>7–10 days</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Return Policy */}
      <div className="crp-card">
        <div className="crp-card-body">
          <div className="crp-section">
            <div className="crp-icon-wrapper crp-icon-return">
              <FaUndo />
            </div>
            <div>
              <h2 className="crp-section-title">Return Policy</h2>
              <p>
                We strive for <strong>100% customer satisfaction</strong>. However, we accept returns only under these conditions:
              </p>
              <ul className="crp-checklist">
                <li>✓ Item received is <strong>damaged, defective, or incorrect</strong></li>
                <li>✓ Return request must be raised within <strong>48 hours</strong> of delivery</li>
                <li>✓ Product should be <strong>unused, unworn, unwashed</strong> with original <strong>tags, invoice, packaging, and certificates</strong></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Non-Returnable Items */}
      <div className="crp-card">
        <div className="crp-card-body">
          <div className="crp-section">
            <div className="crp-icon-wrapper crp-icon-nonreturn">
              <FaTimesCircle />
            </div>
            <div>
              <h2 className="crp-section-title">Non-Returnable Items</h2>
              <div className="crp-grid">
                <div className="crp-box">
                  <h5>Customised Products</h5>
                  <p>Made-to-order or personalized items</p>
                </div>
                <div className="crp-box">
                  <h5>Used/Tampered Items</h5>
                  <p>Showing signs of use or tampering</p>
                </div>
                <div className="crp-box">
                  <h5>Gold-Polished Items</h5>
                  <p>Due to handmade nature and lighting variations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Return Procedure */}
      <div className="crp-card">
        <div className="crp-card-body">
          <div className="crp-section">
            <div className="crp-icon-wrapper crp-icon-procedure">
              <FaExchangeAlt />
            </div>
            <div>
              <h2 className="crp-section-title">Return Procedure</h2>
              <div className="crp-steps">
                <div className="crp-step">
                  <div className="crp-step-number">1</div>
                  <div className="crp-step-content">
                    <strong>Contact Us</strong> with order ID and product pictures showing defect/damage via:
                    <div className="crp-contact-methods">
                      <span><FaEnvelope /> Email</span>
                      <span><FaWhatsapp /> WhatsApp</span>
                    </div>
                  </div>
                </div>
                <div className="crp-step">
                  <div className="crp-step-number">2</div>
                  <div className="crp-step-content">
                    Our team will <strong>review</strong> and approve return if eligible
                  </div>
                </div>
                <div className="crp-step">
                  <div className="crp-step-number">3</div>
                  <div className="crp-step-content">
                    <strong>Reverse pickup</strong> arranged where available, otherwise customer to courier to our return address
                  </div>
                </div>
                <div className="crp-step">
                  <div className="crp-step-number">4</div>
                  <div className="crp-step-content">
                    After quality check, <strong>refund/replacement</strong> will be processed
                  </div>
                </div>
              </div>
              <div className="crp-note">
                <strong>Note:</strong> Refunds will be credited to the original payment method within 7-10 business days after approval
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancellationReturnPolicy;
