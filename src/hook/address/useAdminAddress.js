import { getAdminAddressById } from "../../service/adminAddressService";
import { useQuery } from "@tanstack/react-query";
// ✅ Correctly pass id into queryKey and lazily call queryFn
export const useAdminAddress = (id) => {
    return useQuery({
        queryKey: ['adminAddress', id], // include id to make the cache key unique
        queryFn: () => getAdminAddressById(id), // pass function, not result of function call
        enabled: !!id, // optional: avoids running query if id is undefined/null
        retry: 1,
    });
};
