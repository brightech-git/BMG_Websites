import React from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2, Loader2, ShoppingCart } from "lucide-react";
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
      <section className="wishlist-wrapper">
        <div className="wishlist-progress">
          <Loader2 className="progress-spinner" size={48} strokeWidth={1.5} />
          <p>Loading your wishlist...</p>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="wishlist-wrapper">
        <div className="wishlist-failure">
          <div className="failure-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3>Unable to load wishlist</h3>
          <p>Please refresh the page or try again later</p>
          <button
            className="wishlist-retry-action"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="wishlist-wrapper">
      <div className="wishlist-top">
        <h1 className="wishlist-heading">My Wishlist</h1>
        {favoriteSnoList.length > 0 && (
          <div className="wishlist-total">{favoriteSnoList.length} {favoriteSnoList.length === 1 ? 'Item' : 'Items'}</div>
        )}
      </div>

      {favoriteSnoList.length === 0 ? (
        <div className="wishlist-none">
          <Heart className="none-icon" size={80} strokeWidth={1.2} />
          <h2>Your wishlist is empty</h2>
          <p>Save your favorite items to view them here</p>
          <Link to="/shop-left" className="wishlist-explore-btn">
            Explore Our Collection
          </Link>
        </div>
      ) : (
        <div className="wishlist-layout">
          {favoriteSnoList.map((sno) => (
            <WishlistItem
              key={sno}
              sno={sno}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </section>
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
      <div className="wishlist-item loading">
        <div className="item-progress-spinner">
          <Loader2 size={24} strokeWidth={1.5} />
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="wishlist-item">
      <Link to={`/ product / ${ sno } `} className="item-image-link">
        <img
          src={firstImage}
          alt={product.SUBITEMNAME}
          className="item-image"
          loading="lazy"
        />
      </Link>

      <div className="item-info">
        <h3 className="item-name">
          <Link to={`/ product / ${ sno } `}>{product.SUBITEMNAME}</Link>
        </h3>

        <div className="item-cost">₹{product.GrandTotal}</div>

        <div className="item-controls">
          <button className="main-btn btn-filled">
            Add to Cart
          </button>
          <button
            className="remove-item-action"
            onClick={() => onRemove(sno)}
            aria-label="Remove item"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
