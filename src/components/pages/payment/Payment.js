import React, { useEffect, useState } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { useInitiatePayment } from '../../../hook/payment/useInitiatePayment';
import './PaymentPage.css';
import { getPaymentRedirectUrl } from '../../../service/paymentServiceicici';
import { toast } from 'react-toastify';

const PaymentPage = () => {
    const { orderId } = useParams();
    const history = useHistory();
    const location = useLocation();
    const { mutate: initiatePayment } = useInitiatePayment();

    const [retryCount, setRetryCount] = useState(0);
    const maxRetries = 3;

    // ✅ Get order payload from router state or fallback to localStorage
    let orderPayload = location.state?.orderPayload;
    if (!orderPayload) {
        orderPayload = JSON.parse(localStorage.getItem("order"));
    }

    //console.log("Order Payload:", orderPayload);

    const onSuccess = async (response) => {
        //console.log("Payment initiated successfully:", response);

        const { redirectURI, tranCtx } = response || {};

        if (redirectURI && tranCtx) {
            try {
                toast.success('Payment initiated successfully!');
                const redirectUrl = await getPaymentRedirectUrl(redirectURI, tranCtx);
                window.location.href = redirectUrl;
            } catch (err) {
                console.error(err);
                toast.error("Something went wrong while redirecting to payment page.");
                history.push("/account", { activeComponent: "Orders" });
            }
        } else {
            history.push("/account", { activeComponent: "Orders" });
            toast.warning("Order redirect details are missing.");
        }
    };

    const onError = (error) => {
        console.error('Payment initiation failed:', error);
        toast.error('Payment failed. Please try again.');
        history.push("/account", { activeComponent: "Orders" });
    };

    useEffect(() => {
        if (!orderId) return;
        if (!localStorage.getItem("user_token")) {
            toast.error("Please login");
            history.push("/login");
            return;
        }

        if (!orderPayload) {
            toast.error("Order details not found");
            history.push("/account", { activeComponent: "Orders" });
            return;
        }

        // ✅ Trigger payment directly from passed payload
        initiatePayment({
            merchantTxnNo: orderId,
            amount: orderPayload.totalAmount,
            currencyCode: 356,
            payType: 0,
            transactionType: "SALE",
            addlParam1: '',
            addlParam2: '',
            returnURL: "https://bmgjewellers.com",
            customerEmailID: orderPayload.email,
            customerMobileNo: orderPayload.contact
        }, { onSuccess, onError });

    }, [orderId, orderPayload, history, initiatePayment]);

    return (
        <div className="payment-loading-page">
            <div className="payment-loading-spinner"></div>
            <h2>Generating Payment Link...</h2>
            <p>Please wait while we redirect you to the secure payment gateway.</p>
            {retryCount > 0 && (
                <p className="retry-message">
                    Retrying... ({retryCount}/{maxRetries})
                </p>
            )}
        </div>
    );
};

export default PaymentPage;
