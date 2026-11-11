import React from 'react';
import { useNavigate } from 'react-router-dom';
import './category.css';

const CategoryCard = ({ item }) => {
    const navigate = useNavigate();
    const baseUrl = "https://app.bmgjewellers.com";

    const handleShopNow = (occasion, gender) => {
        const queryParams = new URLSearchParams();
        if (occasion) queryParams.append('ItemName', occasion);
        // if (gender) queryParams.append('gender', gender);
        navigate(`/products-page?${queryParams.toString()}`);
    };

    const capitalizeWords = (str) => {
        if (!str) return '';
        return str
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
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
                onClick={() => handleShopNow(item.occasion, item.gender)}
                onError={(e) => {
                    e.target.src = '/fallback-image.jpg';
                }}
            />
            {/* <div className="bmg-category-content">
                <span className="category-tag">
                    {capitalizeWords(item.occasion)}
                </span>
                <button
                    className="category-btn"
                    onClick={() => handleShopNow(item.occasion, item.gender)}
                    aria-label={`Shop ${item.occasion} collection`}
                >
                    <span className="btn-icon">✨</span>
                    <span className="btn-text">{item.action || 'Shop Now'}</span>
                    <span className="btn-arrow">→</span>
                </button>
            </div> */}
        </div>
    );
};

const Category = ({ banners, isLoading, error }) => {

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
            <div className='title-container'>
                <h4 className='occ-title'> Shop By Occasion</h4>

            </div>


            <div className="category-grid">
                {[...banners].map((item, i) => (
                    <CategoryCard key={i} item={item} />
                ))}
            </div>

        </div>
    );
};

export default Category;