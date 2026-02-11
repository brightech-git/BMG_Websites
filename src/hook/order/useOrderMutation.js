// src/hooks/order/useOrderMutation.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrder, cancelOrder, refundOrderApi } from '../../service/orderService';
import { toast } from 'react-toastify';

export const useCreateOrder = (navigate) => {
    return useMutation({
        mutationFn: createOrder,

        onSuccess: (data, variables) => {
            if (!data?.orderId) {
                toast.error("Order created but orderId not returned.");
                return;
            }

            toast.success("Order created successfully 🎉");

            if (variables.paymentMode === "ONLINE") {
                navigate(`/payment/${data.orderId}`, {
                    state: { orderPayload: variables },
                });
            } else {
                navigate(`/payment-success?orderId=${data.orderId}&mode=COD`, {
                    state: { orderPayload: variables },
                });
            }
        },

        onError: (error) => {
            console.error("Order creation failed:", error);
            toast.error(error.message || "Failed to create order");
        },
    });
};


export const useCancelOrder = () => {
    const queryClient = useQueryClient(); // For cache invalidation

    return useMutation({
        mutationFn: cancelOrder, // Pass the function reference, not an invocation
        onSuccess: () => {
            // Invalidate order-related queries to refresh data
            queryClient.invalidateQueries(['orderHistory']);
            queryClient.invalidateQueries(['orderDetails']);
        },
        onError: (error) => {
            console.error('Error cancelling order:', error);
            // Optionally handle error (e.g., show toast notification)
        },
    });
};

export const useRefundOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: refundOrderApi,
        onSuccess: () => {
            queryClient.invalidateQueries(['orderHistory']);
            queryClient.invalidateQueries(['orderDetails']);
        },
        onError: (error) => {
            console.error('Refund submission failed:', error);
        },
    });
};