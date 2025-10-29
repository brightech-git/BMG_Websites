import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import img1 from '../../../assets/img/room-suite/Adobe Express - file (5).png';
import img2 from '../../../assets/img/room-suite/pngegg (2).png';
import img3 from '../../../assets/img/room-suite/64254c8e89cb71526f7f14433a754ae4.png';
import img4 from '../../../assets/img/room-suite/pngegg (3).png';

import '../../../assets/css/trending.css';

const trendingPosts = [
    {
        img: img1,
        title: 'Wedding Ring',
        price: '$299',
        badge: 'Bestseller'
    },
    {
        img: img2,
        title: 'Silver Necklace',
        price: '$599',
        badge: 'New'
    },
    {
        img: img3,
        title: 'Silver Bangle',
        price: '$450',
        badge: 'New'
    },
    {
        img: img4,
        title: 'Silver Earring',
        price: '$799',
        badge: 'Limited'
    },
];

class Trending extends Component {
    render() {
        return (
            <section className="trending-sec">
                <div className="container">
                    <div className="section-title text-center mb-30">
                        <span className="title-tag">AVAIL OUR OFFER</span>
                        <h2>Trending Collection</h2>
                    </div>
                    <div className="text-center mb-20">
                        <Link to="/products-page" className="view-more">
                            View more
                            <i className="fal fa-arrow-right ml-2" />
                        </Link> tr
                    </div>
                    <div className="row">
                        {trendingPosts.map((item, i) => (
                            <div key={i} className="col-lg-3 col-md-6 mb-4">
                                <div className="apartment-box">
                                    <div className="image-box">

                                        <Link to="/product-detail" className="d-block">
                                            <img src={item.img} alt={item.title} />
                                        </Link>
                                    </div>
                                    <div className="content-box-2">
                                        <h3>
                                            <Link to="/product-detail" className="tren-title">
                                                {item.title}
                                            </Link>
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