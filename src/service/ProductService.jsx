import PublicUrl from '../api/publicUrl';

export const getAllProducts = async (catname = '', page = 1, pageSize = 50) => {
    const response = await PublicUrl.get('/product/getAllDetails', {
        params: {
            catname,
            page,
            pageSize,
        },
    });
    return response.data;
};
export const getProductBySno = async (sno) => {
    const response = await PublicUrl.get('/product/getSnofilter', {
        params: { sno: sno }
    });

    const data = response.data;

    if (Array.isArray(data) && data.length > 0) {
        return data[0]; // ✅ return single product
    }

    throw new Error(`No product found for SNO: ${sno}`);
};


export const filterProducts = async (filters) => {
    console.log('filter products in the service', filters);
    try {
        // Clean filters to remove quotes or invalid characters
        const cleanedFilters = {};
        Object.entries(filters).forEach(([key, value]) => {
            if (typeof value === 'string') {
                cleanedFilters[key] = value.replace(/^"|"$/g, '').trim();
            } else {
                cleanedFilters[key] = value;
            }
        });

        // Convert cleaned filters to query string
        const queryString = new URLSearchParams(cleanedFilters).toString();
        console.log('Query string:', queryString); // Debug

        // Use POST with query string (as per your current implementation)
        const response = await PublicUrl.post(`/product/items/filter?${queryString}`);
        console.log('filterProducts response:', response.data); // Debug
        return response.data;
    } catch (error) {
        console.error('filterProducts error:', error.response?.data || error.message);
        throw error.response?.data || error.message;
    }
};
export const getProductsByMetalId = async (metalId) => {
    const response = await PublicUrl.get("/product/getAllPurityWise", {
        params: { metalId },
    });
    return response.data;
};

