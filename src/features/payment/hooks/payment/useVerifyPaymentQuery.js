import { useQuery } from '@tanstack/react-query';
import { verifyPayment } from '../../api/paymentService';

export const useVerifyPaymentQuery = (orderId) => {
    return useQuery({
        queryKey: ['verifyPayment', orderId],
        queryFn: () => verifyPayment(orderId),
        enabled: !!orderId,
    });
};
