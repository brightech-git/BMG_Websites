import React from 'react';
import { useHistory } from 'react-router-dom';
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
        price: '₹599',
        alt: 'Handcrafted silver earrings',
        itemName: 'Earring',
        gender: 'female',
        min: 0,
        max: 599
    },
    {
        img: cnimg2,
        title: 'Nose Ring',
        text: 'Minimal silver nose ring.',
        price: '₹399',
        alt: 'Minimal silver nose ring',
        itemName: 'Nose Ring',
        gender: 'female',
        min: 0,
        max: 399
    },
    {
        img: cnimg3,
        title: 'Bracelet',
        text: 'Classic silver bracelet.',
        price: '₹299',
        alt: 'Classic silver bracelet',
        itemName: 'Bracelet',
        gender: 'unisex',
        min: 0,
        max: 299
    },
    {
        img: cnimg4,
        title: 'Pendant',
        text: 'Delicate silver pendant.',
        price: '₹199',
        alt: 'Delicate silver pendant',
        itemName: 'Pendant',
        gender: 'female',
        min: 0,
        max: 199
    }
];

const Condos = () => {
    const history = useHistory();

    const handleExploreNow = ( min, max) => {
        const queryParams = new URLSearchParams();
        if (min) queryParams.append('minGrandTotal', min);
        if (max) queryParams.append('maxGrandTotal', max);
        const fixedQuery = queryParams.toString().replace(/\+/g, '%20');
        history.push(`/shop-left?${fixedQuery}`);
    };

    return (
        <section className="condos-section">
            <h1 className="condos-title">Budget Corner</h1>
            <div className="condos-container">
                <div className="condos-grid">
                    {condosposts.map((item, i) => (
                        <div key={i} className="condos-grid-item" style={{ animationDelay: `${i * 0.1}s` }}>
                            <div className="condo-item" onClick={() => handleExploreNow(item.min, item.max)}>
                                <img
                                    src={item.img}
                                    alt={item.alt}
                                    className="condo-image"
                                />
                                <div className="condo-overlay"></div>
                                <div className="condo-content">
                                    <div className="condo-main-info">
                                        <i className="fas fa-plus"></i>
                                        <h3 className="condo-heading">{item.title}</h3>
                                    </div>
                                    <div className="condo-hover-info">
                                        <h3 className="condo-heading">{item.title}</h3>
                                        <p className="condo-description">{item.text}</p>
                                        <button
                                            className="condo-action-btn"
                                            onClick={() => handleExploreNow( item.min, item.max)}
                                        >
                                            <i className="fas fa-long-arrow-right"></i> Buy Under {item.price}
                                        </button>
                                    </div>
                                    <button
                                        className="condo-price-btn"
                                        onClick={() => handleExploreNow(item.min, item.max)}
                                    >
                                        Under {item.price}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Condos;