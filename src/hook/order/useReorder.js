import { useMutation } from "@tanstack/react-query";
import { createReOrder } from "../../service/orderService";

export const useCreateReOrder = () => {
    return useMutation({
        mutationKey: ["reorder"],
        mutationFn: (orderId) => createReOrder(orderId),

        onSuccess: (data) => {
            // handle success side-effects here if needed
            // e.g., toast.success("Order reordered successfully");
        },

        onError: (error) => {
            console.error("Reorder failed:", error);
            // e.g., toast.error("Failed to reorder the order");
        },
    });
};
