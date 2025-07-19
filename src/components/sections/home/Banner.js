import React from 'react';
import Slider from 'react-slick';
import '../../../assets/css/Banner.css';
import { useBanners } from '../../../hook/banner/useBannerQueries';

const Banner = () => {
    const { data: images = [], isLoading } = useBanners();

    const baseUrl = "https://app.bmgjewellers.com";

    const bannerContent = [
        {
            title: "Fine Craftsmanship",
            description: "Elegance in every detail. Discover timeless treasures with BMG Jewellers."
        },
        {
            title: "Celebrate with Gold",
            description: "Make every moment precious. Shop exclusive gold jewellery now!"
        },
        {
            title: "Shine Brighter Today",
            description: "Unveil your inner glow with our handcrafted collections."
        }
    ];

    const settings = {
        dots: true,
        infinite: true,
        autoplay: true,
        arrows: false,
        speed: 1000,
        autoplaySpeed: 4000,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    if (isLoading) {
        return <div>Loading banners...</div>;
    }

    return (
        <section className="banner-area">
            <Slider {...settings}>
                {images?.data?.map((img, index) => {
                    const imgSrc = img?.image_path ? `${baseUrl}${img.image_path}` : img?.image || img;
                    const content = bannerContent[index % bannerContent.length];

                    return (
                        <div className="single-slide" key={img.id}>
                            <div className="slide-image-wrapper">
                                <img src={imgSrc} alt={`banner-${index}`} className="slide-image" />
                                <div className="image-overlay" />
                            </div>
                            <div className="content-overlay">
                                <div className="container">
                                    <div className="banner-content">
                                        <h1 className="title">{content.title}</h1>
                                        <p className="description">{content.description}</p>
                                        <a className="main-btn btn-filled" href="/shop-left">Shop Now</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </Slider>

        </section>
    );
};

export default Banner;
