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

        const fixedQuery = queryParams.toString().replace(/\+/g, '%20');

        history.push(`/products-page?${fixedQuery}`);
    };

    if (isLoading) {
        return <div className="collection-loading" aria-live="polite">Loading collections...</div>;
    }

    if (error) {
        return <div className="collection-error" aria-live="assertive">Error loading collections: {error.message}</div>;
    }

    return (
        <div className="collection-container">
            <div className="collection-grid">
                {banners.map((item, i) => {
                    const imgSrc = item?.image_path ? `${baseUrl}${item.image_path}` : '';
                    return (
                        <div key={i} className="collection-item">
                            <div
                                className="collection-card"
                                style={{ backgroundImage: `url(${imgSrc})` }}
                                aria-label={item.title}
                            >
                                <div className="collection-overlay"></div>
                                <div className="collection-content">
                                    <p className="collection-subtitle">{item.occasion}</p>
                                    {/* <h3 className="collection-title">{item.title}</h3> */}
                                    <button
                                        className="collection-btn"
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