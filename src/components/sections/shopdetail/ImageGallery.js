import React, { useState, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './ImageGallery.css';

const ImageGallery = ({ images }) => {
    const [nav1, setNav1] = useState(null);
    const [nav2, setNav2] = useState(null);
    const slider1 = useRef(null);
    const slider2 = useRef(null);

    const mainSettings = {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        asNavFor: nav2,
        ref: slider1
    };

    const thumbSettings = {
        slidesToShow: Math.min(images.length, 5),
        slidesToScroll: 1,
        asNavFor: nav1,
        ref: slider2,
        focusOnSelect: true,
        swipeToSlide: true,
        arrows: true,
        dots: false,
        centerMode: true,
        infinite: images.length > 5,
        variableWidth: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: Math.min(images.length, 5),
                    centerMode: true
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: Math.min(images.length, 5),
                    centerMode: true
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: Math.min(images.length, 5),
                    centerMode: true,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: Math.min(images.length, 5),
                    centerMode: true,
                }
            }
        ]
    };

    return (
        <div className="gallery-container">
            <div className="main-slider">
                <Slider {...mainSettings} ref={(slider) => setNav1(slider)}>
                    {images.map((item, index) => (
                        <div key={`main-${index}`}>
                            <img
                                src={item.img}
                                alt={`Product view ${index + 1}`}
                                className="main-image"
                                loading="lazy"
                            />
                        </div>
                    ))}
                </Slider>
            </div>

            <div className="thumbnail-slider">
                <Slider {...thumbSettings} ref={(slider) => setNav2(slider)}>
                    {images.map((item, index) => (
                        <div key={`thumb-${index}`} className="thumbnail-wrapper">
                            <img
                                src={item.img}
                                alt={`Thumbnail ${index + 1}`}
                                className="thumbnail-image"
                                loading="lazy"
                            />
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
};

export default ImageGallery;