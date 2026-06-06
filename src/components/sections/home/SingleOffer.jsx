import React, { useState } from 'react';

import './SingleOffer.css'
import { useNavigate } from 'react-router-dom/cjs/react-router-dom.min';

const SingleOffer = ({
    offer,
    onClick,
    className = "",
    showHoverEffect = true,
    showCornerBadge = false
}) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const baseUrl = "https://app.bmgjewellers.com";

    const history = useNavigate();

    if (!offer) return null;

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = '/fallback-image.jpg';
        setImageLoaded(true);
    };


    const handleClick = (ItemName, subItemName) => {
        const queryParams = new URLSearchParams();
        if (ItemName) queryParams.append('ItemName', ItemName);
        if (subItemName) queryParams.append('subItemName', subItemName);
        const fixedQuery = queryParams.toString().replace(/\+/g, '%20');
        navigate(`/products-page?${fixedQuery}`);
    };

    return (
        <div className={`minimal-offer-container ${className}`}>
            <div
                className={`minimal-offer-card ${onClick ? 'clickable' : ''} ${showHoverEffect ? 'with-hover' : ''}`}
            >
                {/* Loading State */}
                {!imageLoaded && (
                    <div className="minimal-image-skeleton">
                        <div className="skeleton-overlay">
                            <div className="skeleton-pulse"></div>
                        </div>
                    </div>
                )}

                {/* Main Image */}
                <div
                    className={`minimal-image-container ${imageLoaded ? 'loaded' : ''}`}
                    onClick={() => handleClick(offer.title, offer.subtitle)}
                >

                    <img
                        src={offer.image_path ? `${baseUrl}${offer.image_path}` : '/fallback-image.jpg'}
                        alt={offer.title || 'Special Offer'}
                        className="minimal-offer-image"
                        loading="lazy"
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                        draggable={false}
                    />

                    {/* Subtle Interaction Indicator */}
                    {onClick && showHoverEffect && (
                        <div className="minimal-interaction-overlay">
                            <div className="interaction-ripple"></div>
                        </div>
                    )}

                    {/* Optional Corner Badge */}
                    {showCornerBadge && offer.is_featured && (
                        <div className="minimal-corner-badge">
                            <div className="badge-dot"></div>
                        </div>
                    )}
                </div>

                {/* Focus Ring */}
                <div className="minimal-focus-ring"></div>
            </div>
        </div>
    );
};

export default SingleOffer;