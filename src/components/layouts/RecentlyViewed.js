import React, { useRef, useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';
import { useRecentlyViewed } from '../../hook/recentlyViewed/useRecentlyViewedQuery';
import { getProductBySno } from '../../service/ProductService';
import ProductCard from '../sections/productCard/ProductCard';
import './recently-viewed.css';

const RecentlyViewed = ({ history }) => {
    const gridRef = useRef(null);
    const [showNavButtons, setShowNavButtons] = useState(false);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    // Fetch recently viewed product SNOs
    const {
        data: recentlyViewedData,
        isLoading: isSnoLoading,
        isError: isSnoError,
        error: snoError,
    } = useRecentlyViewed();

    const snoArray = recentlyViewedData?.data || [];

    // Fetch product details for each SNO using useQueries
    const productQueries = useQueries({
        queries: snoArray.map((sno) => ({
            queryKey: ['singleProduct', sno],
            queryFn: () => getProductBySno(sno),
            enabled: !!sno,
            staleTime: 1000 * 60 * 5,
        })),
    });

    // Filter successful queries and map to product data
    const products = productQueries
        .filter((q) => q.isSuccess && q.data)
        .map((q) => ({
            ...q.data,
            img: q.data.image || '/images/placeholder.jpg',
            title: q.data.name || 'Unnamed Product',
            price: parseFloat(q.data.price || 0),
            discount: parseFloat(q.data.discount || 0),
            SNO: q.data.SNO || q.data.id,
        }));

    const checkScrollPosition = () => {
        if (gridRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = gridRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
        }
    };

    const scrollLeft = () => {
        if (gridRef.current) {
            gridRef.current.scrollBy({
                left: -300,
                behavior: 'smooth'
            });
        }
    };

    const scrollRight = () => {
        if (gridRef.current) {
            gridRef.current.scrollBy({
                left: 300,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        const grid = gridRef.current;
        if (grid) {
            checkScrollPosition();
            grid.addEventListener('scroll', checkScrollPosition);
            return () => grid.removeEventListener('scroll', checkScrollPosition);
        }
    }, [products]);

    useEffect(() => {
        setShowNavButtons(products.length > 0);
    }, [products]);

    if (isSnoError) {
        return (
            <section className="recently-viewed">
                <div className="recently-viewed__container">
                    <p className="recently-viewed__error">{snoError.message || 'Failed to load recently viewed products'}</p>
                </div>
            </section>
        );
    }

    return (
        <section className="recently-viewed">
            <div className="recently-viewed__container">
                <div className="recently-viewed__header">
                    <span className="recently-viewed__subtitle">Recently</span>
                    <h2 className="recently-viewed__title">Viewed Products</h2>
                </div>

                <div className="recently-viewed__content">
                    {showNavButtons && (
                        <button
                            className={`recently-viewed__nav-button recently-viewed__nav-button--prev ${!canScrollLeft ? 'recently-viewed__nav-button--disabled' : ''}`}
                            onClick={scrollLeft}
                            aria-label="Previous products"
                            disabled={!canScrollLeft}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    )}

                    <div className="recently-viewed__grid-wrapper">
                        <div className="recently-viewed__grid" ref={gridRef}>
                            {isSnoLoading ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <div key={`skeleton-${i}`} className="recently-viewed__grid-item">
                                        <div className="recently-viewed__skeleton" />
                                    </div>
                                ))
                            ) : products.length > 0 ? (
                                products.map((item, i) => (
                                    <div key={`product-${item.SNO || i}`} className="recently-viewed__grid-item">
                                        <ProductCard
                                            item={item}
                                            onClick={() => history.push(`/product/${item.SNO}`)}
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="recently-viewed__empty">
                                    <p>No recently viewed products.</p>
                                    <button
                                        className="recently-viewed__cta"
                                        onClick={() => history.push('/shop')}
                                    >
                                        Browse Products
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {showNavButtons && (
                        <button
                            className={`recently-viewed__nav-button recently-viewed__nav-button--next ${!canScrollRight ? 'recently-viewed__nav-button--disabled' : ''}`}
                            onClick={scrollRight}
                            aria-label="Next products"
                            disabled={!canScrollRight}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
};

export default withRouter(RecentlyViewed);