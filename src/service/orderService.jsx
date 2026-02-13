import publicUrl from '../api/publicUrl'; // axios instance with token

// Create a new order
// services/orderService.js

export const createOrder = async (orderData) => {
    try {
        console.log(orderData, "createOrderData");

        const response = await publicUrl.post('/order/create', orderData);

        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Order creation failed"
        );
    }
};


// Get order history
export const getOrderHistory = async (payload) => {
   

    console.log(payload, 'payload')
    const response = await publicUrl.get('/order/history', {
        params: payload
    });
    return response.data;
};
// Cancel an order
export const cancelOrder = async (payload) => {
    try {
        const response = await publicUrl.post('/order/update-status', payload);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to cancel order');
    }
};

//track order 
export const trackOrder = async (refNumber) => {
    const payload = {
        trkType: "cnno",
        strcnno: refNumber,
        addtnlDtl: "Y",
    };
    //console.log(payload ,'tracking');

    try {
        const response = await publicUrl.post(
            "/dtdc/track",
            payload,
        );

        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message || "Failed to track order"
        );
    }
};
export const trackOrderById = async (orderId) => {
    if (!orderId) throw new Error("Order ID is required");

    try {
        const { data } = await publicUrl.get(`/order/track/user`, {
            params: { orderId },
        });

        // Map API response to expected structure
        return {
            current_status: data.current_status,
            timeline: data.timeline || data.history || [], // Handle both timeline and history
            order_id: data.order_id,
            items: data.items || [],
            canCancel: data.canCancel ?? true, // Default to true if undefined
        };
    } catch (error) {
        console.error('Error fetching tracking data:', error);
        throw new Error(error.message || 'Failed to fetch tracking data');
    }
};

export const orderTrackingById = async (orderId) => {
    if (!orderId) throw new Error("Order ID is required");

    try {
        const { data } = await publicUrl.get(`/order/tracking/${orderId}`);

        // Map API response to expected structure
        return data; 
    } catch (error) {
        console.error('Error fetching tracking data:', error);
        throw new Error(error.message || 'Failed to fetch tracking data');
    }
};




export const getAllOrders = async () => {
    const token = localStorage.getItem('user_token');
    if(!token){
        return [];
    }
    const response = await publicUrl.get('/order/all-ordersCount');
    return response.data;
}


export const refundOrderApi = async (formData) => {
    
    try {
        const response = await publicUrl.post('/refunds/submit', formData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to refund order");
    }
};


export const createReOrder = async (orderId) => {
    console.log(orderId ,'reOrderId')
    try {
        const { data } = await publicUrl.post("/order/reorder", {
            orderId,
        });
        
        return data;
    } catch (error) {
        console.error("Reorder API error:", error);
        throw error; // 🔴 important for react-query onError
    }
};

export const getOrderById = async (orderId) => {
    try {
        const { data } = await publicUrl.get(
            "/order/getOrder",
            {
                params: { orderId },
            }
        );
        return data;
    } catch (error) {
        console.error("GetOrder API error:", error?.response?.data || error);
        throw error;
    }
};

export const getOrderMaster = async() =>{
    try{
        const response = await publicUrl.get('/order/status-master');
        return response.data
    }
    catch(err){
        throw new Error(err.response?.data?.message || "Failed to fetch order master data");
    }
}
export const getOrderInvoice = async (orderId) => {
    try {
        const response = await publicUrl.get(`/order/invoice/${orderId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch invoice");
    }  
}