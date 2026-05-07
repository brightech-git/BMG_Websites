import React, { useEffect, useState } from 'react';
import { Heart, ShoppingCart, Check, Loader2 } from 'lucide-react';
import { useFavorites } from '../../../hook/favorites/useFavoritesQuery';
import { useCart } from '../../../hook/cart/useCartQuery';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import fallbackImage from '../../../assets/icons/fallback.jpg';
import UpdateMobileModal from '../../layouts/UpdateMobileModal';
import { formatNumber } from '../../../utils/number/FormatNumber';

import "animate.css";

const ProductCard = ({ item }) => {


    const { isFavorite, addToFavorite, removeFavorite } = useFavorites();
    const { cartItems, addToCartHandler, isLoading: isCartLoading } = useCart();

    const cartProducts = cartItems?.data?.products || [];
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const [isAnimating, setIsAnimating] = useState(false);
    const mobileNumber = useSelector((state) => state.user.user?.contactNumber) || null;
    const navigate = useNavigate();
    const location = useLocation();

    const [heartAnimation, setHeartAnimation] = useState(false);
    const [cartAnimation, setCartAnimation] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const [loadingState, setLoadingState] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [hover, setHover] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    // Check if item is in wishlist
    const isWishlisted = isFavorite(item?.TAGKEY);

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
    const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
    const defaultIndex = isMobile && hasMultipleImages ? 1 : 0;
    const [currentImageIndex, setCurrentImageIndex] = useState(defaultIndex);

    useEffect(() => {
        if (isMobile && hasMultipleImages) {
            setCurrentImageIndex(1);
        }
    }, [isMobile, hasMultipleImages]);

    const productName = (item?.SUBITEMNAME || item?.ITEMCTRNAME || 'Jewelry Item').toLowerCase();

   
    const originalPrice = parseFloat(item?.GrandTotal) || 0;

    const currentPrice = parseFloat(item?.FinalAmount) > 0
        ? parseFloat(item.FinalAmount)
        : parseFloat(item?.GrandTotal || 0);

    const discountPercentage = item?.OfferPercentage
        ? parseFloat(item.OfferPercentage) : parseFloat((originalPrice - currentPrice) / 100);

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
            toast.error("Please login to add to cart");
            navigate("/login");
            return;
        }

        if (!mobileNumber) {
            setModalOpen(true);
            return;
        }

        addToCartHandler(item);
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

        if (isWishlisted) {
            removeFavorite(item.TAGKEY);
      
        } else {
            addToFavorite(item);
       
        }

        setTimeout(() => setHeartAnimation(false), 600);
    };

    const clickProduct = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/products-page/${item?.TAGKEY}`);
    };

    const isInCart = Array.isArray(cartProducts) &&
        cartProducts.some(cartItem => cartItem.TAGKEY === item?.TAGKEY);

    if (loadingState || !item) {
        return (
            <div className="w-full max-w-[400px] mx-auto">
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 animate-pulse">
                    <div className="relative w-full pt-[100%] bg-gradient-to-r from-gray-200 to-gray-300">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                        </div>
                    </div>
                    <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                        <div className="h-10 bg-gray-200 rounded w-full"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <UpdateMobileModal open={modalOpen} onClose={() => setModalOpen(false)} />

            <div className="w-full max-w-[400px] mx-auto group/card">


                <div
                    className="relative bg-transparent overflow-hidden transition-all duration-500 cursor-pointer  group"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="relative w-full aspect-square overflow-hidden ">
                        <div
                            className="relative w-full h-full cursor-pointer"
                            onClick={clickProduct}
                        >
                            <div
                                className="relative w-full h-full overflow-hidden group/image"
                                onMouseEnter={() => !isTouchDevice && setHover(true)}
                                onMouseLeave={() => !isTouchDevice && setHover(false)}
                            >
                                {/* Image 1 - Fades out on hover */}
                                <img
                                    src={productImages[0]}
                                    alt={productName}
                                    onLoad={() => setImageLoaded(true)}
                                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out
            ${isMobile
                                            ? "opacity-0 scale-100"
                                            : hover
                                                ? "opacity-0 scale-105 blur-[2px]"
                                                : "opacity-100 scale-100"
                                        } ${!imageLoaded ? 'opacity-0' : ''}`}
                                    style={{
                                        transition: 'opacity 500ms cubic-bezier(0.4, 0, 0.2, 1), transform 500ms cubic-bezier(0.4, 0, 0.2, 1), filter 500ms ease'
                                    }}
                                    loading="eager"
                                    decoding="async"
                                />

                                {/* Image 2 - Zooms in on hover */}
                                {hasMultipleImages && (
                                    <img
                                        src={productImages[1]}
                                        alt={productName}
                                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out
                ${isMobile
                                                ? "opacity-100 scale-105"
                                                : hover
                                                    ? "opacity-100 scale-110 brightness-105"
                                                    : "opacity-0 scale-100"
                                            }`}
                                        style={{
                                            transition: 'opacity 500ms cubic-bezier(0.4, 0, 0.2, 1), transform 700ms cubic-bezier(0.34, 1.56, 0.64, 1), filter 500ms ease'
                                        }}
                                        loading="eager"
                                        decoding="async"
                                    />
                                )}

                                {/* Image 2 with alternative zoom effect - subtle movement */}
                                {hasMultipleImages && (
                                    <img
                                        src={productImages[1]}
                                        alt={productName}
                                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out
                ${isMobile
                                                ? "opacity-100 scale-105 translate-y-0"
                                                : hover
                                                    ? "opacity-100 scale-110 translate-y-[-2%] brightness-105"
                                                    : "opacity-0 scale-100 translate-y-0"
                                            }`}
                                        style={{
                                            transition: 'opacity 500ms cubic-bezier(0.4, 0, 0.2, 1), transform 700ms cubic-bezier(0.34, 1.56, 0.64, 1), filter 500ms ease'
                                        }}
                                        loading="eager"
                                        decoding="async"
                                    />
                                )}

                               

                                {/* Loading Overlay */}
                                {!imageLoaded && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                        <div className="relative">
                                            <Loader2 className="w-8 h-8 text-[#f16137] animate-spin" />
                                            <div className="absolute inset-0 blur-xl bg-[#f16137]/20 animate-pulse"></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className={`absolute top-2 right-2 opacity-0 group-hover/card:opacity-100 transition-all duration-300 z-10
                            ${isTouchDevice ? 'opacity-100' : ''}`}
                        >
                            <button
                                className={`flex items-center justify-center w-9 h-9 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95
                                    ${heartAnimation ? 'animate__animated animate__heartBeat' : ''}`}
                                onClick={toggleWishlist}
                                aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                            >
                                <Heart
                                    size={14}
                                    fill={isWishlisted ? '#dc3545' : 'none'}
                                    color={isWishlisted ? '#dc3545' : '#041f60'}
                                    className="transition-colors duration-200"
                                />
                            </button>

                          
                        </div>

                       
                        {/* ---------------- Discount Badge ---------------- */}
                        {discountPercentage && (
                            <div className="absolute top-1 left-0 z-10 group">
                            <div
                                className={`relative text-white text-xs sm:text-sm font-semibold uppercase tracking-wide
                                px-3 py-[4px] pr-5 
                                bg-[var(--primary-hover-color)]
                                backdrop-blur-md
                                border border-white/20
                                shadow-[0_0_15px_rgba(255,255,255,0.3)]
                                overflow-hidden
                                transition-all duration-300
                                group-hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]
                                ${discountPercentage >= 50
                                            ? 'bg-gradient-to-r from-red-600 to-red-500'
                                            : discountPercentage >= 10
                                                ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                                                : 'bg-gradient-to-r from-green-600 to-emerald-500'
                                        }`}
                                >
                                    {/* Base gradient overlay */}
                                    <span className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>

                                    {/* Luxury shimmer animation */}
                                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out">
                                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"></span>
                                    </span>

                                    {/* Shine overlay - static */}
                                    <span className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/20 to-transparent opacity-30"></span>

                                    {/* Glow pulse animation */}
                                    <span className="absolute inset-0 rounded-sm animate-pulse opacity-20 bg-white/20"></span>

                                    {/* Pearl shimmer effect */}
                                    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent"></span>
                                        <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></span>
                                    </span>

                                    {/* Text with dynamic color */}
                                    <span className="relative flex items-center gap-1">
                                        <span className="group-hover:scale-105 transition-transform duration-300 inline-block">
                                            {discountPercentage}%
                                        </span>
                                        <span className="opacity-90 text-[0.7em] tracking-widest">OFF</span>
                                    </span>

                                    {/* Sparkle particles on hover */}
                                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full opacity-0 group-hover:animate-ping"></span>
                                    <span className="absolute top-1 right-1/4 w-0.5 h-0.5 bg-white rounded-full opacity-0 group-hover:animate-ping group-hover:animation-delay-300"></span>

                                  
                                </div>

                              
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col items-start p-3 text-center bg-transparent">
                        <div className="flex items-center justify-center gap-2 flex-wrap mt-1">
                            <span className="font-lato text-sm md:text-base font-semibold text-[var(--primary-hover-color)]">
                                ₹{formatNumber(currentPrice,2)}
                            </span>
                            <span className="font-lato text-xs md:text-sm font-normal text-gray-500 line-through">
                                ₹{formatNumber(originalPrice, 2)}
                            </span>
                        </div>
                        <h3 className="font-lato text-sm md:text-base text-[var(--primary-hover-color)] capitalize font-semibold truncate">
                            {productName}
                        </h3>


                    </div>

                    {/* Add to Cart Button */}
                    <button
                        className={`w-full py-2 px-3 text-xs font-bold rounded-md transition-all duration-300
                            ${isInCart
                                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                                : 'bg-gradient-to-r from-pink-400 to-pink-500 text-white'
                            }
                            ${isTouchDevice ? 'opacity-100' : 'opacity-0 group-hover/card:opacity-100'}
                            ${cartAnimation ? 'animate__animated animate__bounceIn' : ''}`}
                        onClick={addItemToCart}
                    >
                        {isCartLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                        ) : isInCart ? (
                            <span className="flex items-center justify-center gap-2">
                                <Check size={14} />
                                In Cart
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                <ShoppingCart size={14} />
                                Add to Cart
                            </span>
                        )}
                    </button>
                </div>

                {/* Responsive Overrides */}
                <style jsx>{`
                    @media (max-width: 768px) {
                        .group\\/card {
                            max-width: 300px;
                        }
                        .group\\/card button {
                            font-size: 12px;
                        }
                        .group\\/card .absolute.top-2.right-2 {
                            opacity: 1;
                        }
                        .group\\/card .w-full.py-2 {
                            opacity: 1;
                        }
                        img {
                            transition-duration: 200ms;
                        }
                    }
                    
                    @media (max-width: 480px) {
                        .group\\/card {
                            max-width: 240px;
                        }
                        .group\\/card h3 {
                            font-size: 0.75rem;
                        }
                        .group\\/card span {
                            font-size: 0.7rem;
                        }
                        .group\\/card .w-9.h-9 {
                            width: 26px;
                            height: 26px;
                        }
                    }
                    
                    @media (max-width: 360px) {
                        .group\\/card {
                            max-width: 220px;
                        }
                    }

                    @media (hover: none) and (pointer: coarse) {
                        .group\\/card:hover {
                            transform: none;
                            box-shadow: none;
                        }
                        .group\\/card:active {
                            transform: scale(0.98);
                        }
                        .group\\/card .absolute.top-2.right-2 {
                            opacity: 1;
                        }
                    }
                `}</style>
            </div>
        </>
    );
};

export default ProductCard;