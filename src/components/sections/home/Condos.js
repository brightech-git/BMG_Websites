import React, { Component } from 'react';
import {Link} from 'react-router-dom'

import cnimg1 from '../../../assets/img/category/menu-gallery-1.17b8f89b.jpg';
import cnimg2 from '../../../assets/img/category/menu-gallery-2.b8300c96.jpg';
import cnimg3 from '../../../assets/img/category/menu-gallery-3.dd0dd075.jpg';
import cnimg4 from '../../../assets/img/category/menu-gallery-2.b8300c96.jpg';

const condosposts = [
    {
        img: cnimg1,
        title: 'Handmade Silver Earring',
        text: 'Elegant handcrafted silver earrings with a modern finish.',
        price: '₹2,499'
    },
    {
        img: cnimg2,
        title: 'Silver Nose Ring',
        text: 'Minimal silver nose ring designed for everyday elegance.',
        price: '₹1,499'
    },
    {
        img: cnimg3,
        title: 'Silver Bracelet',
        text: 'Classic silver bracelet crafted for a timeless look.',
        price: '₹3,299'
    },
    {
        img: cnimg4,
        title: 'Silver Pendant',
        text: 'Delicate silver pendant polished to perfection.',
        price: '₹1,999'
    }
];

class Condos extends Component {
    render() {
        return (
            <section className="condos-overlay-sec">
                <div className="container-fluid p-0">
                    <div className="row no-gutters">
                        {condosposts.map((item, i) => (
                            <div key={i} className="col-lg-3 col-md-6">
                                <div className="condo-item" style={{ backgroundImage: "url("+ item.img +")" }}>
                                    <div className="title">
                                        <i className="fal fa-plus text-white" />
                                        <h4 className="text-white">{item.title}</h4>
                                    </div>
                                    <div className="title title-hidden">
                                        <h4 className="text-white mt-0">{item.title}</h4>
                                        <p >{item.text}</p>
                                        <div className="book-btn">
                                            <Link to="/shop-detail"><i className="fal fa-long-arrow-right" />Buy now</Link>
                                        </div>
                                    </div>
                                    <Link to="/shop-detail" className="main-btn btn-border">Starting at {item.price}</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section >

        );
    }
}

export default Condos;