'use client';

import React, { useMemo, useState } from 'react';

import {
  faBox,
  faBoxOpen,
  faSpinner,
  faImage,
  faReceipt,
  faTimesCircle,
  faTruck,
  faShoppingBag,
  faInfoCircle,
  faMapMarkerAlt,
  faCreditCard,
  faChevronRight,
  faChevronDown,
  faChevronUp,
  faLocationDot,
  faPhone,
  faStore,
  faRotate,
  faBan,
  faCircleCheck,
  faClock,
  faCube,
  faWeightHanging,
  faTag,
  faMoneyBillWave,
  faShieldAlt,
} from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Link, useNavigate, useParams } from 'react-router-dom';

import { toast } from 'react-toastify';

import SmartButton from '../../../../../components/ui/SmartButton';

import TrackOrderModal from '../../../../../components/wrapper/TrackOrderModal';
import HorizontalTimeline from '../../../../../components/ui/HorizontalTimeLine';

import { ORDER_STATUS_MASTER } from '../../../../orders/constants/orderStatusMaster';

import { useCreateReOrder } from '../../../../orders/hooks/order/useReorder';
import { useCancelOrder } from '../../../../orders/hooks/order/useOrderMutation';
import {
  useTrackingById,
  useOrderStatusMaster,
} from '../../../../orders/hooks/order/useOrderTracking';

import { getImage } from '../../../../../utils/getProductImages';
import { formatCurrency, formatDate, formatDateTime } from '../../../../../utils/index.js';


/* =========================================================
   HELPERS
========================================================= */

const safeNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

/* =========================================================
   STATUS HELPERS
========================================================= */

const getStatusLabel = (status) => {
  const map = {
    PENDING: 'Pending',
    PLACED: 'Order Placed',
    IN_PROCESSING: 'Processing',
    PROCESSING: 'Processing',
    PACKED: 'Packed',
    SHIPPED: 'Shipped',
    SHIPPING: 'Shipping',
    Booked: 'Booked',
    OUT_FOR_DELIVERY: 'Out for Delivery',
    IN_TRANSIT: 'In Transit',
    DELIVERED: 'Delivered',
    DELIVERY_FAILED: 'Delivery Failed',
    CANCELLED: 'Cancelled',
  };

  return map[status] || status || 'Unknown';
};

const getStatusColor = (status) => {
  const map = {
    DELIVERED:
      'bg-emerald-50 text-emerald-700 border-emerald-200',

    SHIPPED:
      'bg-blue-50 text-blue-700 border-blue-200',

    SHIPPING:
      'bg-blue-50 text-blue-700 border-blue-200',

    OUT_FOR_DELIVERY:
      'bg-indigo-50 text-indigo-700 border-indigo-200',

    IN_TRANSIT:
      'bg-indigo-50 text-indigo-700 border-indigo-200',

    IN_PROCESSING:
      'bg-amber-50 text-amber-700 border-amber-200',

    PROCESSING:
      'bg-amber-50 text-amber-700 border-amber-200',

    PACKED:
      'bg-violet-50 text-violet-700 border-violet-200',

    PENDING:
      'bg-orange-50 text-orange-700 border-orange-200',

    PLACED:
      'bg-orange-50 text-orange-700 border-orange-200',

    CANCELLED:
      'bg-rose-50 text-rose-700 border-rose-200',

    DELIVERY_FAILED:
      'bg-red-50 text-red-700 border-red-200',
  };

  return (
    map[status] ||
    'bg-gray-50 text-gray-700 border-gray-200'
  );
};


/* =========================================================
   REUSABLE CARD
========================================================= */

const SectionCard = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`
        bg-white/95
        backdrop-blur-md
        rounded-2xl
        border border-[#FED7AA]
        shadow-lg shadow-[#F97316]/5
        overflow-hidden
        ${className}
      `}
    >
      {children}
    </div>
  );
};


/* =========================================================
   SECTION HEADER
========================================================= */

