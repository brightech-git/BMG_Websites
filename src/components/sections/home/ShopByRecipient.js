import React from 'react';
import './ShopByRecipient.css';
import { useHistory } from 'react-router-dom';

const ShopByRecipient = () => {
    const history = useHistory();

    const categories = [
        { id: 1, label: "Him", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face", query: "recipient=him" },
        { id: 2, label: "Her", image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop&crop=face", query: "recipient=her" },
    ];

    const handleCategoryClick = (query) => {
        history.push(`/shop-left?${query}`);
    };

    return (
        <div className="container-fluid py-5 shop-container" >
            <div className="container">
                {/* Section Title */}
                <div className="row mb-4 mb-md-5">
                    <div className="col-12 text-center">
                        <h2 className="display-2  fw-light text-dark mb-0" style={{ letterSpacing: '1px', fontSize: 'clamp(1.3rem, 4vw, 1.8rem)' , color:'#404040',}}>
                            Shop by Recipient
                        </h2>
                    </div>
                </div>

                {/* Cards Row */}
                <div className="row g-4 justify-content-center">
                    {categories.map((category) => (
                        <div key={category.id} className="col-6 col-md-6 col-lg-6">
                            <div
                                className="card h-100 position-relative overflow-hidden card-hover"
                                onClick={() => handleCategoryClick(category.query)}
                                role="button"
                                tabIndex={0}
                            >
                                {/* Gold Edge Frame and Content */}
                                <div className="gold-edge-frame">
                                    <div className="card-inner">
                                        {/* Image and Button Container */}
                                        <div className="card-image-container">
                                            <img
                                                src={category.image}
                                                alt={category.label}
                                                className="card-img"
                                            />
                                            {/* Overlay Gradient */}
                                            <div className="card-overlay"></div>
                                            {/* Label */}
                                            <div className="position-absolute top-0 start-0 p-3 p-md-4">
                                                <h3
                                                    className="text-white fw-bold mb-0"
                                                    style={{
                                                        fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                                                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                                                        letterSpacing: '1px'
                                                    }}
                                                >
                                                    {category.label}
                                                </h3>
                                            </div>
                                            {/* View Collection Button */}
                                            <div className="view-collection-btn">
                                                <button
                                                    className="btn btn-custom btn-lg px-2 py-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCategoryClick(category.query);
                                                    }}
                                                >
                                                    View Collection
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
    );
};

export default ShopByRecipient;