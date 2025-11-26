import React, { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useInitiatePayment } from "../../../hook/payment/useInitiatePayment";
import { getPaymentRedirectUrl } from "../../../service/paymentServiceicici";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import './PaymentPage.css';
import { useOrderHistory } from "../../../hook/order/useOrderHistoryQuery";
const PaymentPage = () => {
    const { orderId } = useParams();
    const history = useHistory();
    const {data:orders } =useOrderHistory();
    const existingOrders = orders?.orders;

    console.log(existingOrders ,'orderexisted')
    const { mutate: initiatePayment } = useInitiatePayment();
    const location = useLocation();
    const orderPayload = location.state?.orderPayload;

    const totalAmount = orderPayload?.totalAmount.toFixed(2) ?? "N/A";
    const customerName = orderPayload?.customerName ?? "Customer";

    useEffect(() => {
        if (!orderId) {
            console.warn("No orderId provided");
            return;
        }

        // 🔥 STEP 1: Do not allow multiple payment attempts for same order
        const isOrderAlreadyProcessed = existingOrders?.some(
            (order) => order.orderId === orderId
        );

        if (isOrderAlreadyProcessed) {
            toast.warn("This order payment already attempted. Redirecting...");
            history.replace("/account"); // or /orders page
            return; // ❌ Stop here so API never calls again
        }

        // --- Your existing code below ---
        let cancelled = false;
        const merchantTxnNo = orderId;

        initiatePayment(
            {
                merchantTxnNo,
                amount: totalAmount,
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

                    if (redirectURI && tranCtx) {
                        try {
                            const finalUrl = await getPaymentRedirectUrl(
                                redirectURI,
                                tranCtx
                            );
                            window.location.href = finalUrl;
                        } catch (err) {
                            toast.error("Failed to redirect");
                            history.push("/account");
                        }
                    } else {
                        toast.error("Missing redirect info");
                        history.push("/account");
                    }
                },
                onError: () => {
                    if (cancelled) return;
                    toast.error("Payment failed");
                    history.push("/account");
                },
            }
        );

        return () => {
            cancelled = true;
        };
    }, [orderId, initiatePayment]);


    return (
        <div className="payment-page-container">
            <div className="payment-box">
                <div className="spinner"></div>
                <h2>Redirecting to Payment...</h2>
                <p>
                    Please wait while we securely redirect you to the payment gateway.
                </p>
                <p className="tip">
                    ⚡ Tip: Do not refresh or close this page.
                </p>
            </div>
        </div>
    );
};

export default PaymentPage;
