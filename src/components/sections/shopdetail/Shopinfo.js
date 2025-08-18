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

    history.push("/login", { from: location.pathname + location.search });
  };

  //share icons data
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

  // Check if product is in wishlist on mount or when favorites/product changes
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
    console.log("add to cart is triggered");

    if (!isAuthenticated) {
      showAuthToast("add items to cart");
      history.push("/login");
      return;
    }

    if (!product?.SNO) return;

    if (isInCart) {
      // Optionally show info toast if you want
      toast.info(`${product.ITEMNAME} is already in cart`, {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });
      return; // Prevent duplicate add
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
    console.log("buy now triggered");
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

    const cartItem = {
      itemSno: product.SNO,
      itemTagSno: product.SNO,
      itemName: product.ITEMNAME,
      price: getPrice(product),
      image: encodedImageUrl,
    };

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
    console.log("checkout", checkoutPayload.items[0].imagePath);

    console.log("Image URL:", encodedImageUrl || "No image found");

    history.push("/checkout", checkoutPayload);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("add to whislist is triggered");
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
          setIsWishlisted(true); // Revert optimistic update
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
          setIsWishlisted(false); // Revert optimistic update
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
    ? JSON.parse(product.ImagePath).map(getEncodedImageUrl)
    : [];
  const smallsliderpost = images.map((img) => ({ img }));

  const originalPrice = product.GrandTotal * 1.25;
  const discountPercentage = Math.round(
    ((originalPrice - product.GrandTotal) / originalPrice) * 100
  );

  const currentUrl = window.location.href;
  const shareText = `Check out this product: ${
    product.ITEMNAME
  }\nPrice: ₹${getPrice(product).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
  })}\nDescription: ${
    product.Description || "Expertly crafted jewelry."
  }\nImage: ${images[0] || ""}\nLink: ${currentUrl}`;
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(currentUrl);

  const whatsappUrl = `https://wa.me/?text=${encodedText}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
  const instagramUrl = `https://www.instagram.com/`; // Note: Instagram web does not support direct sharing; this opens Instagram (on mobile, may prompt app). For full sharing, use app manually with copied link.

  return (
    <section className="modern-product-section">
      <div className="container">
        <div className="row product-detail-row g-4">
          <div className="col-lg-6 col-md-12">
            <div className="product-gallery-container">
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
              <ImageGallery images={smallsliderpost} />
            </div>
          </div>
          <div className="col-lg-6 col-md-12">
            <div className="product-info-container">
              <div className="product-header">
                <h1 className="product-title">
                  {product.SUBITEMNAME}{" "}
                  <span className="sub-product-title">{product.ITEMNAME}</span>
                </h1>
                <div className="header-buttons">
                  <button
                    className={`wishlist-btn ${
                      isWishlisted ? "wishlisted" : ""
                    } ${animateHeart ? "animate" : ""}`}
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
                  <span className="current-price">
                    ₹
                    {(parseFloat(product?.GrandTotal) > 0
                      ? parseFloat(product.GrandTotal)
                      : parseFloat(product?.RATE || 0)
                    ).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>

                  {discountPercentage > 0 && (
                    <span className="original-price">
                      ₹
                      {originalPrice.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  )}
                </div>
                <div className="price-details">
                  <small>Inclusive of all taxes • GST {product.GSTPer}</small>
                </div>
              </div>
              <div className="product-meta-grid">
                <div className="meta-item">
                  <span className="meta-label">Weight</span>
                  <span className="meta-value">{product.NETWT} grams</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Purity</span>
                  <span className="meta-value">{product.PURITY}%</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Material</span>
                  <span className="meta-value">{product.MaterialFinish}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">SKU</span>
                  <span className="meta-value">
                    {product.ITEMID}-{product.TAGNO}
                  </span>
                </div>
              </div>
              <div className="product-description">
                <p>
                  {product.Description ||
                    "Expertly crafted jewelry piece designed for modern elegance."}
                </p>
              </div>
              <div className="product-actions">
                <button
                  className={`action-btn add-to-cart ${
                    isInCart ? "in-cart" : ""
                  }`}
                  onClick={handleAddToCart}
                  // disabled={isCartLoading}
                >
                  <i className="fas fa-shopping-cart"></i>
                  {isInCart ? "In Cart" : "Add to Cart"}
                </button>
                <button
                  className="action-btn buy-now"
                  onClick={handleBuyNow}
                  // disabled={isCartLoading}
                >
                  <i className="fas fa-bolt"></i>
                  Buy Now
                </button>
              </div>
              <div className="product-categories">
                <div className="category-item">
                  <span className="category-label">Category:</span>
                  <Link to="#" className="category-link">
                    {product.CATNAME}
                  </Link>
                  {product.SUBITEMNAME && (
                    <Link to="#" className="category-link">
                      {product.SUBITEMNAME}
                    </Link>
                  )}
                </div>
                <div className="category-item">
                  <span className="category-label">Collection:</span>
                  <span className="category-value">
                    {product.CollectionType}
                  </span>
                </div>
                <div className="category-item">
                  <span className="category-label">Occasion:</span>
                  <span className="category-value">
                    {product.Occasion?.replace("_", " ")}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="product-details-tabs">
              <Tab.Container defaultActiveKey="description">
                <Nav variant="pills" className="custom-tabs">
                  <Nav.Item>
                    <Nav.Link eventKey="description">
                      <i className="fas fa-info-circle"></i>
                      Description
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="specifications">
                      <i className="fas fa-cog"></i>
                      Specifications
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="care">
                      <i className="fas fa-heart"></i>
                      Care Instructions
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
                <Tab.Content className="tab-content-container">
                  <Tab.Pane eventKey="description" className="tab-pane-content">
                    <div className="description-content">
                      <h4>Product Description</h4>
                      <p>
                        {product.Description ||
                          "This exquisite piece showcases exceptional craftsmanship."}
                      </p>
                      <ul>
                        <li>Premium quality materials</li>
                        <li>Expert craftsmanship</li>
                        <li>Elegant and versatile design</li>
                        <li>
                          Perfect for{" "}
                          {product.Occasion?.replace("_", " ").toLowerCase()}
                        </li>
                      </ul>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane
                    eventKey="specifications"
                    className="tab-pane-content"
                  >
                    <div className="specifications-content">
                      <h4>Technical Specifications</h4>
                      <div className="spec-table">
                        <div className="spec-row">
                          <span className="spec-label">Material</span>
                          <span className="spec-value">
                            {product.MaterialFinish}
                          </span>
                        </div>
                        <div className="spec-row">
                          <span className="spec-label">Weight</span>
                          <span className="spec-value">
                            {product.NETWT} grams
                          </span>
                        </div>
                        <div className="spec-row">
                          <span className="spec-label">Purity</span>
                          <span className="spec-value">{product.PURITY}%</span>
                        </div>
                        <div className="spec-row">
                          <span className="spec-label">Gender</span>
                          <span className="spec-value">{product.Gender}</span>
                        </div>
                        <div className="spec-row">
                          <span className="spec-label">Collection</span>
                          <span className="spec-value">
                            {product.CollectionType}
                          </span>
                        </div>
                        <div className="spec-row">
                          <span className="spec-label">Color Accent</span>
                          <span className="spec-value">
                            {product.ColorAccents}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="care" className="tab-pane-content">
                    <div className="care-content">
                      <h4>Jewellery Care</h4>
                      <div className="care-tips">
                        <div className="care-tip">
                          <i className="fas fa-box-open"></i>
                          <p>Store separately in a box or pouch.</p>
                        </div>
                        <div className="care-tip">
                          <i className="fas fa-tint-slash"></i>
                          <p>Avoid perfumes and water.</p>
                        </div>
                        <div className="care-tip">
                          <i className="fas fa-cloth"></i>
                          <p>Wipe with soft dry cloth.</p>
                        </div>
                        <div className="care-tip">
                          <i className="fas fa-sun"></i>
                          <p>Keep away from sunlight.</p>
                        </div>
                      </div>
                    </div>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Shopinfo;
