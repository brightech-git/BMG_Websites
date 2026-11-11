// src/hooks/order/useOrderMutation.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrder, cancelOrder, refundOrderApi } from '../../api/orderService';
import { toast } from 'react-toastify';

export const useCreateOrder = () => {
    return useMutation({ mutationFn: createOrder });
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

export const useRefundOrder = (onSuccessCallback) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: refundOrderApi,
        onSuccess: (data) => {
            queryClient.invalidateQueries(['orderHistory']);
            queryClient.invalidateQueries(['orderDetails']);

            if (onSuccessCallback) {
                onSuccessCallback(data);
            }
        },
        onError: (error) => {
            console.error('Refund submission failed:', error);
        },
    });
};
