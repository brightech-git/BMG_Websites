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
    console.log("payment Order ID:", orderId);
    const paymentMode = mode === "COD" ? "COD" : "ONLINE";
    console.log("Payment Mode:", paymentMode);

    const [status, setStatus] = useState(null);
    const [showConfetti, setShowConfetti] = useState(true);

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

        if (paymentMode === "ONLINE") {
            const fetchStatus = async () => {
                try {
                    const res = await getPaymentStatus(orderId);
                    setStatus(res);
                } catch (err) {
                    setStatus({ error: true });
                }
            };
            fetchStatus();
        } else if (paymentMode === "COD") {
            setStatus({ txnStatus: "Cash on Delivery" });
        }
    }, [orderId, paymentMode]);

    return (
        <>
            <HeaderWithAuth />
            <div className="payment-success-container">
                {/* 🎉 Confetti Animation */}
                {showConfetti && (
                    <div className="confetti-container">
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
                    <CheckCircle size={80} color="#2e7d32" aria-hidden="true" />
                </div>

                {/* Title + Subtitle */}
                <h1 className="payment-title" data-animate="fade-up">
                    {paymentMode === "COD"
                        ? "Order Placed Successfully!"
                        : "Payment Successful!"}
                </h1>
                <p className="payment-subtitle" data-animate="fade-up">
                    {paymentMode === "COD"
                        ? "Your order has been confirmed with Cash on Delivery."
                        : "Your payment has been received successfully."}
                </p>

                {/* Order ID */}
                {orderId && (
                    <p className="payment-info" data-animate="fade-up">
                        Order ID: <strong>{orderId}</strong>
                    </p>
                )}

                {/* Status Block */}
                {paymentMode === "COD" ? (
                    <p className="payment-status" data-animate="fade-up">
                        Payment Mode: <strong>Cash on Delivery</strong>
                    </p>
                ) : status ? (
                    status.error ? (
                        <p className="payment-warning" data-animate="fade-up">
                            Unable to fetch payment status. Please check your orders page.
                        </p>
                    ) : (
                        <p className="payment-status" data-animate="fade-up">
                            Payment Status: <strong>{status?.message || "Processing..."}</strong>
                        </p>
                    )
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
                        onClick={() => history.push("/shop-left")}
                    >
                        <Home size={20} className="button-icon" /> Continue Shopping
                    </button>
                    <button
                        className="btn-secondary"
                        onClick={() =>
                            history.push("/account", { activeComponent: "Orders" })
                        }
                    >
                        <ShoppingBag size={20} className="button-icon" /> View Orders
                    </button>
                    {/* Uncomment when invoice API ready */}
                    {/* <button className="btn-tertiary" onClick={handleDownloadInvoice}>
            <Download size={20} className="button-icon" /> Download Invoice
          </button> */}
                </div>
            </div>
            <Footertwo />
        </>
    );
};

export default PaymentSuccess;
