import React, { useState, useEffect } from "react";
import {
  FiShoppingBag,
  FiHeart,
  FiShoppingCart,
  FiChevronRight,
  FiLoader,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiUser,
  FiGift,
  FiTrendingUp,
  FiArrowUpRight,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

import { getOrderHistory } from "../../../../orders/api/orderService";
import { useCart } from "../../../../cart/hooks/cart/useCartQuery";
import { useFavorites } from "../../../../wishlist/hooks/favorites/useFavoritesQuery";


/* =========================================================
   Reusable Metric Card
========================================================= */

const MetricCard = ({
  icon,
  value,
  label,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="
        group relative overflow-hidden
        flex-1
        min-w-[105px]
        sm:min-w-[145px]
        text-left
        rounded-2xl
        border border-[#fed7aa]
        bg-white
        p-3 sm:p-4
        shadow-[0_4px_18px_rgba(249,115,22,0.07)]
        hover:-translate-y-1
        hover:shadow-[0_10px_28px_rgba(249,115,22,0.14)]
        transition-all duration-300
      "
    >
      {/* Hover background */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-br
          from-[#F97316]
          via-[#FB923C]
          to-[#EA580C]
          opacity-0
          group-hover:opacity-100
          transition-opacity duration-300
        "
      />

      {/* Decorative circle */}
      <div
        className="
          absolute
          -right-5
          -top-5
          w-16
          h-16
          rounded-full
          bg-[#F97316]/5
          group-hover:bg-white/10
          transition-colors
        "
      />

      <div className="relative flex items-center gap-3">

        <div
          className="
            w-10 h-10
            sm:w-11 sm:h-11
            rounded-xl
            bg-[#FFF7ED]
            border border-[#fed7aa]
            flex items-center justify-center
            text-[#F97316]
            group-hover:bg-white/15
            group-hover:text-white
            group-hover:border-white/20
            transition-all duration-300
            shrink-0
          "
        >
          {React.cloneElement(icon, {
            size: 19,
          })}
        </div>

        <div className="min-w-0">
          <div
            className="
              text-lg sm:text-xl
              font-bold
              text-[#431407]
              group-hover:text-white
              transition-colors
            "
          >
            {value}
          </div>

          <div
            className="
              text-[13px]
              font-medium
              text-[#9A3412]
              group-hover:text-white/90
              transition-colors
            "
          >
            {label}
          </div>
        </div>

        <FiArrowUpRight
          className="
            absolute
            right-0
            top-0
            text-[#FDBA74]
            group-hover:text-white
            opacity-0
            group-hover:opacity-100
            transition-all
          "
          size={17}
        />
      </div>
    </button>
  );
};


/* =========================================================
   Status Badge
========================================================= */

const StatusBadge = ({ status }) => {

  const normalizedStatus = (status || "").toUpperCase();

  const statusMap = {
    DELIVERED: {
      label: "Delivered",
      icon: <FiCheckCircle size={14} />,
      className:
        "bg-emerald-50 text-emerald-700 border-emerald-200",
    },

    SHIPPED: {
      label: "Shipped",
      icon: <FiTruck size={14} />,
      className:
        "bg-blue-50 text-blue-700 border-blue-200",
    },

    PROCESSING: {
      label: "Processing",
      icon: <FiClock size={14} />,
      className:
        "bg-amber-50 text-amber-700 border-amber-200",
    },

    IN_PROCESSING: {
      label: "Processing",
      icon: <FiClock size={14} />,
      className:
        "bg-amber-50 text-amber-700 border-amber-200",
    },

    PENDING: {
      label: "Pending",
      icon: <FiClock size={14} />,
      className:
        "bg-orange-50 text-orange-700 border-orange-200",
    },

    PLACED: {
      label: "Order Placed",
      icon: <FiPackage size={14} />,
      className:
        "bg-orange-50 text-orange-700 border-orange-200",
    },

    CANCELLED: {
      label: "Cancelled",
      icon: <FiXCircle size={14} />,
      className:
        "bg-gray-50 text-gray-600 border-gray-200",
    },
  };

  const config =
    statusMap[normalizedStatus] || {
      label: status || "Unknown",
      icon: <FiPackage size={14} />,
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
        ${config.className}
      `}
    >
      {config.icon}
      {config.label}
    </span>
  );
};


/* =========================================================
   Order Row
========================================================= */

const OrderRow = ({
  order,
  index,
  onClick,
  formatDate,
}) => {

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
        animationDelay: `${index * 70}ms`,
      }}
    >

      {/* Order ID */}
      <td className="px-4 sm:px-5 lg:px-6 py-4">

        <div className="flex items-center gap-2">

          <div
            className="
              w-9 h-9
              rounded-xl
              bg-[#FFF7ED]
              border border-[#fed7aa]
              flex items-center justify-center
              text-[#F97316]
              group-hover:bg-[#F97316]
              group-hover:text-white
              transition-all
            "
          >
            <FiPackage size={16} />
          </div>

          <div>
            <div className="text-[13px] text-[#9A3412] font-medium">
              Order ID
            </div>

            <div className="text-[14px] sm:text-[15px] font-bold text-[#431407]">
              #{order.orderId}
            </div>
          </div>

        </div>

      </td>


      {/* Date */}
      <td className="px-4 sm:px-5 lg:px-6 py-4 hidden md:table-cell">

        <div className="flex items-center gap-2 text-[13px] text-[#57534E]">

          <FiClock
            size={15}
            className="text-[#F97316]"
          />

          {formatDate(
            order.orderTime || order.createdAt
          )}

        </div>

      </td>


      {/* Status */}
      <td className="px-4 sm:px-5 lg:px-6 py-4">

        <StatusBadge status={order.status} />

      </td>


      {/* Total */}
      <td className="px-4 sm:px-5 lg:px-6 py-4">

        <div className="text-[15px] sm:text-[16px] font-bold text-[#9A3412]">

          ₹{Number(order.totalAmount || 0).toFixed(2)}

        </div>

      </td>


      {/* Action */}
      <td className="px-4 sm:px-5 lg:px-6 py-4">

        <div
          className="
            w-9 h-9
            rounded-xl
            bg-[#FFF7ED]
            border border-[#fed7aa]
            flex items-center justify-center
            text-[#F97316]
            group-hover:bg-[#F97316]
            group-hover:text-white
            group-hover:border-[#F97316]
            transition-all
          "
        >
          <FiChevronRight
            size={18}
            className="
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
   Mobile Order Card
========================================================= */

const MobileOrderCard = ({
  order,
  onClick,
  formatDate,
}) => {

  return (
    <button
      onClick={onClick}
      className="
        w-full
        text-left
        p-4
        bg-white
        border border-[#f3e8df]
        rounded-2xl
        hover:border-[#fdba74]
        hover:shadow-md
        transition-all
      "
    >

      <div className="flex items-start justify-between gap-3">

        <div className="flex items-center gap-3">

          <div
            className="
              w-10 h-10
              rounded-xl
              bg-[#FFF7ED]
              border border-[#fed7aa]
              flex items-center justify-center
              text-[#F97316]
              shrink-0
            "
          >
            <FiPackage size={18} />
          </div>

          <div>

            <p className="text-[12px] text-[#9A3412] font-medium">
              Order ID
            </p>

            <p className="text-[15px] font-bold text-[#431407]">
              #{order.orderId}
            </p>

          </div>

        </div>

        <FiChevronRight
          className="text-[#F97316]"
          size={19}
        />

      </div>


      <div className="mt-4 grid grid-cols-2 gap-3">

        <div>
          <p className="text-[12px] text-[#78716C]">
            Date
          </p>

          <p className="text-[13px] font-medium text-[#44403C] mt-0.5">
            {formatDate(
              order.orderTime || order.createdAt
            )}
          </p>
        </div>


        <div>
          <p className="text-[12px] text-[#78716C]">
            Total
          </p>

          <p className="text-[15px] font-bold text-[#9A3412] mt-0.5">
            ₹{Number(order.totalAmount || 0).toFixed(2)}
          </p>
        </div>

      </div>


      <div
        className="
          mt-4
          pt-3
          border-t border-[#f3e8df]
          flex items-center justify-between
        "
      >

        <StatusBadge status={order.status} />

        <span className="text-[12px] text-[#9A3412] font-medium">
          View details
        </span>

      </div>

    </button>
  );
};


/* =========================================================
   Dashboard
========================================================= */

const Dashboard = () => {

  const navigate = useNavigate();

  const [orders, setOrders] = useState();
  const [loadingOrders, setLoadingOrders] = useState(true);

  const {
    cartItems = { data: [] },
    isLoading: cartLoading,
  } = useCart();

  const {
    favorites: wishlistResponse = { data: [] },
    isLoading: wishlistLoading,
  } = useFavorites();


  /* =========================================================
     Fetch Orders
  ========================================================= */

  useEffect(() => {

    const fetchOrders = async () => {

      setLoadingOrders(true);

      try {

        const response = await getOrderHistory();

        const orderList =
          Array.isArray(response?.content)
            ? response
            : Array.isArray(response?.data)
              ? response
              : {
                data: [],
                totalOrders: 0,
              };

        setOrders(orderList);

      } catch (err) {

        console.error(
          "Failed to load orders:",
          err
        );

        setOrders({
          data: [],
          totalOrders: 0,
        });

      } finally {

        setLoadingOrders(false);

      }

    };

    fetchOrders();

  }, []);


  /* =========================================================
     Metrics
  ========================================================= */

  const metrics = [
    {
      icon: <FiShoppingBag />,
      value: orders?.totalOrders ?? 0,
      label: "Orders",
      to: "/account/orders",
    },
    {
      icon: <FiHeart />,
      value: wishlistResponse?.length || 0,
      label: "Wishlist",
      to: "/wishlist",
    },
    {
      icon: <FiShoppingCart />,
      value: cartItems?.data?.totalItems || 0,
      label: "Cart",
      to: "/cart",
    },
  ];


  /* =========================================================
     Helpers
  ========================================================= */

  const formatDate = (date) => {

    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );

  };


  const greeting = () => {

    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";

    if (hour < 18) return "Good Afternoon";

    return "Good Evening";

  };


  const orderData = orders?.data || [];

  const isLoading =
    loadingOrders ||
    cartLoading ||
    wishlistLoading;


  /* =========================================================
     Loading
  ========================================================= */

  if (isLoading) {

    return (
      <div
        className="
          min-h-screen
          bg-gradient-to-br
          from-[#FFF7ED]
          via-[#FFEDD5]
          to-[#FFF3E6]
          flex items-center justify-center
          p-4
        "
      >

        <div
          className="
            bg-white
            rounded-3xl
            border border-[#fed7aa]
            shadow-[0_15px_50px_rgba(249,115,22,0.12)]
            p-8 sm:p-10
            text-center
            max-w-sm
            w-full
          "
        >

          <div
            className="
              relative
              w-14 h-14
              mx-auto
              flex items-center justify-center
            "
          >

            <div
              className="
                absolute inset-0
                rounded-full
                bg-[#F97316]/10
                blur-xl
              "
            />

            <FiLoader
              className="
                relative
                text-[#F97316]
                animate-spin
              "
              size={32}
            />

          </div>

          <p className="mt-5 text-[15px] font-semibold text-[#431407]">
            Loading your dashboard...
          </p>

          <p className="mt-1.5 text-[13px] text-[#78716C]">
            Just a moment please
          </p>

        </div>

      </div>
    );
  }


  /* =========================================================
     Main Dashboard
  ========================================================= */

  return (

    <div
      className="
        min-h-screen
        bg-gradient-to-br
        from-[#FFF7ED]
        via-[#FFEDD5]/70
        to-[#FFF3E6]
        px-3 sm:px-4
        py-4 sm:py-6
        font-[var(--secondary-font)]
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
            WELCOME HEADER
        ===================================================== */}

        <section
          className="
            relative
            overflow-hidden
            rounded-2xl
            sm:rounded-3xl
            bg-white
            border border-[#fed7aa]
            shadow-[0_8px_30px_rgba(249,115,22,0.08)]
            p-4 sm:p-5
          "
        >

          {/* Decorative background */}
          <div
            className="
              absolute
              -right-20
              -top-24
              w-64
              h-64
              rounded-full
              bg-[#F97316]/5
              blur-3xl
            "
          />

          <div
            className="
              absolute
              -left-20
              -bottom-24
              w-52
              h-52
              rounded-full
              bg-[#FB923C]/5
              blur-3xl
            "
          />


          <div
            className="
              relative
              flex
              flex-col
              lg:flex-row
              lg:items-center
              lg:justify-between
              gap-5
            "
          >

            {/* Greeting */}

            <div className="flex items-center gap-3">

              <div
                className="
                  w-12 h-12
                  sm:w-14 sm:h-14
                  rounded-2xl
                  bg-gradient-to-br
                  from-[#F97316]
                  via-[#FB923C]
                  to-[#EA580C]
                  flex items-center justify-center
                  text-white
                  shadow-lg
                  shadow-orange-200
                  rotate-2
                "
              >
                <FiUser size={22} />
              </div>

              <div>

                <p
                  className="
                    text-[13px]
                    sm:text-[14px]
                    font-medium
                    text-[#9A3412]
                  "
                >
                  Welcome back
                </p>

                <h1
                  className="
                    text-lg
                    sm:text-xl
                    font-bold
                    text-[#431407]
                  "
                >
                  {greeting()}!
                </h1>

                <p
                  className="
                    mt-0.5
                    text-[13px]
                    sm:text-[14px]
                    text-[#78716C]
                  "
                >
                  Here's what's happening with your account.
                </p>

              </div>

            </div>


            {/* Metrics */}

            <div
              className="
                flex
                gap-2.5
                sm:gap-3
                overflow-x-auto
                pb-1
                scrollbar-hide
              "
            >

              {metrics.map((metric, index) => (

                <MetricCard
                  key={index}
                  {...metric}
                  onClick={() => navigate(metric.to)}
                />

              ))}

            </div>

          </div>

        </section>


        {/* =====================================================
            RECENT ORDERS
        ===================================================== */}

        <section
          className="
            bg-white
            rounded-2xl
            sm:rounded-3xl
            border border-[#fed7aa]
            shadow-[0_8px_30px_rgba(249,115,22,0.07)]
            overflow-hidden
          "
        >

          {/* Header */}

          <div
            className="
              px-4 sm:px-5 lg:px-6
              py-4 sm:py-5
              border-b border-[#f3e8df]
              bg-gradient-to-r
              from-[#FFF7ED]
              to-white
              flex
              items-center
              justify-between
              gap-3
            "
          >

            <div className="flex items-center gap-3">

              <div
                className="
                  w-10 h-10
                  rounded-xl
                  bg-gradient-to-br
                  from-[#F97316]
                  to-[#EA580C]
                  text-white
                  flex items-center justify-center
                  shadow-md
                  shadow-orange-100
                "
              >
                <FiPackage size={19} />
              </div>

              <div>

                <h2
                  className="
                    text-base
                    sm:text-lg
                    font-bold
                    text-[#431407]
                  "
                >
                  Recent Orders
                </h2>

                <p
                  className="
                    text-[13px]
                    text-[#78716C]
                    mt-0.5
                  "
                >
                  Track your latest purchases
                </p>

              </div>

            </div>


            <button
              onClick={() =>
                navigate("/account/orders")
              }
              className="
                inline-flex
                items-center
                gap-1.5
                px-3
                py-2
                rounded-xl
                bg-[#FFF7ED]
                border border-[#fed7aa]
                text-[#C2410C]
                text-[13px]
                font-semibold
                hover:bg-[#F97316]
                hover:text-white
                hover:border-[#F97316]
                transition-all
                shrink-0
              "
            >
              <span className="hidden sm:inline">
                View All
              </span>

              <span className="sm:hidden">
                All
              </span>

              <FiChevronRight size={16} />

            </button>

          </div>


          {/* Empty State */}

          {orderData.length === 0 ? (

            <div
              className="
                px-5
                py-12 sm:py-16
                text-center
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
                    absolute inset-0
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
                    flex items-center justify-center
                    text-[#F97316]
                  "
                >
                  <FiGift size={34} />
                </div>

              </div>


              <h3
                className="
                  text-lg
                  font-bold
                  text-[#431407]
                "
              >
                No orders yet
              </h3>

              <p
                className="
                  mt-1.5
                  text-[14px]
                  text-[#78716C]
                "
              >
                Start shopping to see your orders here.
              </p>


              <Link
                to="/products-page"
                className="
                  mt-5
                  inline-flex
                  items-center
                  gap-2
                  px-5
                  py-2.5
                  rounded-xl
                  bg-gradient-to-r
                  from-[#F97316]
                  to-[#EA580C]
                  text-white
                  text-[14px]
                  font-semibold
                  shadow-lg
                  shadow-orange-200
                  hover:shadow-xl
                  hover:-translate-y-0.5
                  transition-all
                "
              >
                <FiShoppingBag size={17} />
                Shop Now
              </Link>

            </div>

          ) : (

            <>

              {/* Desktop Table */}

              <div className="hidden md:block overflow-x-auto">

                <table className="w-full">

                  <thead>

                    <tr className="bg-[#FFF7ED]">

                      <th
                        className="
                          text-left
                          px-4 sm:px-5 lg:px-6
                          py-3.5
                          text-[12px]
                          font-bold
                          text-[#9A3412]
                          uppercase
                          tracking-wider
                        "
                      >
                        Order
                      </th>

                      <th
                        className="
                          text-left
                          px-4 sm:px-5 lg:px-6
                          py-3.5
                          text-[12px]
                          font-bold
                          text-[#9A3412]
                          uppercase
                          tracking-wider
                        "
                      >
                        Date
                      </th>

                      <th
                        className="
                          text-left
                          px-4 sm:px-5 lg:px-6
                          py-3.5
                          text-[12px]
                          font-bold
                          text-[#9A3412]
                          uppercase
                          tracking-wider
                        "
                      >
                        Status
                      </th>

                      <th
                        className="
                          text-left
                          px-4 sm:px-5 lg:px-6
                          py-3.5
                          text-[12px]
                          font-bold
                          text-[#9A3412]
                          uppercase
                          tracking-wider
                        "
                      >
                        Total
                      </th>

                      <th className="w-20" />

                    </tr>

                  </thead>

                  <tbody>

                    {orderData
                      .slice(0, 5)
                      .map((order, index) => (

                        <OrderRow
                          key={order.orderId}
                          order={order}
                          index={index}
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

                      ))}

                  </tbody>

                </table>

              </div>


              {/* Mobile Cards */}

              <div className="md:hidden p-3 space-y-3">

                {orderData
                  .slice(0, 5)
                  .map((order) => (

                    <MobileOrderCard
                      key={order.orderId}
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

                  ))}

              </div>

            </>

          )}


          {/* Footer */}

          {orderData.length > 0 && (

            <div
              className="
                px-4 sm:px-5 lg:px-6
                py-3.5
                border-t border-[#f3e8df]
                bg-[#FFFCF9]
                flex
                items-center
                justify-between
                gap-3
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-[13px]
                  text-[#78716C]
                "
              >

                <FiTrendingUp
                  size={15}
                  className="text-[#F97316]"
                />

                Showing your latest 5 orders

              </div>


              <div className="flex items-center gap-1">

                <span
                  className="
                    w-1.5 h-1.5
                    rounded-full
                    bg-[#F97316]
                    animate-pulse
                  "
                />

                <span
                  className="
                    w-1.5 h-1.5
                    rounded-full
                    bg-[#FB923C]
                    animate-pulse
                  "
                  style={{
                    animationDelay: "150ms",
                  }}
                />

                <span
                  className="
                    w-1.5 h-1.5
                    rounded-full
                    bg-[#FDBA74]
                    animate-pulse
                  "
                  style={{
                    animationDelay: "300ms",
                  }}
                />

              </div>

            </div>

          )}

        </section>

      </div>

    </div>
  );
};

export default Dashboard;