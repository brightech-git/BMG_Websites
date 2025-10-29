import React, { useEffect, useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './JewelleryShowCAse.css';
import img1 from '../../../assets/img/bmg/bmg-22.jpg';
import img2 from '../../../assets/img/bmg/bmg-17.jpg';
import { FiArrowRight, FiShield, FiTruck, FiRefreshCw, FiAward } from 'react-icons/fi';

const JewelryShowcase = () => {
    const history = useHistory();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const bannerContainerRef = useRef(null);
    const bannerImages = [img1, img2];

    // Handle mouse movement for parallax effect
    const handleMouseMove = (e) => {
        if (bannerContainerRef.current) {
            const rect = bannerContainerRef.current.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            setMousePosition({ x, y });
        }
    };

    // Reset mouse position when leaving container
    const handleMouseLeave = () => {
        setMousePosition({ x: 0.5, y: 0.5 });
    };

    useEffect(() => {
        AOS.init({
            duration: 1000,
            easing: 'ease-out',
            once: true,
            mirror: false
        });

        const timer = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % bannerImages.length);
        }, 5000);

        return () => clearInterval(timer);
    }, []);

    const handleSeeAll = () => history.push('/products-page?best_design=true');

    return (
        <section className="jewelry-showcase" data-aos="fade-up">
            <div className="container py-5">
                <div className="row align-items-center">
                    <div className="col-lg-6 mb-4 mb-lg-0">
                        <div
                            className="jewelry-banner-container position-relative h-100"
                            ref={bannerContainerRef}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className="shimmer-overlay"></div>
                            <div className="jewelry-banner-wrapper">
                                {bannerImages.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt={`Jewelry Banner ${index + 1}`}
                                        className={`jewelry-banner-img ${index === currentImageIndex ? 'active' : ''}`}
                                        style={{
                                            transform: index === currentImageIndex
                                                ? `scale(1.05) translate(${(mousePosition.x - 0.5) * 15}px, ${(mousePosition.y - 0.5) * 15}px)`
                                                : 'none',
                                            transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 1s ease-in-out'
                                        }}
                                    />
                                ))}
                            </div>
                            <div className="carousel-overlay">
                                <div className="view-collection">
                                    <span>View Collection</span>
                                    <FiArrowRight className="arrow-icon" />
                                </div>
                            </div>


                        </div>
                    </div>
                    <div className="col-lg-6 ps-lg-5">
                        <div className="jewelry-content">
                            <h2 className="jewelry-title mb-4">
                                <span className="gradient-text">Our Best Designed</span> Jewels
                            </h2>
                            <p className="jewelry-desc mb-4">
                                Discover exquisite craftsmanship with our handcrafted jewelry, blending tradition and modernity. Each piece is meticulously designed to reflect elegance and timeless beauty.
                            </p>

                            <div className="feature-highlights mb-4">
                                <div className="feature-item">
                                    <FiShield className="feature-icon" />
                                    <span>Lifetime Warranty</span>
                                </div>
                                <div className="feature-item">
                                    <FiAward className="feature-icon" />
                                    <span>Artisan Crafted</span>
                                </div>
                                <div className="feature-item">
                                    <FiTruck className="feature-icon" />
                                    <span>Free Shipping</span>
                                </div>
                                <div className="feature-item">
                                    <FiRefreshCw className="feature-icon" />
                                    <span>30-Day Returns</span>
                                </div>
                            </div>

                            <button
                                className="premium-shop-btn"
                                onClick={handleSeeAll}
                                aria-label="Shop Now for best designed jewels"
                            >
                                <span >Shop Now</span>

                                <div className="hover-effect"></div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default JewelryShowcase;