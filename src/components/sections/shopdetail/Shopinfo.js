import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { Tab, Nav } from 'react-bootstrap';
import { useSingleProductQuery } from '../../../hook/product/useSingleProductQuery';
import { useCart } from '../../../hook/cart/useCartQuery';
import { useAuth } from '../../../context/authContext/UserAuthContext';
import './ShopInfoCart.css';

// Static comment images
import comment1 from '../../../assets/img/blog-details/avatar-1.jpg';
import comment2 from '../../../assets/img/blog-details/avatar-2.jpg';
import comment3 from '../../../assets/img/blog-details/avatar-3.jpg';

const Shopinfo = ({ sno }) => {
    const { user } = useAuth();
    const [nav1, setNav1] = useState(null);
    const [nav2, setNav2] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedMaterial, setSelectedMaterial] = useState('Gold');
    const slider1 = useRef(null);
    const slider2 = useRef(null);

    const { data: product, isLoading, error } = useSingleProductQuery(sno);
    console.log(product, 'cart');
    const {
        cartItems,
        addToCartHandler,
        deleteCart,
        isLoading: isCartLoading
    } = useCart();

    useEffect(() => {
        setNav1(slider1.current);
        setNav2(slider2.current);
    }, []);

    const incrementQuantity = () => setQuantity(prev => prev + 1);
    const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    const handleAddToCart = () => {
        if (!user) {
            alert('Please login to add items to cart');
            return;
        }

        if (!product?.SNO) return;

        const cartItem = {
            itemSno: product.SNO,
            itemTagSno: product.SNO,
            itemName: product.ITEMNAME,
            price: product.GrandTotal,
            image: product.ImagePath ? JSON.parse(product.ImagePath)[0] : '',
            material: selectedMaterial,
            quantity
        };

        addToCartHandler(cartItem);
    };

    const isInCart = Array.isArray(cartItems?.data) &&
        cartItems.data.some(item =>
            item.itemSno === product?.SNO && item.material === selectedMaterial
        );


    if (isLoading) return <div className="loading-spinner">Loading...</div>;
    if (error) return <div className="error-message">Error loading product details</div>;
    if (!product) return <div className="error-message">Product not found</div>;

    const baseUrl = "https://app.bmgjewellers.com";
    const images = product.ImagePath
        ? JSON.parse(product.ImagePath).map(path => `${baseUrl}${path}`)
        : [];

    const bigsliderpost = images.map((img, index) => ({
        img,
        tag: index === 0 ? 'Sale' : undefined
    }));

    const smallsliderpost = images.map(img => ({ img }));

    const settings = {
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: false,
        infinite: true,
        autoplay: false,
        arrows: false,
        dots: false,
    };

    const settings2 = {
        slidesToShow: 5,
        slidesToScroll: 1,
        infinite: false,
        arrows: false,
        dots: false,
        focusOnSelect: true,
        centerMode: false,
        variableWidth: true,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 4,
                    variableWidth: true
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                    variableWidth: true
                }
            }
        ]
    };

    return (
        <section className="shop-info-section">
            <div className="container">
                <div className="row product-detail-row">
                    <div className="col-lg-5 product-gallery">
                        <div className="shop-detail-image">
                            <Slider className="detail-slider-1" {...settings} asNavFor={nav2} ref={slider1}>
                                {bigsliderpost.map((item, i) => (
                                    <div key={i} className="slide-item">
                                        <div className="image-box">
                                            <Link to="#">
                                                <img
                                                    src={item.img}
                                                    className="img-fluid"
                                                    alt="Product"
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/500x500';
                                                    }}
                                                />
                                            </Link>
                                            {item.tag && <span className="price-tag">{item.tag}</span>}
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                            <Slider className="detail-slider-2" {...settings2} asNavFor={nav1} ref={slider2}>
                                {smallsliderpost.map((item, i) => (
                                    <div key={i} className="slide-item">
                                        <div className="image-box">
                                            <img
                                                src={item.img}
                                                className="img-fluid"
                                                alt={`Thumbnail ${i + 1}`}
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/100x100';
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    </div>

                    <div className="col-lg-7 product-info">
                        <h1 className="product-title">{product.ITEMNAME || 'Product Name'}</h1>

                        <div className="product-rating">
                            <span className="text-yellow"><i className="far fa-star" /></span>
                            <span className="text-yellow"><i className="far fa-star" /></span>
                            <span className="text-yellow"><i className="far fa-star" /></span>
                            <span className="text-dark-white"><i className="far fa-star" /></span>
                            <span className="text-dark-white"><i className="far fa-star" /></span>
                            <span className="reviews-count">10 Reviews</span>
                        </div>

                        <div className="product-price">
                            <span className="current-price">₹{product.GrandTotal?.toFixed(2) || '0.00'}</span>
                            <span className="original-price">₹{((product.GrandTotal || 0) * 1.25).toFixed(2)}</span>
                            <span className="discount-badge">20% OFF</span>
                        </div>

                        <div className="product-meta">
                            <div className="meta-item">
                                <span className="meta-label">SKU:</span>
                                <span className="meta-value">{product.SNO || 'N/A'}</span>
                            </div>
                        </div>

                        <div className="product-description">
                            <p>{product.Description || 'No description available'}</p>
                            <button className="main-btns btn-filled" onClick={handleAddToCart}>add to cart</button>
                        </div>
                        <div className="product-actions">
                          
                              
                                    <button
                                        className="btn btn-add-cart"
                                        
                                    >
                                       
                                    </button>
                                    <button className="btn btn-buy-now">
                                        Buy it Now
                                    </button>
                                
                            
                        </div>

                        <div className="product-variants">
                            <label>Material</label>
                            <div className="variant-options">
                                {['Gold', 'Gold Polished Silver', 'Silver', 'Stone'].map((material) => (
                                    <button
                                        key={material}
                                        className={`variant-btn ${selectedMaterial === material ? 'active' : ''}`}
                                        onClick={() => setSelectedMaterial(material)}
                                    >
                                        {material}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="product-quantity">
                            <label>Quantity</label>
                            <div className="quantity-selector">
                                <button onClick={decrementQuantity}>-</button>
                                <input
                                    type="number"
                                    value={quantity}
                                    min="1"
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                />
                                <button onClick={incrementQuantity}>+</button>
                            </div>
                        </div>

                       

                        <div className="product-meta-footer">
                            <div className="meta-category">
                                <span>Category:</span>
                                <Link to="#">{product.CATNAME || 'N/A'}</Link>
                                {product.SUBITEMNAME && (
                                    <Link to="#">{product.SUBITEMNAME}</Link>
                                )}
                            </div>
                            <div className="meta-tags">
                                <span>Tags:</span>
                                {product.SUBITEMNAME && (
                                    <Link to="#">{product.SUBITEMNAME.toLowerCase()}</Link>
                                )}
                                <Link to="#">{product.ITEMNAME?.toLowerCase() || 'product'}</Link>
                            </div>
                        </div>
                    </div>
               
                    <div className="col-12">
                        <div className="product-description mt-100">
                            <Tab.Container defaultActiveKey="description">
                                <div className="tabs">
                                    <Nav variant="tabs" className="justify-content-center">
                                        <Nav.Item>
                                            <Nav.Link eventKey="description">Description</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="review">Reviews (3)</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="addinfo">Additional Info</Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                    <Tab.Content>
                                        <Tab.Pane eventKey="description">
                                            <p>{product.Description || 'No description available'}</p>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="review">
                                            <div className="news-details-box">
                                                <div className="comment-template">
                                                    <h3 className="box-title">03 Reviews</h3>
                                                    <ul className="comments-list mb-100">
                                                        <li>
                                                            <div className="comment-img">
                                                                <img src={comment1} alt="img" />
                                                            </div>
                                                            <div className="comment-desc">
                                                                <div className="desc-top">
                                                                    <h6>Rosalina Kelian</h6>
                                                                    <span className="date">19th May 2022</span>
                                                                    <Link to="#" className="reply-link"><i className="far fa-reply" />Reply</Link>
                                                                </div>
                                                                <p>
                                                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                                                </p>
                                                            </div>
                                                            <ul className="children">
                                                                <li>
                                                                    <div className="comment-img">
                                                                        <img src={comment2} alt="img" />
                                                                    </div>
                                                                    <div className="comment-desc">
                                                                        <div className="desc-top">
                                                                            <h6>Rosalina Kelian</h6>
                                                                            <span className="date">19th May 2022</span>
                                                                            <Link to="#" className="reply-link"><i className="far fa-reply" />Reply</Link>
                                                                        </div>
                                                                        <p>
                                                                            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                                                        </p>
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                        </li>
                                                        <li>
                                                            <div className="comment-img">
                                                                <img src={comment3} alt="img" />
                                                            </div>
                                                            <div className="comment-desc">
                                                                <div className="desc-top">
                                                                    <h6>Rosalina Kelian</h6>
                                                                    <span className="date">19th May 2022</span>
                                                                    <Link to="#" className="reply-link"><i className="far fa-reply" />Reply</Link>
                                                                </div>
                                                                <p>
                                                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                                                </p>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                    <h3 className="box-title">Post Comment</h3>
                                                    <div className="comment-form">
                                                        <form action="#">
                                                            <div className="input-group input-group-two textarea mb-20">
                                                                <textarea placeholder="Type your Review...." defaultValue={""} />
                                                                <div className="icon"><i className="fas fa-pen" /></div>
                                                            </div>
                                                            <div className="input-group input-group-two mb-20">
                                                                <input type="text" placeholder="Type your Name...." />
                                                                <div className="icon"><i className="fas fa-user" /></div>
                                                            </div>
                                                            <div className="input-group input-group-two mb-20">
                                                                <input type="email" placeholder="Type your email...." />
                                                                <div className="icon"><i className="fas fa-envelope" /></div>
                                                            </div>
                                                            <div className="input-group mt-30">
                                                                <button type="submit" className="main-btn btn-filled"><i className="far fa-comments" /> Post Review</button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="addinfo" className="additional-info">
                                            <div>
                                                <h3 className="mb-20">Additional Information</h3>
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th>Attributes</th>
                                                            <th>Values</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td><b>Material</b></td>
                                                            <td className="value">{product.SUBITEMNAME || 'N/A'}</td>
                                                        </tr>
                                                        <tr>
                                                            <td><b>Weight</b></td>
                                                            <td className="value">{product.NETWT ? `${product.NETWT} Gram` : 'N/A'}</td>
                                                        </tr>
                                                        <tr>
                                                            <td><b>Purity</b></td>
                                                            <td className="value">{product.PURITY ? `${product.PURITY}%` : 'N/A'}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </Tab.Pane>
                                    </Tab.Content>
                                </div>
                            </Tab.Container>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Shopinfo;