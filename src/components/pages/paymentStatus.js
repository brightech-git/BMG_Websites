import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { CheckCircle, XCircle, RotateCcw, Home, ShoppingBag, Download, Clock } from "lucide-react";
import HeaderWithAuth from "../layouts/HeaderWithAuth";
import Footertwo from "../layouts/Footerthree";
import { getPaymentStatus } from "../../service/paymentServiceicici";
import "./PaymentStatus.css";

const PaymentStatus = () => {
    const location = useLocation();
    const history = useHistory();
    const searchParams = new URLSearchParams(location.search);
    const orderId = searchParams.get("orderId");
    const mode = searchParams.get("mode");
    console.log("payment Order ID:", mode);
    const paymentMode = mode === "COD" ? "COD" : "ONLINE";
    console.log("Payment Mode:", paymentMode);

    const [status, setStatus] = useState(null);
    const [isSuccess, setIsSuccess] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    console.log(isSuccess ,'success')

    useEffect(() => {
        // Trigger animations for UI elements
        const elements = document.querySelectorAll("[data-animate]");
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add("animate-in");
            }, index * 100);
        });
    }, []);

    useEffect(() => {
        if (!orderId) {
            setStatus({ error: true, message: "Invalid order ID" });
            setIsLoading(false);
            setIsSuccess(false);
            return;
        }

        const fetchStatus = async () => {
            try {
                if (paymentMode === "COD") {
                    // For COD orders, we don't need to check payment status
                    setStatus({ txnStatus: "Cash on Delivery", message: "Order confirmed" });
                    setIsSuccess(true);
                    setShowConfetti(true);
                } else {
                    // Fetch payment status for online payments
                    const res = await getPaymentStatus(orderId);
                    console.log("Payment API response:", res);

                    setStatus(res);

                    // Determine success based on payphiResponse
                    if (res.payphiResponse) {
                        const txnStatus = res.payphiResponse.txnStatus;
                        console.log("Transaction Status:", txnStatus);

                        // Check if transaction was successful
                        const isPaymentSuccess = txnStatus === "SUC" ||
                            txnStatus === "APPROVED" ||
                            txnStatus === "000" || // Some systems use "000" for success
                            txnStatus === "SUCCESS";

                        setIsSuccess(isPaymentSuccess);
                        if (isPaymentSuccess) {
                            setShowConfetti(true);
                        }
                    } else {
                        // If no payphiResponse, assume failure
                        setIsSuccess(false);
                    }
                }
            } catch (err) {
                console.error("Error fetching payment status:", err);
                setStatus({ error: true, message: "Failed to fetch payment status" });
                setIsSuccess(false);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStatus();

        // Cleanup confetti after 3 seconds
        if (showConfetti) {
            const confettiTimer = setTimeout(() => setShowConfetti(false), 3000);
            return () => clearTimeout(confettiTimer);
        }
    }, [orderId, paymentMode, showConfetti]);

    const handleDownloadInvoice = () => {
        console.log("Download invoice for order:", orderId);
    };

    // Helper function to get status message
    const getStatusMessage = () => {
        if (paymentMode === "COD") {
            return "Cash on Delivery";
        }

        if (status?.payphiResponse) {
            const { txnStatus, txnRespDescription, respDescription } = status.payphiResponse;

            // Return the most descriptive message available
            return txnRespDescription || respDescription || txnStatus || "Unknown Status";
        }

        if (status?.error) {
            return status.message || "Unable to fetch payment status";
        }

        return "Processing...";
    };

    console.log(isSuccess,'success');
    console.log(isLoading,'loadingdata');

    return (
        <>
            <HeaderWithAuth />
            <div className={`payment-status-container ${isSuccess ? "success" : isSuccess === false ? "failure" : "pending"}`}>
                {/* Animated Background Elements */}
                <div className="floating-shapes">
                    {[...Array(12)].map((_, i) => (
                        <div
                            key={i}
                            className="floating-shape"
                            style={{
                                animationDelay: `${i * 0.3}s`,
                                left: `${Math.random() * 90}%`,
                                animationDuration: `${12 + (i * 3)}s`,
                                opacity: 0.3 + (Math.random() * 0.4)
                            }}
                        />
                    ))}
                </div>

                {/* Confetti Animation for Success */}
                {isSuccess && showConfetti && (
                    <div className="confetti-container">
                        {[...Array(120)].map((_, i) => (
                            <div
                                key={i}
                                className="confetti"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 1.5}s`,
                                    backgroundColor: `hsl(${Math.random() * 360}, 80%, 65%)`,
                                    width: `${6 + Math.random() * 10}px`,
                                    height: `${6 + Math.random() * 10}px`,
                                    borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                                    transform: `rotate(${Math.random() * 360}deg)`
                                }}
                            />
                        ))}
                    </div>
                )}


                {/* Title with Text Animation */}
                <h1 className="payment-title" data-animate="fade-up">
                    <span className="title-text">
                        {isLoading
                            ? "Verifying Payment"
                            : isSuccess
                                ? paymentMode === "COD"
                                    ? "Order Confirmed!"
                                    : "Payment Successful!"
                                : isSuccess === false
                                    ? "Payment Failed"
                                    : "Payment Processing"}
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="payment-subtitle" data-animate="fade-up">
                    {isLoading
                        ? "We're confirming your payment details. This will just take a moment."
                        : isSuccess
                            ? paymentMode === "COD"
                                ? "Your order has been confirmed with Cash on Delivery. You'll receive a confirmation  shortly."
                                : "Your payment has been processed successfully. Thank you for your purchase!"
                            : isSuccess === false
                                ? "We encountered an issue processing your payment. Please try again or contact support."
                                : "Your payment is being processed. This may take a few moments."}
                </p>

                {/* Order ID */}
                {orderId && (
                    <div className="order-info-container" data-animate="fade-up">
                        <div className="order-id-badge">
                            <span>Order Reference: </span>
                            <strong>{orderId}</strong>
                        </div>
                    </div>
                )}

                {/* Status Information */}
                <div className="status-info" data-animate="fade-up">
                    {isLoading ? (
                        <div className="status-badge loading">
                            <div className="loading-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <span>Verifying payment status</span>
                        </div>
                    ) : status?.error ? (
                        <div className="status-badge warning">
                            <span>{status.message || "Unable to verify payment status. Please check your orders page or contact support."}</span>
                        </div>
                    ) : (
                        <div className={`status-badge ${isSuccess ? "success" : isSuccess === false ? "errors" : "warnings"}`}>
                            <span>{paymentMode === "COD" ? "Payment Method" : "Transaction Status"}: </span>
                            <strong>{getStatusMessage()}</strong>
                        </div>
                    )}
                </div>

                {/* Additional Information for successful payments */}
                {isLoading === false && isSuccess && (
                    <div className="order-details" data-animate="fade-up">
                        <h3>Next Steps</h3>
                        <ul>
                            <li>Order confirmation will be sent within 5 minutes</li>
                            <li>Shipping notification within 24 hours</li>
                            <li>Estimated delivery: 3-5 business days</li>
                            <li>Track your order from your account dashboard</li>
                        </ul>
                    </div>
                )}

                {isSuccess === false && status?.payphiResponse && (
                    <div className="order-details" data-animate="fade-up">
                        <h3>What happened?</h3>
                        <ul>
                            <li>Your payment was not processed successfully</li>
                            <li>No amount has been deducted from your account</li>
                            <li>You can try again with the same or a different payment method</li>
                            {status.payphiResponse.txnRespDescription && (
                                <li className="reason">
                                    Reason: {status.payphiResponse.txnRespDescription}
                                </li>
                            )}
                        </ul>
                    </div>
                )}



                {/* Action Buttons - Only show when not loading */}
              
                    <div className="payment-actions" data-animate="fade-up">
                        {isSuccess ? (
                            <>
                                <button className="btn btn-primary" onClick={() => history.push("/shop-left")}>
                                    <Home size={20} className="button-icon" />
                                    <span>Continue Shopping</span>
                                </button>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => history.push("/account", { activeComponent: "Orders" })}
                                >
                                    <ShoppingBag size={20} className="button-icon" />
                                    <span>View Orders</span>
                                </button>
                                <button className="btn btn-tertiary" onClick={handleDownloadInvoice}>
                                    <Download size={20} className="button-icon" />
                                    <span>Download Invoice</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <button className="btn btn-secondary" onClick={() => history.push("/shop-left")}>
                                    <Home size={20} className="button-icon" />
                                    <span>Back to Shop</span>
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => history.push(`/checkout?retryOrder=${orderId}`)}
                                >
                                    <RotateCcw size={20} className="button-icon" />
                                    <span>Retry Payment</span>
                                </button>
                                <button className="btn btn-tertiary" onClick={() => history.push("/contact")}>
                                    <span>Contact Support</span>
                                </button>
                            </>
                        )}
                    </div>
             

                {/* Help Text */}
                <div className="help-section" data-animate="fade-up">
                    <div className="support-card">
                        <h4>Need assistance?</h4>
                        <p>Our support team is available 24/7 to help with any questions</p>
                        <div className="support-actions">
                            <a href="/contact" className="support-link">
                                Contact Support
                            </a>
                            <a href="/help" className="support-link">
                                Help Center
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <Footertwo />
        </>
    );
};

export default PaymentStatus;