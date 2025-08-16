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
    return (
        <>
            <HeaderWithAuth />
            <div className="terms-wrapper">
                <div className="terms-container">
                    <h1 className="terms-heading">Terms & Conditions</h1>

                    {/* 1. Product Representation */}
                    <div className="terms-card">
                        <div className="terms-card-body">
                            <div className="terms-card-content">
                                <div className="terms-icon">
                                    <FaImage />
                                </div>
                                <div>
                                    <h2 className="terms-section-heading">1. Product Representation</h2>
                                    <ul className="terms-list">
                                        <li>
                                            <strong>Images are for reference only.</strong> Minor variations in color or finish may occur.
                                        </li>
                                        <li>
                                            All products are <strong>handcrafted</strong>, so slight irregularities are natural.
                                        </li>
                                    </ul>
                                    <div className="terms-note info">
                                        For exact details, contact us before ordering.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Pricing */}
                    <div className="terms-card">
                        <div className="terms-card-body">
                            <div className="terms-card-content">
                                <div className="terms-icon">
                                    <FaTag />
                                </div>
                                <div>
                                    <h2 className="terms-section-heading">2. Pricing</h2>
                                    <div className="terms-grid">
                                        <div className="terms-box">
                                            <h5>Currency & Taxes</h5>
                                            <p>
                                                All prices are in <strong>INR</strong> and inclusive of <strong>GST</strong>
                                            </p>
                                        </div>
                                        <div className="terms-box">
                                            <h5>Price Changes</h5>
                                            <p>
                                                Prices may change <strong>without prior notice</strong>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="terms-note warning">
                                        Final amount charged will be as displayed at checkout.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Payments */}
                    <div className="terms-card">
                        <div className="terms-card-body">
                            <div className="terms-card-content">
                                <div className="terms-icon">
                                    <FaCreditCard />
                                </div>
                                <div>
                                    <h2 className="terms-section-heading">3. Payments</h2>
                                    <p>We accept:</p>
                                    <div className="terms-grid">
                                        <div className="terms-box payment-online">
                                            <h5>Online Payments</h5>
                                            <ul>
                                                <li>UPI</li>
                                                <li>Debit/Credit Cards</li>
                                                <li>Net Banking</li>
                                            </ul>
                                        </div>
                                        <div className="terms-box payment-cod">
                                            <h5>Cash on Delivery</h5>
                                            <ul>
                                                <li>Selected PIN codes only</li>
                                                <li>₹50 COD fee may apply</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4. Product Use & Care */}
                    <div className="terms-card">
                        <div className="terms-card-body">
                            <div className="terms-card-content">
                                <div className="terms-icon">
                                    <FaGem />
                                </div>
                                <div>
                                    <h2 className="terms-section-heading">4. Product Use & Care</h2>
                                    <ul className="terms-list">
                                        <li>
                                            Handle <strong>gold-polished jewellery</strong> with care. Avoid water & chemicals.
                                        </li>
                                        <li>
                                            Store in a <strong>dry pouch</strong> when not in use.
                                        </li>
                                        <li>
                                            No guarantee for <strong>polish durability</strong>; depends on usage.
                                        </li>
                                    </ul>
                                    <div className="terms-note secondary">
                                        Ask us for maintenance tips to extend product life.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 5. Limitation of Liability */}
                    <div className="terms-card">
                        <div className="terms-card-body">
                            <div className="terms-card-content">
                                <div className="terms-icon">
                                    <FaExclamationTriangle />
                                </div>
                                <div>
                                    <h2 className="terms-section-heading">5. Limitation of Liability</h2>
                                    <div className="terms-box">
                                        <p>We are <strong>not liable</strong> for:</p>
                                        <ul>
                                            <li>Shipping delays or damage</li>
                                            <li>Force majeure events</li>
                                            <li>Improper use or care</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 6. Intellectual Property */}
                    <div className="terms-card">
                        <div className="terms-card-body">
                            <div className="terms-card-content">
                                <div className="terms-icon">
                                    <FaCopyright />
                                </div>
                                <div>
                                    <h2 className="terms-section-heading">6. Intellectual Property</h2>
                                    <div className="terms-box">
                                        <p>
                                            All content is © and the property of our brand. No part may be:
                                        </p>
                                        <ul>
                                            <li>Copied or redistributed without permission</li>
                                            <li>Used commercially</li>
                                            <li>Altered or modified</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 7. Governing Law */}
                    <div className="terms-card">
                        <div className="terms-card-body">
                            <div className="terms-card-content">
                                <div className="terms-icon">
                                    <FaBalanceScale />
                                </div>
                                <div>
                                    <h2 className="terms-section-heading">7. Governing Law</h2>
                                    <div className="terms-box">
                                        <p>
                                            These terms are governed by <strong>Indian law</strong>.
                                        </p>
                                        <p>
                                            Disputes will be settled in <strong>Madurai, Tamil Nadu</strong>.
                                        </p>
                                    </div>
                                    <div className="terms-note info">
                                        Contact us before placing orders if you have any questions.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Last Updated */}
                    <div className="terms-update">
                        <strong>Last Updated:</strong>{' '}
                        {new Date().toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </div>
                </div>
            </div>
            <Footertwo />
        </>
    );
};

export default TermsConditions;