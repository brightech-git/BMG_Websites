import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import Pagination from '../../layouts/Pagination';
import useFilterProducts from '../../../hook/product/useFilterProducts';
import { useAuth } from '../../../context/authContext/UserAuthContext';
import {
    setItemName,
    setSubItemName,
    setMetalId,
    setSizeId,
    setSizeName,
    setCatName,
    setGender,
    setSortBy,
    setSortDirection,
    setMinGrandTotal,
    setMaxGrandTotal,
    setPriceRange,
    setOccasion,
    setMaterialFinish,
    setColorAccent,
    setStoneUnit,
    setAvailability,
    setNewArrival,
    setTopTrending,
    setFeaturedProducts,
    setPage,
    setPageSize,
} from '../../../redux/slices/filterSlice';
import './ShopContent.css';
import ProductCard from '../productCard/ProductCard';
import ProductFilterBar from './ProductFilterBar';

const baseUrl = 'https://app.bmgjewellers.com';

const Content = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    const { user } = useAuth();
    const filters = useSelector((state) => state.productFilters);

    // Parse query params
    const searchParams = new URLSearchParams(location.search);
    console.log(searchParams,'getthedatas from search')
    const page = 0;
    const pageSize = 10;

    // Sync Redux state with URL on mount
    useEffect(() => {
        console.log('Syncing Redux with URL:', Object.fromEntries(searchParams));
        dispatch(setItemName(searchParams.get('itemName')?.replace(/^"|"$/g, '') || ''));
        dispatch(setSubItemName(searchParams.get('subItemName')?.replace(/^"|"$/g, '') || ''));
        dispatch(setMetalId(searchParams.get('metalId')?.replace(/^"|"$/g, '') || ''));
        dispatch(setSizeId(searchParams.get('sizeId') ? Number(searchParams.get('sizeId')) : ''));
        dispatch(setSizeName(searchParams.get('sizeName')?.replace(/^"|"$/g, '') || ''));
        dispatch(setCatName(searchParams.get('catName')?.replace(/^"|"$/g, '') || ''));
        dispatch(setGender(searchParams.get('gender')?.replace(/^"|"$/g, '') || ''));
        dispatch(setSortBy(searchParams.get('sortBy')?.replace(/^"|"$/g, '') || ''));
        dispatch(setSortDirection(searchParams.get('sortDirection')?.toUpperCase() || 'ASC'));
        dispatch(setMinGrandTotal(searchParams.get('minGrandTotal') ? Number(searchParams.get('minGrandTotal')) : ''));
        dispatch(setMaxGrandTotal(searchParams.get('maxGrandTotal') ? Number(searchParams.get('maxGrandTotal')) : ''));
        dispatch(setPriceRange(searchParams.get('priceRange')?.replace(/^"|"$/g, '') || ''));
        dispatch(setOccasion(searchParams.get('occasion')?.replace(/^"|"$/g, '') || ''));
        dispatch(setMaterialFinish(searchParams.get('materialFinish')?.replace(/^"|"$/g, '') || ''));
        dispatch(setColorAccent(searchParams.get('colorAccent')?.replace(/^"|"$/g, '') || ''));
        dispatch(setStoneUnit(searchParams.get('stoneUnit')?.replace(/^"|"$/g, '') || ''));
        dispatch(setAvailability(searchParams.get('availability')?.replace(/^"|"$/g, '') || ''));
        dispatch(setNewArrival(searchParams.get('newArrival')?.replace(/^"|"$/g, '') || ''));
        dispatch(setTopTrending(searchParams.get('topTrending')?.replace(/^"|"$/g, '') || ''));
        dispatch(setFeaturedProducts(searchParams.get('featured_products')?.replace(/^"|"$/g, '') || ''));
        dispatch(setPage(page));
        dispatch(setPageSize(pageSize));
    }, [location.search, dispatch]);

    // Parse query params into an object for useFilterProducts
    const queryFilters = Object.fromEntries(searchParams);
    console.log(queryFilters,'search items')

    // Fetch filtered products
    const { data, loading: isLoading, error: isError, refetch } = useFilterProducts(queryFilters, page, pageSize);

    const handleWishlistToggle = useCallback(
        (e, itemSno, isWishlisted) => {
            e.preventDefault();
            e.stopPropagation();

            if (!user) {
                localStorage.setItem(
                    'redirectAfterLogin',
                    JSON.stringify({
                        path: window.location.pathname,
                        action: 'wishlistToggle',
                        itemSno,
                        isWishlisted,
                    })
                );
                history.push('/login');
                return;
            }

            // Wishlist functionality placeholder
        },
        [user, history]
    );

    if (isLoading) return <div className="loading-spinner">Loading...</div>;
    if (isError)
        return (
            <p className="error-message">
                Failed to load products: {isError.message || 'Unknown error'}.{' '}
                <button onClick={refetch}>Retry</button>
            </p>
        );

    const products = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];

    return (
        <section className="shop-container">
            <ProductFilterBar />
            <div className="product-area">
                <div className="product-header">
                    <p>
                        Showing {products.length ? 1 : 0} to {products.length} of{' '}
                        {data?.totalItems || products.length} results
                    </p>
                </div>
                <div className="product-grid">
                    {products.length > 0 ? (
                        products.map((item) => {
                            let images = [];
                            try {
                                images = JSON.parse(item.ImagePath || '[]');
                            } catch (error) {
                                console.warn('Invalid image JSON for item', item.ITEMID);
                            }
                            const firstImage =
                                images.length > 0
                                    ? `${baseUrl}${images[0]}`
                                    : 'https://via.placeholder.com/245x331';
                            return (
                                <ProductCard
                                    key={item.SNO || item.id || item.ITEMID}
                                    item={item}
                                    onWishlistToggle={(e) => handleWishlistToggle(e, item.SNO, false)}
                                    imageSrc={firstImage}
                                />
                            );
                        })
                    ) : (
                        <p>No products found.</p>
                    )}
                </div>
                <Pagination
                    currentPage={page}
                    pageSize={pageSize}
                    totalItems={data?.totalItems || products.length}
                />
            </div>
        </section>
    );
};

export default Content;

// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchFilteredProducts } from '../../../redux/slices/filteredProductsSlice';
// import { useLocation } from 'react-router-dom';
// import queryString from 'query-string';
// import { setFilter } from '../../../redux/slices/filterSlice';
// import FilterBar from './ProductFilterBar';
// import ProductCard from '../productCard/ProductCard';

// const Content = () => {
//     const dispatch = useDispatch();
//     const location = useLocation();
//     const filters = useSelector(state => state.productFilters);
//     const products = useSelector(state => state.filteredProducts.items);

//     useEffect(() => {
//         // 1. On URL change → update filters in redux
//         const query = queryString.parse(location.search);
//         dispatch(setFilter(query));
//     }, [location.search]);

//     useEffect(() => {
//         // 2. On Redux filters change → fetch data
//         dispatch(fetchFilteredProducts(filters));
//     }, [filters]);

//     return (
//         <div>
//             <FilterBar />
//             <div className="product-grid">
//                 {products.map(product => (
//                     <ProductCard item={product} key={product.SNO}/>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default Content;
