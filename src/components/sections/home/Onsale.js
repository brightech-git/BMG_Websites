import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import './OnSale.css';
// Masonary image

import msimg1 from '../../../assets/img/room-slider/image-33.jpg';
import msimg2 from '../../../assets/img/room-slider/img1.jpg';
import msimg3 from '../../../assets/img/room-slider/img-2.jpg';

class Onsale extends Component {
    render() {
        return (
            <section className="pt-55 pb-55  room-type-section style-2">
                <div className='container'>
                    <div className="section-title text-center mb-50">
                     
                        <span className="title-tag"> May Be You Have Earned It </span>
                        <h2>On Sale Products</h2>
                    </div>
                    <div className="row room-items">
                        <div className="col-lg-6">
                            <div className="room-box extra-height">
                                <div className="room-bg" style={{ backgroundImage: "url("+ msimg1 +")" }}>
                                </div>
                                <div className="room-content">
                                    <h3><Link to="/shop-detail">Ariel Silver Ring</Link></h3>
                                    <p>Experience the brilliance of premium silver craftsmanship in every piece you wear.</p>

                                </div>
                                <Link to="/shop-detail" className="room-link"><i className="fal fa-arrow-right" /></Link>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="row">
                                <div className="col-lg-12 col-md-6">
                                    <div className="room-box">
                                        <div className="room-bg" style={{ backgroundImage: "url("+ msimg2 +")" }}>
                                        </div>
                                        <div className="room-content">
                                            <h3><Link to="/shop-detail">Agonfly Silver Jewelry</Link></h3>
                                            <p>Inspired by tradition, refined for today — explore our exclusive silver collections.</p>

                                        </div>
                                        <Link to="/shop-detail" className="room-link"><i className="fal fa-arrow-right" /></Link>
                                    </div>
                                </div>
                                <div className="col-lg-12 col-md-6">
                                    <div className="room-box">
                                        <div className="room-bg" style={{ backgroundImage: "url("+ msimg3 +")" }}>
                                        </div>
                                        <div className="room-content">
                                            <h3><Link to="/shop-detail">Silver Necklace</Link></h3>
                                            <p>Grace your moments with stunning silver jewelry crafted with care.</p>

                                        </div>
                                        <Link to="/shop-detail" className="room-link"><i className="fal fa-arrow-right" /></Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        );
    }
}

export default Onsale;