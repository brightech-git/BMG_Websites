import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { CheckCircle, ShoppingBag, Home } from "lucide-react";
import HeaderWithAuth from "../layouts/HeaderWithAuth";
import Footertwo from "../layouts/Footerthree";
import { getPaymentStatus } from "../../service/paymentServiceicici";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
    const location = useLocation();
    const history = useHistory();
    const searchParams = new URLSearchParams(location.search);
    const orderId = searchParams.get("orderId");
    const mode = searchParams.get("mode");
    const paymentMode = mode === "COD" ? "COD" : "ONLINE";

    const [status, setStatus] = useState(null);
    const [showConfetti, setShowConfetti] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Trigger fade-in animations
        const elements = document.querySelectorAll("[data-animate]");
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add("animate-in");
            }, index * 200);
        });

        // Hide confetti after 3s
        const confettiTimer = setTimeout(() => {
            setShowConfetti(false);
        }, 3000);

        return () => clearTimeout(confettiTimer);
    }, []);

    useEffect(() => {
        if (!orderId) return;

        if (paymentMode === "COD") {
            setStatus({
                message: "Order Placed Successfully",
                paymentStatus: "Cash on Delivery",
                status: "PLACED",
            });
            return;
        }

        const fetchStatus = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const res = await getPaymentStatus(orderId);
                setStatus({
                    message: res.message || "Payment and status updated successfully",
                    paymentStatus: res.paymentStatus || "PAID",
                    status: res.status || "PLACED",
                });
            } catch (err) {
                setError("Failed to fetch payment status. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        if (paymentMode === "ONLINE") {
            fetchStatus();
        }
    }, [orderId, paymentMode]);

    const handleRetry = () => {
        if (paymentMode === "ONLINE" && orderId) {
            const fetchStatus = async () => {
                setIsLoading(true);
                setError(null);
                try {
                    const res = await getPaymentStatus(orderId);
                    setStatus({
                        message: res.message || "Payment and status updated successfully",
                        paymentStatus: res.paymentStatus || "PAID",
                        status: res.status || "PLACED",
                    });
                } catch (err) {
                    setError("Failed to fetch payment status. Please try again.");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchStatus();
        }
    };

    return (
        <>
            <HeaderWithAuth />
            <div className="payment-success-container" role="main">
                {/* 🎉 Confetti Animation */}
                {showConfetti && (
                    <div className="confetti-container" aria-hidden="true">
                        {[...Array(50)].map((_, i) => (
                            <div
                                key={i}
                                className="confetti"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 2}s`,
                                    backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* ✅ Success Icon */}
                <div className="success-icon" data-animate="zoom-in">
                    <CheckCircle size={80} color="#2e7d32" aria-label="Success Icon" />
                </div>

                {/* Title */}
                <h1 className="payment-title" data-animate="fade-up">
                    {paymentMode === "COD"
                        ? "Order Placed Successfully!"
                        : "Payment Successful!"}
                </h1>

                {/* Subtitle */}
                <p className="payment-subtitle" data-animate="fade-up">
                    {status?.message ||
                        (paymentMode === "COD"
                            ? "Your order has been confirmed with Cash on Delivery."
                            : "Your payment has been received successfully.")}
                </p>

                {/* Order ID */}
                {orderId && (
                    <p className="payment-info" data-animate="fade-up">
                        Order ID: <strong>{orderId}</strong>
                    </p>
                )}

                {/* Status Block */}
                {isLoading ? (
                    <p className="payment-status" data-animate="fade-up">
                        Checking payment status...
                    </p>
                ) : error ? (
                    <div className="payment-warning" data-animate="fade-up">
                        <p>{error}</p>
                        <button
                            className="btn-tertiary"
                            onClick={handleRetry}
                            aria-label="Retry fetching payment status"
                        >
                            Retry
                        </button>
                    </div>
                ) : status ? (
                    <p className="payment-status" data-animate="fade-up">
                        Payment Status: <strong>{status.paymentStatus}</strong> | Order Status:{" "}
                        <strong>{status.status}</strong>
                    </p>
                ) : (
                    <p className="payment-status" data-animate="fade-up">
                        Checking payment status...
                    </p>
                )}

                {/* Next Steps */}
                <div className="order-details" data-animate="fade-up">
                    <h3>What’s Next?</h3>
                    <ul>
                        <li>You’ll receive an order confirmation email shortly.</li>
                        <li>We’ll notify you when your order ships.</li>
                        <li>Estimated delivery: 3–5 business days.</li>
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="payment-actions" data-animate="fade-up">
                    <button
                        className="btn-primary"
                        onClick={() => history.push("/products-page")}
                        aria-label="Continue Shopping"
                    >
                        <Home size={20} className="button-icon" /> Continue Shopping
                    </button>
                    <button
                        className="btn-secondary"
                        onClick={() => history.push("/account", { state: { activeComponent: "Orders" } })}
                        aria-label="View Orders"
                    >
                        <ShoppingBag size={20} className="button-icon" /> View Orders
                    </button>
                </div>
            </div>
            <Footertwo />
        </>
    );
};

export default PaymentSuccess;