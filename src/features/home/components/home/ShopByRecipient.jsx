import React from "react";
import { useNavigate } from "react-router-dom";
import "./ShopByRecipient.css";

const ShopByRecipient = ({ banners }) => {
    const navigate = useNavigate();

    console.log(banners, 'genderbanner')
    const baseUrl = "https://app.bmgjewellers.com";

    const handleCategoryClick = (itemName) => {
        const queryParams = new URLSearchParams();
        if (itemName) queryParams.append("ItemName", itemName);

        navigate(`/products-page?${queryParams.toString()}`);
    };

    // Filter banners by title
    const topRowBanners = banners.filter(
        (b) =>
            b.title?.toLowerCase().includes("for him") ||
            b.title?.toLowerCase().includes("for kids")
    );

    const bottomRowBanners = banners.filter((b) =>
        b.title?.toLowerCase().includes("for her")
    );

    return (
        <section className="recipient-section">
            <div className="shopby-container">
                <div className="recipient-header">
                    <h2 className="recipient-title">Celebrate Every Bond</h2>
                    {/* <h6 className="recipient-subtitle">
                        Handpicked jewelry gifts crafted to make every moment unforgettable.
                    </h6> */}
                </div>

                {/* Desktop: 3-column grid | Mobile: 2 + 1 layout */}
                <div className="recipient-grid">
                    {/* Top Row: For Him + For Kids */}
                    <div className="recipient-row-top">
                        {topRowBanners.map((banner) => (
                            <RecipientCard
                                key={banner.id}
                                banner={banner}
                                baseUrl={baseUrl}
                                onClick={handleCategoryClick}
                            />
                        ))}
                    </div>

                    {/* Bottom Row: For Her */}
                    <div className="recipient-row-bottom">
                        {bottomRowBanners.map((banner) => (
                            <RecipientCard
                                key={banner.id}
                                banner={banner}
                                baseUrl={baseUrl}
                                onClick={handleCategoryClick}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

// Reusable Card Component
const RecipientCard = ({ banner, baseUrl, onClick }) => {
    return (
        <div className="recipient-card-wrapper">
            <div
                className="recipient-card"
                onClick={() => onClick(banner.itemName)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && onClick(banner.itemName)}
            >
                <div className="recipient-card-frame">
                    <div className="recipient-card-inner">
                        <div className="recipient-image-container">
                            <img
                                src={
                                    banner?.image_path
                                        ? `${baseUrl}${banner.image_path}`
                                        : "/fallback-image.jpg"
                                }
                                alt={banner.title}
                                className="recipient-image"
                                loading="lazy"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/fallback-image.jpg";
                                }}
                            />
                            {/* <div className="recipient-overlay"></div>
                            <h3 className="recipient-label">{banner.title}</h3> */}
                            {/* {banner.subtitle && (
                                <p className="recipient-subtext">{banner.subtitle}</p>
                            )} */}
                            {/* <button
                                className="recipient-button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onClick(banner.itemname, banner.gender);
                                }}
                            >
                                View Collection
                            </button> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopByRecipient;