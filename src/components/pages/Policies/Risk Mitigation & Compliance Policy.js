import React from 'react';
import './PolicyPage.css';
import HeaderWithAuth from '../../layouts/HeaderWithAuth';
import Footer from '../../layouts/Footerthree';

const PolicyPage = () => {
    return (
        <>
            <HeaderWithAuth />
            <div className="policy-container mt-120">
                <div className="policy-content">
                    <h1 className="policy-title">BMG Jewellers – Risk Mitigation & Compliance Policy</h1>
                    <h6 className="policy-intro">
                        BMG Jewellers is engaged in the online sale of silver jewellery with gold polish. The products offered are lifestyle/fashion jewellery and are not investment-grade gold bullion. While the segment involves handling of precious metals, the associated risks are mitigated through secure processes, customer verification, and compliant business practices.
                    </h6>

                    <section className="policy-section">
                        <h2 className="policy-subtitle">1. Legal & Regulatory Compliance</h2>
                        <ul className="policy-list">
                            <li>Compliance with BIS and hallmarking norms where applicable.</li>
                            <li>Maintenance of GST registration and proper invoicing.</li>
                            <li>Adherence to e-commerce regulations under Indian law.</li>
                            <li>AML (Anti-Money Laundering) checks for suspicious or unusually large transactions.</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h2 className="policy-subtitle">2. Authentication & Valuation</h2>
                        <ul className="policy-list">
                            <li>Every product clearly described as 'Silver Jewellery with Gold Polish'.</li>
                            <li>Transparent product listings with weight, finish, and material details.</li>
                            <li>Valuation done based on silver base and gold polish category (not bullion).</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h2 className="policy-subtitle">3. Secure Payment Methods</h2>
                        <ul className="policy-list">
                            <li>Payments accepted only through secure, PCI-DSS compliant gateways.</li>
                            <li>Support for UPI, net banking, and major credit/debit cards.</li>
                            <li>No handling of cash transactions for online orders.</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h2 className="policy-subtitle">4. Shipping & Insurance Policies</h2>
                        <ul className="policy-list">
                            <li>Orders shipped only via reputed logistics partners with tracking.</li>
                            <li>Insurance coverage provided against loss or damage during transit.</li>
                            <li>Tamper-proof packaging to prevent substitution or pilferage.</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h2 className="policy-subtitle">5. Customer Dispute & Grievance Redressal</h2>
                        <ul className="policy-list">
                            <li>Clear return/refund policy disclosed on website.</li>
                            <li>Dedicated customer support team for order and payment-related issues.</li>
                            <li>Dispute resolution mechanisms in compliance with consumer protection law.</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h2 className="policy-subtitle">6. Fraud Prevention & Monitoring</h2>
                        <ul className="policy-list">
                            <li>Transaction monitoring to detect unusual purchase patterns.</li>
                            <li>OTP and CVV validation for all payments.</li>
                            <li>Address verification for first-time and high-value buyers.</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h2 className="policy-subtitle">Conclusion</h2>
                        <h6 className="policy-text">
                            Through these measures, BMG Jewellers ensures that risks associated with online sale of silver jewellery with gold polish are minimized. The business maintains compliance with regulatory requirements, provides customer trust and transparency, and ensures a secure, fraud-free shopping experience.
                        </h6>
                    </section>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default PolicyPage;