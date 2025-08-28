// src/hooks/order/useOrderMutation.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrder ,cancelOrder } from '../../service/orderService';

export const useCreateOrder = () => {
    return useMutation({
        mutationFn: createOrder,
        
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