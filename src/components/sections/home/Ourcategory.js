import React, { Component } from 'react';
import { Tab, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom'

import img1 from '../../../assets/img/shop/image-33.jpg';
import img2 from '../../../assets/img/shop/menu-gallery-2.b8300c96.jpg';
import img3 from '../../../assets/img/shop/image-4 (2).jpg';

const ringsposts = [
    { img: img3, discount: 10, title: 'Silver  Ring', price: 890 },
    { img: img1, discount: 15, title: 'Silver Stud Earrings', price: 580 },
    { img: img2, discount: 40, title: 'Silver Ankle Bracelet', price: 290 },
    { img: img3, discount: 10, title: 'Silver  Ring', price: 890 },
];
const earingposts = [
    { img: img1, discount: 15, title: 'Silver Ankle Bracelet', price: 390 },
    { img: img2, discount: '', title: 'Silver Stud Earrings', price: 290 },
    { img: img3, discount: 10, title: 'Silver Crumpled Ring', price: 450 },
    { img: img1, discount: 15, title: 'Silver  Pendant', price: 780 },
];
const necklessposts = [
    { img: img1, discount: 15, title: 'Silver Ankle Bracelet', price: 390 },
    { img: img3, discount: 10, title: 'Silver Crumpled Ring', price: 450 },
    { img: img1, discount: 15, title: 'Silver  Pendant', price: 780 },
    { img: img2, discount: '', title: 'Silver Stud Earrings', price: 290 },
];

const braceletposts = [
    { img: img3, discount: 10, title: 'Silver Crumpled Ring', price: 450 },
    { img: img1, discount: 15, title: 'Silver Ankle Bracelet', price: 390 },
    { img: img2, discount: '', title: 'Silver Stud Earrings', price: 290 },
    { img: img1, discount: 15, title: 'Silver  Pendant', price: 780 },
];
const armletsposts = [
    { img: img2, discount: '', title: 'Silver Stud Earrings', price: 290 },
    { img: img3, discount: 10, title: 'Silver Crumpled Ring', price: 450 },
    { img: img1, discount: 15, title: 'Silver  Pendant', price: 780 },
    { img: img1, discount: 15, title: 'Silver Ankle Bracelet', price: 390 },
];
const ankletsposts = [
    { img: img2, discount: '', title: 'Silver Stud Earrings', price: 290 },
    { img: img1, discount: 15, title: 'Silver Ankle Bracelet', price: 390 },
    { img: img3, discount: 10, title: 'Silver Crumpled Ring', price: 450 },
    { img: img1, discount: 15, title: 'Silver  Pendant', price: 780 },
];
class Ourcategory extends Component {
    render() {
        return (
            <section className="restaurant-tab-area pb-90">
                <div className="container">
                    <div className="section-title mb-50">
                        <span className="title-tag"> Categories </span>
                        <h2>Our Categories</h2>
                    </div>
                    <Tab.Container defaultActiveKey="earrings">
                        <Nav variant="pills" className="restaurant-rood-list row justify-content-center mb-30">
                            <Nav.Item className="col-lg-2 col-md-3 col-sm-4 col-6">
                                <Nav.Link eventKey="rings">
                                    <i className="flaticon-ring" />
                                    <span className="title">Rings</span>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="col-lg-2 col-md-3 col-sm-4 col-6">
                                <Nav.Link eventKey="earrings">
                                    <i className="flaticon-earrings" />
                                    <span className="title">Earrings</span>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="col-lg-2 col-md-3 col-sm-4 col-6">
                                <Nav.Link eventKey="necklaces">
                                    <i className="flaticon-necklace" />
                                    <span className="title">Necklaces</span>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="col-lg-2 col-md-3 col-sm-4 col-6">
                                <Nav.Link eventKey="bracelets">
                                    <i className="flaticon-bracelet-2" />
                                    <span className="title">Bracelets</span>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="col-lg-2 col-md-3 col-sm-4 col-6">
                                <Nav.Link eventKey="armlets">
                                    <i className="flaticon-bracelet" />
                                    <span className="title">Armlets</span>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="col-lg-2 col-md-3 col-sm-4 col-6">
                                <Nav.Link eventKey="anklets">
                                    <i className="flaticon-bracelet-1" />
                                    <span className="title">Anklets</span>
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <Tab.Content>
                            <Tab.Pane eventKey="rings">
                                <div className="row">
                                    {ringsposts.map((item, i) => (
                                        <div key={i} className="col-lg-3 col-md-6">
                                            <div className="food-box shop-box">
                                                <div className="thumb">
                                                    <img src={item.img} alt="images" />
                                                    <div className="badges">
                                                        {
                                                            item.discount > 0 || item.discount !== '' ? <span className="price">Sale</span> : ''
                                                        }
                                                        {
                                                            item.discount > 0 || item.discount !== '' ? <span className="price discounted">-{item.discount}%</span> : ''
                                                        }
                                                    </div>
                                                    <div className="button-group">
                                                        <Link to="#"><i className="far fa-heart" /></Link>
                                                        <Link to="#"><i className="far fa-sync-alt" /></Link>
                                                        <Link to="#"><i className="far fa-eye" /></Link>
                                                    </div>
                                                </div>
                                                <div className="desc">
                                                    <h4>
                                                        <Link to="/shop-detail" className='title'>{item.title}</Link>
                                                    </h4>
                                                    <span className="price">₹{item.price}
                                                        {item.discount > 0 || item.discount !== '' ? <span> ₹{Math.ceil(item.price * (item.discount / 100))} </span> : ''}</span>
                                                    <Link to="/shop-detail" className="link"><i className="fal fa-arrow-right" /></Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="earrings">
                                <div className="row">
                                    {earingposts.map((item, i) => (
                                        <div key={i} className="col-lg-3 col-md-6">
                                            <div className="food-box shop-box">
                                                <div className="thumb">
                                                    <img src={item.img} alt="images" />
                                                    <div className="badges">
                                                        {
                                                            item.discount > 0 || item.discount !== '' ? <span className="price">Sale</span> : ''
                                                        }
                                                        {
                                                            item.discount > 0 || item.discount !== '' ? <span className="price discounted">-{item.discount}%</span> : ''
                                                        }
                                                    </div>
                                                    <div className="button-group">
                                                        <Link to="#"><i className="far fa-heart" /></Link>
                                                        <Link to="#"><i className="far fa-sync-alt" /></Link>
                                                        <Link to="#"><i className="far fa-eye" /></Link>
                                                    </div>
                                                </div>
                                                <div className="desc">
                                                    <h4>
                                                        <Link to="/shop-detail" className='title'>{item.title}</Link>
                                                    </h4>
                                                    <span className="price">₹{item.price}
                                                        {item.discount > 0 || item.discount !== '' ? <span> ₹{Math.ceil(item.price * (item.discount / 100))} </span> : ''}</span>
                                                    <Link to="/shop-detail" className="link"><i className="fal fa-arrow-right" /></Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="necklaces">
                                <div className="row">
                                    {necklessposts.map((item, i) => (
                                        <div key={i} className="col-lg-3 col-md-6">
                                            <div className="food-box shop-box">
                                                <div className="thumb">
                                                    <img src={item.img} alt="images" />
                                                    <div className="badges">
                                                        {
                                                            item.discount > 0 || item.discount !== '' ? <span className="price">Sale</span> : ''
                                                        }
                                                        {
                                                            item.discount > 0 || item.discount !== '' ? <span className="price discounted">-{item.discount}%</span> : ''
                                                        }
                                                    </div>
                                                    <div className="button-group">
                                                        <Link to="#"><i className="far fa-heart" /></Link>
                                                        <Link to="#"><i className="far fa-sync-alt" /></Link>
                                                        <Link to="#"><i className="far fa-eye" /></Link>
                                                    </div>
                                                </div>
                                                <div className="desc">
                                                    <h4>
                                                        <Link to="/shop-detail" className='title'> {item.title}</Link>
                                                    </h4>
                                                    <span className="price">${item.price}
                                                        {item.discount > 0 || item.discount !== '' ? <span> ₹{Math.ceil(item.price * (item.discount / 100))} </span> : ''}</span>
                                                    <Link to="/shop-detail" className="link"><i className="fal fa-arrow-right" /></Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="bracelets">
                                <div className="row">
                                    {braceletposts.map((item, i) => (
                                        <div key={i} className="col-lg-3 col-md-6">
                                            <div className="food-box shop-box">
                                                <div className="thumb">
                                                    <img src={item.img} alt="images" />
                                                    <div className="badges">
                                                        {
                                                            item.discount > 0 || item.discount !== '' ? <span className="price">Sale</span> : ''
                                                        }
                                                        {
                                                            item.discount > 0 || item.discount !== '' ? <span className="price discounted">-{item.discount}%</span> : ''
                                                        }
                                                    </div>
                                                    <div className="button-group">
                                                        <Link to="#"><i className="far fa-heart" /></Link>
                                                        <Link to="#"><i className="far fa-sync-alt" /></Link>
                                                        <Link to="#"><i className="far fa-eye" /></Link>
                                                    </div>
                                                </div>
                                                <div className="desc">
                                                    <h4>
                                                        <Link to="/shop-detail" className='title'>{item.title}</Link>
                                                    </h4>
                                                    <span className="price">${item.price}
                                                        {item.discount > 0 || item.discount !== '' ? <span> ₹{Math.ceil(item.price * (item.discount / 100))} </span> : ''}</span>
                                                    <Link to="/shop-detail" className="link"><i className="fal fa-arrow-right" /></Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="armlets">
                                <div className="row">
                                    {armletsposts.map((item, i) => (
                                        <div key={i} className="col-lg-3 col-md-6">
                                            <div className="food-box shop-box">
                                                <div className="thumb">
                                                    <img src={item.img} alt="images" />
                                                    <div className="badges">
                                                        {
                                                            item.discount > 0 || item.discount !== '' ? <span className="price">Sale</span> : ''
                                                        }
                                                        {
                                                            item.discount > 0 || item.discount !== '' ? <span className="price discounted">-{item.discount}%</span> : ''
                                                        }
                                                    </div>
                                                    <div className="button-group">
                                                        <Link to="#"><i className="far fa-heart" /></Link>
                                                        <Link to="#"><i className="far fa-sync-alt" /></Link>
                                                        <Link to="#"><i className="far fa-eye" /></Link>
                                                    </div>
                                                </div>
                                                <div className="desc">
                                                    <h4>
                                                        <Link to="/shop-detail" className='title'>{item.title}</Link>
                                                    </h4>
                                                    <span className="price">${item.price}
                                                        {item.discount > 0 || item.discount !== '' ? <span> ₹{Math.ceil(item.price * (item.discount / 100))} </span> : ''}</span>
                                                    <Link to="/shop-detail" className="link"><i className="fal fa-arrow-right" /></Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="anklets">
                                <div className="row">
                                    {ankletsposts.map((item, i) => (
                                        <div key={i} className="col-lg-3 col-md-6">
                                            <div className="food-box shop-box">
                                                <div className="thumb">
                                                    <img src={item.img} alt="images" />
                                                    <div className="badges">
                                                        {
                                                            item.discount > 0 || item.discount !== '' ? <span className="price">Sale</span> : ''
                                                        }
                                                        {
                                                            item.discount > 0 || item.discount !== '' ? <span className="price discounted">-{item.discount}%</span> : ''
                                                        }
                                                    </div>
                                                    <div className="button-group">
                                                        <Link to="#"><i className="far fa-heart" /></Link>
                                                        <Link to="#"><i className="far fa-sync-alt" /></Link>
                                                        <Link to="#"><i className="far fa-eye" /></Link>
                                                    </div>
                                                </div>
                                                <div className="desc">
                                                    <h4>
                                                        <Link to="/shop-detail" className='title'>{item.title}</Link>
                                                    </h4>
                                                    <span className="price">${item.price}
                                                        {item.discount > 0 || item.discount !== '' ? <span> ₹{Math.ceil(item.price * (item.discount / 100))} </span> : ''}</span>
                                                    <Link to="/shop-detail" className="link"><i className="fal fa-arrow-right" /></Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                </div>
            </section>
        );
    }
}

export default Ourcategory;