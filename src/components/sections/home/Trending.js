import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import img1 from '../../../assets/img/room-suite/Product_7.webp';
import img2 from '../../../assets/img/room-suite/Cart.webp';
import img3 from '../../../assets/img/room-suite/BMG_Earings.webp';
import '../../../assets/css/trending.css'

const trendingposts = [
    { img: img1, title: 'Wedding Ring', text: 'Machine Design, 24 Carat', price: '₹299' },
    { img: img2, title: 'Silver Necklace', text: 'Machine Design, 24 Carat', price: '₹599' },
    { img: img3, title: 'Barry Silver Bangle', text: 'Machine Design, 24 Carat', price: '₹450' },
    { img: img1, title: 'Silver Earring', text: 'Machine Design, 24 Carat', price: '₹799' },
];

class Trending extends Component {
    render() {
        return (
            <section className="trending-sec bg-white ">
                <div >
                    <div className="section-title text-center mb-30">
                       
                        <span className="title-tag">avail our offer</span>
                        <h2>Trending Collection</h2>
                    </div>
                    <div className="text-center mb-20">
                        <Link to="/shop-left" className="view-more">
                            View more
                            <i className="fal fa-arrow-right ml-2" />
                        </Link>
                    </div>
                    <div className="row">
                        {trendingposts.map((item, i) => (
                            <div key={i} className="col-lg-3 col-md-6">
                                <div className="apartment-box">
                                    <div className="image-box">
                                        <Link to="/shop-detail" className="d-block">
                                            <img src={item.img} alt={item.title} />
                                        </Link>
                                    </div>
                                    <div className="content-box-2">
                                        <h3>
                                            <Link to="/shop-detail" className="tren-title">{item.title}</Link>
                                        </h3>
                                        <span className="price">{item.price}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }
}

export default Trending;