const SectionHeader = ({
  icon,
  title,
  description,
  rightContent,
}) => {
  return (
    <div
      className="
        px-4 py-3
        bg-gradient-to-r
        from-[#FFF7ED]
        via-[#FFF3E8]
        to-[#FFEDD5]
        border-b border-[#FED7AA]
        flex items-center justify-between
        gap-3
      "
    >
      <div className="flex items-center gap-2.5">
        <div
          className="
            w-8 h-8
            rounded-xl
            bg-gradient-to-br
            from-[#F97316]
            to-[#EA580C]
            flex items-center justify-center
            shadow-md shadow-orange-200
            flex-shrink-0
          "
        >
          <FontAwesomeIcon
            icon={icon}
            className="text-white text-xs"
          />
        </div>

        <div>
          <h3 className="font-bold text-sm sm:text-base text-[#7C2D12]">
            {title}
          </h3>

          {description && (
            <p className="text-[12px] sm:text-xs text-[#9A3412] mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>

      {rightContent}
    </div>
  );
};


/* =========================================================
   INFO ITEM
========================================================= */

const InfoItem = ({
  icon,
  label,
  value,
  valueClassName = '',
}) => {
  return (
    <div className="flex items-start gap-2">
      {icon && (
        <FontAwesomeIcon
          icon={icon}
          className="text-[#F97316] text-[12px] mt-1 w-3"
        />
      )}

      <div className="min-w-0">
        <p className="text-[12px] text-[#A16207]">
          {label}
        </p>

        <p
          className={`
            text-xs sm:text-sm
            font-medium
            text-[#7C2D12]
            break-words
            ${valueClassName}
          `}
        >
          {value || 'N/A'}
        </p>
      </div>
    </div>
  );
};


/* =========================================================
   STATUS BADGE
========================================================= */

const StatusBadge = ({ status }) => {
  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1.5
        px-3 py-1.5
        rounded-xl
        text-[12px] sm:text-xs
        font-semibold
        border
        ${getStatusColor(status)}
      `}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />

      {getStatusLabel(status)}
    </span>
  );
};


/* =========================================================
   ORDER HEADER
========================================================= */

const OrderHeader = ({
  orderId,
  status,
  canCancel,
  onCancel,
  isCancelling,
  onTrack,
}) => {
  return (
    <SectionCard>
      <div className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

          <div className="flex flex-wrap items-center gap-2">

            <div
              className="
                flex items-center gap-2
                bg-[#FFF7ED]
                border border-[#FED7AA]
                px-3 py-2
                rounded-xl
              "
            >
              <FontAwesomeIcon
                icon={faReceipt}
                className="text-[#F97316]"
              />

              <div>
                <p className="text-[11px] uppercase tracking-wide text-[#A16207]">
                  Order ID
                </p>

                <p className="font-mono font-bold text-xs sm:text-sm text-[#7C2D12]">
                  {orderId}
                </p>
              </div>
            </div>

            <StatusBadge status={status} />

          </div>


          <div className="flex items-center gap-2">

            {canCancel && (
              <SmartButton
                onClick={onCancel}
                disabled={isCancelling}
                size="sm"
                variant="ghost"
                className="
                  !px-3 !py-2
                  rounded-xl
                  border border-rose-200
                  hover:bg-rose-50
                "
              >
                <span className="flex items-center gap-1.5 text-rose-600">
                  <FontAwesomeIcon
                    icon={isCancelling ? faSpinner : faTimesCircle}
                    spin={isCancelling}
                  />

                  <span className="text-[12px] font-semibold">
                    Cancel
                  </span>
                </span>
              </SmartButton>
            )}

            <SmartButton
              onClick={onTrack}
              size="sm"
              variant="ghost"
              className="
                !px-3 !py-2
                rounded-xl
                border border-[#FED7AA]
                hover:bg-[#FFF7ED]
              "
            >
              <span className="flex items-center gap-1.5 text-[#EA580C]">
                <FontAwesomeIcon icon={faTruck} />

                <span className="text-[12px] font-semibold">
                  Track Order
                </span>
              </span>
            </SmartButton>

          </div>
        </div>
      </div>
    </SectionCard>
  );
};


/* =========================================================
   COMBO PRODUCT CARD
========================================================= */

const ComboProductCard = ({ item, index }) => {
  return (
    <div
      className="
        bg-white
        border border-[#FDE1C7]
        rounded-xl
        p-2.5 sm:p-3
        hover:border-[#F97316]/40
        hover:shadow-md
        transition-all
      "
    >
      <div className="flex gap-3">

        {/* IMAGE */}

        <div
          className="
            w-20 h-20
            sm:w-24 sm:h-24
            rounded-xl
            overflow-hidden
            flex-shrink-0
            bg-gradient-to-br
            from-[#FFF7ED]
            to-[#FFEDD5]
            border border-[#FED7AA]
          "
        >
          {item.image_path ? (
            <img
              src={getImage(item.image_path)}
              alt={item.product_name}
              className="
                w-full h-full
                object-cover
                hover:scale-105
                transition-transform duration-500
              "
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FontAwesomeIcon
                icon={faImage}
                className="text-[#FDBA74] text-xl"
              />
            </div>
          )}
        </div>


        {/* PRODUCT DETAILS */}

        <div className="flex-1 min-w-0">

          <div className="flex justify-between gap-2">

            <div className="min-w-0">

              <p className="text-[11px] uppercase tracking-wider text-[#F97316] font-semibold">
                Combo Item {index + 1}
              </p>

              <h4
                className="
                  font-bold
                  text-xs sm:text-sm
                  text-[#7C2D12]
                  line-clamp-2
                  mt-0.5
                "
              >
                {item.product_name}
              </h4>

            </div>

            <span
              className="
                flex-shrink-0
                px-2 py-1
                rounded-lg
                bg-[#FFF7ED]
                border border-[#FED7AA]
                text-[11px]
                font-semibold
                text-[#9A3412]
              "
            >
              x{item.quantity || 1}
            </span>

          </div>


          {/* IDENTIFIERS */}

          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">

            <span className="text-[11px] text-[#9A3412]">
              Item ID:
              <b className="ml-1 text-[#7C2D12]">
                {item.itemid}
              </b>
            </span>

            <span className="text-[11px] text-[#9A3412]">
              Tag:
              <b className="ml-1 text-[#7C2D12]">
                {item.tagno}
              </b>
            </span>

          </div>


          {/* PRICE */}

          <div className="flex items-end justify-between gap-2 mt-2">

            <div className="flex flex-wrap gap-2">

              {item.net_wt != null && (
                <span className="inline-flex items-center gap-1 text-[11px] text-[#9A3412]">
                  <FontAwesomeIcon
                    icon={faWeightHanging}
                    className="text-[#F97316]"
                  />

                  {Number(item.net_wt).toFixed(3)}g
                </span>
              )}

              {item.gst_per && (
                <span className="inline-flex items-center gap-1 text-[11px] text-[#9A3412]">
                  <FontAwesomeIcon
                    icon={faTag}
                    className="text-[#F97316]"
                  />

                  GST {item.gst_per}
                </span>
              )}

            </div>

            <div className="text-right">

              <p className="text-[11px] text-[#A16207]">
                Item Value
              </p>

              <p className="font-bold text-sm text-[#EA580C]">
                {formatCurrency(item.price)}
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* ITEM PRICE DETAILS */}

      <div
        className="
          mt-3
          pt-2.5
          border-t border-[#FDE1C7]
          grid grid-cols-3
          gap-2
        "
      >

        <div>
          <p className="text-[11px] text-[#A16207]">
            Gross
          </p>

          <p className="text-[12px] font-semibold text-[#7C2D12]">
            {formatCurrency(item.gross_amount)}
          </p>
        </div>

        <div>
          <p className="text-[11px] text-[#A16207]">
            GST
          </p>

          <p className="text-[12px] font-semibold text-[#7C2D12]">
            {formatCurrency(item.gst_amount)}
          </p>
        </div>

        <div>
          <p className="text-[11px] text-[#A16207]">
            Net Weight
          </p>

          <p className="text-[12px] font-semibold text-[#7C2D12]">
            {item.net_wt != null
              ? `${Number(item.net_wt).toFixed(3)} g`
              : 'N/A'}
          </p>
        </div>

      </div>

    </div>
  );
};


/* =========================================================
   COMBO CARD
========================================================= */

const ComboCard = ({
  combo,
  comboIndex,
}) => {
  const [expanded, setExpanded] = useState(true);

  const itemTotal = combo.items.reduce(
    (sum, item) => sum + safeNumber(item.price),
    0
  );

  const comboPrice = safeNumber(combo.comboPrice);

  const priceDifference = comboPrice - itemTotal;

  return (
    <div
      className="
        rounded-2xl
        border border-[#FED7AA]
        overflow-hidden
        bg-white
        shadow-sm
      "
    >

      {/* COMBO HEADER */}

      <div
        className="
          relative
          overflow-hidden
          bg-gradient-to-r
          from-[#FFF7ED]
          via-[#FFEDD5]
          to-[#FFF7ED]
          p-3 sm:p-4
        "
      >

        {/* decorative */}

        <div
          className="
            absolute
            -right-10
            -top-10
            w-32 h-32
            rounded-full
            bg-[#F97316]/10
          "
        />

        <div className="relative">

          <div className="flex items-start justify-between gap-3">

            <div className="flex items-start gap-3">

              <div
                className="
                  w-10 h-10
                  rounded-xl
                  bg-gradient-to-br
                  from-[#F97316]
                  to-[#EA580C]
                  flex items-center justify-center
                  shadow-md
                  flex-shrink-0
                "
              >
                <FontAwesomeIcon
                  icon={faShoppingBag}
                  className="text-white"
                />
              </div>


              <div>

                <div className="flex flex-wrap items-center gap-1.5">

                  <span
                    className="
                      px-2 py-0.5
                      rounded-full
                      bg-[#F97316]
                      text-white
                      text-[10px]
                      uppercase
                      font-bold
                      tracking-wider
                    "
                  >
                    Combo
                  </span>

                  <span className="text-[11px] text-[#9A3412]">
                    #{combo.comboCode}
                  </span>

                </div>

                <h4 className="font-bold text-sm sm:text-base text-[#7C2D12] mt-1">
                  {combo.comboName}
                </h4>

                <p className="text-[11px] sm:text-[12px] text-[#9A3412] mt-0.5">
                  {combo.items.length} products included
                </p>

              </div>

            </div>


            <button
              onClick={() => setExpanded((prev) => !prev)}
              className="
                w-8 h-8
                rounded-lg
                bg-white/80
                border border-[#FED7AA]
                text-[#EA580C]
                flex items-center justify-center
                hover:bg-white
                transition
              "
            >
              <FontAwesomeIcon
                icon={expanded ? faChevronUp : faChevronDown}
                className="text-xs"
              />
            </button>

          </div>


          {/* COMBO PRICE */}

          <div className="mt-3 flex items-end justify-between">

            <div>

              <p className="text-[11px] uppercase tracking-wide text-[#A16207]">
                Combo Price
              </p>

              <p className="text-lg sm:text-xl font-black text-[#EA580C]">
                {formatCurrency(comboPrice)}
              </p>

            </div>

            <div className="text-right">

              <p className="text-[11px] text-[#A16207]">
                Quantity
              </p>

              <p className="text-sm font-bold text-[#7C2D12]">
                ×{combo.comboQty}
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* PRODUCTS */}

      {expanded && (
        <div className="p-2.5 sm:p-3 space-y-2">

          {combo.items.map((item, index) => (
            <ComboProductCard
              key={item.id}
              item={item}
              index={index}
            />
          ))}


          {/* COMBO BREAKDOWN */}

          <div
            className="
              mt-2
              rounded-xl
              bg-[#FFFDFB]
              border border-[#FDE1C7]
              p-3
            "
          >

            <div className="flex justify-between items-center">

              <span className="text-[12px] text-[#9A3412]">
                Individual item value
              </span>

              <span className="text-xs font-semibold text-[#7C2D12]">
                {formatCurrency(itemTotal)}
              </span>

            </div>


            {priceDifference !== 0 && (
              <div className="flex justify-between items-center mt-1.5">

                <span className="text-[12px] text-[#9A3412]">
                  Combo price adjustment
                </span>

                <span className="text-xs font-semibold text-[#7C2D12]">
                  {priceDifference > 0 ? '+' : '-'}
                  {formatCurrency(Math.abs(priceDifference))}
                </span>

              </div>
            )}


            <div className="border-t border-[#FDE1C7] my-2" />


            <div className="flex justify-between items-center">

              <span className="text-xs font-bold text-[#7C2D12]">
                Combo Total
              </span>

              <span className="text-sm font-black text-[#EA580C]">
                {formatCurrency(comboPrice)}
              </span>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};


/* =========================================================
   SINGLE PRODUCT CARD
========================================================= */

const SingleProductCard = ({
  item,
}) => {
  return (
    <div
      className="
        flex gap-3
        p-3
        bg-white
        border border-[#FED7AA]
        rounded-xl
        hover:shadow-md
        transition
      "
    >

      <div
        className="
          w-20 h-20
          rounded-xl
          overflow-hidden
          flex-shrink-0
          bg-[#FFF7ED]
          border border-[#FED7AA]
        "
      >
        {item.image_path ? (
          <img
            src={getImage(item.image_path)}
            alt={item.product_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FontAwesomeIcon
              icon={faImage}
              className="text-[#FDBA74]"
            />
          </div>
        )}
      </div>


      <div className="flex-1 min-w-0">

        <div className="flex justify-between gap-2">

          <div>
            <h4 className="font-bold text-xs sm:text-sm text-[#7C2D12]">
              {item.product_name}
            </h4>

            <p className="text-[11px] text-[#F97316] mt-1">
              Item ID: {item.itemid} · Tag: {item.tagno}
            </p>
          </div>

          <p className="font-bold text-sm text-[#EA580C]">
            {formatCurrency(item.price)}
          </p>

        </div>


        <div className="flex flex-wrap gap-3 mt-3">

          {item.net_wt != null && (
            <span className="text-[11px] text-[#9A3412]">
              Weight: {Number(item.net_wt).toFixed(3)} g
            </span>
          )}

          {item.gst_per && (
            <span className="text-[11px] text-[#9A3412]">
              GST: {item.gst_per}
            </span>
          )}

          <span className="text-[11px] text-[#9A3412]">
            Qty: {item.quantity || 1}
          </span>

        </div>

      </div>

    </div>
  );
};


/* =========================================================
   ORDER ITEMS
========================================================= */

const OrderItems = ({
  items = [],
}) => {

  const groupedData = useMemo(() => {

    const combos = {};
    const singles = [];

    items.forEach((item) => {

      if (item.in_combo && item.combo_id) {

        const key = String(item.combo_id);

        if (!combos[key]) {
          combos[key] = {
            comboId: item.combo_id,
            comboCode: item.combo_code,
            comboName: item.combo_name,
            comboPrice: item.combo_price,
            comboQty: item.combo_qty || 1,
            items: [],
          };
        }

        combos[key].items.push(item);

      } else {
        singles.push(item);
      }

    });

    return {
      combos: Object.values(combos),
      singles,
    };

  }, [items]);


  return (
    <SectionCard>

      <SectionHeader
        icon={faBox}
        title="Items in your order"
        description={`${items.length} item${items.length !== 1 ? 's' : ''} in this order`}
        rightContent={
          <span
            className="
              px-2.5 py-1
              rounded-full
              bg-white
              border border-[#FED7AA]
              text-[11px]
              font-semibold
              text-[#EA580C]
            "
          >
            {items.length} items
          </span>
        }
      />


      <div className="p-3 sm:p-4 space-y-3">

        {/* COMBOS */}

        {groupedData.combos.map((combo, index) => (
          <ComboCard
            key={combo.comboId}
            combo={combo}
            comboIndex={index}
          />
        ))}


        {/* NORMAL PRODUCTS */}

        {groupedData.singles.length > 0 && (
          <div className="space-y-2">

            {groupedData.combos.length > 0 && (
              <div className="flex items-center gap-2 pt-1">

                <div className="h-px flex-1 bg-[#FDE1C7]" />

                <span className="text-[11px] uppercase tracking-wider text-[#A16207]">
                  Individual Products
                </span>

                <div className="h-px flex-1 bg-[#FDE1C7]" />

              </div>
            )}

            {groupedData.singles.map((item) => (
              <SingleProductCard
                key={item.id}
                item={item}
              />
            ))}

          </div>
        )}

      </div>

    </SectionCard>
  );
};


/* =========================================================
   PRICE SUMMARY
========================================================= */

const PriceSummary = ({
  data,
}) => {

  const productsTotal = safeNumber(data.products_grandTotal);

  const gst = safeNumber(data.products_GST);

  const grossTotal = safeNumber(data.products_grossTotal);

  const shipping = safeNumber(data.shipping_fee);

  const total = safeNumber(data.total_amount);

  const comboAdjustment =
    total - productsTotal - shipping;

  return (
    <SectionCard>

      <SectionHeader
        icon={faReceipt}
        title="Order Summary"
        description="Complete price breakdown"
      />

      <div className="p-4 space-y-3">

        <PriceRow
          label="Products"
          value={productsTotal}
        />

        <PriceRow
          label="Gross Amount"
          value={grossTotal}
        />

        <PriceRow
          label="GST"
          value={gst}
        />

        <PriceRow
          label="Shipping"
          value={shipping}
          valueComponent={
            shipping === 0 ? (
              <span className="text-emerald-600 font-semibold">
                Free
              </span>
            ) : null
          }
        />


        {comboAdjustment !== 0 && (
          <PriceRow
            label="Combo Price Adjustment"
            value={comboAdjustment}
          />
        )}


        <div className="border-t border-[#FED7AA] pt-3 mt-3">

          <div className="flex justify-between items-center">

            <div>
              <p className="text-xs font-bold text-[#7C2D12]">
                Total Amount
              </p>

              <p className="text-[11px] text-[#A16207] mt-0.5">
                Including applicable taxes
              </p>
            </div>

            <p className="text-xl font-black text-[#EA580C]">
              {formatCurrency(total)}
            </p>

          </div>

        </div>

      </div>

    </SectionCard>
  );
};


const PriceRow = ({
  label,
  value,
  valueComponent,
}) => {
  return (
    <div className="flex justify-between items-center gap-3">

      <span className="text-xs text-[#9A3412]">
        {label}
      </span>

      {valueComponent || (
        <span className="text-xs font-semibold text-[#7C2D12]">
          {formatCurrency(value)}
        </span>
      )}

    </div>
  );
};


/* =========================================================
   PAYMENT CARD
========================================================= */

const PaymentCard = ({
  paymentMode,
  paymentStatus,
  canRetryPayment,
  onRetry,
}) => {

  const isPaid =
    paymentStatus === 'PAID' ||
    paymentStatus === 'SUCCESS';

  return (
    <SectionCard>

      <SectionHeader
        icon={faCreditCard}
        title="Payment"
        description="Payment information"
      />

      <div className="p-4 space-y-3">

        <div
          className="
            flex items-center justify-between
            p-3
            rounded-xl
            bg-gradient-to-r
            from-[#FFF7ED]
            to-[#FFFBF7]
            border border-[#FED7AA]
          "
        >

          <div className="flex items-center gap-3">

            <div
              className="
                w-9 h-9
                rounded-xl
                bg-white
                border border-[#FED7AA]
                flex items-center justify-center
              "
            >
              <FontAwesomeIcon
                icon={
                  paymentMode === 'COD'
                    ? faMoneyBillWave
                    : faCreditCard
                }
                className="text-[#F97316]"
              />
            </div>

            <div>

              <p className="text-[11px] text-[#A16207]">
                Payment Method
              </p>

              <p className="text-sm font-bold text-[#7C2D12]">
                {paymentMode || 'Online'}
              </p>

            </div>

          </div>


          <span
            className={`
              px-2.5 py-1
              rounded-full
              text-[11px]
              font-semibold
              border
              ${isPaid
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-orange-50 text-orange-700 border-orange-200'
              }
            `}
          >
            {paymentStatus || 'PENDING'}
          </span>

        </div>


        {paymentMode === 'COD' && (
          <div
            className="
              flex items-start gap-2
              p-3
              rounded-xl
              bg-blue-50
              border border-blue-100
            "
          >
            <FontAwesomeIcon
              icon={faInfoCircle}
              className="text-blue-500 mt-0.5 text-xs"
            />

            <p className="text-[12px] text-blue-700 leading-relaxed">
              Payment will be collected when your order is delivered.
            </p>
          </div>
        )}


        {canRetryPayment && (
          <button
            onClick={onRetry}
            className="
              w-full
              py-2.5
              rounded-xl
              bg-gradient-to-r
              from-[#F97316]
              to-[#EA580C]
              text-white
              text-xs
              font-semibold
              hover:shadow-lg
              transition
            "
          >
            Retry Payment
          </button>
        )}

      </div>

    </SectionCard>
  );
};


/* =========================================================
   ADDRESS CARD
========================================================= */

const AddressCard = ({
  type,
  address,
}) => {

  if (!address) return null;

  const isDelivery = type === 'delivery';

  return (
    <SectionCard>

      <SectionHeader
        icon={isDelivery ? faMapMarkerAlt : faStore}
        title={isDelivery ? 'Shipping To' : 'Delivery From'}
        description={
          isDelivery
            ? 'Your delivery address'
            : 'Seller / dispatch address'
        }
      />

      <div className="p-4">

        <div className="flex items-start gap-3">

          <div
            className="
              w-9 h-9
              rounded-xl
              bg-[#FFF7ED]
              border border-[#FED7AA]
              flex items-center justify-center
              flex-shrink-0
            "
          >
            <FontAwesomeIcon
              icon={
                isDelivery
                  ? faLocationDot
                  : faStore
              }
              className="text-[#F97316]"
            />
          </div>


          <div className="min-w-0 flex-1">

            <div className="flex flex-wrap items-center gap-2">

              <h4 className="font-bold text-sm text-[#7C2D12]">
                {address.name ||
                  address.customerName ||
                  'Customer'}
              </h4>

              {isDelivery && address.isDefault && (
                <span
                  className="
                    px-2 py-0.5
                    rounded-full
                    bg-emerald-50
                    border border-emerald-200
                    text-emerald-700
                    text-[10px]
                    font-semibold
                  "
                >
                  Default
                </span>
              )}

            </div>


            <div className="mt-2 space-y-1.5">

              <p className="text-xs text-[#9A3412] leading-relaxed">
                {address.addressLine ||
                  address.addressLine1}
              </p>

              {address.addressLine2 && (
                <p className="text-xs text-[#9A3412]">
                  {address.addressLine2}
                </p>
              )}

              {address.locality && (
                <p className="text-xs text-[#9A3412]">
                  {address.locality}
                </p>
              )}

              <p className="text-xs text-[#9A3412]">
                {address.city}
                {address.city && address.state ? ', ' : ''}
                {address.state}
                {address.pincode
                  ? ` - ${address.pincode}`
                  : ''}
              </p>


              {address.landmark && (
                <p className="text-[12px] text-[#EA580C]">
                  Landmark: {address.landmark}
                </p>
              )}


              {address.phone && (
                <div className="flex items-center gap-1.5 pt-1">

                  <FontAwesomeIcon
                    icon={faPhone}
                    className="text-[#F97316] text-[11px]"
                  />

                  <span className="text-[12px] font-medium text-[#7C2D12]">
                    {address.phone}
                  </span>

                </div>
              )}

            </div>

          </div>

        </div>

      </div>

    </SectionCard>
  );
};


/* =========================================================
   ORDER STATS
========================================================= */

const OrderStats = ({
  data,
}) => {

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">

      <StatCard
        icon={faCube}
        label="Products"
        value={data.total_products || 0}
      />

      <StatCard
        icon={faMoneyBillWave}
        label="Total"
        value={formatCurrency(data.total_amount)}
      />

      <StatCard
        icon={faTruck}
        label="Shipping"
        value={
          safeNumber(data.shipping_fee) === 0
            ? 'FREE'
            : formatCurrency(data.shipping_fee)
        }
      />

      <StatCard
        icon={faCreditCard}
        label="Payment"
        value={data.payment_mode || 'Online'}
      />

    </div>
  );
};


const StatCard = ({
  icon,
  label,
  value,
}) => {

  return (
    <div
      className="
        bg-white/90
        border border-[#FED7AA]
        rounded-xl
        p-3
        shadow-sm
      "
    >

      <div className="flex items-center gap-2">

        <div
          className="
            w-7 h-7
            rounded-lg
            bg-[#FFF7ED]
            border border-[#FED7AA]
            flex items-center justify-center
          "
        >
          <FontAwesomeIcon
            icon={icon}
            className="text-[#F97316] text-[12px]"
          />
        </div>

        <div className="min-w-0">

          <p className="text-[10px] uppercase tracking-wide text-[#A16207]">
            {label}
          </p>

          <p className="text-xs font-bold text-[#7C2D12] truncate">
            {value}
          </p>

        </div>

      </div>

    </div>
  );
};


/* =========================================================
   ACTION CARD
========================================================= */

const OrderActions = ({
  canCancel,
  canReturn,
  canReorder,
  onCancel,
  onReturn,
  onReorder,
  isCancelling,
  isReordering,
}) => {

  return (
    <SectionCard>

      <SectionHeader
        icon={faInfoCircle}
        title="Order Actions"
        description="Available actions for this order"
      />

      <div className="p-3 space-y-2">

        {canReorder && (
          <button
            onClick={onReorder}
            disabled={isReordering}
            className="
              w-full
              py-2.5
              rounded-xl
              bg-gradient-to-r
              from-[#F97316]
              to-[#EA580C]
              text-white
              text-xs
              font-semibold
              flex items-center justify-center gap-2
              hover:shadow-lg
              transition
              disabled:opacity-60
            "
          >
            <FontAwesomeIcon
              icon={
                isReordering
                  ? faSpinner
                  : faRotate
              }
              spin={isReordering}
            />

            {isReordering
              ? 'Processing...'
              : 'Reorder'}
          </button>
        )}


        {canReturn && (
          <button
            onClick={onReturn}
            className="
              w-full
              py-2.5
              rounded-xl
              border border-[#FED7AA]
              bg-[#FFF7ED]
              text-[#EA580C]
              text-xs
              font-semibold
              flex items-center justify-center gap-2
              hover:bg-[#FFEDD5]
              transition
            "
          >
            <FontAwesomeIcon icon={faRotate} />

            Return Order
          </button>
        )}


        {canCancel && (
          <button
            onClick={onCancel}
            disabled={isCancelling}
            className="
              w-full
              py-2.5
              rounded-xl
              border border-rose-200
              bg-rose-50
              text-rose-600
              text-xs
              font-semibold
              flex items-center justify-center gap-2
              hover:bg-rose-100
              transition
              disabled:opacity-60
            "
          >
            <FontAwesomeIcon
              icon={
                isCancelling
                  ? faSpinner
                  : faBan
              }
              spin={isCancelling}
            />

            {isCancelling
              ? 'Cancelling...'
              : 'Cancel Order'}
          </button>
        )}


        <button
          onClick={() => window.location.href = '/products-page'}
          className="
            w-full
            py-2.5
            rounded-xl
            border border-[#FED7AA]
            bg-white
            text-[#7C2D12]
            text-xs
            font-semibold
            flex items-center justify-center gap-2
            hover:bg-[#FFF7ED]
            transition
          "
        >
          Continue Shopping

          <FontAwesomeIcon
            icon={faChevronRight}
            className="text-[12px]"
          />
        </button>

      </div>

    </SectionCard>
  );
};


/* =========================================================
   SKELETON
========================================================= */

const OrderDetailsSkeleton = () => {

  return (
    <div
      className="
        min-h-screen
        bg-gradient-to-br
        from-[#FFF7ED]
        via-[#FFEDD5]
        to-[#FFF3E6]
        p-3
      "
    >

      <div className="max-w-7xl mx-auto space-y-3 animate-pulse">

        <div className="h-20 bg-white rounded-2xl border border-[#FED7AA]" />

        <div className="h-24 bg-white rounded-2xl border border-[#FED7AA]" />

        <div className="grid lg:grid-cols-3 gap-3">

          <div className="lg:col-span-2 space-y-3">

            <div className="h-96 bg-white rounded-2xl border border-[#FED7AA]" />

            <div className="grid md:grid-cols-2 gap-3">

              <div className="h-56 bg-white rounded-2xl border border-[#FED7AA]" />

              <div className="h-56 bg-white rounded-2xl border border-[#FED7AA]" />

            </div>

          </div>

          <div className="space-y-3">

            <div className="h-72 bg-white rounded-2xl border border-[#FED7AA]" />

            <div className="h-48 bg-white rounded-2xl border border-[#FED7AA]" />

          </div>

        </div>

      </div>

    </div>
  );
};


/* =========================================================
   MAIN ORDER DETAIL
========================================================= */

const OrderDetail = () => {

  const { id } = useParams();

  const navigate = useNavigate();

  const [isStatusModalOpen, setIsStatusModalOpen] =
    useState(false);


  /* =====================================================
     API
  ===================================================== */

  const {
    data: orderTrackData,
    refetch: fetchOrderTrackData,
    isLoading: orderTrackLoading,
    isError: orderTrackError,
  } = useTrackingById(id);


  const {
    mutate: cancelOrder,
    isLoading: isCancelling,
  } = useCancelOrder();


  const {
    mutateAsync: createReOrder,
    isLoading: isReordering,
  } = useCreateReOrder();


  const {
    data: orderStatusMaster,
  } = useOrderStatusMaster();


  /* =====================================================
     DATA
  ===================================================== */

  const paymentMode =
    orderTrackData?.payment_mode || 'Online';

  const paymentStatus =
    orderTrackData?.payment_status || 'PENDING';

  const currentStatus =
    orderTrackData?.current_status || 'PLACED';

  const totalAmount =
    safeNumber(orderTrackData?.total_amount);

  const items =
    orderTrackData?.order_items || [];

  const deliveryAddress =
    orderTrackData?.delivery_address;

  const originAddress =
    orderTrackData?.origin_address;

  const canCancel =
    Boolean(orderTrackData?.canCancel);

  const canReturn =
    Boolean(
      orderTrackData?.canReturn ||
      currentStatus?.toLowerCase() === 'delivered'
    );

  /*
   * Important:
   *
   * canReorder and canRetryPayment are different
   * backend flags.
   */
  const canReorder =
    Boolean(orderTrackData?.canReorder);

  const canRetryPayment =
    Boolean(orderTrackData?.canRetryPayment);


  /* =====================================================
     CANCEL
  ===================================================== */

  const handleCancel = () => {

    const reason =
      window.prompt(
        'Why do you want to cancel this order?'
      );

    if (!reason?.trim()) return;


    cancelOrder(
      {
        orderId: orderTrackData.order_id,

        newStatus: 'CANCELLED',

        remarks:
          `Cancelled by user: ${reason.trim()}`,

        paymentStatus:
          orderTrackData.payment_status,
      },
      {
        onSuccess: () => {

          toast.success(
            'Order cancelled successfully'
          );

          fetchOrderTrackData();

          setIsStatusModalOpen(false);
        },

        onError: () => {
          toast.error(
            'Failed to cancel order'
          );
        },
      }
    );

  };


  /* =====================================================
     REORDER
  ===================================================== */

  const handleReorder = async () => {

    if (!canReorder) {
      navigate('/products-page');
      return;
    }


    const confirmed =
      window.confirm(
        'Do you want to place this order again?'
      );

    if (!confirmed) return;


    try {

      const result =
        await createReOrder(
          orderTrackData.order_id
        );


      if (result?.newOrderId) {

        navigate(
          `/payment/${result.newOrderId}`
        );

      }

    } catch (error) {

      toast.error(
        'Unable to reorder this order'
      );

    }

  };


  /* =====================================================
     RETURN
  ===================================================== */

  const handleReturn = () => {

    const confirmed =
      window.confirm(
        'Do you want to return this order?'
      );

    if (!confirmed) return;


    navigate(
      '/return',
      {
        state: orderTrackData,
      }
    );

  };


  /* =====================================================
     LOADING
  ===================================================== */

  if (orderTrackLoading) {
    return <OrderDetailsSkeleton />;
  }


  /* =====================================================
     NOT FOUND
  ===================================================== */

  if (!orderTrackData) {

    return (
      <div
        className="
          min-h-screen
          flex flex-col
          items-center
          justify-center
          bg-gradient-to-br
          from-[#FFF7ED]
          to-[#FFEDD5]
          p-6
        "
      >

        <div
          className="
            w-20 h-20
            rounded-full
            bg-white
            border border-[#FED7AA]
            flex items-center justify-center
            shadow-lg
          "
        >
          <FontAwesomeIcon
            icon={faBoxOpen}
            className="text-4xl text-[#F97316]"
          />
        </div>


        <h3 className="text-xl font-bold text-[#7C2D12] mt-5">
          Order not found
        </h3>


        <p className="text-xs text-[#9A3412] mt-1 text-center">
          The order you're looking for doesn't exist.
        </p>


        <Link
          to="/products-page"
          className="
            mt-5
            px-5 py-2.5
            rounded-xl
            bg-gradient-to-r
            from-[#F97316]
            to-[#EA580C]
            text-white
            text-xs
            font-semibold
            flex items-center gap-2
          "
        >
          <FontAwesomeIcon icon={faShoppingBag} />

          Continue Shopping
        </Link>

      </div>
    );
  }


  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div
      className="
        min-h-screen
        bg-gradient-to-br
        from-[#FFF7ED]
        via-[#FFEDD5]
        to-[#FFF3E6]
        text-[#7C2D12]
        py-3
        px-2
        sm:px-3
      "
    >

      <div className="max-w-7xl mx-auto space-y-3">


        {/* =================================================
            ORDER HEADER
        ================================================= */}

        <OrderHeader
          orderId={orderTrackData.order_id || id}
          status={currentStatus}
          canCancel={canCancel}
          onCancel={handleCancel}
          isCancelling={isCancelling}
          onTrack={() =>
            setIsStatusModalOpen(true)
          }
        />


        {/* =================================================
            QUICK STATS
        ================================================= */}

        <OrderStats
          data={orderTrackData}
        />


        {/* =================================================
            TIMELINE
        ================================================= */}

        <SectionCard>

          <SectionHeader
            icon={faTruck}
            title="Order Tracking"
            description="Track the current progress of your order"
          />

          <div className="overflow-x-auto">

            <div className="min-w-0 p-2 sm:p-4">

              <HorizontalTimeline
                currentStatus={currentStatus}
                statuses={
                  orderStatusMaster?.statuses ||
                  ORDER_STATUS_MASTER
                }
              />

            </div>

          </div>

        </SectionCard>


        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div className="grid lg:grid-cols-3 gap-3 sm:gap-4">


          {/* =================================================
              LEFT
          ================================================= */}

          <div className="lg:col-span-2 space-y-3 sm:space-y-4">


            {/* ITEMS */}

            <OrderItems
              items={items}
            />


            {/* ADDRESS */}

            <div className="grid md:grid-cols-2 gap-3">

              <AddressCard
                type="delivery"
                address={deliveryAddress}
              />

              <AddressCard
                type="origin"
                address={originAddress}
              />

            </div>


            {/* ORDER INFORMATION */}

            <SectionCard>

              <SectionHeader
                icon={faInfoCircle}
                title="Order Information"
                description="Additional order details"
              />

              <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">

                <InfoItem
                  icon={faReceipt}
                  label="Order ID"
                  value={orderTrackData.order_id}
                />

                <InfoItem
                  icon={faCube}
                  label="Products"
                  value={orderTrackData.total_products}
                />

                <InfoItem
                  icon={faClock}
                  label="Current Status"
                  value={getStatusLabel(currentStatus)}
                />

                <InfoItem
                  icon={faCreditCard}
                  label="Payment"
                  value={paymentMode}
                />

              </div>

            </SectionCard>

          </div>


          {/* =================================================
              RIGHT
          ================================================= */}

          <div className="space-y-3 sm:space-y-4 lg:sticky lg:top-20 lg:self-start">


            {/* PRICE */}

            <PriceSummary
              data={orderTrackData}
            />


            {/* PAYMENT */}

            <PaymentCard
              paymentMode={paymentMode}
              paymentStatus={paymentStatus}
              canRetryPayment={canRetryPayment}
              onRetry={() =>
                navigate(
                  `/payment/${orderTrackData.order_id}`
                )
              }
            />


            {/* ACTIONS */}

            <OrderActions
              canCancel={canCancel}
              canReturn={canReturn}
              canReorder={canReorder}
              onCancel={handleCancel}
              onReturn={handleReturn}
              onReorder={handleReorder}
              isCancelling={isCancelling}
              isReordering={isReordering}
            />


            {/* SUPPORT */}

            <SectionCard>

              <div className="p-4">

                <div className="flex items-start gap-3">

                  <div
                    className="
                      w-9 h-9
                      rounded-xl
                      bg-[#FFF7ED]
                      border border-[#FED7AA]
                      flex items-center justify-center
                      flex-shrink-0
                    "
                  >
                    <FontAwesomeIcon
                      icon={faShieldAlt}
                      className="text-[#F97316]"
                    />
                  </div>

                  <div>

                    <h4 className="text-xs font-bold text-[#7C2D12]">
                      Need help?
                    </h4>

                    <p className="text-[12px] text-[#9A3412] mt-1 leading-relaxed">
                      If you have any questions about your order,
                      delivery or payment, please contact support.
                    </p>

                  </div>

                </div>

              </div>

            </SectionCard>

          </div>

        </div>

      </div>


      {/* =================================================
          TRACKING MODAL
      ================================================= */}

      {isStatusModalOpen && (
        <TrackOrderModal
          orderId={id}
          data={orderTrackData}
          refetch={fetchOrderTrackData}
          loading={orderTrackLoading}
          error={orderTrackError}
          open={isStatusModalOpen}
          onClose={() =>
            setIsStatusModalOpen(false)
          }
        />
      )}

    </div>
  );
};

export default OrderDetail;