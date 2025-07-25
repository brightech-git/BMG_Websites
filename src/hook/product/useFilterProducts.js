import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { filterProducts } from '../../service/ProductService';

const useFilterProducts = (queryString, page, pageSize) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const filters = useSelector((state) => state.productFilters);

    const fetchFilteredData = async () => {
        try {
            setLoading(true);
            const cleanedFilters = {};
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== '' && value !== 0 && value !== 'ASC') {
                    cleanedFilters[key] = typeof value === 'string' ? value.replace(/^"|"$/g, '').trim() : value;
                }
            });

            // Always append page and pageSize as numbers
            cleanedFilters.page = 0;
            cleanedFilters.pageSize = Number(pageSize);

            console.log('API filters:', cleanedFilters); // Debug
            const result = await filterProducts(cleanedFilters);
            console.log('API response:', result); // Debug
            setData(result?.data || []);
        } catch (err) {
            console.error('API error:', err);
            setError(err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFilteredData();
    }, [queryString, page, pageSize, filters]);

    return {
        data,
        loading,
        error,
        refetch: fetchFilteredData,
    };
};

export default useFilterProducts;