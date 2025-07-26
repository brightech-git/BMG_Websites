import React, { useRef } from 'react';
import ProductCard from '../sections/productCard/ProductCard';
import './Ourproducts.css';
import useFilterProducts from '../../hook/product/useFilterProducts';
import { useHistory } from 'react-router-dom';
const Ourproducts = () => {
    const gridRef = useRef(null);
    const history = useHistory();
    // Call hook with initial filter
    const {
        data: newArrival,
        loading,
        error
    } = useFilterProducts({ new_arrival: 'Y' });

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
    const handleSeeAll = () => {
        history.push('/shop-left?new_arrival=Y');
    };
    return (
        <section className="featured-products">
            <div className="featured-products__container">
                <div className='new-arrival-container'>
                <div className="featured-products__header">
                    <span className="featured-products__subtitle">New Arrival</span>
                </div>
                <div className="featured-products__header">
                   
                    <button className="products-see-all-btn" onClick={() => handleSeeAll()}>
                        See All
                        <span className="products-btn-arrow">&rarr;</span>
                    </button>
                </div>
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
                        {loading && <p>Loading...</p>}
                        {error && <p>Failed to load products</p>}
                        {!loading && !error && newArrival?.data?.length > 0 ? (
                            newArrival.data.map((item) => (
                                <ProductCard
                                    key={item.SNO || item.id || item.ITEMID}
                                    item={item}
                                />
                            ))
                        ) : (
                            !loading && !error && <p>No featured products found.</p>
                        )}
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
