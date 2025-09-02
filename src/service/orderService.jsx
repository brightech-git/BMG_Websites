import publicUrl from '../api/publicUrl'; // axios instance with token
import axios from 'axios';

// Create a new order
export const createOrder = async (orderData) => {
    const response = await publicUrl.post('/order/create', orderData);
    return response.data;
};

// Get order history
export const getOrderHistory = async ({ page = 0, size = 10, status = '' }) => {
    const response = await publicUrl.get('/order/history', {
        page,
        size,
        status,
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
        const response = await axios.post(
            "https://blktracksvc.dtdc.com/dtdc-api/rest/JSONCnTrk/getTrackDetails",
            payload,
            {
                headers: {
                    "X-Access-Token": "EO2243_trk_json:5ed7b55505284e87b57202bba5adcc56",
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message || "Failed to track order"
        );
    }
};