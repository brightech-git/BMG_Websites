// Breadcrumbs.js
import React from 'react';
import { useCategoryBanner } from '../../hook/banner/useCategoryBanner';
import fallbackImage from '../../assets/img/banner/footer.webp';
import './BreadStyles.css';

const Breadcrumbs = ({ itemName, subItemName }) => {
    const { data: bannerData } = useCategoryBanner({ itemName, subItemName });

    const imageSrc = bannerData?.images?.[0]
        ? `https://app.bmgjewellers.com${bannerData.images[0]}`
        : fallbackImage;

    return (
        <section className="breadcrumb-area w-100">
            <div className="container-fluid p-0 position-relative w-100">
                <img
                    src={imageSrc}
                    alt="Category Banner"
                    className="img-fluid w-100 breadcrumb-banner-img"
                    onError={(e) => { e.target.src = fallbackImage; }}
                />
                <div className="breadcrumb-overlay-text">
                    <h2 className="breadcrumb-title">{bannerData?.title}</h2>
                    <p className="breadcrumb-subtitle">{bannerData?.subtitle}</p>
                </div>
            </div>
        </section>
    );
};

export default Breadcrumbs;
