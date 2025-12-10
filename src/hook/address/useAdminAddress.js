import { getAdminAddressById } from "../../service/adminAddressService";
import { useQuery } from "@tanstack/react-query";
// ✅ Correctly pass id into queryKey and lazily call queryFn
export const useAdminAddress = () => {
    return useQuery({
        queryKey: ['adminAddress'], // include id to make the cache key unique
        queryFn: () => getAdminAddressById(), // pass function, not result of function call
        retry: 1,
    });
};
