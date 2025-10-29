import React from 'react';
import { useHistory } from 'react-router-dom';
import './ShopByRecipient.css';
import men from './image/Men.png';
import women from './image/Women.png';
import kid from './image/kids.png';
import { useTrackOrder } from '../../../hook/order/useOrderTracking';

const ShopByRecipient = () => {
    const history = useHistory();

    const categories = [
        { id: 1, label: "For Him", image: men, query: "itemName=Gift Ideas&subItemName=FOR HIM" },
        { id: 2, label: "For Her", image: women, query: "itemName=Gift Ideas&subItemName=FOR HER" },
        { id: 3, label: "For Kids", image: kid, query: "subItemName=FOR KIDS&itemName=Gift Ideas" },
    ];

    const handleCategoryClick = (query) => {
        history.push(`/products-page?${query}`);
    };

    const { trackOrder } = useTrackOrder('7D116046113');
    console.log(trackOrder, 'trackorder');
    return (
        <section className="recipient-section">
            <div className="container">
                <div className="recipient-header">
                    <h2 className="recipient-title">
                        Celebrate Every Bond
                    </h2>
                    <h6 className='recipient-subtitle'>
                        Handpicked jewelry gifts crafted to make every moment unforgettable.
                    </h6>
                </div>
                <div className="recipient-grid">
                    <div className="recipient-row-top">
                        {categories.filter(cat => cat.label !== "For Her").map((category) => (
                            <div key={category.id} className="recipient-card-wrapper">
                                <div
                                    className="recipient-card"
                                    onClick={() => handleCategoryClick(category.query)}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`Shop ${category.label} products`}
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
                                                <h3 className="recipient-label">{category.label}</h3>
                                                <button
                                                    className="recipient-button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCategoryClick(category.query);
                                                    }}
                                                    aria-label={`View ${category.label} collection`}
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
                    <div className="recipient-row-bottom">
                        {categories.filter(cat => cat.label === "For Her").map((category) => (
                            <div key={category.id} className="recipient-card-wrapper">
                                <div
                                    className="recipient-card"
                                    onClick={() => handleCategoryClick(category.query)}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`Shop ${category.label} products`}
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
                                                <h3 className="recipient-label">{category.label}</h3>
                                                <button
                                                    className="recipient-button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCategoryClick(category.query);
                                                    }}
                                                    aria-label={`View ${category.label} collection`}
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
        </section>
    );
};

export default ShopByRecipient;