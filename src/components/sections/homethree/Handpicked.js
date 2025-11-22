import React from 'react';
import { useHistory } from 'react-router-dom';
import Slider from 'react-slick';
import useFilterProducts from '../../../hook/product/useFilterProducts';
import './handpicked.css';
import { getProductImages } from '../../../utils/getProductImages';


// ------------------------------
// NAV BUTTONS
// ------------------------------
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


// ------------------------------
// PRODUCT CARD
// ------------------------------
const NoBlurProductCard = ({ product }) => {
    const baseUrl = "https://app.bmgjewellers.com";

    const handleProductClick = (e, sno) => {
        e.preventDefault();
        e.stopPropagation();
        if (sno) window.location.href = `/product-detail/${sno}`;
    };

    const getFirstImage = () => {
        if (!product?.ImagePath) return null;

        let first = null;

        // If array
        if (Array.isArray(product.ImagePath)) {
            first = product.ImagePath[0] ?? null;
        }
        // If comma-separated string
        else if (typeof product.ImagePath === "string") {
            first = product.ImagePath.split(",")[0]?.trim() ?? null;
        }

        if (!first) return null;

        // remove [" "] wrappers
        first = first.replace(/[\[\]"]/g, "").trim();

        if (first.startsWith("http://") || first.startsWith("https://")) {
            return first;
        }

        return `${baseUrl}${first.startsWith("/") ? "" : "/"}${first}`;
    };

    const firstImage = getFirstImage();

    return (
        <div className="noblur-product-card">
            <div className="noblur-product-img-container">
                {firstImage ? (
                    <img
                        src={firstImage}
                        alt={product?.itemCtrName || "Product"}
                        onClick={(e) => handleProductClick(e, product?.SNO)}
                    />
                ) : (
                    <div className="noblur-no-image">No Image</div>
                )}
            </div>
        </div>
    );
};


// ------------------------------
// HIGHLIGHTED PRODUCTS
// ------------------------------
const NoBlurHighlightedProducts = ({ itemCtrName, subItemName }) => {
    const { data, loading, error } = useFilterProducts(
        { itemCtrName, subItemName },
        0,
        3
    );

    if (loading) return <div className="noblur-text-center">Loading products...</div>;
    if (error) return <div className="noblur-text-center noblur-text-danger">Error loading products</div>;

    if (!Array.isArray(data?.data) || data.data.length === 0) {
        return <div className="noblur-text-center">No highlighted products</div>;
    }

    return (
        <div className="noblur-products-grid">
            {data.data.map((product, index) => (
                <NoBlurProductCard key={`product-${index}`} product={product} />
            ))}
        </div>
    );
};


// ------------------------------
// MAIN HANDPICKED SECTION
// ------------------------------
const NoBlurHandpicked = ({ data, isLoading, error }) => {
    const history = useHistory();

    const handleShopNow = (itemName, subItemName) => {
        const q = new URLSearchParams();
        if (itemName) q.append('itemCtrName', itemName);
        if (subItemName) q.append('subItemName', subItemName);
        history.push(`/products-page?${q.toString()}`);
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
            { breakpoint: 1400, settings: { slidesToShow: 3 } },
            { breakpoint: 992, settings: { slidesToShow: 2 } },
            { breakpoint: 768, settings: { slidesToShow: 2, arrows: false } },
            { breakpoint: 576, settings: { slidesToShow: 2, arrows: false } },
            { breakpoint: 420, settings: { slidesToShow: 1, arrows: false } },
        ],
    };

    if (isLoading) return <div className="noblur-loading">Loading banners...</div>;
    if (error) return <div className="noblur-error">Error loading banners</div>;

    const banners = Array.isArray(data?.data) ? data.data : [];

    if (banners.length === 0) {
        return <div className="noblur-no-products">No handpicked banners available</div>;
    }

    return (
        <section className="noblur-display">
            <div className="container-fluid">

                {/* HEADER */}
                <div className="noblur-header">
                    <h2 className="noblur-title">
                        <span className="noblur-gradient-text">Exclusive</span>
                        <span className="noblur-subtitle"> Collection</span>
                    </h2>
                    <p className="noblur-description">
                        Hand-selected premium pieces for the discerning collector
                    </p>
                </div>

                {/* SLIDER */}
                <Slider className="noblur-slider-container" {...sliderSettingss}>
                    {banners.map((banner, index) => (
                        <div key={`banner-${index}`} className="noblur-slide">
                            <div className="noblur-main-product">

                                {/* MAIN BANNER IMAGE */}
                                <div
                                    className="noblur-main-img"
                                    onClick={() => handleShopNow(banner?.itemName, banner?.subItemName)}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`View ${banner?.itemName || ""} collection`}
                                >
                                    <img
                                        src={getProductImages(banner?.image_path)}
                                        alt={banner?.title || "Image"}
                                        loading="lazy"
                                    />
                                </div>

                                {/* SUB PRODUCTS */}
                                <NoBlurHighlightedProducts
                                    itemCtrName={banner?.itemName}
                                    subItemName={banner?.subItemName}
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
