import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createAddress,
    getAddressesByCustomer,
    getAddressById,
    updateAddress,
    deleteAddress,
} from "../../service/newAddressService";
import { toast } from "react-toastify";

// Fetch all addresses by customerId
export const useAddressesByCustomer = (customerId) => {
    return useQuery({
        queryKey: ["addresses", customerId],
        queryFn: () => getAddressesByCustomer(customerId),
        enabled: !!customerId, // only fetch if we have customerId
    });
};

// Fetch single address
export const useAddressById = (id) => {
    return useQuery({
        queryKey: ["address", id],
        queryFn: () => getAddressById(id),
        enabled: !!id,
    });
};

// Create
export const useCreateAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createAddress,
        onSuccess: () => {
            toast.success("Address created successfully");
            queryClient.invalidateQueries(["addresses"]);
        },
        onError: (err) => {
            toast.error(err.response?.data || "Failed to create address");
        },
    });
};

// Update
export const useUpdateAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateAddress,
        onSuccess: () => {
            toast.success("Address updated successfully");
            queryClient.invalidateQueries(["addresses"]);
        },
        onError: (err) => {
            toast.error(err.response?.data || "Failed to update address");
        },
    });
};

// Delete
export const useDeleteAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteAddress,
        onSuccess: () => {
            toast.success("Address deleted successfully");
            queryClient.invalidateQueries(["addresses"]);
        },
        onError: (err) => {
            toast.error(err.response?.data || "Failed to delete address");
        },
    });
};
