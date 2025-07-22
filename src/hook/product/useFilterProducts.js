import { useState, useEffect } from 'react';
import { filterProducts } from '../../service/ProductService';

const useFilterProducts = (initialFilters) => {
    const [filters, setFilters] = useState(initialFilters);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchFilteredData = async (updatedFilters = filters) => {
        try {
            setLoading(true);
            const result = await filterProducts(updatedFilters);
            setData(result?.data || []); // Adjust based on your backend response shape
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFilteredData();
    }, [filters]);

    return {
        data,
        loading,
        error,
        setFilters,
        fetchFilteredData,
    };
};

export default useFilterProducts;
