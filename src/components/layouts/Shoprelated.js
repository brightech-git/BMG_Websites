import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import ProductCard from '../sections/productCard/ProductCard';
import './ShopRelated.css';

import img1 from '../../assets/img/shop/01.jpg';
import img2 from '../../assets/img/shop/02.jpg';
import img3 from '../../assets/img/shop/03.jpg';
import img4 from '../../assets/img/shop/04.jpg';

const relatedshopposts = [
    { img: img1, discount: 15, title: 'Ankle Bracelet', price: 390 },
    { img: img2, discount: '', title: 'Stud Earrings', price: 290 },
    { img: img3, discount: 10, title: 'Crumpled Ring', price: 450 },
    { img: img4, discount: 25, title: 'Moon Necklace', price: 500 },
];

class ShopRelated extends Component {
    constructor(props) {
        super(props);
        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);
    }

    next() {
        this.slider.slickNext();
    }

    previous() {
        this.slider.slickPrev();
    }

    render() {
        const settings = {
            slidesToShow: 4,
            slidesToScroll: 1,
            fade: false,
            infinite: true,
            autoplay: true,
            autoplaySpeed: 4000,
            arrows: false,
            dots: false,
            responsive: [
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 4,
                    },
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 4,
                    },
                },
                {
                    breakpoint: 576,
                    settings: {
                        slidesToShow: 3,
                    },
                },
            ],
        };

        return (
            <section className="related-products-section">
                <div className="related-products-container">
                    <div className="related-products-header">
                        <div className="related-products-title">
                            <span className="title-tag">Shop</span>
                            <h2>Related Products</h2>
                        </div>
                        <div className="related-products-nav">
                            <button
                                className="related-products-nav-arrow"
                                onClick={this.previous}
                                aria-label="Previous products"
                            >
                                <i className="fal fa-arrow-left" />
                            </button>
                            <button
                                className="related-products-nav-arrow"
                                onClick={this.next}
                                aria-label="Next products"
                            >
                                <i className="fal fa-arrow-right" />
                            </button>
                        </div>
                    </div>

                    <Slider
                        className="related-products-slider"
                        ref={c => (this.slider = c)}
                        {...settings}
                    >
                        {relatedshopposts.map((item, i) => (
                            <div key={i}>
                                <div >
                                    <ProductCard item={item} />
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </section>
        );
    }
}

export default ShopRelated;