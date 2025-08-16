import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { useCart } from '../../../hook/cart/useCartQuery';
import { useSingleProductQuery } from '../../../hook/product/useSingleProductQuery';
import fallbackImage from '../../../assets/img/shop/image-4 (2).jpg';
import "./Cart.css";

// CartItem component with enhanced pricing and skeleton loading
const CartItem = ({ item, onRemove, onSelect, isSelected, onProductData }) => {
    const [imageError, setImageError] = useState(false);
    const { data: product, isLoading: productLoading, error: productError } = useSingleProductQuery(item.itemTagSno);

    // Calculate pricing with discount (15% markup for strikethrough effect)
    const calculatePricing = useCallback((currentPrice) => {
        const price = Number(currentPrice) || 0;
        const originalPrice = price * 1.15; // Add 15% for original price
        const discount = Math.round(((originalPrice - price) / originalPrice) * 100);

        return {
            current: price,
            original: originalPrice,
            discount: discount
        };
    }, []);

    useEffect(() => {
        if (productError) {
            console.error(`Failed to load product for ${item.itemTagSno}:`, productError);
            const pricing = calculatePricing(item.amount || 0);
            onProductData(item.sno, {
                itemId: item.itemId || null,
                tagNo: item.tagNo || null,
                productName: item.itemTagSno || 'Unknown Product',
                price: pricing.current,
                originalPrice: pricing.original,
                discount: pricing.discount,
                imagePath: fallbackImage,
                weight: item.netWt || null,
                purity: item.purity || null,
            });
        } else if (product) {
            let imageUrls = [];
            try {
                imageUrls = JSON.parse(product.ImagePath || "[]");
            } catch (err) {
                console.error("Error parsing ImagePath for item", item.itemTagSno, err);
            }
            const getPrice = (data) => {
                return Number(data?.GrandTotal) > 0
                    ? Number(data.GrandTotal)
                    : Number(data?.RATE || data?.amount || 0);
            };
            const pricing = calculatePricing(getPrice(product));

            onProductData(item.sno, {
                itemId: product.ITEMID || item.itemId || null,
                tagNo: product.TAGNO || item.tagNo || null,
                productName: [product.ITEMNAME, product.SUBITEMNAME].filter(Boolean).join(' - ') || item.itemTagSno || 'Unknown Product',
                price: pricing.current,
                originalPrice: pricing.original,
                discount: pricing.discount,
                imagePath: imageUrls.length > 0 ? `https://app.bmgjewellers.com${imageUrls[0]}` : fallbackImage,
                weight: product.NETWT || item.netWt || null,
                purity: product.PURITY || item.purity || null,
            });
        }
    }, [product, productError, item, onProductData, calculatePricing]);

    let imageUrls = [];
    try {
        imageUrls = JSON.parse(product?.ImagePath || "[]");
    } catch (err) {
        console.error("Error parsing ImagePath for item", item.itemTagSno, err);
    }
    const baseUrl = "https://app.bmgjewellers.com";
    const firstImage = imageUrls.length > 0 ? baseUrl + imageUrls[0] : fallbackImage;

   
    const getPrice = (data) => {
        return Number(data?.GrandTotal) > 0
            ? Number(data.GrandTotal)
            : Number(data?.RATE || data?.amount || 0);
    };

  
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
                    <div className="cart-item-image-loading skeleton"></div>
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
                        <div className="cart-item-title-loading skeleton"></div>
                        <div className="cart-item-sku-loading skeleton"></div>
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
                    {!productLoading && (
                        <>
                          
                            <div className="price-current">
                                <span className="price-label">Price</span> : ₹
                                {getPrice(product).toFixed(2)}
                            </div>
                           
                        </>
                    )}
                </div>

                {!productLoading && (
                    <div className="cart-item-specs">
                        {(product?.NETWT || item.netWt) && (
                            <div className="cart-item-spec">
                                <span className="spec-label">Weight:</span>
                                <span className="spec-value">{product?.NETWT || item.netWt}g</span>
                            </div>
                        )}
                        {(product?.PURITY || item.purity) && (
                            <div className="cart-item-spec">
                                <span className="spec-label">Purity:</span>
                                <span className="spec-value">{product?.PURITY || item.purity}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <button
                className="cart-item-remove"
                title="Remove item"
                onClick={() => onRemove(item.sno)}
                aria-label="Remove item"
                disabled={productLoading}
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

// Enhanced Cart component
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

    const { subtotal, originalSubtotal, totalSavings, shipping, total, isDataComplete } = useMemo(() => {
        const defaultTotals = {
            subtotal: 0,
            originalSubtotal: 0,
            totalSavings: 0,
            shipping: 0,
            total: 0,
            isDataComplete: false
        };
        if (items.length === 0) return defaultTotals;

        const selectedItemsData = items.filter((item) => selectedItems.includes(item.sno));

        const subtotal = selectedItemsData.reduce((sum, item) => {
            const product = productDataMap[item.sno];
            const price = product?.price || item.amount || 0;
            return sum + Number(price);
        }, 0);

        const originalSubtotal = selectedItemsData.reduce((sum, item) => {
            const product = productDataMap[item.sno];
            const originalPrice = product?.originalPrice || (product?.price || item.amount || 0) * 1.15;
            return sum + Number(originalPrice);
        }, 0);

        const totalSavings = originalSubtotal - subtotal;
        const isDataComplete = selectedItems.every((sno) => !!productDataMap[sno]);

        return {
            subtotal,
            originalSubtotal,
            totalSavings,
            shipping: 0,
            total: subtotal,
            isDataComplete
        };
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
                originalPrice: productDataMap[item.sno]?.originalPrice || 0,
                imagePath: productDataMap[item.sno]?.imagePath || fallbackImage,
                weight: productDataMap[item.sno]?.weight || null,
                purity: productDataMap[item.sno]?.purity || null,
            }));

        const checkoutPayload = {
            items: selectedCartItems,
            totalAmount: total,
            originalAmount: originalSubtotal,
            totalSavings: totalSavings,
        };

        console.log('Navigating with payload:', checkoutPayload);
        history.push('/checkout', checkoutPayload);
    }, [selectedItems, isDataComplete, items, productDataMap, total, originalSubtotal, totalSavings, history]);

    if (isLoading && !cartItems) {
        return (
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="col-12">
                        <div className="cart-loading">
                            <div className="loading-spinner"></div>
                            <p>Loading your cart...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6">
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
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <main className="cart-container">
                <div className="cart-header">
                    <h1>Your Shopping Cart</h1>
                    <div className="cart-item-count">
                        {items.length} {items.length === 1 ? 'Item' : 'Items'}
                    </div>
                </div>

                {items.length === 0 ? (
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-8 col-lg-6">
                            <div className="empty-cart">
                                <div className="empty-cart-icon">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h2>Your cart is empty</h2>
                                <p>Discover our amazing jewelry collection</p>
                                <Link to="/shop-left" className="btn-primary">
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="cart-content">
                        <div className="cart-items-section">
                            {/* Select All Controls */}
                            <div className="d-flex align-items-center justify-center ">
                                
                                <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                                    {selectedItems.length} out of {items.length} selected
                                </span>
                            </div>

                            {/* Cart Items */}
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
                                            <span>Items ({selectedItems.length})</span>
                                           
                                        </div>
                                     
                                        <div className="summary-row">
                                            <span>Subtotal</span>
                                            <span>₹{subtotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                                        </div>
                                        <div className="summary-row">
                                            <span>Shipping</span>
                                            <span className="free-shipping">Free</span>
                                        </div>
                                        <div className="summary-divider"></div>
                                        <div className="summary-row total-row">
                                            <span>Total</span>
                                            <span className="total-amount">
                                                ₹{total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                            </span>
                                        </div>
                                    
                                    </>
                                ) : (
                                    <div className="summary-loading">
                                        <div className="skeleton" style={{ height: '20px', marginBottom: '10px' }}></div>
                                        <div className="skeleton" style={{ height: '20px', marginBottom: '10px' }}></div>
                                        <div className="skeleton" style={{ height: '20px', marginBottom: '10px' }}></div>
                                        <p>Loading order summary...</p>
                                    </div>
                                )}

                                <button
                                    className="main-btn btn-filled w-100 mt-3"
                                    onClick={handleOnCheckout}
                                    disabled={!isDataComplete || isRemoving || selectedItems.length === 0}
                                >
                                    {isRemoving ? 'Removing...' :
                                        selectedItems.length === 0 ? 'Select Items to Checkout' :
                                            'Proceed to Checkout'}
                                </button>

                                <div className="payment-methods">
                                    <p>Secure Payment Options:</p>
                                    <div className="payment-icons">
                                        <small className="text-muted">💳 Credit Card | 💰 UPI | 🏦 Net Banking</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default withRouter(Cart);