import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useCategoryImages } from '../../../hook/categorywithImage/useCategoryQuery';
import './OurCategory.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const OurCategory = () => {
    const { data: categories = [], isLoading: isCategoriesLoading } = useCategoryImages();
    const history = useHistory();
    const containerRef = useRef(null);
    const baseUrl = "https://app.bmgjewellers.com";
    const [showArrows, setShowArrows] = useState(false);

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
        if (window.innerWidth >= 992) return; // Disable drag on large screens
        setIsDragging(true);
        setStartX(e.pageX - containerRef.current.offsetLeft);
        setScrollLeft(containerRef.current.scrollLeft);
    };

    const endDrag = () => setIsDragging(false);

    const handleDrag = (e) => {
        if (!isDragging || window.innerWidth >= 992) return;
        e.preventDefault();
        const x = e.pageX - containerRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        containerRef.current.scrollLeft = scrollLeft - walk;
    };

    const scrollLeftHandler = () => {
        containerRef.current.scrollBy({ left: -220, behavior: 'smooth' });
    };

    const scrollRightHandler = () => {
        containerRef.current.scrollBy({ left: 220, behavior: 'smooth' });
    };

    if (isCategoriesLoading) {
        return (
            <section className="elegant-category-section">
                <div className="elegant-container">
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
                <div
                    className="elegant-scroll-container"
                    ref={containerRef}
                    onMouseDown={startDrag}
                    onMouseLeave={endDrag}
                    onMouseUp={endDrag}
                    onMouseMove={handleDrag}
                    onMouseEnter={() => setShowArrows(true)}
                    onMouseLeave={() => setShowArrows(false)}
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
                <button
                    className={`elegant-arrow elegant-arrow-left ${showArrows ? 'visible' : ''}`}
                    onClick={scrollLeftHandler}
                    aria-label="Scroll Left"
                >
                    <FaChevronLeft />
                </button>
                <button
                    className={`elegant-arrow elegant-arrow-right ${showArrows ? 'visible' : ''}`}
                    onClick={scrollRightHandler}
                    aria-label="Scroll Right"
                >
                    <FaChevronRight />
                </button>
            </div>
        </section>
    );
};

export default OurCategory;