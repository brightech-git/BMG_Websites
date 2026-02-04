import React, { useState, useRef, useEffect } from 'react';
import ProductCard from '../sections/productCard/ProductCard';
import './ProductCarousel.css';

const ProductCarousel = ({ products }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStartX, setTouchStartX] = useState(0);
    const [touchEndX, setTouchEndX] = useState(0);
    const carouselRef = useRef(null);

    // Handle swipe gestures
    const handleTouchStart = (e) => {
        setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEndX(e.touches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (touchStartX - touchEndX > 50) {
            // Swipe left - next product
            goToNext();
        } else if (touchEndX - touchStartX > 50) {
            // Swipe right - previous product
            goToPrev();
        }
    };

    const goToNext = () => {
        setCurrentIndex(prev => (prev + 1) % products.length);
    };

    const goToPrev = () => {
        setCurrentIndex(prev => (prev - 1 + products.length) % products.length);
    };

    // Calculate which products to display
    const getVisibleProducts = () => {
        const visibleProducts = [];
        const length = products.length;

        // Previous product
        visibleProducts.push(products[(currentIndex - 1 + length) % length]);
        // Current product
        visibleProducts.push(products[currentIndex]);
        // Next product
        visibleProducts.push(products[(currentIndex + 1) % length]);

        return visibleProducts;
    };

    // Auto-scroll to center product
    useEffect(() => {
        if (carouselRef.current) {
            const container = carouselRef.current;
            const centerProduct = container.children[1];
            if (centerProduct) {
                const containerWidth = container.offsetWidth;
                const productWidth = centerProduct.offsetWidth;
                const productLeft = centerProduct.offsetLeft;

                container.scrollTo({
                    left: productLeft - (containerWidth / 2) + (productWidth / 2),
                    behavior: 'smooth'
                });
            }
        }
    }, [currentIndex]);

    if (!products || products.length === 0) {
        return <div className="product-carousel-empty">No products available</div>;
    }

    const visibleProducts = getVisibleProducts();

    return (
        <div className="product-carousel-container">
            <button className="carousel-arrow prev-arrow" onClick={goToPrev}>
                &larr;
            </button>

            <div
                className="product-carousel"
                ref={carouselRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {visibleProducts.map((product, index) => (
                    <div
                        key={product.SNO}
                        className={`product-carousel-item ${index === 1 ? 'center-product' : ''}`}
                    >
                        <ProductCard item={product} />
                    </div>
                ))}
            </div>

            <button className="carousel-arrow next-arrow" onClick={goToNext}>
                &rarr;
            </button>

            <div className="carousel-indicator">
                {products.map((_, index) => (
                    <span
                        key={index}
                        className={`indicator-dot ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => setCurrentIndex(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProductCarousel;