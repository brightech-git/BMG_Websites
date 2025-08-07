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

const TermsConditions = () => {
    return (
        <>
        <div className="container py-5 terms-conditions-wrapper">
            <h1 className="text-center mb-5 terms-heading">Terms & Conditions</h1>

            {/* 1. Product Representation */}
            <div className="card mb-4 terms-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-box me-4">
                            <FaImage className="icon product-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-heading">1. Product Representation</h2>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <span className="badge bg-primary me-2">•</span>
                                    <strong>Images are for reference only.</strong> Minor variations in color or finish may occur.
                                </li>
                                <li className="list-group-item">
                                    <span className="badge bg-primary me-2">•</span>
                                    All products are <strong>handcrafted</strong>, so slight irregularities are natural.
                                </li>
                            </ul>
                            <div className="alert alert-info mt-3">
                                For exact details, contact us before ordering.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Pricing */}
            <div className="card mb-4 terms-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-box me-4">
                            <FaTag className="icon price-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-heading">2. Pricing</h2>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <div className="p-3 h-100 pricing-box">
                                        <h5>Currency & Taxes</h5>
                                        <p className="mb-0">
                                            All prices are in <strong>INR</strong> and inclusive of <strong>GST</strong>
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <div className="p-3 h-100 pricing-box">
                                        <h5>Price Changes</h5>
                                        <p className="mb-0">
                                            Prices may change <strong>without prior notice</strong>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="alert alert-warning mt-2">
                                Final amount charged will be as displayed at checkout.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Payments */}
            <div className="card mb-4 terms-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-box me-4">
                            <FaCreditCard className="icon payment-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-heading">3. Payments</h2>
                            <p className="card-text mb-3">We accept:</p>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="p-3 mb-3 payment-option bg-green">
                                        <h5>Online Payments</h5>
                                        <ul className="mb-0 ps-3">
                                            <li>UPI</li>
                                            <li>Debit/Credit Cards</li>
                                            <li>Net Banking</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="p-3 mb-3 payment-option bg-blue">
                                        <h5>Cash on Delivery</h5>
                                        <ul className="mb-0 ps-3">
                                            <li>Selected PIN codes only</li>
                                            <li>₹50 COD fee may apply</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Product Use & Care */}
            <div className="card mb-4 terms-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-box me-4">
                            <FaGem className="icon care-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-heading">4. Product Use & Care</h2>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <span className="badge bg-primary me-2">•</span>
                                    Handle <strong>gold-polished jewellery</strong> with care. Avoid water & chemicals.
                                </li>
                                <li className="list-group-item">
                                    <span className="badge bg-primary me-2">•</span>
                                    Store in a <strong>dry pouch</strong> when not in use.
                                </li>
                                <li className="list-group-item">
                                    <span className="badge bg-primary me-2">•</span>
                                    No guarantee for <strong>polish durability</strong>; depends on usage.
                                </li>
                            </ul>
                            <div className="alert alert-secondary mt-3">
                                Ask us for maintenance tips to extend product life.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. Limitation of Liability */}
            <div className="card mb-4 terms-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-box me-4">
                            <FaExclamationTriangle className="icon liability-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-heading">5. Limitation of Liability</h2>
                            <div className="p-3 bg-light rounded">
                                <p className="mb-0">We are <strong>not liable</strong> for:</p>
                                <ul className="mt-2 mb-0">
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
            <div className="card mb-4 terms-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-box me-4">
                            <FaCopyright className="icon ip-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-heading">6. Intellectual Property</h2>
                            <div className="p-3 bg-light rounded">
                                <p className="mb-0">
                                    All content is © and the property of our brand. No part may be:
                                </p>
                                <ul className="mt-2 mb-0">
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
            <div className="card terms-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="icon-box me-4">
                            <FaBalanceScale className="icon law-icon" />
                        </div>
                        <div>
                            <h2 className="card-title section-heading">7. Governing Law</h2>
                            <div className="p-3 bg-light rounded">
                                <p className="mb-0">
                                    These terms are governed by <strong>Indian law</strong>.
                                </p>
                                <p className="mt-2 mb-0">
                                    Disputes will be settled in <strong>Madurai, Tamil Nadu</strong>.
                                </p>
                            </div>
                            <div className="alert alert-info mt-3">
                                Contact us before placing orders if you have any questions.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Last Updated */}
            <div className="alert alert-secondary mt-4 text-center">
                <strong>Last Updated:</strong>{' '}
                {new Date().toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                })}
            </div>
        </div>
        </>
    );
};

export default TermsConditions;
