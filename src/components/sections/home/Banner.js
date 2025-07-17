import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import ReactWOW from 'react-wow';
import Cursor from '../../layouts/Cursor';

import img1 from '../../../assets/img/banner/Tritiya_Slider_3.webp';
import img2 from '../../../assets/img/banner/Tritiya_Slider_2.webp';
import img3 from '../../../assets/img/banner/Tritiya_Slider_1.webp';

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

class Banner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMobile: false,
        };
    }
    
    componentDidMount() {
        this.handleResize();
        window.addEventListener("resize", this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    }

    handleResize = () => {
        this.setState({ isMobile: window.innerWidth < 992 });
    };

    render() {
        const { isMobile } = this.state;

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
                {/* <Cursor /> */}
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
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </section>
        );
    }
}

export default Banner;
