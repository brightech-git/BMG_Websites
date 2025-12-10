import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    CheckCircle2,
    XCircle,
    RotateCcw,
    Home,
    ShoppingBag,
    Download,
    Clock,
    AlertCircle,
    Mail,
    Truck,
    Package,
} from "lucide-react";
import HeaderWithAuth from "../layouts/HeaderWithAuth";
import Footertwo from "../layouts/Footerthree";
import { getPaymentStatus } from "../../service/paymentServiceicici";

const PaymentStatus = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const orderId = searchParams.get("orderId");
    const mode = searchParams.get("mode");
    const paymentMode = mode === "COD" ? "COD" : "ONLINE";

    const [status, setStatus] = useState(null);
    const [isSuccess, setIsSuccess] = useState(null); // true, false, null (loading)
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!orderId) {
            setIsSuccess(false);
            setStatus({ error: true, message: "Invalid order reference" });
            setIsLoading(false);
            return;
        }

        const fetchStatus = async () => {
            try {
                if (paymentMode === "COD") {
                    setStatus({ paymentStatus: "Cash on Delivery", message: "Order confirmed" });
                    setIsSuccess(true);
                    return;
                }

                const res = await getPaymentStatus(orderId);
                setStatus(res);

                if (res?.paymentStatus?.toLowerCase() === "paid") {
                    setIsSuccess(true);
                } else {
                    setIsSuccess(false);
                }
            } catch (err) {
                console.error(err);
                setStatus({ error: true, message: "Unable to verify payment status" });
                setIsSuccess(false);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStatus();
    }, [orderId, paymentMode]);

    const getStatusColor = () => {
        if (isLoading) return "text-blue-600";
        if (isSuccess) return "text-emerald-600";
        return "text-red-600";
    };

    const getBgGradient = () => {
        if (isLoading) return "from-blue-50 to-indigo-50";
        if (isSuccess) return "from-emerald-50 via-green-50 to-teal-50";
        return "from-red-50 to-rose-50";
    };

    return (
        <>
            <HeaderWithAuth />

            {/* Confetti Rain - Only on Success */}
            {isSuccess && !isLoading && (
                <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
                    {[...Array(100)].map((_, i) => (
                        <svg
                            key={i}
                            className="absolute animate-fall"
                            style={{
                                left: `${Math.random() * 100}vw`,
                                animationDelay: `${Math.random() * 3}s`,
                                animationDuration: `${4 + Math.random() * 3}s`,
                                transform: `rotate(${Math.random() * 360}deg)`,
                            }}
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                        >
                            {i % 5 === 0 && <circle cx="12" cy="12" r="10" fill="#f59e0b" />}
                            {i % 5 === 1 && <rect x="4" y="4" width="16" height="16" rx="4" fill="#10b981" />}
                            {i % 5 === 2 && (
                                <path
                                    d="M12 2L14.09 8.26L20.18 8.27L15.54 11.97L17.45 18.02L12 14.27L6.55 18.02L8.46 11.97L3.82 8.27L9.91 8.26L12 2Z"
                                    fill="#8b5cf6"
                                />
                            )}
                            {i % 5 ===  3 && <circle cx="12" cy="12" r="10" fill="#ef4444" />}
                            {i % 5 === 4 && <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" fill="#3b82f6" />}
                        </svg>
                    ))}
                </div>
            )}

            <main className={`min-h-screen bg-gradient-to-br ${getBgGradient()} py-12 px-4`}>
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50">
                        {/* Top Status Bar */}
                        <div className={`h-2 bg-gradient-to-r ${isSuccess ? "from-emerald-500 to-teal-600" : isSuccess === false ? "from-red-500 to-rose-600" : "from-blue-500 to-indigo-600"}`} />

                        <div className="p-8 md:p-12 text-center">
                            {/* Icon */}
                            <div className="inline-flex items-center justify-center w-28 h-28 mx-auto mb-8 rounded-full bg-white shadow-xl">
                                {isLoading ? (
                                    <Clock className="w-14 h-14 text-blue-600 animate-spin" />
                                ) : isSuccess ? (
                                    <CheckCircle2 className="w-16 h-16 text-emerald-600 animate-scale-in" />
                                ) : (
                                    <XCircle className="w-16 h-16 text-red-600 animate-scale-in" />
                                )}
                            </div>

                            {/* Title */}
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 animate-fade-up">
                                {isLoading
                                    ? "Verifying Your Payment..."
                                    : isSuccess
                                        ? paymentMode === "COD"
                                            ? "Order Confirmed!"
                                            : "Payment Successful!"
                                        : "Payment Failed"}
                            </h1>

                            {/* Subtitle */}
                            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-up animation-delay-200">
                                {isLoading
                                    ? "Please wait while we confirm your transaction. This won't take long."
                                    : isSuccess
                                        ? paymentMode === "COD"
                                            ? "Your order has been placed successfully with Cash on Delivery."
                                            : "Thank you! Your payment was processed successfully."
                                        : "We couldn't process your payment. No charges were made."}
                            </p>

                            {/* Order ID */}
                            {orderId && (
                                <div className="inline-flex items-center gap-3 bg-gray-100 px-6 py-3 rounded-full text-lg font-medium animate-fade-up animation-delay-300">
                                    <span className="text-gray-600">Order ID:</span>
                                    <span className="font-bold text-emerald-700">{orderId}</span>
                                </div>
                            )}

                            {/* Status Badge */}
                            <div className="mt-10 animate-fade-up animation-delay-400">
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-3 text-blue-600">
                                        <div className="w-5 h-5 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                        <span className="text-lg">Checking payment status...</span>
                                    </div>
                                ) : (
                                    <div
                                        className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-lg font-semibold ${isSuccess
                                                ? "bg-emerald-100 text-emerald-800"
                                                : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {isSuccess ? (
                                            <>
                                                <CheckCircle2 size={24} />
                                                {paymentMode === "COD" ? "Cash on Delivery" : "Paid Successfully"}
                                            </>
                                        ) : (
                                            <>
                                                <AlertCircle size={24} />
                                                Payment Declined
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Success: Next Steps */}
                            {isSuccess && !isLoading && (
                                <div className="mt-12 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8 animate-fade-up animation-delay-500">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-6">What Happens Next?</h3>
                                    <div className="grid md:grid-cols-3 gap-6 text-left">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 bg-emerald-200 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <Mail className="w-6 h-6 text-emerald-700" />
                                            </div>
                                            <div>
                                                <p className="font-semibold">Confirmation Email</p>
                                                <p className="text-gray-600">Sent within 5 minutes</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 bg-emerald-200 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <Package className="w-6 h-6 text-emerald-700" />
                                            </div>
                                            <div>
                                                <p className="font-semibold">Order Processing</p>
                                                <p className="text-gray-600">Within 24 hours</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 bg-emerald-200 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <Truck className="w-6 h-6 text-emerald-700" />
                                            </div>
                                            <div>
                                                <p className="font-semibold">Delivery</p>
                                                <p className="text-gray-600">3–5 business days</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Failure: Info */}
                            {isSuccess === false && !isLoading && (
                                <div className="mt-12 bg-red-50 border border-red-200 rounded-2xl p-8 animate-fade-up animation-delay-500">
                                    <h3 className="text-2xl font-bold text-red-800 mb-4">Don't worry — you're safe</h3>
                                    <ul className="text-left space-y-3 text-gray-700">
                                        <li className="flex items-center gap-3">
                                            <CheckCircle2 className="text-green-600" size={20} />
                                            No money was deducted
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <CheckCircle2 className="text-green-600" size={20} />
                                            Your card details are secure
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <CheckCircle2 className="text-green-600" size={20} />
                                            You can try again with any payment method
                                        </li>
                                    </ul>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="mt-12 flex flex-col sm:flex-row gap-5 justify-center animate-fade-up animation-delay-600">
                                {isSuccess ? (
                                    <>
                                        <button
                                            onClick={() => navigate("/products-page")}
                                            className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-lg rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                                        >
                                            <Home size={24} className="group-hover:translate-x-1 transition" />
                                            Continue Shopping
                                        </button>

                                        <button
                                            onClick={() => navigate("/account", { state: { activeComponent: "Orders" } })}
                                            className="flex items-center justify-center gap-3 px-8 py-4 bg-white text-emerald-700 border-2 border-emerald-600 font-semibold text-lg rounded-2xl hover:bg-emerald-50 hover:scale-105 transition-all duration-300 shadow-lg"
                                        >
                                            <ShoppingBag size={24} />
                                            View Orders
                                        </button>

                                        <button className="flex items-center justify-center gap-3 px-8 py-4 bg-gray-100 text-gray-800 font-semibold text-lg rounded-2xl hover:bg-gray-200 transition shadow-md">
                                            <Download size={24} />
                                            Download Invoice
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => navigate("/products-page")}
                                            className="px-8 py-4 bg-gray-200 text-gray-700 font-semibold rounded-2xl hover:bg-gray-300 transition"
                                        >
                                            Back to Shop
                                        </button>

                                        <button
                                            onClick={() => navigate(`/checkout?retryOrder=${orderId}`)}
                                            className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold text-lg rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                                        >
                                            <RotateCcw size={24} className="animate-spin-once" />
                                            Retry Payment
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Support Card */}
                            <div className="mt-12 bg-gray-50 rounded-2xl p-8 text-left animate-fade-up animation-delay-700">
                                <h4 className="text-xl font-bold text-gray-800 mb-3">Need Help?</h4>
                                <p className="text-gray-600 mb-6">
                                    Our support team is available 24/7 to assist you
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <a
                                        href="/contact"
                                        className="text-emerald-600 font-medium hover:underline"
                                    >
                                        Contact Support →
                                    </a>
                                    <a
                                        href="/help"
                                        className="text-emerald-600 font-medium hover:underline"
                                    >
                                        Help Center →
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footertwo />
        </>
    );
};

export default PaymentStatus;