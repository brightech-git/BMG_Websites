import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Condo.css';

import cnimg1 from '../../../assets/img/category/menu-gallery-1.17b8f89b.jpg';
import cnimg2 from '../../../assets/img/category/menu-gallery-2.b8300c96.jpg';
import cnimg3 from '../../../assets/img/category/menu-gallery-3.dd0dd075.jpg';
import cnimg4 from '../../../assets/img/category/menu-gallery-2.b8300c96.jpg';

const condosposts = [
    {
        img: cnimg1,
        title: 'Silver Earring',
        text: 'Handcrafted silver earrings.',
        price: '₹2,499',
        alt: 'Handcrafted silver earrings'
    },
    {
        img: cnimg2,
        title: 'Nose Ring',
        text: 'Minimal silver nose ring.',
        price: '₹1,499',
        alt: 'Minimal silver nose ring'
    },
    {
        img: cnimg3,
        title: 'Bracelet',
        text: 'Classic silver bracelet.',
        price: '₹3,299',
        alt: 'Classic silver bracelet'
    },
    {
        img: cnimg4,
        title: 'Pendant',
        text: 'Delicate silver pendant.',
        price: '₹1,999',
        alt: 'Delicate silver pendant'
    }
];

class Condos extends Component {
    render() {
        return (
            <section className="condos-section">
                <div className="condos-container">
                    <div className="condos-grid">
                        {condosposts.map((item, i) => (
                            <div key={i} className="condos-grid-item" style={{ animationDelay: `${i * 0.1}s` }}>
                                <div className="condo-item">
                                    <div
                                        className="condo-image"
                                        style={{ backgroundImage: `url(${item.img})` }}
                                        role="img"
                                        aria-label={item.alt}
                                    >
                                        <div className="condo-overlay"></div>
                                    </div>
                                    <div className="condo-content">
                                        <div className="condo-main-info">
                                            <i className="fal fa-plus"></i>
                                            <h3 className="condo-heading">{item.title}</h3>
                                        </div>
                                        <div className="condo-hover-info">
                                            <h3 className="condo-heading">{item.title}</h3>
                                            <p className="condo-description">{item.text}</p>
                                            <Link to="/shop-detail" className="condo-action-btn">
                                                <i className="fal fa-long-arrow-right"></i> Buy Under {item.price}
                                            </Link>
                                        </div>
                                        <Link to="/shop-detail" className="condo-price-btn">
                                            Under {item.price}
                                        </Link>
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

export default Condos;