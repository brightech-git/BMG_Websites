import React from "react";
import { useLocation, useHistory } from "react-router-dom";
import HeaderWithAuth from "../layouts/HeaderWithAuth";
import Footertwo from "../layouts/Footerthree";

const PaymentSuccess = () => {
    const location = useLocation();
    const history = useHistory();

    // Extract query params from location.search
    const searchParams = new URLSearchParams(location.search);
    const orderId = searchParams.get("orderId");

    console.log(orderId ,'orderid')

    return (
        <>
            <HeaderWithAuth />
            <div className="payment-success-container">
                <h1 className="payment-title">✅ Payment Successful!</h1>
                {orderId && (
                    <p className="payment-info">
                        Your order ID: <strong>{orderId}</strong>
                    </p>
                )}
                <p className="payment-thankyou">Thank you for your purchase.</p>

                <div className="payment-actions">
                    <button className="btn-primary" onClick={() => history.push("/")}>
                        Go to Home
                    </button>
                    <button className="btn-secondary" onClick={() => history.push("/orders")}>
                        View Orders
                    </button>
                </div>
            </div>
            <Footertwo />
        </>
    );
};

export default PaymentSuccess;
