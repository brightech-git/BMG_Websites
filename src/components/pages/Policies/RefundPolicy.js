import React from 'react';
import { useHistory } from 'react-router-dom';
import './ShippingReturns.css';
import HeaderWithAuth from '../../layouts/HeaderWithAuth';
import Footertwo from '../../layouts/Footerthree';

const ShippingReturns = () => {
  const history = useHistory();

  const handleContactClick = () => {
    history.push('/contact');
  };

  return (
    <>
    <HeaderWithAuth />
    <section className="shipping-section mt-80">
      <div className="container">
        <div className="shipping-header text-center mb-5">
          <h2 className="shipping-title">
            <span className="shipping-title-line">BMG Jewellers</span>
            <span className="shipping-title-line shipping-script">Shipping & Returns Policy</span>
          </h2>
          <p className="shipping-subtitle">
            Your guide to our policies for Gold Polish Silver Jewellery Collection
          </p>
        </div>
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="shipping-card mb-4">
              <div className="card border-0">
                <div className="card-body">
                  <h3 className="shipping-card-title">Shipping</h3>
                  <div className="shipping-card-content">
                    <h4>Processing & Dispatch</h4>
                    <ul>
                      <li>Orders are typically processed and shipped within 48 hours of placement.</li>
                      <li>Personalised or made-to-order items may take longer to process.</li>
                      <li>If your order includes both personalised/made-to-order and ready-stock items, ready-stock items may ship first, with personalised items sent separately.</li>
                    </ul>
                    <h4>Shipping Charges</h4>
                    <ul>
                      <li>Free shipping on all orders above ₹449 within India.</li>
                      <li>Shipping charges apply for all international orders and returns (calculated at checkout).</li>
                    </ul>
                    <h4>Order Tracking</h4>
                    <ul>
                      <li>Once shipped, tracking details will be sent via WhatsApp, Email, and SMS.</li>
                    </ul>
                    <h4>Split Deliveries</h4>
                    <ul>
                      <li>Orders containing personalised items or gold-polished premium jewellery, silver articles, or jewellery may be delivered in multiple shipments.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="shipping-card mb-4">
              <div className="card border-0">
                <div className="card-body">
                  <h3 className="shipping-card-title">Returns & Exchanges</h3>
                  <div className="shipping-card-content">
                    <h4>Return Policy</h4>
                    <ul>
                      <li>30-day return policy for unused, unworn, and undamaged products — no questions asked.</li>
                      <li>Returns are not applicable for personalised jewellery, gift articles, utensils, religious idols, or promotional/free products unless defective or incorrect.</li>
                      <li>Refunds processed only after the returned product passes our quality check.</li>
                      <li>If purchased from an authorised partner or third-party store, their return policy applies.</li>
                      <li>Shipping charges paid at the time of order are non-refundable.</li>
                    </ul>
                    <h4>Missing Items in Return Orders</h4>
                    <ul>
                      <li>If any item from a multi-product return is missing, BMG Jewellers may deduct up to the full MRP of the missing product from the refund, including promotional/free gifts.</li>
                    </ul>
                    <h4>Refunds</h4>
                    <ul>
                      <li>Refunds are initiated after we receive and verify the returned product at our warehouse.</li>
                      <li>Refund mode will match the original payment method unless otherwise agreed.</li>
                    </ul>
                    <h4>Replacements & Exchanges</h4>
                    <ul>
                      <li>Replacements or exchanges follow the same conditions as returns.</li>
                      <li>For gold-polished silver jewellery, silver articles, or jewellery, replacements ship only after we receive the original item.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="shipping-card mb-4">
              <div className="card border-0">
                <div className="card-body">
                  <h3 className="shipping-card-title">Return Process</h3>
                  <div className="shipping-card-content">
                    <ol>
                      <li>
                        <strong>Initiate a Return:</strong> Request a return through our website or contact our{' '}
                        <span
                          className="shipping-link"
                          onClick={handleContactClick}
                          role="button"
                          tabIndex={0}
                          aria-label="Contact Customer Support"
                        >
                          Customer Support
                        </span>{' '}
                        team.
                      </li>
                      <li>
                        <strong>Reverse Pick-Up:</strong> Our courier partner will arrange collection from your address. Ensure availability and respond to calls from the delivery agent to avoid delays.
                      </li>
                      <li>
                        <strong>Non-Serviceable Locations:</strong> If reverse pick-up is unavailable, send the product via India Post or another courier. We reimburse up to ₹70 for return shipping; extra costs beyond ₹70 will be deducted from your refund.
                      </li>
                    </ol>
                    <h4>Important Notes</h4>
                    <ul>
                      <li>For empty parcel or missing product complaints, contact us within 48 hours of delivery with a 360° unboxing video clearly showing the package before opening.</li>
                      <li>Tampered packaging or insufficient proof may result in claim rejection.</li>
                      <li>Final decisions on such claims rest with BMG Jewellers.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <button
                className="shipping-contact-btn"
                onClick={handleContactClick}
                aria-label="Contact us for support"
              >
                Contact Us for Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <Footertwo />
    </>
  );
};

export default ShippingReturns;