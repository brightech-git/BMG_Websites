import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { Tab, Nav } from 'react-bootstrap';
import { useSingleProductQuery } from '../../../hook/product/useSingleProductQuery';

// Static comment images
import comment1 from '../../../assets/img/blog-details/avatar-1.jpg';
import comment2 from '../../../assets/img/blog-details/avatar-2.jpg';
import comment3 from '../../../assets/img/blog-details/avatar-3.jpg';

const Shopinfo = ({ sno }) => {
    console.log(sno , 'sno')
    const [nav1, setNav1] = useState(null);
    const [nav2, setNav2] = useState(null);
    const [clicks, setClicks] = useState(1);
    const slider1 = useRef(null);
    const slider2 = useRef(null);

    const { data, isLoading, error } = useSingleProductQuery(sno);
    console.log(data);
    const baseUrl = "https://app.bmgjewellers.com";

    useEffect(() => {
        setNav1(slider1.current);
        setNav2(slider2.current);
    }, []);

    const IncrementItem = () => {
        setClicks(prev => prev + 1);
    };

    const DecreaseItem = () => {
        setClicks(prev => (prev < 1 ? 0 : prev - 1));
    };

    const handleChange = (event) => {
        setClicks(event.target.value);
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading product details</div>;

    const product = data || {};
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
        variableWidth: true, // This allows each slide to have its own width
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
        <section className="Shop-section pt-120 pb-120">
            <div className="custom-horizontal-padding">
                <div className="row justify-content-center">
                    <div className="col-lg-5">
                        <div className="shop-detail-image">
                            <Slider className="detail-slider-1" {...settings} asNavFor={nav2} ref={slider1}>
                                {bigsliderpost.map((item, i) => (
                                    <div key={i} className="slide-item">
                                        <div className="image-box">
                                            <Link to="#">
                                                <img src={item.img} className="img-fluid" alt="img" />
                                            </Link>
                                            {item.tag && <span className="price">{item.tag}</span>}
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
                                                alt={`Product thumbnail ${i + 1}`}
                                                onError={(e) => {
                                                    e.target.src = '/path/to/placeholder-image.jpg';
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    </div>
                    <div className="col-lg-7">
                        <div className="shop-detail-content">
                            <h3 className="product-title mb-20">{product.ITEMNAME || 'Product Name'}</h3>
                            <span className="rating mb-20">
                                <span className="text-yellow"><i className="far fa-star" /></span>
                                <span className="text-yellow"><i className="far fa-star" /></span>
                                <span className="text-yellow"><i className="far fa-star" /></span>
                                <span className="text-dark-white"><i className="far fa-star" /></span>
                                <span className="text-dark-white"><i className="far fa-star" /></span>
                                <span className="pro-review"> <span>10 Reviews</span></span>
                            </span>
                            <div className="desc mb-20 pb-20 border-bottom">
                                <span className="price">₹{product.GrandTotal?.toFixed(2) || '0.00'} <span>₹{((product.GrandTotal || 0) * 1.25).toFixed(2)}</span></span>
                            </div>
                            <div className="mt-20 mb-20">
                                <div className="ml-2 d-inline-block other-info">
                                    <h6>SKU :
                                        <span className="grey ml-2">{product.SNO || 'N/A'}</span>
                                    </h6>
                                </div>
                            </div>
                            <div className="short-desc mb-20">
                                <p>{product.Description || 'No description available'}</p>
                            </div>
                            <div className="color-sec mb-20">
                                <label>Material</label>
                                <div className="color-box">
                                    <label className="m-0">
                                        <input type="radio" name="material" defaultChecked />
                                        <span className="choose-material">Gold</span>
                                    </label>
                                    <label className="m-0">
                                        <input type="radio" name="material" />
                                        <span className="choose-material">Gold Polished Silver</span>
                                    </label>
                                    <label className="m-0">
                                        <input type="radio" name="material" />
                                        <span className="choose-material">Silver</span>
                                    </label>
                                    <label className="m-0">
                                        <input type="radio" name="material" />
                                        <span className="choose-material">Stone</span>
                                    </label>
                                </div>
                            </div>
                            <div className="quantity-cart d-block d-sm-flex">
                                <div className="cart-btn pl-40">
                                    <Link to="#" className="main-btns btn-filled">Add to Cart</Link>
                                </div>
                                <div className="cart-btn pl-40">
                                    <Link to="#" className="main-btns btn-filled">Buy it Now</Link>
                                </div>
                            </div>
                            <div className="other-info flex mt-20">
                                <h6>Category :</h6>
                                <ul>
                                    <li className="list-inline-item mr-2">
                                        <Link to="#" className="grey">{product.CATNAME || 'N/A'}</Link>
                                    </li>
                                    {product.SUBITEMNAME && (
                                        <li className="list-inline-item mr-2">
                                            <Link to="#" className="grey">{product.SUBITEMNAME}</Link>
                                        </li>
                                    )}
                                </ul>
                            </div>
                            <div className="other-info flex mt-20">
                                <h6>Tags:</h6>
                                <ul>
                                    {product.SUBITEMNAME && (
                                        <li className="list-inline-item mr-2">
                                            <Link to="#" className="grey">{product.SUBITEMNAME.toLowerCase()}</Link>
                                        </li>
                                    )}
                                    <li className="list-inline-item">
                                        <Link to="#" className="grey">{product.ITEMNAME?.toLowerCase() || 'product'}</Link>
                                    </li>
                                </ul>
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