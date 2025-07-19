import React from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2 } from "lucide-react";
import "./Wishlist.css";

import img1 from "../../../assets/img/shop/shop1.webp";
import img2 from "../../../assets/img/shop/shop2.webp";
import img3 from "../../../assets/img/shop/shop3.webp";
import img4 from "../../../assets/img/shop/shop4.webp";
import img5 from "../../../assets/img/shop/shop5.webp";

const wishlistposts = [
  {
    img: img1,
    name: "Silver Infinity Heart Ring",
    price: "2,099",
    originalPrice: "2,499",
    rating: 4.8,
    reviews: 27,
  },
  {
    img: img2,
    name: "Silver Infinite Grace Ring",
    price: "1,499",
    originalPrice: "2,199",
    rating: 4.9,
    reviews: 48,
  },
  {
    img: img3,
    name: "Silver Stay With Me Ring",
    price: "1,699",
    originalPrice: "2,199",
    rating: 4.8,
    reviews: 49,
  },
  {
    img: img4,
    name: "Silver Stay With Me Ring",
    price: "1,699",
    originalPrice: "2,199",
    rating: 4.8,
    reviews: 49,
  },
  {
    img: img5,
    name: "Silver Stay With Me Ring",
    price: "1,699",
    originalPrice: "2,199",
    rating: 4.8,
    reviews: 49,
  },
];

const Content = () => {
  const wishlistEmpty = wishlistposts.length === 0;

  return (
    <section className="wishlist-section">
      <div className="container">
        <div className="text-center mb-5">
          <h3>My Wishlist</h3>
        </div>

        {wishlistEmpty ? (
          <div className="wishlist-empty">
            <Heart size={80} strokeWidth={1} />
            <h4>It feels so empty in here</h4>
            <p>Make a wish!</p>
            <Link to="/shop-left" className="btn-pink">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlistposts.map((item, i) => (
              <div key={i} className="wishlist-card">
                <img
                  src={item.img}
                  alt={item.name}
                  className="wishlist-card-img"
                />
                <div className="wishlist-card-body">
                  <h5 className="wishlist-card-title">{item.name}</h5>
                  <div className="wishlist-card-price">
                    <strong>₹{item.price}</strong>
                    <del>₹{item.originalPrice}</del>
                  </div>
                  <div className="wishlist-card-actions">
                    <button className="btn-move-to-cart">Move to cart</button>
                    <button className="btn-remove">
                      <Trash2 size={18} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Content;
