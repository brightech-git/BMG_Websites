import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useOrderHistory } from '../../../hook/order/useOrderHistoryQuery';
import { useCreatePaymentLinkMutation } from '../../../hook/payment/useCreatePaymentLinkMutation';
import './PaymentPage.css';

const PaymentPage = () => {
    const { orderId } = useParams(); // from `/payment/:orderId`
    const history = useHistory();
    const [retryCount, setRetryCount] = useState(0);
    const maxRetries = 3;

    const { mutate: createPaymentLink } = useCreatePaymentLinkMutation();
    const {
        data: orders = [],
        isLoading,
        isError,
        refetch,
    } = useOrderHistory({ page: 0, size: 10 });

    useEffect(() => {
        const token = localStorage.getItem('user_token');
        if (!token) {
            alert('Please login to proceed with payment');
            history.push('/login');
            return;
        }

        if (!orderId || isLoading || isError) return;

        const matchedOrder = orders.find(order => order.orderId === orderId);

        if (!matchedOrder && retryCount < maxRetries) {
            const timer = setTimeout(() => {
                setRetryCount(retryCount + 1);
                refetch();
            }, 1000);
            return () => clearTimeout(timer);
        }

        if (!matchedOrder && retryCount >= maxRetries) {
            alert('Order not found after multiple attempts.');
            localStorage.removeItem('pendingOrderId');
            history.push('/orders');
            return;
        }

        if (matchedOrder) {
            const payload = {
                orderId,
                username: matchedOrder.customerName,
                contact: matchedOrder.contact,
                email: matchedOrder.email,
                amount: matchedOrder.totalAmount,
                callback_url: `${window.location.origin}/payment/callback/${orderId}`,
                cancel_url: `${window.location.origin}/payment/callback/${orderId}`,
            };

            createPaymentLink(payload, {
                onSuccess: (res) => {
                    if (res.payment_link || res.paymentUrl) {
                        // Razorpay link received, redirect
                        localStorage.removeItem('pendingOrderId');
                        window.location.href = res.payment_link || res.paymentUrl;
                    } else {
                        alert('No payment URL received.');
                        history.push('/orders');
                    }
                },
                onError: (err) => {
                    console.error('Payment link creation failed:', err);
                    alert('Failed to create payment link. Please try again.');
                    localStorage.removeItem('pendingOrderId');
                    history.push('/orders');
                }
            });
        }
    }, [orderId, orders, isLoading, isError, refetch, retryCount, createPaymentLink, history]);

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
