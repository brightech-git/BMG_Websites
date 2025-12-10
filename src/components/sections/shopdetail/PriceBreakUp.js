import React, { useState } from 'react';
import { FaInfoCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const PriceBreakup = ({ product }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!product) return null;

    const grandTotal = parseFloat(product.GrandTotal) || 0;
    const rate = parseFloat(product.RATE) || 0;
    const grossAmount = parseFloat(product.GrossAmount) || 0;
    const gstAmount = parseFloat(product.GSTAmount) || 0;
    const gstPercentage = product.GSTPer ? parseInt(product.GSTPer) : 0;

    const hasDetailedPricing = grandTotal > 0 && grossAmount > 0;
    const displayPrice = hasDetailedPricing ? grandTotal : rate;
    const discount = 0; 

    const formatPrice = (value) =>
        value === 0 ? '-' : `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

    return (
        <div className="bg-white border border-gray-300 rounded-lg mt-2 overflow-hidden shadow-sm">

            {/* Summary Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-4 py-2 flex items-center justify-between hover:bg-gray-50 transition"
            >
                <div className="flex items-center gap-3">
                    <FaInfoCircle className="w-5 h-5 text-[#f16137]" />
                    <div className="text-left">
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="text-sm font-bold text-[#041f60]">
                            ₹{displayPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-[#041f60]">
                    {isExpanded ? "Hide" : "View"} Breakdown
                    {isExpanded ? <FaChevronUp className="w-4 h-4" /> : <FaChevronDown className="w-4 h-4" />}
                </div>
            </button>

            {/* Expanded Details */}
            {isExpanded && (
                <div className="border-t border-gray-200 px-5 py-3 bg-gray-50">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-300 text-sm text-left text-gray-700 font-semibold">
                                <th className="pb-2">Component</th>
                                <th className="pb-2 text-right">Value</th>
                                <th className="pb-2 text-right">Discount</th>
                                <th className="pb-2 text-right">Final</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800">
                            {hasDetailedPricing ? (
                                <>
                                    {/* Material / Base Price */}
                                    <tr className="border-b text-xs border-gray-200">
                                        <td className="py-2 font-medium">{product.MaterialFinish || 'Material Cost'}</td>
                                        <td className="py-2 text-right">₹{grossAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                        <td className="py-2 text-right">{formatPrice(discount)}</td>
                                        <td className="py-2 text-right font-semibold">
                                            ₹{(grossAmount - discount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </td>
                                    </tr>

                                    {/* Subtotal */}
                                    <tr className="border-b border-gray-200 text-xs font-medium">
                                        <td className="py-2">Subtotal</td>
                                        <td className="py-2 text-right">₹{grossAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                        <td className="py-2 text-right">{formatPrice(discount)}</td>
                                        <td className="py-2 text-right">
                                            ₹{(grossAmount - discount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </td>
                                    </tr>

                                    {/* GST */}
                                    <tr className="border-b text-xs border-gray-200">
                                        <td className="py-2">GST ({gstPercentage}%)</td>
                                        <td className="py-2 text-right">₹{gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                        <td className="py-2 text-right">-</td>
                                        <td className="py-2 text-right font-semibold text-[#f16137]">
                                            +₹{gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </td>
                                    </tr>

                                    {/* Grand Total */}
                                    <tr className="text-sm font-bold bg-orange-50">
                                        <td colSpan="3" className="py-2 text-[#041f60]">Grand Total</td>
                                        <td className="py-2 text-right text-[#f16137]">
                                            ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                </>
                            ) : (
                                <tr className="bg-orange-50">
                                    <td colSpan="3" className="py-2 text-left font-bold text-[#041f60]">Price</td>
                                    <td className="py-4 text-right text-[#f16137] text-lg font-bold">
                                        ₹{rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Inclusive Note */}
                    {gstPercentage > 0 && (
                        <p className="text-xs text-gray-600 text-center mt-2 italic">
                            All prices are inclusive of GST ({gstPercentage}%)
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default PriceBreakup;