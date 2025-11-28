import React from 'react';
import {
    FaImage,
    FaTag,
    FaCreditCard,
    FaGem,
    FaExclamationTriangle,
    FaCopyright,
    FaBalanceScale
} from 'react-icons/fa';
import './TermsConditions.css';
import HeaderWithAuth from '../../layouts/HeaderWithAuth';
import Footertwo from '../../layouts/Footerthree';

const TermsConditions = () => {
    const lastUpdated = new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <>
            <HeaderWithAuth />
            <div className="terms-wrapper">
                <div className="terms-container">
                    <h1 className="terms-heading">Terms & Conditions</h1>

                    <details className="terms-accordion">
                        <summary>
                            <span className="terms-icon"><FaImage /></span>
                            1. Product Representation
                            <span className="term-arrow-icon">▼</span>
                        </summary>
                        <ul className="terms-content">
                            <li><strong>Images are for reference only.</strong> Minor variations may occur.</li>
                            <li>All products are <strong>handcrafted</strong>, so slight irregularities are natural.</li>
                        </ul>
                        <div className="terms-note info">
                            For exact details, contact us before ordering.
                        </div>
                    </details>

                    <details className="terms-accordion">
                        <summary>
                            <span className="terms-icon"><FaTag /></span>
                            2. Pricing
                            <span className="term-arrow-icon">▼</span>
                        </summary>
                        <ul className="terms-content">
                            <li>All prices are in <strong>INR</strong> and inclusive of <strong>GST</strong></li>
                            <li>Prices may change <strong>without prior notice</strong></li>
                        </ul>
                        <div className="terms-note warning">
                            Final amount charged will be as displayed at checkout.
                        </div>
                    </details>

                    <details className="terms-accordion">
                        <summary>
                            <span className="terms-icon"><FaCreditCard /></span>
                            3. Payments
                            <span className="term-arrow-icon">▼</span>
                        </summary>
                        <ul className="terms-content">
                            <li>Online Payments: UPI, Debit/Credit Cards, Net Banking</li>
                            <li>Cash on Delivery: Selected PIN codes only, ₹50 COD fee may apply</li>
                        </ul>
                    </details>

                    <details className="terms-accordion">
                        <summary>
                            <span className="terms-icon"><FaGem /></span>
                            4. Product Use & Care
                            <span className="term-arrow-icon">▼</span>
                        </summary>
                        <ul className="terms-content">
                            <li>Handle <strong>gold-polished jewellery</strong> with care. Avoid water & chemicals.</li>
                            <li>Store in a <strong>dry pouch</strong> when not in use.</li>
                            <li>No guarantee for <strong>polish durability</strong>; depends on usage.</li>
                        </ul>
                        <div className="terms-note secondary">
                            Ask us for maintenance tips to extend product life.
                        </div>
                    </details>

                    <details className="terms-accordion">
                        <summary>
                            <span className="terms-icon"><FaExclamationTriangle /></span>
                            5. Limitation of Liability
                            <span className="term-arrow-icon">▼</span>
                        </summary>
                        <ul className="terms-content">
                            <li>Shipping delays or damage</li>
                            <li>Force majeure events</li>
                            <li>Improper use or care</li>
                        </ul>
                    </details>

                    <details className="terms-accordion">
                        <summary>
                            <span className="terms-icon"><FaCopyright /></span>
                            6. Intellectual Property
                            <span className="term-arrow-icon">▼</span>
                        </summary>
                        <ul className="terms-content">
                            <li>Copied or redistributed without permission</li>
                            <li>Used commercially</li>
                            <li>Altered or modified</li>
                        </ul>
                    </details>

                    <details className="terms-accordion">
                        <summary>
                            <span className="terms-icon"><FaBalanceScale /></span>
                            7. Governing Law
                            <span className="term-arrow-icon">▼</span>
                        </summary>
                        <ul className="terms-content">
                            <li>These terms are governed by <strong>Indian law</strong>.</li>
                            <li>Disputes will be settled in <strong>Madurai, Tamil Nadu</strong>.</li>
                        </ul>
                        <div className="terms-note info">
                            Contact us before placing orders if you have any questions.
                        </div>
                    </details>

                    {/* <div className="terms-update">
                        <strong>Last Updated:</strong> {lastUpdated}
                    </div> */}
                </div>
            </div>
            <Footertwo />
        </>
    );
};

export default TermsConditions;
