import React, { useState } from 'react';
import { FaInfoCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './PriceBreakup.css';

const PriceBreakup = ({ product }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!product) return null;

    // Calculate values based on product data
    const grandTotal = parseFloat(product.GrandTotal) || 0;
    const rate = parseFloat(product.RATE) || 0;
    const grossAmount = parseFloat(product.GrossAmount) || 0;
    const gstAmount = parseFloat(product.GSTAmount) || 0;
    const gstPercentage = product.GSTPer ? parseInt(product.GSTPer) : 0;

    // Determine what to display based on available data
    const hasDetailedPricing = grandTotal > 0 && grossAmount > 0;
    const displayPrice = hasDetailedPricing ? grandTotal : rate;

    // Calculate discount if any (this would need to be provided or calculated based on your business logic)
    const discount = 0; // Default to 0 discount

    // Format discount display - show dash if zero
    const formatDiscount = (value) => {
        return value === 0 ? '-' : `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    };

    return (
        <div className="price-breakup-container">
            <div className="price-breakup-summary" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="final-price">
                    <span className="label">Total Amount:</span>
                    <span className="value">₹{displayPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <button
                    className="toggle-breakup"
                  
                >
                    <FaInfoCircle />
                    {isExpanded ? 'Hide' : 'View'} Price Breakdown
                    {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                </button>
            </div>

            {isExpanded && (
                <div className="price-breakup-details">
                    <table className="price-table">
                        <thead>
                            <tr>
                                <th>Component</th>
                                <th>Value</th>
                                <th>Discount</th>
                                <th>Final Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hasDetailedPricing ? (
                                <>
                                  

                                    {/* Base price row */}
                                    <tr>
                                        <td>{product.MaterialFinish || 'Material'}</td>
                                        <td>₹{grossAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                        <td>{formatDiscount(discount)}</td>
                                        <td>₹{(grossAmount - discount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                    </tr>

                                    {/* Total before tax */}
                                    <tr className="subtotal">
                                        <td>Total</td>
                                        <td>₹{grossAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                        <td>{formatDiscount(discount)}</td>
                                        <td>₹{(grossAmount - discount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                    </tr>

                                    {/* GST row */}
                                    <tr>
                                        <td>GST ({gstPercentage}%)</td>
                                        <td>₹{gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                        <td>-</td>
                                        <td>₹{gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                    </tr>

                                    {/* Grand Total row */}
                                    <tr className="grand-total">
                                        <td colSpan="3">Grand Total</td>
                                        <td>₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                    </tr>
                                </>
                            ) : (
                                // Simplified view when only rate is available
                                <tr className="grand-total">
                                    <td colSpan="3">Price</td>
                                    <td>₹{rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PriceBreakup;