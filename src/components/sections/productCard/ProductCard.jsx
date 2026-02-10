
import React, { useEffect, useState } from 'react';
import { Heart, RefreshCw } from 'lucide-react';
import { useFavorites, useAddFavorite, useRemoveFavorite } from '../../../hook/favorites/useFavoritesQuery';
import { useCart } from '../../../hook/cart/useCartQuery';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import fallbackImage from './fallback-image.jpg';
import UpdateMobileModal from '../../layouts/UpdateMobileModal';

const ProductCard = ({ item }) => {
    const { data: favorites, isFavoritesLoading } = useFavorites();

const favoriteItems = favorites?.data?.products;

    const addFavorite = useAddFavorite();
    const removeFavorite = useRemoveFavorite();
    const { cartItems, addToCartHandler ,isLoading } = useCart();

    const cartProducts = cartItems?.data?.products || [] ; 

    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const [isAnimating, setIsAnimating] = useState(false);
    const mobileNumber = useSelector((state) => state.user.user?.contactNumber) || null;
    const navigate = useNavigate();
    const location = useLocation();

    const pincode = localStorage.getItem('pinCode');
    const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

    const [isWishlisted, setIsWishlisted] = useState(false);
    const [heartAnimation, setHeartAnimation] = useState(false);
    const [cartAnimation, setCartAnimation] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const [loadingState, setLoadingState] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [hover, setHover] = useState(false);

    // Check if item is in wishlist
    useEffect(() => {
        if (!isFavoritesLoading && favoriteItems && item?.TAGKEY) {
            const isInWishlist = favoriteItems.some(product =>
                product.ItemTagSno === item.TAGKEY || product === item.TAGKEY
            );
            setIsWishlisted(isInWishlist);
        }
    }, [favorites, item?.TAGKEY, isFavoritesLoading]);

    useEffect(() => {
        const timer = setTimeout(() => setLoadingState(false), 500);
        return () => clearTimeout(timer);
    }, []);

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
    const defaultIndex = isMobile && hasMultipleImages ? 1 : 0;
    const [currentImageIndex, setCurrentImageIndex] = useState(defaultIndex);

    useEffect(() => {
        if (isMobile && hasMultipleImages) {
            setCurrentImageIndex(1);
        }
    }, [isMobile, hasMultipleImages]);

    const productName = (item?.SUBITEMNAME || item?.ITEMCTRNAME || 'Jewelry Item').toLowerCase();
    const currentPrice = parseFloat(item?.GrandTotal) > 0
        ? parseFloat(item.GrandTotal)
        : parseFloat(item?.RATE || 0);

    const handleMouseEnter = () => {
        if (!isTouchDevice && hasMultipleImages) {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentImageIndex(1);
                setIsAnimating(false);
            }, 250);
        }
    };

    const handleMouseLeave = () => {
        if (!isTouchDevice && hasMultipleImages) {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentImageIndex(0);
                setIsAnimating(false);
            }, 250);
        }
    };

    const addItemToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            toast.info('🔐 Please log in to add items to your cart.');
            navigate('/login', { state: { from: location.pathname } });
            return;
        }
        if (!mobileNumber) {
            setModalOpen(true);
            return;
        }

        if (!item?.TAGKEY) {
            console.warn('Missing item TAGKEY');
            return;
        }

        if (isInCart) {
            console.warn('Item already in cart');
            return;
        }

        const cartItem = {
            tagKey: item.TAGKEY,
            quantity: 1,
            shippingPincode: pincode || '360004'
        };

        addToCartHandler(cartItem);
        setCartAnimation(true);
        setTimeout(() => setCartAnimation(false), 600);
    };

    const toggleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            toast.info('🔐 Please log in to add items to your favorite.');
            navigate('/login', { state: { from: location.pathname } });
            return;
        }

        if (!item?.TAGKEY) return;

        setHeartAnimation(true);

        // Prepare the data object that your backend expects
        const wishlistData = {
            tagKey: item.TAGKEY,
            quantity:1
        };

        if (isWishlisted) {
            // Remove from wishlist
            removeFavorite.mutate(item.TAGKEY, {
                onSuccess: () => {
                    setIsWishlisted(false);
                    toast.info('💔 Removed from Wishlist', {
                        position: 'top-right',
                        autoClose: 2000,
                    });
                },
                onError: (error) => {
                    console.error('Remove wishlist error:', error);
                    toast.error('❌ Failed to remove from Wishlist', {
                        position: 'top-right',
                        autoClose: 2000,
                    });
                },
            });
        } else {
            // Add to wishlist - wrap data in { data: wishlistData } object
            addFavorite.mutate(wishlistData, {
                onSuccess: () => {
                    setIsWishlisted(true);
                    toast.success('❤️ Added to Wishlist!', {
                        position: 'top-right',
                        autoClose: 2000,
                    });
                },
                onError: (error) => {
                    console.error('Add wishlist error:', error);
                    toast.error('❌ Failed to add to Wishlist', {
                        position: 'top-right',
                        autoClose: 2000,
                    });
                },
            });
        }

        setTimeout(() => setHeartAnimation(false), 600);
    };

    const clickProduct = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/product-detail/${item?.TAGKEY}`);
    };

    // Check if item is in cart

    const isInCart = Array.isArray(cartProducts) &&
        cartProducts.some(cartItem => cartItem.ItemTagSno === item?.TAGKEY);

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
                    <div className="image-wrapper">
                        <div
                            className="image-container"
                            onClick={clickProduct}
                        >
                            <div
                                className="relative w-full h-full overflow-hidden"
                                onMouseEnter={() => !isTouchDevice && setHover(true)}
                                onMouseLeave={() => !isTouchDevice && setHover(false)}
                            >
                                {/* Image 1 */}
                                <img
                                    src={productImages[0]}
                                    alt={productName}
                                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ease-out
                                        ${isMobile
                                            ? "opacity-0 scale-100"
                                            : hover
                                                ? "opacity-0 scale-105"
                                                : "opacity-100 scale-100"
                                        }`}
                                    loading="eager"
                                    decoding="async"
                                />

                                {/* Image 2 */}
                                {hasMultipleImages && (
                                    <img
                                        src={productImages[1]}
                                        alt={productName}
                                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ease-out
                                            ${isMobile
                                                ? "opacity-100 scale-100"
                                                : hover
                                                    ? "opacity-100 scale-100"
                                                    : "opacity-0 scale-95"
                                            }`}
                                        loading="eager"
                                        decoding="async"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="quick-actions">
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
                                    className="transition-colors duration-200"
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

                    <button
                        className='product-addToCart'
                        onClick={addItemToCart}
                    >
                        {isInCart ? "In Cart" : "Add to Cart"}
                    </button>
                </div>

                <style>{`

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
                    border-radius: 18px;
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
                    font-family: 'Lato', sans-serif;
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
                    .flip {
  transform-style: preserve-3d;
}

.front {
  backface-visibility: hidden;
}

.back {
  transform: rotateY(180deg);
  backface-visibility: hidden;
}

.flip-hover {
  transform: rotateY(180deg);
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
                    font-family: 'Lato', sans-serif;
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
                    font-family: 'Lato', sans-serif;
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
 background: linear-gradient(135deg, pink 80%, pink 70%);
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
                        img {
    transition-duration: 200ms;
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