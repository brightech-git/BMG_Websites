import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';

import img1 from '../../assets/img/category/image-33.jpg';
import img2 from '../../assets/img/category/menu-gallery-2.b8300c96.jpg';
import img3 from '../../assets/img/category/image-4 (2).jpg';
import img4 from '../../assets/img/category/menu-gallery-2.b8300c96.jpg';
import ProductCard from '../sections/productCard/ProductCard';
const shoplatestposts = [
    { img: img1, discount: 15, title: 'Ankle Bracelet', price: 390 },
    { img: img2, discount: '', title: 'Stud Earrings', price: 290 },
    { img: img3, discount: 10, title: 'Crumpled Ring', price: 450 },
    { img: img4, discount: 25, title: 'Moon Necklace', price: 500 },
    { img: img1, discount: 15, title: 'Ankle Bracelet', price: 390 },
    { img: img2, discount: '', title: 'Stud Earrings', price: 290 },
    { img: img3, discount: 10, title: 'Crumpled Ring', price: 450 },
    { img: img4, discount: 25, title: 'Moon Necklace', price: 500 },
];

class Latestproducts extends Component {
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
            responsive: [{
                breakpoint: 992,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 2,
                },
            },
            ],
        }
        return (
            <section className="restaurant-tab-area bg-black ">
                <div className='container'>
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-md-8 col-sm-7">
                            <div className="section-title">
                                <span className="title-tag">Shop</span>
                                <h2>Latest Products</h2>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-4 col-sm-5 d-none d-sm-block">
                            <div className="shop-post-arrow arrow-style text-right">
                                <div className="slick-arrow prev-arrow" onClick={this.previous} ><i className="fal fa-arrow-left" /></div>
                                <div className="slick-arrow next-arrow" onClick={this.next}><i className="fal fa-arrow-right" /></div>
                            </div>
                        </div>
                    </div>
                    <Slider className="row shop-post-slider " ref={c => (this.slider = c)} {...settings}>
                        {shoplatestposts.map((item, i) => (
                            <div key={i} className="col-12">
                                <ProductCard key={i} item={item} />
                            </div>
                        ))}
                    </Slider>
                </div>
            </section>

        );
    }
}

export default Latestproducts;