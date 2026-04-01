import PublicUrl from '../api/publicUrl';


const BASE_URL = "/ecom/filters";
export const getWhatsappLink = async (sno) => {
   if(sno)
   {
       const response = await PublicUrl.get('/product/whatsapp-link', {
           params: { sno: sno }
       });
       return response.data;
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

        console.log("Sending filters to backend:", queryString);

        const response = await PublicUrl.get(`/product/items/filter?${queryString}`);
        console.log(response.data,'Sending filters to backend:')
        return response.data;

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

export const getProductByTagKey = async (tagKey) => {
    try{
        const response = await PublicUrl.get(`/product/getTagkeyFilter/${tagKey}`);
        return response.data;
    }
    catch(err){
        console.error("getProductByTagKey error:", err.response?.data || err.message);
    }
   
};



export const getProductsFilter = async (itemName) => {
    try {
        const response = await PublicUrl.get('/item-sizes/combined', {
            params: { itemName }
        });
        return response.data;
    } catch (error) {
        console.error("filterProducts error:", error.response?.data || error.message);
        // Return a safe fallback structure
        return {
            success: false,
            data: {
                sizes: [],
                subItems: []
            },
            error: error.response?.data || error.message,
        };
    }
}

export const getRelatedProducts = async (itemCtrId) => {
    try {
        const response = await PublicUrl.get(`/product/related`,{
            params: {itemCtrId}
        });
        return response.data;
    } catch (error) {
        console.error("getRelatedProducts error:", error.response?.data || error.message);
        return [];
    }
}

export const getProductsFiltersContent = async (filters) => {
    try {
      
        const response = await PublicUrl.get(`${BASE_URL}/grouped`, {
            params:filters
        })
        return response.data;
    }
    catch (error) {
        console.error("Error fetching active filter settings:", error);
        throw error;
    }
}
