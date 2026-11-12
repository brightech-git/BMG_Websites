import { formatCurrency, formatNumber, formatWeight } from '../../../../utils/index.js';
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

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
  Icon,
} from "lucide-react";

import { useSingleProductQuery } from "../../hooks/product/useSingleProductQuery";
import { useCart } from "../../../cart/hooks/cart/useCartQuery";
import { useFavorites } from "../../../wishlist/hooks/favorites/useFavoritesQuery";
import { useRecentlyViewed } from "../../hooks/recentlyViewed/useRecentlyViewedQuery";

import { toast } from "react-toastify";

import ImageGallery from "./ImageGallery";
import PriceBreakup from "./PriceBreakUp";
import Shoprelated from "../../../../components/layouts/Shoprelated";
import Breadcrumb from "../../../../components/layouts/Breadcrumb";
import JewelleryBrandAssurance from "../../../../components/layouts/JewelleryBrandAssurance";
import UpdateMobileModal from "../../../../components/layouts/UpdateMobileModal";
import { useSelector } from "react-redux";
import { ShareButtons } from "../../../../components/share/Share";
import SmartButton from "../../../../components/ui/SmartButton";
import PincodeChecker from "../../../../component/pincode/PincodeCheck";

import "animate.css";

const JEWELLERY_CARE_TIPS = [
  "Avoid water, perfume, and chemicals.",
  "Store in an airtight box when not wearing.",
  "Clean gently with a soft cloth.",
  "Remove before sleeping or exercising.",
  "Keep away from direct sunlight and heat.",
  "Consider professional cleaning once a year.",
];


/* =========================================================
   SKELETON
========================================================= */

const ProductSkeleton = () => (
  <div className="animate-pulse bg-gradient-to-b from-[var(--orange-50)] to-[var(--orange-100)] min-h-screen p-4">

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

      <Icon className="w-4 h-4 text-[var(--brand-primary)]" />

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
          bg-[var(--orange-50)]
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
            text-[var(--brand-primary)]
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

            <p className="mt-1 truncate text-xs text-[var(--brand-primary)]">
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
              {formatWeight(item.netWt)}
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
              {formatNumber(item.purity, 2)}%
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

          <span className="text-sm font-bold text-[var(--brand-primary)]">
            {formatCurrency(Number(item?.finalAmount || 0))}
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
              text-[var(--brand-primary)]
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
            bg-[var(--brand-primary)]/10
            px-3 py-1
            text-xs
            font-semibold
            text-[var(--brand-primary)]
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

          <p className="mt-1 text-3xl font-bold text-[var(--brand-primary)]">
            {formatCurrency(comboPrice)}
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
          <ShoppingBag className="h-6 w-6 text-[var(--brand-primary)]" />
        </div>

      </div>


      <div className="mt-4 space-y-2 border-t border-orange-100 pt-3">

        <div className="flex justify-between text-sm">

          <span className="text-gray-500">
            Individual products
          </span>

          <span className="font-medium text-gray-700">
            {formatCurrency(individualTotal)}
          </span>

        </div>


        <div className="flex justify-between text-sm">

          <span className="text-gray-500">
            Combo price
          </span>

          <span className="font-semibold text-[var(--brand-primary)]">
            {formatCurrency(comboPrice)}
          </span>

        </div>


        {savings > 0 && (
          <div className="flex justify-between pt-1">

            <span className="text-sm font-medium text-emerald-600">
              You Save
            </span>

            <span className="text-sm font-bold text-emerald-600">
              {formatCurrency(savings)}
            </span>

          </div>
        )}

      </div>

    </div>
  );
};

