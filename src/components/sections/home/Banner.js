<<<<<<< Updated upstream
import React from 'react';
=======
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
>>>>>>> Stashed changes
import Slider from 'react-slick';
import './Banner.css';
import { useBanners } from '../../../hook/banner/useBannerQueries';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { Button } from 'react-bootstrap';

const Banner = () => {
    const { data: bannerResponse = {}, isLoading } = useBanners();
    const banners = bannerResponse?.data ?? [];
    const history = useHistory();
    const baseUrl = "https://app.bmgjewellers.com";

<<<<<<< Updated upstream
    const settings = {
        dots: true,
        infinite: true,
        autoplay: true,
        arrows: false,
        speed: 1000,
        autoplaySpeed: 4000,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: false
    };

    const handleExploreNow = (itemName, gender) => {
        const queryParams = new URLSearchParams();
        if (itemName) queryParams.append('itemName', itemName);
        if (gender) queryParams.append('gender', gender);
        const fixedQuery = queryParams.toString().replace(/\+/g, '%20');
        history.push(`/shop-left?${fixedQuery}`);
    };

    if (isLoading) return (
        <div className="banner-skeleton-container">
            <div className="banner-skeleton-placeholder"></div>
        </div>
    );

    return (
        <section className="banner-area">
            <Slider {...settings}>
                {banners.map((img, index) => (
                    <div className="banner-slide" key={img.id || index}>
                        <div className="banner-media-container">
                            <img
                                src={img?.image_path ? `${baseUrl}${img.image_path}` : img?.image || img}
                                alt={`banner-${index}`}
                                className="banner-image"
                                loading="lazy"
                            />
                            <div className="banner-overlay" />
                        </div>
                        <div className="banner-content-wrapper">
                            <div className="banner-content">
                                <h1 className="banner-title">{img.title}</h1>
                                <p className="banner-description">{img.subtitle || 'Discover our latest collection.'}</p>
                                {(img.itemname || img.gender) && (
                                    <Button
                                        
                                        className="banner-button"
                                        onClick={() => handleExploreNow(img.itemname, img.gender)}
                                    >
                                        Explore Now 
                                    </Button>
                                )}
=======
const bannerSlides = [
    {
        img: img1,
        title: "High-End Jewelry Items",
        description: "Discover our exquisite collection of handcrafted jewelry pieces that embody elegance and timeless beauty.",
    },
    {
        img: img2,
        title: "Luxury Silver Collections",
        description: "Experience the brilliance of our premium silver selections, perfect for special occasions.",
    },
    {
        img: img3,
        title: "Handmade Silver Masterpieces",
        description: "Explore our unique silver jewelry designs that combine traditional craftsmanship with modern aesthetics.",
    },
];

const Banner = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 992);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const settings = {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: false,
        dots: true,
        draggable: true,
        speed: 800,
        fade: true,
        cssEase: "ease-in-out",
        pauseOnHover: true,
        pauseOnFocus: true,
    };

    return (
        <section className="banner-area">
            <Slider {...settings} className="combined-slider">
                {bannerSlides.map((slide, index) => (
                    <div key={index} className="single-slide">
                        <div className="slide-image-wrapper">
                            <img src={slide.img} alt={slide.title} className="slide-image" />
                            <div className="image-overlay" />
                        </div>
                        <div className="content-overlay">
                            <div className="container container-custom-two">
                                <div className={`row align-items-center ${isMobile ? 'justify-content-center' : ''}`}>
                                    <div className={`${isMobile ? 'col-12' : 'col-lg-6 col-md-8'}`}>
                                        <div className={`banner-content ${isMobile ? 'mobile-content' : ''}`}>
                                            <ReactWOW animation="fadeInLeft" delay="0.5s">
                                                <h1 className="title">{slide.title}</h1>
                                            </ReactWOW>
                                            <ReactWOW animation="fadeInLeft" delay="0.7s">
                                                <p className="description">{slide.description}</p>
                                            </ReactWOW>
                                            <div className="button-groups">
                                                <ReactWOW animation="fadeInUp" delay="0.9s">
                                                    <Link className="main-btn btn-filled mt-20" to="/about" aria-label="Shop Now">
                                                        Shop Now
                                                    </Link>
                                                </ReactWOW>
                                            </div>
                                        </div>
                                    </div>
                                </div>
>>>>>>> Stashed changes
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </section>
    );
};

export default Banner;