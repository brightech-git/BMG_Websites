import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BestDesign.css';

import img1 from '../../../assets/img/banner/Tritiya_Slider_1.webp';
import img2 from '../../../assets/img/banner/Tritiya_Slider_2.webp';
import img3 from '../../../assets/img/banner/Tritiya_Slider_3.webp';

const BestDesign = () => {
    const history = useNavigate();
    const [activePanel, setActivePanel] = useState(null);

    const showcaseItems = [
        {
            id: 1,
            image: img1,
            title: "Artisan Crafted",
            tagline: "Handmade Perfection",
            link: "/products-page?best_design=true"
        },
        {
            id: 2,
            image: img2,
            title: "Modern Elegance",
            tagline: "Contemporary Designs",
            link: "/products-page?best_design=true"
        },
        {
            id: 3,
            image: img3,
            title: "Vintage Charm",
            tagline: "Timeless Beauty",
            link: "/products-page?best_design=true"
        }
    ];

    const handleSeeAll = () => navigate('/products-page?best_design=true');
    const handleItemClick = (link) => navigate(link);

    return (
        <section className="enhanced-panel-showcase">
            <div className="enhanced-container">
                <div className="enhanced-header">
                    <div className="title-group">
                        <h2 className="enhanced-title">
                            <span className="title-line">Curated Collections</span>
                        </h2>
                        <p className="enhanced-subtitle">
                            Discover our exclusive selection of premium designs
                        </p>
                    </div>
                    <button
                        className="enhanced-shop-btn"
                        onClick={handleSeeAll}
                        aria-label="View all collections"
                    >
                        Explore All
                        <span className="btn-arrow">→</span>
                    </button>
                </div>

                <div className="enhanced-gallery">
                    {showcaseItems.map((item, index) => (
                        <div
                            key={item.id}
                            className={`enhanced-panel ${activePanel === index ? 'active' : ''}`}
                            onMouseEnter={() => setActivePanel(index)}
                            onMouseLeave={() => setActivePanel(null)}
                            onClick={() => handleItemClick(item.link)}
                            aria-label={`View ${item.title} collection`}
                        >
                            <div className="panel-image-container">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="panel-img"
                                    loading="lazy"
                                />
                                <div className="panel-overlay"></div>
                            </div>
                            <div className="panel-details">
                                <span className="panel-meta">{item.tagline}</span>
                                <h3 className="panel-heading">{item.title}</h3>
                                <div className="panel-highlight"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BestDesign;