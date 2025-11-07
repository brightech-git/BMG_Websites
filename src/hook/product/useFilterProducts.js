import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { filterProducts } from '../../service/ProductService';

const useFilterProducts = (inputFilters = {}, page, pageSize) => {
    const [data, setData] = useState({ data: [], totalItems: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const reduxFilters = useSelector((state) => state.productFilters);

    // Memoize inputFilters to prevent unnecessary re-renders
    const memoizedInputFilters = useMemo(() => inputFilters, [JSON.stringify(inputFilters)]);

    const fetchFilteredData = async () => {
        try {
            setLoading(true);

            // Parse inputFilters if it's a query string
            let filters = memoizedInputFilters;
            //console.log('Input filters:', filters); // Debug
            if (typeof memoizedInputFilters === 'string') {
                const searchParams = new URLSearchParams(memoizedInputFilters);
                filters = Object.fromEntries(searchParams);
            }

            // Merge only relevant Redux filters with provided filters
            const relevantReduxFilters = {
                sortDirection: reduxFilters.sortDirection,
                sortBy: reduxFilters.sortBy,
            };

            const mergedFilters = {
                ...relevantReduxFilters,
                ...filters,
                page,
                pageSize,
            };

            // Clean filters
            const cleanedFilters = {};
            Object.entries(mergedFilters).forEach(([key, value]) => {
                if (value !== '' && value !== null && value !== undefined) {
                    cleanedFilters[key] = typeof value === 'string' ? value.replace(/^"|"$/g, '').trim() : value;
                }
            });

            //console.log('Cleaned filters:', cleanedFilters); // Debug

            const result = await filterProducts(cleanedFilters);
            //console.log('API result:', result); // Debug
            setData(result || { data: [], totalItems: 0 });
        } catch (err) {
            console.error('API error:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status,
            });
            setError(err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFilteredData();
    }, [
        JSON.stringify(memoizedInputFilters), // Depend on stringified inputFilters
        page,
        pageSize,
        reduxFilters.sortDirection,
        reduxFilters.sortBy,
    ]);

    return {
        data,
        loading,
        error,
        refetch: fetchFilteredData,
    };
};

export default useFilterProducts;