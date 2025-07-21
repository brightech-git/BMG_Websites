import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Styles.css"; // Import the CSS (see below)
import beadsImage from "../../../assets/img/shop/shop3.webp";

const productInfo = {
  title: "Beads Chokapora",
  desc: "Rose Gold Plated / Birthday",
  image: beadsImage, // Local image
  qty: 1,
  price: 765.0,
};

const subtotal = productInfo.price;
const shipping = null; // "Enter shipping address"
const total = subtotal;

const Checkout = () => {
  const [summaryOpen, setSummaryOpen] = useState(false);

  return (
    <div className="shopify-checkout-root">
      <div className="shopify-checkout-main">
        {/* --- Mobile/Tablet collapsible order summary --- */}
        <div className="order-summary-toggle-mobile">
          <button
            className="order-summary-toggle-btn"
            onClick={() => setSummaryOpen(!summaryOpen)}
            aria-expanded={summaryOpen}
            aria-controls="orderSummaryMobile"
          >
            <span>Show order summary</span>
            <span className="order-summary-toggle-total">
              <span className="order-summary-toggle-currency">USD</span> $
              {total.toFixed(2)}
            </span>
            <span className="order-summary-toggle-arrow">
              {summaryOpen ? "▲" : "▼"}
            </span>
          </button>
          <div
            className={`order-summary-mobile-panel${
              summaryOpen ? " open" : ""
            }`}
            id="orderSummaryMobile"
            aria-hidden={!summaryOpen}
          >
            <OrderSummaryContent />
          </div>
        </div>
        {/* -------- Left: Checkout Form -------- */}
        <div className="shopify-checkout-form">
          <form>
            <section className="section-block">
              <div className="checkout-row between">
                <h2 className="section-title">Contact</h2>
                <Link className="checkout-login-link" to="#">
                  Log in
                </Link>
              </div>
              <input
                className="checkout-input"
                type="text"
                placeholder="Email or mobile phone number"
              />
              <div class="checkbox-row">
                <input type="checkbox" id="offers" />
                <label for="offers">Email me with news and offers</label>
              </div>
            </section>
            <section className="section-block">
              <h2 className="section-title">Delivery</h2>
              <select className="checkout-input">
                <option>Country/Region</option>
                <option>United States</option>
                <option>India</option>
              </select>
              <div className="checkout-row gap">
                <input
                  className="checkout-input"
                  placeholder="First name (optional)"
                />
                <input className="checkout-input" placeholder="Last name" />
              </div>
              <input className="checkout-input" placeholder="Address" />
              <input
                className="checkout-input"
                placeholder="Apartment, suite, etc. (optional)"
              />
              <div className="checkout-row gap">
                <input className="checkout-input" placeholder="City" />
                <select className="checkout-input">
                  <option>State</option>
                  <option>Alabama</option>
                  <option>California</option>
                </select>
                <input className="checkout-input" placeholder="ZIP code" />
              </div>
              <label className="checkbox-row">
                <input type="checkbox" /> Save this information for next time
              </label>
            </section>
            {/* <section className="section-block">
              <h2 className="section-title">Shipping method</h2>
              <div className="checkout-shipping-method-hint">
                Enter your shipping address to view available shipping methods.
              </div>
            </section> */}
            <section className="section-block">
              <h2 className="section-title">Payment</h2>
              <div style={{ fontSize: 14, color: "#5c5c5c", marginBottom: 16 }}>
                All transactions are secure and encrypted.
              </div>
              <div className="checkout-payment-wrapper">
                <div className="checkout-payment-tab">
                  <span>Credit card</span>
                  <span className="checkout-payment-badge">B</span>
                </div>
                <input
                  className="checkout-input"
                  placeholder="Card number"
                  style={{ marginBottom: 0 }}
                />
                <div className="checkout-row gap" style={{ margin: 0 }}>
                  <input
                    className="checkout-input"
                    placeholder="Expiration date (MM / YY)"
                  />
                  <input
                    className="checkout-input"
                    placeholder="Security code"
                  />
                </div>
                <input className="checkout-input" placeholder="Name on card" />
                <label className="checkbox-row">
                  <input type="checkbox" checked readOnly /> Use shipping
                  address as billing address
                </label>
              </div>
              <button type="submit" className="pay-now-btn">
                Pay now
              </button>
            </section>
          </form>
        </div>
        {/* -------- Right: Desktop Order Summary -------- */}
        <div className="shopify-checkout-summary">
          <OrderSummaryContent />
        </div>
      </div>
    </div>
  );
};

function OrderSummaryContent() {
  return (
    <aside className="checkout-summary-panel">
      {/* Product Row */}
      <div className="summary-product-row">
        <div className="summary-product-thumb-wrap">
          <img
            src={productInfo.image}
            alt={productInfo.title}
            className="summary-product-thumb"
          />
          {/* <span className="summary-qty-badge">{productInfo.qty}</span> */}
        </div>
        <div className="summary-product-details">
          <div className="summary-product-title">{productInfo.title}</div>
          <div className="summary-product-desc">{productInfo.desc}</div>
        </div>
        <div className="summary-product-price">
          ${productInfo.price.toFixed(2)}
        </div>
      </div>
      {/* Totals */}
      <div className="summary-breakdown">
        <div className="summary-row">
          <div>Subtotal</div>
          <div>${subtotal.toFixed(2)}</div>
        </div>
        <div className="summary-row">
          <div>Shipping</div>
          <div className="summary-hint">Enter shipping address</div>
        </div>
        <div className="summary-row summary-row-total">
          <div>
            <b>Total</b>
          </div>
          <div>
            <span style={{ fontSize: 14, color: "#888", marginRight: 4 }}>
              USD
            </span>
            <b>${total.toFixed(2)}</b>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Checkout;
