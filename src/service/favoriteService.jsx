import publicUrl from '../api/publicUrl'; // axios instance with Authorization header

// Add to favorites
export const addFavorite = async (wishlistData) => {
  try {
    console.log("Data for payload:", wishlistData);
    const response = await publicUrl.post(`/wishlist`, wishlistData);
    return response.data;
  } catch (err) {
    console.error("Failed to add favorite:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || "Failed to add favorite");
  }
};


// Remove from favorites
export const removeFavorite = async (tagKey) => {
  const response = await publicUrl.delete(`/wishlist/${tagKey}`);
  return response.data;
};

// Get favorites list
export const getFavorites = async () => {
  const token = localStorage.getItem('user_token');
  if(!token){
    return [];
  }
  const response = await publicUrl.get('/wishlist');
  return response.data;
};
