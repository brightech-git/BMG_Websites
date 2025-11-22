// 📁 src/hooks/payment/useInitiatePayment.js
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { initiatePayment } from '../../service/paymentServiceicici';

export const useInitiatePayment = (options = {}) => {
    return useMutation({
        mutationFn: initiatePayment,
        onSuccess: (data) => {
            if (options.onSuccess) options.onSuccess(data);
            
        },
        onError: (error) => {
            const errMsg = typeof error === 'string'
                ? error
                : error?.message || 'Payment initiation failed';
            toast.error(errMsg);
            if (options.onError) options.onError(error);
        },
    });
};
