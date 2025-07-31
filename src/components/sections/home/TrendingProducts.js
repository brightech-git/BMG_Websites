import React from 'react';
import { useHistory } from 'react-router-dom';
import './TrendingProducts.css';
import img1 from '../../../assets/img/room-suite/BMG_Earings.webp';
import coupleImg from '../../../assets/img/room-suite/pngegg (2).png';

const TrendingProducts = () => {
    const history = useHistory();

    const categories = [
        { id: 1, label: "Daily Wear", image: img1, query: "occasion=DAILY_WEAR" },
        { id: 2, label: "Wedding", image: img1, query: "occasion=WEDDING" },
        { id: 3, label: "Office Wear", image: img1, query: "occasion=OFFICE" },
    ];

    const handleCategoryClick = (query) => {
        history.push(`/shop-left?${query}`);
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
                                                            {/* Category Label */}
                                                            <div className="position-absolute top-0 start-0 p-2 p-md-3">
                                                                <h3
                                                                    className="text fw-bold mb-0"
                                                                    style={{
                                                                        fontSize: 'clamp(1rem, 2vw, 1.4rem)',
                                                                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                                                                        letterSpacing: '1px',
                                                                        color:'#404040'
                                                                    }}
                                                                >
                                                                    {category.label}
                                                                </h3>
                                                            </div>
                                                            {/* Shop Now Button */}
                                                            <div className="premium-action-bar">
                                                                <button
                                                                    className="btn premium-action-btn btn-sm px-2 py-1"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleCategoryClick(category.query);
                                                                    }}
                                                                >
                                                                    Shop Now
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