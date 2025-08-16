import React, { useEffect, useState } from 'react';
import { Heart, RefreshCw } from 'lucide-react';
import { useFavorites, useAddFavorite, useRemoveFavorite } from '../../../hook/favorites/useFavoritesQuery';
import { useCart } from '../../../hook/cart/useCartQuery';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

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
    const [imageIndex, setImageIndex] = useState(0);
    const [hoverState, setHoverState] = useState(false);
    const [isTouchActive, setIsTouchActive] = useState(false);
    const [loadingState, setLoadingState] = useState(true);
    const [imageFade, setImageFade] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setLoadingState(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const getProductImages = () => {
        try {
            const imageData = item?.ImagePath;
            if (!imageData) return ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop'];
            const parsedImages = typeof imageData === 'string' ? JSON.parse(imageData) : imageData;
            if (!Array.isArray(parsedImages)) return ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop'];
            return parsedImages.length > 0
                ? parsedImages.map(img => img.startsWith('http') ? img : `https://app.bmgjewellers.com${img}`)
                : ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop'];
        } catch (error) {
            console.error('Error parsing product images:', error);
            return ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop'];
        }
    };

    const productImages = getProductImages();
    const multipleImages = productImages.length > 1;
    const mainImage = productImages[imageIndex];
    const productName = (item?.SUBITEMNAME || item?.ITEMNAME || 'Jewelry Item').toLowerCase();


    const currentPrice = parseFloat(item?.GrandTotal) > 0
        ? parseFloat(item.GrandTotal)
        : parseFloat(item?.RATE || 0);

    const oldPrice = item?.GrossAmount ? parseFloat(item.GrossAmount) : currentPrice;
    const hasDiscount = oldPrice > currentPrice;
    const discountValue = hasDiscount ? Math.round((1 - currentPrice / oldPrice) * 100) : 0;

    useEffect(() => {
        if (!isFavoritesLoading && favorites?.data && item?.SNO) {
            setIsWishlisted(favorites.data.includes(item.SNO));
        }
    }, [favorites, item?.SNO, isFavoritesLoading]);

    useEffect(() => {
        let timer;
        if ((hoverState || isTouchActive) && multipleImages) {
            timer = setInterval(() => {
                setImageFade(true);
                setTimeout(() => {
                    setImageIndex((prev) => {
                        const next = (prev + 1) % productImages.length;
                        return next;
                    });
                    setImageFade(false);
                }, 300);
            }, 2500);
        }
        return () => {
            if (timer) clearInterval(timer);
            if (!(hoverState || isTouchActive) && multipleImages) {
                setImageFade(true);
                setTimeout(() => {
                    setImageIndex(0);
                    setImageFade(false);
                }, 300);
            }
        };
    }, [hoverState, isTouchActive, multipleImages, productImages.length]);

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

    const isInCart = Array.isArray(cartItems?.data) && cartItems.data.some(cartItem => cartItem.itemTagSno === item?.SNO);

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
                    <img
                        src={mainImage}
                        alt={productName}
                        className={`item-image ${imageFade ? 'hide-image' : 'show-image'}`}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/fallback-image.jpg';
                        }}
                    />

                    {hasDiscount && (
                        <span className="sale-tag">
                            -{discountValue}%
                        </span>
                    )}

                    <div className={`quick-actions ${hoverState || isTouchActive ? 'show-actions' : ''}`}>
                        <button
                            className="action-button exchange-btn"
                            onClick={refreshProduct}
                            aria-label="Exchange Product"
                            title="Exchange"
                        >
                            <RefreshCw size={14} />
                        </button>
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
            <style >{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Poppins:wght@300;400;500;600&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Gloock&family=Montserrat:wght@100;300;400;600;700&display=swap');
                .card-container {
                    width: 100%;
                    max-width: 300px;
                    margin: 0 auto;
                }

                .product-item {
                    position: relative;
                    background: transparent;
                    border-radius: 12px;
                    overflow: hidden;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    cursor: pointer;
                    border: 1px solid #ebebebff;
                }

                .product-item:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
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

                .item-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: opacity 0.3s ease, transform 0.6s ease;
                    filter: brightness(1.02);
                }

                .item-image.show-image {
                    opacity: 1;
                }

                .item-image.hide-image {
                    opacity: 0;
                }

                .product-item:hover .item-image {
                    transform: scale(1.08);
                    filter: brightness(1.05);
                }

                .sale-tag {
                    position: absolute;
                    top: 8px;
                    left: 8px;
                    background: linear-gradient(135deg, #dc3545, #c82333);
                    color: white;
                    padding: 4px 8px;
                    border-radius: 8px;
                    font-family: 'Inter', sans-serif;
                    font-size: 0.75rem;
                    font-weight: 600;
                    z-index: 4;
                    box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
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
                    z-index: 3;
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
                    color: #444;
                    border-radius: 18px;
                    padding: 0 10px;
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    cursor: pointer;
                    touch-action: manipulation; /* Prevent default touch behaviors like scrolling */
                }

                .action-buttons {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 36px;
                    height: 36px;
                    border: none;
                    color: #404040;
                    border-radius: 18px;
                    padding: 0 10px;
                    background: #f6f5f0;
                    cursor: pointer;
                    font-size: clamp(0.4rem, 1vw, 0.2rem) !important;
                    touch-action: manipulation;
                }

                .add-cart-btn {
                    color: #303030;
                    font-family: 'Gloock';
                    font-weight: bolder;
                    min-width: auto;
                    border: none !important;
                    padding: 0 12px;
                }

                .action-button:hover {
                    background: #ffffff;
                    transform: translateY(-2px) scale(1.05);
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
                }

                .add-cart-btn:hover {
                    color: #cd865c;
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
                    background: transparent;
                }

                .item-name {
                    font-family: 'Montserrat', sans-serif;
                    font-size: 0.95rem;
                    font-weight: 400;
                    color: #2d3748;
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
                    font-size: 1.1rem;
                    font-weight: 400;
                    color: #1a202c;
                }

                .old-price {
                    font-family: 'Montserrat', sans-serif;
                    font-size: 0.85rem;
                    font-weight: 400;
                    color: #a0aec0;
                    text-decoration: line-through;
                }

                .click-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 1;
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
                    .old-price {
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
                    .button-text {
                        font-size: 0.7rem;
                    }
                    .sale-tag {
                        font-size: 0.7rem;
                        padding: 3px 6px;
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
                    .old-price {
                        font-size: 0.75rem;
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
                    .button-text {
                        font-size: 0.65rem;
                    }
                    .sale-tag {
                        font-size: 0.65rem;
                        padding: 2px 5px;
                        top: 6px;
                        left: 6px;
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
                    .button-text {
                        font-size: 0.6rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default ProductCard;