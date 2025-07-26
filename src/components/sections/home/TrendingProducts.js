import React from 'react';
import Slider from 'react-slick';
import { useHistory } from 'react-router-dom';
import useFilterProducts from '../../../hook/product/useFilterProducts';
import ProductCard from '../productCard/ProductCard';
import './TrendingProducts.css';

const TrendingProducts = () => {
    const { data: trendingProducts, loading, error } = useFilterProducts({ top_trending: true });
    const history = useHistory();

    const sliderSettings = {
        dots: true,
        arrows: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                    centerMode: true,
                    centerPadding: '60px'
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    centerMode: false
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                    centerMode: true,
                    centerPadding: '40px'
                }
            }
        ]
    };

    const handleSeeAll = () => {
        const queryParams = new URLSearchParams();
        queryParams.append('top_trending', 'true');

        const fixedQuery = queryParams.toString().replace(/\+/g, '%20');
        history.push(`/shop-left?${fixedQuery}`);
    };

    if (loading) return <div className="trending-loading">Loading trending products...</div>;
    if (error) return <div className="trending-error">Error: {error.message}</div>;

    return (
        <section className="trending-showcase">
            <div className="trending-container">
                <div className="trending-header">
                    <div className="trending-title-group">
                        <h2 className="trending-main-title">
                            <span className="title-line">Trending Collections</span>
                        </h2>
                        <p className="trending-subtitle">
                            Discover our most coveted pieces this season
                        </p>
                    </div>
                    <button
                        onClick={handleSeeAll}
                        className="trending-cta"
                    >
                        View All
                        <span className="cta-arrow">→</span>
                    </button>
                </div>

                <div className="trending-slider-container">
                    <Slider {...sliderSettings} className="trending-slider">
                        {trendingProducts?.data?.map((item) => (
                            <div key={item.SNO || item.id || item.ITEMID} className="slider-card">
                                <ProductCard item={item} />
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </section>
    );
};

export default TrendingProducts;