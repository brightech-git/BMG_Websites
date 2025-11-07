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
// Import your external CSS file
import './recently-viewed.css';

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
    const productName = (item?.SUBITEMNAME || item?.itemCtrName || 'Jewelry Item').toLowerCase();
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
        //console.log('Refresh product:', item?.SNO);
    };

    const clickProduct = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate.push(`/product-detail/${item?.SNO}`);
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
                                    onClick={() => navigate.push('/products-page')}
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
        </section>
    );
};

export default ProductCarousel;