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
        const cleanedFilters = {};
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== '' && value !== null && value !== undefined) {
                cleanedFilters[key] =
                    typeof value === "string" ? value.replace(/^"|"$/g, "").trim() : value;
            }
        });

        const queryString = new URLSearchParams(cleanedFilters).toString();

        const response = await PublicUrl.get(`/product/items/filter?${queryString}`);

        return {
            success: true,
            data: response.data,
            error: null,
        };

    } catch (error) {
        console.error("filterProducts error:", error.response?.data || error.message);

        // ⛔ DO NOT CRASH — return safe fallback
        return {
            success: false,
            data: [],
            error: error.response?.data || error.message,
        };
    }
};

export const getProductsByMetalId = async (metalId) => {
    const response = await PublicUrl.get("/product/getAllPurityWise", {
        params: { metalId },
    });
    return response.data;
};