const Cards = ({
  icon: Icon,
  title,
  value,
}) => {
  return (
    <div
      className="
        rounded-xl
        border
        border-[#eee5dc]
        bg-[#fcfaf8]
        p-3
      "
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-[var(--brand-primary)]" />

        <p className="text-[10px] text-gray-400">
          {title}
        </p>
      </div>

      <p className="mt-0.5 text-sm font-bold text-[#342c25]">
        {value}
      </p>
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
     
        hover:shadow-[0_20px_55px_rgba(80,50,20,0.12)]
      "
    >
      {/* =====================================================
          IMAGE AREA
      ====================================================== */}
      <div className="relative bg-gradient-to-br from-[#faf7f3] via-[#f7f1eb] to-[#eee5dc]">

        {/* Product Number */}
        <div className="absolute left-4 top-2 z-10">
          <div
            className="
              flex h-8 max-w-8 items-center justify-center
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
        <div className="absolute right-4 top-2 z-10">
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
                    ? "border-[var(--brand-primary)] shadow-md scale-105"
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
            <Package className="h-4 w-4 text-[var(--brand-primary)]" />

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
              {formatCurrency(price)}
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
              <Cards icon={Weight} title={"Net Weight"} value={formatWeight(netWeight)}  />
          )}

          {purity && (
            <Cards icon={Gem} title={"Purity"} value={`${purity} ${!String(purity).includes("%") && "%"}`}  />
             
          
          )}

       
            <Cards icon={Layers3} title={"Pieces"} value={`${pcs}`} />
            
          {grossWeight > 0 && (
            <Cards icon={Scale} title={"Grs Weight"} value={formatWeight(grossWeight)} />
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
              <Ruler className="h-4 w-4 text-[var(--brand-primary)]" />

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
                    value={formatWeight(grossWeight)}
                  />
                )}

                {netWeight > 0 && (
                  <DetailRow
                    label="Net Weight"
                    value={formatWeight(netWeight)}
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
                    value={formatCurrency(makingCharges)}
                  />
                )}

                {stoneAmount > 0 && (
                  <DetailRow
                    label="Stone Amount"
                    value={formatCurrency(stoneAmount)}
                  />
                )}

                {gstAmount > 0 && (
                  <DetailRow
                    label={`GST${gstPer ? ` (${gstPer})` : ""}`}
                    value={formatCurrency(gstAmount)}
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
        {/* {item.tagKey && (
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
              border-[var(--brand-primary)]
              bg-white
              px-4
              py-3
              text-sm
              font-semibold
              text-[var(--brand-hover)]
              transition-all
              duration-300
              hover:bg-[var(--brand-primary)]
              hover:text-white
            "
          >
            <Eye className="h-4 w-4" />
            View Individual Product
            <ArrowRight className="h-4 w-4" />
          </button>
        )} */}
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

    navigate(`/products-page/${tagKey}`);
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
          border-[var(--brand-border)]
          bg-gradient-to-br
          from-[var(--white-color)]
          via-[var(--orange-50)]
          to-[var(--orange-100)]
          p-5
          sm:p-8
        "
      >
        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[var(--brand-primary)]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-[var(--orange-300)]/10 blur-3xl" />

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
              border-[var(--brand-border)]
              bg-white/80
              px-4
              py-2
              text-[10px]
              font-bold
              uppercase
              tracking-[0.2em]
              text-[var(--brand-hover)]
              shadow-sm
              backdrop-blur
            "
          >
            <Sparkles className="h-3.5 w-3.5" />
            Exclusive Combo Collection
          </div>

          <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">
            {comboName}
          </h1>

          <p className="mx-auto mt-2 max-w-xl  text-sm leading-relaxed text-[var(--orange-900)] sm:text-base">
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
                value={formatWeight(totalNetWeight)}
                label="Total Net Weight"
              />
            )}

            {totalGrossWeight > 0 && (
              <ComboStat
                icon={Scale}
                value={formatWeight(totalGrossWeight)}
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
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
              Inside Your Combo
            </p>

            <h3 className="text-sm font-bold text-[#2f2924] sm:text-2xl">
              {comboItems.length} Products Included
            </h3>

            <p className="mt-1 text-sm text-stone-600">
              Explore every piece included in this collection.
            </p>
          </div>

          <div className="hidden rounded-full bg-[var(--orange-50)] px-3 py-1.5 text-xs font-semibold text-[var(--brand-hover)] sm:block">
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
          p-3
          shadow-[0_15px_50px_rgba(92,60,28,0.08)]
          sm:p-4
        "
      >

        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[var(--brand-primary)]/10 blur-3xl" />

        <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">

          {/* Left */}
          <div>

            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--brand-primary)]/10">
                <CircleDollarSign className="h-5 w-5 text-[#a07843]" />
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#a07843]">
                  Complete Collection
                </p>

                <h3 className="text-lg font-bold text-[#2d2722]">
                  {comboName}
                </h3>
              </div>
            </div>

            <div className="max-w-xl space-y-3">

              <div className="flex items-center justify-between gap-5 border-b border-[#e7d9c9] pb-3">
                <span className="text-xs text-gray-500">
                  Individual product value
                </span>

                <span className="font-semibold text-xs text-gray-700">
                  {formatCurrency(individualTotal)}
                </span>
              </div>

              {savings > 0 && (
                <div className="flex items-center justify-between gap-5 border-b border-[#e7d9c9] pb-3">
                  <span className="text-sm text-emerald-600">
                    Combo savings
                  </span>

                  <span className="font-bold text-emerald-600">
                    - {formatCurrency(savings)}
                  </span>
                </div>
              )}

              <div className="flex items-end justify-between gap-3 pt-1">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Combo Price
                  </p>

                  <p className="mt-1 text-lg font-bold text-[#9d713c] sm:text-xl">
                    {formatCurrency(comboPrice)}
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
                    You save {formatCurrency(savings)}
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
              isDisabled = {isInCart}
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
                border-[var(--brand-primary)]
            
                py-3.5
                text-sm
                font-bold
            
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-0.5
               
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
    <Icon className="h-4 w-4 text-[var(--brand-primary)]" />

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
  const [showPriceBreakup, setShowPriceBreakup] = useState(true);

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

  console.log(isInCart, "isInCart")

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

    console.log(cartPayload,'cartPayload')
  


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
          from-[var(--orange-50)]
          to-[var(--orange-100)]
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
              bg-[var(--brand-primary)]
              text-white
              px-6 py-3
              rounded-lg
              hover:bg-[var(--brand-hover)]
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


  const details = [
    { label: "Category", value: hasCategory && product.CATNAME },
    { label: "Subcategory", value: hasSubCategory && product.SUBITEMNAME },
    { label: "Collection", value: hasCollection && product.CollectionType },
    { label: "Occasion", value: hasOccasion && product.Occasion },
    { label: "SKU", value: hasSku && [product.ITEMID, product.TAGNO].filter(Boolean).join("-") },
    { label: "Stone type", value: hasStone && (product.STUDDEDSTONE === "Y" ? "Studded" : product.STUDDED) },
  ].filter(({ value }) => value);

  const attributes = [
    { icon: Scale, label: "Net weight", value: hasWeight && formatWeight(product.NETWT) },
    { icon: Award, label: "Purity", value: hasPurity && `${product.NEWPURITY || product.PURITY}%` },
    { icon: Gem, label: "Material", value: hasMaterial && product.MaterialFinish },
    { icon: Sparkles, label: "Gender", value: hasGender && product.Gender },
  ].filter(({ value }) => value);

  return (
    <div className="bg-[var(--orange-50)] px-3 py-5 sm:px-6 sm:py-8">
      <UpdateMobileModal open={modalOpen} onClose={() => setModalOpen(false)} />

      <div className="mx-auto max-w-7xl space-y-5">
        <Breadcrumb />

        {isCombo ? (
          <ComboProductsShowcase
            product={product}
            getEncodedImageUrl={getEncodedImageUrl}
            navigate={navigate}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            cartSuccess={cartSuccess}
            isInCart={isInCart}
          />
        ) : (
          <>
            <section className="grid items-start gap-5 rounded-2xl border border-[var(--brand-border)] bg-white p-3 sm:gap-8 sm:p-6 lg:grid-cols-2">
              <div className="min-w-0 overflow-hidden rounded-xl bg-orange-50">
                <ImageGallery
                  label={product.ITEMNAME || product.SUBITEMNAME || "Product image"}
                  images={images.map((img) => ({ img }))}
                  videos={videos.map((video) => ({ video }))}
                  badges={{
                    NewArrival: product.NewArrival,
                    Top_Trending: product.Top_Trending,
                    discountPercentage: discount,
                    BestDesign: product.BestDesign === "1" || product.BestDesign === "Y",
                  }}
                />
              </div>

              <div className="min-w-0 space-y-5 py-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    {hasSubCategory && (
                      <p className="mb-1 text-sm font-bold !text-[var(--brand-hover)]">{product.SUBITEMNAME}</p>
                    )}
                    <h1 className="m-0 break-words text-2xl font-bold leading-tight sm:text-4xl">
                      {product.ITEMNAME || product.SUBITEMNAME || "Jewellery"}
                    </h1>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={handleWishlist}
                      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                      aria-pressed={isWishlisted}
                      className="grid h-11 w-11 place-items-center rounded-xl border border-orange-200 bg-orange-50 text-[var(--brand-hover)] hover:bg-orange-100"
                    >
                      <Heart
                        size={19}
                        fill={isWishlisted ? "currentColor" : "none"}
                        className={animateHeart ? "motion-safe:animate-pulse" : ""}
                        aria-hidden="true"
                      />
                    </button>

                    <div ref={shareRef} className="relative">
                      <button
                        type="button"
                        onClick={() => setShowShare((open) => !open)}
                        aria-label="Share this product"
                        aria-expanded={showShare}
                        className="grid h-11 w-11 place-items-center rounded-xl border border-orange-200 bg-orange-50 text-[var(--brand-hover)] hover:bg-orange-100"
                      >
                        <Share2 size={19} aria-hidden="true" />
                      </button>
                      {showShare && (
                        <div className="absolute right-0 z-20 mt-2 w-48 rounded-xl border border-orange-100 bg-white p-3 shadow-lg">
                          <ShareButtons tagKey={tagKey} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-baseline gap-2.5">
                  <span className="text-3xl font-bold tabular-nums text-[var(--brand-hover)]">
                    {formatCurrency(getPrice())}
                  </span>
                  {discount > 0 && (
                    <>
                      <del className="text-sm tabular-nums text-stone-600">{formatCurrency(originalPrice)}</del>
                      <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-bold text-[var(--brand-hover)]">
                        {formatNumber(discount, 0)}% off
                      </span>
                    </>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-2 min-[360px]:grid-cols-2">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isInCart || cartLoading || cartSuccess}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[var(--brand-primary)] px-3 font-bold text-[var(--brand-hover)] hover:bg-orange-50 disabled:opacity-60"
                  >
                    <ShoppingBag size={18} aria-hidden="true" />
                    {isInCart || cartSuccess ? "Added to cart" : cartLoading ? "Loading cart…" : "Add to cart"}
                  </button>
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-3 font-bold text-white hover:bg-[var(--brand-hover)]"
                  >
                    Buy now <ArrowRight size={18} aria-hidden="true" />
                  </button>
                </div>

                {isAuthenticated && (
                  <div className="rounded-xl border border-orange-100 bg-orange-50 p-3 sm:p-4">
                    <h2 className="mb-2 flex items-center gap-2 text-base font-bold">
                      <Truck size={18} className="text-[var(--brand-primary)]" aria-hidden="true" />
                      Check delivery
                    </h2>
                    <PincodeChecker />
                  </div>
                )}

                {attributes.length > 0 && (
                  <dl className="grid grid-cols-2 gap-2 sm:gap-3">
                    {attributes.map(({ icon: AttributeIcon, label, value }) => (
                      <div key={label} className="min-w-0 rounded-xl border border-orange-100 p-3">
                        <dt className="flex items-center gap-1.5 text-xs text-stone-600">
                          <AttributeIcon size={15} className="shrink-0 text-[var(--brand-primary)]" aria-hidden="true" />
                          {label}
                        </dt>
                        <dd className="mb-0 mt-1 break-words text-sm font-bold">{value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                  <JewelleryBrandAssurance
                    assurances={[
                      { icon: <Gem size={16} />, label: "Sterling Silver" },
                      { icon: <ShieldCheck size={16} />, label: "BIS Certified" },
                      { icon: <RefreshCw size={16} />, label: "30-Day Returns" },
                      { icon: <Truck size={16} />, label: "Free Shipping" },
                    ]}
                  />
              </div>
               
            </section>

            <section className="rounded-2xl border border-[var(--brand-border)] bg-white p-4 sm:p-6">
              <h2 className="mb-3 text-xl font-bold">Product details</h2>
              {product.Description && product.Description !== "null" && (
                <p className="mb-4 whitespace-pre-wrap break-words leading-relaxed !text-stone-700">
                  {product.Description}
                </p>
              )}
              {details.length > 0 && (
                <dl className="m-0 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {details.map(({ label, value }) => (
                    <div key={label} className="min-w-0 rounded-xl bg-orange-50 p-3">
                      <dt className="text-xs text-stone-600">{label}</dt>
                      <dd className="mb-0 mt-1 break-words text-sm font-bold">{value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              <div className="mt-4 border-t border-orange-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPriceBreakup((open) => !open)}
                  aria-expanded={showPriceBreakup}
                  aria-controls="product-price-breakdown"
                  className="flex min-h-11 w-full items-center justify-between gap-2 rounded-xl bg-orange-50 px-3 text-left font-bold text-[var(--brand-hover)] hover:bg-orange-100"
                >
                  Price breakdown
                  <ChevronDown size={18} className={showPriceBreakup ? "rotate-180" : ""} aria-hidden="true" />
                </button>
                {showPriceBreakup && (
                  <div id="product-price-breakdown" className="mt-3 overflow-x-auto">
                    <PriceBreakup product={product} showPriceBreakup={showPriceBreakup} />
                  </div>
                )}
              </div>
            </section>

          
          </>
        )}

        <section className="rounded-2xl border border-[var(--brand-border)] bg-white p-4 sm:p-6">
          <h2 className="mb-3 flex items-center gap-2 text-xl font-bold">
            <Sparkles size={19} className="text-[var(--brand-primary)]" aria-hidden="true" />
            Jewellery care
          </h2>
          <ul className="m-0 grid list-none gap-2 p-0 text-sm text-stone-700 sm:grid-cols-2 lg:grid-cols-3">
            {JEWELLERY_CARE_TIPS.map((tip) => (
              <li key={tip} className="flex items-start gap-2 rounded-xl bg-orange-50 p-3">
                <Check size={16} className="mt-0.5 shrink-0 text-[var(--brand-primary)]" aria-hidden="true" />
                {tip}
              </li>
            ))}
          </ul>
        </section>

        <Shoprelated itemCtrId={product.ITEMCTRID} />
      </div>
    </div>
  );
};

export default ProductInfo;
