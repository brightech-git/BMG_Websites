import React, { useState, useEffect } from "react";
import { useCategoryBanner } from "../../hook/banner/useCategoryBanner";
import fallbackImage from "../../assets/images/clouds-back.jpg";
import "./BreadStyles.css";

const Breadcrumbs = ({ itemId, subItemId, filterId, pages }) => {
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    // Build params — only include non-empty values
    const params = {
        ...(itemId && { itemId }),
        ...(subItemId && { subItemId }),
        ...(filterId && { filterId }),
        ...(pages && { pages }),
    };

    console.log(params, 'params');

    const { data: bannerData, isLoading, isError } = useCategoryBanner(params);

    const banners = bannerData?.results || [];

    console.log(banners, 'breadcrumb');

    // Reset loading state whenever data or props change
    useEffect(() => {
        setIsImageLoaded(false);
    }, [bannerData, itemId, subItemId, filterId, pages]);

    const handleImageError = (e) => {
        console.error("Failed to load banner image:", e.target.src);
        e.target.src = fallbackImage;
    };

    const renderFallbackBanner = () => (
        <div className="banner-wrapper">
            <img
                src={fallbackImage}
                alt="Fallback Banner"
                className="banner-image loaded"
                loading="lazy"
            />
            <div className="banner-content-overlay">
                <h1 className="banner-title">
                    {pages || itemId || "Category"}
                </h1>
                <p className="banner-description">
                    Explore our collection
                </p>
            </div>
        </div>
    );

    return (
        <section className="banner-section" aria-label="Category banner">
            <div className="banner-image-container">
                {isError || banners.length === 0 ? (
                    renderFallbackBanner()
                ) : (
                    banners.map((item, index) => {
                        const imageSrc = item?.image
                            ? `https://app.bmgjewellers.com${item.image}`
                            : fallbackImage;

                        console.log(imageSrc, 'imageSrc');

                        return (
                            <div key={item.id || index} className="banner-wrapper">
                                <img
                                    src={imageSrc}
                                    alt={item?.title || "Category Banner"}
                                    className={`banner-image ${isImageLoaded ? "loaded" : "loading"}`}
                                    onLoad={() => setIsImageLoaded(true)}
                                    onError={handleImageError}
                                    loading="lazy"
                                />
                            </div>
                        );
                    })
                )}
            </div>
        </section>
    );
};

export default Breadcrumbs;