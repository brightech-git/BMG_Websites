import React from 'react';
import { useHistory } from 'react-router-dom';
import './FeaturedBanners.css';
import img1 from '../../assets/img/banner/Tritiya_Slider_1.webp';
import img2 from '../../assets/img/banner/Tritiya_Slider_3.webp';
import img3 from '../../assets/img/banner/Tritiya_Slider_2.webp';
import img4 from '../../assets/img/banner/Tritiya_Slider_3.webp';

const FeaturedBanners = () => {
    const history = useHistory();

    // Local banner images data
    const banners = [
        {
            id: 1,
            image: img1 ,
            title: "Spring Collection",
            subtitle: "New Arrivals",
            link: "/shop-left?featured_products=true"
        },
        {
            id: 2,
            image: img2,
            title: "Luxury Edition",
            subtitle: "Premium Selection",
            link: "/shop-left?featured_products=true"
        },
        {
            id: 3,
            image: img3,
            title: "Minimalist Style",
            subtitle: "Clean & Simple",
            link: "/shop-left?featured_products=true"
        },
        {
            id: 4,
            image: img4,
            title: "Vintage Finds",
            subtitle: "Timeless Pieces",
            link: "/shop-left?featured_products=true"
        }
    ];

    const handleBannerClick = (link) => {
        history.push(link);
    };

    return (
        <section className="banner-showcase">
            <div className="banner-container">
                <div className="banner-header">
                    <h2 className="banner-main-title">Our Featured Collections</h2>
                    <button
                        className="trending-shop-btn"
                        onClick={() => history.push('/shop-left?featured_products=true')}
                    >
                        Explore All
                        <span className="arrow-icon">→</span>
                    </button>
                </div>

                <div className="banner-grid">
                    {banners.map((banner, index) => (
                        <div
                            key={banner.id}
                            className={`banner-item banner-item-${index + 1}`}
                            onClick={() => handleBannerClick(banner.link)}
                        >
                            <div className="banner-image-container">
                                <img
                                    src={banner.image}
                                    alt={banner.title}
                                    className="banner-image"
                                    loading="lazy"
                                />
                                <div className="banner-overlay"></div>
                            </div>
                            <div className="banner-content">
                                <span className="banner-subtitle">{banner.subtitle}</span>
                                <h3 className="banner-title">{banner.title}</h3>
                                <button className="trending-shop-btn banner-cta">
                                    View Collection
                                    <span className="btn-arrow">→</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedBanners;