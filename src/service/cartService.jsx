import PublicUrl from "../api/publicUrl";

// ✅ Auth headers generator (fresh token every time)
const authHeader = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("user_token")}`,
    },
});

// ✅ Get Cart by phone number
export const fetchCart = async (pincode) => {
    try {
        const config = {
            ...authHeader(),
            params: {}, // start empty
        };

        // Only add pincode if it exists
        if (pincode) {
            config.params.pincode = pincode;
        }

        const response = await PublicUrl.get("/cart/summary", config);
        return response.data; // return only data
    } catch (err) {
        throw new Error(
            err.response?.data?.error || err.message || "Failed to fetch cart"
        );
    }
};



// ✅ Add item to cart
export const addToCart = (cartItem) => {

    console.log(cartItem,'cartItems')
    return PublicUrl.post("/cart/product", cartItem, authHeader());
};


// ✅ Delete item from cart
export const deleteCartItem = async (tagKey) => {
    try {
        const response = await PublicUrl.delete(`/cart/delete/${tagKey}`, authHeader());
        return response.data;
    } catch (err) {
        console.error("❌ Delete cart service error:", err);
        throw err; // re-throw so mutation's onError catches it
    }
};

export const clearCart = () => {
    try{
        return PublicUrl.delete(`/cart/clear`, authHeader());
    }
  catch(err){
    throw new Error(err.response?.data?.error || err.meessage);
  }
}