import { useQuery } from "@tanstack/react-query";
import { filterProducts ,getProductsFilter } from "../../service/ProductService";

export const useFilteredProducts = (filters, page, pageSize) => {
    return useQuery({
        queryKey: ["products", filters, page, pageSize],
        queryFn: () =>
            filterProducts({
                ...filters,
                page,
                pageSize,
            }),

        staleTime: 5 * 60 * 1000,
        cacheTime: 15 * 60 * 1000,

        keepPreviousData: true,
        refetchOnWindowFocus: false,
        retry: 1,
    });
};


export const useGetFilters = (itemName) => {
    return useQuery({
        queryKey: ["filters", itemName], // Include itemName in queryKey for caching
        queryFn: () => getProductsFilter(itemName),
        staleTime: 5 * 60 * 1000,
        cacheTime: 15 * 60 * 1000,
        enabled: !!itemName, // Only run if itemName is provided
    });
}