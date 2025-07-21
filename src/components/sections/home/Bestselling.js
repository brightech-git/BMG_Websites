import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import './Bestselling.css';

import img1 from '../../../assets/img/shop/menu-gallery-2.b8300c96.jpg';
import img2 from '../../../assets/img/shop/image-33.jpg';
import img3 from '../../../assets/img/shop/image-4 (2).jpg';
import img4 from '../../../assets/img/shop/image-33.jpg';
import ProductCard from '../productCard/ProductCard';

const shopposts = [
    { img: img1, discount: 15, title: 'Ankle Bracelet', price: 390, discountedPrice: 331.5 },
    { img: img2, discount: '', title: 'Stud Earrings', price: 290 },
    { img: img3, discount: 10, title: 'Crumpled Ring', price: 450, discountedPrice: 405 },
    { img: img4, discount: 25, title: 'Moon Necklace', price: 500, discountedPrice: 375 },
];

class Bestselling extends Component {
    render() {
        const settings = {
            slidesToShow: 3,
            slidesToScroll: 1,
            fade: false,
            infinite: true,
            autoplay: true,
            autoplaySpeed: 4000,
            arrows: false,
            dots: false,
            responsive: [
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: 3,
                    },
                },
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 2,
                    },
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 2,
                        centerMode: true,
                        centerPadding: '100px',
                    },
                },
                {
                    breakpoint: 576,
                    settings: {
                        slidesToShow: 2,
                        centerMode: true,
                        centerPadding: '30px',
                    },
                },
            ],
        };

        return (
            <section className="bestselling-section">
                <div className="best-selling-container">
                    <div className="bestselling-wrapper">
                        <div className="bestselling-content">
                            {/* <span className="section-subtitle">BUY NOW</span> */}
                            <h2 className="section-title">Bestselling Products</h2>
                            <p className="section-description">
                                Shop our latest silver jewelry - from elegant anklets to minimal rings - all crafted with
                                premium polish and timeless style.
                            </p>
                            <Link to="/shop-left" className="main-btns btn-filled">Shop Now</Link>
                        </div>

                        <div className="bestselling-slider-wrapper">
                            <Slider className="bestselling-slider" {...settings}>
                                {shopposts.map((item, i) => (
                                    <div key={i} className="slider-item">
                                        <ProductCard
                                            item={item}
                                            showDiscount={true}
                                            currency="¥"
                                            discountPosition="top-right"
                                        />
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default Bestselling;