import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    setFilters,
    fetchFilteredProducts,
    setPagination,
} from '../../../redux/slices/filteredProductsSlice'; // ✅ new name


const ProductFilterPage = () => {
    const dispatch = useDispatch();
    const { filters, products, loading, error, pagination } = useSelector((state) => state.productFilter);

    // Fetch products on initial render or filter change
    useEffect(() => {
        dispatch(fetchFilteredProducts({ ...filters, ...pagination }));
    }, [filters, pagination.page, pagination.pageSize]);

    const handleFilterChange = (e) => {
        dispatch(setFilters({ [e.target.name]: e.target.value }));
        dispatch(setPagination({ page: 0 })); // reset to first page
    };

    const handlePageChange = (newPage) => {
        dispatch(setPagination({ page: newPage }));
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Filter Products</h2>

            <div>
                <label>Item Name:</label>
                <select name="itemName" onChange={handleFilterChange}>
                    <option value="">-- All --</option>
                    <option value="RINGS">Rings</option>
                    <option value="EARRINGS">Earrings</option>
                    <option value="NECKLACES_AND_SETS">Necklaces</option>
                    {/* Add other item names here */}
                </select>

                <label>Gender:</label>
                <select name="gender" onChange={handleFilterChange}>
                    <option value="">-- All --</option>
                    <option value="MEN">Men</option>
                    <option value="WOMEN">Women</option>
                    <option value="KIDS">Kids</option>
                </select>

                <label>Material:</label>
                <select name="materialFinish" onChange={handleFilterChange}>
                    <option value="">-- All --</option>
                    <option value="GOLDCOATED">Gold Coated</option>
                    <option value="SILVERCOATED">Silver Coated</option>
                </select>
            </div>

            <hr />

            <div>
                {loading ? (
                    <p>Loading products...</p>
                ) : error ? (
                    <p>Error: {error}</p>
                ) : (
                    <>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                            {products.map((item, index) => (
                                <div key={index} style={{ border: '1px solid #ccc', padding: '10px', width: '200px' }}>
                                    <h4>{item.name}</h4>
                                    <p>Price: ₹{item.grandTotal}</p>
                                    {/* Add more fields as needed */}
                                </div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        <div style={{ marginTop: '20px' }}>
                            <button
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={pagination.page === 0}
                            >
                                Previous
                            </button>
                            <span style={{ margin: '0 10px' }}>Page {pagination.page + 1}</span>
                            <button
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={pagination.page >= pagination.totalPages - 1}
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProductFilterPage;
