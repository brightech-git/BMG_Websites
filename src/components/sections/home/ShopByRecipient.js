import React from 'react';
import './ShopByRecipient.css';
import { useHistory } from 'react-router-dom';
import men from './image/Men.png';
import women from'./image/Women.png';
import kid from './image/kids.png';
const ShopByRecipient = () => {
    const history = useHistory();

    const categories = [
        { id: 1, label: "Him", image: men, query: "itemName=Gift Ideas&subItemName=FOR HIM" },
        { id: 2, label: "Her", image: women, query: "itemName=Gift Ideas&subItemName=FOR HER" },
        { id: 3, label: "Kids", image: kid, query: "subItemName=FOR KIDS&itemName=Gift Ideas" },
    ];

    const handleCategoryClick = (query) => {

        history.push(`/shop-left?${query}`);
    };

    return (
        <div className="recipient-container">
            <div className="container">
                {/* Section Title */}
                <div className="recipient-header">
                    <h2 className="recipient-title">
                        Shop by Recipient
                    </h2>
                </div>

                {/* Cards Grid - Different layout for mobile */}
                <div className="recipient-grid">
                    {/* Him and Kids on top for mobile */}
                    <div className="recipient-row-top">
                        {categories.filter(cat => cat.label !== "Her").map((category) => (
                            <div key={category.id} className="recipient-card-wrapper">
                                <div
                                    className="recipient-card"
                                    onClick={() => handleCategoryClick(category.query)}
                                    role="button"
                                    tabIndex={0}
                                >
                                    <div className="recipient-card-frame">
                                        <div className="recipient-card-inner">
                                            <div className="recipient-image-container">
                                                <img
                                                    src={category.image}
                                                    alt={category.label}
                                                    className="recipient-image"
                                                    loading="lazy"
                                                />
                                                <div className="recipient-overlay"></div>
                                                <h3 className="recipient-label">
                                                    {category.label}
                                                </h3>
                                                <button
                                                    className="recipient-button"
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
                        ))}
                    </div>

                    {/* Her card full width on mobile */}
                    <div className="recipient-row-bottom">
                        {categories.filter(cat => cat.label === "Her").map((category) => (
                            <div key={category.id} className="recipient-card-wrapper">
                                <div
                                    className="recipient-card"
                                    onClick={() => handleCategoryClick(category.query)}
                                    role="button"
                                    tabIndex={0}
                                >
                                    <div className="recipient-card-frame">
                                        <div className="recipient-card-inner">
                                            <div className="recipient-image-container">
                                                <img
                                                    src={category.image}
                                                    alt={category.label}
                                                    className="recipient-image"
                                                    loading="lazy"
                                                />
                                                <div className="recipient-overlay"></div>
                                                <h3 className="recipient-label">
                                                    {category.label}
                                                </h3>
                                                <button
                                                    className="recipient-button"
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
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopByRecipient;