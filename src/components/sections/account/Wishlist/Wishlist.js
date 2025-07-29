import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiX } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import './Wishlist.css';

const Wishlist = () => {
  const wishlistItems = [
    { 
      id: 'P1001', 
      name: 'Wireless Earbuds', 
      price: 89.99, 
      image: 'https://via.placeholder.com/150', 
      rating: 4,
      inStock: true
    },
    { 
      id: 'P1002', 
      name: 'Smart Watch', 
      price: 199.99, 
      image: 'https://via.placeholder.com/150', 
      rating: 5,
      inStock: true
    },
    { 
      id: 'P1003', 
      name: 'Bluetooth Speaker', 
      price: 59.99, 
      image: 'https://via.placeholder.com/150', 
      rating: 3,
      inStock: false
    }
  ];

  return (
    <div className="wishlist-container">
      <div className="wishlist-header">
        <h1>My Wishlist</h1>
        <p>Your saved items</p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="empty-wishlist">
          <FiHeart size={48} className="empty-icon" />
          <h3>Your wishlist is empty</h3>
          <p>Save items you love for easy access later</p>
          <Link to="/shop" className="shop-btn">Start Shopping</Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlistItems.map(item => (
            <div key={item.id} className="wishlist-item">
              <button className="remove-btn">
                <FiX size={20} />
              </button>
              
              <div className="item-image-container">
                <img src={item.image} alt={item.name} className="item-image" />
                {!item.inStock && (
                  <span className="out-of-stock">Out of Stock</span>
                )}
              </div>
              
              <div className="item-details">
                <h3 className="item-name">{item.name}</h3>
                
                <div className="item-rating">
                  {[...Array(5)].map((_, i) => (
                    <FaStar 
                      key={i} 
                      className={`star ${i < item.rating ? 'filled' : 'empty'}`} 
                    />
                  ))}
                </div>
                
                <div className="item-price">${item.price.toFixed(2)}</div>
                
                <div className="item-actions">
                  <button className="action-btn add-to-cart" disabled={!item.inStock}>
                    <FiShoppingCart className="mr-2" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;