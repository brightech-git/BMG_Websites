import React, { useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';
import { useRecentlyViewed } from '../../hook/recentlyViewed/useRecentlyViewedQuery';
import { getProductBySno } from '../../service/ProductService';
import ProductCard from '../sections/productCard/ProductCard';
import './recently-viewed.css';

const RecentlyViewed = ({ history }) => {
    const gridRef = useRef(null);

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

    if (isSnoError) {
        return (
            <section className="recently-viewed">
                <div className="recently-viewed__container">
                    <p>{snoError.message || 'Failed to load recently viewed products'}</p>
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

                <div className="recently-viewed__grid-wrapper">
                    <button
                        className="recently-viewed__nav-button recently-viewed__nav-button--prev"
                        onClick={scrollLeft}
                        aria-label="Previous products"
                    >
                        &lt;
                    </button>

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
                            </div>
                        )}
                    </div>

                    <button
                        className="recently-viewed__nav-button recently-viewed__nav-button--next"
                        onClick={scrollRight}
                        aria-label="Next products"
                    >
                        &gt;
                    </button>
                </div>
            </div>
        </section>
    );
};

export default withRouter(RecentlyViewed);