// Breadcrumbs.js
import React from 'react';
import { useCategoryBanner } from '../../hook/banner/useCategoryBanner';
import fallbackImage from '../../assets/img/banner/footer.webp';
import './BreadStyles.css';

const Breadcrumbs = ({ itemName, subItemName }) => {
    
    console.log('itemand subitem name', itemName, subItemName);
    const { data: bannerData } = useCategoryBanner({ itemName, subItemName });
    
    console.log(bannerData, 'breadcrumb data');
    
    const imageSrc = bannerData 
        ? `https://app.bmgjewellers.com${bannerData.image}`
        : fallbackImage;

    return (
        <section className="hero-banner-section w-100">
            <div className="banner-container p-0 position-relative w-100">
                <img
                    src={imageSrc}
                    alt="Category Banner"
                    className="img-fluid w-100 category-hero-image"
                    onError={(e) => { e.target.src = fallbackImage; }}
                />
                <div className="hero-content-overlay">
                    <h2 className="hero-main-title">{bannerData?.title}</h2>
                    <p className="hero-description">{bannerData?.subtitle}</p>
                </div>
            </div>
        </section>
    );
};

export default Breadcrumbs;