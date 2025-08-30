import React, { useState, useEffect } from 'react';
import { useCategoryBanner } from '../../hook/banner/useCategoryBanner';
import fallbackImage from '../../assets/img/banner/footer.webp';
import './BreadStyles.css';

const Breadcrumbs = ({ itemName, subItemName }) => {
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const { data: bannerData, isLoading, error } = useCategoryBanner({ itemName, subItemName });

    // Construct image source safely
    const imageSrc = bannerData?.image
        ? `https://app.bmgjewellers.com${bannerData.image}`
        : fallbackImage;

    // Handle image loading errors
    const handleImageError = (e) => {
        console.error('Failed to load banner image:', imageSrc);
        e.target.src = fallbackImage;
    };

    // Reset loading state when image source changes
    useEffect(() => {
        setIsImageLoaded(false);
    }, [imageSrc]);

    return (
        <section className="hero-banner-section" aria-label="Category banner">
            <div className="banner-container">
                <img
                    src={imageSrc}
                    alt={bannerData?.title || "Category Banner"}
                    className={`img-fluid category-hero-image ${isImageLoaded ? 'loaded' : 'loading'}`}
                    onLoad={() => setIsImageLoaded(true)}
                    onError={handleImageError}
                    loading="lazy"
                />

                {/* Show loading skeleton while image is loading */}
                {!isImageLoaded && (
                    <div className="image-placeholder"></div>
                )}

                <div className="hero-content-overlay">
                    <h1 className="hero-main-title">
                        {isLoading ? "Loading..." : (bannerData?.title || itemName || "Category")}
                    </h1>
                    <p className="hero-description">
                        {bannerData?.subtitle || subItemName || "Explore our collection"}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Breadcrumbs;