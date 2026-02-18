import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHeart, FaRegHeart,
} from "react-icons/fa";
import { Gem, ShieldCheck, RefreshCw, Star, Share2, Scale, Ruler, Tag, Sparkles, Award, Clock, Truck } from "lucide-react";
import { useSingleProductQuery } from "../../../hook/product/useSingleProductQuery";
import { useCart } from "../../../hook/cart/useCartQuery";
import { useFavorites } from "../../../hook/favorites/useFavoritesQuery";
import { useRecentlyViewed } from "../../../hook/recentlyViewed/useRecentlyViewedQuery";
import { toast } from "react-toastify";
import ImageGallery from "./ImageGallery";
import PriceBreakup from "./PriceBreakUp";
import Shoprelated from '../../layouts/Shoprelated';
import Breadcrumb from "../../layouts/Breadcrumb";
import JewelleryBrandAssurance from "../../layouts/JewelleryBrandAssurance";
import UpdateMobileModal from "../../layouts/UpdateMobileModal";
import { useSelector } from "react-redux";
import { ShareButtons } from "../../share/Share";
import SmartButton from "../../ui/SmartButton";
import PincodeChecker from "../../../component/pincode/PincodeCheck";
import { usePincode } from "../../../context/pinocde/PincodeContext";
import 'animate.css';

const ProductSkeleton = () => (
  <div className="animate-pulse bg-gradient-to-b from-[#f8f6f2] to-[#eeece8] min-h-screen p-4">
    <div className="max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="bg-gray-300/50 rounded-2xl h-96 animate__animated animate__pulse animate__infinite" />
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-300/50 rounded-xl h-24 animate__animated animate__pulse animate__infinite" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-8 bg-gray-300/50 rounded-lg w-3/4 animate__animated animate__pulse animate__infinite" />
          <div className="h-6 bg-gray-300/50 rounded-lg w-1/2 animate__animated animate__pulse animate__infinite" />
          <div className="h-10 bg-gray-300/50 rounded-lg w-1/3 animate__animated animate__pulse animate__infinite" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-4 bg-gray-300/50 rounded animate__animated animate__pulse animate__infinite" />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const InfoBadge = ({ icon: Icon, label, value, className = "" }) => {
  if (!value && value !== 0) return null;

  return (
    <div className={`flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 animate__animated animate__fadeIn ${className}`}>
      <Icon className="w-4 h-4 text-[#f16137]" />
      <div className="flex flex-col">
        <span className="text-xs text-gray-500">{label}</span>
        <span className="text-sm font-semibold text-gray-800">{value}</span>
      </div>
    </div>
  );
};

