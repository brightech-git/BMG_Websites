import PublicUrl from "../api/publicUrl";

// Add item to recently viewed
export const addRecentlyViewed = async (tagKey) => {
    const token = localStorage.getItem('user_token');

    if(!token){
        return {message:"NO Token Found"}
    }
    
    const response = await PublicUrl.post(
        '/recently-viewed/add',
        null,
        {
            params: { tagKey },
        }
    );
    return response.data;
};
  
// Get recently viewed items
export const getRecentlyViewedItems = async () => {
    const token = localStorage.getItem('user_token');

    if (!token) {
        return { message: "NO Token Found" }
    }
    const response = await PublicUrl.get('/recently-viewed/list',{
    });
    return response.data;
};
