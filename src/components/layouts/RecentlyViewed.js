import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Heart, ShoppingCart, RefreshCw } from 'lucide-react';
import { useQueries } from '@tanstack/react-query';
import { useRecentlyViewed } from '../../hook/recentlyViewed/useRecentlyViewedQuery';
import { getProductBySno } from '../../service/ProductService';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { useFavorites, useAddFavorite, useRemoveFavorite } from '../../hook/favorites/useFavoritesQuery';
import { useCart } from '../../hook/cart/useCartQuery';
import { toast } from 'react-toastify';

const ProductCard = ({ item, isMain }) => {
    const { data: favorites, isLoading: isFavoritesLoading } = useFavorites();
    const addFavorite = useAddFavorite();
    const removeFavorite = useRemoveFavorite();
    const { cartItems, addToCartHandler } = useCart();
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const navigate = useHistory();
    const location = useLocation();
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [heartAnimation, setHeartAnimation] = useState(false);
    const [cartAnimation, setCartAnimation] = useState(false);
    const [loadingState, setLoadingState] = useState(true);

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
    const mainImage = productImages[0];
    const productName = (item?.SUBITEMNAME || item?.ITEMNAME || 'Jewelry Item').toLowerCase();
    const currentPrice = item?.GrandTotal ? parseFloat(item.GrandTotal) : 0;
    const oldPrice = item?.GrossAmount ? parseFloat(item.GrossAmount) : currentPrice;
    const hasDiscount = oldPrice > currentPrice;
    const discountValue = hasDiscount ? Math.round((1 - currentPrice / oldPrice) * 100) : 0;

    useEffect(() => {
        if (!isFavoritesLoading && favorites?.data && item?.SNO) {
            setIsWishlisted(favorites.data.includes(item.SNO));
        }
    }, [favorites, item?.SNO, isFavoritesLoading]);

    const addItemToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) {
            toast.info('🔐 Please log in to add items to your cart.');
            navigate.push('/login', { state: { from: location.pathname } });
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
            toast.info('🔐 Please log in to add items to your favorites.');
            navigate.push('/login', { state: { from: location.pathname } });
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
        navigate.push(`/shop-detail/${item?.SNO}`);
    };

    const isInCart = Array.isArray(cartItems?.data) && cartItems.data.some(cartItem => cartItem.itemTagSno === item?.SNO);

    if (loadingState || !item) {
        return (
            <div className="product-card">
                <div className="product-card__inner product-card--loading">
                    <div className="product-card__image-container">
                        <div className="jewel-carousel__skeleton"></div>
                    </div>
                    <div className="product-card__info">
                        <div className="jewel-carousel__skeleton jewel-carousel__skeleton--title"></div>
                        <div className="jewel-carousel__skeleton jewel-carousel__skeleton--price"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`product-card ${isMain ? 'main-product' : ''}`}>
            <div className="product-card__inner" onClick={clickProduct}>
                <div className="product-card__image-container">
                    <img
                        src={mainImage}
                        alt={productName}
                        className="product-card__image"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/fallback-image.jpg';
                        }}
                    />
                    {hasDiscount && (
                        <span className="product-card__discount">
                            -{discountValue}%
                        </span>
                    )}
                    <div className="product-card__actions">
                        <button
                            className="product-card__action product-card__action--refresh"
                            onClick={refreshProduct}
                            aria-label="Refresh Product"
                            title="Refresh"
                        >
                            <RefreshCw size={16} />
                        </button>
                        <button
                            className={`product-card__action product-card__action--cart ${cartAnimation ? 'cart-animate' : ''}`}
                            onClick={addItemToCart}
                            aria-label="Add to Cart"
                            title="Add to Cart"
                        >
                            <ShoppingCart size={16} />
                            <span className="product-card__action-text">{isInCart ? 'In Cart' : 'Add'}</span>
                        </button>
                        <button
                            className={`product-card__action product-card__action--wishlist ${heartAnimation ? 'heart-animate' : ''}`}
                            onClick={toggleWishlist}
                            aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        >
                            <Heart
                                size={16}
                                fill={isWishlisted ? '#dc3545' : 'none'}
                                color={isWishlisted ? '#dc3545' : 'currentColor'}
                            />
                        </button>
                    </div>
                </div>
                <div className="product-card__info">
                    <h3 className="product-card__name">{productName}</h3>
                    <div className="product-card__price">
                        <span className="product-card__current-price">
                            ₹{currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                        {hasDiscount && (
                            <span className="product-card__old-price">
                                ₹{oldPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProductCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(1);
    const [isAnimating, setIsAnimating] = useState(false);
    const animationRef = useRef(null);
    const navigate = useHistory();
    const { data: recentlyViewedData, isLoading: isSnoLoading, isError: isSnoError, error: snoError } = useRecentlyViewed();
    const snoArray = recentlyViewedData?.data || [];

    const productQueries = useQueries({
        queries: snoArray.map((sno) => ({
            queryKey: ['singleProduct', sno],
            queryFn: () => getProductBySno(sno),
            enabled: !!sno,
            staleTime: 1000 * 60 * 5,
        })),
    });

    const products = productQueries
        .filter((q) => q.isSuccess && q.data)
        .map((q) => q.data);

    const getLoopedProducts = () => {
        if (products.length === 0) return [];
        if (products.length === 1) return [products[0], products[0], products[0]];
        if (products.length === 2) return [...products, ...products, products[0]];
        return [...products.slice(-1), ...products, ...products.slice(0, 1)];
    };

    const loopedProducts = getLoopedProducts();

    const handlePrevious = () => {
        if (isAnimating || products.length === 0) return;
        setIsAnimating(true);
        if (animationRef.current) clearTimeout(animationRef.current);
        const newIndex = currentIndex === 0 ? loopedProducts.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
        animationRef.current = setTimeout(() => {
            if (products.length > 2 && newIndex === 0) {
                setCurrentIndex(products.length);
                setIsAnimating(false);
            } else {
                setIsAnimating(false);
            }
        }, 400);
    };

    const handleNext = () => {
        if (isAnimating || products.length === 0) return;
        setIsAnimating(true);
        if (animationRef.current) clearTimeout(animationRef.current);
        const newIndex = currentIndex === loopedProducts.length - 1 ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
        animationRef.current = setTimeout(() => {
            if (products.length > 2 && newIndex === loopedProducts.length - 1) {
                setCurrentIndex(1);
                setIsAnimating(false);
            } else {
                setIsAnimating(false);
            }
        }, 400);
    };

    const getVisibleProducts = () => {
        if (loopedProducts.length === 0) return [];
        const visible = [];
        for (let i = -1; i <= 1; i++) {
            const index = currentIndex + i;
            if (index >= 0 && index < loopedProducts.length) {
                visible.push({
                    ...loopedProducts[index],
                    position: i,
                    displayIndex: index,
                });
            }
        }
        return visible;
    };

    useEffect(() => {
        return () => {
            if (animationRef.current) clearTimeout(animationRef.current);
        };
    }, []);

    useEffect(() => {
        if (products.length > 0 && currentIndex === 1 && loopedProducts.length > 2) {
            setCurrentIndex(1);
        }
    }, [products.length]);

    if (isSnoError) {
        return (
            <section className="jewel-carousel">
                <div className="jewel-carousel__container">
                    <p className="jewel-carousel__error">{snoError.message || 'Failed to load recently viewed products'}</p>
                </div>
            </section>
        );
    }

    if (isSnoLoading) {
        return (
            <section className="jewel-carousel">
                <div className="jewel-carousel__container">
                    <div className="jewel-carousel__header">
                        <span className="jewel-carousel__subtitle">Recently</span>
                        <h2 className="jewel-carousel__title">Viewed Products</h2>
                    </div>
                    <div className="jewel-carousel__content">
                        <div className="jewel-carousel__grid-wrapper">
                            <div className="jewel-carousel__grid">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div
                                        key={`skeleton-${i}`}
                                        className={`jewel-carousel__item ${i === 1 ? 'main-product' : ''}`}
                                    >
                                        <ProductCard item={null} isMain={i === 1} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (products.length === 0) {
        return (
            <section className="jewel-carousel">
                <div className="jewel-carousel__container">
                    <div className="jewel-carousel__header">
                        <span className="jewel-carousel__subtitle">Recently</span>
                        <h2 className="jewel-carousel__title">Viewed Products</h2>
                    </div>
                    <div className="jewel-carousel__content">
                        <div className="jewel-carousel__grid-wrapper">
                            <div className="jewel-carousel__empty">
                                <p>No recently viewed products.</p>
                                <button
                                    className="jewel-carousel__cta"
                                    onClick={() => navigate.push('/shop')}
                                    aria-label="Browse Products"
                                >
                                    Browse Products
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="jewel-carousel">
            <div className="jewel-carousel__container">
                <div className="jewel-carousel__header">
                    <span className="jewel-carousel__subtitle">Recently</span>
                    <h2 className="jewel-carousel__title">Viewed Products</h2>
                </div>
                <div className="jewel-carousel__content">
                    <button
                        className="jewel-carousel__nav jewel-carousel__nav--prev"
                        onClick={handlePrevious}
                        disabled={isAnimating}
                        aria-label="Previous products"
                    >
                        <div className="jewel-carousel__nav-content">
                            <ChevronLeft size={24} />
                            <div className="jewel-carousel__nav-glow"></div>
                        </div>
                    </button>
                    <div className="jewel-carousel__grid-wrapper">
                        <div className="jewel-carousel__grid">
                            {getVisibleProducts().map((product, index) => (
                                <div
                                    key={`${product.SNO}-${product.displayIndex}-${index}`}
                                    data-position={product.position}
                                    className={`jewel-carousel__item ${product.position === 0 ? 'main-product' : 'side-product'} ${isAnimating ? 'is-animating' : ''}`}
                                >

                                    <ProductCard item={product} isMain={product.position === 0} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        className="jewel-carousel__nav jewel-carousel__nav--next"
                        onClick={handleNext}
                        disabled={isAnimating}
                        aria-label="Next products"
                    >
                        <div className="jewel-carousel__nav-content">
                            <ChevronRight size={24} />
                            <div className="jewel-carousel__nav-glow"></div>
                        </div>
                    </button>
                </div>
            </div>
            <style >{`
                @import url('https://fonts.googleapis.com/css2?family=Gloock&family=Montserrat:wght@100;300;400;600;700&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap');

                :root {
                    --jewel-font-primary: 'Gloock', serif;
                    --jewel-font-secondary: 'Montserrat', sans-serif;
                    --jewel-color-bg: #f6f5f0;
                    --jewel-color-text: #404040;

                    --jewel-color-card: #dadadaff;
                    --jewel-colors-card: #f6f5f0;
                    --jewel-color-accent: #d4a373;
                    --jewel-color-accent-dark: #b5895a;
                    --jewel-color-white: #ffffff;
                    --jewel-color-success: #404040;
                    --jewel-color-grey: #8b8b8b;
                    --jewel-shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.08);
                    --jewel-shadow-md: 0 6px 12px rgba(0, 0, 0, 0.1);
                    --jewel-shadow-lg: 0 12px 24px rgba(0, 0, 0, 0.12);
                    --jewel-transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .jewel-carousel {
                    padding: 2rem 0;
                    background-color: var(--jewel-color-bg);
                    font-family: var(--jewel-font-secondary);
                    position: relative;
                    overflow: hidden;
                }

                .jewel-carousel__container {
                    max-width: 1600px;
                    margin: 0 auto;
                    padding: 0 2rem;
                }

                .jewel-carousel__header {
                    text-align: center;
                    margin-bottom: 3rem;
                }

                .jewel-carousel__subtitle {
                    display: block;
                    font-size: 1.2rem;
                    color: var(--jewel-color-text);
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 4px;
                    font-family: var(--jewel-font-primary);
                    margin-bottom: 0.75rem;
                }

                .jewel-carousel__title {
                    font-size: 2.5rem;
                    font-weight: 700;
                    background: linear-gradient(135deg, #e76f2a, #4a2c0d);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    font-family: 'Dancing Script';
                    position: relative;
                    display: inline-block;
                }

                .jewel-carousel__title::after {
                    content: '';
                    position: absolute;
                    bottom: -12px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 60px;
                    height: 3px;
                    background-color: var(--jewel-color-accent);
                }

                .jewel-carousel__content {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 1rem;
                    position: relative;
                }

                .jewel-carousel__grid-wrapper {
                    flex: 1
                }

                .jewel-carousel__grid {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0rem ;
                    padding: 1rem 0;
                    width: 100%;
                    max-width: 1400px;
                }

                .jewel-carousel__item {
                    flex-shrink: 0;
                    width: 220px;
                    min-width: 220px;
                    transition: var(--jewel-transition);
                }

                .jewel-carousel__item.main-product {
                    width: 380px;
                    min-width: 380px;
                    z-index: 2;
                }

                .jewel-carousel__nav {
                    position: relative;
                    width: 60px;
                    height: 60px;
                    background: var(--jewel-color-white);
                    border-radius: 50%;
                    border: 2px solid rgba(212, 163, 115, 0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: var(--jewel-shadow-md);
                    cursor: pointer;
                    transition: var(--jewel-transition);
                    z-index: 3;
                }

                .jewel-carousel__nav:hover:not(:disabled) {
                    background: linear-gradient(135deg, var(--jewel-color-accent), var(--jewel-color-accent-dark));
                    color: var(--jewel-color-white);
                    transform: scale(1.15);
                    box-shadow: var(--jewel-shadow-lg);
                }

                .jewel-carousel__nav:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .jewel-carousel__nav:focus {
                    outline: 2px solid var(--jewel-color-accent);
                    outline-offset: 2px;
                }

                .jewel-carousel__nav-content {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .jewel-carousel__nav-glow {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 0;
                    height: 0;
                    background: radial-gradient(circle, rgba(212, 163, 115, 0.4) 0%, transparent 70%);
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    transition: var(--jewel-transition);
                }

                .jewel-carousel__nav:hover .jewel-carousel__nav-glow {
                    width: 120px;
                    height: 120px;
                }

                .product-card {
                    width: 320px;
                    height: 420px;
                    background: var(--jewel-colors-card);
                    position: relative;
                    overflow: hidden;
                    animation: cardFadeIn 0.6s ease-out;
                    border-radius:0px
                }

                .product-card.main-product {
                    width: 420px;
                    height: 500px;
                    border-radius:0px;
                    
                }

                .product-card:hover {
                    transform: translateY(-10px);
                    box-shadow: var(--jewel-shadow-lg);
                }

                .product-card__inner {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    cursor: pointer;
                }

                .product-card__inner.product-card--loading {
                    pointer-events: none;
                }

                .product-card__image-container {
                    position: relative;
                    height: 100%;
                    overflow: hidden;
                    background: var(--jewel-color-card);
                }

                .product-card.main-product .product-card__image-container {
                    height: 100%;
                }

                .product-card__image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s ease;
                }

                .product-card:hover .product-card__image {
                    transform: scale(1.1);
                }

                .product-card__discount {
                    position: absolute;
                    top: 16px;
                    left: 16px;
                    background: linear-gradient(135deg, var(--jewel-color-accent), var(--jewel-color-accent-dark));
                    color: var(--jewel-color-white);
                    padding: 0.4rem 0.8rem;
                    border-radius: 8px;
                    font-size: 0.85rem;
                    font-weight: 700;
                    box-shadow: var(--jewel-shadow-sm);
                    z-index: 2;
                }

                .product-card__actions {
                    position: absolute;
                    bottom: 16px;
                    right: 16px;
                    display: flex;
                    gap: 0.75rem;
                    opacity: 0;
                    transform: translateY(15px);
                    transition: var(--jewel-transition);
                }

                .product-card:hover .product-card__actions {
                    opacity: 1;
                    transform: translateY(0);
                }

                .product-card__action {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(12px);
                    border: none;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: var(--jewel-transition);
                    box-shadow: var(--jewel-shadow-sm);
                }

                .product-card__action--cart {
                    padding: 0 0.75rem;
                    width: auto;
                    border-radius: 20px;
                }

                .product-card__action:hover {
                    background: var(--jewel-color-accent);
                    color: var(--jewel-color-white);
                    transform: scale(1.1);
                    box-shadow: var(--jewel-shadow-md);
                }

                .product-card__action:focus {
                    outline: 2px solid var(--jewel-color-accent);
                    outline-offset: 2px;
                }

                .product-card__action-text {
                    font-size: 0.75rem;
                    font-weight: 600;
                    margin-left: 0.3rem;
                    white-space: nowrap;
                }

                .heart-animate {
                    animation: heartPulse 0.6s ease-in-out;
                }

                .cart-animate {
                    animation: cartPop 0.6s ease-in-out;
                }

                @keyframes heartPulse {
                    0% { transform: scale(1); }
                    20% { transform: scale(1.4); }
                    40% { transform: scale(1.2); }
                    60% { transform: scale(1.3); }
                    100% { transform: scale(1); }
                }

                @keyframes cartPop {
                    0% { transform: scale(1) translateY(0); }
                    20% { transform: scale(1.2) translateY(-3px); }
                    40% { transform: scale(1.1) translateY(-2px); }
                    60% { transform: scale(1.15) translateY(-1px); }
                    100% { transform: scale(1) translateY(0); }
                }

                @keyframes cardFadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .product-card__info {
                    text-align: center;
                  padding: 0.5rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                 
                }

                .product-card.main-product .product-card__info {
                    padding: 0.5rem;
                }

                .product-card__name {
                    font-size: 1rem;
                    font-weight: 600;
                    text-transform: capitalize;
                    color: var(--jewel-color-text);
                    line-height: 1.4;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .product-card.main-product .product-card__name {
                    font-size: 1.25rem;
                    margin-bottom: 1rem;
                }

                .product-card__price {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 0.25rem;
                    flex-wrap: wrap;
                }

                .product-card__current-price {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: var(--jewel-color-success);
                }

                .product-card.main-product .product-card__current-price {
                    font-size: 1.3rem;
                }

                .product-card__old-price {
                    font-size: 0.9rem;
                    color: var(--jewel-color-grey);
                    text-decoration: line-through;
                }

                .jewel-carousel__skeleton {
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, var(--jewel-color-card) 25%, #f2f2f2 50%, var(--jewel-color-card) 75%);
                    background-size: 200% 100%;
                    border-radius: 8px;
                    animation: skeletonPulse 1.8s infinite ease-in-out;
                }

                .jewel-carousel__skeleton--title {
                    height: 18px;
                    width: 80%;
                    margin: 0 auto 0.5rem;
                }

                .jewel-carousel__skeleton--price {
                    height: 16px;
                    width: 60%;
                    margin: 0 auto;
                }

                @keyframes skeletonPulse {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }

                .jewel-carousel__empty {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 3.5rem 2.5rem;
                    text-align: center;
                    background: var(--jewel-color-card);
                    border-radius: 16px;
                    box-shadow: var(--jewel-shadow-sm);
                    margin: 2.5rem auto;
                    max-width: 600px;
                    animation: cardFadeIn 0.6s ease-out;
                }

                .jewel-carousel__empty p {
                    font-size: 1.2rem;
                    color: var(--jewel-color-text);
                    margin-bottom: 2rem;
                    font-weight: 500;
                    line-height: 1.5;
                }

                .jewel-carousel__cta {
                    background: linear-gradient(135deg, var(--jewel-color-accent), var(--jewel-color-accent-dark));
                    color: var(--jewel-color-white);
                    padding: 1rem 2.5rem;
                    border: none;
                    border-radius: 10px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: var(--jewel-transition);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .jewel-carousel__cta:hover {
                    transform: translateY(-4px);
                    box-shadow: var(--jewel-shadow-lg);
                    background: linear-gradient(135deg, var(--jewel-color-accent-dark), var(--jewel-color-accent));
                }

                .jewel-carousel__cta:focus {
                    outline: 2px solid var(--jewel-color-accent);
                    outline-offset: 2px;
                }

                .jewel-carousel__error {
                    text-align: center;
                    color: #dc3545;
                    font-size: 1.2rem;
                    padding: 2.5rem;
                    background: var(--jewel-color-card);
                    border-radius: 12px;
                    margin: 2.5rem auto;
                    box-shadow: var(--jewel-shadow-sm);
                    max-width: 600px;
                }
                    .jewel-carousel__item {
  transition: none;
  z-index: 1;
  opacity: 0.6;
  transform: translateX(0px) scale(0.75);
}

.jewel-carousel__item.main-product {
  z-index: 2;
  opacity: 1;
  transform: translateX(0px) scale(1);
}

/* Default (desktop) translate positions */
.jewel-carousel__item[data-position="-2"] {
  transform: translateX(-160px) scale(0.75);
}
.jewel-carousel__item[data-position="-1"] {
  transform: translateX(-80px) scale(0.75);
}
.jewel-carousel__item[data-position="1"] {
  transform: translateX(80px) scale(0.75);
}
.jewel-carousel__item[data-position="2"] {
  transform: translateX(160px) scale(0.75);
}

/* Animation transition */
.jewel-carousel__item.is-animating {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease;
}

                /* Responsive Design */
                 {
                    .jewel-carousel__container {
                        max-width: 1000px;
                    }

                    .jewel-carousel__grid {
                        max-width: 800px;
                    }

                    .jewel-carousel__item {
                        width: 200px;
                        min-width: 200px;
                    }

                    .jewel-carousel__item.main-product {
                        width: 320px;
                        min-width: 320px;
                    }

                    .product-card {
                        width: 200px;
                        height: 320px;
                    }

                    .product-card.main-product {
                        width: 320px;
                        height: 420px;
                    }
                          .jewel-carousel__item[data-position="-2"] {
    transform: translateX(-120px) scale(0.75);
  }
  .jewel-carousel__item[data-position="-1"] {
    transform: translateX(-60px) scale(0.75);
  }
  .jewel-carousel__item[data-position="1"] {
    transform: translateX(60px) scale(0.75);
  }
  .jewel-carousel__item[data-position="2"] {
    transform: translateX(120px) scale(0.75);
  }
                }

                @media (max-width: 768px) {
                    .jewel-carousel {
                        padding: 3rem 0;
                    }

                    .jewel-carousel__container {
                        padding: 0 1.5rem;
                    }

                    .jewel-carousel__title {
                        font-size: 2rem;
                    }

                    .jewel-carousel__content {
                        gap: 0.5rem;
                    }

                    .jewel-carousel__grid {
                        gap: 0.25rem;
                    }

                    .jewel-carousel__item {
                        width: 160px;
                        min-width: 160px;
                    }

                    .jewel-carousel__item.main-product {
                        width: 260px;
                        min-width: 260px;
                    }

                    .product-card {
                        width: 160px;
                        height: 280px;
                    }

                    .product-card.main-product {
                        width: 260px;
                        height: 360px;
                    }

                    .jewel-carousel__nav {
                        width: 48px;
                        height: 48px;
                    }

                    .product-card__name {
                        font-size: 0.9rem;
                    }

                    .product-card.main-product .product-card__name {
                        font-size: 1.1rem;
                    }

                    .product-card__current-price {
                        font-size: 1rem;
                    }

                    .product-card.main-product .product-card__current-price {
                        font-size: 1.15rem;
                    }

                    .product-card__action {
                        width: 36px;
                        height: 36px;
                    }

                    .product-card__action--cart {
                        padding: 0 0.6rem;
                    }

                    .product-card__action-text {
                        font-size: 0.7rem;
                    }
                          .jewel-carousel__item[data-position="-2"] {
    transform: translateX(-90px) scale(0.7);
  }
  .jewel-carousel__item[data-position="-1"] {
    transform: translateX(-45px) scale(0.7);
  }
  .jewel-carousel__item[data-position="1"] {
    transform: translateX(45px) scale(0.7);
  }
  .jewel-carousel__item[data-position="2"] {
    transform: translateX(90px) scale(0.7);
  }
                }

                @media (max-width: 480px) {
                    .jewel-carousel__content {
                        flex-direction: column;
                        gap: 0.5rem;
                    }

                    .jewel-carousel__nav {
                        margin: 0 0.75rem;
                    }

                    .jewel-carousel__grid-wrapper {
                        width: 100%;
                        overflow-x: auto;
                        -webkit-overflow-scrolling: touch;
                    }

                    .jewel-carousel__grid {
                        flex-wrap: nowrap;
                        scroll-snap-type: x mandatory;
                        padding: 1.25rem;
                        gap: 0.5rem;
                    }

                    .jewel-carousel__item {
                        scroll-snap-align: center;
                        width: 200px;
                        min-width: 200px;
                    }

                    .jewel-carousel__item.main-product {
                        width: 240px;
                        min-width: 240px;
                    }

                    .product-card {
                        width: 200px;
                        height: 300px;
                    }

                    .product-card.main-product {
                        width: 240px;
                        height: 340px;
                    }

                    .jewel-carousel__empty {
                        padding: 2.5rem 1.5rem;
                        margin: 1.5rem auto;
                    }

                    .jewel-carousel__cta {
                        padding: 0.75rem 1.75rem;
                        font-size: 0.95rem;
                    }
                        .jewel-carousel__item[data-position="-2"] {
    transform: translateX(-70px) scale(0.65);
  }
  .jewel-carousel__item[data-position="-1"] {
    transform: translateX(-35px) scale(0.65);
  }
  .jewel-carousel__item[data-position="1"] {
    transform: translateX(35px) scale(0.65);
  }
  .jewel-carousel__item[data-position="2"] {
    transform: translateX(70px) scale(0.65);
  }
                }
            `}</style>
        </section>
    );
};

export default ProductCarousel;