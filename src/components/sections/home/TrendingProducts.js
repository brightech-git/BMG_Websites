import React from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import './Bestselling.css'; 
import useFilterProducts from '../../../hook/product/useFilterProducts';
import ProductCard from '../productCard/ProductCard';

const TrendingProducts = () => {
    const {
        data: trendingProducts = [],
        loading,
        error,
    } = useFilterProducts({ top_trending: true });

    console.log(trendingProducts,'trendind products')

    const settings = {
        slidesToShow: 3,
        slidesToScroll: 1,
        fade: false,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 4000,
        arrows: false,
        dots: false,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    centerMode: true,
                    centerPadding: '100px',
                },
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 2,
                    centerMode: true,
                    centerPadding: '30px',
                },
            },
        ],
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <section className="bestselling-section">
            <div className="best-selling-container">
                <div className="bestselling-wrapper">
                    <div className="bestselling-content">
                        <h2 className="section-title">Trending Products</h2>
                        <p className="section-description">
                            Discover what's trending now – our most popular picks in gold, silver, and diamonds.
                        </p>
                        <Link to="/shop-left" className="main-btns btn-filled">Shop Now</Link>
                    </div>

                    <div className="bestselling-slider-wrapper">
                        <Slider className="bestselling-slider" {...settings}>
                            {trendingProducts.map((item, i) => (
                                <div key={item.SNO || item.id || i} className="slider-item">
                                    <ProductCard
                                        item={item}
                                        showDiscount={true}
                                        currency="₹"
                                        discountPosition="top-right"
                                    />
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TrendingProducts;
