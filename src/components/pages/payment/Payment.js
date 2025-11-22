import React, { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useInitiatePayment } from "../../../hook/payment/useInitiatePayment";
import { getPaymentRedirectUrl } from "../../../service/paymentServiceicici";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import './PaymentPage.css'
const PaymentPage = () => {
    const { orderId } = useParams();
    const history = useHistory();
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

        let cancelled = false;

        const merchantTxnNo = orderId; // Use orderId directly for now

        console.log("Initiating payment with merchantTxnNo:", merchantTxnNo);

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
                    console.log("Payment initiated successfully:", response);

                    const { redirectURI, tranCtx } = response;

                    if (redirectURI && tranCtx) {
                        try {
                            const finalUrl = await getPaymentRedirectUrl(
                                redirectURI,
                                tranCtx
                            );
                            console.log("Redirecting to:", finalUrl);
                            window.location.href = finalUrl;
                        } catch (err) {
                            console.error("Failed to get final redirect URL:", err);
                            toast.error("Failed to redirect");
                            history.push("/account");
                        }
                    } else {
                        console.warn("Missing redirect info in response:", response);
                        toast.error("Missing redirect info");
                        history.push("/account");
                    }
                },
                onError: (error) => {
                    if (cancelled) return;
                    console.error("Payment initiation failed:", error);
                    toast.error("Payment failed");
                    history.push("/account");
                },
            }
        );

        return () => {
            cancelled = true;
        };
    }, [orderId, initiatePayment, history]);

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
