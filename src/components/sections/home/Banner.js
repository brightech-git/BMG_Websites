import React from 'react';
import Slider from 'react-slick';
import { useHistory } from 'react-router-dom';
import { useBanners } from '../../../hook/banner/useBannerQueries';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Banner.css';
import { useNotification } from '../../../context/notification/NotificationContext';

const Banner = () => {
    const { data: bannerResponse = {}, isLoading } = useBanners();
    const banners = bannerResponse?.data ?? [];
    const history = useHistory();


    const baseUrl = "https://app.bmgjewellers.com";
    const { askNotification } = useNotification();
    
    const isMultiBanner = banners.length > 1;

    const settings = {
        dots: false,
        infinite: isMultiBanner, // ✅ Only loop if multiple banners
        autoplay: isMultiBanner, // ✅ Only autoplay if multiple
        autoplaySpeed: 3000,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: isMultiBanner, // ✅ Only center when multiple
        centerPadding: isMultiBanner ? '15%' : '0',
        arrows: false,
        swipe: isMultiBanner,
        swipeToSlide: isMultiBanner,
        touchThreshold: 10,
        adaptiveHeight: false,
        pauseOnHover: true,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    centerPadding: isMultiBanner ? '10%' : '0',
                    centerMode: isMultiBanner,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    centerPadding: isMultiBanner ? '5%' : '0',
                    centerMode: isMultiBanner,
                    arrows: false,
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

    const handleBannerClick = (itemCtrName, gender) => {
        const queryParams = new URLSearchParams();
        if (itemCtrName) queryParams.append('itemCtrName', itemCtrName);
        if (gender) queryParams.append('gender', gender);
        const fixedQuery = queryParams.toString().replace(/\+/g, '%20');
        
        if (fixedQuery) {
            history.push(`/products-page?${fixedQuery}`);
            
            // Show notification modal
            askNotification(
                "To Get Exclusive Offer",
                "Enable notifications to get real-time updates and offers."
            );
        }
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
                        <div 
                            className={`hero-media ${(img.itemname || img.gender) ? 'clickable' : ''}`}
                            onClick={() => (img.itemname || img.gender) && handleBannerClick(img.itemname, img.gender)}
                            style={{ cursor: (img.itemname || img.gender) ? 'pointer' : 'default' }}
                        >
                            <img
                                src={img?.image_path ? `${baseUrl}${img.image_path}` : img?.image || '/fallback-image.jpg'}
                                alt={img.title || `banner-${index}`}
                                className="hero-image"
                                loading="lazy"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/fallback-image.jpg';
                                }}
                            />
                        </div>
                    </div>
                ))}
            </Slider>
        </section>
    );
};

export default Banner;