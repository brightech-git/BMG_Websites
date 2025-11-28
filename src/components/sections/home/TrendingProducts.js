import React from 'react';
import { useHistory } from 'react-router-dom';
import './TrendingProducts.css';
import img1 from './image/WeddingRing.jpg';
import coupleImg from '../../../assets/img/author-small.png';
import img2 from './image/counpleRing.jpg';
import img3 from './image/engageRing.jpg'

const TrendingProducts = () => {
    const history = useHistory();

    const categories = [
        { id: 1, label: "For Couple", image: img2, query: "itemCtrName=Rings&subItemName=Couple Rings" },
        { id: 2, label: "For Engage", image: img3, query: "itemCtrName=Rings&subItemName=Engagement Rings" },
        { id: 3, label: "For Wedding", image: img1, query: "itemCtrName=Rings&subItemName=Wedding Rings" },
    ];

    const handleCategoryClick = (query) => {
        history.push(`/products-page?${query}`);
    };

    return (
        <section className="premium-showcase">
            <div className="premium-banner">
                <div className="container-fluid px-0">
                    <div className="row g-0 align-items-stretch">
                        {/* Left Hero Content */}
                        <div className="col-lg-6 col-md-12">
                            <div className="premium-hero-section">
                                <div className="premium-hero-text">
                                    <h2 className="premium-hero-title">
                                        <span className="premium-title-line">Shop by</span>
                                        <span className="premium-title-line premium-script">Occasion</span>
                                    </h2>
                                    <p className="premium-hero-subtitle">
                                        Exquisite gifts for every occasion.
                                    </p>
                                </div>
                                <div className="premium-hero-image">
                                    <img
                                        src={coupleImg}
                                        alt="Elegant couple"
                                        className="img-fluid"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Category Cards */}
                        <div className="col-lg-6 col-md-12">
                            <div className="premium-product-grid">
                                <div className="row g-2 g-md-3 justify-content-center">
                                    {categories.map((category) => (
                                        <div key={category.id} className="col-md-4 col-12 col-sm-4">
                                            <div
                                                className="premium-card h-100 position-relative overflow-hidden premium-hover"
                                                onClick={() => handleCategoryClick(category.query)}
                                                role="button"
                                                tabIndex={0}
                                            >
                                                {/* Gold Accent Frame */}
                                                <div className="premium-accent-frame">
                                                    <div className="premium-card-content">
                                                        {/* Image and Button Container */}
                                                        <div className="premium-image-wrapper">
                                                            <img
                                                                src={category.image}
                                                                alt={category.label}
                                                                className="premium-card-image"
                                                            />
                                                            {/* Overlay Gradient */}
                                                            <div className="premium-overlay"></div>

                                                            <div className="premium-action-bar">
                                                                <button
                                                                    className="premium-action-btn btn-sm px-1 py-1"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleCategoryClick(category.query);
                                                                    }}
                                                                >
                                                                    {category.label}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TrendingProducts;