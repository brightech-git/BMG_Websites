import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { XCircle, RotateCcw, Home } from "lucide-react";
import HeaderWithAuth from "../layouts/HeaderWithAuth";
import Footertwo from "../layouts/Footerthree";
import { getPaymentStatus } from "../../service/paymentServiceicici";
import "./PaymentFailure.css";

const PaymentFailure = () => {
    const location = useLocation();
    const history = useHistory();
    const searchParams = new URLSearchParams(location.search);
    const orderId = searchParams.get("orderId");

    const [status, setStatus] = useState(null);

    useEffect(() => {
        if (!orderId) return;
        const fetchStatus = async () => {
            try {
                const res = await getPaymentStatus(orderId);
                setStatus(res);
            } catch (err) {
                setStatus({ error: true });
            }
        };
        fetchStatus();
    }, [orderId]);

    return (
        <>
            <HeaderWithAuth />
            <div className="payment-failure-container">
                <div className="failure-icon">
                    <XCircle size={96} color="var(--red-color)" className="icon-pulse" />
                </div>

                <h1 className="failure-title">Payment Failed</h1>
                <p className="failure-subtitle">
                    Unfortunately, we couldn't process your payment.
                </p>

                {orderId && (
                    <p className="order-info">
                        Order ID: <strong>{orderId}</strong>
                    </p>
                )}

                {status ? (
                    status.error ? (
                        <p className="status-text warning">
                            Unable to fetch payment status. Please check your orders page.
                        </p>
                    ) : (
                        <p className="status-text">
                            Status: <strong>{status?.message || "FAILED"}</strong>
                        </p>
                    )
                ) : (
                    <p className="status-text">Checking payment status...</p>
                )}

                <div className="failure-actions">
                    <button
                        className="btn-secondary"
                        onClick={() => history.push("/shop-left")}
                    >
                        <Home size={20} className="button-icon" /> Back to Shop
                    </button>
                    <button
                        className="btn-primary"
                        onClick={() => history.push(`/checkout?retryOrder=${orderId}`)}
                    >
                        <RotateCcw size={20} className="button-icon" /> Retry Payment
                    </button>
                </div>

                <p className="help-text">
                    Need help?{" "}
                    <a href="/contact" className="help-link">
                        Contact our support team
                    </a>
                </p>
            </div>
            <Footertwo />
        </>
    );
};

export default PaymentFailure;