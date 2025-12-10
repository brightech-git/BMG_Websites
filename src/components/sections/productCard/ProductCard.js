import React, { useEffect, useState } from 'react';
import { Heart, RefreshCw } from 'lucide-react';
import { useFavorites, useAddFavorite, useRemoveFavorite } from '../../../hook/favorites/useFavoritesQuery';
import { useCart } from '../../../hook/cart/useCartQuery';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import fallbackImage from './fallback-image.jpg';
import UpdateMobileModal from '../../layouts/UpdateMobileModal';

const ProductCard = ({ item }) => {

    const { data: favorites, isFavoritesLoading } = useFavorites();
    const addFavorite = useAddFavorite();
    const removeFavorite = useRemoveFavorite();
    const { cartItems, addToCartHandler } = useCart();
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated)

    const mobileNumber = useSelector((state) => state.user.user?.contactNumber) || null;
    const history = useHistory();
    const location = useLocation();

    const [isWishlisted, setIsWishlisted] = useState(false);
    const [heartAnimation, setHeartAnimation] = useState(false);
    const [cartAnimation, setCartAnimation] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const [loadingState, setLoadingState] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setLoadingState(false), 500);
        return () => clearTimeout(timer);
    }, []);

    // Detect touch device
    useEffect(() => {
        const checkTouchDevice = () => {
            setIsTouchDevice(('ontouchstart' in window) || (navigator.maxTouchPoints > 0));
        };
        checkTouchDevice();
        window.addEventListener('resize', checkTouchDevice);
        return () => window.removeEventListener('resize', checkTouchDevice);
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

            return validImages;
        } catch (error) {
            console.error("Error parsing product images:", error);
            return [fallbackImage];
        }
    };

    const productImages = getProductImages();
    const hasMultipleImages = productImages.length > 1;
    const productName = (item?.SUBITEMNAME || item?.ITEMCTRNAME || 'Jewelry Item').toLowerCase();
    const currentPrice = parseFloat(item?.GrandTotal) > 0
        ? parseFloat(item.GrandTotal)
        : parseFloat(item?.RATE || 0);

    useEffect(() => {
        if (!isFavoritesLoading && favorites?.data && item?.SNO) {
            setIsWishlisted(favorites.data.includes(item.SNO));
        }
    }, [favorites, item?.SNO, isFavoritesLoading]);

    // Touch image navigation
    // const handleImageTouch = (e) => {
    //     e.preventDefault();
    //     e.stopPropagation();

    //     if (!hasMultipleImages) return;

    //     const nextIndex = (currentImageIndex + 1) % productImages.length;
    //     setCurrentImageIndex(nextIndex);
    // };

    // Mouse hover for desktop
    const handleMouseEnter = () => {
        if (!isTouchDevice && hasMultipleImages) {
            setCurrentImageIndex(1);
        }
    };

    const handleMouseLeave = () => {
        if (!isTouchDevice && hasMultipleImages) {
            setCurrentImageIndex(0);
        }
    };

    const addItemToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            toast.info('🔐 Please log in to add items to your cart.');
            history.push('/login', { from: location.pathname });
            return;
        }
        if (!mobileNumber) {
            setModalOpen(true);
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
            itemId: item.ITEMID,
            tagNo: item.TAGNO,
            grsWt: item.GRSWT,
            netWt: item.NETWT,
            stnWt: item?.STNWT || 0,
            amount: item.GrandTotal || item.RATE,
            stnAmount: item?.STNAMT || 0,
            itemCtrName: item.ITEMCTRNAME || item.SUBITEMNAME,
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



    const clickProduct = (e) => {
        //console.log('productcard triggered', ` ${item?.SNO}`)
        e.preventDefault();
        e.stopPropagation();
        window.location.href = `/products-page/${item?.SNO}`;
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
        <>
            <div className="card-container">
                <UpdateMobileModal open={modalOpen} onClose={() => setModalOpen(false)} />
                <div
                    className="product-item"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}

                >
                    <div className="image-wrapper" >
                        <div
                            className="image-container"
                            onClick={clickProduct}
                        >
                            {/* Main Image with smooth transition */}
                            <img
                                src={productImages[currentImageIndex]}
                                alt={productName}
                                className="product-image"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = fallbackImage;
                                }}
                            />
                            {/* Previous image for hover-out effect */}

                            {/* Image Indicator for multiple images */}
                            {/* {hasMultipleImages && (
                            <div className="image-indicator">
                                {productImages.map((_, index) => (
                                    <div
                                        key={index}
                                        className={`indicator-dot ${index === currentImageIndex ? 'active' : ''}`}
                                    />
                                ))}
                            </div>
                        )} */}



                        </div>

                        <div className="quick-actions">
                            {/* <button
                            className={`action-buttons add-cart-btn ${cartAnimation ? 'cart-animation' : ''}`}
                            onClick={addItemToCart}
                            aria-label="Add to Cart"
                            title="Add to Cart"
                        >
                            <span className="add-button-text">{isInCart ? 'In Cart' : 'Add to Cart'}</span>
                        </button> */}

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

                    <button className='product-addToCart' onClick={addItemToCart}>   {isInCart ? "In Cart" : "Add to Cart"} </button>

                </div>

                <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Poppins:wght@300;400;500;600&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Gloock&family=Montserrat:wght@100;300;400;600;700&display=swap');
                
                .card-container {
                    width: 100%;
                    max-width:400px;
                    margin: 0 auto;
                }

                .product-item {
                    position: relative;
                    background: transparent;
                    border-radius: 0px;
                    overflow: hidden;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    cursor: pointer;
                    border:none ;
                }

                .product-item:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
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
                    cursor: pointer;
                }

                .product-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: opacity 0.5s ease-in-out;
                    filter: brightness(1.02);
                }

                /* Image Indicator */
                .image-indicator {
                    position: absolute;
                    bottom: 8px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    gap: 6px;
                    : 10;
                    background: rgba(0, 0, 0, 0.5);
                    padding: 4px 8px;
                    border-radius: 12px;
                    backdrop-filter: blur(4px);
                }

                .indicator-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.6);
                    transition: all 0.3s ease;
                }

                .indicator-dot.active {
                    background: #ffffff;
                    transform: scale(1.2);
                }

                /* Touch Hint */
                .touch-hint {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    background: rgba(0, 0, 0, 0.7);
                    color: white;
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 0.7rem;
                    font-family: 'Montserrat', sans-serif;
                    : 10;
                    backdrop-filter: blur(4px);
                    animation: fadeInOut 3s ease-in-out infinite;
                }

                @keyframes fadeInOut {
                    0%, 100% { opacity: 0.7; }
                    50% { opacity: 1; }
                }

                .quick-actions {
                    position: absolute;
                    top: 6px;
                    right: -15px;
                    transform: translateX(-50%);
                    display: flex;
                    gap: 0px;
                    opacity: 0;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    : 10;
                }

                .product-item:hover .quick-actions {
                    opacity: 1;
                    transform: translateX(-50%) translateY(-5px);
                }

                /* Show actions on touch devices when image is tapped */
                .image-container:active ~ .quick-actions,
                .quick-actions:active {
                    opacity: 1;
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
                    background: #fff;
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
                    background: #fff;
                }

                .action-button:active {
                    transform: scale(0.95);
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
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.2); }
                }

                @keyframes cartBounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-4px); }
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
                     .product-addToCart {
  position: relative;
  width:100%;
  bottom:0px;
  left:50%;
  transform: translateX(-50%);
  padding: 5px 10px;
  font-size: 12px;
  background: var(--addtocart-product-color);
  color: var(--green-color);
  border: none;
  font-weight:bold;
  border-radius: 4px;

  opacity: 0;         /* hidden */
  pointer-events: none; /* not clickable when hidden */
  transition: opacity 0.3s ease;
}

