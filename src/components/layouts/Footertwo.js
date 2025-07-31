// import React, { Component, Fragment } from "react";
// import { Link } from "react-router-dom";
// import Backtotop from "./Backtotop";
// import logo from "../../assets/img/logo1.jpg";

// class Footertwo extends Component {
//   render() {
//     return (
//       <Fragment>
//         <Backtotop />
//         <footer className="footer-two">
//           {/* Main Footer Content */}
//           <div className="footer-widget-area pt-100 pb-50">
//             <div className="container">
//               <div className="row">
//                 {/* Site Info */}
//                 <div className="col-lg-3 col-sm-6 order-1">
//                   <div className="widget site-info-widget mb-50">
//                     <div className="footer-logo mb-50">
//                       <img src={logo} alt="Logo" />
//                     </div>
//                     <p>
//                       Lorem ipsum dolor sit amet, consectetur adipisicing elit,
//                       sed do eiusmod tempor incididunt ut labore et dolore magna
//                       aliqua.
//                     </p>
//                     <div className="social-links mt-40">
//                       <Link to="#">
//                         <i className="fab fa-facebook-f" />
//                       </Link>
//                       <Link to="#">
//                         <i className="fab fa-twitter" />
//                       </Link>
//                       <Link to="#">
//                         <i className="fab fa-behance" />
//                       </Link>
//                       <Link to="#">
//                         <i className="fab fa-linkedin" />
//                       </Link>
//                       <Link to="#">
//                         <i className="fab fa-youtube" />
//                       </Link>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Useful Links */}
//                 <div className="col-lg-6 order-3 order-lg-2">
//                   <div className="widget nav-widget mb-50">
//                     <h4 className="widget-title">Useful Links</h4>
//                     <ul className="useful-links">
//                       <li>
//                         <Link to="#">Contact Us</Link>
//                       </li>
//                       <li>
//                         <Link to="#">About Us</Link>
//                       </li>
//                       <li>
//                         <Link to="#">Shipping & Returns</Link>
//                       </li>
//                       <li>
//                         <Link to="#">Refund Policy</Link>
//                       </li>
//                       <li>
//                         <Link to="#">Terms & Conditions</Link>
//                       </li>
//                       <li>
//                         <Link to="faq">FAQ</Link>
//                       </li>
//                     </ul>

//                     {/* ✅ PAYMENT ICONS BELOW LINKS */}
//                     <div className="payment-icons mt-4">
//                       <i className="fab fa-cc-visa"></i>
//                       <i className="fab fa-cc-mastercard"></i>
//                       <i className="fab fa-cc-paypal"></i>
//                       <i className="fab fa-cc-apple-pay"></i>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Contact Info */}
//                 <div className="col-lg-3 col-sm-6 order-2 order-lg-3">
//                   <div className="widget contact-widget mb-50">
//                     <h4 className="widget-title">Contact Us.</h4>
//                     <div className="contact-lists">
//                       <div className="contact-box">
//                         <div className="icon">
//                           <i className="flaticon-phone" />
//                         </div>
//                         <div className="desc">
//                           <h6 className="title">Phone Number</h6>
//                           <span> +91-95143 33601,</span>
//                           <span> +91-95143 336097</span>
//                         </div>
//                       </div>
//                       <div className="contact-box">
//                         <div className="icon">
//                           <i className="flaticon-message" />
//                         </div>
//                         <div className="desc">
//                           <h6 className="title">Email Address</h6>
//                           <Link to="#">Contact@bmgjewellers.in</Link>
//                         </div>
//                       </div>
//                       <div className="contact-box">
//                         <div className="icon">
//                           <i className="flaticon-location-pin" />
//                         </div>
//                         <div className="desc">
//                           <h6 className="title">Office Address</h6>
//                           M/s. BMG Jewellers Pvt Ltd, 160, Melamasi St,
//                           Madurai-625001
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Popular Searches Section */}
//           <div
//             className="popular-searches py-5"
//             style={{ backgroundColor: "#f5f6f0" }}
//           >
//             <div className="container">
//               <h5
//                 className="mb-4 text-uppercase"
//                 style={{ fontWeight: 600, color: "#000000" }}
//               >
//                 Popular Searches
//               </h5>

//               <div className="row">
//                 {/* Column 1 */}
//                 <div className="col-lg-3 col-sm-6 mb-3">
//                   <h6 className="text-dark font-weight-bold">Rings</h6>
//                   <ul className="footer-links">
//                     <li>
//                       <Link to="#">Daily Wear</Link>
//                     </li>
//                     <li>
//                       <Link to="#">Statement Rings</Link>
//                     </li>
//                     <li>
//                       <Link to="#">Couple Rings</Link>
//                     </li>
//                     <li>
//                       <Link to="#">Engagement Rings</Link>
//                     </li>
//                     <li>
//                       <Link to="#">Wedding Rings</Link>
//                     </li>
//                   </ul>

