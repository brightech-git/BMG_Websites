import PublicUrl from "../api/publicUrl";

export const initiatePayment = async (paymentData) => {
    try {
        const { data } = await PublicUrl.post('/payment/initiate-sale', paymentData);
        return data;
    } catch (error) {
        console.error('Payment initiation failed:', error);
        throw error?.response?.data || error;
    }
}; 

export const getPaymentRedirectUrl = async (redirectURI, tranCtx) => {
    try {
        const { data } = await PublicUrl.post("/payment/redirect-url", { redirectURI, tranCtx }, {
            responseType: "text" // Ensure we get raw text, not JSON
        });
        return data;
    } catch (error) {
        console.error("Failed to get payment redirect URL:", error);
        throw error?.response?.data || error;
    }
};

export const getPaymentStatus = async (orderId)=>{
    try{
        const response = await PublicUrl.post(`/payment/status`, { merchantTxnNo: orderId, originalTxnNo: orderId, transactionType :"STATUS"});
        return response.data;
    }
    catch (err) {
        console.error("Error checking payment status:", err);
        throw err;
    }
} 