const ProductInfo = ({ tagKey, Authenticated }) => {
  const isAuthenticated = useSelector(state => state.user.isAuthenticated) || Authenticated;
  const mobileNumber = useSelector(state => state.user.user?.contactNumber);
  const navigate = useNavigate();
  const [animateHeart, setAnimateHeart] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [showPriceBreakup, setShowPriceBreakup] = useState(false);
  const shareRef = useRef();

  const { data: product, isLoading, error } = useSingleProductQuery(tagKey);

  console.log(product,'product')

  const [cartLoading, setCartLoading] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);

  const { addItem } = useRecentlyViewed();
  const { cartItems, addToCartHandler } = useCart();
  const { favorites, addToFavorite, removeFavorite, isFavorite } = useFavorites();

  const cartProducts = cartItems?.data?.products;
  const isWishlisted = isFavorite(tagKey);

  const Base_URL = "https://app.bmgjewellers.com";

  const getEncodedImageUrl = (path) => {
    if (!path) return "";
    return `${Base_URL}${path.startsWith("/") ? "" : "/"}${path.split("/").map(encodeURIComponent).join("/")}`;
  };

  useEffect(() => {
    if (product?.TAGKEY) addItem(product.TAGKEY);
  }, [product?.TAGKEY, addItem]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (shareRef.current && !shareRef.current.contains(e.target)) {
        setShowShare(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getPrice = () => Number(product?.GrandTotal || product?.RATE || 0);

  const originalPrice = product?.GrandTotal ? product.GrandTotal * 2.25 : 0;
  const discount = originalPrice ? Math.round(((originalPrice - getPrice()) / originalPrice) * 100) : 0;

  const isInCart =
    Array.isArray(cartProducts) &&
    cartProducts.some((item) => item.TAGKEY === product?.TAGKEY);

  const handleAddToCart = (e) => {
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

    addToCartHandler(product);

    setCartLoading(false);
    setCartSuccess(true);

    setTimeout(() => {
      setCartSuccess(false);
    }, 2000);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return toast.error("Please login") && navigate("/login");
    if (!mobileNumber) return setModalOpen(true);

    const image = product.ImagePath ? JSON.parse(product.ImagePath)[0] : "";

    navigate("/checkout", {
      state: {
        items: [{
          productId: product.TAGKEY,
          productName: product.ITEMCTRNAME || product.SUBITEMNAME || product.ITEMNAME,
          price: parseFloat(product.GrandTotal),
          itemId: product.ITEMID,
          tagNo: product.TAGNO,
          sno: product.SNO,
          weight: parseFloat(product.NETWT),
          imagePath: image,
          quantity: 1,
          gstType: product.GSTType,
          gstPer: product.GSTPercentValue,
          gstAmount: product.GSTAmount,
        }],
        subtotal: getPrice(),
      },
    });
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login");
      navigate("/login");
      return;
    }

    setAnimateHeart(true);

    if (isWishlisted) {
      removeFavorite(product.TAGKEY);
    } else {
      addToFavorite(product);
    }

    setTimeout(() => setAnimateHeart(false), 500);
  };

  const images = product?.ImagePath ? JSON.parse(product.ImagePath).map(getEncodedImageUrl) : [];
  const videos = product?.VideoPath ? JSON.parse(product.VideoPath).map(getEncodedImageUrl) : [];

  if (isLoading) return <ProductSkeleton />;
  if (error || !product) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f8f6f2] to-[#eeece8]">
      <div className="text-center animate__animated animate__fadeIn">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="inline-block bg-[#f16137] text-white px-6 py-3 rounded-lg hover:bg-[#d84a22] transition-colors">
          Continue Shopping
        </Link>
      </div>
    </div>
  );

  // Check if fields exist and have values
  const hasWeight = product.NETWT && parseFloat(product.NETWT) > 0;
  const hasPurity = product.PURITY && product.PURITY !== "0.00" && product.PURITY !== "0";
  const hasMaterial = product.MaterialFinish && product.MaterialFinish !== "null" && product.MaterialFinish.trim() !== "";
  const hasSku = (product.ITEMID || product.TAGNO) && product.ITEMID !== "null" && product.TAGNO !== "null";
  const hasGender = product.Gender && product.Gender !== "null" && product.Gender.trim() !== "";
  const hasOccasion = product.Occasion && product.Occasion !== "null" && product.Occasion.trim() !== "";
  const hasCollection = product.CollectionType && product.CollectionType !== "null" && product.CollectionType.trim() !== "";
  const hasStone = product.STUDDEDSTONE === "Y" || (product.STUDDED && product.STUDDED !== "null" && product.STUDDED.trim() !== "");
  const hasCategory = product.CATNAME && product.CATNAME !== "null" && product.CATNAME.trim() !== "";
  const hasSubCategory = product.SUBITEMNAME && product.SUBITEMNAME !== "null" && product.SUBITEMNAME.trim() !== "";

  return (
    <>
      <UpdateMobileModal open={modalOpen} onClose={() => setModalOpen(false)} />

      <div className="min-h-screen bg-gradient-to-b from-[var(--primary-card-color)] to-[#eeece8] py-6 px-2 md:px-4">
        <div className="max-w-7xl mx-auto">

          {/* Breadcrumb with animation */}
          <div className="mb-2 animate__animated animate__fadeInDown">
            <Breadcrumb />
          </div>

          {/* Main Product Card */}
          <div className="grid lg:grid-cols-2 rounded-2xl bg-white p-4">

            {/* Image Gallery with animation */}
            <div className="max-w-full">
              {(images.length >= 0 || videos.length > 0) && (
                <ImageGallery
                  images={images.map(img => ({ img }))}
                  videos={videos.map(video => ({ video }))}
                  badges={{
                    NewArrival: product.NewArrival,
                    Top_Trending: product.Top_Trending,
                    discountPercentage: discount,
                    BestDesign: product.BestDesign === "1" || product.BestDesign === "Y",
                  }}
                />
              )}
            </div>

            {/* Product Info with animation */}
            <div className="space-y-2 p-2 animate__animated animate__fadeInRight">

              {/* Title + Actions */}
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h1 className="text-lg md:text-xl font-bold ">{product.ITEMCTRNAME}</h1>
                  {product.SUBITEMNAME && product.SUBITEMNAME !== "null" && (
                    <p className="text-[var(--orange-600)] mt-1 text-sm flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {product.SUBITEMNAME}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleWishlist}
                    className={`p-2 rounded-full border-2 transition-all duration-300 transform hover:scale-110 ${isWishlisted
                        ? "bg-red-50 border-red-300 text-red-600 hover:bg-red-100"
                        : "border-gray-200 hover:border-[var(--primary-hover-color)] hover:bg-orange-50"
                      } ${animateHeart ? "animate__animated animate__heartBeat" : ""}`}
                  >
                    {isWishlisted ? <FaHeart className="w-4 h-4" /> : <FaRegHeart className="w-4 h-4" />}
                  </button>

                  <div className="relative" ref={shareRef}>
                    <button
                      onClick={() => setShowShare(!showShare)}
                      className="p-2 rounded-full border-2 border-gray-200 hover:border-[#f16137] hover:bg-orange-50 transition-all duration-300 transform hover:scale-110"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    {showShare && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50 animate__animated animate__fadeIn">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Share this product</h3>
                        <ShareButtons tagKey={tagKey} />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Price Section */}
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl font-bold text-[#f16137]">₹{getPrice().toLocaleString("en-IN")}</span>
                {discount > 0 && (
                  <>
                    <span className="text-lg text-gray-400 line-through">₹{originalPrice.toLocaleString("en-IN")}</span>
                    <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 text-xs rounded-full font-semibold shadow-md animate__animated animate__pulse animate__infinite">
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Quick Info Badges Grid */}
              {(hasWeight || hasPurity || hasMaterial || hasGender) && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-2">
                  <InfoBadge icon={Scale} label="Weight" value={hasWeight ? `${parseFloat(product.NETWT).toFixed(3)}g` : null} />
                  <InfoBadge icon={Award} label="Purity" value={hasPurity ? `${product.PURITY}%` : null} />
                  <InfoBadge icon={Gem} label="Material" value={hasMaterial ? product.MaterialFinish : null} />
                  <InfoBadge icon={Sparkles} label="Gender" value={hasGender ? product.Gender : null} />
                </div>
              )}

              {/* Pincode Availability Checking */}
              {isAuthenticated && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-2 sm:p-4 rounded-xl border border-blue-100 w-[100%] md:w-full">
                  <div className="flex items-center gap-1 mb-2 text-[var(--orange-600)]">
                    <Truck className="w-4 sm:w-5 h-4 sm:h-5 " />
                    <h3 className="font-semibold text-lg md:text-xl text-[var(--orange-600)]">Check Delivery</h3>
                  </div>
                  <div className="">
                    <PincodeChecker />
                  </div>

                
                </div>
              )}

              <div className="w-[50%] md:w-full animate__animated animate__fadeIn">
                <JewelleryBrandAssurance
                  assurances={[
                    { icon: <Gem className="w-4 h-4" />, label: "Sterling Silver" },
                    { icon: <ShieldCheck className="w-4 h-4" />, label: "BIS Certified" },
                    { icon: <RefreshCw className="w-4 h-4" />, label: "30-Day Returns" },
                    { icon: <Truck className="w-4 h-4" />, label: "Free Shipping" },
                  ].filter(Boolean)}
                  bgColor="transparent"
                />
              </div>

              {/* Description with animation */}
              {product.Description && product.Description !== "null" && (
                <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-100 animate__animated animate__fadeIn">
                  <h3 className="text-sm font-semibold text-[var(--orange-600)] mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#f16137]" />
                    Product Description
                  </h3>
                  <p className="leading-relaxed text-sm">{product.Description}</p>
                </div>
              )}

              {/* Actions with animation */}
              <div className="flex gap-3 pt-2 animate__animated animate__fadeInUp">
                <SmartButton
                  onClick={handleAddToCart}
                  variant="primary"
                  hover
                  className="w-full py-3 text-sm font-semibold rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  success={cartSuccess}
                  isLoading={cartLoading}
                  isDisabled={isInCart}
                >
                  {isInCart ? "✓ Already in Cart" : "🛒 Add to Cart"}
                </SmartButton>
                <SmartButton
                  onClick={handleBuyNow}
                  className="w-full py-3 text-sm font-semibold rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  variant="primary"
                  hover
                >
                  ⚡ Buy Now
                </SmartButton>
              </div>

              {/* Categories & Additional Info */}
              {(hasCategory || hasSubCategory || hasCollection || hasOccasion || hasSku || hasStone) && (
                <div className="bg-gray-50/80 backdrop-blur-sm p-4 rounded-xl border border-gray-100 space-y-3 text-sm animate__animated animate__fadeIn">
                  <h3 className="text-sm font-semibold text-[var(--orange-600)] flex items-center gap-2">
                    <Tag className="w-4 h-4 " />
                    Product Details
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    {hasCategory && (
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Category</span>
                        <span className="font-medium ">{product.CATNAME}</span>
                      </div>
                    )}

                    {hasSubCategory && (
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Sub Category</span>
                        <span className="font-medium ">{product.SUBITEMNAME}</span>
                      </div>
                    )}

                    {hasCollection && (
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Collection</span>
                        <span className="font-medium ">{product.CollectionType}</span>
                      </div>
                    )}

                    {hasOccasion && (
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Occasion</span>
                        <span className="font-medium ">{product.Occasion.replace(/_/g, " ")}</span>
                      </div>
                    )}

                    {hasSku && (
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">SKU</span>
                        <span className="font-medium ">{product.ITEMID}-{product.TAGNO}</span>
                      </div>
                    )}

                    {hasStone && (
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Stone Type</span>
                        <span className="font-medium ">
                          {product.STUDDEDSTONE === "Y" ? "Studded" : product.STUDDED || "None"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Price Breakup Toggle */}
          <div className="mt-4">
            <button
              onClick={() => setShowPriceBreakup(!showPriceBreakup)}
              className="w-full bg-white/90 backdrop-blur-sm border border-gray-200 p-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-between group"
            >
              <span className="font-semibold text-gray-700 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#f16137]" />
                View Price Breakup & Care Instructions
              </span>
              <span className={`transform transition-transform duration-300 ${showPriceBreakup ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>

            {showPriceBreakup && (
              <div className="animate__animated animate__fadeIn">
                <PriceBreakup product={product} showPriceBreakup={showPriceBreakup} />
              </div>
            )}
          </div>

          {/* Jewellery Care Section */}
          <div className="mt-4 bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 shadow-lg animate__animated animate__fadeIn">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#f16137]" />
              Jewellery Care Guide
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { icon: "💧", text: "Avoid contact with water, perfume & chemicals" },
                { icon: "📦", text: "Store in airtight box when not wearing" },
                { icon: "🧼", text: "Clean gently with soft cloth only" },
                { icon: "😴", text: "Remove before sleeping or exercising" },
                { icon: "☀️", text: "Avoid direct sunlight and heat" },
                { icon: "🔧", text: "Professional cleaning recommended yearly" },
              ].map((tip, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl hover:bg-orange-50 transition-all duration-300 animate__animated animate__fadeIn"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <span className="text-2xl">{tip.icon}</span>
                  <p className="text-sm text-gray-600">{tip.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-6 animate__animated animate__fadeIn">
           
            <Shoprelated itemCtrId={product.ITEMCTRID} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductInfo;