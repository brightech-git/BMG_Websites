import React, { useEffect, useRef, useState } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './NewArrival.css';
import { getProductImages } from '../../utils/getProductImages';


const NewArrival = ({ banners, isLoading, isError }) => {

    const bannerContainerRef = useRef(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
    const [isMobile, setIsMobile] = useState(false);


    console.log(banners, "bannerdata");

    const bannerImages = banners?.map((item) => getProductImages(item.Image)) || [];

    console.log(bannerImages, "bannerImages");

    const navigate = useNavigate();

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => {
            window.removeEventListener('resize', checkIfMobile);
        };
    }, []);

    const handleMouseMove = (e) => {
        if (bannerContainerRef.current && !isMobile) {
            const rect = bannerContainerRef.current.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            setMousePosition({ x, y });
        }
    };

    const handleMouseLeave = () => {
        setMousePosition({ x: 0.5, y: 0.5 });
    };

    useEffect(() => {
        const banner = bannerContainerRef.current;
        if (!banner) return;

        let startX = 0;
        let isDragging = false;

        const handleTouchStart = (e) => {
            startX = e.touches[0].pageX;
            isDragging = true;
        };

        const handleTouchMove = (e) => {
            if (!isDragging) return;
            const x = e.touches[0].pageX;
            const walk = startX - x;
            if (Math.abs(walk) > 50) {
                setCurrentImageIndex((prev) =>
                    walk > 0 ? (prev + 1) % bannerImages.length : (prev - 1 + bannerImages.length) % bannerImages.length
                );
                isDragging = false;
            }
        };

        const handleTouchEnd = () => {
            isDragging = false;
        };

        banner.addEventListener('touchstart', handleTouchStart);
        banner.addEventListener('touchmove', handleTouchMove);
        banner.addEventListener('touchend', handleTouchEnd);

        return () => {
            banner.removeEventListener('touchstart', handleTouchStart);
            banner.removeEventListener('touchmove', handleTouchMove);
            banner.removeEventListener('touchend', handleTouchEnd);
        };
    }, [bannerImages.length]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % bannerImages.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [bannerImages.length]);

    const handleExplore = () => {
        const ItemName = "NEW_ARRIVALS";
        const queryParams = new URLSearchParams();
        queryParams.append("ItemName", ItemName);

        navigate(`/products-page?${queryParams.toString()}`);
    };
    if (isLoading) return <p>Loading banners...</p>;
    if (isError) return <p>Failed to load banners</p>;
    return (
        <section className="arrival-section">
            <div className="arrival-container">
                <div className="arrival-row">
                    <div className="arrival-content-col">
                        <div className="arrival-content">
                            <h3 className="arrival-subtitle">
                                <span className="arrival-gradient-text">Discover Our Latest Collection </span>
                            </h3>
                            <p className="arrival-desc">
                                Unveil the elegance of our newest arrivals, crafted with precision and inspired by timeless beauty. Each piece is designed to elevate your style.
                            </p>
                            <button className="arrival-shop-btn" aria-label="Shop new arrivals" onClick={handleExplore}>
                                <span>Shop Now</span>
                                <div className="arrival-arrow-wrapper">
                                    <FiArrowRight className="arrival-arrow-icon" />
                                </div>
                                <div className="arrival-hover-effect"></div>
                            </button>
                        </div>
                    </div>
                    <div className="arrival-image-col">
                        <div
                            className="arrival-banner-container"
                            ref={bannerContainerRef}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >

                            <div className="arrival-banner-wrapper">
                                {bannerImages.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt={`New Arrival Banner ${index + 1}`}
                                        onClick={handleExplore}
                                        className={`arrival-banner-img ${index === currentImageIndex ? 'arrival-active' : ''}`}
                                        loading="lazy"
                                        style={{
                                            transform: index === currentImageIndex && !isMobile
                                                ? `scale(1.05) translate(${(mousePosition.x - 0.5) * 10}px, ${(mousePosition.y - 0.5) * 10}px)`
                                                : 'none',
                                        }}
                                    />
                                ))}
                            </div>
                            {/* <div className="arrival-carousel-overlay">
                                <div className="arrival-view-collection" onClick={handleExplore}>
                                    <span>Explore New Arrivals</span>
                                    <FiArrowRight className="arrival-arrow-icon" />
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewArrival;