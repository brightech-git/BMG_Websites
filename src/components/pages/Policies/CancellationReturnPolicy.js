import React from "react";
import {
  FaTimesCircle,
  FaExchangeAlt,
  FaUndo,
  FaEnvelope,
  FaWhatsapp,
  FaPhone,
} from "react-icons/fa";
import "./CancellationReturnPolicy.css";
import Footertwo from "../../layouts/Footerthree";
import HeaderWithAuth from "../../layouts/HeaderWithAuth";

const CancellationReturnPolicy = () => {
  const orderCancellationList = [
    "Orders can be cancelled within 2 hours via Email, WhatsApp, Phone",
    "Cancellation requests after dispatch or for customized products will not be entertained",
    "For prepaid cancellations, full refund will be issued within 7–10 days",
  ];

  const returnPolicyList = [
    "Item received is damaged, defective, or incorrect",
    "Return request must be raised within 48 hours of delivery",
    "Product should be unused, unworn, unwashed with original tags, invoice, packaging, and certificates",
  ];

  const nonReturnableItems = [
    { title: "Customised Products", desc: "Made-to-order or personalized items" },
    { title: "Used/Tampered Items", desc: "Showing signs of use or tampering" },
    { title: "Gold-Polished Items", desc: "Due to handmade nature and lighting variations" },
  ];

  const returnProcedureSteps = [
    "Contact Us with order ID & product pictures via Email or WhatsApp",
    "Our team will review and approve return if eligible",
    "Reverse pickup arranged where available",
    "After quality check, refund/replacement will be processed",
  ];

  return (
    <>
      <HeaderWithAuth />
      <div className="crp-wrapper">
        <h1 className="crp-heading">Cancellation & Return Policy</h1>

        {/* Order Cancellation */}
        <details className="crp-accordion">
          <summary>
            <FaTimesCircle className="crp-icon" />
            Order Cancellation
          </summary>
          <ul className="crp-content">
            {orderCancellationList.map((item, index) => (
              <li key={index}>
               
                {item}
              </li>
            ))}
          </ul>
        </details>

        {/* Return Policy */}
        <details className="crp-accordion">
          <summary>
            <FaUndo className="crp-icon" />
            Return Policy
          </summary>
          <ul className="crp-content">
            {returnPolicyList.map((item, index) => (
              <li key={index}>
               
                {item}
              </li>
            ))}
          </ul>
        </details>

        {/* Non-Returnable Items */}
        <details className="crp-accordion">
          <summary>
            <FaTimesCircle className="crp-icon" />
            Non-Returnable Items
          </summary>
          <div className="crp-grid">
            {nonReturnableItems.map((item, index) => (
              <div className="crp-box" key={index}>
                <h5>{item.title}</h5>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </details>

        {/* Return Procedure */}
        <details className="crp-accordion">
          <summary>
            <FaExchangeAlt className="crp-icon" />
            Return Procedure
          </summary>
          <div className="crp-steps">
            {returnProcedureSteps.map((step, index) => (
              <div className="crp-step" key={index}>
                <div className="crp-step-content">{step}</div>
              </div>
            ))}
          </div>
        </details>
      </div>
      <Footertwo />
    </>
  );
};

export default CancellationReturnPolicy;
