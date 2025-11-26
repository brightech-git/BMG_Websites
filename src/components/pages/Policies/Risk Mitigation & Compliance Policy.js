import React, { useState } from "react";
import HeaderWithAuth from "../../layouts/HeaderWithAuth";
import Footer from "../../layouts/Footerthree";
import "./RiskPolicyPage.css";

const sections = [
    {
        title: "1. Legal & Regulatory Compliance",
        items: [
            "Compliance with BIS and hallmarking norms where applicable.",
            "Maintenance of GST registration and proper invoicing.",
            "Adherence to e-commerce regulations under Indian law.",
            "AML (Anti-Money Laundering) checks for suspicious or unusually large transactions.",
        ],
    },
    {
        title: "2. Authentication & Valuation",
        items: [
            "Every product clearly described as 'Silver Jewellery with Gold Polish'.",
            "Transparent product listings with weight, finish, and material details.",
            "Valuation done based on silver base and gold polish category (not bullion).",
        ],
    },
    {
        title: "3. Secure Payment Methods",
        items: [
            "Payments accepted only through secure, PCI-DSS compliant gateways.",
            "Support for UPI, net banking, and major credit/debit cards.",
            "No handling of cash transactions for online orders.",
        ],
    },
    {
        title: "4. Shipping & Insurance Policies",
        items: [
            "Orders shipped only via reputed logistics partners with tracking.",
            "Insurance coverage provided against loss or damage during transit.",
            "Tamper-proof packaging to prevent substitution or pilferage.",
        ],
    },
    {
        title: "5. Customer Dispute & Grievance Redressal",
        items: [
            "Clear return/refund policy disclosed on website.",
            "Dedicated customer support team for order and payment-related issues.",
            "Dispute resolution mechanisms in compliance with consumer protection law.",
        ],
    },
    {
        title: "6. Fraud Prevention & Monitoring",
        items: [
            "Transaction monitoring to detect unusual purchase patterns.",
            "OTP and CVV validation for all payments.",
            "Address verification for first-time and high-value buyers.",
        ],
    },
    {
        title: "Conclusion",
        items: [
            "Through these measures, BMG Jewellers ensures that risks associated with online sale of silver jewellery with gold polish are minimized. The business maintains compliance with regulatory requirements, provides customer trust and transparency, and ensures a secure, fraud-free shopping experience.",
        ],
    },
];

const PolicyPage = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <>
            <HeaderWithAuth />

            <div className="policy-wrapper">
                <h1 className="riskPolicy-title">BMG Jewellers – Risk Mitigation & Compliance Policy</h1>

                <p className="risk-policy-intro">
                    BMG Jewellers is engaged in the online sale of silver jewellery with gold polish. The products offered
                    are lifestyle/fashion jewellery and are not investment-grade gold bullion. While the segment involves
                    handling of precious metals, the associated risks are mitigated through secure processes, customer
                    verification, and compliant business practices.
                </p>

                <div className="risk-custom-accordion">
                    {sections.map((section, idx) => (
                        <div key={idx} className="risk-accordion-item">
                            <button
                                className={`accordion-header ${openIndex === idx ? "active" : ""}`}
                                onClick={() => toggleAccordion(idx)}
                            >
                                <span>{section.title}</span>
                                <span className={`arrow ${openIndex === idx ? "open" : ""}`}>⌄</span>
                            </button>

                            <div className={`accordion-content ${openIndex === idx ? "show" : ""}`}>
                                <ul>
                                    {section.items.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </>
    );
};

export default PolicyPage;
