import React, { useState } from 'react';
import { CreditCard, QrCode, Landmark } from 'lucide-react';
import 'animate.css';

const PaymentOptionsDialog = ({ isOpen, onClose, onConfirm }) => {
    const [selectedMethod, setSelectedMethod] = useState('CARD');

    if (!isOpen) return null;

    // In your PaymentOptionsDialog component
    const handleConfirm = () => {
        onConfirm(selectedMethod); // This will be 'CARD', 'UPI', or 'NETBANKING'
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate__animated animate__fadeIn">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate__animated animate__zoomIn">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-center text-gray-800">
                        Select Payment Method
                    </h2>
                    <p className="text-sm text-center text-gray-500 mt-1">
                        Choose how you'd like to pay
                    </p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                    {/* Card Option */}
                    <label
                        className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${selectedMethod === 'CARD'
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="CARD"
                            checked={selectedMethod === 'CARD'}
                            onChange={(e) => setSelectedMethod(e.target.value)}
                            className="w-4 h-4 text-blue-600"
                        />
                        <div className="ml-3 flex items-center flex-1">
                            <CreditCard className={`w-6 h-6 ${selectedMethod === 'CARD' ? 'text-blue-600' : 'text-gray-500'}`} />
                            <div className="ml-3">
                                <p className={`font-medium ${selectedMethod === 'CARD' ? 'text-blue-600' : 'text-gray-700'}`}>
                                    Credit / Debit Card
                                </p>
                                <p className="text-xs text-gray-500">Pay with Visa, Mastercard, RuPay</p>
                            </div>
                        </div>
                    </label>

                    {/* UPI Option */}
                    <label
                        className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${selectedMethod === 'UPI'
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="UPI"
                            checked={selectedMethod === 'UPI'}
                            onChange={(e) => setSelectedMethod(e.target.value)}
                            className="w-4 h-4 text-green-600"
                        />
                        <div className="ml-3 flex items-center flex-1">
                            <QrCode className={`w-6 h-6 ${selectedMethod === 'UPI' ? 'text-green-600' : 'text-gray-500'}`} />
                            <div className="ml-3">
                                <p className={`font-medium ${selectedMethod === 'UPI' ? 'text-green-600' : 'text-gray-700'}`}>
                                    UPI
                                </p>
                                <p className="text-xs text-gray-500">Google Pay, PhonePe, Paytm</p>
                            </div>
                        </div>
                    </label>

                    {/* Net Banking Option */}
                    {/* <label
                        className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${selectedMethod === 'NETBANKING'
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="NETBANKING"
                            checked={selectedMethod === 'NETBANKING'}
                            onChange={(e) => setSelectedMethod(e.target.value)}
                            className="w-4 h-4 text-purple-600"
                        />
                        <div className="ml-3 flex items-center flex-1">
                            <Landmark className={`w-6 h-6 ${selectedMethod === 'NETBANKING' ? 'text-purple-600' : 'text-gray-500'}`} />
                            <div className="ml-3">
                                <p className={`font-medium ${selectedMethod === 'NETBANKING' ? 'text-purple-600' : 'text-gray-700'}`}>
                                    Net Banking
                                </p>
                                <p className="text-xs text-gray-500">All major banks</p>
                            </div>
                        </div>
                    </label> */}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 animate__animated animate__pulse animate__infinite animate__slow"
                    >
                        Pay with {selectedMethod}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentOptionsDialog;