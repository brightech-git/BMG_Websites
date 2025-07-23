import React, { useRef } from 'react';
import ProductCard from '../sections/productCard/ProductCard';
import './Ourproducts.css';
import useFilterProducts from '../../hook/product/useFilterProducts';

const Ourproducts = () => {
    const gridRef = useRef(null);

    // Call hook with initial filter
    const {
        data: featuredProducts,
        loading,
        error
    } = useFilterProducts({ new_arrival: 'Y' });

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

    return (
        <section className="featured-products">
            <div className="featured-products__container">
                <div className="featured-products__header">
                    <span className="featured-products__subtitle">New Arrival</span>
                </div>

                <div className="featured-products__grid-wrapper">
                    <button
                        className="featured-products__nav-button featured-products__nav-button--prev"
                        onClick={scrollLeft}
                        aria-label="Previous products"
                    >
                        &lt;
                    </button>

                    <div className="featured-products__grid" ref={gridRef}>
                        {loading && <p>Loading...</p>}
                        {error && <p>Failed to load products</p>}
                        {!loading && !error && featuredProducts.length > 0 && (
                            featuredProducts.map((item, i) => (
                                <ProductCard key={i} item={item} />
                            ))
                        )}
                    </div>

                    <button
                        className="featured-products__nav-button featured-products__nav-button--next"
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

export default Ourproducts;
