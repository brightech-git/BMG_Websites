
import { useQuery } from '@tanstack/react-query';
import { getAllOrders } from '../../service/orderService';

export const useAllOrders = () => {
    return useQuery({
        queryKey: ['orderHistory'],
        queryFn: () => getAllOrders(),
    });
};