import React from 'react';
import { useHistory } from 'react-router-dom';
import Slider from 'react-slick';
import { useCategoryBanner } from '../../../hook/banner/useCategoriesBanner';
import useFilterProducts from '../../../hook/product/useFilterProducts';
import './handpicked.css';

const BASE_URL = "https://app.bmgjewellers.com";

const NavButton = ({ direction, onClick }) => {
    const iconClass = direction === 'next' ? 'fal fa-arrow-right' : 'fal fa-arrow-left';
    const ariaLabel = direction === 'next' ? 'Next slide' : 'Previous slide';

    return (
        <button
            className={`gem-nav-btn ${direction}-btn`}
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
        <div className="gem-product-card">
            <div className="product-img-container">
                <img
                    src={`${BASE_URL}${product.image_path}`}
                    alt={product.productName}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/fallback-image.jpg';
                    }}
                    onClick={(e) => handleProductClick(e, product.SNO)}
                />
            </div>
        </div>
    );
};

const HighlightedProducts = ({ itemName, subItemName }) => {
    const { data, loading, error } = useFilterProducts({ itemName, subItemName }, 0, 3);

    if (loading) return <div className="text-center">Loading products...</div>;
    if (error) return <div className="text-center text-danger">Error loading products</div>;

    return (
        <div className="gem-products-grid">
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
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: true,
        arrows: true,
        centerMode: false,
        autoplay: true,
        autoplaySpeed: 4000,
        speed: 800,
        nextArrow: <NavButton direction="next" />,
        prevArrow: <NavButton direction="prev" />,
        responsive: [
            {
                breakpoint: 1400,
                settings: {
                    slidesToShow: 2,
                    centerMode: true,
                    centerPadding: '10%',
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                    centerMode: true,
                    centerPadding: '15%',
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    centerMode: true,
                    centerPadding: '5%',
                    arrows: false
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 2,
                    centerMode: true,
                    centerPadding: '0',
                    arrows: false
                }
            },
            {
                breakpoint: 520,
                settings: {
                    slidesToShow: 1,
                    centerMode: true,
                    centerPadding: '0',
                    arrows: false
                }
            },
        ],
    };

    if (isLoading) return <div className="gem-loading">Loading banners...</div>;
    if (error) return <div className="gem-error">Error loading banners: {error.message}</div>;

    return (
        <section className="gem-display">
            <div className="container-fluid">
                <div className="gem-header">
                    <h2 className="gem-title">
                        <span className="gem-gradient-text">Exclusive</span>
                        <span className="gem-subtitle"> Collection</span>
                    </h2>
                    <p className="gem-description">
                        Hand-selected premium pieces for the discerning collector
                    </p>
                </div>

                <Slider className="gem-slider-container" {...sliderSettings}>
                    {data?.data?.map((banner, index) => (
                        <div key={`banner-${index}`} className="gem-slide">
                            <div className="gem-main-product">
                                <div
                                    className="gem-main-img"
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
                                <HighlightedProducts
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