import { useQuery, useMutation, useQueryClient, QueryClient } from "@tanstack/react-query";
import {
    fetchCart,
    addToCart,
    updateCartItem,
    deleteCartItem,
    clearCart
} from "../../service/cartService";
import {  useSelector } from "react-redux";


export const useCart = () => {
    const queryClient = useQueryClient();

    const mobileNumber = useSelector((state) => state.user.user?.contactNumber);
    //console.log("📱 Mobile Number from Redux:", mobileNumber);

    // Always get the latest values from localStorage
    const token = localStorage.getItem("user_token");
    

    const { data: cartItems = [], isLoading, error } = useQuery({
        queryKey: ["cart"],
        queryFn: () => fetchCart(mobileNumber),
        enabled: !!mobileNumber,
        staleTime: 1000 * 60 * 5,
        refetchInterval:5000,
    });

    // ✅ Mutation for adding item
    const addItem = useMutation({
        mutationFn: addToCart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
        onError: (err) => {
            console.error("❌ Add to cart failed:", err);
            alert("Failed to add item to cart.");
        },
    });

    // ✅ Mutation for updating item
    const updateItem = useMutation({
        mutationFn: updateCartItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
        onError: (err) => {
            console.error("❌ Update cart failed:", err);
            alert("Failed to update cart item.");
        },
    });

    // ✅ Mutation for deleting item
    const deleteItem = useMutation({
        mutationFn: deleteCartItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
        onError: (err) => {
            console.error("❌ Delete cart failed:", err);
            alert("Failed to delete item.");
        },
    });
    
    // ✅ Handler for checking and adding/updating cart
    const addToCartHandler = (newItem) => {
        // //console.log("🛒 Add to Cart Handler Triggered:", newItem);

        
        if (!mobileNumber) {
            alert("User mobile number not found. Please login again.");
            
            return;
        }

        const existingItem = Array.isArray(cartItems?.data)
            ? cartItems.data.find((item) => item.itemTagSno === newItem.itemTagSno)
            : null;

        if (existingItem) {
            updateItem.mutate({
                ...existingItem,
                quantity: existingItem.quantity + (newItem.quantity || 1),
            });
        } else {
            addItem.mutate({
                ...newItem,
                phone: mobileNumber, // ✅ REQUIRED FIELD
                quantity: newItem.quantity || 1,
            });
        }
    };
    const clearAllItems = useMutation({
        mutationFn:clearCart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
        onError: (err) => {
            console.error("❌ Clear cart failed:", err);
        },
    })


    return {
        cartItems,
        isLoading,
        error,
        addToCart: addItem.mutate,
        updateCart: updateItem.mutate,
        deleteCart: deleteItem.mutate,
        clearCart: clearAllItems.mutate,
        addToCartHandler,
        clearAllItems
    };
};
