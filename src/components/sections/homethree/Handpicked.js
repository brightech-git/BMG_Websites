import React from 'react';
import { useHistory } from 'react-router-dom';
import Slider from 'react-slick';
import { useCategoryBanner } from '../../../hook/banner/useCategoriesBanner';
import useFilterProducts from '../../../hook/product/useFilterProducts';
import './handpicked.css';

const BASE_URL = "https://app.bmgjewellers.com";

const ArrowButton = ({ direction, onClick }) => {
    const iconClass = direction === 'next' ? 'fal fa-arrow-right' : 'fal fa-arrow-left';
    const ariaLabel = direction === 'next' ? 'Next slide' : 'Previous slide';

    return (
        <button
            className={`slick-arrow ${direction}-arrow`}
            onClick={onClick}
            aria-label={ariaLabel}
        >
            <i className={iconClass} />
        </button>
    );
};

const ProductCard = ({ product }) => {
    const handleProductClick = (e, sno) => {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = `/shop-detail/${sno}`;
    };

    return (
        <div className="banner-product-card">
            <div className="product-image-container">
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

const BannerProductList = ({ itemName, subItemName }) => {
    const { data, loading, error } = useFilterProducts({ itemName, subItemName }, 0, 3);

    if (loading) return <div className="text-center">Loading products...</div>;
    if (error) return <div className="text-center text-danger">Error loading products</div>;

    return (
        <div className="banner-products">
            {data?.data?.map((product, index) => (
                <ProductCard key={`product-${index}`} product={product} />
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
        nextArrow: <ArrowButton direction="next" />,
        prevArrow: <ArrowButton direction="prev" />,
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
        <section className="jewelry-slider">
            <div className="container-fluid">
                <div className="section-header">
                    <span className="section-tag">Exclusive Collection</span>
                    <h2 className="section-title">Curated Jewelry Masterpieces</h2>
                    <p className="section-subtitle">
                        Hand-selected premium pieces for the discerning collector
                    </p>
                </div>

                <Slider className="jewelry-slider-container" {...sliderSettings}>
                    {data?.data?.map((banner, index) => (
                        <div key={`banner-${index}`} className="jewelry-slide">
                            <div className="main-jewelry-item">
                                <div
                                    className="main-jewelry-img"
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
                                <BannerProductList
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