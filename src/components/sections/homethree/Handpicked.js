import React from 'react';
import { useHistory } from 'react-router-dom';
import Slider from 'react-slick';
import { useCategoryBanner } from '../../../hook/banner/useCategoriesBanner';
import useFilterProducts from '../../../hook/product/useFilterProducts';
import './Handpicked.css';

const BASE_URL = "https://app.bmgjewellers.com";

const NavigationButton = ({ direction, onClick }) => {
    const iconClass = direction === 'next' ? 'fal fa-arrow-right' : 'fal fa-arrow-left';
    const ariaLabel = direction === 'next' ? 'Next slide' : 'Previous slide';

    return (
        <button
            className={`nav-arrow ${direction}-nav`}
            onClick={onClick}
            aria-label={ariaLabel}
        >
            <i className={iconClass} />
        </button>
    );
};

const ItemCard = ({ product }) => {
    const handleProductClick = (e, sno) => {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = `/shop-detail/${sno}`;
    };

    return (
        <div className="jewel-item-card">
            <div className="item-image-wrapper">
                <img
                    src={`${BASE_URL}${product.image_path}`}
                    alt={product.productName}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/fallback.jpg';
                    }}
                    onClick={(e) => handleProductClick(e, product.SNO)}
                />
            </div>
        </div>
    );
};

const FeaturedItems = ({ itemName, subItemName }) => {
    const { data, loading, error } = useFilterProducts({ itemName, subItemName }, 0, 3);

    if (loading) return <div className="text-center">Loading products...</div>;
    if (error) return <div className="text-center text-danger">Error loading products</div>;

    return (
        <div className="featured-items-grid">
            {data?.data?.map((product, index) => (
                <ItemCard key={`product-${index}`} product={product} />
            ))}
        </div>
    );
};

const Handpicked = () => {
    const history = useHistory();
    const { data, isLoading, error } = useCategoryBanner();

    const handleShopNow = (itemName, subItemName) => {
        const queryParams = new URLSearchParams();
        if (itemName) queryParams.append('itemName', itemName);
        if (subItemName) queryParams.append('subItemName', subItemName);
        history.push(`/shop-left?${queryParams.toString()}`);
    };

    const sliderSettings = {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        arrows: true,
        centerMode: true,
        autoplay: true,
        centerPadding: '25%',
        nextArrow: <NavigationButton direction="next" />,
        prevArrow: <NavigationButton direction="prev" />,
        responsive: [
            { breakpoint: 1600, settings: { centerPadding: '20%' } },
            { breakpoint: 1200, settings: { centerPadding: '15%' } },
            { breakpoint: 992, settings: { centerPadding: '10%' } },
            { breakpoint: 768, settings: { centerPadding: '5%', arrows: false } },
            { breakpoint: 576, settings: { centerMode: false, centerPadding: '0' } },
        ],
    };

    if (isLoading) return <div className="loading-spinner">Loading banners...</div>;
    if (error) return <div className="error-message">Error loading banners: {error.message}</div>;

    return (
        <section className="jewel-showcase">
            <div className="container-fluid">
                <div className="section-top">
                    <span className="section-label">Exclusive Collection</span>
                    <p className="section-description">
                        Hand-selected premium pieces for the discerning collector
                    </p>
                </div>

                <Slider className="jewel-slider-wrapper" {...sliderSettings}>
                    {data?.data?.map((banner, index) => (
                        <div key={`banner-${index}`} className="jewel-slide-item">
                            <div className="main-jewel-piece">
                                <div
                                    className="main-jewel-image"
                                    onClick={() => handleShopNow(banner.itemName, banner.subItemName)}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`View ${banner.itemName} collection`}
                                >
                                    <img
                                        src={`${BASE_URL}${banner.image_path}`}
                                        alt={banner.title}
                                        loading="lazy"
                                    />
                                </div>
                                <FeaturedItems
                                    itemName={banner.itemName}
                                    subItemName={banner.subItemName}
                                />
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </section>
    );
};

export default Handpicked;