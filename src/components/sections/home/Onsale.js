import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useFestivalBanner } from '../../../hook/banner/useFestivalBanner';
import './OnSale.css';

const Onsale = () => {
    const { data: festivalBannerResponse, isLoading, isError } = useFestivalBanner();
    const baseUrl = "https://bmgjewellers.com";

    const festivalBanners = festivalBannerResponse?.data || [];
    const mainBanner = festivalBanners[0] || null;
    const secondaryBanners = festivalBanners.slice(1);

    const handleProductClick = (itemName, subItemName) => {
        const queryParams = new URLSearchParams();
        if (itemName) queryParams.append('itemName', itemName);
        if (subItemName) queryParams.append('subItemName', subItemName);
        window.location.href = `/products-page?${queryParams.toString()}`;
    };

    if (isLoading) {
        return (
            <section className="collections-showcase">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Featured Collections</h2>
                        <div className="title-decoration"></div>
                    </div>
                    <div className="collections-grid">
                        <div className="main-collection shimmer">
                            <div className="collection-image"></div>
                        </div>
                        <div className="secondary-collections">
                            {[...Array(4)].map((_, index) => (
                                <div className="secondary-collection shimmer" key={index}>
                                    <div className="collection-image"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="collections-showcase">
                <div className="container">
                    <div className="error-message">
                        <svg className="error-icon" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                        </svg>
                        <p>We're unable to load collections right now</p>
                        <button className="retry-button">Try Again</button>
                    </div>
                </div>
            </section>
        );
    }

    if (!Array.isArray(festivalBanners) || festivalBanners.length === 0) {
        return (
            <section className="collections-showcase">
                <div className="container">
                    <div className="empty-state">
                        <svg className="empty-icon" viewBox="0 0 24 24">
                            <path d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z" />
                        </svg>
                        <p>No collections available at this time</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="collections-showcase">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Featured Collections</h2>
                </div>

                <div className="collections-grid">
                    {mainBanner && (
                        <div className="main-collection">
                            <div
                                className="collection-card"
                                onClick={() => handleProductClick(mainBanner.item_name, mainBanner.sub_item_name)}
                            >
                                <div className="collection-image">
                                    <img
                                        src={`${baseUrl}${mainBanner.image_path}`}
                                        alt={mainBanner.title}
                                        loading="lazy"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/fallback-image.jpg';
                                        }}
                                    />
                                </div>
                                <div className="collection-overlay always-visible-mobile">
                                    <div className="collection-badge">Featured</div>
                                    <div className="collection-content">
                                        <h3 className="collection-name">{mainBanner.title}</h3>
                                        <p className="collection-description">{mainBanner.subtitle}</p>
                                        <button className="explore-button">
                                            Explore Collection
                                            <svg className="arrow-icon" viewBox="0 0 24 24">
                                                <path d="M5 12h14M12 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="secondary-collections">
                        {secondaryBanners.map((banner, index) => (
                            banner && (
                                <div
                                    className="secondary-collection"
                                    key={banner.id}
                                    onClick={() => handleProductClick(banner.item_name, banner.sub_item_name)}
                                >
                                    <div className="collection-card">
                                        <div className="collection-image">
                                            <img
                                                src={`${baseUrl}${banner.image_path}`}
                                                alt={banner.title}
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/fallback-image.jpg';
                                                }}
                                            />
                                        </div>
                                        <div className="collection-overlay always-visible-mobile">
                                            <div className="collection-content">
                                                <h4 className="collection-name">{banner.title}</h4>
                                                <button className="explore-button">
                                                    <svg className="arrow-icon" viewBox="0 0 24 24">
                                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Onsale;