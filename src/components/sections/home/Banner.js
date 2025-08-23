import React from 'react';
import Slider from 'react-slick';
import { useHistory } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useBanners } from '../../../hook/banner/useBannerQueries';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Banner.css';

const Banner = () => {
    const { data: bannerResponse = {}, isLoading } = useBanners();
    const banners = bannerResponse?.data ?? [];
    const history = useHistory();
    const baseUrl = "https://app.bmgjewellers.com";

    const settings = {
        dots: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 3000,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: '15%', 
        arrows: true, 
        swipe: true,
        swipeToSlide: true, 
        touchThreshold: 10, 
        adaptiveHeight: false,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    centerPadding: '10%',
                },
            },
            {
                breakpoint: 768,
                settings: {
                    centerPadding: '5%',
                    arrows: true, 
                },
            },
            {
                breakpoint: 576,
                settings: {
                    centerPadding: '0',
                    centerMode: false, 
                    arrows: false, 
                },
            },
        ],
    };

    const handleExploreNow = (itemName, gender) => {
        const queryParams = new URLSearchParams();
        if (itemName) queryParams.append('itemName', itemName);
        if (gender) queryParams.append('gender', gender);
        const fixedQuery = queryParams.toString().replace(/\+/g, '%20');
        history.push(`/shop-left?${fixedQuery}`);
    };

    if (isLoading) {
        return (
            <div className="hero-skeleton-container">
                <div className="hero-skeleton-placeholder"></div>
            </div>
        );
    }

    return (
        <section className="hero-banner">
            <Slider {...settings}>
                {banners.map((img, index) => (
                    <div className="hero-slide" key={img.id || index}>
                        <div className="hero-media">
                            <img
                                src={img?.image_path ? `${baseUrl}${img.image_path}` : img?.image || '/fallback-image.jpg'}
                                alt={`banner-${index}`}
                                className="hero-image"
                                loading="lazy"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/fallback-image.jpg';
                                }}
                            />
                        </div>
                        <div className="hero-content-container">
                            <div className="hero-content">
                                <h1 className="hero-title">{img.title || 'Explore Our Collection'}</h1>
                                <p className="hero-description">{img.subtitle || 'Discover our latest collection.'}</p>
                                {(img.itemname || img.gender) && (
                                    <button
                                        className="hero-buttons"
                                        onClick={() => handleExploreNow(img.itemname, img.gender)}
                                        aria-label={`Explore ${img.title || 'collection'}`}
                                    >
                                        Explore Now
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </section>
    );
};

export default Banner;