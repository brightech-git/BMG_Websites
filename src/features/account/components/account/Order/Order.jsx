
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faBoxOpen,
  faExclamationCircle,
  faSpinner,
  faSearch,
  faTimes,
  faChevronDown,
  faCheckCircle,
  faTruck,
  faClock,
  faAngleLeft,
  faAngleRight,
  faFilter,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

import { getOrderHistory } from "../../../../orders/api/orderService";
import { formatCurrency } from "../../../../../utils/index.js";
import { useNavigate } from "react-router-dom";
import SmartButton from "../../../../../components/ui/SmartButton";


/* =========================================================
   STATUS BADGE
========================================================= */

const StatusBadge = ({ status }) => {
  const normalized = (status || "").toUpperCase();

  const statusMap = {
    DELIVERED: {
      text: "Delivered",
      icon: faCheckCircle,
      className:
        "bg-emerald-50 text-emerald-700 border-emerald-200",
    },

    SHIPPED: {
      text: "Shipped",
      icon: faTruck,
      className:
        "bg-blue-50 text-blue-700 border-blue-200",
    },

    PROCESSING: {
      text: "Processing",
      icon: faClock,
      className:
        "bg-amber-50 text-amber-700 border-amber-200",
    },

    IN_PROCESSING: {
      text: "Processing",
      icon: faClock,
      className:
        "bg-amber-50 text-amber-700 border-amber-200",
    },

    PENDING: {
      text: "Pending",
      icon: faClock,
      className:
        "bg-orange-50 text-orange-700 border-orange-200",
    },

    PLACED: {
      text: "Order Placed",
      icon: faBox,
      className:
        "bg-orange-50 text-orange-700 border-orange-200",
    },

    PACKED: {
      text: "Packed",
      icon: faBox,
      className:
        "bg-purple-50 text-purple-700 border-purple-200",
    },

    CANCELLED: {
      text: "Cancelled",
      icon: faTimes,
      className:
        "bg-gray-50 text-gray-600 border-gray-200",
    },
  };

  const config = statusMap[normalized] || {
    text: status || "Order",
    icon: faBox,
    className:
      "bg-gray-50 text-gray-600 border-gray-200",
  };

  return (
    <span
      className={`
      
inline-flex
items-center
gap-1.5
px-2.5
py-1.5
rounded-full
border
text-[13px]
font-semibold
whitespace-nowrap
        ${ config.className }
`}
    >
      <FontAwesomeIcon
        icon={config.icon}
        className="text-[12px]"
      />

      {config.text}
    </span>
  );
};


/* =========================================================
   FILTER SELECT
========================================================= */

