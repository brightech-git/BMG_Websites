import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addressService } from "../../service/AddressService";
import { toast } from "react-toastify";

// Create Address
export const useCreateAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addressService.createAddress,
        onMutate: async (newAddress) => {
            await queryClient.cancelQueries({ queryKey: ["addresses", newAddress.customerId] });
            const previousAddresses = queryClient.getQueryData([
                "addresses",
                newAddress.customerId,
            ]);
            queryClient.setQueryData(["addresses", newAddress.customerId], (old) => {
                const tempId = `temp-${Date.now()}`;
                return [...(old || []), { ...newAddress, id: tempId, createdTime: new Date() }];
            });
            return { previousAddresses, customerId: newAddress.customerId };
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["addresses"] });
            // Toast is handled in component
        },
        onError: (error, newAddress, context) => {
            queryClient.setQueryData(
                ["addresses", context.customerId],
                context.previousAddresses
            );
            if (!error.toastHandled) {
                toast.error(error.response?.data?.message || "Failed to create address");
            }
        },
    });
};

// Get All Addresses for a Customer
export const useAddressesByCustomer = (customerId) => {
    return useQuery({
        queryKey: ["addresses", customerId],
        queryFn: () => addressService.getAddressesByCustomer(customerId),
        enabled: !!customerId,
    });
};

// Get Single Address by ID
export const useAddressById = (id) => {
    return useQuery({
        queryKey: ["address", id],
        queryFn: () => addressService.getAddressById(id),
        enabled: !!id,
    });
};

// Update Address
export const useUpdateAddress = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, address }) => addressService.updateAddress(id, address),

        onMutate: async ({ id, address }) => {
            await queryClient.cancelQueries({
                queryKey: ["addresses", address.customerId],
            });

            const previousAddresses = queryClient.getQueryData([
                "addresses",
                address.customerId,
            ]);

            // ✅ Safe fallback if old is undefined
            queryClient.setQueryData(
                ["addresses", address.customerId],
                (old = []) =>
                    old.map((addr) =>
                        addr.id === id ? { ...addr, ...address } : addr
                    )
            );

            return { previousAddresses, customerId: address.customerId };
        },

        onSuccess: async (_, { address }) => {
            // ✅ Invalidate only this customer's addresses
            await queryClient.invalidateQueries({
                queryKey: ["addresses", address.customerId],
            });
        },

        onError: (error, _variables, context) => {
            // Rollback to previous cache on failure
            queryClient.setQueryData(
                ["addresses", context.customerId],
                context.previousAddresses
            );

            if (!error.toastHandled) {
                toast.error(error?.response?.data?.message || "Failed to update address");
            }
        },
    });
};

// Delete Address
export const useDeleteAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => addressService.deleteAddress(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ["addresses"] });
            const previousAddresses = queryClient.getQueryData(["addresses"]);
            queryClient.setQueryData(["addresses"], (old) =>
                old.filter((addr) => addr.id !== id)
            );
            return { previousAddresses };
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["addresses"] });
            toast.success("Address deleted successfully");
        },
        onError: (error, id, context) => {
            queryClient.setQueryData(["addresses"], context.previousAddresses);
            if (!error.toastHandled) {
                toast.error(error.response?.data?.message || "Failed to delete address");
            }
        },
    });
};