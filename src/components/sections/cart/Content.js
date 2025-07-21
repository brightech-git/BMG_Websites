import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../../hook/cart/useCartQuery';
import { useSingleProductQuery } from '../../../hook/product/useSingleProductQuery';
import fallbackImage from '../../../assets/img/shop/shop1.webp';
import "./Cart.css";

const CartItem = ({ item, onRemove }) => {
    const [imageError, setImageError] = useState(false);
    const { data: product, isLoading: productLoading } = useSingleProductQuery(item.itemTagSno);
    console.log(product)

    let imageUrls = [];
    try {
        imageUrls = JSON.parse(product?.ImagePath || "[]");
    } catch (err) {
        console.error("Error parsing ImagePath", err);
    }
    const baseUrl = "https://app.bmgjewellers.com";
    const firstImage = imageUrls.length > 0 ? baseUrl + imageUrls[0] : "/images/placeholder.png";

    return (
        <div className="cart-item">
            <div className="cart-item-image-container">
                {productLoading ? (
                    <div className="cart-item-image-loading"></div>
                ) : (
                    <img
                        src={firstImage}
                        alt={product?.ITEMNAME || item.itemTagSno}
                        className="cart-item-image"
                        onError={() => setImageError(true)}
                        loading="lazy"
                    />
                )}
            </div>

            <div className="cart-item-details">
                {productLoading ? (
                    <>
                        <div className="cart-item-title-loading"></div>
                        <div className="cart-item-sku-loading"></div>
                    </>
                ) : (
                    <>
                        <h3 className="cart-item-title">
                            <Link to={`/product/${item.itemTagSno}`}>
                                {product?.ITEMNAME || item.itemTagSno}
                            </Link>
                        </h3>
                        <div className="cart-item-sku">
                                SKU: <span>{product?.ITEMID}-{product?.TAGNO}</span>
                        </div>
                    </>
                )}

                <div className="cart-item-price">
                    ₹{Number(product?.GrandTotal).toFixed(2)}
                </div>

                <div className="cart-item-specs">
                    
                        <>
                            {item.netWt && (
                                <div className="cart-item-spec">
                                    <span className="spec-label">Weight:</span>
                                <span className="spec-value">{product?.NETWT}g</span>
                                </div>
                            )}
                            {item.purity && (
                                <div className="cart-item-spec">
                                    <span className="spec-label">Purity:</span>
                                <span className="spec-value">{product?.PURITY}</span>
                                </div>
                            )}
                        </>
                  
                </div>
            </div>

            <button
                className="cart-item-remove"
                title="Remove item"
                onClick={() => onRemove(item.sno)}
                aria-label="Remove item"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

const Cart = () => {
    const { cartItems, isLoading, error, deleteCart } = useCart();
    console.log(cartItems)

    // Extract items from cart data
    const items = useMemo(() => {
        if (!cartItems?.data) return [];
        if (typeof cartItems.data === 'string') return [];
        return Array.isArray(cartItems.data) ? cartItems.data : Object.values(cartItems.data);
    }, [cartItems]);

    // Calculate totals
    const { subtotal, shipping, total } = useMemo(() => {
        const defaultTotals = { subtotal: 0, shipping: 0, total: 0 };
        if (items.length === 0) return defaultTotals;

        const subtotal = items.reduce(
            (sum, item) => sum + (Number(item.amount) * Number(item.quantity)),
            0
        );
        return { subtotal, shipping: 0, total: subtotal };
    }, [items]);

    const handleRemoveItem = (itemId) => {
        if (window.confirm('Are you sure you want to remove this item from your cart?')) {
            deleteCart(itemId);
        }
    };

    if (isLoading && !cartItems) {
        return (
            <div className="cart-loading">
                <div className="loading-spinner"></div>
                <p>Loading your cart...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="cart-error">
                <div className="error-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3>Failed to load cart</h3>
                <p>Please try again later</p>
                <Link to="/" className="btn-primary">
                    Return Home
                </Link>
            </div>
        );
    }

    return (
        <main className="cart-container">
            <div className="cart-header">
                <h1>Your Shopping Cart</h1>
                <div className="cart-item-count">{items.length} {items.length === 1 ? 'Item' : 'Items'}</div>
            </div>

            {items.length === 0 ? (
                <div className="empty-cart">
                    <div className="empty-cart-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h2>Your cart is empty</h2>
                    <p>Looks like you haven't added anything to your cart yet</p>
                    <Link to="/shop-left" className="btn-primary">
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <div className="cart-content">
                    <div className="cart-items-section">
                        {items.map((item) => (
                            <CartItem
                                key={item.sno}
                                item={item}
                                onRemove={handleRemoveItem}
                            />
                        ))}
                    </div>

                    <div className="cart-summary-section">
                        <div className="summary-card">
                            <h3 className="summary-title">Order Summary</h3>

                            <div className="summary-row">
                                <span>Subtotal ({items.length} {items.length === 1 ? 'Item' : 'Items'})</span>
                                <span>₹{subtotal.toLocaleString('en-IN')}</span>
                            </div>

                            <div className="summary-row">
                                <span>Shipping</span>
                                <span className="free-shipping">Free</span>
                            </div>

                            <div className="summary-divider"></div>

                            <div className="summary-row total-row">
                                <span>Total</span>
                                <span className="total-amount">₹{total.toLocaleString('en-IN')}</span>
                            </div>

                            <button className="main-btn btn-filled">
                                Proceed to Checkout
                            </button>

                            <div className="payment-methods">
                                <p>Secure Payment Options:</p>
                                <div className="payment-icons">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        {/* Credit card icons would go here */}
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="coupon-card">
                            <div className="coupon-header">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.59 13.41l-8-8a2 2 0 0 0-2.83 0l-5.17 5.17a2 2 0 0 0 0 2.83l8 8a2 2 0 0 0 2.83 0l5.17-5.17a2 2 0 0 0 0-2.83z" />
                                </svg>
                                <h4>Apply Coupon Code</h4>
                            </div>

                            <div className="coupon-input-group">
                                <input
                                    type="text"
                                    placeholder="Enter coupon code"
                                    className="coupon-input"
                                />
                                <button className="coupon-apply-btn">Apply</button>
                            </div>

                            <Link to="/coupons" className="view-coupons-link">
                                View all available coupons
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Cart;