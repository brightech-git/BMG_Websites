import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import ProductCard from '../sections/productCard/ProductCard';
import useFilterProducts from '../../hook/product/useFilterProducts';
import './ShopRelated.css';

const ShopRelated = () => {
    const sliderRef = useRef(null);

    // Fetch related products using useFilterProducts hook
    const { data, loading, error } = useFilterProducts(
        {}, // No specific filters for related products (can customize)
        1,  // Page 1
        10  // Fetch up to 10 products
    );
    console.log('API data:', data); // Debug API response

    const next = () => {
        sliderRef.current.slickNext();
    };

    const previous = () => {
        sliderRef.current.slickPrev();
    };

    const settings = {
        slidesToShow: 4,
        slidesToScroll: 1,
        fade: false,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 4000,
        arrows: false,
        dots: false,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 4,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 4,
                },
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 3,
                },
            },
        ],
    };

    // Map API data to match ProductCard props based on actual API response
    const relatedProducts = data?.data;

    console.log('Mapped products:', relatedProducts); // Debug mapped products

    return (
        <section className="related-products-section">
            <div className="related-products-container">
                <div className="related-products-header">
                    <div className="related-products-title">
                        <span className="title-tag">Shop</span>
                        <h2>Related Products</h2>
                    </div>
                    <div className="related-products-nav">
                        <button
                            className="related-products-nav-arrow"
                            onClick={previous}
                            aria-label="Previous products"
                        >
                            <i className="fal fa-arrow-left" />
                        </button>
                        <button
                            className="related-products-nav-arrow"
                            onClick={next}
                            aria-label="Next products"
                        >
                            <i className="fal fa-arrow-right" />
                        </button>
                    </div>
                </div>

                {loading && <div>Loading products...</div>}
                {error && (
                    <div className="alert alert-danger" style={{ fontSize: '14px' }}>
                        Failed to load products: {error}
                    </div>
                )}
                {!loading && !error && relatedProducts.length === 0 && (
                    <div>No related products found.</div>
                )}

                <Slider
                    className="related-products-slider"
                    ref={sliderRef}
                    {...settings}
                >
                    {relatedProducts.map((item, i) => (
                        <div key={i}>
                            <div>
                                <ProductCard item={item} />
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </section>
    );
};

export default ShopRelated;