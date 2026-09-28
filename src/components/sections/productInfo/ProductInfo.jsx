import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";

import {
  Gem,
  Check,
  ShieldCheck,
  RefreshCw,
  Star,
  Share2,
  Scale,
  Ruler,
  Tag,
  Sparkles,
  Award,
  Clock,
  Truck,
  ChevronDown,
  ChevronUp,
  Eye,
  ShoppingBag,
  CheckCircle2,
  Package,
  CircleDollarSign,
  Weight,
  Layers3,
  ArrowRight,
  Heart,
} from "lucide-react";

import { useSingleProductQuery } from "../../../hook/product/useSingleProductQuery";
import { useCart } from "../../../hook/cart/useCartQuery";
import { useFavorites } from "../../../hook/favorites/useFavoritesQuery";
import { useRecentlyViewed } from "../../../hook/recentlyViewed/useRecentlyViewedQuery";

import { toast } from "react-toastify";

import ImageGallery from "./ImageGallery";
import PriceBreakup from "./PriceBreakUp";
import Shoprelated from "../../layouts/Shoprelated";
import Breadcrumb from "../../layouts/Breadcrumb";
import JewelleryBrandAssurance from "../../layouts/JewelleryBrandAssurance";
import UpdateMobileModal from "../../layouts/UpdateMobileModal";
import { useSelector } from "react-redux";
import { ShareButtons } from "../../share/Share";
import SmartButton from "../../ui/SmartButton";
import PincodeChecker from "../../../component/pincode/PincodeCheck";

import "animate.css";


/* =========================================================
   SKELETON
========================================================= */

const ProductSkeleton = () => (
  <div className="animate-pulse bg-gradient-to-b from-[#f8f6f2] to-[#eeece8] min-h-screen p-4">

    <div className="max-w-100vh mx-auto">

      <div className="grid md:grid-cols-2 gap-8">

        <div className="space-y-4">

          <div className="bg-gray-300/50 rounded-2xl h-96" />

          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-gray-300/50 rounded-xl h-24"
              />
            ))}
          </div>

        </div>

        <div className="space-y-6">

          <div className="h-8 bg-gray-300/50 rounded-lg w-3/4" />

          <div className="h-6 bg-gray-300/50 rounded-lg w-1/2" />

          <div className="h-10 bg-gray-300/50 rounded-lg w-1/3" />

          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-4 bg-gray-300/50 rounded"
              />
            ))}
          </div>

        </div>

      </div>

    </div>

  </div>
);


/* =========================================================
   INFO BADGE
========================================================= */

const InfoBadge = ({
  icon: Icon,
  label,
  value,
  className = "",
}) => {

  if (!value && value !== 0) return null;

  return (
    <div
      className={`
        flex items-center gap-2
        bg-white/80
        backdrop-blur-sm
        px-3 py-2
        rounded-lg
        border border-gray-100
        shadow-sm
        hover:shadow-md
        transition-all duration-300
        ${className}
      `}
    >

      <Icon className="w-4 h-4 text-[#f16137]" />

      <div className="flex flex-col">

        <span className="text-xs text-gray-500">
          {label}
        </span>

        <span className="text-sm font-semibold text-gray-800">
          {value}
        </span>

      </div>

    </div>
  );
};


/* =========================================================
   COMBO ITEM CARD
========================================================= */

