import React, { useEffect, useRef, useState } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import img1 from './feature.jpg';
import img2 from './feature2.jpg';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const NewArrival = () => {
    const bannerContainerRef = useRef(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
    const [isMobile, setIsMobile] = useState(false);

    // Sample images for demonstration
    const bannerImages = [
       img1,
        img2
    ];

    // Mock history for navigation
    const history = useHistory();

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
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % bannerImages.length);
        }, 5000);

        return () => clearInterval(timer);
    }, []);

  

    const handleExplore = () => {
        history.push('/shop-left?new_arrival=Y');
    };

    return (
        <section className="na-section">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Montserrat:wght@400;500;600&display=swap');

                .na-section {
                    background: linear-gradient(135deg, #f6f5f0 0%, #f7fbfc 100%);
                    font-family: 'Montserrat', sans-serif;
                    padding: 3rem 0;
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                }

                .na-section::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: radial-gradient(circle at 70% 30%, rgba(0, 123, 255, 0.1) 0%, transparent 50%);
                    z-index: 0;
                }

                .na-container {
                    width: 100%;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 15px;
                    position: relative;
                    z-index: 1;
                }

                .na-row {
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                    min-height: 400px;
                }

                .na-content-col {
                    flex: 1;
                    min-width: 0;
                }

                .na-image-col {
                    flex: 1;
                    min-width: 0;
                }

                .na-banner-container {
                    border-radius: 12px;
                    overflow: hidden;
                    aspect-ratio: 4/3;
                    width: 100%;
                    max-width: 500px;
                    margin: 0 auto;
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                    position: relative;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    cursor: pointer;
                }

                .na-banner-container:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
                }

                .na-banner-wrapper {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                }

                .na-banner-img {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    opacity: 0;
                    transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-in-out;
                    will-change: transform;
                }

                .na-banner-img.na-active {
                    opacity: 1;
                }

                .na-carousel-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    border-radius: 12px;
                    z-index: 2;
                }

                .na-banner-container:hover .na-carousel-overlay {
                    opacity: 1;
                }

                .na-view-collection {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 20px;
                    background: rgba(255, 255, 255, 0.9);
                    border-radius: 50px;
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 600;
                    color: #cd865c;
                    transform: translateY(20px);
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    font-size: 0.9rem;
                    cursor: pointer;
                }

                .na-banner-container:hover .na-view-collection {
                    transform: translateY(0);
                }

                .na-arrow-icon {
                    transition: transform 0.3s ease;
                }

                .na-view-collection:hover .na-arrow-icon {
                    transform: translateX(4px);
                }

                .na-shimmer-overlay {
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    z-index: 1;
                    animation: na-shimmer 3s infinite;
                    border-radius: 12px;
                }

                @keyframes na-shimmer {
                    0% { left: -100%; }
                    100% { left: 100%; }
                }

                .na-content {
                    padding: 20px;
                    position: relative;
                    z-index: 1;
                }

                .na-subtitle {
                    font-family: 'Dancing Script', cursive;
                    font-size: clamp(1.8rem, 4vw, 2.5rem);
                    color: #333333;
                    line-height: 1.3;
                    margin-bottom: 1.5rem;
                }

                .na-gradient-text {
                    background: linear-gradient(90deg, #007bff, #6610f2);
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                    display: inline;
                }

                .na-desc {
                    font-size: clamp(0.9rem, 1.5vw, 1.1rem);
                    color: #6c757d;
                    line-height: 1.8;
                    margin-bottom: 2rem;
                }

                .na-shop-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.8rem;
                    padding: 14px 28px;
                    font-family: 'Montserrat', sans-serif;
                    font-size: clamp(0.85rem, 1.2vw, 1rem);
                    font-weight: 600;
                    text-transform: capitalize;
                    color: white;
                    background: #cd865c;
                    border: none;
                    border-radius: 50px;
                    box-shadow: 0 4px 15px rgba(255, 145, 0, 0.82);
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    position: relative;
                    overflow: hidden;
                    cursor: pointer;
                }

                .na-shop-btn span {
                    position: relative;
                    z-index: 2;
                    cursor: pointer;
                }

                .na-arrow-wrapper {
                    position: relative;
                    z-index: 2;
                    display: flex;
                    align-items: center;
                    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .na-hover-effect {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 0;
                    height: 100%;
                    background: rgba(255, 255, 255, 0.2);
                    transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                    z-index: 1;
                }

                .na-shop-btn:hover {
                    box-shadow: 0 8px 25px rgba(255, 174, 0, 0.4);
                    transform: translateY(-2px);
                }

                .na-shop-btn:hover .na-arrow-wrapper {
                    transform: translateX(4px);
                }

                .na-shop-btn:hover .na-hover-effect {
                    width: 100%;
                }

                /* Mobile and tablet styles - maintaining same row layout */
                @media (max-width: 768px) {
                    .na-row {
                        gap: 1.5rem;
                        min-height: 300px;
                    }
                    
                    .na-content {
                        padding: 15px;
                    }

                    .na-desc {
                        margin-bottom: 1.5rem;
                    }

                    .na-shop-btn {
                        padding: 12px 24px;
                    }
                }

                @media (max-width: 576px) {
                    .na-container {
                        padding: 0 10px;
                    }
                    
                    .na-row {
                        gap: 1rem;
                        min-height: 250px;
                    }
                    
                    .na-content {
                        padding: 10px;
                    }

                    .na-subtitle {
                        margin-bottom: 1rem;
                    }

                    .na-desc {
                        margin-bottom: 1rem;
                    }

                    .na-shop-btn {
                        padding: 10px 20px;
                        gap: 0.5rem;
                    }

                    .na-view-collection {
                        padding: 8px 16px;
                        font-size: 0.8rem;
                    }
                }

                /* Very small screens */
                @media (max-width: 480px) {
                    .na-row {
                        flex-direction: column;
                        gap: 1rem;
                        min-height: auto;
                    }
                    
                    .na-content-col, .na-image-col {
                        flex: none;
                        width: 100%;
                    }
                    
                    .na-banner-container {
                        max-width: 100%;
                        aspect-ratio: 16/9;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    * {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }

                    .na-shimmer-overlay {
                        animation: none;
                        display: none;
                    }

                    .na-banner-img {
                        transition: none !important;
                    }
                }
            `}</style>

            <div className="na-container">
                <div className="na-row">
                    <div className="na-content-col">
                        <div className="na-content">
                            <h3 className="na-subtitle">
                                <span className="na-gradient-text">Discover</span> Our Latest Collection
                            </h3>
                            <p className="na-desc">
                                Unveil the elegance of our newest arrivals, crafted with precision and inspired by timeless beauty. Each piece is designed to elevate your style.
                            </p>
                            <button
                                className="na-shop-btn"
                                aria-label="Shop new arrivals"
                            >
                                <span onClick={handleExplore}>Shop Now</span>
                                <div className="na-arrow-wrapper">
                                    <FiArrowRight className="na-arrow-icon" />
                                </div>
                                <div className="na-hover-effect"></div>
                            </button>
                        </div>
                    </div>

                    <div className="na-image-col">
                        <div
                            className="na-banner-container"
                            ref={bannerContainerRef}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className="na-shimmer-overlay"></div>
                            <div className="na-banner-wrapper">
                                {bannerImages.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt={`New Arrival Banner ${index + 1}`}
                                        className={`na-banner-img ${index === currentImageIndex ? 'na-active' : ''}`}
                                        style={{
                                            transform: index === currentImageIndex && !isMobile
                                                ? `scale(1.05) translate(${(mousePosition.x - 0.5) * 10}px, ${(mousePosition.y - 0.5) * 10}px)`
                                                : 'none',
                                            transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-in-out',
                                        }}
                                    />
                                ))}
                            </div>
                            <div className="na-carousel-overlay">
                                <div className="na-view-collection" onClick={handleExplore}>
                                    <span>Explore New Arrivals</span>
                                    <FiArrowRight className="na-arrow-icon" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewArrival;