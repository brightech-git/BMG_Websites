import React from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2, Loader2, ShoppingCart, Star } from "lucide-react";
import { useFavorites, useRemoveFavorite } from "../../../hook/favorites/useFavoritesQuery";
import { useSingleProductQuery } from "../../../hook/product/useSingleProductQuery";
import "./Wishlist.css";

const Wishlist = () => {
  const { data: favorites, isLoading, isError } = useFavorites();
  const removeFavorite = useRemoveFavorite();

  const favoriteSnoList = favorites?.data || [];

  const handleRemove = (sno) => {
    if (window.confirm("Are you sure you want to remove this item from your wishlist?")) {
      removeFavorite.mutate(sno);
    }
  };

  if (isLoading) {
    return (
      <div className="wl-loading">
        <Loader2 className="wl-spinner" size={40} strokeWidth={2} />
        <p>Loading your wishlist...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="wl-error">
        <div className="wl-error-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3>Unable to load wishlist</h3>
        <p>Please refresh the page or try again later</p>
        <button className="wl-retry-btn" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="wl-container">
      <div className="wl-header">
        <h1>My Wishlist</h1>
        {favoriteSnoList.length > 0 && (
          <div className="wl-count">{favoriteSnoList.length} Items</div>
        )}
      </div>

      {favoriteSnoList.length === 0 ? (
        <div className="wl-empty">
          <Heart className="wl-empty-icon" size={64} strokeWidth={1.5} />
          <h2>Your wishlist is empty</h2>
          <p>Discover and save your favorite items</p>
          <Link to="/shop" className="wl-explore-btn">
            Explore Collection
          </Link>
        </div>
      ) : (
        <div className="wl-grid">
          {favoriteSnoList.map((sno) => (
            <WishlistItem
              key={sno}
              sno={sno}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const WishlistItem = ({ sno, onRemove }) => {
  const { data: product, isLoading } = useSingleProductQuery(sno);

  let imageUrls = [];
  try {
    imageUrls = JSON.parse(product?.ImagePath || "[]");
  } catch (err) {
    console.error("Error parsing ImagePath", err);
  }

  const baseUrl = "https://app.bmgjewellers.com";
  const firstImage = imageUrls.length > 0 ? baseUrl + imageUrls[0] : "/images/placeholder.png";

  if (isLoading) {
    return (
      <div className="wl-item wl-item-loading">
        <div className="wl-spinner">
          <Loader2 size={20} strokeWidth={2} />
        </div>
      </div>
    );
  }

  if (!product) return null;

  // Mock ratings data (replace with actual API data)
  const rating = Math.random() * 0.2 + 4.7;
  const reviews = Math.floor(Math.random() * 1000) + 100;

  return (
    <div className="wl-item">
      <div className="wl-item-img-container">
        <Link to={`/shop-info/${sno}`}>
          <img
            src={firstImage}
            alt={product.SUBITEMNAME}
            className="wl-item-img"
            loading="lazy"
          />
        </Link>
        <button
          className="wl-remove-btn"
          onClick={() => onRemove(sno)}
          aria-label="Remove from wishlist"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="wl-item-details">
        {/* <div className="wl-item-rating">
          <Star className="wl-star-icon" size={12} fill="#FFD700" strokeWidth={1} />
          <span>{rating.toFixed(1)}</span>
          <span className="wl-reviews-count">({reviews.toLocaleString()})</span>
        </div> */}

        <h3 className="wl-item-title">
          <Link to={`/product/${sno}`}>{product.SUBITEMNAME}</Link>
        </h3>

        <div className="wl-item-price">₹{product.GrandTotal.toLocaleString()}</div>

        <button className="wl-move-to-cart-btn">
          <ShoppingCart size={14} className="wl-cart-icon" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Wishlist;