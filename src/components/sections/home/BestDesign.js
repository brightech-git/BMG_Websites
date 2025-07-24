import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './BestDesign.css';
import useFilterProducts from '../../../hook/product/useFilterProducts';
import ProductCard from '../productCard/ProductCard';

const BestDesign = () => {
    const {
        data: bestDesign = [],
        loading,
        error,
    } = useFilterProducts({ best_design: true });

    const productsContainerRef = useRef(null);
    const scrollIntervalRef = useRef(null);
    const isHoveringRef = useRef(false);

    useEffect(() => {
        const container = productsContainerRef.current;
        if (!container || bestDesign.length <= 4) return;

        const scrollProducts = () => {
            if (isHoveringRef.current) return;

            const container = productsContainerRef.current;
            if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
                container.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                container.scrollBy({ left: 300, behavior: 'smooth' });
            }
        };

        scrollIntervalRef.current = setInterval(scrollProducts, 4000);

        return () => {
            clearInterval(scrollIntervalRef.current);
        };
    }, [bestDesign]);

    const handleMouseEnter = () => {
        isHoveringRef.current = true;
        clearInterval(scrollIntervalRef.current);
    };

    const handleMouseLeave = () => {
        isHoveringRef.current = false;
        scrollIntervalRef.current = setInterval(() => {
            const container = productsContainerRef.current;
            if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
                container.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                container.scrollBy({ left: 300, behavior: 'smooth' });
            }
        }, 4000);
    };

    if (loading) return <div className="loading-spinner">Loading...</div>;
    if (error) return <div className="error-message">Error: {error.message}</div>;

    return (
        <section className="best-design-section">
            <div className="best-design-container">
                <div className="best-design-wrapper">
                    <div className="best-design-products-wrapper"
                        ref={productsContainerRef}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}>
                        <div className="products-container">
                            {bestDesign.map((item, i) => (
                                <div key={item.SNO || item.id || i} className="product-item">
                                    <ProductCard item={item} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="best-design-content">
                        <h2 className="section-title">Best Designed Products</h2>
                        <p className="section-description">
                            Discover what's trending now - our most popular picks in gold polished, silver.
                        </p>
                        <Link to="/shop-left" className="trending-shop-btn">Shop Now</Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BestDesign;