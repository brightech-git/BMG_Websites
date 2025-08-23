import React, { useState, useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Tab, Nav } from "react-bootstrap";
import {
  FaHeart,
  FaRegHeart,
  FaShareAlt,
  FaWhatsapp,
  FaInstagram,
  FaFacebookF,
  FaTwitter,
} from "react-icons/fa";
import { useSingleProductQuery } from "../../../hook/product/useSingleProductQuery";
import { useCart } from "../../../hook/cart/useCartQuery";
import {
  useFavorites,
  useAddFavorite,
  useRemoveFavorite,
} from "../../../hook/favorites/useFavoritesQuery";
import "./ShopInfoCart.css";
import ImageGallery from "./ImageGallery";
import { useRecentlyViewed } from "../../../hook/recentlyViewed/useRecentlyViewedQuery";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PriceBreakup from "./PriceBreakUp";

// ProductSkeleton remains unchanged
const ProductSkeleton = () => (
  <div className="product-skeleton">
    <div className="container">
      <div className="row product-detail-row">
        <div className="col-lg-6 col-md-12">
          <div className="skeleton-image-gallery">
            <div className="skeleton-main-image"></div>
            <div className="skeleton-thumbnail-row">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton-thumbnail"></div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-lg-6 col-md-12">
          <div className="skeleton-product-info">
            <div className="skeleton-title"></div>
            <div className="skeleton-rating"></div>
            <div className="skeleton-price"></div>
            <div className="skeleton-description"></div>
            <div className="skeleton-description short"></div>
            <div className="skeleton-variants">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton-variant-btn"></div>
              ))}
            </div>
            <div className="skeleton-buttons">
              <div className="skeleton-btn"></div>
              <div className="skeleton-btn"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Shopinfo = ({ sno, Authenticated }) => {
  const isAuthenticated = Authenticated;
  const history = useHistory();
  const location = useLocation();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [animateHeart, setAnimateHeart] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const { data: product, isLoading, error } = useSingleProductQuery(sno);
  const { addItem } = useRecentlyViewed();
  const { cartItems, addToCartHandler, isLoading: isCartLoading } = useCart();
  const { data: favorites, isLoading: isFavoritesLoading } = useFavorites();
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();
  const shareRef = React.useRef();

  const Base_URL = "https://app.bmgjewellers.com";

  // Function to get encoded image URL
  const getEncodedImageUrl = (rawPath) => {
    if (!rawPath) return "";
    const pathSegments = rawPath.replace(/^\/+/, "").split("/");
    const encodedPath =
      "/" +
      pathSegments.map((segment) => encodeURIComponent(segment)).join("/");
    return `${Base_URL}${encodedPath}`;
  };

  // Toast notification configuration
  const showAuthToast = (action) => {
    toast.error(`Please log in to ${action}.`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
    const redirectState = { from: location.pathname + location.search };
    localStorage.setItem("lastVisited", JSON.stringify(redirectState));
    history.push("/login", redirectState);
  };

  // Share icons data
  const useClickOutside = (ref, callback) => {
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          callback();
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref, callback]);
  };

  useClickOutside(shareRef, () => {
    if (showShare) setShowShare(false);
  });

  // Check if product is in wishlist
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (product?.SNO && Array.isArray(favorites?.data)) {
        const isItemWishlisted = favorites.data.some(
          (item) => item === product.SNO
        );
        setIsWishlisted(isItemWishlisted);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [product?.SNO, favorites]);

  // Add to recently viewed
  useEffect(() => {
    if (product?.SNO) {
      addItem(product.SNO);
    }
  }, [product?.SNO, addItem]);

  const getPrice = (product) => {
    return Number(product?.GrandTotal) > 0
      ? Number(product.GrandTotal)
      : Number(product?.RATE || 0);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      showAuthToast("add items to cart");
      return;
    }
    if (!product?.SNO) return;

    if (isInCart) {
      toast.info(`${product.ITEMNAME} is already in cart`, {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });
      return;
    }

    const cartItem = {
      itemSno: product.SNO,
      itemTagSno: product.SNO,
      itemName: product.ITEMNAME,
      price: getPrice(product),
      image: product.ImagePath ? JSON.parse(product.ImagePath)[0] : "",
    };

    addToCartHandler(cartItem);

    toast.success(`${product.ITEMNAME} added to cart!`, {
      position: "top-right",
      autoClose: 2000,
      theme: "colored",
    });
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      showAuthToast("proceed with purchase");
      return;
    }
    if (!product?.SNO) return;

    const firstImagePath = product.ImagePath
      ? JSON.parse(product.ImagePath)[0]
      : "";
    const encodedImageUrl = getEncodedImageUrl(firstImagePath);

    const checkoutPayload = {
      items: [
        {
          sno: product.SNO,
          itemId: product.ITEMID || null,
          tagNo: product.TAGNO || null,
          productName: product.ITEMNAME || "Unknown Product",
          quantity: 1,
          price: getPrice(product),
          imagePath: encodedImageUrl,
        },
      ],
      totalAmount: getPrice(product),
    };

    history.push("/checkout", checkoutPayload);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      showAuthToast("manage your wishlist");
      return;
    }
    if (!product?.SNO) return;

    setAnimateHeart(true);
    if (isWishlisted) {
      removeFavorite.mutate(product.SNO, {
        onSuccess: () => {
          toast.info(`${product.ITEMNAME} removed from wishlist`, {
            position: "top-right",
            autoClose: 2000,
            theme: "colored",
          });
        },
        onError: () => {
          setIsWishlisted(true);
          toast.error("Failed to remove from wishlist", {
            position: "top-right",
            autoClose: 2000,
            theme: "colored",
          });
        },
      });
    } else {
      addFavorite.mutate(product.SNO, {
        onSuccess: () => {
          toast.success(`${product.ITEMNAME} added to wishlist`, {
            position: "top-right",
            autoClose: 2000,
            theme: "colored",
          });
        },
        onError: () => {
          setIsWishlisted(false);
          toast.error("Failed to add to wishlist", {
            position: "top-right",
            autoClose: 2000,
            theme: "colored",
          });
        },
      });
    }
    setIsWishlisted(!isWishlisted);
    setTimeout(() => setAnimateHeart(false), 800);
  };

  const isInCart =
    Array.isArray(cartItems?.data) &&
    cartItems.data.some((item) => item.itemTagSno === product?.SNO);

  if (isLoading) return <ProductSkeleton />;
  if (error)
    return <div className="error-message">Error loading product details</div>;
  if (!product) return <div className="error-message">Product not found</div>;

  const images = product.ImagePath
    ? JSON.parse(product.ImagePath).map(getEncodedImageUrl).filter(Boolean)
    : [];
  const smallsliderpost = images.map((img) => ({ img }));

  const originalPrice = product.GrandTotal ? product.GrandTotal * 1.25 : 0;
  const discountPercentage =
    originalPrice && product.GrandTotal
      ? Math.round(((originalPrice - product.GrandTotal) / originalPrice) * 100)
      : 0;

  const currentUrl = window.location.href;
  const shareText = `Check out this product: ${product.ITEMNAME || "Unknown Product"
    }\nPrice: ₹${getPrice(product).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
    })}\nDescription: ${product.Description || "Expertly crafted jewelry."
    }\nImage: ${images[0] || ""}\nLink: ${currentUrl}`;
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(currentUrl);

  const whatsappUrl = `https://wa.me/?text=${encodedText}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
  const instagramUrl = `https://www.instagram.com/`;

  // Jewelry care instructions
  const careInstructions = [
    {
      title: "Avoid Moisture",
      description:
        "Keep away from water, sweat, and perfumes. Moisture can dull the gold polish.",
    },
    {
      title: "Store Properly",
      description:
        "Use a soft cloth pouch or airtight box. Don’t store multiple pieces together to avoid scratches.",
    },
    {
      title: "Clean Gently",
      description:
        "Use a soft, dry cloth to wipe. Don’t use harsh chemicals or silver dips.",
    },
    {
      title: "No Sprays or Cosmetics",
      description: "Wear jewellery last after applying makeup or perfume.",
    },
    {
      title: "Remove While Doing Chores",
      description:
        "Take off jewellery during cooking, cleaning, or washing to avoid damage.",
    },
    {
      title: "Regular Check",
      description:
        "Check for loose stones or fittings and get them fixed if needed.",
    },
  ];

  return (
    <section className="modern-product-section">
      <div className="container">
        <div className="row product-detail-row g-4">
          <div className="col-lg-6 col-md-12">
            <div className="product-gallery-container">
              {(product.NewArrival || product.Top_Trending || discountPercentage > 0) && (
                <div className="product-badges">
                  {product.NewArrival && (
                    <span className="badge new-arrival">New</span>
                  )}
                  {product.Top_Trending && (
                    <span className="badge trending">Trending</span>
                  )}
                  {discountPercentage > 0 && (
                    <span className="badge discount">-{discountPercentage}%</span>
                  )}
                </div>
              )}
              {smallsliderpost.length > 0 && <ImageGallery images={smallsliderpost} />}
            </div>
          </div>
          <div className="col-lg-6 col-md-12">
            <div className="product-info-container">
              <div className="product-header">
                <h1 className="product-title">
                  {product.SUBITEMNAME && (
                    <>
                      {product.SUBITEMNAME}{" "}
                      <span className="sub-product-title">{product.ITEMNAME}</span>
                    </>
                  )}
                  {!product.SUBITEMNAME && product.ITEMNAME}
                </h1>
                <div className="header-buttons">
                  <button
                    className={`wishlist-btn ${isWishlisted ? "wishlisted" : ""} ${animateHeart ? "animate" : ""
                      }`}
                    onClick={handleWishlistToggle}
                    aria-label={
                      isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                    }
                    disabled={isFavoritesLoading}
                  >
                    {isWishlisted ? <FaHeart /> : <FaRegHeart />}
                  </button>
                  <button
                    className={`share-btn ${showShare ? "active" : ""}`}
                    onClick={() => setShowShare(!showShare)}
                    aria-label="Share product"
                  >
                    <FaShareAlt />
                  </button>
                </div>
              </div>
              {showShare && (
                <div className="share-options" ref={shareRef}>
                  <div className="share-icons">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Share on WhatsApp"
                    >
                      <FaWhatsapp size={24} />
                    </a>
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Share on Instagram"
                    >
                      <FaInstagram size={24} />
                    </a>
                    <a
                      href={facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Share on Facebook"
                    >
                      <FaFacebookF size={24} />
                    </a>
                    <a
                      href={twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Share on Twitter"
                    >
                      <FaTwitter size={24} />
                    </a>
                  </div>
                </div>
              )}
              <div className="product-rating">
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i
                      key={star}
                      className={`fas fa-star ${star <= 4 ? "filled" : ""}`}
                    ></i>
                  ))}
                </div>
                <span className="rating-text">(4.0) • 50 Reviews</span>
              </div>
              <div className="product-pricing">
                <div className="price-row">
                  {getPrice(product) > 0 && (
                    <span className="current-price">
                      ₹
                      {getPrice(product).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  )}
                  {discountPercentage > 0 && originalPrice > 0 && (
                    <span className="original-price">
                      ₹
                      {originalPrice.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  )}
                </div>
                {product.GSTPer && (
                  <div className="price-details">
                    <small>Inclusive of all taxes • GST {product.GSTPer}</small>
                  </div>
                )}
              </div>
              {(product.NETWT || product.PURITY || product.MaterialFinish || product.ITEMID || product.TAGNO) && (
                <div className="product-meta-grid">
                  {product.NETWT && (
                    <div className="meta-item">
                      <span className="meta-label">Weight</span>
                      <span className="meta-value">{product.NETWT} grams</span>
                    </div>
                  )}
                  {product.PURITY && (
                    <div className="meta-item">
                      <span className="meta-label">Purity</span>
                      <span className="meta-value">{product.PURITY}%</span>
                    </div>
                  )}
                  {product.MaterialFinish && (
                    <div className="meta-item">
                      <span className="meta-label">Material</span>
                      <span className="meta-value">{product.MaterialFinish}</span>
                    </div>
                  )}
                  {(product.ITEMID || product.TAGNO) && (
                    <div className="meta-item">
                      <span className="meta-label">SKU</span>
                      <span className="meta-value">
                        {product.ITEMID}-{product.TAGNO}
                      </span>
                    </div>
                  )}
                </div>
              )}
              {product.Description && (
                <div className="product-description">
                  <p>{product.Description}</p>
                </div>
              )}
              <div className="product-actions">
                <button
                  className={`action-btn add-to-cart ${isInCart ? "in-cart" : ""}`}
                  onClick={handleAddToCart}
                >
                  <i className="fas fa-shopping-cart"></i>
                  {isInCart ? "In Cart" : "Add to Cart"}
                </button>
                <button
                  className="action-btn buy-now"
                  onClick={handleBuyNow}
                >
                  <i className="fas fa-bolt"></i>
                  Buy Now
                </button>
              </div>
              {(product.CATNAME || product.SUBITEMNAME || product.CollectionType || product.Occasion) && (
                <div className="product-categories">
                  {(product.CATNAME || product.SUBITEMNAME) && (
                    <div className="category-item">
                      <span className="category-label">Category:</span>
                      {product.CATNAME && (
                        <Link to="#" className="category-link">
                          {product.CATNAME}
                        </Link>
                      )}
                      {product.SUBITEMNAME && (
                        <Link to="#" className="category-link">
                          {product.SUBITEMNAME}
                        </Link>
                      )}
                    </div>
                  )}
                  {product.CollectionType && (
                    <div className="category-item">
                      <span className="category-label">Collection:</span>
                      <span className="category-value">
                        {product.CollectionType}
                      </span>
                    </div>
                  )}
                  {product.Occasion && (
                    <div className="category-item">
                      <span className="category-label">Occasion:</span>
                      <span className="category-value">
                        {product.Occasion.replace("_", " ")}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="col-12">
            <Tab.Container defaultActiveKey="price-breakup">
              <Nav variant="tabs" className="custom-tabs">
                <Nav.Item>
                  <Nav.Link eventKey="price-breakup">Price Breakup & Care</Nav.Link>
                </Nav.Item>
              </Nav>
              <Tab.Content className="tab-content-container">
                <Tab.Pane eventKey="price-breakup">
                  <div className="price-care-container">
                    <PriceBreakup product={product} />
                    <div className="care-instructions">
                      <h3 className="care-title">Jewellery Care Instructions</h3>
                      <p className="care-description">
                        Follow these tips to preserve the shine and extend the life of your jewellery's polish:
                      </p>
                      <div className="care-tips">
                        {careInstructions.map((tip, index) => (
                          <div key={index} className="care-tip-item">
                            <h4 className="care-tip-title">{tip.title}</h4>
                            <p className="care-tip-description">{tip.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Shopinfo;