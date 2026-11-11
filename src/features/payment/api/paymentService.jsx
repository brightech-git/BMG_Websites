import publicUrl from '../../../api/publicUrl';

export const createPaymentLink = async (payload) => {
    const response = await publicUrl.post('/payment/create-payment-link', payload);
    return response.data;
    
};
export const verifyPayment = async (orderId) => {
    const response = await publicUrl.get(`/payment/verify-payment?orderId=${orderId}`);
    return response.data;
};

export const paymentOptions = async() =>{
    const {data} = await publicUrl.get('/payment-maintenance');
    return data;
}
