import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useInitiatePayment } from "../../../hook/payment/useInitiatePayment";
import { getPaymentRedirectUrl } from "../../../service/paymentServiceicici";
import { useGetOrderById } from "../../../hook/order/useAllOrdersQuery";

import "./PaymentPage.css";

const PaymentPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const [totalAmount, setTotalAmount] = useState(null);

    const paymentStartedRef = useRef(false);
    const errorShownRef = useRef(false);

    const { data: order, isLoading, isFetching } = useGetOrderById(orderId);
    console.log(order, 'single order')

    const { mutate: initiatePayment } = useInitiatePayment();

    /* -------------------------------------------------------
       Extract total amount from single order
    -------------------------------------------------------- */
    useEffect(() => {
        if (!orderId || isLoading || isFetching) return;

        // adjust this depending on API shape
        const amount = order?.totalAmount ?? order?.order?.totalAmount;

        if (amount == null) {
            if (!errorShownRef.current) {
                toast.error("Unable to fetch order amount");
                errorShownRef.current = true;
            }
            return;
        }

        setTotalAmount(Number(amount));
    }, [orderId, order, isLoading, isFetching]);

    /* -------------------------------------------------------
       Initiate payment (once)
    -------------------------------------------------------- */
    useEffect(() => {
        if (!orderId || totalAmount === null) return;
        if (paymentStartedRef.current) return;

        paymentStartedRef.current = true;

        let cancelled = false;

        initiatePayment(
            {
                merchantTxnNo: orderId,
                amount: totalAmount.toFixed(2),
                currencyCode: 356,
                paymentMode: "UPI",
                transactionType: "SALE",
                addlParam1: "",
                addlParam2: "",
                returnURL: "https://bmgjewellers.com",
            },
            {
                onSuccess: async (response) => {
                    if (cancelled) return;

                    const { redirectURI, tranCtx } = response;
                    console.log(response, 'payemntResponse');


                    if (!redirectURI || !tranCtx) {
                        toast.error(
                            <>
                                <div>Invalid payment response</div>
                                <small>{response?.responseDescription}</small>
                            </>
                        );

                        navigate("/account");
                        return;
                    }

                    try {
                        const finalUrl = await getPaymentRedirectUrl(
                            redirectURI,
                            tranCtx
                        );
                        window.location.href = finalUrl;
                    } catch {
                        toast.error("Failed to redirect to payment gateway");
                        navigate("/account");
                    }
                },
                onError: () => {
                    if (cancelled) return;
                    toast.error("Payment initiation failed");
                    navigate("/account");
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
                <p className="tip">⚡ Tip: Do not refresh or close this page.</p>
            </div>
        </div>
    );
};

export default PaymentPage;
