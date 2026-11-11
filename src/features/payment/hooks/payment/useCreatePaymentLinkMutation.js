import { useMutation } from '@tanstack/react-query';
import { createPaymentLink } from '../../api/paymentService';

export const useCreatePaymentLinkMutation = () => {
    return useMutation({
        mutationFn: ({ orderId, token }) => createPaymentLink({ orderId, token }),
    });
};