//                   <h6 className="text-dark font-weight-bold mt-3">Earrings</h6>
//                   <ul className="footer-links">
//                     <li>
//                       <Link to="#">Jhumkas</Link>
//                     </li>
//                     <li>
//                       <Link to="#">Studs</Link>
//                     </li>
//                     <li>
//                       <Link to="#">Chandbalis</Link>
//                     </li>
//                     <li>
//                       <Link to="#">Danglers</Link>
//                     </li>
//                   </ul>
//                 </div>

//                 {/* Column 2 */}
//                 <div className="col-lg-3 col-sm-6 mb-3">
//                   <h6 className="text-dark font-weight-bold">
//                     Necklaces & Sets
//                   </h6>
//                   <ul className="footer-links">
//                     <li>
//                       <Link to="#">Chocker sets</Link>
//                     </li>
//                     <li>
//                       <Link to="#">Long Haram</Link>
//                     </li>
//                     <li>
//                       <Link to="#">Short Chains</Link>
//                     </li>
//                     <li>
//                       <Link to="#">Temple sets</Link>
//                     </li>
//                   </ul>

//                   <h6 className="text-dark font-weight-bold mt-3">
//                     Bangles & Bracelets
//                   </h6>
//                   <ul className="footer-links">
//                     <li>
//                       <Link to="#">Kadas</Link>
//                     </li>
//                     <li>
//                       <Link to="#">Closed Bangles</Link>
//                     </li>
//                     <li>
//                       <Link to="#">Openable Bangles</Link>
//                     </li>
//                     <li>
//                       <Link to="#">Adjustable Bracelets</Link>
//                     </li>
//                   </ul>
//                 </div>

//                 {/* Column 3 */}
//                 <div className="col-lg-3 col-sm-6 mb-3">
//                   <h6 className="text-dark font-weight-bold">
//                     Ankles & Toe Rings
//                   </h6>
//                   <ul className="footer-links">
//                     <li>
//                       <Link to="#">Traditional Anklets</Link>
//                     </li>
//                     <li>
//                       <Link to="#">Fancy Anklets</Link>
//                     </li>
//                     <li>
//                       <Link to="#">Toe Rings</Link>
//                     </li>
//                   </ul>

//                   <h6 className="text-dark font-weight-bold mt-3">
//                     Pendants & Chains
//                   </h6>
//                   <ul className="footer-links">
//                     <li>
//                       <Link to="#">Name Pendants</Link>
//                     </li>
//                     <li>
//                       <Link to="#">Stone Pendants</Link>
//                     </li>
//                     <li>
//                       <Link to="#">Plain Chains</Link>
//                     </li>
//                   </ul>

//                   <h6 className="text-dark font-weight-bold mt-3">
//                     Maang Tikka & Hair
//                   </h6>
//                   <ul className="footer-links">
//                     <li>
//                       <Link to="#">Bridal</Link>
//                     </li>
//                     <li>
//                       <Link to="#">Festive Look</Link>
//                     </li>
//                   </ul>
//                 </div>

//                 {/* Column 4 */}
//                 <div className="col-lg-3 col-sm-6 mb-3">
//                   <h6 className="text-dark font-weight-bold">
//                     Bridal Collection
//                   </h6>
//                   <ul className="footer-links">
//                     <li>
//                       <Link to="#">Full Sets</Link>
//                     </li>
//                     <li>
//                       <Link to="#">Bridal Earrings</Link>
//                     </li>
//                     <li>
//                       <Link to="#">Bridal Bangles</Link>
//                     </li>
//                   </ul>

//                   <h6 className="text-dark font-weight-bold mt-3">
//                     Temple Jewellery
//                   </h6>
//                   <ul className="footer-links">
//                     <li>
//                       <Link to="#">Traditional Kemp</Link>
//                     </li>
//                     <li>
//                       <Link to="#">Matte Gold Finish</Link>
//                     </li>
//                   </ul>

//                   <h6 className="text-dark font-weight-bold mt-3">
//                     Men's Jewellery
//                   </h6>
//                   <ul className="footer-links">
//                     <li>
//                       <Link to="#">Chains</Link>
//                     </li>
//                     <li>
//                       <Link to="#">Kada</Link>
//                     </li>
//                     <li>
//                       <Link to="#">Rings</Link>
//                     </li>
//                   </ul>
//                 </div>
//               </div>

//               {/* Second Row */}
//               <div className="row mt-3">
//                 {/* Column 1 */}
//                 <div className="col-lg-3 col-sm-6 mb-3">
//                   <h6 className="text-dark font-weight-bold">Kids Jewellery</h6>
//                   <ul className="footer-links">
//                     <li>
//                       <Link to="#">Cute Neckpieces</Link>
//                     </li>
//                     <li>
//                       <Link to="#">Mini Bangles</Link>
//                     </li>
//                     <li>
//                       <Link to="#">Studs</Link>
//                     </li>
//                   </ul>
//                 </div>

//                 {/* Column 2 */}
//                 <div className="col-lg-3 col-sm-6 mb-3">
//                   <h6 className="text-dark font-weight-bold">
//                     Oxidised Jewellery
//                   </h6>
//                   <ul className="footer-links">
//                     <li>
//                       <Link to="#">German Silver</Link>
//                     </li>
//                     <li>
//                       <Link to="#">Antique Look Sets</Link>
//                     </li>
//                   </ul>
//                 </div>

//                 {/* Column 3 */}
//                 <div className="col-lg-3 col-sm-6 mb-3">
//                   <h6 className="text-dark font-weight-bold">
//                     Customised Jewellery
//                   </h6>
//                   <ul className="footer-links">
//                     <li>
//                       <Link to="#">Name Jewellery</Link>
//                     </li>
//                     <li>
//                       <Link to="#">Alphabet Pendants</Link>
//                     </li>
//                     <li>
//                       <Link to="#">BirthStone Rings</Link>
//                     </li>
//                   </ul>
//                 </div>

//                 {/* Column 4 */}
//                 <div className="col-lg-3 col-sm-6 mb-3">
//                   <h6 className="text-dark font-weight-bold">Gift Ideas</h6>
//                   <ul className="footer-links">
//                     <li>
//                       <Link to="#">Under Rs.999</Link>
//                     </li>
//                     <li>
//                       <Link to="#">Under Rs.1999</Link>
//                     </li>
//                     <li>
//                       <Link to="#">Under Rs.2999</Link>
//                     </li>
//                     <li>
//                       <Link to="#">Above Rs.3000</Link>
//                     </li>
//                     <li>
//                       <Link to="#">For Him</Link>
//                     </li>
//                     <li>
//                       <Link to="#">For Her</Link>
//                     </li>
//                   </ul>
//                 </div>
//               </div>

//               {/* Third Row */}
//               <div className="row mt-3">
//                 <div className="col-lg-4 col-sm-6 mb-3">
//                   <h6 className="text-dark font-weight-bold">
//                     Festival Specials
//                   </h6>
//                   <ul className="footer-links">
//                     <li>
//                       <Link to="#">Navaratri</Link>
//                     </li>
//                     <li>
//                       <Link to="#">Diwali</Link>
//                     </li>
//                     <li>
//                       <Link to="#">Wedding Season Picks</Link>
//                     </li>
//                   </ul>
//                 </div>

//                 <div className="col-lg-4 col-sm-6 mb-3">
//                   <h6 className="text-dark font-weight-bold">Clearance Sale</h6>
//                   <ul className="footer-links">
//                     <li>
//                       <Link to="#">Heavy Discount</Link>
//                     </li>
//                     <li>
//                       <Link to="#">Last Stock Items</Link>
//                     </li>
//                   </ul>
//                 </div>

//                 <div className="col-lg-4 col-sm-6 mb-3">
//                   <h6 className="text-dark font-weight-bold">Offers</h6>
//                   <ul className="footer-links">
//                     <li>
//                       <Link to="#">Buy 2 Get 1</Link>
//                     </li>
//                     <li>
//                       <Link to="#">50% Off</Link>
//                     </li>
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Copyright Section */}
//           <div className="copyright-area pt-30 pb-30">
//             <div className="container">
//               <div className="row align-items-center">
//                 <div className="col-lg-6 col-md-5 order-2 order-md-1">
//                   <p className="copyright-text copyright-two">
//                     © 2025, <Link to="#">BMG Jewellers Pvt Ltd</Link>
//                   </p>
//                 </div>
//                 <div className="col-lg-6 col-md-7 order-1 order-md-2">
//                   <div className="footer-menu text-center text-md-right">
//                     <ul>
//                       <li>
//                         <Link to="#">Today's Deal</Link>
//                       </li>
//                       <li>
//                         <Link to="#">Our Collections</Link>
//                       </li>
//                       <li>
//                         <Link to="#">Deal of the Day</Link>
//                       </li>
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </footer>
//       </Fragment>
//     );
//   }
// }

// export default Footertwo;
