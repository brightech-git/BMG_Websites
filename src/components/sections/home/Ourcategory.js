import React from 'react';
import { useHistory } from 'react-router-dom';
import { useCategoryImages } from '../../../hook/categorywithImage/useCategoryQuery';
import './OurCategory.css';
import DragScrollComponent from '../../layouts/DragScrollComponent';

const OurCategory = ({subcategories ,isCategoriesLoading}) => {



    const history = useHistory();
    const baseUrl = "https://app.bmgjewellers.com";

    const handleItemClick = (itemCtrName) => {
        history.push(`/products-page?itemCtrName=${encodeURIComponent(itemCtrName)}`);
    };

    const formatItemName = (name) => {
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    if (isCategoriesLoading) {
        return (
            <section className="elegant-category-section">
                <div className="elegant-container">
                    <div className="elegant-header">
                        <h2 className="cat-content-title">Bmg World</h2>
                    </div>
                    <div className="elegant-scroll-container">
                        {[...Array(5)].map((_, index) => (
                            <div key={index} className="elegant-card">
                                <div className="elegant-image-container placeholder-glow">
                                    <div className="placeholder w-100 h-100"></div>
                                </div>
                                <div className="elegant-details">
                                    <h3 className="elegant-title placeholder-glow">
                                        <span className="placeholder col-6"></span>
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="elegant-category-sections">
            <div className="elegant-containers">
                <div className="elegant-header">
                    <h2 className="cat-content-title">Bmg World</h2>
                </div>

                <DragScrollComponent>

                    {subcategories.map((category) => (
                        <div
                            key={category.id}
                            className="elegant-cards"
                            onClick={() => handleItemClick(category.item_name)}
                        >
                            <div className="elegant-image-containers">
                                <img
                                    src={`${baseUrl}${category.image_path}`}
                                    alt={formatItemName(category.item_name)}
                                    className="elegant-images"
                                    loading="lazy"
                                />
                            </div>
                            {/* <div className="elegant-details">
                                <h3 className="elegant-title">
                                    {formatItemName(category.item_name)}
                                </h3>
                            </div> */}
                        </div>
                    ))}

                </DragScrollComponent>
            </div>
        </section>
    );
};

export default OurCategory;