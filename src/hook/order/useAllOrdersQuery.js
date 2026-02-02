
import { useQuery } from '@tanstack/react-query';
import { getAllOrders ,getOrderById ,getOrderInvoice} from '../../service/orderService';


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
export const useOrderInvoice = (orderId) =>{
    return useQuery({
        queryKey:['orderInvoice'],
        queryFn: () => getOrderInvoice(orderId),
        enabled:!!orderId
    })
}