import React, { useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import HeaderWithAuth from "../layouts/HeaderWithAuth";
import Footertwo from "../layouts/Footerthree";
import { CheckCircle, ShoppingBag, Home } from "lucide-react";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
    const location = useLocation();
    const history = useHistory();

    // Extract query params from location.search
    const searchParams = new URLSearchParams(location.search);
    const orderId = searchParams.get("orderId");

    useEffect(() => {
        // Add animation class to elements with delay
        const elements = document.querySelectorAll('[data-animate]');
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('animate-in');
            }, index * 200);
        });
    }, []);

    return (
        <>
            <HeaderWithAuth />
            <div
                className="payment-success-container"
                role="region"
                aria-labelledby="payment-success-title"
            >
                <div
                    className="success-icon"
                    data-animate="zoom-in"
                >
                    <CheckCircle size={64} aria-hidden="true" />
                </div>
                <h1
                    className="payment-title"
                    id="payment-success-title"
                    data-animate="fade-up"
                >
                    Payment Successful!
                </h1>
                {orderId && (
                    <p
                        className="payment-info"
                        data-animate="fade-up"
                    >
                        Your order ID: <strong>{orderId}</strong>
                    </p>
                )}
                <p
                    className="payment-thankyou"
                    data-animate="fade-up"
                >
                    Thank you for your purchase! Your order has been successfully placed.
                </p>
                <div
                    className="order-details"
                    data-animate="fade-up"
                >
                    <p>We'll send you a confirmation email with all the details soon.</p>
                </div>
                <div
                    className="payment-actions"
                    data-animate="fade-up"
                >
                    <button
                        className="btn-primary"
                        onClick={() => history.push("/")}
                        aria-label="Return to homepage"
                    >
                        <Home size={20} className="button-icon" aria-hidden="true" />
                        Go to Home
                    </button>
                    <button
                        className="btn-secondary"
                        onClick={() => history.push("/orders")}
                        aria-label="View your orders"
                    >
                        <ShoppingBag size={20} className="button-icon" aria-hidden="true" />
                        View Orders
                    </button>
                </div>
            </div>
            <Footertwo />
        </>
    );
};

export default PaymentSuccess;