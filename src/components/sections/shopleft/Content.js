import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import useFilterProducts from '../../../hook/product/useFilterProducts';
import ProductCard from '../productCard/ProductCard';
import ProductFilterBar from './ProductFilterBar';
import './ShopContent.css';
import { useSelector } from 'react-redux';

const baseUrl = 'https://app.bmgjewellers.com';

const Content = () => {
    const history = useHistory();
    const location = useLocation();
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

    const defaultPageSize = 20;
    const [pageSize, setPageSize] = useState(defaultPageSize);
    const [hideLoadMore, setHideLoadMore] = useState(false);
    const previousProductCount = useRef(0);

    const page = 0;
    const searchParams = new URLSearchParams(location.search);
    const queryFilters = Object.fromEntries(searchParams);
    const [loadTriggered, setLoadTriggered] = useState(false);
    const {
        data,
        loading: isLoading,
        error: isError,
        refetch,
    } = useFilterProducts(queryFilters, page, pageSize);

    const handleWishlistToggle = useCallback(
        (e, itemSno, isWishlisted) => {
            e.preventDefault();
            e.stopPropagation();

            if (!isAuthenticated) {
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

            // Wishlist action placeholder
        },
        [isAuthenticated, history]
    );

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    const handleLoadMore = () => {
        previousProductCount.current = products.length;
        setLoadTriggered(true);
        setPageSize((prevSize) => prevSize + 10);
    };

    const products = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
            ? data
            : [];

    const totalItems = data?.totalItems || products.length;

    // 🔍 Detect if load more fetched anything new
    useEffect(() => {
        if (loadTriggered) {
            if (products.length === previousProductCount.current) {
                // No new products were loaded
                setHideLoadMore(true);
            }
            setLoadTriggered(false); // Reset flag after checking
        }
    }, [products.length, loadTriggered]);

    if (isLoading) return <div className="loading-spinner">Loading...</div>;
    if (isError)
        return (
            <p className="error-message">
                Failed to load products: {isError.message || 'Unknown error'}.{' '}
                <button onClick={refetch}>Retry</button>
            </p>
        );

    return (
        <section className="shop-container">
            <ProductFilterBar />
            <div className="product-area">
                <div className="product-header">
                    <p>
                        Showing {products.length ? 1 : 0} to {products.length} of {totalItems} results
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
                                    onWishlistToggle={(e) =>
                                        handleWishlistToggle(e, item.SNO, false)
                                    }
                                    imageSrc={firstImage}
                                />
                            );
                        })
                    ) : (
                        <p>No products found.</p>
                    )}
                </div>

                {/* ✅ Show Load More only if more products are available */}
          
                    <div className="load-more-container">
                        <button className="load-more-btn" onClick={handleLoadMore}>
                            Load More
                        </button>
                    </div>
           
            </div>
        </section>
    );
};

export default Content;
