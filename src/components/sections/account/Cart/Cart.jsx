import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import './Cart.css';

const CartSection = () => {
  const [cartItems, setCartItems] = useState([
    { 
      id: 'P1001', 
      name: 'Wireless Earbuds', 
      price: 89.99, 
      image: 'https://via.placeholder.com/80', 
      quantity: 1,
      inStock: true
    },
    { 
      id: 'P1002', 
      name: 'Smart Watch', 
      price: 199.99, 
      image: 'https://via.placeholder.com/80', 
      quantity: 1,
      inStock: true
    },
    { 
      id: 'P1003', 
      name: 'Phone Case', 
      price: 19.99, 
      image: 'https://via.placeholder.com/80', 
      quantity: 2,
      inStock: true
    }
  ]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>My Cart</h1>
        <p>Review and checkout your items</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <FiShoppingCart size={48} className="empty-icon" />
          <h3>Your cart is empty</h3>
          <p>Start shopping to add items to your cart</p>
          <Link to="/shop" className="shop-btn">Continue Shopping</Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                
                <div className="item-details">
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-price">${item.price.toFixed(2)}</p>
                  
                  <div className="item-quantity">
                    <button 
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <FiMinus size={14} />
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>
                </div>
                
                <div className="item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                
                <button 
                  className="remove-btn"
                  onClick={() => removeItem(item.id)}
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <div className="summary-card">
              <h3 className="summary-title">Order Summary</h3>
              
              <div className="summary-row">
                <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              
              <div className="summary-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              <button className="checkout-btn">Proceed to Checkout</button>
              
              <div className="coupon-section">
                <input 
                  type="text" 
                  placeholder="Enter coupon code" 
                  className="coupon-input"
                />
                <button className="apply-coupon">Apply</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartSection;