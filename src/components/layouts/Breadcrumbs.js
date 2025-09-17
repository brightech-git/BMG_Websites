import React, { useState, useEffect } from "react";
import { useCategoryBanner } from "../../hook/banner/useCategoryBanner";
import fallbackImage from "../../assets/img/banner/footer.webp";
import "./BreadStyles.css";

const Breadcrumbs = ({ itemName, subItemName, pages, occasion, gender }) => {
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    // Build params based on priority rules
    let params = {
        itemName: "",
        subItemName: "",
        pages: "",
        occasion: "",
        gender: "",
    };

    if (itemName) {
        params = { itemName, subItemName:"", pages:"", occasion: "", gender: "" };
    }
    else if (itemName && subItemName) {
        params = { itemName, subItemName, pages:"", occasion: "", gender: "" };
    } else if (gender) {
        params = { gender };
    } else if (occasion) {
        params = { occasion };
    } else if (pages) {
        params = { pages };
    }

    const { data: bannerData, isLoading, isError } = useCategoryBanner(params);

    const banners = bannerData?.results || [];


    // Reset loading state whenever data OR props change
    useEffect(() => {
        setIsImageLoaded(false);
    }, [bannerData, itemName, subItemName, pages, occasion, gender]);

    const handleImageError = (e) => {
        console.error("Failed to load banner image:", e.target.src);
        e.target.src = fallbackImage;
    };

    // Fallback banner renderer
    const renderFallbackBanner = () => (
        <div className="banner-wrapper">
            <img
                src={fallbackImage}
                alt="Fallback Banner"
                className="banner-image loaded"
                loading="lazy"
            />
            <div className="banner-content-overlay">
                <h1 className="banner-title">{pages || itemName || "Category"}</h1>
                <p className="banner-description">
                    {subItemName || "Explore our collection"}
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

                        return (
                            <div key={item.id || index} className="banner-wrapper">
                                <img
                                    src={imageSrc}
                                    alt={item?.title || "Category Banner"}
                                    className={`banner-image ${isImageLoaded ? "loaded" : "loading"
                                        }`}
                                    onLoad={() => setIsImageLoaded(true)}
                                    onError={handleImageError}
                                    loading="lazy"
                                />
                                <div className="banner-content-overlay">
                                    <h1 className="banner-title">
                                        {isLoading
                                            ? "Loading..."
                                            : item?.title || itemName || item.pages || "Category"}
                                    </h1>
                                    <p className="banner-description">
                                        {item?.subtitle ||
                                            subItemName ||
                                            "Explore our collection"}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </section>
    );
};

export default Breadcrumbs;
