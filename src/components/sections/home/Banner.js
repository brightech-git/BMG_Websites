import React from 'react';
import Slider from 'react-slick';
import './Banner.css';
import { useBanners } from '../../../hook/banner/useBannerQueries';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const Banner = () => {
    const { data: bannerResponse = {}, isLoading } = useBanners();
    const banners = bannerResponse?.data ?? [];
    const history = useHistory();
    const baseUrl = "https://app.bmgjewellers.com";

    const settings = {
        dots: true,
        infinite: true,
        autoplay: true,
        arrows: false,
        speed: 1000,
        autoplaySpeed: 4000,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true
    };

    const handleExploreNow = (itemName, gender) => {
        const queryParams = new URLSearchParams();
        if (itemName) queryParams.append('itemName', itemName);
        if (gender) queryParams.append('gender', gender);
        const fixedQuery = queryParams.toString().replace(/\+/g, '%20');
        history.push(`/shop-left?${fixedQuery}`);
    };

    if (isLoading) return <div className="banner-loading">Loading banners...</div>;

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
                                    <button
                                        className="banner-button"
                                        onClick={() => handleExploreNow(img.itemname, img.gender)}
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