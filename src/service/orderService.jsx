import publicUrl from '../api/publicUrl'; // axios instance with token

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