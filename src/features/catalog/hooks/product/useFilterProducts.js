import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { filterProducts, getProductsFilter, getRelatedProducts, getProductsFiltersContent ,getHeaderFitler} from "../../api/ProductService";

export function useFilteredProducts(filters, pageSize) {
    return useInfiniteQuery({
        queryKey: ["products", filters, pageSize],
        initialPageParam: 1,
        queryFn: async ({ pageParam }) => {
            const result = await filterProducts({
                ...filters,
                page: pageParam,
                pageSize,
            });
            if (result.success === false) {
                throw new Error("Could not load products.");
            }
            return {
                ...result,
                data: Array.isArray(result.data) ? result.data : [],
            };
        },
        getNextPageParam: (lastPage, _pages, page) => {
            if (lastPage.data.length === 0) return undefined;

            // The API offsets from page 1. Its hasMore flag uses a zero-based
            // comparison, so use the page count for this one-based sequence.
            const totalPages = Number(lastPage.totalPages);
            if (Number.isInteger(totalPages) && totalPages >= page) {
                return page < totalPages ? page + 1 : undefined;
            }

            return lastPage.data.length === pageSize ? page + 1 : undefined;
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
    });
}

export const useGetFilters = (itemName) => {
    return useQuery({
        queryKey: ["filters", itemName], // Include itemName in queryKey for caching
        queryFn: () => getProductsFilter(itemName),
        staleTime: 5 * 60 * 1000,
        cacheTime: 15 * 60 * 1000,
        enabled: !!itemName, // Only run if itemName is provided
    });
}

export const useRelatedProducts = (itemCtrId) =>{
    return useQuery({
        queryKey: ["relatedProducts", itemCtrId],
        queryFn: () => getRelatedProducts(itemCtrId),
        staleTime: 5 * 60 * 1000,
        cacheTime: 15 * 60 * 1000,
        enabled: !!itemCtrId,
    });
}

export const useGetProductsFilters = (filters) => {
    return useQuery({
        queryKey: ["productsFilters" , filters],
        queryFn: () => getProductsFiltersContent(filters),
    });
};

export const useGetHeaderFilters = () =>{
    return useQuery({
        queryKey: ["headerFilters"],
        queryFn: () => getHeaderFitler(),
    });
}