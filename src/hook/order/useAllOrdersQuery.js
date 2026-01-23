
import { useQuery } from '@tanstack/react-query';
import { getAllOrders ,getOrderById } from '../../service/orderService';


export const useAllOrders = () => {
    return useQuery({
        queryKey: ['orderHistory'],
        queryFn: () => getAllOrders(),
    });
};
export const useGetOrderById = (orderId) =>{
    return useQuery({
        queryKey:['getOrderByID'],
        queryFn: () => getOrderById(orderId),
        enabled:!!orderId

    }    
    )
}