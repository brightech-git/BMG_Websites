import { useQuery } from '@tanstack/react-query';
import { getOrderHistory } from '../../service/orderService';

export const useOrderHistory = () => {
    return useQuery({
        queryKey: ['orderHistory'],
        queryFn: () => getOrderHistory(), 
    });
};

