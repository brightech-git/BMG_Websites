import React from 'react';
import { useHistory } from 'react-router-dom';
import Slider from 'react-slick';
import { useCategoryBanner } from '../../../hook/banner/useCategoriesBanner';
import useFilterProducts from '../../../hook/product/useFilterProducts';
import './handpicked.css';

const BASE_URL = "https://app.bmgjewellers.com";

const NoBlurNavButton = ({ direction, onClick }) => {
    const iconClass = direction === 'next' ? 'fal fa-arrow-right' : 'fal fa-arrow-left';
    const ariaLabel = direction === 'next' ? 'Next slide' : 'Previous slide';

    return (
        <button
            className={`noblur-nav-btn ${direction}-btn`}
            onClick={onClick}
            aria-label={ariaLabel}
        >
            <i className={iconClass} />
        </button>
    );
};

const NoBlurProductCard = ({ product }) => {
    console.log(product, 'productcard in handpick');

    const handleProductClick = (e, sno) => {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = `/shop-detail/${sno}`;
    };

    // Handle multiple images (array or comma-separated string)
    const getFirstImage = () => {
        if (!product || !product.ImagePath) return null;

        let first = null;

        if (Array.isArray(product.ImagePath)) {
            first = product.ImagePath.length > 0 ? product.ImagePath[0] : null;
        } else if (typeof product.ImagePath === "string") {
            first = product.ImagePath.split(",")[0].trim();
        }

        if (!first) return null;

        // check if it already looks like a full URL
        if (first.startsWith("http://") || first.startsWith("https://")) {
            return first;
        }

        return `${BASE_URL}${first}`;
    };


    const firstImage = getFirstImage();

    return (
        <div className="noblur-product-card">
            <div className="noblur-product-img-container">
                {firstImage ? (
                    <img
                        src={firstImage}
                        alt={product.ITEMNAME}
                        onClick={(e) => handleProductClick(e, product.SNO)}
                    />
                ) : (
                    <div className="noblur-no-image">No Image</div>
                )}
            </div>
        </div>
    );
};

const NoBlurHighlightedProducts = ({ itemName, subItemName }) => {
    const { data, loading, error } = useFilterProducts({ itemName, subItemName }, 0, 3);

    console.log('productsdata', data)

    if (loading) return <div className="noblur-text-center">Loading products...</div>;
    if (error) return <div className="noblur-text-center noblur-text-danger">Error loading products</div>;

    return (
        <div className="noblur-products-grid">
            {data?.data?.map((product, index) => (
                <NoBlurProductCard key={`product-${index}`} product={product} />
            ))}
        </div>
    );
};

const NoBlurHandpicked = () => {
    const history = useHistory();
    const { data, isLoading, error } = useCategoryBanner();

    const handleShopNow = (itemName, subItemName) => {
        const queryParams = new URLSearchParams();
        if (itemName) queryParams.append('itemName', itemName);
        if (subItemName) queryParams.append('subItemName', subItemName);
        history.push(`/shop-left?${queryParams.toString()}`);
    };

    const sliderSettingss = {
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: true,
        arrows: true,
        fade: false,
        centerMode: false,
        autoplay: true,
        autoplaySpeed: 4000,
        speed: 800,
        nextArrow: <NoBlurNavButton direction="next" />,
        prevArrow: <NoBlurNavButton direction="prev" />,
        responsive: [
            {
                breakpoint: 1400,
                settings: {
                    slidesToShow: 3,
                    centerMode: false,
                    centerPadding: '0',
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                    centerMode: false,
                    centerPadding: '0',
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    centerMode: false,
                    centerPadding: '0',
                    arrows: false
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 2,
                    centerMode: false,
                    centerPadding: '0',
                    arrows: false
                }
            },
            {
                breakpoint: 420,
                settings: {
                    slidesToShow: 1,
                    centerMode: false,
                    centerPadding: '0',
                    arrows: false
                }
            },
        ],
    };

    if (isLoading) return <div className="noblur-loading">Loading banners...</div>;
    if (error) return <div className="noblur-error">Error loading banners: {error.message}</div>;

    return (
        <section className="noblur-display">
            <div className="container-fluid">
                <div className="noblur-header">
                    <h2 className="noblur-title">
                        <span className="noblur-gradient-text">Exclusive</span>
                        <span className="noblur-subtitle"> Collection</span>
                    </h2>
                    <p className="noblur-description">
                        Hand-selected premium pieces for the discerning collector
                    </p>
                </div>

                <Slider className="noblur-slider-container" {...sliderSettingss}>
                    {data?.data?.map((banner, index) => (
                        <div key={`banner-${index}`} className="noblur-slide">
                            <div className="noblur-main-product">
                                <div
                                    className="noblur-main-img"
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

                                <NoBlurHighlightedProducts
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

export default NoBlurHandpicked;