const ComboItemCard = ({
  item,
  index,
  getEncodedImageUrl,
}) => {

  const image = item?.images?.[0]
    ? getEncodedImageUrl(item.images[0])
    : "";

  return (
    <div
      className="
        group
        flex gap-3
        rounded-xl
        border border-gray-100
        bg-gradient-to-r
        from-gray-50
        via-white
        to-white
        p-3
        transition-all
        duration-300
        hover:border-orange-200
        hover:shadow-md
        animate__animated
        animate__fadeInUp
      "
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >

      {/* Product image */}

      <div
        className="
          relative
          h-24 w-24
          sm:h-28 sm:w-28
          shrink-0
          overflow-hidden
          rounded-xl
          bg-[#f8f6f2]
        "
      >

        {image ? (
          <img
            src={image}
            alt={item?.subItemName || item?.itemName}
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-500
              group-hover:scale-105
            "
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Gem className="h-8 w-8 text-gray-300" />
          </div>
        )}

        {/* Number */}

        <span
          className="
            absolute
            left-2
            top-2
            flex
            h-6
            w-6
            items-center
            justify-center
            rounded-full
            bg-white/95
            text-xs
            font-bold
            text-[#f16137]
            shadow
          "
        >
          {index + 1}
        </span>

      </div>


      {/* Details */}

      <div className="min-w-0 flex-1 py-1">

        <div className="flex items-start justify-between gap-2">

          <div className="min-w-0">

            <h4 className="truncate text-sm font-semibold text-gray-800">
              {item?.itemName}
            </h4>

            <p className="mt-1 truncate text-xs text-[#f16137]">
              {item?.subItemName}
            </p>

          </div>

          {item?.available && (
            <span
              className="
                shrink-0
                inline-flex
                items-center
                gap-1
                rounded-full
                bg-emerald-50
                px-2
                py-1
                text-[10px]
                font-semibold
                text-emerald-600
              "
            >
              <Check className="h-3 w-3" />
              Available
            </span>
          )}

        </div>


        {/* Product information */}

        <div className="mt-3 flex flex-wrap gap-2">

          {item?.netWt > 0 && (
            <span
              className="
                rounded-md
                bg-white
                border border-gray-100
                px-2
                py-1
                text-[11px]
                text-gray-600
              "
            >
              {Number(item.netWt).toFixed(3)}g
            </span>
          )}

          {item?.purity > 0 && (
            <span
              className="
                rounded-md
                bg-white
                border border-gray-100
                px-2
                py-1
                text-[11px]
                text-gray-600
              "
            >
              {Number(item.purity).toFixed(2)}%
            </span>
          )}

          {item?.pcs && (
            <span
              className="
                rounded-md
                bg-white
                border border-gray-100
                px-2
                py-1
                text-[11px]
                text-gray-600
              "
            >
              {item.pcs} Pc
            </span>
          )}

        </div>


        {/* Price */}

        <div className="mt-2">

          <span className="text-sm font-bold text-[#f16137]">
            ₹{Number(item?.finalAmount || 0).toLocaleString("en-IN")}
          </span>

        </div>

      </div>

    </div>
  );
};


/* =========================================================
   COMBO ITEMS SECTION
========================================================= */

const ComboItemsSection = ({
  items = [],
  getEncodedImageUrl,
}) => {

  if (!items?.length) return null;

  return (
    <div
      className="
        rounded-2xl
        border border-gray-100
        bg-gradient-to-br
        from-white
        via-white
        to-orange-50/30
        p-4
        shadow-sm
      "
    >

      {/* Header */}

      <div className="mb-4 flex items-center justify-between">

        <div className="flex items-center gap-2">

          <div
            className="
              flex h-9 w-9
              items-center justify-center
              rounded-xl
              bg-orange-50
              text-[#f16137]
            "
          >
            <Package className="h-5 w-5" />
          </div>

          <div>

            <h3 className="text-sm font-bold text-gray-800">
              What's Included
            </h3>

            <p className="text-xs text-gray-500">
              Products included in this combo
            </p>

          </div>

        </div>


        <span
          className="
            rounded-full
            bg-[#f16137]/10
            px-3 py-1
            text-xs
            font-semibold
            text-[#f16137]
          "
        >
          {items.length} Products
        </span>

      </div>


      {/* Items */}

      <div className="space-y-3">

        {items.map((item, index) => (
          <ComboItemCard
            key={`${item.tagKey}-${item.tagNo}-${index}`}
            item={item}
            index={index}
            getEncodedImageUrl={getEncodedImageUrl}
          />
        ))}

      </div>

    </div>
  );
};


/* =========================================================
   COMBO PRICE SUMMARY
========================================================= */

const ComboPriceSummary = ({
  combo,
  items = [],
}) => {

  const individualTotal = items.reduce(
    (sum, item) => sum + Number(item?.finalAmount || 0),
    0
  );

  const comboPrice = Number(
    combo?.comboPrice ||
    combo?.totalFinalAmount ||
    0
  );

  const savings = Math.max(
    individualTotal - comboPrice,
    0
  );

  return (
    <div
      className="
        rounded-2xl
        border border-orange-100
        bg-gradient-to-br
        from-orange-50
        via-white
        to-amber-50
        p-4
      "
    >

      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs text-gray-500">
            Combo Price
          </p>

          <p className="mt-1 text-3xl font-bold text-[#f16137]">
            ₹{comboPrice.toLocaleString("en-IN")}
          </p>

        </div>

        <div
          className="
            flex h-12 w-12
            items-center justify-center
            rounded-2xl
            bg-white
            shadow-sm
          "
        >
          <ShoppingBag className="h-6 w-6 text-[#f16137]" />
        </div>

      </div>


      <div className="mt-4 space-y-2 border-t border-orange-100 pt-3">

        <div className="flex justify-between text-sm">

          <span className="text-gray-500">
            Individual products
          </span>

          <span className="font-medium text-gray-700">
            ₹{individualTotal.toLocaleString("en-IN")}
          </span>

        </div>


        <div className="flex justify-between text-sm">

          <span className="text-gray-500">
            Combo price
          </span>

          <span className="font-semibold text-[#f16137]">
            ₹{comboPrice.toLocaleString("en-IN")}
          </span>

        </div>


        {savings > 0 && (
          <div className="flex justify-between pt-1">

            <span className="text-sm font-medium text-emerald-600">
              You Save
            </span>

            <span className="text-sm font-bold text-emerald-600">
              ₹{savings.toLocaleString("en-IN")}
            </span>

          </div>
        )}

      </div>

    </div>
  );
};

const ComboProductCard = ({
  item,
  index,
  getEncodedImageUrl,
  onViewProduct,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const getImages = () => {
    if (!item) return [];

    // API combo response can contain images as an array
    if (Array.isArray(item.images)) {
      return item.images
        .filter(Boolean)
        .map(getEncodedImageUrl);
    }

    // Fallback if ImagePath is returned as JSON string
    if (item.ImagePath) {
      try {
        const parsed = JSON.parse(item.ImagePath);

        if (Array.isArray(parsed)) {
          return parsed
            .filter(Boolean)
            .map(getEncodedImageUrl);
        }
      } catch {
        return [getEncodedImageUrl(item.ImagePath)];
      }
    }

    // Fallback if ImagePath is already an array
    if (Array.isArray(item.ImagePath)) {
      return item.ImagePath
        .filter(Boolean)
        .map(getEncodedImageUrl);
    }

    return [];
  };

  const images = getImages();

  const productName =
    item.itemName ||
    item.ITEMNAME ||
    item.ItemName ||
    "Jewellery Product";

  const subItemName =
    item.subItemName ||
    item.SUBITEMNAME ||
    "";

  const price = Number(
    item.finalAmount ||
    item.FinalAmount ||
    item.grandTotal ||
    0
  );

  const grossWeight = Number(
    item.grsWt ||
    item.GRSWT ||
    0
  );

  const netWeight = Number(
    item.netWt ||
    item.NETWT ||
    0
  );

  const purity =
    item.purity ||
    item.PURITY ||
    item.NEWPURITY ||
    "";

  const pcs =
    item.pcs ||
    item.PCS ||
    item.qty ||
    item.QTY ||
    1;

  const makingCharges = Number(
    item.makingCharges ||
    item.MAKINGCHARGES ||
    item.mc ||
    0
  );

  const stoneAmount = Number(
    item.stoneAmount ||
    item.STONEAMOUNT ||
    0
  );

  const gstAmount = Number(
    item.gstAmount ||
    item.GSTAmount ||
    0
  );

  const gstPer =
    item.gstPer ||
    item.GSTPer ||
    "";

  const available =
    item.available !== false &&
    item.AVAILABLE !== false;

  const displayImage =
    images[activeImage] ||
    "/images/product-placeholder.png";

  return (
    <div
      className="
        group
        overflow-hidden
        rounded-[1.5rem]
        border
        border-[#eadfd4]
        bg-white
        shadow-[0_10px_40px_rgba(80,50,20,0.06)]
        transition-all
        duration-500
        hover:-translate-y-1
        hover:shadow-[0_20px_55px_rgba(80,50,20,0.12)]
      "
    >
      {/* =====================================================
          IMAGE AREA
      ====================================================== */}
      <div className="relative bg-gradient-to-br from-[#faf7f3] via-[#f7f1eb] to-[#eee5dc]">

        {/* Product Number */}
        <div className="absolute left-4 top-4 z-20">
          <div
            className="
              flex h-9 min-w-9 items-center justify-center
              rounded-full
              border border-white/70
              bg-white/90
              px-3
              text-xs
              font-bold
              text-[#7b5a3c]
              shadow-lg
              backdrop-blur-md
            "
          >
            {String(index + 1).padStart(2, "0")}
          </div>
        </div>

        {/* Included Badge */}
        <div className="absolute right-4 top-4 z-20">
          <div
            className="
              flex items-center gap-1.5
              rounded-full
              border border-emerald-100
              bg-emerald-50/95
              px-3 py-1.5
              text-[10px]
              font-bold
              uppercase
              tracking-wider
              text-emerald-700
              shadow-sm
              backdrop-blur-md
            "
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Included
          </div>
        </div>

        {/* Main Image */}
        <div className="relative aspect-[1/1.05] overflow-hidden">

          <img
            src={displayImage}
            alt={productName}
            className="
              h-full
              w-full
              object-contain
              p-6
              transition-transform
              duration-700
              ease-out
              group-hover:scale-[1.035]
            "
          />

          {/* Bottom gradient */}
          <div
            className="
              pointer-events-none
              absolute
              inset-x-0
              bottom-0
              h-28
              bg-gradient-to-t
              from-black/10
              to-transparent
            "
          />
        </div>

        {/* Image Thumbnails */}
        {images.length > 1 && (
          <div
            className="
              absolute
              bottom-4
              left-1/2
              z-10
              flex
              -translate-x-1/2
              gap-2
              rounded-xl
              border
              border-white/60
              bg-white/85
              p-2
              shadow-xl
              backdrop-blur-md
            "
          >
            {images.slice(0, 5).map((image, imageIndex) => (
              <button
                key={imageIndex}
                type="button"
                onClick={() => setActiveImage(imageIndex)}
                className={`
                  h-11
                  w-11
                  overflow-hidden
                  rounded-lg
                  border-2
                  bg-white
                  transition-all
                  duration-300
                  ${activeImage === imageIndex
                    ? "border-[#b08d57] shadow-md scale-105"
                    : "border-transparent opacity-70 hover:opacity-100"
                  }
                `}
              >
                <img
                  src={image}
                  alt={`${productName} ${imageIndex + 1}`}
                  className="h-full w-full object-contain"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* =====================================================
          PRODUCT INFORMATION
      ====================================================== */}
      <div className="p-5 sm:p-6">

        {/* Product Title */}
        <div className="mb-4">

          <div className="mb-2 flex items-center gap-2">
            <Package className="h-4 w-4 text-[#b08d57]" />

            <span
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.18em]
                text-[#a17d4c]
              "
            >
              Combo Item {index + 1}
            </span>
          </div>

          <h3
            className="
              text-lg
              font-bold
              leading-tight
              text-[#29231e]
              sm:text-xl
            "
          >
            {productName}
          </h3>

          {subItemName && (
            <p className="mt-1 text-sm text-[#92785e]">
              {subItemName}
            </p>
          )}
        </div>

        {/* Price */}
        <div
          className="
            mb-5
            flex
            items-end
            justify-between
            gap-3
            border-b
            border-[#eee5dc]
            pb-5
          "
        >
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              Individual Value
            </p>

            <p className="text-2xl font-bold text-[#a87535]">
              ₹{price.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          <div
            className={`
              flex items-center gap-1.5
              rounded-full
              px-3 py-1.5
              text-xs font-semibold
              ${available
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-600"
              }
            `}
          >
            <span
              className={`
                h-1.5 w-1.5 rounded-full
                ${available
                  ? "bg-emerald-500"
                  : "bg-red-500"
                }
              `}
            />

            {available ? "Available" : "Unavailable"}
          </div>
        </div>

        {/* =====================================================
            QUICK SPECS
        ====================================================== */}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">

          {netWeight > 0 && (
            <div
              className="
                rounded-xl
                border
                border-[#eee5dc]
                bg-[#fcfaf8]
                p-3
              "
            >
              <Weight className="mb-1.5 h-4 w-4 text-[#b08d57]" />

              <p className="text-[10px] text-gray-400">
                Net Weight
              </p>

              <p className="mt-0.5 text-sm font-bold text-[#342c25]">
                {netWeight.toFixed(3)}g
              </p>
            </div>
          )}

          {purity && (
            <div
              className="
                rounded-xl
                border
                border-[#eee5dc]
                bg-[#fcfaf8]
                p-3
              "
            >
              <Gem className="mb-1.5 h-4 w-4 text-[#b08d57]" />

              <p className="text-[10px] text-gray-400">
                Purity
              </p>

              <p className="mt-0.5 text-sm font-bold text-[#342c25]">
                {purity}
                {!String(purity).includes("%") && "%"}
              </p>
            </div>
          )}

          <div
            className="
              rounded-xl
              border
              border-[#eee5dc]
              bg-[#fcfaf8]
              p-3
            "
          >
            <Layers3 className="mb-1.5 h-4 w-4 text-[#b08d57]" />

            <p className="text-[10px] text-gray-400">
              Pieces
            </p>

            <p className="mt-0.5 text-sm font-bold text-[#342c25]">
              {pcs}
            </p>
          </div>

          {grossWeight > 0 && (
            <div
              className="
                rounded-xl
                border
                border-[#eee5dc]
                bg-[#fcfaf8]
                p-3
              "
            >
              <Scale className="mb-1.5 h-4 w-4 text-[#b08d57]" />

              <p className="text-[10px] text-gray-400">
                Gross Weight
              </p>

              <p className="mt-0.5 text-sm font-bold text-[#342c25]">
                {grossWeight.toFixed(3)}g
              </p>
            </div>
          )}
        </div>

        {/* =====================================================
            FULL DETAILS
        ====================================================== */}
        <div className="mt-5">

          <button
            type="button"
            onClick={() => setShowDetails((prev) => !prev)}
            className="
              flex
              w-full
              items-center
              justify-between
              rounded-xl
              border
              border-[#e9ded2]
              bg-[#faf7f3]
              px-4
              py-3
              text-left
              transition-all
              duration-300
              hover:border-[#c9a66e]
              hover:bg-[#f7f0e9]
            "
          >
            <span className="flex items-center gap-2 text-sm font-semibold text-[#514438]">
              <Ruler className="h-4 w-4 text-[#b08d57]" />

              {showDetails
                ? "Hide Product Details"
                : "View Full Product Details"}
            </span>

            {showDetails ? (
              <ChevronUp className="h-4 w-4 text-[#9c7a50]" />
            ) : (
              <ChevronDown className="h-4 w-4 text-[#9c7a50]" />
            )}
          </button>

          {showDetails && (
            <div
              className="
                mt-2
                rounded-xl
                border
                border-[#eee5dc]
                bg-white
                p-4
                animate__animated
                animate__fadeIn
              "
            >
              <div className="grid grid-cols-2 gap-x-5 gap-y-4">

                {grossWeight > 0 && (
                  <DetailRow
                    label="Gross Weight"
                    value={`${grossWeight.toFixed(3)} g`}
                  />
                )}

                {netWeight > 0 && (
                  <DetailRow
                    label="Net Weight"
                    value={`${netWeight.toFixed(3)} g`}
                  />
                )}

                {purity && (
                  <DetailRow
                    label="Purity"
                    value={
                      String(purity).includes("%")
                        ? purity
                        : `${purity}%`
                    }
                  />
                )}

                <DetailRow
                  label="Pieces"
                  value={pcs}
                />

                {makingCharges > 0 && (
                  <DetailRow
                    label="Making Charges"
                    value={`₹${makingCharges.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`}
                  />
                )}

                {stoneAmount > 0 && (
                  <DetailRow
                    label="Stone Amount"
                    value={`₹${stoneAmount.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`}
                  />
                )}

                {gstAmount > 0 && (
                  <DetailRow
                    label={`GST${gstPer ? ` (${gstPer})` : ""}`}
                    value={`₹${gstAmount.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`}
                  />
                )}

                {item.tagNo && (
                  <DetailRow
                    label="Product Code"
                    value={item.tagNo}
                  />
                )}

                {item.itemId && (
                  <DetailRow
                    label="Item ID"
                    value={item.itemId}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* =====================================================
            VIEW PRODUCT
        ====================================================== */}
        {item.tagKey && (
          <button
            type="button"
            onClick={() => onViewProduct(item.tagKey)}
            className="
              mt-4
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-[#b08d57]
              bg-white
              px-4
              py-3
              text-sm
              font-semibold
              text-[#8f6d3f]
              transition-all
              duration-300
              hover:bg-[#b08d57]
              hover:text-white
            "
          >
            <Eye className="h-4 w-4" />
            View Individual Product
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};


const DetailRow = ({ label, value }) => (
  <div className="border-b border-[#f2ebe4] pb-2">
    <p className="text-[10px] uppercase tracking-wider text-gray-400">
      {label}
    </p>

    <p className="mt-1 text-sm font-semibold text-[#3b322a]">
      {value}
    </p>
  </div>
);

const ComboProductsShowcase = ({
  product,
  getEncodedImageUrl,
  onAddToCart,
  onBuyNow,
  cartSuccess,
  isInCart,
  navigate,
}) => {
  const comboItems =
    product?.ComboItems ||
    product?.Combo?.items ||
    [];

  const comboName =
    product?.ComboName ||
    product?.Combo?.comboName ||
    "Jewellery Combo";

  const comboPrice = Number(
    product?.ComboPrice ||
    product?.Combo?.comboPrice ||
    0
  );

  const individualTotal = comboItems.reduce(
    (sum, item) =>
      sum +
      Number(
        item.finalAmount ||
        item.FinalAmount ||
        item.grandTotal ||
        0
      ),
    0
  );

  const savings = Math.max(
    0,
    individualTotal - comboPrice
  );

  const totalNetWeight = comboItems.reduce(
    (sum, item) =>
      sum +
      Number(item.netWt || item.NETWT || 0),
    0
  );

  const totalGrossWeight = comboItems.reduce(
    (sum, item) =>
      sum +
      Number(item.grsWt || item.GRSWT || 0),
    0
  );

  const handleViewProduct = (tagKey) => {
    if (!tagKey) return;

    navigate(`/product/${tagKey}`);
  };

  return (
    <div className="space-y-6">

      {/* =====================================================
          COMBO HERO
      ====================================================== */}
      <section
        className="
          relative
          overflow-hidden
          rounded-[1.75rem]
          border
          border-[#e8ddd2]
          bg-gradient-to-br
          from-[#fffdfb]
          via-[#faf6f1]
          to-[#f1e7dc]
          p-5
          sm:p-8
        "
      >
        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#b08d57]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-[#d7b98a]/10 blur-3xl" />

        <div className="relative z-10 text-center">

          <div
            className="
              mx-auto
              mb-2
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-[#d8c3a8]
              bg-white/80
              px-4
              py-2
              text-[10px]
              font-bold
              uppercase
              tracking-[0.2em]
              text-[#987343]
              shadow-sm
              backdrop-blur
            "
          >
            <Sparkles className="h-3.5 w-3.5" />
            Exclusive Combo Collection
          </div>

          <h2
            className="
              text-lg
              font-bold
              tracking-tight
              text-[#2e2823]
              sm:text-xl
              lg:text-2xl
            "
          >
            {comboName}
          </h2>

          <p className="mx-auto mt-2 max-w-xl  text-[8px] leading-relaxed text-[#806f5e] sm:text-base">
            A carefully selected collection of premium jewellery pieces,
            brought together as one complete combo.
          </p>

          {/* Combo stats */}
          <div className="mt-2 flex flex-wrap justify-center gap-2.5">

            <ComboStat
              icon={Package}
              value={comboItems.length}
              label={
                comboItems.length === 1
                  ? "Product"
                  : "Products"
              }
            />

            {totalNetWeight > 0 && (
              <ComboStat
                icon={Weight}
                value={`${totalNetWeight.toFixed(3)}g`}
                label="Total Net Weight"
              />
            )}

            {totalGrossWeight > 0 && (
              <ComboStat
                icon={Scale}
                value={`${totalGrossWeight.toFixed(3)}g`}
                label="Total Gross Weight"
              />
            )}

            <ComboStat
              icon={ShieldCheck}
              value="Certified"
              label="Quality"
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          PRODUCTS INCLUDED
      ====================================================== */}
      <section>

        <div className="mb-3 flex items-end justify-between gap-4 px-1">

          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#b08d57]">
              Inside Your Combo
            </p>

            <h3 className="text-sm font-bold text-[#2f2924] sm:text-2xl">
              {comboItems.length} Products Included
            </h3>

            <p className="mt-1 text-[8px] text-gray-500">
              Explore every piece included in this collection.
            </p>
          </div>

          <div className="hidden rounded-full bg-[#f7f0e8] px-3 py-1.5 text-xs font-semibold text-[#8f6d3f] sm:block">
            {comboItems.length} {comboItems.length === 1 ? "Piece" : "Pieces"}
          </div>
        </div>

        {/* Responsive grid */}
        <div
          className={`
            grid
            gap-5
            ${comboItems.length === 1
              ? "grid-cols-1 max-w-xl mx-auto"
              : comboItems.length === 2
                ? "grid-cols-1 lg:grid-cols-2"
                : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
            }
          `}
        >
          {comboItems.map((item, index) => (
            <ComboProductCard
              key={
                item.tagKey ||
                item.tagNo ||
                item.itemId ||
                index
              }
              item={item}
              index={index}
              getEncodedImageUrl={getEncodedImageUrl}
              onViewProduct={handleViewProduct}
            />
          ))}
        </div>
      </section>

      {/* =====================================================
          COMBO PRICE SUMMARY
      ====================================================== */}
      <section
        className="
          relative
          overflow-hidden
          rounded-[1.75rem]
          border
          border-[#dcc7aa]
          bg-gradient-to-br
          from-[#fffdf9]
          via-[#faf5ee]
          to-[#f0e3d4]
          p-5
          shadow-[0_15px_50px_rgba(92,60,28,0.08)]
          sm:p-7
        "
      >

        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#b08d57]/10 blur-3xl" />

        <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">

          {/* Left */}
          <div>

            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#b08d57]/10">
                <CircleDollarSign className="h-5 w-5 text-[#a07843]" />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a07843]">
                  Complete Collection
                </p>

                <h3 className="text-xl font-bold text-[#2d2722]">
                  {comboName}
                </h3>
              </div>
            </div>

            <div className="max-w-xl space-y-3">

              <div className="flex items-center justify-between gap-5 border-b border-[#e7d9c9] pb-3">
                <span className="text-sm text-gray-500">
                  Individual product value
                </span>

                <span className="font-semibold text-gray-700">
                  ₹{individualTotal.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              {savings > 0 && (
                <div className="flex items-center justify-between gap-5 border-b border-[#e7d9c9] pb-3">
                  <span className="text-sm text-emerald-600">
                    Combo savings
                  </span>

                  <span className="font-bold text-emerald-600">
                    - ₹{savings.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              )}

              <div className="flex items-end justify-between gap-5 pt-1">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Combo Price
                  </p>

                  <p className="mt-1 text-3xl font-bold text-[#9d713c] sm:text-4xl">
                    ₹{comboPrice.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>

                {savings > 0 && (
                  <div
                    className="
                      rounded-full
                      bg-emerald-50
                      px-3
                      py-1.5
                      text-xs
                      font-bold
                      text-emerald-700
                    "
                  >
                    You Save ₹
                    {savings.toLocaleString("en-IN", {
                      maximumFractionDigits: 0,
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right CTA */}
          <div className="w-full lg:w-[290px]">

            <div className="mb-3 flex items-center justify-center gap-2 text-xs text-[#796750]">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              All products included in one combo
            </div>

            <SmartButton
              onClick={onAddToCart}
              variant="primary"
              hover
              success={cartSuccess}
              className="
                w-full
                rounded-xl
                py-3.5
                text-sm
                font-bold
                shadow-lg
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:shadow-xl
              "
            >
              <ShoppingBag className="mr-2 inline-block h-4 w-4" />

              {isInCart
                ? "✓ Already in Cart"
                : "Add Combo to Cart"}
            </SmartButton>

            <SmartButton
              onClick={onBuyNow}
              variant="primary"
              hover
              className="
                mt-2
                w-full
                rounded-xl
                border
                border-[#b08d57]
                bg-white
                py-3.5
                text-sm
                font-bold
                text-[#8f6d3f]
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-[#b08d57]
                hover:text-white
              "
            >
              Buy Combo Now
            </SmartButton>

            <p className="mt-3 text-center text-[10px] text-gray-400">
              Secure checkout • Quality assured • Free shipping
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};


const ComboStat = ({ icon: Icon, value, label }) => (
  <div
    className="
      flex
      items-center
      gap-2
      rounded-full
      border
      border-[#e6d9ca]
      bg-white/75
      px-3
      py-2
      shadow-sm
      backdrop-blur
    "
  >
    <Icon className="h-4 w-4 text-[#b08d57]" />

    <div className="text-left">
      <p className="text-xs font-bold text-[#4c4035]">
        {value}
      </p>

      <p className="text-[9px] text-gray-400">
        {label}
      </p>
    </div>
  </div>
);


/* =========================================================
   MAIN PRODUCT / COMBO PAGE
========================================================= */

const ProductInfo = ({
  tagKey,
  Authenticated,
}) => {

  const isAuthenticated =
    useSelector(
      (state) => state.user.isAuthenticated
    ) || Authenticated;

  const mobileNumber = useSelector(
    (state) => state.user.user?.contactNumber
  );

  const navigate = useNavigate();

  const [animateHeart, setAnimateHeart] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [showPriceBreakup, setShowPriceBreakup] = useState(false);

  const shareRef = useRef();


  /* =========================================================
     PRODUCT API
  ========================================================= */

  const {
    data: product,
    isLoading,
    error,
  } = useSingleProductQuery(tagKey);


  /* =========================================================
     COMBO DETECTION
  ========================================================= */

  const isCombo = Boolean(product?.ComboId);

  const comboItems =
    product?.ComboItems ||
    product?.Combo?.items ||
    [];


  const comboName =
    product?.ComboName ||
    product?.Combo?.comboName ||
    "Combo";


  const comboPrice = Number(
    product?.ComboPrice ||
    product?.Combo?.comboPrice ||
    product?.FinalAmount ||
    0
  );


  /* =========================================================
     CART / FAVORITES
  ========================================================= */

  const [cartLoading, setCartLoading] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);

  const { addItem } = useRecentlyViewed();

  const {
    cartItems,
    addToCartHandler,
  } = useCart();

  const {
    addToFavorite,
    removeFavorite,
    isFavorite,
  } = useFavorites();


  const cartProducts =
    cartItems?.data?.products || [];

  const isWishlisted =
    isFavorite(tagKey);


  /* =========================================================
     IMAGE URL
  ========================================================= */

  const Base_URL =
    "https://app.bmgjewellers.com";


  const getEncodedImageUrl = (path) => {

    if (!path) return "";

    return `${Base_URL}${path.startsWith("/") ? "" : "/"}${path
      .split("/")
      .map(encodeURIComponent)
      .join("/")}`;
  };


  /* =========================================================
     RECENTLY VIEWED
  ========================================================= */

  useEffect(() => {

    if (product?.TAGKEY) {
      addItem(product.TAGKEY);
    }

  }, [product?.TAGKEY, addItem]);


  /* =========================================================
     SHARE OUTSIDE CLICK
  ========================================================= */

  useEffect(() => {

    const handleClickOutside = (e) => {

      if (
        shareRef.current &&
        !shareRef.current.contains(e.target)
      ) {
        setShowShare(false);
      }

    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, []);


  /* =========================================================
     PRICE
  ========================================================= */

  const getPrice = () => {

    if (isCombo) {
      return comboPrice;
    }

    return Number(
      product?.FinalAmount ||
      product?.RATE ||
      0
    );
  };


  const originalPrice = isCombo
    ? Number(
      product?.Combo?.totalGrandTotal ||
      product?.Combo?.totalFinalAmount ||
      comboPrice
    )
    : Number(product?.GrandTotal || 0);


  const discount = isCombo
    ? Number(product?.OfferPercentage || 0)
    : Number(product?.OfferPercentage || 0);


  /* =========================================================
     CART STATE
  ========================================================= */

  const isInCart =
    Array.isArray(cartProducts) &&
    cartProducts.some(
      (item) =>
        item.TAGKEY === product?.TAGKEY
    );


  /* =========================================================
     ADD TO CART
  ========================================================= */

  const handleAddToCart = (e) => {

    e.preventDefault();
    e.stopPropagation();


    if (!isAuthenticated) {

      toast.error(
        "Please login to add to cart"
      );

      navigate("/login");

      return;
    }


    if (!mobileNumber) {

      setModalOpen(true);

      return;
    }


    /*
      IMPORTANT:

      Your existing cart hook currently receives
      a single product.

      For combo support, your cart API should accept
      ComboId + ComboItems.

      We pass the complete product object because
      ComboItems already exists inside it.
    */

    const cartPayload = isCombo
      ? {
        ...product,

        IsCombo: true,

        ComboId: product.ComboId,

        ComboName: comboName,

        ComboPrice: comboPrice,

        ComboItems: comboItems,
      }
      : product;


    addToCartHandler(cartPayload);


    setCartLoading(false);

    setCartSuccess(true);


    setTimeout(() => {
      setCartSuccess(false);
    }, 2000);

  };


  /* =========================================================
     BUY NOW
  ========================================================= */

  const handleBuyNow = (e) => {

    e.preventDefault();
    e.stopPropagation();


    if (!isAuthenticated) {

      toast.error("Please login");

      navigate("/login");

      return;
    }


    if (!mobileNumber) {

      setModalOpen(true);

      return;
    }


    /* -----------------------------------------------
       COMBO CHECKOUT
    ----------------------------------------------- */

    if (isCombo) {

      const checkoutItems =
        comboItems.map((item) => ({

          productId: item.tagKey,

          itemId: item.itemId,

          tagNo: item.tagNo,

          sno: item.sno,

          productName:
            item.subItemName ||
            item.itemName,

          grossAmount:
            Number(item.grossAmount || 0),

          price:
            Number(item.finalAmount || 0),

          grsWt:
            Number(item.grsWt || 0),

          netWt:
            Number(item.netWt || 0),

          imagePath:
            item.images?.[0] || "",

          quantity:
            Number(item.qty || 1),

          gstType:
            item.gstType,

          gstPer:
            item.gstPer,

          gstAmount:
            Number(item.gstAmount || 0),

          comboId:
            product.ComboId,

          comboName:
            comboName,

          isComboItem: true,

        }));


      navigate("/checkout", {

        state: {

          isCombo: true,

          comboId:
            product.ComboId,

          comboCode:
            product.ComboCode,

          comboName:
            comboName,

          comboPrice:
            comboPrice,

          items:
            checkoutItems,

          subtotal:
            comboPrice,

        },

      });

      return;
    }


    /* -----------------------------------------------
       NORMAL PRODUCT CHECKOUT
    ----------------------------------------------- */

    navigate("/checkout", {

      state: {

        items: [

          {

            productId:
              product.TAGKEY,

            itemId:
              product.ITEMID,

            tagNo:
              product.TAGNO,

            sno:
              product.SNO,

            productName:
              product.SUBITEMNAME ||
              product.ITEMNAME ||
              product.ItemName,

            grossAmount:
              parseFloat(
                product.GrossAmount
              ),

            price:
              parseFloat(
                product.FinalAmount
              ),

            grsWt:
              parseFloat(
                product.GRSWT
              ),

            netWt:
              parseFloat(
                product.NETWT
              ),

            imagePath:
              product.ImagePath
                ? JSON.parse(
                  product.ImagePath
                )[0]
                : "",

            quantity: 1,

            gstType:
              product.GSTType,

            gstPer:
              product.GSTPer,

            gstAmount:
              parseFloat(
                product.GSTAmount
              ),

          },

        ],

        subtotal:
          getPrice(),

      },

    });

  };


  /* =========================================================
     WISHLIST
  ========================================================= */

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


    setTimeout(
      () => setAnimateHeart(false),
      500
    );

  };


  /* =========================================================
     IMAGES
  ========================================================= */

  const images = product?.ImagePath
    ? JSON.parse(product.ImagePath)
      .map(getEncodedImageUrl)
    : [];


  const videos = product?.VideoPath
    ? JSON.parse(product.VideoPath)
      .map(getEncodedImageUrl)
    : [];


  /* =========================================================
     LOADING
  ========================================================= */

  if (isLoading) {
    return <ProductSkeleton />;
  }


  /* =========================================================
     ERROR
  ========================================================= */

  if (error || !product) {

    return (

      <div
        className="
          min-h-screen
          flex items-center justify-center
          bg-gradient-to-b
          from-[#f8f6f2]
          to-[#eeece8]
        "
      >

        <div className="text-center">

          <div className="text-6xl mb-4">
            😕
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Product Not Found
          </h2>

          <p className="text-gray-600 mb-6">
            The product you're looking for
            doesn't exist or has been removed.
          </p>

          <Link
            to="/"
            className="
              inline-block
              bg-[#f16137]
              text-white
              px-6 py-3
              rounded-lg
              hover:bg-[#d84a22]
              transition-colors
            "
          >
            Continue Shopping
          </Link>

        </div>

      </div>
    );
  }


  /* =========================================================
     NORMAL PRODUCT INFO
  ========================================================= */

  const hasWeight =
    product.NETWT &&
    parseFloat(product.NETWT) > 0;


  const hasPurity =
    product.PURITY &&
    product.PURITY !== "0.00" &&
    product.PURITY !== "0";


  const hasMaterial =
    product.MaterialFinish &&
    product.MaterialFinish !== "null" &&
    product.MaterialFinish.trim() !== "";


  const hasSku =
    (product.ITEMID || product.TAGNO) &&
    product.ITEMID !== "null" &&
    product.TAGNO !== "null";


  const hasGender =
    product.Gender &&
    product.Gender !== "null" &&
    product.Gender.trim() !== "";


  const hasOccasion =
    product.Occasion &&
    product.Occasion !== "null" &&
    product.Occasion.trim() !== "";


  const hasCollection =
    product.CollectionType &&
    product.CollectionType !== "null" &&
    product.CollectionType.trim() !== "";


  const hasStone =
    product.STUDDEDSTONE === "Y" ||
    (
      product.STUDDED &&
      product.STUDDED !== "null" &&
      product.STUDDED.trim() !== ""
    );


  const hasCategory =
    product.CATNAME &&
    product.CATNAME !== "null" &&
    product.CATNAME.trim() !== "";


  const hasSubCategory =
    product.SUBITEMNAME &&
    product.SUBITEMNAME !== "null";


  /* =========================================================
     COMBO TOTAL WEIGHT
  ========================================================= */

  const comboTotalWeight =
    comboItems.reduce(
      (sum, item) =>
        sum + Number(item?.netWt || 0),
      0
    );


  const comboTotalProducts =
    comboItems.reduce(
      (sum, item) =>
        sum + Number(item?.qty || 1),
      0
    );


  /* =========================================================
     UI
  ========================================================= */

  return (
    <>
      <UpdateMobileModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />


      <div
        className="
          min-h-screen
          bg-gradient-to-b
          from-[var(--primary-card-color)]
          to-[#eeece8]
          py-6
          px-2
          md:px-4
        "
      >

        <div className="max-w-full sm:max-w-[90%] mx-auto">


          {/* =================================================
              BREADCRUMB
          ================================================= */}

          <div className="mb-2">

            <Breadcrumb />

          </div>


          {/* =================================================
              MAIN CARD
          ================================================= */}


            {isCombo ?
            (
              <ComboProductsShowcase
                product={product}
                getEncodedImageUrl={getEncodedImageUrl}
                navigate={navigate}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                cartSuccess={cartSuccess}
                isInCart={isInCart}
              />
            ) 
            :
            (
              <div
                className="
              grid
              lg:grid-cols-2
              rounded-2xl
              bg-white
              p-4
              shadow-sm
            "
              >


                {/* =================================================
                LEFT - GALLERY
            ================================================= */}

                <div className="max-w-full">

                  <div className="relative">

                    <ImageGallery
                      images={images.map((img) => ({
                        img,
                      }))}
                      videos={videos.map((video) => ({
                        video,
                      }))}
                      badges={{
                        NewArrival:
                          product.NewArrival,

                        Top_Trending:
                          product.Top_Trending,

                        discountPercentage:
                          discount,

                        BestDesign:
                          product.BestDesign === "1" ||
                          product.BestDesign === "Y",
                      }}
                    />



                  </div>

                </div>


                {/* =================================================
                RIGHT - INFO
            ================================================= */}

                <div
                  className="
                space-y-3
                p-2
                animate__animated
                animate__fadeInRight
              "
                >


                  {/* =================================================
                  TITLE + ACTIONS
              ================================================= */}

                  <div className="flex justify-between items-start gap-4">

                    <div className="min-w-0">


                      <h1
                        className="
                      mt-1
                      text-lg
                      md:text-xl
                      font-bold
                      text-gray-900
                    "
                      >
                        {isCombo
                          ? comboName
                          : product.ITEMNAME}
                      </h1>


                      {!isCombo &&
                        product.SUBITEMNAME &&
                        product.SUBITEMNAME !== "null" && (

                          <p
                            className="
                          text-[var(--orange-600)]
                          mt-1
                          text-sm
                          flex
                          items-center
                          gap-1
                        "
                          >

                            <Tag className="w-3 h-3" />

                            {product.SUBITEMNAME}

                          </p>
                        )}


                   

                    </div>


                    {/* ACTIONS */}

                    <div className="flex gap-2 shrink-0">

                      <button
                        onClick={handleWishlist}
                        className={`
                      p-2
                      rounded-full
                      border-2
                      transition-all
                      duration-300
                      transform
                      hover:scale-110

                      ${isWishlisted
                            ? "bg-red-50 border-red-300 text-red-600 hover:bg-red-100"
                            : "border-gray-200 hover:border-[var(--primary-hover-color)] hover:bg-orange-50"
                          }

                      ${animateHeart
                            ? "animate__animated animate__heartBeat"
                            : ""
                          }
                    `}
                      >

                        {isWishlisted ? (
                          <FaHeart className="w-4 h-4" />
                        ) : (
                          <FaRegHeart className="w-4 h-4" />
                        )}

                      </button>


                      <div
                        className="relative"
                        ref={shareRef}
                      >

                        <button
                          onClick={() =>
                            setShowShare(!showShare)
                          }
                          className="
                        p-2
                        rounded-full
                        border-2
                        border-gray-200
                        hover:border-[#f16137]
                        hover:bg-orange-50
                        transition-all
                        duration-300
                        transform
                        hover:scale-110
                      "
                        >

                          <Share2 className="w-4 h-4" />

                        </button>


                        {showShare && (

                          <div
                            className="
                          absolute
                          right-0
                          mt-2
                          w-48
                          bg-white
                          rounded-xl
                          shadow-2xl
                          border
                          border-gray-200
                          p-4
                          z-50
                        "
                          >

                            <h3 className="text-sm font-semibold text-gray-700 mb-3">

                              {isCombo
                                ? "Share this combo"
                                : "Share this product"}

                            </h3>

                            <ShareButtons
                              tagKey={tagKey}
                            />

                          </div>
                        )}

                      </div>

                    </div>

                  </div>


                  {/* =================================================
                  PRICE
              ================================================= */}

                  <div className="flex items-baseline gap-3 flex-wrap">

                    <span
                      className="
                    text-3xl
                    font-bold
                    text-[#f16137]
                  "
                    >
                      ₹{getPrice().toLocaleString("en-IN")}
                    </span>


                    {!isCombo && (

                      discount > 0 && (
                        <>
                          <span className="text-lg text-gray-400 line-through">
                            ₹{originalPrice.toLocaleString("en-IN")}
                          </span>

                          <span
                            className="
                          bg-gradient-to-r
                          from-red-500
                          to-orange-500
                          text-white
                          px-3
                          py-1
                          text-xs
                          rounded-full
                          font-semibold
                          shadow-md
                        "
                          >
                            {discount}% OFF
                          </span>
                        </>
                      )

                    )}

                  </div>




                  {/* =================================================
                  NORMAL PRODUCT SUMMARY
              ================================================= */}

                  {!isCombo &&
                    (hasWeight ||
                      hasPurity ||
                      hasMaterial ||
                      hasGender) && (

                      <div
                        className="
                      grid
                      grid-cols-2
                      md:grid-cols-4
                      gap-3
                      py-2
                    "
                      >

                        <InfoBadge
                          icon={Scale}
                          label="Weight"
                          value={
                            hasWeight
                              ? `${parseFloat(
                                product.NETWT
                              ).toFixed(3)}g`
                              : null
                          }
                        />

                        <InfoBadge
                          icon={Award}
                          label="Purity"
                          value={
                            hasPurity
                              ? `${product.NEWPURITY}%`
                              : null
                          }
                        />

                        <InfoBadge
                          icon={Gem}
                          label="Material"
                          value={
                            hasMaterial
                              ? product.MaterialFinish
                              : null
                          }
                        />

                        <InfoBadge
                          icon={Sparkles}
                          label="Gender"
                          value={
                            hasGender
                              ? product.Gender
                              : null
                          }
                        />

                      </div>
                    )}


           




                  {/* =================================================
                  DELIVERY
              ================================================= */}

                  {isAuthenticated && (

                    <div
                      className="
                    bg-gradient-to-r
                    from-blue-50
                    to-indigo-50
                    p-3
                    sm:p-4
                    rounded-xl
                    border
                    border-blue-100
                  "
                    >

                      <div
                        className="
                      flex
                      items-center
                      gap-1
                      mb-2
                      text-[var(--orange-600)]
                    "
                      >

                        <Truck className="w-4 sm:w-5 h-4 sm:h-5" />

                        <h3
                          className="
                        font-semibold
                        text-lg
                        md:text-xl
                        text-[var(--orange-600)]
                      "
                        >
                          Check Delivery
                        </h3>

                      </div>

                      <PincodeChecker />

                    </div>
                  )}


                  {/* =================================================
                  ASSURANCE
              ================================================= */}

                  <JewelleryBrandAssurance
                    assurances={[
                      {
                        icon: (
                          <Gem className="w-4 h-4" />
                        ),
                        label: "Sterling Silver",
                      },
                      {
                        icon: (
                          <ShieldCheck className="w-4 h-4" />
                        ),
                        label: "BIS Certified",
                      },
                      {
                        icon: (
                          <RefreshCw className="w-4 h-4" />
                        ),
                        label: "30-Day Returns",
                      },
                      {
                        icon: (
                          <Truck className="w-4 h-4" />
                        ),
                        label: "Free Shipping",
                      },
                    ]}
                  />


                  {/* =================================================
                  DESCRIPTION
              ================================================= */}

                  {product.Description &&
                    product.Description !== "null" && (

                      <div
                        className="
                      bg-gradient-to-r
                      from-gray-50
                      to-white
                      p-4
                      rounded-xl
                      border
                      border-gray-100
                    "
                      >

                        <h3
                          className="
                        text-sm
                        font-semibold
                        text-[var(--orange-600)]
                        mb-2
                        flex
                        items-center
                        gap-2
                      "
                        >

                          <Sparkles className="w-4 h-4" />

                          {isCombo
                            ? "Combo Description"
                            : "Product Description"}

                        </h3>

                        <pre
                          className="
                        whitespace-pre-wrap
                        break-words
                        leading-relaxed
                        text-sm
                        w-full
                        overflow-hidden
                        font-sans
                      "
                        >
                          {product.Description}
                        </pre>

                      </div>
                    )}


                  {/* =================================================
                  ACTIONS
              ================================================= */}

                  <div
                    className="
                  flex
                  gap-3
                  pt-2
                "
                  >

                    <SmartButton
                      onClick={handleAddToCart}
                      variant="primary"
                      hover
                      className="
                    w-full
                    py-3
                    text-sm
                    font-semibold
                    rounded-xl
                    shadow-md
                    hover:shadow-xl
                    transition-all
                    duration-300
                    transform
                    hover:-translate-y-0.5
                  "
                      success={cartSuccess}
                      isLoading={cartLoading}
                      isDisabled={isInCart}
                    >

                      {isInCart
                        ? "✓ Already in Cart"
                        : isCombo
                          ? "🛒 Add Combo to Cart"
                          : "🛒 Add to Cart"}

                    </SmartButton>


                    <SmartButton
                      onClick={handleBuyNow}
                      className="
                    w-full
                    py-3
                    text-sm
                    font-semibold
                    rounded-xl
                    shadow-md
                    hover:shadow-xl
                    transition-all
                    duration-300
                    transform
                    hover:-translate-y-0.5
                  "
                      variant="primary"
                      hover
                    >

                      {isCombo
                        ? "⚡ Buy Combo Now"
                        : "⚡ Buy Now"}

                    </SmartButton>

                  </div>


                  {/* =================================================
                  PRODUCT DETAILS
              ================================================= */}

                  {!isCombo &&
                    (hasCategory ||
                      hasSubCategory ||
                      hasCollection ||
                      hasOccasion ||
                      hasSku ||
                      hasStone) && (

                      <div
                        className="
                      bg-gray-50/80
                      backdrop-blur-sm
                      p-4
                      rounded-xl
                      border
                      border-gray-100
                      space-y-3
                    "
                      >

                        <h3
                          className="
                        text-sm
                        font-semibold
                        text-[var(--orange-600)]
                        flex
                        items-center
                        gap-2
                      "
                        >

                          <Tag className="w-4 h-4" />

                          Product Details

                        </h3>


                        <div className="grid grid-cols-2 gap-3">

                          {hasCategory && (

                            <div className="flex flex-col">

                              <span className="text-xs text-gray-500">
                                Category
                              </span>

                              <span className="font-medium">
                                {product.CATNAME}
                              </span>

                            </div>

                          )}


                          {hasSubCategory && (

                            <div className="flex flex-col">

                              <span className="text-xs text-gray-500">
                                Sub Category
                              </span>

                              <span className="font-medium">
                                {product.SUBITEMNAME}
                              </span>

                            </div>

                          )}


                          {hasCollection && (

                            <div className="flex flex-col">

                              <span className="text-xs text-gray-500">
                                Collection
                              </span>

                              <span className="font-medium">
                                {product.CollectionType}
                              </span>

                            </div>

                          )}


                          {hasOccasion && (

                            <div className="flex flex-col">

                              <span className="text-xs text-gray-500">
                                Occasion
                              </span>

                              <span className="font-medium">
                                {product.Occasion.replace(
                                  /_/g,
                                  " "
                                )}
                              </span>

                            </div>

                          )}


                          {hasSku && (

                            <div className="flex flex-col">

                              <span className="text-xs text-gray-500">
                                SKU
                              </span>

                              <span className="font-medium">
                                {product.ITEMID}-{product.TAGNO}
                              </span>

                            </div>

                          )}


                          {hasStone && (

                            <div className="flex flex-col">

                              <span className="text-xs text-gray-500">
                                Stone Type
                              </span>

                              <span className="font-medium">
                                {product.STUDDEDSTONE === "Y"
                                  ? "Studded"
                                  : product.STUDDED ||
                                  "None"}
                              </span>

                            </div>

                          )}

                        </div>

                      </div>

                    )}


              
                </div>

              </div> 
            )}
          {/* =================================================
              PRICE BREAKUP
          ================================================= */}

          {!isCombo && (

            <div className="mt-4">

              <button
                onClick={() =>
                  setShowPriceBreakup(
                    !showPriceBreakup
                  )
                }
                className="
                  w-full
                  bg-white/90
                  backdrop-blur-sm
                  border
                  border-gray-200
                  p-4
                  rounded-2xl
                  shadow-md
                  hover:shadow-lg
                  transition-all
                  duration-300
                  flex
                  items-center
                  justify-between
                "
              >

                <span
                  className="
                    font-semibold
                    text-gray-700
                    flex
                    items-center
                    gap-2
                  "
                >

                  <Award className="w-5 h-5 text-[#f16137]" />

                  View Price Breakup &
                  Care Instructions

                </span>


                <ChevronDown
                  className={`
                    transition-transform
                    duration-300
                    ${showPriceBreakup
                      ? "rotate-180"
                      : ""
                    }
                  `}
                />

              </button>


              {showPriceBreakup && (

                <div className="animate__animated animate__fadeIn">

                  <PriceBreakup
                    product={product}
                    showPriceBreakup={
                      showPriceBreakup
                    }
                  />

                </div>

              )}

            </div>

          )}


     


          {/* =================================================
              JEWELLERY CARE
          ================================================= */}

          <div
            className="
              mt-4
              bg-white/90
              backdrop-blur-sm
              rounded-2xl
              border
              border-gray-200
              p-6
              shadow-lg
            "
          >

            <h3
              className="
                text-lg
                font-semibold
                mb-4
                flex
                items-center
                gap-2
              "
            >

              <Sparkles className="w-5 h-5 text-[#f16137]" />

              Jewellery Care Guide

            </h3>


            <div className="grid md:grid-cols-3 gap-4">

              {[
                {
                  icon: "💧",
                  text: "Avoid contact with water, perfume & chemicals",
                },
                {
                  icon: "📦",
                  text: "Store in airtight box when not wearing",
                },
                {
                  icon: "🧼",
                  text: "Clean gently with soft cloth only",
                },
                {
                  icon: "😴",
                  text: "Remove before sleeping or exercising",
                },
                {
                  icon: "☀️",
                  text: "Avoid direct sunlight and heat",
                },
                {
                  icon: "🔧",
                  text: "Professional cleaning recommended yearly",
                },
              ].map((tip, i) => (

                <div
                  key={i}
                  className="
                    flex
                    items-start
                    gap-3
                    p-3
                    bg-gray-50
                    rounded-xl
                    hover:bg-orange-50
                    transition-all
                  "
                >

                  <span className="text-2xl">
                    {tip.icon}
                  </span>

                  <p className="text-sm text-gray-600">
                    {tip.text}
                  </p>

                </div>

              ))}

            </div>

          </div>


          {/* =================================================
              RELATED PRODUCTS
          ================================================= */}

          <div className="mt-6">

            <Shoprelated
              itemCtrId={
                product.ITEMCTRID
              }
            />

          </div>

        </div>

      </div>
    </>
  );
};


export default ProductInfo;