const FilterSelect = ({
  value,
  onChange,
  options,
  placeholder,
}) => {
  return (
    <div className="relative w-full sm:w-auto sm:min-w-[170px]">

      <select
        value={value}
        onChange={onChange}
        className="
          appearance-none
          w-full
          h-10
          bg-white
          border border-[#fed7aa]
          rounded-xl
          pl-3.5
          pr-9
          text-[13px]
          font-medium
          text-[#431407]
          focus:outline-none
          focus:ring-2
          focus:ring-[#F97316]/20
          focus:border-[#F97316]
          hover:border-[#FDBA74]
          cursor-pointer
          transition-all
        "
      >
        <option value="">
          {placeholder}
        </option>

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      <FontAwesomeIcon
        icon={faChevronDown}
        className="
          absolute
          right-3
          top-1/2
          -translate-y-1/2
          text-[#F97316]
          text-[12px]
          pointer-events-none
        "
      />

    </div>
  );
};


/* =========================================================
   DESKTOP ORDER ROW
========================================================= */

const OrderRow = ({
  order,
  index,
  onClick,
  formatDate,
}) => {

  const orderId = order.orderId || order.id;

  return (
    <tr
      onClick={onClick}
      className="
        group
        cursor-pointer
        border-t border-[#f3e8df]
        hover:bg-gradient-to-r
        hover:from-[#FFF7ED]
        hover:to-white
        transition-all duration-200
      "
      style={{
        animationDelay: `${ index * 50 } ms`,
      }}
    >

      {/* Order ID */}

      <td className="px-4 sm:px-5 lg:px-6 py-4">

        <div className="flex items-center gap-3">

          <div
            className="
              w-10 h-10
              rounded-xl
              bg-[#FFF7ED]
              border border-[#fed7aa]
              text-[#F97316]
              flex items-center justify-center
              group-hover:bg-[#F97316]
              group-hover:text-white
              group-hover:border-[#F97316]
              transition-all
              shrink-0
            "
          >
            <FontAwesomeIcon
              icon={faBox}
              className="text-[16px]"
            />
          </div>

          <div>

            <p className="text-[12px] text-[#9A3412] font-medium">
              Order ID
            </p>

            <p className="
              text-[14px]
              sm:text-[15px]
              font-bold
              text-[#431407]
              mt-0.5
            ">
              #{orderId}
            </p>

          </div>

        </div>

      </td>


      {/* Date */}

      <td className="px-4 sm:px-5 lg:px-6 py-4 hidden md:table-cell">

        <div className="
          flex
          items-center
          gap-2
          text-[13px]
          text-[#57534E]
        ">

          <FontAwesomeIcon
            icon={faClock}
            className="text-[#F97316]"
          />

          {formatDate(
            order.orderTime ||
            order.createdAt
          )}

        </div>

      </td>


      {/* Status */}

      <td className="px-4 sm:px-5 lg:px-6 py-4">

        <StatusBadge
          status={order.status}
        />

      </td>


      {/* Total */}

      <td className="px-4 sm:px-5 lg:px-6 py-4">

        <span className="
          text-[15px]
          sm:text-[16px]
          font-bold
          text-[#9A3412]
        ">
          {formatCurrency(
            order.totalAmount ||
            order.amount ||
            0
          )}
        </span>

      </td>


      {/* Action */}

      <td className="px-4 sm:px-5 lg:px-6 py-4">

        <div
          className="
            w-9 h-9
            rounded-xl
            bg-[#FFF7ED]
            border border-[#fed7aa]
            text-[#F97316]
            flex items-center justify-center
            mx-auto
            group-hover:bg-[#F97316]
            group-hover:text-white
            group-hover:border-[#F97316]
            transition-all
          "
        >
          <FontAwesomeIcon
            icon={faAngleRight}
            className="
              text-[14px]
              group-hover:translate-x-0.5
              transition-transform
            "
          />
        </div>

      </td>

    </tr>
  );
};


/* =========================================================
   MOBILE ORDER CARD
========================================================= */

const MobileOrderCard = ({
  order,
  onClick,
  formatDate,
}) => {

  const orderId = order.orderId || order.id;

  return (
    <button
      onClick={onClick}
      className="
        w-full
        text-left
        bg-white
        border border-[#f3e8df]
        rounded-2xl
        p-4
        hover:border-[#FDBA74]
        hover:shadow-[0_8px_24px_rgba(249,115,22,0.08)]
        transition-all
      "
    >

      {/* Top */}

      <div className="flex items-start justify-between gap-3">

        <div className="flex items-center gap-3">

          <div
            className="
              w-10 h-10
              rounded-xl
              bg-[#FFF7ED]
              border border-[#fed7aa]
              text-[#F97316]
              flex items-center justify-center
              shrink-0
            "
          >
            <FontAwesomeIcon
              icon={faBox}
              className="text-[17px]"
            />
          </div>

          <div>

            <p className="
              text-[12px]
              text-[#9A3412]
              font-medium
            ">
              Order ID
            </p>

            <p className="
              text-[15px]
              font-bold
              text-[#431407]
              mt-0.5
            ">
              #{orderId}
            </p>

          </div>

        </div>


        <div
          className="
            w-8 h-8
            rounded-lg
            bg-[#FFF7ED]
            flex items-center justify-center
            text-[#F97316]
          "
        >
          <FontAwesomeIcon
            icon={faAngleRight}
            className="text-[13px]"
          />
        </div>

      </div>


      {/* Information */}

      <div className="
        grid
        grid-cols-2
        gap-4
        mt-4
        pt-4
        border-t border-[#f3e8df]
      ">

        <div>

          <p className="
            text-[12px]
            text-[#78716C]
          ">
            Order Date
          </p>

          <p className="
            text-[13px]
            font-medium
            text-[#44403C]
            mt-1
          ">
            {formatDate(
              order.orderTime ||
              order.createdAt
            )}
          </p>

        </div>


        <div>

          <p className="
            text-[12px]
            text-[#78716C]
          ">
            Total Amount
          </p>

          <p className="
            text-[15px]
            font-bold
            text-[#9A3412]
            mt-1
          ">
            {formatCurrency(
              order.totalAmount ||
              order.amount ||
              0
            )}
          </p>

        </div>

      </div>


      {/* Bottom */}

      <div className="
        mt-4
        pt-3
        border-t border-[#f3e8df]
        flex
        items-center
        justify-between
      ">

        <StatusBadge
          status={order.status}
        />

        <span className="
          text-[12px]
          font-semibold
          text-[#C2410C]
        ">
          View Details
        </span>

      </div>

    </button>
  );
};


/* =========================================================
   ORDERS PAGE
========================================================= */

const Orders = () => {

  const [ordersData, setOrdersData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const navigate = useNavigate();


  /* =========================================================
     API PAYLOAD
  ========================================================= */

  const orderPayload = {
    page: currentPage,
    size: pageSize,
    status: statusFilter,
  };


  /* =========================================================
     FETCH ORDERS
  ========================================================= */

  useEffect(() => {

    const fetchOrders = async () => {

      try {

        setLoading(true);
        setError(null);

        const data =
          await getOrderHistory(orderPayload);

        setOrdersData(data);

      } catch (err) {

        setError(
          err.response?.data?.message ||
          err.message ||
          "Failed to load orders"
        );

      } finally {

        setLoading(false);

      }

    };

    fetchOrders();

  }, [
    currentPage,
    pageSize,
    statusFilter,
  ]);


  /* =========================================================
     ORDERS
  ========================================================= */

  const orders = useMemo(() => {

    if (!ordersData) return [];

    return Array.isArray(
      ordersData.data
    )
      ? ordersData.data
      : [];

  }, [ordersData]);


  /* =========================================================
     FILTER ORDERS
  ========================================================= */

  const filteredOrders = useMemo(() => {

    return orders.filter((order) => {

      const q =
        searchQuery
          .trim()
          .toLowerCase();


      const matchesSearch =
        !q ||
        String(
          order.orderId || ""
        )
          .toLowerCase()
          .includes(q) ||

        (order.items || []).some(
          (item) =>
            String(
              item.name || ""
            )
              .toLowerCase()
              .includes(q)
        );


      const matchesStatus =
        !statusFilter ||
        (
          order.status || ""
        )
          .toLowerCase() ===
          statusFilter.toLowerCase();


      const matchesTime =
        !timeFilter ||
        (
          Date.now() -
          new Date(
            order.orderTime ||
            order.createdAt
          ).getTime()
        ) <=
          parseInt(timeFilter) *
          86400000;


      return (
        matchesSearch &&
        matchesStatus &&
        matchesTime
      );

    });

  }, [
    orders,
    searchQuery,
    statusFilter,
    timeFilter,
  ]);


  /* =========================================================
     PAGINATION
  ========================================================= */

  const handlePageChange =
    useCallback((page) => {

      setCurrentPage(page);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    }, []);


  const handlePageSizeChange = (e) => {

    setPageSize(
      Number(e.target.value)
    );

    setCurrentPage(0);

  };


  /* =========================================================
     FILTER LABELS
  ========================================================= */

  const getTimeFilterLabel = (
    value
  ) => {

    const labels = {
      7: "Last 7 Days",
      30: "Last 30 Days",
      90: "Last 3 Months",
      180: "Last 6 Months",
      365: "Last Year",
    };

    return labels[value] || "";

  };


  /* =========================================================
     DATE
  ========================================================= */

  const formatDate = (
    dateString
  ) => {

    if (!dateString) return "-";

    return new Date(
      dateString
    ).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );

  };


  /* =========================================================
     FILTER OPTIONS
  ========================================================= */

  const statusOptions = [
    {
      label: "Pending",
      value: "pending",
    },
    {
      label: "Placed",
      value: "placed",
    },
    {
      label: "Processing",
      value: "in_processing",
    },
    {
      label: "Packed",
      value: "packed",
    },
    {
      label: "Shipped",
      value: "shipped",
    },
    {
      label: "Delivered",
      value: "delivered",
    },
    {
      label: "Cancelled",
      value: "cancelled",
    },
  ];


  const timeOptions = [
    {
      label: "Last 7 Days",
      value: "7",
    },
    {
      label: "Last 30 Days",
      value: "30",
    },
    {
      label: "Last 3 Months",
      value: "90",
    },
    {
      label: "Last 6 Months",
      value: "180",
    },
    {
      label: "Last Year",
      value: "365",
    },
  ];


  const clearFilters = () => {

    setSearchQuery("");
    setStatusFilter("");
    setTimeFilter("");

  };


  const hasFilters =
    statusFilter ||
    timeFilter ||
    searchQuery;


  /* =========================================================
     PAGE
  ========================================================= */

  return (

    <div
      className="
        min-h-screen
        bg-gradient-to-br
        from-[#FFF7ED]
        via-[#FFEDD5]/70
        to-[#FFF3E6]
        px-3
        sm:px-4
        py-4
        sm:py-6
        font-[var(--secondary-font)]
        text-[#431407]
      "
    >

      <div
        className="
          max-w-7xl
          mx-auto
          space-y-4
          sm:space-y-5
        "
      >

        {/* =====================================================
            HEADER
        ===================================================== */}

        <section
          className="
            relative
            overflow-hidden
            bg-white
            border border-[#fed7aa]
            rounded-2xl
            sm:rounded-3xl
            p-4
            sm:p-5
            shadow-[0_8px_30px_rgba(249,115,22,0.07)]
          "
        >

          <div
            className="
              absolute
              -right-20
              -top-24
              w-60
              h-60
              rounded-full
              bg-[#F97316]/5
              blur-3xl
            "
          />

          <div className="
            relative
            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-3
          ">

            <div className="
              flex
              items-center
              gap-3
            ">

              <div
                className="
                  w-11 h-11
                  sm:w-12 sm:h-12
                  rounded-2xl
                  bg-gradient-to-br
                  from-[#F97316]
                  via-[#FB923C]
                  to-[#EA580C]
                  text-white
                  flex
                  items-center
                  justify-center
                  shadow-lg
                  shadow-orange-200
                "
              >
                <FontAwesomeIcon
                  icon={faBox}
                  className="text-[19px]"
                />
              </div>

              <div>

                <h1
                  className="
                    text-lg
                    sm:text-xl
                    font-bold
                    text-[#431407]
                  "
                >
                  Order History
                </h1>

                <p
                  className="
                    text-[13px]
                    sm:text-[14px]
                    text-[#78716C]
                    mt-0.5
                  "
                >
                  Manage and track all your orders
                </p>

              </div>

            </div>


            <div
              className="
                inline-flex
                items-center
                gap-2
                self-start
                sm:self-auto
                px-3
                py-2
                rounded-xl
                bg-[#FFF7ED]
                border border-[#fed7aa]
                text-[#9A3412]
                text-[13px]
                font-medium
              "
            >

              <FontAwesomeIcon
                icon={faBox}
                className="text-[#F97316]"
              />

              {ordersData?.totalOrders || 0} Orders

            </div>

          </div>

        </section>


        {/* =====================================================
            FILTERS
        ===================================================== */}

        <section
          className="
            bg-white
            border border-[#fed7aa]
            rounded-2xl
            sm:rounded-3xl
            p-3
            sm:p-4
            shadow-[0_8px_30px_rgba(249,115,22,0.06)]
          "
        >

          <div className="
            flex
            items-center
            gap-2
            mb-3
          ">

            <div
              className="
                w-8 h-8
                rounded-lg
                bg-[#FFF7ED]
                text-[#F97316]
                flex
                items-center
                justify-center
              "
            >
              <FontAwesomeIcon
                icon={faFilter}
                className="text-[13px]"
              />
            </div>

            <div>

              <h2 className="
                text-[15px]
                font-bold
                text-[#431407]
              ">
                Find an Order
              </h2>

              <p className="
                text-[12px]
                text-[#78716C]
              ">
                Search or filter your order history
              </p>

            </div>

          </div>


          <div
            className="
              flex
              flex-col
              lg:flex-row
              gap-2.5
            "
          >

            {/* Search */}

            <div className="
              relative
              flex-1
            ">

              <FontAwesomeIcon
                icon={faSearch}
                className="
                  absolute
                  left-3.5
                  top-1/2
                  -translate-y-1/2
                  text-[#F97316]
                  text-[13px]
                "
              />

              <input
                type="text"
                placeholder="Search by order ID or product..."
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(
                    e.target.value
                  )
                }
                className="
                  w-full
                  h-10
                  bg-[#FFFCF9]
                  border border-[#fed7aa]
                  rounded-xl
                  pl-10
                  pr-9
                  text-[13px]
                  text-[#431407]
                  placeholder:text-[#A8A29E]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#F97316]/20
                  focus:border-[#F97316]
                  transition-all
                "
              />

              {searchQuery && (

                <button
                  onClick={() =>
                    setSearchQuery("")
                  }
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    w-6 h-6
                    rounded-full
                    bg-[#FFF7ED]
                    text-[#C2410C]
                    flex
                    items-center
                    justify-center
                    hover:bg-[#F97316]
                    hover:text-white
                    transition-all
                  "
                >

                  <FontAwesomeIcon
                    icon={faTimes}
                    className="text-[10px]"
                  />

                </button>

              )}

            </div>


            {/* Status */}

            <FilterSelect
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              options={statusOptions}
              placeholder="All Statuses"
            />


            {/* Time */}

            <FilterSelect
              value={timeFilter}
              onChange={(e) =>
                setTimeFilter(
                  e.target.value
                )
              }
              options={timeOptions}
              placeholder="All Time"
            />

          </div>

        </section>


        {/* =====================================================
            ACTIVE FILTERS
        ===================================================== */}

        {hasFilters && (

          <section
            className="
              bg-white
              border border-[#fed7aa]
              rounded-2xl
              px-4
              py-3
              flex
              flex-wrap
              items-center
              justify-between
              gap-3
              shadow-[0_5px_20px_rgba(249,115,22,0.05)]
            "
          >

            <div className="
              flex
              flex-wrap
              items-center
              gap-2
            ">

              <span
                className="
                  text-[13px]
                  font-semibold
                  text-[#78716C]
                "
              >
                Active filters:
              </span>


              {statusFilter && (

                <span
                  className="
                    inline-flex
                    items-center
                    gap-2
                    px-2.5
                    py-1.5
                    rounded-full
                    bg-[#FFF7ED]
                    border border-[#fed7aa]
                    text-[#C2410C]
                    text-[12px]
                    font-semibold
                  "
                >

                  {
                    statusOptions.find(
                      (o) =>
                        o.value ===
                        statusFilter
                    )?.label
                  }

                  <button
                    onClick={() =>
                      setStatusFilter("")
                    }
                    className="hover:text-[#7C2D12]"
                  >
                    <FontAwesomeIcon
                      icon={faTimes}
                      className="text-[10px]"
                    />
                  </button>

                </span>

              )}


              {timeFilter && (

                <span
                  className="
                    inline-flex
                    items-center
                    gap-2
                    px-2.5
                    py-1.5
                    rounded-full
                    bg-[#FFF7ED]
                    border border-[#fed7aa]
                    text-[#C2410C]
                    text-[12px]
                    font-semibold
                  "
                >

                  {getTimeFilterLabel(
                    timeFilter
                  )}

                  <button
                    onClick={() =>
                      setTimeFilter("")
                    }
                  >
                    <FontAwesomeIcon
                      icon={faTimes}
                      className="text-[10px]"
                    />
                  </button>

                </span>

              )}


              {searchQuery && (

                <span
                  className="
                    inline-flex
                    items-center
                    gap-2
                    px-2.5
                    py-1.5
                    rounded-full
                    bg-[#FFF7ED]
                    border border-[#fed7aa]
                    text-[#C2410C]
                    text-[12px]
                    font-semibold
                    max-w-[220px]
                  "
                >

                  <span className="truncate">
                    "{searchQuery}"
                  </span>

                  <button
                    onClick={() =>
                      setSearchQuery("")
                    }
                  >
                    <FontAwesomeIcon
                      icon={faTimes}
                      className="text-[10px]"
                    />
                  </button>

                </span>

              )}

            </div>


            <SmartButton
              onClick={clearFilters}
              size="sm"
              hover
              className="
                text-[13px]
                px-3
                py-2
                bg-[#FFF7ED]
                border border-[#fed7aa]
                text-[#C2410C]
                rounded-xl
                hover:bg-[#F97316]
                hover:text-white
                hover:border-[#F97316]
              "
            >
              Clear All
            </SmartButton>

          </section>

        )}


        {/* =====================================================
            LOADING
        ===================================================== */}

        {loading ? (

          <section
            className="
              bg-white
              border border-[#fed7aa]
              rounded-2xl
              sm:rounded-3xl
              p-10
              sm:p-14
              text-center
              shadow-[0_8px_30px_rgba(249,115,22,0.06)]
            "
          >

            <div className="
              relative
              inline-flex
              items-center
              justify-center
            ">

              <div
                className="
                  absolute
                  w-14 h-14
                  rounded-full
                  bg-[#F97316]/10
                  blur-xl
                "
              />

              <FontAwesomeIcon
                icon={faSpinner}
                spin
                className="
                  relative
                  text-[#F97316]
                  text-[30px]
                "
              />

            </div>

            <p className="
              mt-5
              text-[15px]
              font-semibold
              text-[#431407]
            ">
              Loading your orders...
            </p>

            <p className="
              mt-1
              text-[13px]
              text-[#78716C]
            ">
              Please wait a moment
            </p>

          </section>

        ) : error ? (

          /* =====================================================
             ERROR
          ===================================================== */

          <section
            className="
              bg-white
              border border-red-200
              rounded-2xl
              sm:rounded-3xl
              p-8
              text-center
              shadow-sm
            "
          >

            <div
              className="
                w-14 h-14
                mx-auto
                rounded-2xl
                bg-red-50
                text-red-500
                flex
                items-center
                justify-center
              "
            >
              <FontAwesomeIcon
                icon={faExclamationCircle}
                className="text-[25px]"
              />
            </div>

            <p className="
              mt-4
              text-[15px]
              font-semibold
              text-red-700
            ">
              Unable to load your orders
            </p>

            <p className="
              mt-1
              text-[13px]
              text-red-500
            ">
              {error}
            </p>

            <button
              onClick={() =>
                window.location.reload()
              }
              className="
                mt-5
                px-5
                py-2.5
                rounded-xl
                bg-gradient-to-r
                from-[#F97316]
                to-[#EA580C]
                text-white
                text-[13px]
                font-semibold
                hover:shadow-lg
                hover:shadow-orange-200
                transition-all
              "
            >
              Try Again
            </button>

          </section>

        ) : filteredOrders?.length === 0 ? (

          /* =====================================================
             EMPTY
          ===================================================== */

          <section
            className="
              bg-white
              border border-[#fed7aa]
              rounded-2xl
              sm:rounded-3xl
              p-10
              sm:p-14
              text-center
              shadow-[0_8px_30px_rgba(249,115,22,0.06)]
            "
          >

            <div
              className="
                relative
                w-20 h-20
                mx-auto
                mb-5
              "
            >

              <div
                className="
                  absolute
                  inset-0
                  rounded-full
                  bg-[#F97316]/10
                  blur-xl
                "
              />

              <div
                className="
                  relative
                  w-full h-full
                  rounded-3xl
                  bg-[#FFF7ED]
                  border border-[#fed7aa]
                  text-[#F97316]
                  flex items-center justify-center
                "
              >

                <FontAwesomeIcon
                  icon={faBoxOpen}
                  className="text-[32px]"
                />

              </div>

            </div>


            <h3 className="
              text-lg
              font-bold
              text-[#431407]
            ">
              {orders?.length === 0
                ? "No orders yet"
                : "No matching orders"}
            </h3>


            <p className="
              mt-1.5
              text-[14px]
              text-[#78716C]
            ">
              {orders?.length === 0
                ? "Start shopping to see your orders here."
                : "Try adjusting your search or filters."}
            </p>


            {hasFilters && (

              <button
                onClick={clearFilters}
                className="
                  mt-5
                  px-5
                  py-2.5
                  rounded-xl
                  bg-gradient-to-r
                  from-[#F97316]
                  to-[#EA580C]
                  text-white
                  text-[13px]
                  font-semibold
                  hover:shadow-lg
                  hover:shadow-orange-200
                  transition-all
                "
              >
                Clear Filters
              </button>

            )}

          </section>

        ) : (

          /* =====================================================
             ORDER LIST
          ===================================================== */

          <>

            {/* Desktop */}

            <section
              className="
                hidden
                md:block
                bg-white
                border border-[#fed7aa]
                rounded-2xl
                sm:rounded-3xl
                overflow-hidden
                shadow-[0_8px_30px_rgba(249,115,22,0.06)]
              "
            >

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead>

                    <tr
                      className="
                        bg-gradient-to-r
                        from-[#FFF7ED]
                        to-[#FFFCF9]
                        border-b border-[#fed7aa]
                      "
                    >

                      <th className="
                        text-left
                        px-4
                        sm:px-5
                        lg:px-6
                        py-3.5
                        text-[12px]
                        font-bold
                        text-[#9A3412]
                        uppercase
                        tracking-wider
                      ">
                        Order
                      </th>

                      <th className="
                        text-left
                        px-4
                        sm:px-5
                        lg:px-6
                        py-3.5
                        text-[12px]
                        font-bold
                        text-[#9A3412]
                        uppercase
                        tracking-wider
                      ">
                        Date
                      </th>

                      <th className="
                        text-left
                        px-4
                        sm:px-5
                        lg:px-6
                        py-3.5
                        text-[12px]
                        font-bold
                        text-[#9A3412]
                        uppercase
                        tracking-wider
                      ">
                        Status
                      </th>

                      <th className="
                        text-left
                        px-4
                        sm:px-5
                        lg:px-6
                        py-3.5
                        text-[12px]
                        font-bold
                        text-[#9A3412]
                        uppercase
                        tracking-wider
                      ">
                        Total
                      </th>

                      <th className="w-20" />

                    </tr>

                  </thead>


                  <tbody>

                    {filteredOrders.map(
                      (order, index) => (

                        <OrderRow
                          key={
                            order.orderId ||
                            order.id
                          }
                          order={order}
                          index={index}
                          formatDate={formatDate}
                          onClick={() =>
                            navigate(
                              `/account/orderdetails/${ order.orderId }`,
                              {
                                state: { order },
                              }
                            )
                          }
                        />

                      )
                    )}

                  </tbody>

                </table>

              </div>

            </section>


            {/* Mobile */}

            <div className="
              md:hidden
              space-y-3
            ">

              {filteredOrders.map(
                (order) => (

                  <MobileOrderCard
                    key={
                      order.orderId ||
                      order.id
                    }
                    order={order}
                    formatDate={formatDate}
                    onClick={() =>
                      navigate(
                        `/account/orderdetails/${order.orderId}`,
                        {
                          state: { order },
                        }
                      )
                    }
                  />

                )
              )}

            </div>


            {/* =================================================
                PAGINATION
            ================================================= */}

            {ordersData && (

              <section
                className="
                  bg-white
                  border border-[#fed7aa]
                  rounded-2xl
                  px-3
                  sm:px-5
                  py-3
                  sm:py-3.5
                  flex
                  flex-col
                  sm:flex-row
                  items-center
                  justify-between
                  gap-3
                  shadow-[0_6px_24px_rgba(249,115,22,0.05)]
                "
              >

                {/* Total */}

                <div className="
                  text-[13px]
                  text-[#78716C]
                ">

                  Total Orders:

                  <span className="
                    ml-1
                    font-bold
                    text-[#C2410C]
                  ">
                    {ordersData?.totalOrders || 0}
                  </span>

                </div>


                {/* Controls */}

                <div className="
                  flex
                  items-center
                  gap-3
                ">

                  {/* Previous */}

                  <button
                    disabled={
                      currentPage === 0
                    }
                    onClick={() =>
                      handlePageChange(
                        currentPage-1
                      )
                    }
                    className="
                      w-9 h-9
                      rounded-xl
                      border border-[#fed7aa]
                      bg-white
                      text-[#F97316]
                      flex
                      items-center
                      justify-center
                      disabled:opacity-40
                      disabled:cursor-not-allowed
                      hover:bg-[#FFF7ED]
                      hover:border-[#F97316]
                      transition-all
                    "
                  >

                    <FontAwesomeIcon
                      icon={faAngleLeft}
                      className="text-[13px]"
                    />

                  </button>


                  {/* Page */}

                  <div className="
                    px-3.5
                    py-2
                    rounded-xl
                    bg-[#FFF7ED]
                    border border-[#fed7aa]
                    text-[#9A3412]
                    text-[13px]
                    font-semibold
                    min-w-[70px]
                    text-center
                  ">

                    {currentPage + 1}

                    <span className="
                      mx-1
                      text-[#FDBA74]
                    ">
                      /
                    </span>

                    {ordersData.totalPages || 1}

                  </div>


                  {/* Next */}

                  <button
                    disabled={
                      currentPage >=
                      (ordersData.totalPages || 1)-1
                    }
                    onClick={() =>
                      handlePageChange(
                        currentPage + 1
                      )
                    }
                    className="
                      w-9 h-9
                      rounded-xl
                      border border-[#fed7aa]
                      bg-white
                      text-[#F97316]
                      flex
                      items-center
                      justify-center
                      disabled:opacity-40
                      disabled:cursor-not-allowed
                      hover:bg-[#FFF7ED]
                      hover:border-[#F97316]
                      transition-all
                    "
                  >

                    <FontAwesomeIcon
                      icon={faAngleRight}
                      className="text-[13px]"
                    />

                  </button>


                  {/* Page Size */}

                  <div className="
                    hidden
                    sm:flex
                    items-center
                    gap-2
                    pl-2
                    border-l border-[#f3e8df]
                  ">

                    <span className="
                      text-[12px]
                      text-[#78716C]
                    ">
                      Show
                    </span>

                    <select
                      value={pageSize}
                      onChange={
                        handlePageSizeChange
                      }
                      className="
                        h-9
                        border border-[#fed7aa]
                        rounded-xl
                        px-2.5
                        text-[13px]
                        font-medium
                        bg-white
                        text-[#431407]
                        focus:outline-none
                        focus:ring-2
                        focus:ring-[#F97316]/20
                        focus:border-[#F97316]
                        cursor-pointer
                      "
                    >

                      {[5, 10, 20, 50].map(
                        (size) => (

                          <option
                            key={size}
                            value={size}
                          >
                            {size}
                          </option>

                        )
                      )}

                    </select>

                  </div>

                </div>

              </section>

            )}

          </>

        )}

      </div>

    </div>
  );
};

export default Orders;
