import React from 'react';
import './NewDesign.css';
import mainImage from '../assets/model.jpg'; // Replace with your image
import earringImage from '../assets/earring.png'; // Replace with your image

const NewDesign = () => {
    return (
        <section className="highlight-container">
            <div className="highlight-image">
                <img src={mainImage} alt="Model wearing jewelry" />
            </div>
            <div className="highlight-content">
                <p className="new-design">New Design</p>
                <h1 className="title">Extraordinary<br />Designs</h1>
                <p className="description">
                    Mauris rhoncus aenean vel elit scelerisque. Eu ultrices vitae auctor eu augue ut lectus.
                    Aliquet risus feugiat in ante metus dictum at.
                </p>
                <p className="highlight">Best Gift For Your<br />Loved One</p>
                <button className="shop-button">Shop Now</button>
            </div>
            <div className="highlight-product">
                <img src={earringImage} alt="Gold Earring" />
                <p className="product-name">Gold Earring</p>
                <p className="product-price">$150.00</p>
            </div>
        </section>
    );
};

export default NewDesign;
