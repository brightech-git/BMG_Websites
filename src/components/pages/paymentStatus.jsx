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
import Footertwo from "../layouts/Footer";
import { getPaymentStatus } from "../../service/paymentServiceicici";
import SmartButton from "../ui/SmartButton";
import { useCreateReOrder } from "../../hook/order/useReorder";
import { useCart } from "../../hook/cart/useCartQuery";
import PrintStatement from "../ui/PrintStatement";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useOrderInvoice } from "../../hook/order/useAllOrdersQuery";

const PaymentStatus = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const orderId = searchParams.get("orderId");
    const mode = searchParams.get("mode");
    const paymentMode = mode?.toLowerCase() === "cod" ? "COD" : "ONLINE";
    const { clearCart } = useCart();

    const [status, setStatus] = useState(null);
    const [isSuccess, setIsSuccess] = useState(null); // true, false, null (loading)
    const [isLoading, setIsLoading] = useState(true);

    const [retrying, setRetrying] = useState(false);

    const { mutateAsync: createReOrder } = useCreateReOrder();

    const { data: orderInvoiceData, isLoading: orderInvoiceLoadinf, isError: orderInvoiceError } = useOrderInvoice(orderId);

    console.log(orderInvoiceData, 'orderInvoiceData');


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
                    clearCart();
                    return;
                }

                const res = await getPaymentStatus(orderId);
                setStatus(res);

                if (res?.paymentStatus?.toLowerCase() === "paid") {
                    setIsSuccess(true);
                    // Dispatch event to clear cart for COD
                    clearCart();
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
    console.log(status, 'status');


    const handleReorder = async () => {
        if (retrying) return;

        setRetrying(true);
        try {
            const isConfirmed = window.confirm(
                "Do you want to proceed to payment for this order again?"
            );

            if (!isConfirmed) return;


            const res = await createReOrder(orderId);
            const newOrderId = res?.newOrderId;

            if (!newOrderId) {
                alert("Unable to retry payment.");
                return;
            }

            navigate(`/payment/${newOrderId}`);
        } catch (e) {
            console.error(e);
            alert("Retry failed.");
        } finally {
            setRetrying(false);
        }
    };


    return (
        <>
            <HeaderWithAuth />

            {/* Confetti Rain - Only on Success */}
            {isSuccess && !isLoading && (
                <div className="absolute inset-0 mt-[130px] pointer-events-none z-[10] overflow-hidden">
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
                            {i % 5 === 3 && <circle cx="12" cy="12" r="10" fill="#ef4444" />}
                            {i % 5 === 4 && <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" fill="#3b82f6" />}
                        </svg>
                    ))}
                </div>
            )}

            <main className={`mt-[130px] bg-gradient-to-br ${getBgGradient()} py-4 px-2`}>
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50">
                        {/* Top Status Bar */}
                        <div className={`h-2 bg-gradient-to-r ${isSuccess ? "from-emerald-500 to-teal-600" : isSuccess === false ? "from-red-500 to-rose-600" : "from-blue-500 to-indigo-600"}`} />

                        <div className="p-2  text-center">
                            {/* Icon */}
                            <div className="inline-flex items-center justify-center w-20 h-20 mx-auto mb-2 rounded-full bg-white shadow-xl">
                                {isLoading ? (
                                    <Clock className="w-14 h-14 text-blue-600 animate-spin" />
                                ) : isSuccess ? (
                                    <CheckCircle2 className="w-14 h-14 text-emerald-600 animate-scale-in" />
                                ) : (
                                    <XCircle className="w-14 h-14 text-red-600 animate-scale-in" />
                                )}
                            </div>

                            {/* Title */}
                            <h1 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 animate-fade-up">
                                {isLoading
                                    ? "Verifying Your Payment..."
                                    : isSuccess
                                        ? paymentMode === "COD"
                                            ? "Order Confirmed!"
                                            : "Payment Successful!"
                                        : "Payment Failed"}
                            </h1>

                            {/* Subtitle */}
                            <p className="text-xs sm:text-sm text-gray-600 mb-2 mx-auto animate-fade-up animation-delay-200">
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
                                <div className="inline-flex items-center gap-1 bg-gray-100 px-3 py-2 rounded-full text-lg font-medium animate-fade-up animation-delay-300">
                                    <span className="text-gray-600 text-xs">Order ID:</span>
                                    <span className="font-bold text-emerald-700 text-sm">{orderId}</span>
                                </div>
                            )}

                            {/* Status Badge */}
                            <div className="mt-2 animate-fade-up animation-delay-400">
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-3 text-blue-600">
                                        <div className="w-4 h-4 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                        <span className="text-lg">Checking payment status...</span>
                                    </div>
                                ) : (
                                    <div
                                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-2xl text-sm font-semibold ${isSuccess
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
                                <div className="mt-2 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-2 animate-fade-up animation-delay-500">
                                    <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-3">What Happens Next?</h3>
                                    <div className="grid grid-cols-2 gap-2 items-center justify-center px-4">
                                        <div className="flex gap-2">
                                            <div className="w-10 h-10 bg-emerald-200 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <Mail className="w-4 h-4 text-emerald-700" />
                                            </div>
                                            <div className="text-xs">
                                                <p className="font-semibold text-xs">Confirmation Email</p>
                                                <p className="text-gray-600 text-xs ">Sent within 5 minutes</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="w-10 h-10 bg-emerald-200 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <Mail className="w-4 h-4 text-emerald-700" />
                                            </div>
                                            <div className="text-xs">
                                                <p className="font-semibold text-xs">Confirmation SMS</p>
                                                <p className="text-gray-600 text-xs ">Sent within 5 minutes</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="w-10 h-10 bg-emerald-200 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <Package className="w-4 h-4 text-emerald-700" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-xs">Order Processing</p>
                                                <p className="text-gray-600 text-xs ">Within 24 hours</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="w-10 h-10 bg-emerald-200 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <Truck className="w-4 h-4 text-emerald-700" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-xs">Delivery</p>
                                                <p className="text-gray-600 text-xs">3–5 business days</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <>


                            </>

                            {/* Failure: Info */}
                            {isSuccess === false && !isLoading && (
                                <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-2 animate-fade-up animation-delay-500">
                                    <h3 className="text-base sm:text-lg font-bold text-red-800 mb-2">Don't worry — you're safe</h3>
                                    <ul className="text-left space-y-2 text-gray-700">
                                        <li className="flex items-center gap-1">
                                            <CheckCircle2 className="text-green-600" size={20} />
                                            No money was deducted
                                        </li>
                                        <li className="flex items-center gap-1">
                                            <CheckCircle2 className="text-green-600" size={20} />
                                            Your card details are secure
                                        </li>
                                        <li className="flex items-center gap-1">
                                            <CheckCircle2 className="text-green-600" size={20} />
                                            You can try again with any payment method
                                        </li>
                                    </ul>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="mt-3 grid sm:grid-cols-3 px-4 sm:px-6 items-center sm:justify-center gap-2 animate-fade-up animation-delay-600">
                                {isSuccess ? (
                                    <>

                                        <SmartButton
                                            onClick={() => navigate("/account/orderdetails", { orderId: orderId })}
                                            variant="secondary"
                                            icon={ShoppingBag}
                                        >

                                            View Orders
                                        </SmartButton>
                                        <SmartButton
                                            onClick={() => navigate("/products-page")}
                                            variant="primary"
                                            className="flex items-center justify-center"
                                            icon={Home}
                                        >

                                            Continue Shopping
                                        </SmartButton>


                                    </>
                                ) : (
                                    <>

                                        <SmartButton
                                            onClick={() => navigate("/products-page")}

                                        >
                                            Back to Shop
                                        </SmartButton>


                                        <SmartButton
                                            onClick={handleReorder}
                                            disabled={retrying}
                                            icon={RotateCcw}
                                        >
                                            {retrying ? "Retrying..." : "Retry Payment"}
                                        </SmartButton>

                                    </>
                                )}
                            </div>

                            {/* Support Card */}
                            <div className="flex mt-3 bg-gray-100 rounded-xl p-2 items-center gap-2 justify-between animate-fade-up animation-delay-700">
                                <div>
                                    <h4 className="text-sm font-bold text-left text-gray-800 mb-2">Need Help?</h4>
                                    <p className="text-gray-600 text-xs">
                                        Our support team is available 24/7 to assist you
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    <a
                                        href="/contact"
                                        className="text-emerald-600 text-sm font-medium hover:underline"
                                    >
                                        Contact Support →
                                    </a>
                                    <a
                                        href="/help"
                                        className="text-emerald-600  text-sm font-medium hover:underline"
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