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
    try {
        const response = await PublicUrl.post('/product/items/filter', null, {
            params: filters,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
export const getProductsByMetalId = async (metalId) => {
    const response = await PublicUrl.get("/product/getAllPurityWise", {
        params: { metalId },
    });
    return response.data;
};

