import React, { useState, useEffect, useMemo, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox, faBoxOpen, faExclamationCircle, faSpinner,
  faSearch, faTimes, faChevronDown, faCheckCircle,
  faTruck, faClock, faAngleLeft, faAngleRight
} from "@fortawesome/free-solid-svg-icons";
import { getOrderHistory } from "../../../../service/orderService";
import { formatCurrency } from "../../../../utils/formatters";
import { useHistory } from "react-router-dom";
import SmartButton from "../../../ui/SmartButton";

const Orders = () => {

  const [ordersData, setOrdersData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize ,setPageSize] = useState(10);
  const history = useHistory();


  const orderPayload = {
    page:currentPage,
    size:pageSize,
    status:statusFilter
  }

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getOrderHistory(orderPayload);
        console.log(data, 'ordersData')
        setOrdersData(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [currentPage ,pageSize , statusFilter]);


  const orders = useMemo(() => {
    if (!ordersData) return [];
    return Array.isArray(ordersData.data) ? ordersData.data : [];
  }, [ordersData]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q ||
        String(order.orderId || "").toLowerCase().includes(q) ||
        (order.items || []).some(item => String(item.name || "").toLowerCase().includes(q));

      const matchesStatus = !statusFilter || (order.status || "").toLowerCase() === statusFilter.toLowerCase();

      const matchesTime = !timeFilter || (
        Date.now() - new Date(order.orderTime || order.createdAt).getTime() <= parseInt(timeFilter) * 86400000
      );

      return matchesSearch && matchesStatus && matchesTime;
    });
  }, [orders, searchQuery, statusFilter, timeFilter ]);


  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(0); // 🔥 reset to first page
  };

  const getTimeFilterLabel = (value) => {
    const labels = { "7": "Last 7 Days", "30": "Last 30 Days", "90": "Last 3 Months", "180": "Last 6 Months", "365": "Last Year" };
    return labels[value] || "";
  };
  console.log(ordersData,'ordersData')
  const getStatusBadge = (status) => {
    const s = (status || "").toUpperCase();
    const map = {
      DELIVERED: { type: "success", icon: faCheckCircle },
      SHIPPED: { type: "info", icon: faTruck },
      PROCESSING: { type: "warning", icon: faClock },
      PENDING: { type: "warning", icon: faClock },
      CANCELLED: { type: "danger", icon: faTimes },
    };
    return map[s] || { type: "default", icon: faBox };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };
  const statusOptions = [
    { label: "Pending", value: "pending" },
    { label: "Placed", value: "placed" },
    { label: "Processing", value: "in_processing" },
    { label: "Packed", value: "packed" },
    { label: "Shipped", value: "shipped" },
    { label: "Delivered", value: "delivered" },
    { label: "Cancelled", value: "cancelled" },
  ];

  const timeOptions = [
    { label: "Last 7 Days", value: "7" },
    { label: "Last 30 Days", value: "30" },
    { label: "Last 3 Months", value: "90" },
    { label: "Last 6 Months", value: "180" },
    { label: "Last Year", value: "365" },
  ];


  return (
    <>
      {/* Subtle Animations */}
      <style jsx>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeInUp { animation: fadeInUp 0.4s ease-out forwards; }
      `}</style>

      <div className="font-secondary mt-[100px] md:mt-0 text-[var(--primary-text-color)] px-2 py-3 text-sm leading-tight bg-[#eeece8] min-h-screen">

        {/* Header */}
        <div className="bg-white border border-gray-300 rounded-lg p-2 mb-2 flex justify-between items-center">
          <h1 className="text-base font-bold text-[var(--primary-hover-color)] flex items-center gap-1.5 font-primary">
            <FontAwesomeIcon icon={faBox} /> Order History
          </h1>
          <p className="text-xs opacity-80 text-[var(--primary-text-color)]">Manage your past orders</p>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-300 rounded-lg p-2 mb-2 flex flex-wrap gap-1.5 items-center justify-between">
          <div className="relative flex-1 max-w-xs">
            <FontAwesomeIcon icon={faSearch} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full pl-8 pr-3 py-1.5 h-[40px] sm:h-9 bg-white text-sm border border-gray-300 rounded-full focus:outline-none focus:shadow-lg text-[var(--primary-text-color)]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-600">
                <FontAwesomeIcon icon={faTimes} className="text-xs" />
              </button>
            )}
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            {/* STATUS */}
            <div className="relative">
              <select
                className="appearance-none bg-white h-8 border border-gray-300 rounded-full px-4 pr-6 text-xs focus:outline-none text-[var(--primary-text-color)]"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <FontAwesomeIcon
                icon={faChevronDown}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none"
              />
            </div>

            {/* TIME */}
            <div className="relative">
              <select
                className="appearance-none bg-white h-8 border border-gray-300 rounded-full px-4 pr-6 text-xs  focus:outline-none text-[var(--primary-text-color)]"
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
              >
                <option value="">All Time</option>
                {timeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <FontAwesomeIcon
                icon={faChevronDown}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none"
              />
            </div>
          </div>

        </div>

        {/* Active Filters */}
        {(statusFilter || timeFilter || searchQuery) && (
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1 p-2 bg-white text-xs">
            <div className="flex flex-wrap items-center gap-1.5  text-[var(--primary-text-color)] gap-2  text-xs">
              {/* Label */}
              <span className="font-semibold text-gray-700">
                Active Filters:
              </span>

              {/* Status Filter */}
              {statusFilter && (
                <span className="inline-flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded border">
                  {statusFilter}
                  <button
                    onClick={() => setStatusFilter("")}
                    className="hover:text-red-600"
                  >
                    <FontAwesomeIcon icon={faTimes} className="text-xs" />
                  </button>
                </span>
              )}

              {/* Time Filter */}
              {timeFilter && (
                <span className="inline-flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded border">
                  {getTimeFilterLabel(timeFilter)}
                  <button
                    onClick={() => setTimeFilter("")}
                    className="hover:text-red-600"
                  >
                    <FontAwesomeIcon icon={faTimes} className="text-xs" />
                  </button>
                </span>
              )}

              {/* Search Filter (optional, if you use it) */}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded border">
                  "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery("")}
                    className="hover:text-red-600"
                  >
                    <FontAwesomeIcon icon={faTimes} className="text-xs" />
                  </button>
                </span>
              )}
            </div>
          

            {/* Clear All */}
            {(statusFilter || timeFilter || searchQuery) && (
              <SmartButton
                onClick={() => {
                  setStatusFilter("");
                  setTimeFilter("");
                  setSearchQuery("");
                }}
                size="md"
                hover
              >
                Clear all
              </SmartButton>
            )}
          </div>
        )}


        {/* Content */}
        {loading ? (
          <div className="bg-white border border-gray-300 rounded-sm p-5 text-center">
            <FontAwesomeIcon icon={faSpinner} spin className="text-lg text-[var(--primary-hover-color)]" /> Loading your orders...
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-sm p-5 text-center">
            <FontAwesomeIcon icon={faExclamationCircle} className="text-2xl text-red-600 mb-2" />
            <p className="text-sm">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-2 px-3 py-1.5 bg-[#041f60] text-white text-xs rounded hover:bg-[#f16137]">
              Retry
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white border border-gray-300 rounded-sm p-8 text-center">
            <FontAwesomeIcon icon={faBoxOpen} className="text-5xl text-gray-300 mb-3" />
            <p className="text-sm">
              {orders.length === 0 ? "You haven't placed any orders yet" : "No orders match your filters"}
            </p>
            {(statusFilter || timeFilter || searchQuery) && (
              <button
                onClick={() => { setSearchQuery(""); setStatusFilter(""); setTimeFilter(""); }}
                className="mt-3 px-4 py-1.5 bg-[#f16137] text-white text-xs rounded"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="bg-white border border-gray-300 rounded-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm ">
                  <thead className="bg-gray-50 border-b border-gray-300">
                    <tr>
                      <th className="text-left px-3 py-2 text-xs font-bold uppercase text-[var(--primary-text-color)]">Order ID</th>
                      <th className="text-left px-3 py-2 text-xs font-bold uppercase text-[var(--primary-text-color)] hidden sm:table-cell">Date</th>
                      <th className="text-left px-3 py-2 text-xs font-bold uppercase text-[var(--primary-text-color)]">Status</th>
                      <th className="text-left px-3 py-2 text-xs font-bold uppercase text-[var(--primary-text-color)] ">Total</th>
                      <th className="text-center px-3 py-2">Know More</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order, i) => {
                      const badge = getStatusBadge(order.status);
                      return (
                        <tr
                          key={order.orderId || order.id}
                          className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer animate-fadeInUp"
                          style={{ animationDelay: `${i * 50}ms` }}
                          onClick={() => history.push(`/account/orderdetails/${order.orderId}`, { order })}
                        >
                          <td className="px-2 py-2 font-semibold text-[var(--primary-hover-color)]">#{order.orderId || order.id}</td>
                          <td className="px-2 py-2 text-gray-600 hidden sm:table-cell">{formatDate(order.orderTime || order.createdAt)}</td>
                          <td className="px-2 py-2">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border
                              ${badge.type === "success" || badge.type === "info" || badge.type === "warning" ? "text-[var(--primary-text-color)] border-[#041f60]" : ""}
                              ${badge.type === "danger" ? "text-[var(--primary-hover-color)] border-[#f16137]" : ""}
                              ${badge.type === "default" ? "text-gray-600 border-gray-400" : ""}
                            `}>
                              <FontAwesomeIcon icon={badge.icon} className="text-xs" /> {badge.text}
                            </span>
                          </td>
                          <td className="px-2 py-2 font-semibold text-[var(--primary-hover-color)] items-end">{formatCurrency(order.totalAmount || order.amount)}</td>
                          <td className="px-2 py-2 text-center">
                            <FontAwesomeIcon icon={faAngleRight} className="text-gray-400 hover:text-[var(--primary-hover-color)]" />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
           <div className="flex bg-white  justify-between items-center gap-1 mt-2 text-xs p-2 rounded-md">
            <div>
                      <p>Total Orders : {ordersData?.totalOrders || 0} </p>
              
            </div>

            
                    {ordersData && (
                      <div className="flex justify-between items-center text-xs gap-1 ">

                        {/* LEFT: Pagination */}
                        <div className="flex items-center gap-2">
                          <button
                            disabled={currentPage === 0}
                            onClick={() => handlePageChange(currentPage - 1)}
                            className="p-1.5 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-100"
                          >
                            <FontAwesomeIcon icon={faAngleLeft} />
                          </button>

                          <span>
                            Page {currentPage + 1} of {ordersData.totalPages}
                          </span>

                          <button
                            disabled={currentPage >= ordersData.totalPages - 1}
                            onClick={() => handlePageChange(currentPage + 1)}
                            className="p-1.5 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-100"
                          >
                            <FontAwesomeIcon icon={faAngleRight} />
                          </button>
                        </div>

                        {/* RIGHT: Page Size Selector */}
                        <div className="flex items-center gap-1 text-xs">
                          <span className="text-gray-600">Rows:</span>

                          <select
                            value={pageSize}
                            onChange={handlePageSizeChange}
                            className="
                            h-8
      border border-gray-300
      rounded
      px-2 py-1
      bg-white text-gray-700
      focus:outline-none focus:ring-1 focus:ring-gray-300
      cursor-pointer
    "
                          >
                            {[5, 10, 20, 50].map((size) => (
                              <option key={size} value={size}>
                                {size}
                              </option>
                            ))}
                          </select>
                        </div>


                      </div>
                    )}

            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Orders;