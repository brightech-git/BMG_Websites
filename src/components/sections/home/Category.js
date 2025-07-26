import React from 'react';
import { useHistory } from 'react-router-dom';
import { useOccasionBanners } from '../../../hook/banner/useOccasionBanners';
import './category.css';

const Category = () => {
    const history = useHistory();
    const { data, isLoading, error } = useOccasionBanners();
    const baseUrl = "https://app.bmgjewellers.com";
    const banners = data?.data || [];

    const handleShopNow = (occasion, gender) => {
        const queryParams = new URLSearchParams();
        if (occasion) queryParams.append('occasion', occasion);
        if (gender) queryParams.append('gender', gender);
        history.push(`/shop-left?${queryParams.toString()}`);
    };

    if (isLoading) {
        return <div className="occasion-loading" aria-live="polite">Loading collections...</div>;
    }

    if (error) {
        return <div className="occasion-error" aria-live="assertive">Error loading collections: {error.message}</div>;
    }

    return (
        <div className="occasion-container">
            <div className="occasion-grid">
                {banners.map((item, i) => {
                    const imgSrc = item?.image_path ? `${baseUrl}${item.image_path}` : '';
                    return (
                        <div key={i} className="occasion-card-wrapper">
                            <div className="occasion-card">
                                <div className="occasion-image" style={{ backgroundImage: `url(${imgSrc})` }}>
                                    <div className="occasion-overlay"></div>
                                </div>
                                <div className="occasion-content">
                                    <div className="occasion-tag">{item.occasion}</div>
                                    <button
                                        className="occasion-btn"
                                        onClick={() => handleShopNow(item.occasion, item.gender)}
                                        aria-label={`Shop ${item.title}`}
                                    >
                                        {item.action || 'Shop Now'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Category;