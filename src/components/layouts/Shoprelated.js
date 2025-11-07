import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import ProductCard from '../sections/productCard/ProductCard';
import useFilterProducts from '../../hook/product/useFilterProducts';
import './ShopRelated.css';

const ShopRelatedUpdated = ({ itemCtrName }) => {
    //console.log('Received itemCtrName:', itemCtrName);
    const sliderRef = useRef(null);

    // Fetch related products using useFilterProducts hook
    const { data, loading, error } = useFilterProducts(
        { itemCtrName }, // No specific filters for related products
        1,  // Page 1
        10  // Fetch up to 10 products
    );
    //console.log('API data:', data); // Debug API response

    const next = () => {
        sliderRef.current.slickNext();
    };

    const previous = () => {
        sliderRef.current.slickPrev();
    };

    const sliderSettings = {
        slidesToShow: 4,
        slidesToScroll: 1,
        fade: false,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 4000,
        arrows: false,
        dots: false,
        swipeToSlide: true,
        touchThreshold: 10, // makes taps more responsive
        pauseOnHover: true,
        accessibility: true,
        swipeToSlide: true,
        touchThreshold: 10,
        focusOnSelect: true,
        pauseOnHover: true,
        focusOnSelect: true, // ✅ allow tapping slides to trigger link clicks
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
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 2,
                },
            },
        ],
    };


    // Map API data to match ProductCard props
    const relatedProducts = data?.data || [];

    //console.log('Mapped products:', relatedProducts); // Debug mapped products

    return (
        <section className="products-showcase-section">
            <div className="products-showcase-container">
                <div className="products-showcase-header">
                    <div className="products-showcase-title">
                        <h2 className="showcase-title">Related Products</h2>
                    </div>
                    <div className="products-showcase-nav">
                        <button
                            className="products-showcase-nav-arrow"
                            onClick={previous}
                            aria-label="Previous products"
                        >
                            <i className="fal fa-arrow-left" />
                        </button>
                        <button
                            className="products-showcase-nav-arrow"
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
                    className="products-showcase-slider"
                    ref={sliderRef}
                    {...sliderSettings}
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

export default ShopRelatedUpdated;