import React, { Component } from 'react';
import {Link} from 'react-router-dom';

import ctabg from '../../../assets/img/category/grid-3.webp';
import '../../../assets/css/cta.css';

class Cta extends Component {
    render() {
        return (
            <section className="pt-55 pb-55 bg-white cta-sec" style={{ backgroundImage: "url("+ ctabg +")" }}>
                
                <div className="row " style={{padding:'0 100px'}}>
                        <div className="col-lg-7">
                            <div className="block-text">
                                <div className="section-title mb-20">
                                    <span className="title-tag">Buy Now</span>
                                    <h2 >Rare Collections.</h2>
                                </div>
                                <p className="pr-50">
                                    Discover our handpicked collection of premium silver jewelry — from intricately crafted necklaces to elegant rings and statement earrings. Each piece is made with high-quality silver and polished to perfection.
                                </p>
                                <Link to="/shop-left" className="main-btn btn-filled mt-40">Shop now</Link>
                            </div>
                        </div>
             </div>
            </section>

        );
    }
}

export default Cta;