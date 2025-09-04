import publicUrl from '../api/publicUrl'; // axios instance with token
import axios from 'axios';

// Create a new order
export const createOrder = async (orderData) => {
    const response = await publicUrl.post('/order/create', orderData);
    return response.data;
};

// Get order history
export const getOrderHistory = async () => {
    const payload = {
        page:'0',
        size:'100',
    };
    const response = await publicUrl.get('/order/history', {
        params:payload
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
        trkType:"cnno",
        strcnno:refNumber,
        addtnlDtl:"Y",
    };
    console.log(payload ,'tracking');

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
//track ordr by id 
export const trackOrderById = async (orderId) => {
    if (!orderId) throw new Error("Order ID is required");

    const { data } = await publicUrl.get(`/order/track-order`, {
        params: { orderId },
    });

    // We only need current_status and history
    return {
        current_status: data.current_status,
        history: data.history || [],
    };
};