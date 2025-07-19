import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../../hook/cart/useCartQuery';
import fallbackImage from '../../../assets/img/shop/shop1.webp';

const Cart = () => {
    const { cartItems, isLoading, error, updateCart, deleteCart } = useCart();
    const [imageErrors, setImageErrors] = useState({});

    const items = useMemo(() => {
        if (!cartItems?.data) return [];
        if (typeof cartItems.data === 'string') return [];
        return Array.isArray(cartItems.data) ? cartItems.data : Object.values(cartItems.data);
    }, [cartItems]);

    const { subtotal, shipping, total } = useMemo(() => {
        const defaultTotals = { subtotal: 0, shipping: 0, total: 0 };
        if (items.length === 0) return defaultTotals;
        const subtotal = items.reduce(
            (sum, item) => sum + (Number(item.amount) * Number(item.quantity)), 0
        );
        return { subtotal, shipping: 0, total: subtotal };
    }, [items]);

    const handleRemoveItem = (itemId) => {
        deleteCart(itemId);
    };

    const handleImageError = (itemId) => {
        setImageErrors(prev => ({ ...prev, [itemId]: true }));
    };

    if (isLoading && !cartItems) {
        return (
            <div className="cart-loading-container">
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="cart-error-container">
                <div className="cart-error-message">
                    Failed to load cart. Please try again later.
                </div>
                <Link to="/" className="cart-empty-button">
                    Return Home
                </Link>
            </div>
        );
    }

    return (
        <div className="cart-page">
            {items.length === 0 ? (
                <div className="cart-empty">
                    <h3>Your cart is empty</h3>
                    <Link to="/shop-left" className="cart-empty-button">
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <div className="cart-wrapper">
                    {/* Left: Cart Items */}
                    <div className="cart-left">
                        {items.map((item) => (
                            <div key={item.sno} className="cart-item-row">
                                <img
                                    src={imageErrors[item.sno] ? fallbackImage : (item.imageUrl || fallbackImage)}
                                    alt={item.itemTagSno}
                                    className="cart-item-image"
                                    onError={() => handleImageError(item.sno)}
                                />
                                <div className="cart-item-main">
                                    <div className="cart-item-title">{item.itemTagSno}</div>
                                    <div className="cart-item-sku">
                                        (SKU ID : <span style={{ color: "#B0B0B0" }}>{item.itemId}-{item.tagNo}</span>)
                                    </div>
                                    <div className="cart-item-price">₹{Number(item.amount).toLocaleString()}</div>
                                    <div className="cart-item-qty">
                                        Quantity: <span className="cart-item-qty-count">{item.quantity}</span>
                                    </div>
                                </div>
                                <button
                                    className="cart-remove-btn"
                                    title="Remove item"
                                    onClick={() => handleRemoveItem(item.sno)}
                                >
                                    &#10005;
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Right: Summary and Coupons */}
                    <div className="cart-right">
                        <div className="cart-coupon-panel">
                            <div className="coupon-row">
                                <div className="coupon-icon">
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#B71C1C">
                                        <path d="M20.59 13.41l- 8 -8a2 2 0 0 0 -2.83 0l-5.17 5.17a2 2 0 0 0 0 2.83l8 8a2 2 0 0 0 2.83 0l5.17 -5.17a2 2 0 0 0 0 -2.83z" />
                                    </svg>
                                </div>
                                <div>
                                    <span className="coupon-title">Discount Coupons</span>
                                </div>
                                <div className="coupon-viewall">
                                    <a href="#">View all</a>
                                </div>
                            </div>
                        </div>
                        <div className="cart-summary-card">
                            <div className="price-title">Price Details</div>
                            <div className="summary-row">
                                <span>Cart MRP ({items.length} Item{items.length !== 1 ? 's' : ''})</span>
                                <span>₹{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span className="free-text">Free</span>
                            </div>
                            <div className="summary-row summary-total">
                                <span>Total</span>
                                <span className="total-amount">₹{total.toLocaleString()}</span>
                            </div>
                        </div>
                        <button className="place-order-btn-full">Place Order</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
