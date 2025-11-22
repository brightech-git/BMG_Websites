import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import useFilterProducts from '../../../hook/product/useFilterProducts';
import ProductCard from '../productCard/ProductCard';
import ProductFilterBar from './ProductFilterBar';
import './ShopContent.css';
import { useSelector } from 'react-redux';
import Breadcrumb from '../../layouts/Breadcrumb';
import { useNotification } from '../../../context/notification/NotificationContext';

const baseUrl = 'https://app.bmgjewellers.com';

// Bootstrap Loading Placeholder Component
const ProductCardPlaceholder = () => (
    <div className="product-card-placeholder">
        <div className="placeholder-glow">
            <div className="product-thumb">
                <div className="placeholder bg-secondary w-100 h-100"></div>
            </div>
            <div className="product-desc">
                <div className="placeholder bg-secondary mb-2" style={{ height: '20px', width: '80%' }}></div>
                <div className="placeholder bg-secondary mb-2" style={{ height: '16px', width: '60%' }}></div>
                <div className="placeholder bg-secondary mb-2" style={{ height: '18px', width: '40%' }}></div>
                <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="placeholder bg-secondary" style={{ height: '20px', width: '50px' }}></div>
                    <div className="placeholder bg-secondary rounded-circle" style={{ height: '32px', width: '32px' }}></div>
                </div>
            </div>
        </div>
    </div>
);

// Loading Grid Component
const LoadingGrid = ({ count = 8 }) => (
    <div className="product-grid">
        {Array.from({ length: count }, (_, index) => (
            <ProductCardPlaceholder key={index} />
        ))}
    </div>
);

const Content = () => {
    const history = useHistory();
    const location = useLocation();
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

    const defaultPageSize = 20;
    const [pageSize, setPageSize] = useState(defaultPageSize);
    const [hideLoadMore, setHideLoadMore] = useState(false);
    const [lastAttemptTriggered, setLastAttemptTriggered] = useState(false);
    const previousProductCount = useRef(0);
    const observerRef = useRef(null);
    const loadMoreRef = useRef(null);

    const page = 0;
    const searchParams = new URLSearchParams(location.search);
    const queryFilters = Object.fromEntries(searchParams);
    const {
        data,
        loading: isLoading,
        error: isError,
        refetch,
    } = useFilterProducts(queryFilters, page, pageSize);

    const { askNotification } = useNotification();

    useEffect(() => {
        askNotification('Welcome to BMG Jewellers', 'Stay updated with important updates.')
    }, [])

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

    const products = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
            ? data
            : [];

    const handleLoadMore = useCallback(() => {
        if (lastAttemptTriggered) return; // Prevent further triggers after last attempt
        //console.log('handleLoadMore triggered, previous count:', previousProductCount.current);
        previousProductCount.current = products.length; // Set before fetch
        setPageSize((prevSize) => {
            if (prevSize === defaultPageSize) return prevSize + 30; // First load: 20 + 30
            return prevSize + 10; // Subsequent loads: +10
        });
    }, [defaultPageSize, lastAttemptTriggered, products.length]);

    // Detect if no new products were fetched
    useEffect(() => {
        //console.log('products.length current:', previousProductCount.current);
        //console.log('product length:', products.length);
        //console.log('products.length === previousProductCount.current:', products.length === previousProductCount.current);
        if (!isLoading && previousProductCount.current > 0 && products.length === previousProductCount.current || products.length === 0) {
            // No new products were loaded after a fetch attempt
            setHideLoadMore(true);
            setLastAttemptTriggered(true); // Mark that the last attempt was made
        } else if (!isLoading && products.length > previousProductCount.current) {
            // New products were loaded, reset flags
            setHideLoadMore(false);
            setLastAttemptTriggered(false);
        }
    }, [products.length, isLoading]);

    // Reset states when filters change
    useEffect(() => {
        // Only reset if queryFilters change significantly
        setHideLoadMore(false);
        setLastAttemptTriggered(false);
        setPageSize(defaultPageSize); // Reset pageSize to initial value
        previousProductCount.current = 0; // Reset product count
    }, [location.search, defaultPageSize]);

    // Set up IntersectionObserver for infinite scroll
    useEffect(() => {
        if (isLoading || hideLoadMore || lastAttemptTriggered) {
            // Unobserve if no more products to load
            if (observerRef.current && loadMoreRef.current) {
                observerRef.current.unobserve(loadMoreRef.current);
            }
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isLoading) {
                    //console.log('IntersectionObserver triggered');
                    handleLoadMore();
                }
            },
            { threshold: 0.1 }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        observerRef.current = observer;

        return () => {
            if (observerRef.current && loadMoreRef.current) {
                observerRef.current.unobserve(loadMoreRef.current);
            }
        };
    }, [isLoading, hideLoadMore, handleLoadMore, lastAttemptTriggered]);

    // Show loading placeholders for initial load
    if (isLoading && products.length === 0) {
        return (
            <section className="shop-container">
                {/* <ProductFilterBar isLoading={isLoading}/> */}
                <div className="product-area">
                    <div className="product-header">
                        <div className="placeholder-glow">
                            <div className="placeholder bg-secondary" style={{ height: '20px', width: '200px' }}></div>
                        </div>
                    </div>
                    <LoadingGrid count={10} />
                </div>
            </section>
        );
    }

    if (isError)
        return (
            <p className="error-message">
                Failed to load products: {isError.message || 'Unknown error'}.{' '}
                <button onClick={refetch}>Retry</button>
            </p>
        );

    return (
        <section className="shop-container">
            <Breadcrumb />
            <ProductFilterBar />
            <div className="product-area">
                <div className="product-header">
                    <p>
                        Showing {products.length ? 1 : 0} to {products.length} of{' '}
                        {data?.totalItems ?? 'many'} results
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

                {/* Loading indicator or no more products message */}
                {!hideLoadMore ? (
                    <div ref={loadMoreRef} className="load-more-container">
                        {isLoading ? (
                            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60px' }}>
                                <div className="placeholder-glow d-flex gap-2">
                                    <div className="spinner-border text-secondary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <div className="placeholder bg-secondary align-self-center" style={{ height: '20px', width: '120px' }}></div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ height: '20px' }} /> // Invisible trigger for observer
                        )}
                    </div>
                ) : (
                    products.length > 0 && (
                        <div className="load-more-container">
                            <p>No more products to load</p>
                        </div>
                    )
                )}
            </div>
        </section>
    );
};

export default Content;