import { useQuery } from '@tanstack/react-query';
import { getOrderHistory } from '../../service/orderService';

export const useOrderHistory = () => {
    return useQuery({
        queryKey: ['orderHistory'],
        queryFn: getOrderHistory,

        // 🔑 CRITICAL FIXES
        staleTime: 0,
        cacheTime: 0,
        refetchOnMount: 'always',
        refetchOnWindowFocus: false,
    });
};
