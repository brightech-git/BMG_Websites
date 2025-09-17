import React, { useEffect, useState } from 'react';
import { Heart, RefreshCw } from 'lucide-react';
import { useFavorites, useAddFavorite, useRemoveFavorite } from '../../../hook/favorites/useFavoritesQuery';
import { useCart } from '../../../hook/cart/useCartQuery';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import fallbackImage from './fallback-image.jpg'

const ProductCard = ({ item }) => {
    const { data: favorites, isFavoritesLoading } = useFavorites();
    const addFavorite = useAddFavorite();
    const removeFavorite = useRemoveFavorite();
    const { cartItems, addToCartHandler } = useCart();
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const history = useHistory();
    const location = useLocation();

    const [isWishlisted, setIsWishlisted] = useState(false);
    const [heartAnimation, setHeartAnimation] = useState(false);
    const [cartAnimation, setCartAnimation] = useState(false);
    const [showSecondImage, setShowSecondImage] = useState(false);
    const [hoverState, setHoverState] = useState(false);
    const [isTouchActive, setIsTouchActive] = useState(false);
    const [loadingState, setLoadingState] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoadingState(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const getProductImages = () => {
        try {
            const imageData = item?.ImagePath;
            if (!imageData) return [fallbackImage];

            const parsedImages =
                typeof imageData === "string" ? JSON.parse(imageData) : imageData;

            if (!Array.isArray(parsedImages)) return [fallbackImage];

            const validImages =
                parsedImages.length > 0
                    ? parsedImages.map((img) =>
                        img.startsWith("http")
                            ? img
                            : `https://app.bmgjewellers.com${img}`
                    )
                    : [fallbackImage];

            // Only return first 2 images
            return validImages.slice(0, 2);
        } catch (error) {
            console.error("Error parsing product images:", error);
            return [fallbackImage];
        }
    };


    const productImages = getProductImages();
    const hasMultipleImages = productImages.length > 1;
    const productName = (item?.SUBITEMNAME || item?.ITEMNAME || 'Jewelry Item').toLowerCase();
    const currentPrice = parseFloat(item?.GrandTotal) > 0
        ? parseFloat(item.GrandTotal)
        : parseFloat(item?.RATE || 0);

    useEffect(() => {
        if (!isFavoritesLoading && favorites?.data && item?.SNO) {
            setIsWishlisted(favorites.data.includes(item.SNO));
        }
    }, [favorites, item?.SNO, isFavoritesLoading]);

    // Handle door animation timing
    useEffect(() => {
        let hoverTimer;

        if ((hoverState || isTouchActive) && hasMultipleImages) {
            hoverTimer = setTimeout(() => {
                setShowSecondImage(true);
            }, 100); // Faster trigger for smoother animation
        } else if (!(hoverState || isTouchActive) && hasMultipleImages) {
            setShowSecondImage(false);
        }

        return () => {
            if (hoverTimer) clearTimeout(hoverTimer);
        };
    }, [hoverState, isTouchActive, hasMultipleImages]);

    const addItemToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            toast.info('🔐 Please log in to add items to your cart.');
            history.push('/login', { from: location.pathname });
            return;
        }

        if (!item?.SNO) {
            console.warn('Missing item SNO');
            return;
        }

        if (isInCart) {
            console.warn('Item already in cart');
            return;
        }

        const cartItem = {
            itemSno: item.SNO,
            itemTagSno: item.SNO,
            itemName: item.ITEMNAME || item.SUBITEMNAME,
            price: item.GrandTotal,
            image: productImages[0],
        };

        addToCartHandler(cartItem);
        setCartAnimation(true);
        toast.success('🛒 Item added to cart!');
        setTimeout(() => setCartAnimation(false), 600);
    };

    const toggleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            toast.info('🔐 Please log in to add items to your favorite.');
            history.push('/login', { from: location.pathname });
            return;
        }

        if (!item?.SNO) return;

        setHeartAnimation(true);

        if (isWishlisted) {
            removeFavorite.mutate(item.SNO, {
                onSuccess: () => {
                    toast.info('💔 Removed from Wishlist', {
                        position: 'top-right',
                        autoClose: 2000,
                    });
                },
                onError: () => {
                    toast.error('❌ Failed to remove from Wishlist', {
                        position: 'top-right',
                        autoClose: 2000,
                    });
                },
            });
        } else {
            addFavorite.mutate(item.SNO, {
                onSuccess: () => {
                    toast.success('❤️ Added to Wishlist!', {
                        position: 'top-right',
                        autoClose: 2000,
                    });
                },
                onError: () => {
                    toast.error('❌ Failed to add to Wishlist', {
                        position: 'top-right',
                        autoClose: 2000,
                    });
                },
            });
        }

        setIsWishlisted(!isWishlisted);
        setTimeout(() => setHeartAnimation(false), 600);
    };

    const refreshProduct = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Refresh product:', item?.SNO);
    };

    const clickProduct = (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = `/shop-detail/${item?.SNO}`;
    };

    const handleTouchToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsTouchActive((prev) => !prev);
    };

    const isInCart = Array.isArray(cartItems?.data) &&
        cartItems.data.some(cartItem => cartItem.itemTagSno === item?.SNO);

    if (loadingState || !item) {
        return (
            <div className="card-container">
                <div className="product-item loading">
                    <div className="image-wrapper">
                        <div className="placeholder placeholder-wave" style={{ width: '100%', height: '100%' }}></div>
                    </div>
                    <div className="item-info">
                        <div className="placeholder placeholder-wave mb-2" style={{ height: '16px', width: '75%', margin: '0 auto' }}></div>
                        <div className="placeholder placeholder-wave" style={{ height: '18px', width: '50%', margin: '0 auto' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card-container">
            <div
                className="product-item"
                onMouseEnter={() => setHoverState(true)}
                onMouseLeave={() => setHoverState(false)}
                onClick={clickProduct}
                onTouchStart={handleTouchToggle}
            >
                <div className="image-wrapper">
                    <div className="image-container">
                        {/* Main Image (Always visible, splits on hover) */}
                        <img
                            src={productImages[0]}
                            alt={productName}
                            className="main-image"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/fallback-image.jpg';
                            }}
                        />

                        {/* Door Animation Container (Only active on hover) */}
                        {hasMultipleImages && (
                            <div className={`door-container ${showSecondImage ? 'doors-open' : 'doors-closed'}`}>
                                {/* Left Door (Left Half of First Image) */}
                                <div className="door left-door">
                                    <img
                                        src={productImages[0]}
                                        alt={productName}
                                        className="door-image left-image"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/fallback-image.jpg';
                                        }}
                                    />
                                </div>

                                {/* Right Door (Right Half of First Image) */}
                                <div className="door right-door">
                                    <img
                                        src={productImages[0]}
                                        alt={productName}
                                        className="door-image right-image"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/fallback-image.jpg';
                                        }}
                                    />
                                </div>

                                {/* Second Image (Behind doors) */}
                                <div className="background-image">
                                    <img
                                        src={productImages[1]}
                                        alt={productName}
                                        className="second-image"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = productImages[0];
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                   
                    </div>

                    <div className={`quick-actions ${hoverState || isTouchActive ? 'show-actions' : ''}`}>
                        {/* <button
                            className="action-button exchange-btn"
                            onClick={refreshProduct}
                            aria-label="Exchange Product"
                            title="Exchange"
                        >
                            <RefreshCw size={14} />
                        </button> */}

                        <button
                            className={`action-buttons add-cart-btn ${cartAnimation ? 'cart-animation' : ''}`}
                            onClick={addItemToCart}
                            aria-label="Add to Cart"
                            title="Add to Cart"
                        >
                            <span className="add-button-text">{isInCart ? 'In Cart' : 'Add to Cart'}</span>
                        </button>

                        <button
                            className={`action-button wish-btn ${heartAnimation ? 'heart-animation' : ''}`}
                            onClick={toggleWishlist}
                            aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        >
                            <Heart
                                size={14}
                                fill={isWishlisted ? '#dc3545' : 'none'}
                                color={isWishlisted ? '#dc3545' : 'currentColor'}
                            />
                        </button>
                    </div>
                </div>

                <div className="item-info">
                    <h3 className="item-name">{productName}</h3>
                    <div className="price-section">
                        <span className="new-price">
                            ₹{currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Poppins:wght@300;400;500;600&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Gloock&family=Montserrat:wght@100;300;400;600;700&display=swap');
                
                .card-container {
                    width: 100%;
                    max-width: 320px;
                    margin: 0 auto;
                }

                .product-item {
                    position: relative;
                    background: transparent;
                    border-radius: 0px;
                    overflow: hidden;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    cursor: pointer;
                    border: 1px solid #ebebebff;
                }


                .product-item.loading {
                    animation: pulse 1.5s ease-in-out infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.8; }
                }

                .image-wrapper {
                    position: relative;
                    width: 100%;
                    aspect-ratio: 1;
                    overflow: hidden;
                }

                .image-container {
                    position: relative;
                    width: 100%;
                    height: 100%;
                }

                /* Main Image (Default state) */
                .main-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    filter: brightness(1.02);
                    transition: all 0.3s ease;
                }

                /* Door Animation Styles */
                .door-container {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    opacity: 0;
                    transition: opacity 0.2s ease;
                }

                .doors-open {
                    opacity: 1;
                }

                .background-image {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 1;
                }

                .second-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    filter: brightness(1.05);
                }

                .door {
                    position: absolute;
                    top: 0;
                    width: 50%;
                    height: 100%;
                    overflow: hidden;
                    z-index: 2;
                    transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }

                .left-door {
                    left: 0;
                    transform-origin: left center;
                }

                .right-door {
                    right: 0;
                    transform-origin: right center;
                }

                .door-image {
                    width: 200%; /* Double width to show full image */
                    height: 100%;
                    object-fit: cover;
                    filter: brightness(1.02);
                }

                .left-image {
                    object-position: left center;
                }

                .right-image {
                    object-position: right center;
                    transform: translateX(-50%); /* Shift to show right half */
                }

                /* Door States */
                .doors-closed .left-door {
                    transform: translateX(0);
                }

                .doors-closed .right-door {
                    transform: translateX(0);
                }

                .doors-open .left-door {
                    transform: translateX(-100%);
                }

                .doors-open .right-door {
                    transform: translateX(100%);
                }

               

                /* Image Indicator */
                .image-indicator {
                    position: absolute;
                    bottom: 8px;
                    right: 8px;
                    display: flex;
                    gap: 4px;
                    z-index: 10;
                }

                .indicator-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.6);
                    transition: all 0.3s ease;
                    backdrop-filter: blur(4px);
                }

                .indicator-dot.active {
                    background: #ffffff;
                    box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
                }

                .quick-actions {
                    position: absolute;
                    bottom: 12px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    gap: 8px;
                    opacity: 0;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    z-index: 10;
                }

                .show-actions {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }

                .action-button {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 36px;
                    height: 36px;
                    border: none;
                    color: #041f60;
                    border-radius: 18px;
                    padding: 0 10px;
                    background: #ffffff;
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    cursor: pointer;
                    touch-action: manipulation;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }

                .action-buttons {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 36px;
                    height: 36px;
                    border: none;
                    color: #041f60;
                    border-radius: 18px;
                    padding: 0 10px;
                    background: #f6f5f0;
                    cursor: pointer;
                    font-size: clamp(0.4rem, 1vw, 0.2rem) !important;
                    touch-action: manipulation;
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }

                .add-cart-btn {
                    color: #041f60;
                    font-family: 'Gloock', serif;
                    font-weight: bolder;
                    min-width: auto;
                    border: none !important;
                    padding: 0 12px;
                }

                .action-button:hover {
                    background: #ffffff;
                    color: #cd865c;
                    transform: translateY(-2px) scale(1.05);
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
                }

                .add-cart-btn:hover {
                    color: #cd865c;
                    background: #f6f5f0;
                }

                .action-button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }

                .wish-btn [fill="#dc3545"] {
                    color: #dc3545;
                }

                .heart-animation {
                    animation: heartPulse 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }

                .cart-animation {
                    animation: cartBounce 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }

                @keyframes heartPulse {
                    0%, 100% { transform: translateY(-2px) scale(1.05); }
                    50% { transform: translateY(-2px) scale(1.2); }
                }

                @keyframes cartBounce {
                    0%, 100% { transform: translateY(-2px) scale(1.05); }
                    50% { transform: translateY(-4px) scale(1.1); }
                }

                .button-text {
                    font-size: 1rem;
                    font-weight: 500;
                    white-space: nowrap;
                }

                .add-button-text {
                    font-size: 14px !important;
                    font-weight: bolder;
                    white-space: nowrap;
                }

                .item-info {
                    padding: 10px 8px;
                    text-align: center;
                    background: var(--primary-card-color);
                }

                .item-name {
                    font-family: 'Montserrat', sans-serif;
                    font-size: 1rem;
                    font-weight: 400;
                    color: #041f60;
                    margin: 0 auto;
                    text-transform: capitalize;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .price-section {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    flex-wrap: wrap;
                }

                .new-price {
                    font-family: 'Montserrat', sans-serif;
                    font-size: 0.9rem;
                    font-weight: 400;
                    color: #041f60;
                }

                /* Touch Device Optimizations */
                @media (hover: none) and (pointer: coarse) {
                    .quick-actions {
                        opacity: 0;
                        transform: translateX(-50%) translateY(10px);
                    }
                    .show-actions {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0);
                    }
                }

                /* Mobile Optimizations */
                @media (max-width: 768px) {
                    .card-container {
                        max-width: 260px;
                    }
                    .add-button-text {
                        font-size: 12px !important;
                    }
                    .product-item {
                        border-radius: 10px;
                    }
                    .item-info {
                        padding: 12px 8px;
                    }
                    .add-cart-btn {
                        padding: 0 10px;
                    }
                    .item-name {
                        font-size: 0.82rem;
                        margin-bottom: 6px;
                    }
                    .new-price {
                        font-size: 0.8rem;
                    }
                    .action-button {
                        min-width: 32px;
                        height: 32px;
                        padding: 0 8px;
                    }
                    .action-buttons {
                        min-width: 32px;
                        height: 32px;
                        padding: 0 8px;
                    }
                    .quick-actions {
                        bottom: 8px;
                        gap: 6px;
                    }
                }

                @media (max-width: 480px) {
                    .card-container {
                        max-width: 240px;
                    }
                    .add-button-text {
                        font-size: 10px !important;
                    }
                    .item-info {
                        padding: 10px 6px;
                    }
                    .item-name {
                        font-size: 0.75rem;
                        margin-bottom: 4px;
                    }
                    .new-price {
                        font-size: 0.7rem;
                    }
                    .action-button {
                        min-width: 26px;
                        height: 26px;
                        padding: 0 6px;
                    }
                    .action-buttons {
                        min-width: 26px;
                        height: 26px;
                        padding: 0 6px;
                    }
                    .add-cart-btn {
                        padding: 0 6px;
                    }
                }

                @media (max-width: 360px) {
                    .card-container {
                        max-width: 220px;
                    }
                    .add-button-text {
                        font-size: 10px !important;
                    }
                    .item-name {
                        font-size: 0.7rem;
                    }
                    .new-price {
                        font-size: 0.6rem;
                    }
                    .action-button {
                        min-width: 24px;
                        height: 24px;
                    }
                    .action-buttons {
                        min-width: 24px;
                        height: 24px;
                    }
                }
            `}</style>
        </div>
    );
};

export default ProductCard;