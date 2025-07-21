import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { useCart } from '../../../hook/cart/useCartQuery';
import { useSingleProductQuery } from '../../../hook/product/useSingleProductQuery';
import fallbackImage from '../../../assets/img/shop/image-4 (2).jpg';
import "./Cart.css";

// CartItem component
const CartItem = ({ item, onRemove, onSelect, isSelected, onProductData }) => {
    const [imageError, setImageError] = useState(false);
    const { data: product, isLoading: productLoading, error: productError } = useSingleProductQuery(item.itemTagSno);

    useEffect(() => {
        if (productError) {
            console.error(`Failed to load product for ${item.itemTagSno}:`, productError);
            onProductData(item.sno, {
                itemId: item.itemId || null,
                tagNo: item.tagNo || null,
                productName: item.itemTagSno || 'Unknown Product',
                price: item.amount || 0,
                imagePath: fallbackImage,
            });
        } else if (product) {
            let imageUrls = [];
            try {
                imageUrls = JSON.parse(product.ImagePath || "[]");
            } catch (err) {
                console.error("Error parsing ImagePath for item", item.itemTagSno, err);
            }
            onProductData(item.sno, {
                itemId: product.ITEMID || item.itemId || null,
                tagNo: product.TAGNO || item.tagNo || null,
                productName: [product.ITEMNAME, product.SUBITEMNAME].filter(Boolean).join('- ') || item.itemTagSno || 'Unknown Product',
                price: product.GrandTotal || item.amount || 0,
                imagePath: imageUrls.length > 0 ? `https://app.bmgjewellers.com${imageUrls[0]}` : fallbackImage,
            });
        }
    }, [product, productError, item.sno, item.itemId, item.tagNo, item.itemTagSno, item.amount, onProductData]);

    let imageUrls = [];
    try {
        imageUrls = JSON.parse(product?.ImagePath || "[]");
    } catch (err) {
        console.error("Error parsing ImagePath for item", item.itemTagSno, err);
    }
    const baseUrl = "https://app.bmgjewellers.com";
    const firstImage = imageUrls.length > 0 ? baseUrl + imageUrls[0] : fallbackImage;

    return (
        <div className="cart-item">
            <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelect(item.sno)}
                className="cart-item-checkbox"
                aria-label={`Select ${product?.ITEMNAME || item.itemTagSno}`}
            />
            <div className="cart-item-image-container">
                {productLoading ? (
                    <div className="cart-item-image-loading"></div>
                ) : (
                    <img
                        src={imageError ? fallbackImage : firstImage}
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
                            SKU: <span>{product?.ITEMID || item.itemId || 'N/A'}-{product?.TAGNO || item.tagNo || 'N/A'}</span>
                        </div>
                    </>
                )}
                <div className="cart-item-price">
                    ₹{Number(product?.GrandTotal || item.amount || 0).toFixed(2)}
                </div>
                <div className="cart-item-specs">
                    {item.netWt && (
                        <div className="cart-item-spec">
                            <span className="spec-label">Weight:</span>
                            <span className="spec-value">{product?.NETWT || item.netWt}g</span>
                        </div>
                    )}
                    {item.purity && (
                        <div className="cart-item-spec">
                            <span className="spec-label">Purity:</span>
                            <span className="spec-value">{product?.PURITY || item.purity}</span>
                        </div>
                    )}
                    <div className="cart-item-spec">
                        <span className="spec-label">Quantity:</span>
                        <span className="spec-value">{item.quantity}</span>
                    </div>
                </div>
            </div>
            <button
                className="cart-item-remove"
                title="Remove item"
                onClick={() => onRemove(item.sno)}
                aria-label="Remove item"
                disabled={productLoading}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

// Cart component
const Cart = ({ history }) => {
    const { cartItems, isLoading, error, deleteCart } = useCart();
    const [selectedItems, setSelectedItems] = useState([]);
    const [productDataMap, setProductDataMap] = useState({});
    const [isRemoving, setIsRemoving] = useState(null);

    useEffect(() => {
        if (cartItems?.data && selectedItems.length === 0) {
            const initialItems = (Array.isArray(cartItems.data) ? cartItems.data : Object.values(cartItems.data))
                .map((item) => item.sno)
                .filter((sno) => !selectedItems.includes(sno));
            if (initialItems.length > 0) {
                setSelectedItems((prev) => [...prev, ...initialItems]);
            }
        }
    }, [cartItems, selectedItems.length]);

    const handleSelectItem = useCallback((sno) => {
        setSelectedItems((prev) =>
            prev.includes(sno)
                ? prev.filter((id) => id !== sno)
                : [...prev, sno]
        );
    }, []);

    const handleProductData = useCallback((sno, productData) => {
        setProductDataMap((prev) => {
            if (prev[sno]?.price === productData.price && prev[sno]?.itemId === productData.itemId) return prev;
            return { ...prev, [sno]: productData };
        });
    }, []);

    const handleRemoveItem = useCallback(async (itemId) => {
        if (window.confirm('Are you sure you want to remove this item from your cart?')) {
            setIsRemoving(itemId);
            try {
                await deleteCart(itemId);
                setSelectedItems((prev) => prev.filter((id) => id !== itemId));
                setProductDataMap((prev) => {
                    const newMap = { ...prev };
                    delete newMap[itemId];
                    return newMap;
                });
            } catch (err) {
                console.error('Failed to remove item:', err);
                alert('Failed to remove item. Please try again.');
            } finally {
                setIsRemoving(null);
            }
        }
    }, [deleteCart]);

    const items = useMemo(() => {
        if (!cartItems?.data) return [];
        if (typeof cartItems.data === 'string') return [];
        return Array.isArray(cartItems.data) ? cartItems.data : Object.values(cartItems.data);
    }, [cartItems]);

    const { subtotal, shipping, total, isDataComplete } = useMemo(() => {
        const defaultTotals = { subtotal: 0, shipping: 0, total: 0, isDataComplete: false };
        if (items.length === 0) return defaultTotals;

        const subtotal = items
            .filter((item) => selectedItems.includes(item.sno))
            .reduce((sum, item) => {
                const product = productDataMap[item.sno];
                const price = product?.price || item.amount || 0;
                return sum + Number(price) * Number(item.quantity);
            }, 0);

        const isDataComplete = selectedItems.every((sno) => !!productDataMap[sno]);

        return { subtotal, shipping: 0, total: subtotal, isDataComplete };
    }, [items, selectedItems, productDataMap]);

    const handleOnCheckout = useCallback(() => {
        if (selectedItems.length === 0) {
            alert('Please select at least one item to proceed to checkout.');
            return;
        }
        if (!isDataComplete) {
            alert('Please wait until all product data is loaded before proceeding to checkout.');
            return;
        }
        const selectedCartItems = items
            .filter((item) => selectedItems.includes(item.sno))
            .map((item) => ({
                sno: item.sno,
                itemId: productDataMap[item.sno]?.itemId || item.itemId || null,
                tagNo: productDataMap[item.sno]?.tagNo || item.tagNo || null,
                productName: productDataMap[item.sno]?.productName || item.itemTagSno || 'Unknown Product',
                quantity: item.quantity,
                price: productDataMap[item.sno]?.price || item.amount || 0,
                imagePath: productDataMap[item.sno]?.imagePath || fallbackImage,
            }));
        const checkoutPayload = {
            items: selectedCartItems,
            totalAmount: total,
        };
        console.log('Navigating with payload:', checkoutPayload); // Debug
        history.push('/checkout', checkoutPayload);
    }, [selectedItems, isDataComplete, items, productDataMap, total, history]);

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
                                onSelect={handleSelectItem}
                                isSelected={selectedItems.includes(item.sno)}
                                onProductData={handleProductData}
                            />
                        ))}
                    </div>
                    <div className="cart-summary-section">
                        <div className="summary-card">
                            <h3 className="summary-title">Order Summary</h3>
                            {isDataComplete ? (
                                <>
                                    <div className="summary-row">
                                        <span>Subtotal ({selectedItems.length} {selectedItems.length === 1 ? 'Item' : 'Items'})</span>
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
                                </>
                            ) : (
                                <div className="summary-loading">
                                    <p>Loading order summary...</p>
                                </div>
                            )}
                            <button
                                className="main-btn btn-filled"
                                onClick={handleOnCheckout}
                                disabled={!isDataComplete || isRemoving}
                            >
                                {isRemoving ? 'Removing...' : 'Proceed to Checkout'}
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
                    </div>
                </div>
            )}
        </main>
    );
};

export default withRouter(Cart);