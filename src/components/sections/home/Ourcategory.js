import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useCategoryImages } from '../../../hook/categorywithImage/useCategoryQuery';
import './OurCategory.css';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const OurCategory = () => {
    const { data: categories = [], isLoading: isCategoriesLoading } = useCategoryImages();
    const history = useHistory();
    const containerRef = useRef(null);
    const baseUrl = "https://app.bmgjewellers.com";
    const [showAll, setShowAll] = useState(false);

    // Drag scroll functionality (only for smaller screens)
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleItemClick = (itemName) => {
        history.push(`/shop-left?itemName=${encodeURIComponent(itemName)}`);
    };

    const formatItemName = (name) => {
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const startDrag = (e) => {
        if (window.innerWidth >= 992 || showAll) return; // Disable drag on large screens or when showing all
        setIsDragging(true);
        setStartX(e.pageX - containerRef.current.offsetLeft);
        setScrollLeft(containerRef.current.scrollLeft);
    };

    const endDrag = () => setIsDragging(false);

    const handleDrag = (e) => {
        if (!isDragging || window.innerWidth >= 992 || showAll) return;
        e.preventDefault();
        const x = e.pageX - containerRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        containerRef.current.scrollLeft = scrollLeft - walk;
    };

    const toggleShowAll = () => {
        setShowAll(!showAll);
    };

    if (isCategoriesLoading) {
        return (
            <section className="elegant-category-section">
                <div className="elegant-container">
                    <div className="elegant-header">
                        <h2 className="content-title">BMG WORLD</h2>
                        <button className="see-all-button" disabled>Loading...</button>
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
        <section className="elegant-category-section">
            <div className="elegant-container">
                <div className="elegant-header">
                    <h2 className="content-title">BMG WORLD</h2>
                    <button className="see-all-button" onClick={toggleShowAll}>
                        See All {showAll ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                </div>
                <div
                    className={`elegant-scroll-container ${showAll ? 'grid-view' : ''}`}
                    ref={containerRef}
                    onMouseDown={startDrag}
                    onMouseLeave={endDrag}
                    onMouseUp={endDrag}
                    onMouseMove={handleDrag}
                >
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="elegant-card"
                            onClick={() => handleItemClick(category.item_name)}
                        >
                            <div className="elegant-image-container">
                                <img
                                    src={`${baseUrl}${category.image_path}`}
                                    alt={formatItemName(category.item_name)}
                                    className="elegant-image"
                                    loading="lazy"
                                />
                            </div>
                            <div className="elegant-details">
                                <h3 className="elegant-title">
                                    {formatItemName(category.item_name)}
                                </h3>
                               
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default OurCategory;