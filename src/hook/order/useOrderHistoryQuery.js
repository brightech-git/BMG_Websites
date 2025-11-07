import { useQuery } from '@tanstack/react-query';
import { getOrderHistory, getAllOrders } from '../../service/orderService';

export const useOrderHistory = () => {
    return useQuery({
        queryKey: ['orderHistory'],
        queryFn: () => getOrderHistory(),
        staleTime: 1000 * 60 * 10, // ✅ cache for 10 minutes
        refetchOnMount: 'always', // Always refetch when component mounts
        refetchOnWindowFocus: false, // Refetch when window regains focus
        retry: 1, // Retry failed requests once
    });
};

export const useAllOrders= () => {
    return useQuery({
        queryKey: ['orderHistory'],
        queryFn: () => getAllOrders(),
        staleTime: 1000 * 60 * 10, // ✅ cache for 10 minutes
        refetchOnMount: 'always', // Always refetch when component mounts
        refetchOnWindowFocus: true, // Refetch when window regains focus
        retry: 1, // Retry failed requests once
    });
};