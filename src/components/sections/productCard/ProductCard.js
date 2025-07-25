import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaSyncAlt, FaEye, FaArrowRight } from 'react-icons/fa';
import { useFavorites, useAddFavorite, useRemoveFavorite } from '../../../hook/favorites/useFavoritesQuery';
import './productCard.css';

const ProductCard = ({ item }) => {

    const [isWishlisted, setIsWishlisted] = useState(false);
    const [animateHeart, setAnimateHeart] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const { data: favorites, isFavoritesLoading } = useFavorites();
    const addFavorite = useAddFavorite();
    const removeFavorite = useRemoveFavorite();

    // Safely get product images
    const getProductImages = () => {
        try {
            // Handle case where ImagePath might be a stringified array or already parsed
            const imageData = item?.ImagePath;
            if (!imageData) return ['/fallback.jpg'];

            const parsedImages = typeof imageData === 'string' ? JSON.parse(imageData) : imageData;

            if (!Array.isArray(parsedImages)) return ['/fallback.jpg'];

            return parsedImages.length > 0
                ? parsedImages.map(img => img.startsWith('http') ? img : `https://app.bmgjewellers.com${img}`)
                : ['/'];
        } catch (error) {
            console.error('Error parsing product images:', error);
            return ['/fallback.jpg'];
        }
    };

    const images = getProductImages();
    const hasMultipleImages = images.length > 1;

    // Determine display name based on SUBITEM flag
    const displayName = item?.SUBITEMNAME || item?.ITEMNAME || 'Jewelry Item';


    // Price calculations
    const price = item?.GrandTotal ? parseFloat(item.GrandTotal) : 0;
    const originalPrice = item?.GrossAmount ? parseFloat(item.GrossAmount) : price;
    const showDiscount = originalPrice > price;
    const discountPercentage = showDiscount
        ? Math.round((1 - price / originalPrice) * 100)
        : 0;

    // Handle wishlist status
    useEffect(() => {
        if (!isFavoritesLoading && favorites?.data && item?.SNO) {
            setIsWishlisted(favorites.data.includes(item.SNO));
        }
    }, [favorites, item?.SNO, isFavoritesLoading]);

    // Handle image rotation on hover for products with multiple images
    useEffect(() => {
        if (isHovered && hasMultipleImages) {
            const timer = setTimeout(() => {
                setCurrentImageIndex(prev => (prev + 1) % images.length);
            }, 1500);
            return () => clearTimeout(timer);
        } else {
            setCurrentImageIndex(0); // Reset to first image when not hovering
        }
    }, [isHovered, currentImageIndex, hasMultipleImages, images.length]);

    const handleWishlistToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!item?.SNO) return;

        setAnimateHeart(true);
        if (isWishlisted) {
            removeFavorite.mutate(item.SNO);
        } else {
            addFavorite.mutate(item.SNO);
        }
        // Optimistically update UI
        setIsWishlisted(!isWishlisted);
        setTimeout(() => setAnimateHeart(false), 800);
    };
    const handleOnClick = (e, sno) => {
        e.preventDefault();
        e.stopPropagation();

        // Here you can also track analytics or fire other logic if needed
        window.location.href = `/shop-detail/${sno}`;
    };

    if (!item) {
        return (
            <div className="product-card loading">
                <div className="product-thumb shimmer"></div>
                <div className="product-desc">
                    <div className="title shimmer" style={{ width: '80%', height: '20px' }}></div>
                    <div className="price-container">
                        <div className="price shimmer" style={{ width: '60px', height: '24px' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="product-card"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="product-thumb" >
                <img
                    src={images[currentImageIndex]}
                    alt={displayName}
                    loading="lazy"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/fallback.jpg';
                    }}
                    onClick={(e) => handleOnClick(e,item.SNO)}
                />

                {/* Show discount badge if there's a price difference */}
                {showDiscount && (
                    <div className="badges">
                        <span className="badge discount">
                            -{discountPercentage}%
                        </span>
                    </div>
                )}

                <div className="button-group">
                    <button
                        className={`icon-btn ${isWishlisted ? 'wishlisted' : ''} ${animateHeart ? 'animate' : ''}`}
                        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                        onClick={handleWishlistToggle}
                        disabled={isFavoritesLoading}
                    >
                        {isWishlisted ? <FaHeart /> : <FaRegHeart />}
                    </button>
                    <button className="icon-btn" aria-label="Compare">
                        <FaSyncAlt />
                    </button>
                    <button className="icon-btn" aria-label="Quick view">
                        <FaEye />
                    </button>
                </div>
            </div>

            <div className="product-desc">
                <h4>
                    <Link to={`/shop-detail/${item.SNO}`} className="title">
                        {displayName}
                    </Link>
                </h4>
                <div className="price-container">
                    <span className="price">
                        ₹{price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                       
                    </span>
                    <Link
                        to={`/shop-detail/${item.SNO}`}
                        className="view-link"
                        aria-label="View product details"
                    >
                        <FaArrowRight />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;