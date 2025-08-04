import PublicUrl from "../api/publicUrl";

// Add item to recently viewed
export const addRecentlyViewed = async (itemSno) => {
    
    const response = await PublicUrl.post(
        '/recently-viewed/add',
        null,
        {
            params: { itemSno },
        }
    );
    return response.data;
};
  
// Get recently viewed items
export const getRecentlyViewedItems = async () => {
    const response = await PublicUrl.get('/recently-viewed/list',{
    });
    return response.data;
};
