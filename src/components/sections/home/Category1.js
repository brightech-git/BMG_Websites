import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import image1 from '../../../assets/img/category/grid2_-1.webp';
import image2 from '../../../assets/img/category/Group_129625.webp';
import '../../../assets/css/Category1.css';

class Category1 extends Component {
    render() {
        return (
            <div className="category1-container">
                {/* Card 1 */}
                <section className="category1-card">
                    <img src={image1} alt="Earrings Offer" className="category1-img" />
                    <div className="category1-content">
                        <p className="category1-label">Big Deal</p>
                        <h2 className="category1-title">Get 20% Flat Offer</h2>
                        <h3 className="category1-subtitle">on Earrings</h3>
                        <Link to="/shop-left" className="main-btn btn-filled">Shop Now</Link>
                    </div>
                </section>

                {/* Card 2 */}
                <section className="category1-card">
                    <img src={image2} alt="Pendant Offer" className="category1-img" />
                    <div className="category1-content">
                        <h2 className="category1-title dark">Well Designed Pendant</h2>
                        <p className="category1-subtitle light">Nascetur ridiculus mus mauris vitae</p>
                        <Link to="/shop-left" className="main-btn btn-filled">Shop Now</Link>
                       
                    </div>
                </section>
            </div>
        );
    }
}

export default Category1;
