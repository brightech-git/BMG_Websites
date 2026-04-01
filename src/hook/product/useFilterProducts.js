import { useQuery } from "@tanstack/react-query";
import { filterProducts, getProductsFilter, getRelatedProducts, getProductsFiltersContent } from "../../service/ProductService";

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
        placeholderData: (prev) => prev,  // 🔥 smoothest
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