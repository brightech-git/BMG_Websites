import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import './handpicked.css';
import img1 from '../../../assets/img/room-slider/img_1.jpg';
import img2 from '../../../assets/img/room-slider/img_3.jpg';
import img3 from '../../../assets/img/room-slider/img_2.jpg';

const roomslidertwoposts = [
    { img: img1, title: 'Get All Gold Jewels', price: '345', weight: '10gm' },
    { img: img2, title: 'Grab Silver Jewel', price: '235', weight: '10gm' },
    { img: img3, title: 'Buy All Diamond', price: '1,345', weight: '10gm' },
];

function SampleNextArrow(props) {
    const { onClick } = props;
    return (
        <div className="slick-arrow next-arrow" onClick={onClick}>
            <i className="fal fa-arrow-right" />
        </div>
    );
}

function SamplePrevArrow(props) {
    const { onClick } = props;
    return (
        <div className="slick-arrow prev-arrow" onClick={onClick}>
            <i className="fal fa-arrow-left" />
        </div>
    );
}

class Handpicked extends Component {
    render() {
        const settings = {
            slidesToShow: 1,
            slidesToScroll: 1,
            fade: false,
            infinite: true,
            autoplay: false,
            autoplaySpeed: 4000,
            arrows: true,
            nextArrow: <SampleNextArrow />,
            prevArrow: <SamplePrevArrow />,
            dots: false,
            centerMode: true,
            centerPadding: '28%',
            responsive: [
                { breakpoint: 1600, settings: { centerPadding: '20%' } },
                { breakpoint: 992, settings: { centerPadding: '15%' } },
                { breakpoint: 768, settings: { centerPadding: '10%' } },
                { breakpoint: 576, settings: { centerPadding: '5%' } },
            ],
        };

        return (
            <section className="jewelry-slider">
                <div className="container-fluid p-0">
                    <div className="section-title mb-60 text-center">
                        <span className="title-tag">Get On Sale</span>
                        <h2>Hand Picked Jewelries</h2>
                    </div>
                    <Slider className="jewelry-slider-container" {...settings}>
                        {roomslidertwoposts.map((item, i) => (
                            <div key={i} className="jewelry-slide">
                                <div className="main-jewelry-item">
                                    <div className="main-jewelry-img">
                                        <img src={item.img} alt={item.title} />
                                    </div>
                                    <div className="jewelry-thumbnails">
                                        {roomslidertwoposts.map((subItem, j) => (
                                            <div key={j} className="jewelry-thumbnail-item">
                                                <Link to="/shop-detail">
                                                    <img src={subItem.img} alt={subItem.title} />
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </section>
        );
    }
}

export default Handpicked;