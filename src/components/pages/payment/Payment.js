import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { toast } from "react-toastify";

import { useInitiatePayment } from "../../../hook/payment/useInitiatePayment";
import { getPaymentRedirectUrl } from "../../../service/paymentServiceicici";
import { useOrderHistory } from "../../../hook/order/useOrderHistoryQuery";

import "./PaymentPage.css";

const PaymentPage = () => {

    const { orderId } = useParams();
    const history = useHistory();
    const location = useLocation();

    const [totalAmount, setTotalAmount] = useState(null);

    const { data: orders } = useOrderHistory();
    const existingOrders = orders?.orders ?? [];

    const { mutate: initiatePayment } = useInitiatePayment();

    const orderPayload = location.state?.orderPayload;
    const customerName = orderPayload?.customerName ?? "Customer";

    /* -------------------------------------------------------
       Extract total amount once order history is loaded
    -------------------------------------------------------- */
    useEffect(() => {
        if (!orderId || existingOrders.length === 0) return;

        const orderDetails = existingOrders.find(
            (order) => order.orderId === orderId
        );

        if (!orderDetails?.totalAmount) {
            console.warn("Total amount not found for order:", orderId);
            toast.error("Unable to fetch order amount");
            // history.push("/account");
            return;
        }

        setTotalAmount(Number(orderDetails.totalAmount));
    }, [orderId, existingOrders, history]);

    /* -------------------------------------------------------
       Initiate payment only after totalAmount is ready
    -------------------------------------------------------- */
    useEffect(() => {
        if (!orderId || totalAmount === null) return;

        let cancelled = false;
        const merchantTxnNo = orderId;

        initiatePayment(
            {
                merchantTxnNo,
                amount: totalAmount.toFixed(2), // ✅ Payment gateway safe
                currencyCode: 356,
                payType: 0,
                transactionType: "SALE",
                addlParam1: "",
                addlParam2: "",
                returnURL: "https://bmgjewellers.com",
            },
            {
                onSuccess: async (response) => {
                    if (cancelled) return;

                    const { redirectURI, tranCtx } = response;

                    if (!redirectURI || !tranCtx) {
                        toast.error("Invalid payment response");
                        history.push("/account");
                        return;
                    }

                    try {
                        const finalUrl = await getPaymentRedirectUrl(
                            redirectURI,
                            tranCtx
                        );
                        window.location.href = finalUrl;
                    } catch (error) {
                        toast.error("Failed to redirect to payment gateway");
                        history.push("/account");
                    }
                },
                onError: () => {
                    if (cancelled) return;
                    toast.error("Payment initiation failed");
                    history.push("/account");
                },
            }
        );

        return () => {
            cancelled = true;
        };
    }, [orderId, totalAmount, initiatePayment, history]);

    /* -------------------------------------------------------
       UI
    -------------------------------------------------------- */
    return (
        <div className="payment-page-container">
            <div className="payment-box">
                <div className="spinner" />
                <h2>Redirecting to Payment...</h2>
                <p>
                    Please wait while we securely redirect you to the payment
                    gateway.
                </p>
                <p className="tip">
                    ⚡ Tip: Do not refresh or close this page.
                </p>
            </div>
        </div>
    );
};

export default PaymentPage;
