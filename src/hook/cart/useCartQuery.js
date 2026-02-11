import { useQuery, useMutation, useQueryClient, QueryClient } from "@tanstack/react-query";
import {
    fetchCart,
    addToCart,
    deleteCartItem, 
    clearCart
} from "../../service/cartService";
import {  useSelector } from "react-redux";
import { toast } from 'react-toastify';

export const useCart = () => {
    const queryClient = useQueryClient();

    const pincode = localStorage.getItem("userPincode");
    const mobileNumber = useSelector((state) => state.user.user?.contactNumber);
   const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

    // Cart Query
    const { data: cartItems = [], isLoading, error } = useQuery({
        queryKey: ["cart", pincode],
        queryFn: () => fetchCart(pincode),
        enabled: !!mobileNumber,
        staleTime: 1000 * 60 * 5,
        refetchInterval: 5000,
    });

    // Add item mutation
    const addItem = useMutation({
        mutationFn: addToCart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            toast.success("🛒 Item added to cart!");
        },
        onError: (err) => {
            console.error("❌ Add to cart failed:", err);
            toast.error("Failed to add item to cart.");
        },
    });

    // Delete item mutation ✅
    const deleteCartMutation = useMutation({
        mutationFn: deleteCartItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            toast.success("Item removed from cart!");
        },
        onError: (err) => {
            console.error("❌ Delete cart failed:", err);
            toast.error(err?.response?.data?.message || "Failed to delete item.");
        },
    });
    const cartProducts = cartItems?.data?.products || [];
    const cartCount = cartProducts?.length || 0;
    // Clear cart mutation
    const clearAllItems = useMutation({
        mutationFn: clearCart,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
        onError: (err) => console.error("❌ Clear cart failed:", err),
    });
    const handleAddToCart = (item) => {
        if (!isAuthenticated) {
            toast.info("Please login first.");
            return;
        }

        if (!item?.TAGKEY) {
            toast.error("Invalid product.");
            return;
        }

      

        if (cartProducts.some(c => String(c.TAGKEY) === String(item.TAGKEY))) {
            toast.warning("Item already in cart!");
            return;
        }

        addItem.mutate({
            tagKey: item.TAGKEY,
            quantity: 1,
            shippingPincode: pincode || "360004"
        });
    };



    return {
        cartItems,
        isLoading,
        error,
        addToCart: addItem.mutate,
        deleteCart: deleteCartMutation, // ✅ mutation object
        clearCart: clearAllItems.mutate,
        addToCartHandler: (item) => handleAddToCart(item),
        cartCount: cartCount
    };
};
