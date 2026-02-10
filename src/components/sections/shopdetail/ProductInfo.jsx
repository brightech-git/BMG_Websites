import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHeart, FaRegHeart,
} from "react-icons/fa";
import { Gem, ShieldCheck, RefreshCw, Star, Share2 } from "lucide-react";
import { useSingleProductQuery } from "../../../hook/product/useSingleProductQuery";
import { useCart } from "../../../hook/cart/useCartQuery";
import { useFavorites, useAddFavorite, useRemoveFavorite } from "../../../hook/favorites/useFavoritesQuery";
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

const ProductSkeleton = () => (
  <div className="animate-pulse bg-[#eeece8] min-h-screen p-4">
    <div className="max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="bg-gray-300 rounded-lg h-96" />
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-300 rounded h-24" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-8 bg-gray-300 rounded w-3/4" />
          <div className="h-6 bg-gray-300 rounded w-1/2" />
          <div className="h-10 bg-gray-300 rounded w-1/3" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-4 bg-gray-300 rounded" />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ProductInfo = ({ tagKey, Authenticated }) => {
  const isAuthenticated = useSelector(state => state.user.isAuthenticated) || Authenticated;
  const mobileNumber = useSelector(state => state.user.user?.contactNumber);
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [animateHeart, setAnimateHeart] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const shareRef = useRef();

  const pincode = localStorage.getItem('userPincode');
  const { data: product, isLoading, error } = useSingleProductQuery(tagKey);
  console.log("product data", product);


  const [cartLoading, setCartLoading] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);

  const { addItem } = useRecentlyViewed();
  const { cartItems, addToCartHandler } = useCart();
  const { data: favorites } = useFavorites();

  const cartProducts = cartItems?.data?.products;
  console.log(cartProducts,'cartProducts')
  const favoriteProducts = favorites?.data?.products;


  console.log(favorites ,'favorites');
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  const Base_URL = "https://app.bmgjewellers.com";

  const getEncodedImageUrl = (path) => {
    if (!path) return "";
    return `${Base_URL}${path.startsWith("/") ? "" : "/"}${path.split("/").map(encodeURIComponent).join("/")}`;
  };


  useEffect(() => {
    if (product?.TAGKEY && favoriteProducts?.length) {
      // Check if product.TAGKEY exists in favoriteProducts' ItemTagSno
      const isFav = favoriteProducts.some(
        (fav) => fav.ItemTagSno === product.TAGKEY
      );
      setIsWishlisted(isFav);
      console.log(favoriteProducts, product?.TAGKEY, 'isWishlisted:', isFav);
    }
  }, [product, favoriteProducts]);


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
  const originalPrice = product?.GrandTotal ? product.GrandTotal * 1.25 : 0;
  const discount = originalPrice ? Math.round(((originalPrice - getPrice()) / originalPrice) * 100) : 0;


  const isInCart =
    Array.isArray(cartProducts) &&
    cartProducts.some((item) => item.ItemTagSno === product?.TAGKEY);


  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // ❌ NOT logged in
    if (!isAuthenticated) {
      toast.error("Please login to add to cart");
      navigate("/login");
      return;
    }

    // ❌ Logged in but no mobile (Google login case)
    if (!mobileNumber) {
      setModalOpen(true);
      return;
    }

    // ❌ Already in cart
    if (isInCart) {
      toast.info("Already in cart");
      return;
    }

    // ✅ NOW start loading
    setCartLoading(true);
    setCartSuccess(false);

    const image = product.ImagePath
      ? JSON.parse(product.ImagePath)[0]
      : "";

    addToCartHandler({
      tagKey:product.TAGKEY,
      quantity:1,
      shippingPincode: pincode || '360004'
    });

    toast.success("Added to cart!");
    setCartLoading(false);
    setCartSuccess(true);

    setTimeout(() => {
      setCartSuccess(false);
    }, 2000);
  };

  const handleBuyNow = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (!isAuthenticated) return toast.error("Please login") && navigate("/login");
    if (!mobileNumber) return setModalOpen(true);
    console.log(product, 'products');
    const image = product.ImagePath ? JSON.parse(product.ImagePath)[0] : "";
    navigate("/checkout", {
      state: {
        items: [{
          sno: product.SNO,
          itemId: product.ITEMID,
          tagNo: product.TAGNO,
          productName: product.ITEMCTRNAME,
          price: getPrice(),
          quantity: 1,
          imagePath: getEncodedImageUrl(image),
          weight: product.NETWT || 0,
        }],
        totalAmount: getPrice(),
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
      // Remove from wishlist
      removeFavorite.mutate(product.TAGKEY, {
        onSuccess: () => {
          setIsWishlisted(false);
          toast.info("💔 Removed from wishlist");
        },
        onSettled: () => setTimeout(() => setAnimateHeart(false), 600),
      });
    } else {
      // Add to wishlist
      const wishlistData = {
        tagKey: product.TAGKEY, // or product.TAGKEY if that's the correct key
        quantity: 1
      };

      addFavorite.mutate(wishlistData, {
        onSuccess: () => {
          setIsWishlisted(true);
          toast.success("❤️ Added to wishlist");
        },
        onSettled: () => setTimeout(() => setAnimateHeart(false), 600),
      });
    }
  };


  const images = product?.ImagePath ? JSON.parse(product.ImagePath).map(getEncodedImageUrl) : [];
  const videos = product?.VideoPath ? JSON.parse(product.VideoPath).map(getEncodedImageUrl) : [];

  if (isLoading) return <ProductSkeleton />;
  if (error || !product) return <div className="text-center py-20 text-red-600">Product not found</div>;



  return (
    <>
      <UpdateMobileModal open={modalOpen} onClose={() => setModalOpen(false)} />

      <div className="min-h-screen bg-[#eeece8] py-4 px-2">
        <div className="max-w-7xl mx-auto">

          {/* Breadcrumb */}
          <div className="mb-1"><Breadcrumb /></div>

          <div className="grid lg:grid-cols-2 bg-[#fff] p-2 rounded-xl">

            {/* Image Gallery */}
            <div className="max-w-full">
              {(images.length >= 0 || videos.length > 0) && (
                <ImageGallery
                  images={images.map(img => ({ img }))}
                  videos={videos.map(video => ({ video }))}
                  badges={{
                    NewArrival: product.NewArrival,
                    Top_Trending: product.Top_Trending,
                    discountPercentage: discount,
                  }}
                />
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-2">

              {/* Title + Actions */}
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h1 className="text-sm md:text-lg font-bold text-[var(--primary-text-color)]">{product.ITEMCTRNAME}</h1>
                  {product.SUBITEMNAME && <p className="text-gray-600 mt-1 text-xs">{product.SUBITEMNAME}</p>}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleWishlist}
                    className={`p-2 rounded-full border ${isWishlisted ? "bg-red-50 border-red-300 text-red-600" : "border-gray-300"} hover:border-[#f16137] transition ${animateHeart ? "animate-pulse" : ""}`}
                  >
                    {isWishlisted ? <FaHeart className="w-4 h-4" /> : <FaRegHeart className="w-4 h-4" />}
                  </button>

                  <div className="relative" ref={shareRef}>
                    <button
                      onClick={() => setShowShare(!showShare)}
                      className="p-2 rounded-full border border-gray-300 hover:border-[#f16137] transition"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    {showShare && (
                      <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-0 animate-fadeIn">
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <ShareButtons
                            tagKey={tagKey}
                          />

                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-[#f16137]">₹{getPrice().toLocaleString("en-IN")}</span>
                {discount > 0 && (
                  <>
                    <span className="text-sm line-through">₹{originalPrice.toLocaleString("en-IN")}</span>
                    <span className="bg-red-100 text-red-700 px-3 py-1 text-xs rounded-full font-semibold">{discount}% OFF</span>
                  </>
                )}
              </div>


              {/*Pincode Availability Checking */}
              {isAuthenticated && 
              <div>
                  <PincodeChecker />
                </div>
              }
            
         


{/* Meta Info */}
              {(product.NETWT || product.PURITY || product.MaterialFinish || product.ITEMID) && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2 border-y border-gray-200">
                  {/* {product.NETWT && <div><span className="text-gray-600">Weight:</span> <strong>{product.NETWT.toFixed(3)}g</strong></div>} */}
                  {product.PURITY && <div><span className="text-gray-600">Purity:</span> <strong>{product.PURITY}%</strong></div>}
                  {product.MaterialFinish && <div><span className="text-gray-600">Material:</span> <strong>{product.MaterialFinish}</strong></div>}
                  {(product.ITEMID || product.TAGNO) && <div><span className="text-gray-600">SKU:</span> <strong>{product.ITEMID}-{product.TAGNO}</strong></div>}
                </div>
              )}

              {/* Assurance */}
              <JewelleryBrandAssurance
                assurances={[
                  { icon: <Gem className="w-4 h-4" />, label: "Sterling Silver" },
                  { icon: <ShieldCheck className="w-4 h-4" />, label: "Certified" },
                  { icon: <RefreshCw className="w-4 h-4" />, label: "Free Shipping" },
                ]}
                bgColor="transparent"
              />

              {/* Description */}
              {product.Description && (
                <div className="bg-gray-50 p-1 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">{product.Description}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 z-[0]">
                <SmartButton onClick={handleAddToCart} variant="primary" hover className="w-full" success={cartSuccess} isLoading={cartLoading} isDisabled={isInCart ? true : false} >
                  {isInCart ? "Already in Cart" : "Add to Cart"}
                </SmartButton>
                <SmartButton onClick={handleBuyNow} className="w-full" variant="primary" hover >
                  Buy Now
                </SmartButton>
              </div>

              {/* Categories */}
              {(product.CATNAME || product.SUBITEMNAME || product.CollectionType || product.Occasion) && (
                <div className="space-y-2 text-xs">
                  {(product.CATNAME || product.SUBITEMNAME) && (
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-gray-600">Category:</span>
                      {product.CATNAME && <span className="font-medium ">{product.CATNAME}</span>}
                      {product.SUBITEMNAME && <span className="font-medium">{product.SUBITEMNAME}</span>}
                    </div>
                  )}
                  {product.CollectionType && <div><span className="text-gray-600">Collection:</span> <span className="font-medium">{product.CollectionType}</span></div>}
                  {product.Occasion && <div><span className="text-gray-600">Occasion:</span> <span className="font-medium">{product.Occasion.replace("_", " ")}</span></div>}
                </div>
              )}
            </div>
          </div>

          {/* Price Breakup & Care */}
          <div className="mt-2 bg-white rounded-lg border border-gray-300 p-3">
            {/* <h2 className="text-sm font-bold mb-2">Price Breakup & Care Instructions</h2> */}

            <div className="mt-2">
              <h3 className="text-lg font-semibold mb-2 ">Jewellery Care</h3>
              <div className="grid md:grid-cols-3 gap-3">
                {[
                  "Avoid contact with water & perfume",
                  "Store in airtight box",
                  "Clean with soft cloth only",
                  "Remove before sleeping",
                  "Avoid direct sunlight",
                  "Professional cleaning recommended yearly",
                ].map((tip, i) => (
                  <div key={i} className="flex gap-1 text-xs">
                    <Star className="w-4 h-4 text-[#f16137]" />
                    <p className="text-gray-700">{tip}</p>
                  </div>
                ))}
              </div>
            </div>


          </div>
          <PriceBreakup product={product} />

          {/* Related Products */}
          <div className="mt-11">
            <Shoprelated itemCtrName={product.ITEMCTRNAME} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductInfo;