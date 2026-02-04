// import React from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './ProductCardBoot.css';

// const ProductCardBoot = ({ image, title, price, oldPrice, discount, rating }) => {
//     const renderStars = (rating) => {
//         const stars = [];
//         for (let i = 1; i <= 5; i++) {
//             stars.push(
//                 <span key={i} className={i <= rating ? 'text-warning' : 'text-muted'}>
//                     ★
//                 </span>
//             );
//         }
//         return stars;
//     };

//     return (
//         <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
//             <div className="card h-100 shadow-sm border-0 product-card">
//                 <div className="position-relative overflow-hidden">
//                     <img
//                         src={image}
//                         alt={title}
//                         className="card-img-top product-image"
//                     />
//                     {discount && (
//                         <span className="badge bg-success position-absolute top-0 start-0 m-2">
//                             {discount}% OFF
//                         </span>
//                     )}
//                 </div>
//                 <div className="card-body d-flex flex-column">
//                     <h5 className="card-title text-truncate" title={title}>
//                         {title}
//                     </h5>
//                     <div className="d-flex align-items-center mb-2">
//                         <span className="h5 mb-0 me-2">${price.toFixed(2)}</span>
//                         {oldPrice && (
//                             <span className="text-muted text-decoration-line-through">
//                                 ${oldPrice.toFixed(2)}
//                             </span>
//                         )}
//                     </div>
//                     <div className="mb-2">{renderStars(rating)}</div>
//                     <button className="btn btn-primary mt-auto">Add to Cart</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ProductCardBoot;