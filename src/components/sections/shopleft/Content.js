import React from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../../layouts/Pagination';
import Sidebar from '../../layouts/Shopsidebar';
import { useProductsQuery } from '../../../hook/product/useProductsQuery';

const baseUrl = "https://app.bmgjewellers.com";

const Content = () => {
    const { data, isLoading, isError } = useProductsQuery('', 1, 10);
    console.log(data);

    if (isLoading) return <p>Loading products...</p>;
    if (isError) return <p>Failed to load products. Please try again.</p>;

    const products = data || [];

    return (
        <section className="Shop-section pt-80 pb-80">
            <div className="custom-shop-layout">
                {/* Sidebar */}
                <div className="sidebar-area">
                    <Sidebar />
                </div>

                {/* Product Grid */}
                <div className="product-area">
                    <div className="shop-products-wrapper">
                        <div className="shop-product-top">
                            <p>Showing 1 To {products.length} of {products.length} results</p>
                            <div className="sorting-box">
                                <select className="nice-select">
                                    <option>Default Sorting</option>
                                    <option>Sort By Popularity</option>
                                    <option>Sort By Latest</option>
                                    <option>Sort By Rating</option>
                                    <option>Sort By Price: Low to High</option>
                                    <option>Sort By Price: High to Low</option>
                                </select>
                            </div>
                        </div>

                        <div className="product-wrapper restaurant-tab-area">
                            <div className="row">
                                {products.map((item, i) => {
                                    // Parse image array safely
                                    let images = [];
                                    try {
                                        images = JSON.parse(item.ImagePath || '[]');
                                    } catch (error) {
                                        console.warn('Invalid image JSON for item', item.ITEMID);
                                    }
                                    const firstImage = images.length > 0 ? `${baseUrl}${images[0]}` : 'https://via.placeholder.com/245x331';

                                    return (
                                        <div key={i} className="col-6 col-sm-6 col-md-6 col-lg-4">
                                            <div className="food-box shop-box">
                                                <div className="thumb">
                                                    <img src={firstImage} alt={item.ITEMNAME} />
                                                    {/* Optional: discount or badges */}
                                                    <div className="button-group">
                                                        <Link to="#"><i className="far fa-heart" /></Link>
                                                        <Link to="#"><i className="far fa-sync-alt" /></Link>
                                                        <Link to="#"><i className="far fa-eye" /></Link>
                                                    </div>
                                                </div>
                                                <div className="desc">
                                                    <h4>
                                                        <Link to="/shop-detail" className="title">{item.ITEMNAME}</Link>
                                                    </h4>
                                                    <span className="price">
                                                        ₹{parseFloat(item.GrandTotal).toFixed(2)}
                                                    </span>
                                                    <Link to={`/shop-detail/${item.SNO}`} className="link">
                                                        <i className="fal fa-arrow-right" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
{/* 
                        <div className="pagination-wrap">
                            <Pagination />
                        </div> */}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Content;
