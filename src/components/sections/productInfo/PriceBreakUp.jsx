import React, { useState } from 'react';
import { FaInfoCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { formatNumber } from '../../../utils/number/FormatNumber';

const PriceBreakup = ({ product, showPriceBreakup }) => {
    const [isExpanded, setIsExpanded] = useState(showPriceBreakup);

    console.log(product,'product');

    if (!product) return null;

    const saleMode = product.SALEMODE;

    const isWeightBased = saleMode === "W";

    const netWt = parseFloat(product.NETWT) || 0;
    const maxWt = parseFloat(product.MAXWAST) || 0;
    const rateValue = parseFloat(product.Rate) || 0;
    const miscAmt = parseFloat(product.MISCAMT) || 0;
    const stoneAmt = parseFloat(product.STNAMT) || 0;
    const mc = parseFloat(product.MC) || 0;
  
    const originalAmount = parseFloat(product.GrandTotal) || 0 ;
    const finalAmount = parseFloat(product.FinalAmount) || 0;

    const discountPercent = product.OfferPercentage || 0 ;
    console.log(discountPercent,'discountPercent');

    const discountAmount = (originalAmount-finalAmount) ; 

    console.log(discountAmount, 'discountAmount');
    const grossAmount = parseFloat(product.GrossAmount) || 0;
    const grandTotal = parseFloat(product.GrandTotal) || 0;
    const rate = parseFloat(product.RATE) || 0;
    const gstAmount = parseFloat(product.GSTAmount) || 0;
    const gstPercentage = product.GSTPer ? parseInt(product.GSTPer) : 0;

    const weightRate = ((netWt + maxWt) * rateValue);


    // ✅ SAME CALCULATION AS BEFORE
    const calculatedGrossAmount =
        saleMode === "W"
            ? ((netWt + maxWt) * rateValue) + miscAmt + (stoneAmt > 0 ? stoneAmt : 0) + (mc > 0 ? mc : 0)
            : grossAmount;

    const hasDetailedPricing = grandTotal > 0 && calculatedGrossAmount > 0;
    const displayPrice = hasDetailedPricing ? grandTotal : rate;

    const formatPrice = (value) =>
        value === 0 ? '-' : `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

    const formatNumer = (value) =>
        value === 0 ? '-' : `${value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

    return (
        <div className="bg-white border border-gray-300 rounded-lg  overflow-hidden shadow-sm">


            {/* Expanded Details */}
            {isExpanded && (
                <div className="border-t border-gray-200 px-5 py-3 bg-gray-50">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-300 text-gray-700 font-semibold">
                                <th>Component</th>
                                <th className="text-right">Value</th>
                                <th className="text-right">Final</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hasDetailedPricing ? (
                                <>
                                    {/* ================= WEIGHT BASED ================= */}
                                    {isWeightBased ? (
                                        <>
                                            <tr className="border-b text-xs bg-gray-100 ">
                                                <td colSpan="3" className="py-2 font-semibold text-center">
                                                    Gross Amount Calculation (Weight Based)
                                                </td>
                                            </tr>

                                            

                                            <tr className="text-xs font-medium">
                                                <td>Rate</td>
                                                <td colSpan="2" className="text-right">
                                                    {formatNumer((netWt + maxWt) * rateValue)}
                                                </td>
                                            </tr>

                                            <tr className="text-xs">
                                                <td>Making Charge</td>
                                                <td colSpan="2" className="text-right py-1 text-right font-semibold text-[#f16137]">
                                                    +{formatNumer(mc)}
                                                </td>
                                            </tr>

                                            {stoneAmt > 0 && (
                                                <tr className="text-xs">
                                                    <td>Stone Amount</td>
                                                    <td colSpan="2" className="text-right">
                                                        {formatNumer(stoneAmt)}
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    ) : (
                                        /* ================= PIECE / RATE BASED ================= */
                                        <>
                                            <tr className="border-b text-xs bg-gray-100">
                                                <td colSpan="3" className="py-2 font-semibold">
                                                    Price Calculation (Piece Based)
                                                </td>
                                            </tr>

                                            <tr className="text-xs font-medium">
                                                <td>Piece Rate</td>
                                                <td colSpan="2" className="text-right">
                                                        {formatNumer(grossAmount)}
                                                </td>
                                            </tr>
                                        </>
                                    )}
                                    {/* Subtotal */}
                                    <tr className="border-b text-xs font-medium">
                                        <td className="py-2">Subtotal</td>
                                        <td className="py-2 text-right">
                                            {formatNumer(grossAmount)}
                                        </td>
                                        <td className="py-2 text-right">
                                            {formatNumer(grossAmount)}
                                        </td>
                                    </tr>

                                    {/* GST */}
                                    <tr className="border-b text-xs">
                                        <td className="py-2">GST ({gstPercentage}%)</td>
                                        <td className="py-2 text-right">
                                            {formatNumer(gstAmount)}
                                        </td>
                                        
                                        <td className="py-2  text-right font-semibold text-[#f16137]">
                                            +{formatNumer(gstAmount)}
                                        </td>
                                    </tr>

                                    {/* Grand Total */}
                                    <tr className="font-bold bg-orange-50">
                                        <td colSpan="2" className="py-2 text-[#041f60]">
                                            Grand Total
                                        </td>
                                        <td className="py-2 text-right text-[#f16137]">
                                            {formatPrice(grandTotal)}
                                        </td>
                                    </tr>

                                    {/* Grand Total */}
                                    {discountAmount > 0 && 
                                    <>
                                        <tr className="font-bold bg-green-50 px-2">
                                            <td colSpan="1" className="py-2 text-[#041f60]">
                                                Discount
                                            </td>
                                            <td className='text-right'>
                                                {discountPercent}% OFF
                                            </td>

                                            <td className="py-2 text-right text-[#f16137]">
                                                {formatNumer(discountAmount)}
                                            </td>
                                        </tr>


                                        <tr className="font-bold bg-green-50">
                                            <td colSpan="2" className="py-2 text-[#041f60]">
                                                Final Amount 
                                            </td>
                                           

                                            <td className="py-2 text-right text-[#f16137]">
                                                {formatPrice(finalAmount)}
                                            </td>

                                        </tr>
                                    </>
                                    }
                                  
                                </>
                            ) : (
                                <tr className="bg-orange-50">
                                    <td colSpan="2" className="py-2 font-bold text-[#041f60]">
                                        Price
                                    </td>
                                    <td className="py-4 text-right text-[#f16137] text-lg font-bold">
                                        {formatPrice(rate)}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

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
