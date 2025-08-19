import React from "react";
import HeaderWithAuth from "../../layouts/HeaderWithAuth";
import Footer from "../../layouts/Footerthree";
import "./ShippingPolicy.css";

const ShippingPolicy = () => {
  return (
    <>
      <HeaderWithAuth />
      <div className="shipping-policy">
        <div className="policy-wrapper">
          <h2 className="policy-title">SHIPPING POLICY</h2>
          <div className="policy-content">
            <ul className="policy-list">
              <li className="policy-list-item">
                The management of <b>BMG JEWELLERS</b> is happy to provide secured
                shipping to customers for purchased orders within the geographical
                boundary of India. The operations team and their associates strive
                to ensure delivery is made accurately, in perfect condition, and on
                time. At present, delivery is available in <b>ALL towns, cities, and villages</b>. The user must provide the full name, address, and contact number of the recipient.
              </li>
            </ul>

            <h5>Delivery Schedule</h5>
            <ul className="policy-list">
              <li className="policy-list-item">
                BMG JEWELLERS aims to deliver shipments to customers within 3 to 7
                working days, depending on the availability of products at
                showrooms, registered warehouses, or factories.
              </li>
              <li className="policy-list-item">
                In certain cases, it may take more than 3 to 7 working days for
                designing or procuring the product. In such situations, the
                customer will be promptly informed about the status.
              </li>
              <li className="policy-list-item">
                Delivery guarantee is subject to the terms and conditions of the
                respective courier service or shipping agent.
              </li>
              <li className="policy-list-item">
                If there are any errors in the recipient's name, contact number, or
                address, or if the recipient is not available at the time of
                delivery, the product may not be delivered.
              </li>
              <li className="policy-list-item">
                The estimated delivery time mentioned in the terms and conditions
                begins from the date of dispatch. This is for guidance purposes
                only and may vary depending on circumstances.
              </li>
              <li className="policy-list-item">
                The order will be processed for shipping only after the
                credit/debit card details provided are approved by the bank.
              </li>
            </ul>

            <h5>Shipment Procedure</h5>
            <ul className="policy-list">
              <li className="policy-list-item">
                The shipment shall be delivered only to the specified delivery
                address confirmed by the user. Customers have the option of
                changing the delivery address any number of times before the order
                is processed for shipment. Once the shipment is processed, neither
                the specified receiver nor the delivery address can be changed. Any
                number of products ordered for a single delivery address will be
                bundled together and shipped as a single shipment.
              </li>
              <li className="policy-list-item">
                In case of shipping gifts, the recipient must provide their
                signature. The recipient's signature serves as acknowledgment and
                verification of delivery.
              </li>
              <li className="policy-list-item">
                The support team of BMG JEWELLERS may contact you to confirm your
                address, availability, etc., before shipping the product. The
                shipment can be tracked by the customer by checking with the
                courier agent. We are not responsible for any delays caused by
                courier agencies or due to time required for statutory clearances
                during the delivery process.
              </li>
            </ul>

            <h5>Force Majeure</h5>
            <ul className="policy-list">
              <li className="policy-list-item">
                Any delay or failure in delivery shall be excused, and BMG
                Jewellery Ltd is not responsible if and to the extent caused by a
                Force Majeure event. For the purposes of this Agreement, Force
                Majeure shall mean a cause or event that is not reasonably
                foreseeable or caused by or under the control of the Parties
                (including bmgjewellers.com and the courier company) claiming Force
                Majeure, including acts of God, natural disasters or emergencies
                like fires, floods, explosions, riots, wars, hurricanes, sabotage,
                terrorism, vandalism, accidents, governmental restrictions,
                prohibitions, enactments on import or export regulations, foreign
                or domestic exchange regulations, injunctions, unavailability of
                transit, labor strikes (other than those of the Seller, BMG
                Jewellery, or its courier agent), or other eventslue beyond the
                reasonable anticipation and control of the company affected,
                despite reasonable efforts to prevent, avoid, delay, or mitigate
                such events or their effects, and which are not attributable to a
                failure to deliver its obligations under this Agreement.
              </li>
            </ul>

            <h5>Return Shipments</h5>
            <ul className="policy-list">
              <li className="policy-list-item">
                If you suspect that the shipment delivered is 'not in good
                condition,' shows signs of tampering, or if the package is
                tampered, you shall refuse to acknowledge receipt and return the
                package before accepting it.
              </li>
              <li className="policy-list-item">
                If the authorized recipient is unavailable to receive and
                acknowledge the package, the courier agent may attempt delivery
                twice after the first attempt, as per their policy. If the
                recipient does not receive the package after all three attempts,
                the package will be shipped back to the office of BMG JEWELLERS
                PVT Ltd, and all costs incurred through the shipment shall be borne
                by the customer along with handling charges. The customer shall
                also bear the shipping charges when the package is shipped again.
                Refer to the 'Cancellation Terms' section if the customer cancels
                after a failed delivery.
              </li>
            </ul>

            <h5>Packaging</h5>
            <ul className="policy-list">
              <li className="policy-list-item">
                BMG Jewellery takes special care in packaging your precious
                purchase. The jewels purchased are secured in a shockproof box,
                layered with a durable and tamper-proof seal from BMGJL. Every
                package is video-recorded for security reasons. If a user requests
                a special gift pack, bmgjewellers.com will gift-wrap it along with
                the words you wish the recipient to receive.
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ShippingPolicy;