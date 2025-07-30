import React, { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Pagination from '../../layouts/Pagination';
import useFilterProducts from '../../../hook/product/useFilterProducts';
import { useAuth } from '../../../context/authContext/UserAuthContext';
import ProductCard from '../productCard/ProductCard';
import ProductFilterBar from './ProductFilterBar';
import './ShopContent.css';

const baseUrl = 'https://app.bmgjewellers.com';

const Content = () => {
    const history = useHistory();
    const location = useLocation();
    const { user } = useAuth();

    // Parse query params
    const searchParams = new URLSearchParams(location.search);
    const page = parseInt(searchParams.get('page')) || 0;
    const pageSize = parseInt(searchParams.get('pageSize')) || 10;

    // Parse query params into an object for useFilterProducts
    const queryFilters = Object.fromEntries(searchParams);

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

    const handlePageChange = (newPage) => {
        const params = new URLSearchParams(location.search);
        params.set('page', newPage);
        history.push({ search: params.toString() });
    };

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
                    onPageChange={handlePageChange}
                />
            </div>
        </section>
    );
};

export default Content;