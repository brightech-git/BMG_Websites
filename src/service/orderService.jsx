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
        size:'200',
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

export const getAllOrders = async () => {
    const response = await publicUrl.get('/order/all-ordersCount');
    return response.data;
}