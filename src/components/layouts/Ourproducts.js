import React, { useRef } from 'react';
import ProductCard from '../sections/productCard/ProductCard';
import './Ourproducts.css';

import img1 from '../../assets/img/category/menu-gallery-1.17b8f89b.jpg';
import img2 from '../../assets/img/category/menu-gallery-2.b8300c96.jpg';
import img3 from '../../assets/img/category/menu-gallery-3.dd0dd075.jpg';
import img4 from '../../assets/img/category/menu-gallery-2.b8300c96.jpg';

const featuredProducts = [
    { img: img1, discount: 15, title: 'Ankle Bracelet', price: 390 },
    { img: img2, discount: '', title: 'Stud Earrings', price: 290 },
    { img: img3, discount: 10, title: 'Crumpled Ring', price: 450 },
    { img: img4, discount: 25, title: 'Moon Necklace', price: 500 },
];
const Ourproducts = () => {
    const gridRef = useRef(null);

    const scrollLeft = () => {
        if (gridRef.current) {
            gridRef.current.scrollBy({
                left: -300,
                behavior: 'smooth'
            });
        }
    };

    const scrollRight = () => {
        if (gridRef.current) {
            gridRef.current.scrollBy({
                left: 300,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="featured-products">
            <div className="featured-products__container">
                <div className="featured-products__header">
                    <span className="featured-products__subtitle">Featured</span>
                    <h2 className="featured-products__title">Our Products</h2>
                </div>

                <div className="featured-products__grid-wrapper">
                    <button
                        className="featured-products__nav-button featured-products__nav-button--prev"
                        onClick={scrollLeft}
                        aria-label="Previous products"
                    >
                        &lt;
                    </button>

                    <div className="featured-products__grid" ref={gridRef}>
                        {featuredProducts.map((item, i) => (
                            <ProductCard key={i} item={item} />
                        ))}
                    </div>

                    <button
                        className="featured-products__nav-button featured-products__nav-button--next"
                        onClick={scrollRight}
                        aria-label="Next products"
                    >
                        &gt;
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Ourproducts;