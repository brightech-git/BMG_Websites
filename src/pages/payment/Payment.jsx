import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { CreditCard, QrCode, Landmark, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";

import { useInitiatePayment } from "../../hook/payment/useInitiatePayment";
import { getPaymentRedirectUrl } from "../../service/paymentServiceicici";
import { useGetOrderById } from "../../hook/order/useAllOrdersQuery";

const PaymentPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Get payment details from location state (passed from checkout)
    const {
        paymentMode,
        paymentType,
        isOnlinePayment
    } = location.state || {};

    const [totalAmount, setTotalAmount] = useState(null);

    const paymentStartedRef = useRef(false);
    const errorShownRef = useRef(false);

    const { data: order, isLoading, isFetching } = useGetOrderById(orderId);

    const { mutate: initiatePayment } = useInitiatePayment();

    // If this is a COD order, redirect to success page
    useEffect(() => {
        if (paymentMode === 'COD') {
            toast.info('This is a Cash on Delivery order');
            navigate(`/payment-success?orderId=${orderId}&mode=cod`);
            return;
        }
    }, [paymentMode, orderId, navigate]);

    /* -------------------------------------------------------
       Extract total amount from single order
    -------------------------------------------------------- */
    useEffect(() => {
        if (!orderId || isLoading || isFetching || paymentMode === 'COD') return;

        const amount = order?.totalAmount ?? order?.order?.totalAmount;

        if (amount == null) {
            if (!errorShownRef.current) {
                toast.error("Unable to fetch order amount");
                errorShownRef.current = true;
            }
            return;
        }

        setTotalAmount(Number(amount));
    }, [orderId, order, isLoading, isFetching, paymentMode]);

    /* -------------------------------------------------------
       Initiate payment (only for online orders)
    -------------------------------------------------------- */
    useEffect(() => {
        if (!orderId || totalAmount === null || paymentMode === 'COD') return;
        if (paymentStartedRef.current) return;

        // Only proceed if it's an online payment
        if (!isOnlinePayment) {
            toast.info("This is not an online payment order");
            navigate("/account");
            return;
        }

        paymentStartedRef.current = true;

        let cancelled = false;

        const getApiPaymentMode = (type) => {
            switch (type) {
                case 'CARD':
                    return 'CARD';
                case 'UPI':
                    return 'UPI';
                case 'NETBANKING':
                    return 'NB';
                default:
                    return type;
            }
        };

        const getPaymentRequest = () => {
            const baseRequest = {
                merchantTxnNo: orderId,
                amount: totalAmount.toFixed(2),
                currencyCode: 356,
                transactionType: "SALE",
                addlParam1: "",
                addlParam2: "",
                returnURL: "https://bmgjewellers.com",
            };

            switch (paymentType) {
                case 'CARD':
                    return {
                        ...baseRequest,
                        paymentMode: getApiPaymentMode('CARD'),
                        cardType: "ALL",
                    };
                case 'UPI':
                    return {
                        ...baseRequest,
                        paymentMode: getApiPaymentMode('UPI'),
                        upiApp: "ALL",
                    };
                case 'NETBANKING':
                    return {
                        ...baseRequest,
                        paymentMode: getApiPaymentMode('NETBANKING'),
                        bankCode: "ALL",
                    };
                default:
                    return {
                        ...baseRequest,
                        paymentMode: getApiPaymentMode(paymentType),
                    };
            }
        };

        initiatePayment(
            getPaymentRequest(),
            {
                onSuccess: async (response) => {
                    if (cancelled) return;

                    const { redirectURI, tranCtx } = response;

                    if (!redirectURI || !tranCtx) {
                        toast.error("Invalid payment response");
                        navigate("/account");
                        return;
                    }

                    try {
                        const finalUrl = await getPaymentRedirectUrl(
                            redirectURI,
                            tranCtx
                        );
                        window.location.href = finalUrl;
                    } catch {
                        toast.error("Failed to redirect to payment gateway");
                        navigate("/account");
                    }
                },
                onError: (error) => {
                    if (cancelled) return;
                    toast.error("Payment initiation failed");
                    navigate("/account");
                },
            }
        );

        return () => {
            cancelled = true;
        };
    }, [orderId, totalAmount, paymentType, paymentMode, isOnlinePayment, initiatePayment, navigate]);

    const getPaymentTypeDisplay = () => {
        switch (paymentType) {
            case 'CARD':
                return {
                    name: 'Credit/Debit Card',
                    icon: <CreditCard className="w-5 h-5 text-blue-600" />,
                    color: 'blue'
                };
            case 'UPI':
                return {
                    name: 'UPI',
                    icon: <QrCode className="w-5 h-5 text-green-600" />,
                    color: 'green'
                };
            case 'NETBANKING':
                return {
                    name: 'Net Banking',
                    icon: <Landmark className="w-5 h-5 text-purple-600" />,
                    color: 'purple'
                };
            default:
                return {
                    name: paymentType,
                    icon: null,
                    color: 'gray'
                };
        }
    };

    const paymentTypeInfo = getPaymentTypeDisplay();

    // Don't render for COD orders (will redirect)
    if (paymentMode === 'COD') {
        return null;
    }

    // Loading state
    if (isLoading || isFetching) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Order Details</h2>
                    <p className="text-gray-500 text-sm">Please wait while we fetch your order information...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-4 shadow-lg">
                        <svg className="w-10 h-10 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Redirecting to Payment</h2>
                    <p className="text-gray-500 text-sm">
                        Please wait while we securely redirect you to the payment gateway
                    </p>
                </div>

                {/* Payment Details Card */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6 space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <span className="text-sm text-gray-500">Order ID</span>
                        <span className="text-sm font-mono font-medium text-gray-800">{orderId}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Amount</span>
                        <span className="text-xl font-bold text-gray-800">₹{totalAmount?.toFixed(2)}</span>
                    </div>

                    <div className={`flex justify-between items-center p-3 rounded-lg bg-${paymentTypeInfo.color}-50 border border-${paymentTypeInfo.color}-200`}>
                        <div className="flex items-center gap-2">
                            {paymentTypeInfo.icon}
                            <span className="text-sm text-gray-600">Payment Type</span>
                        </div>
                        <span className={`font-medium text-${paymentTypeInfo.color}-700`}>
                            {paymentTypeInfo.name}
                        </span>
                    </div>
                </div>

                {/* Spinner and Tip */}
                <div className="text-center">
                    <div className="inline-flex items-center justify-center mb-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-3 border-gray-200 border-t-blue-600"></div>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500 bg-yellow-50 p-3 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                        <span className="text-yellow-700">⚡ Do not refresh or close this page</span>
                    </div>

                    {/* Back button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;