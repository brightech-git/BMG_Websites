import React from 'react';
import { useHistory } from 'react-router-dom';
import { useOccasionBanners } from '../../../hook/banner/useOccasionBanners';
import './category.css';

const CategoryCard = ({ item }) => {
    const history = useHistory();
    const baseUrl = "https://app.bmgjewellers.com";

    const handleShopNow = (occasion, gender) => {
        const queryParams = new URLSearchParams();
        if (occasion) queryParams.append('occasion', occasion);
        if (gender) queryParams.append('gender', gender);
        history.push(`/shop-left?${queryParams.toString()}`);
    };

    if (!item) {
        return (
            <div className="category-card shimmer">
                <div className="category-image shimmer"></div>
                <div className="category-content">
                    <span className="category-tag shimmer" style={{ width: '60%', height: '1.2rem' }}></span>
                    <button className="category-btn shimmer" style={{ width: '80px', height: '2rem' }} disabled></button>
                </div>
            </div>
        );
    }

    return (
        <div className="category-card">
            <img
                src={`${baseUrl}${item.image_path}`}
                alt={`${item.occasion} category`}
                className="category-image"
                onError={(e) => {
                    e.target.src = '/fallback-image.jpg';
                }}
            />
            <div className="category-content">
                <span className="category-tag">{item.occasion}</span>
                <button
                    className="category-btn"
                    onClick={() => handleShopNow(item.occasion, item.gender)}
                    aria-label={`Shop ${item.occasion} collection`}
                >
                    {item.action || 'Shop Now'}
                </button>
            </div>
        </div>
    );
};

const Category = () => {
    const { data, isLoading, error } = useOccasionBanners();
    const banners = data?.data || [];

    if (isLoading) {
        return (
            <div className="category-container">
                <div className="category-grid">
                    {[...Array(3)].map((_, i) => (
                        <CategoryCard key={i} />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="category-error" aria-live="assertive">
                Error loading collections: {error.message}
            </div>
        );
    }

    return (
        <div className="category-container">
            <div className="category-grid">
                {banners.map((item, i) => (
                    <CategoryCard key={i} item={item} />
                ))}
            </div>
        </div>
    );
};

export default Category;