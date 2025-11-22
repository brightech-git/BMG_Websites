import PublicUrl from "../api/publicUrl";

export const initiatePayment = async (paymentData) => {
    try {
        console.log(paymentData ,'paymentData')
        const { data } = await PublicUrl.post('/payment/initiate-sale', paymentData);
        console.log("payment" ,data)
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

export const getPaymentStatus = async (orderId) => {
    try {
        const payload = {
            merchantTxnNo: orderId,
            originalTxnNo: orderId,
            transactionType: "STATUS",
        };

        const response = await PublicUrl.post(`/payment/status`, payload, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response?.data) {
            return response.data; // ✅ return only the useful data
        } else {
            throw new Error("Empty response from payment status API");
        }
    } catch (err) {
        console.error("Error checking payment status:", err);
        throw err;
    }
};


