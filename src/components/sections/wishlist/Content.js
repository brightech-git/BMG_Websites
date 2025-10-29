import React from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { Heart, Trash2, Loader2, ShoppingCart, Star } from "lucide-react";
import { useFavorites, useRemoveFavorite } from "../../../hook/favorites/useFavoritesQuery";
import { useSingleProductQuery } from "../../../hook/product/useSingleProductQuery";
import { useCart } from "../../../hook/cart/useCartQuery";
import { toast } from "react-toastify";
import "./Wishlist.css";
import { useSelector } from "react-redux";

const Wishlist = () => {
  const { data: favorites, isLoading, isError } = useFavorites();
  const { cartItems, addToCartHandler } = useCart();
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
          <Link to="/products-page" className="wl-explore-btn">
            Explore Collection
          </Link>
        </div>
      ) : (
        <div className="wl-grid">
          {favoriteSnoList.map((sno) => (
            <WishlistItem
              key={sno}
              sno={sno}
              cartItems={cartItems}
              addToCartHandler={addToCartHandler}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const WishlistItem = ({ sno, onRemove, cartItems, addToCartHandler }) => {
  const { data: item, isLoading } = useSingleProductQuery(sno);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const location = useLocation();
  const history = useHistory();

  const isInCart = Array.isArray(cartItems?.data) &&
    cartItems.data.some(cartItem => cartItem.itemTagSno === item?.SNO);

  let imageUrls = [];
  try {
    imageUrls = JSON.parse(item?.ImagePath || "[]");
  } catch (err) {
    console.error("Error parsing ImagePath", err);
  }

  const baseUrl = "https://app.bmgjewellers.com";
  const productImages = imageUrls.map((path) => baseUrl + path);
  const firstImage = productImages.length > 0 ? productImages[0] : "/images/placeholder.png";

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
      toast.warning('Item already in cart');
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
    toast.success('🛒 Item added to cart!');
  };

  if (isLoading) {
    return (
      <div className="wl-item wl-item-loading">
        <div className="wl-spinner">
          <Loader2 size={20} strokeWidth={2} />
        </div>
      </div>
    );
  }

  if (!item) return null;



  return (
    <div className="wl-item">
      <div className="wl-item-img-container">
        <Link to={`/product-detail/${sno}`}>
          <img
            src={firstImage}
            alt={item.SUBITEMNAME}
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
        <div className="wl-items-wrap">
          <h3 className="wl-item-title">
            <Link to={`/product-detail/${sno}`}>{item.SUBITEMNAME}</Link>
          </h3>

          <h4 className="wl-item-price">₹{item.GrandTotal.toLocaleString()}</h4>
        </div>
        <button className="wl-move-to-cart-btn" onClick={addItemToCart}>
          <ShoppingCart size={14} className="wl-cart-icon" />
          {isInCart ? 'In Cart' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default Wishlist;
