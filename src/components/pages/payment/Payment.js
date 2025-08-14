import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useOrderHistory } from '../../../hook/order/useOrderHistoryQuery';
import { useInitiatePayment } from '../../../hook/payment/useInitiatePayment';
import './PaymentPage.css';
import { getPaymentRedirectUrl } from '../../../service/paymentServiceicici';
import { ToastContainer } from 'react-toastify';

const PaymentPage = () => {
    const { orderId } = useParams();
    const history = useHistory();
    const [retryCount, setRetryCount] = useState(0);
    const maxRetries = 3;
    const toast = ToastContainer;

    const { mutate: initiatePayment } = useInitiatePayment();
    const { data: orders = [], isLoading, isError, refetch } = useOrderHistory({ page: 0, size: 10 });

    const onSuccess = async (response) => {
        console.log("Payment initiated successfully:", response);

        const { redirectURI, tranCtx } = response || {};

        if (redirectURI && tranCtx) {
            try {
                const redirectUrl = await getPaymentRedirectUrl(redirectURI, tranCtx);
                window.location.href = redirectUrl;
            } catch (err) {
                console.error(err);
                toast.error("Something went wrong while redirecting to payment page.");
                history.push("/orders");
            }
        } else {
            toast.warning("Payment initiation successful but redirect details are missing.");
            history.push("/orders");
        }
    };


    const onError = (error) => {
        console.error('Payment initiation failed:', error);
        alert('Payment failed. Please try again.');
        history.push('/orders');
    };

    useEffect(() => {
        if (!orderId || isLoading || isError) return;
        if (!localStorage.getItem("user_token")) {
            alert("Please login");
            history.push("/login");
            return;
        }

        const matchedOrder = orders.find(order => order.orderId === orderId);
        console.log(matchedOrder,'orderdetail');

        if (!matchedOrder && retryCount < maxRetries) {
            const timer = setTimeout(() => {
                setRetryCount(prev => prev + 1);
                refetch();
            }, 1000);
            return () => clearTimeout(timer);
        }

        if (!matchedOrder && retryCount >= maxRetries) {
            alert("Order not found");
            localStorage.removeItem("pendingOrderId");
            history.push("/orders");
            return;
        }

        if (matchedOrder) {
            initiatePayment({
                merchantTxnNo: orderId,
                amount: matchedOrder.totalAmount,
                currencyCode: 356,
                payType: 0,
                transactionType: "SALE",
                addlParam1:'',
                addlParam2:'',
                returnURL:"https://bmgjewellers.com",
                customerEmailID:matchedOrder.email,
                customerMobileNo:matchedOrder.contact
            }, { onSuccess, onError });
        }
    }, [orderId, orders, isLoading, isError, retryCount]);


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
