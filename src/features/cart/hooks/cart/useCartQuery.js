import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchCart,
    addToCart,
    deleteCartItem, 
    clearCart
} from "../../api/cartService";
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
    const addProducts = (tagKeys, onAdded) => {
        const requests = tagKeys.map((tagKey) => addItem.mutateAsync({
            tagKey,
            quantity: 1,
            shippingPincode: pincode || "360004",
        }));
        return Promise.allSettled(requests).then((results) => {
            if (results.every(({ status }) => status === "fulfilled")) onAdded?.();
        });
    };

    const handleAddToCart = (item, onAdded) => {
        if (!isAuthenticated) {
            toast.info("Please login first.");
            return;
        }

        if (item?.ComboId) {
            const comboItems = item?.ComboItems ?? [];

            if (comboItems.length === 0) {
                toast.error("Combo has no products.");
                return;
            }

            const hasMatch = cartProducts.some((cartItem) =>
                comboItems.some(
                    (comboItem) =>
                        String(cartItem.TAGKEY) === String(comboItem.tagKey || comboItem.TAGKEY)
                )
            );

            if (hasMatch) {
                toast.warning("One or more combo items are already in cart!");
                return;
            }

            const tagKeys = comboItems.map((comboItem) => comboItem.tagKey || comboItem.TAGKEY).filter(Boolean);
            if (tagKeys.length !== comboItems.length) {
                toast.error("Combo has an invalid product.");
                return;
            }

            return addProducts(tagKeys, onAdded);
        }

        if (!item?.TAGKEY) {
            toast.error("Invalid product.");
            return;
        }

        const alreadyInCart = cartProducts.some(
            (cartItem) =>
                String(cartItem.TAGKEY) === String(item.TAGKEY)
        );

        if (alreadyInCart) {
            toast.warning("Item already in cart!");
            return;
        }

        return addProducts([item.TAGKEY], onAdded);
    };



    return {
        cartItems,
        isLoading,
        error,
        addToCart: addItem.mutate,
        deleteCart: deleteCartMutation, // ✅ mutation object
        clearCart: clearAllItems.mutate,
        addToCartHandler: handleAddToCart,
        cartCount: cartCount
    };
};
