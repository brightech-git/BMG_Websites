import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import HeaderWithAuth from "../layouts/HeaderWithAuth";
import Footertwo from "../layouts/Footerthree";
import { CheckCircle, ShoppingBag, Home } from "lucide-react";
import "./PaymentSuccess.css";
import { getPaymentStatus } from "../../service/paymentServiceicici";

const PaymentSuccess = () => {
    const location = useLocation();
    const history = useHistory();
    const searchParams = new URLSearchParams(location.search);
    const orderId = searchParams.get("orderId");

    const [status, setStatus] = useState(null);

    useEffect(() => {
        // animate
        const elements = document.querySelectorAll("[data-animate]");
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add("animate-in");
            }, index * 200);
        });
    }, []);

    useEffect(() => {
        if (orderId) {
            getPaymentStatus(orderId)
                .then((res) => {
                    console.log("Payment Status Response:", res);
                    setStatus(res);
                })
                .catch(() => {
                    setStatus({ error: true });
                });
        }
    }, [orderId]);

    return (
        <>
            <HeaderWithAuth />
            <div className="payment-success-container">
                <div className="success-icon" data-animate="zoom-in">
                    <CheckCircle size={64} aria-hidden="true" />
                </div>
                <h1 className="payment-title" id="payment-success-title" data-animate="fade-up">
                    Payment Successful!
                </h1>

                {orderId && (
                    <p className="payment-info" data-animate="fade-up">
                        Your order ID: <strong>{orderId}</strong>
                    </p>
                )}

                {status ? (
                    status.error ? (
                        <p className="payment-warning" data-animate="fade-up">
                            Unable to fetch payment status. Please check your orders page.
                        </p>
                    ) : (
                        <p className="payment-status" data-animate="fade-up">
                            Payment Status: <strong>{status.txnStatus || "Processing..."}</strong>
                        </p>
                    )
                ) : (
                    <p className="payment-status" data-animate="fade-up">
                        Checking payment status...
                    </p>
                )}

                <div className="payment-thankyou" data-animate="fade-up">
                    Thank you for your purchase!
                </div>

                <div className="payment-actions" data-animate="fade-up">
                    <button className="btn-primary" onClick={() => history.push("/")}>
                        <Home size={20} className="button-icon" /> Go to Home
                    </button>
                    <button className="btn-secondary" onClick={() => history.push("/account", { activeComponent: "Orders" })}>
                        <ShoppingBag size={20} className="button-icon" /> View Orders
                    </button>
                </div>
            </div>
            <Footertwo />
        </>
    );
};

export default PaymentSuccess;