/* Show on hover */
.product-item:hover .product-addToCart {
  opacity: 1;
  pointer-events: auto; /* enable interaction */
}

                /* Touch Device Optimizations */
                @media (hover: none) and (pointer: coarse) {
                    .product-item:hover {
                        transform: none;
                        box-shadow: none;
                    }
                    
                    .product-item:active {
                        transform: scale(0.98);
                    }
                    
                    .quick-actions {
                        opacity: 1;
                        transform: translateX(-50%) translateY(5px);
                    }
                    
                    .touch-hint {
                        display: block;
                    }
                    
                    /* Hide touch hint after first interaction */
                    .image-container:active ~ .touch-hint {
                        opacity: 0;
                        transition: opacity 0.3s ease;
                    }
                }

                /* Hide touch hint on desktop */
                @media (hover: hover) and (pointer: fine) {
                    .touch-hint {
                        display: none;
                    }
                }

                /* Mobile Optimizations */
                @media (max-width: 768px) {
                    .card-container {
                        max-width: 300px;
                    }
                    .add-button-text {
                        font-size: 12px !important;
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
                   
                    .touch-hint {
                        font-size: 0.65rem;
                        padding: 3px 6px;
                    }
                        .product-addToCart{
                      opacity: 1; 
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
                    .touch-hint {
                        font-size: 0.6rem;
                    padding: 2px 4px;
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
        </>
    );
};

export default ProductCard;