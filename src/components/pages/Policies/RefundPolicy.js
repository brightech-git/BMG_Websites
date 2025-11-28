import React from "react";
import HeaderWithAuth from "../../layouts/HeaderWithAuth";
import Footer from "../../layouts/Footerthree";
import "./ShippingPolicy.css";

const shippingSections = [
  {
    title: "General Shipping",
    items: [
      "The management of BMG JEWELLERS is happy to provide secured shipping to customers for purchased orders within the geographical boundary of India. The operations team and their associates strive to ensure delivery is made accurately, in perfect condition, and on time. At present, delivery is available in ALL towns, cities, and villages. The user must provide the full name, address, and contact number of the recipient."
    ]
  },
  {
    title: "Delivery Schedule",
    items: [
      "BMG JEWELLERS aims to deliver shipments to customers within 3 to 7 working days, depending on the availability of products.",
      "In certain cases, it may take more than 3 to 7 working days for designing or procuring the product. Customer will be informed promptly.",
      "Delivery guarantee is subject to the terms and conditions of the respective courier service or shipping agent.",
      "Errors in recipient info may prevent delivery.",
      "Estimated delivery time starts from dispatch date; it may vary depending on circumstances.",
      "Orders are processed for shipping only after payment approval."
    ]
  },
  {
    title: "Shipment Procedure",
    items: [
      "Shipment delivered only to specified delivery address confirmed by the user.",
      "For gift shipments, recipient signature is required.",
      "Support team may contact customers to confirm address, availability, etc.",
      "Shipment can be tracked via courier agent. Not responsible for delays due to courier or statutory clearance."
    ]
  },
  {
    title: "Force Majeure",
    items: [
      "Any delay or failure in delivery caused by Force Majeure events (acts of God, natural disasters, strikes, government restrictions, etc.) is excused and BMG JEWELLERS is not responsible."
    ]
  },
  {
    title: "Return Shipments",
    items: [
      "If the shipment is not in good condition or shows signs of tampering, refuse delivery and return package.",
      "Courier may attempt delivery twice more; if not received, shipment returns to BMG JEWELLERS and customer bears shipping and handling charges."
    ]
  },
  {
    title: "Packaging",
    items: [
      "BMG JEWELLERS packages all items carefully in shockproof boxes with tamper-proof seal. Special gift packaging available upon request."
    ]
  }
];

const ShippingPolicy = () => {
  return (
    <>
      <HeaderWithAuth />
      <div className="shipping-policy">
        <div className="policy-wrapper">
          <h2 className="policy-title">Shipping Policy</h2>

          {shippingSections.map((section, index) => (
            <details className="policy-accordion" key={index}>
              <summary>{section.title}</summary>
              <ul className="policy-content">
                {section.items.map((item, idx) => (
                  
                  <li key={idx}>
                 
                    {item}
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ShippingPolicy;
