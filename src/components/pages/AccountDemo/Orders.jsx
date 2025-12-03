import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Loader,
  AlertCircle,
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle,
} from "lucide-react";
import Layout from "./Layout";

// Mock orders data
const mockOrders = [
  {
    id: "ORD-001",
    orderId: "ORD-001",
    date: "2024-01-15",
    orderTime: "2024-01-15T10:30:00",
    totalAmount: 2499,
    status: "Delivered",
    items: "2 items",
    orderItems: [
      {
        id: 1,
        productName: "Premium Wireless Headphones",
        imagePath: "/placeholder.svg",
        quantity: 1,
        price: 2499,
      },
    ],
  },
  {
    id: "ORD-002",
    orderId: "ORD-002",
    date: "2024-01-10",
    orderTime: "2024-01-10T14:45:00",
    totalAmount: 5499,
    status: "Shipped",
    items: "1 item",
    orderItems: [
      {
        id: 2,
        productName: "Smartwatch Pro",
        imagePath: "/placeholder.svg",
        quantity: 1,
        price: 5499,
      },
    ],
  },
  {
    id: "ORD-003",
    orderId: "ORD-003",
    date: "2024-01-05",
    orderTime: "2024-01-05T09:15:00",
    totalAmount: 1299,
    status: "Processing",
    items: "3 items",
    orderItems: [
      {
        id: 3,
        productName: "Phone Case",
        imagePath: "/placeholder.svg",
        quantity: 3,
        price: 1299,
      },
    ],
  },
  {
    id: "ORD-004",
    orderId: "ORD-004",
    date: "2023-12-28",
    orderTime: "2023-12-28T16:20:00",
    totalAmount: 34999,
    status: "Delivered",
    items: "1 item",
    orderItems: [
      {
        id: 4,
        productName: "Professional Camera",
        imagePath: "/placeholder.svg",
        quantity: 1,
        price: 34999,
      },
    ],
  },
];

const statuses = ["All", "Delivered", "Shipped", "Processing", "Cancelled"];

export default function Orders() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  const filteredOrders = useMemo(() => {
    return mockOrders.filter((order) => {
      const matchesSearch =
        searchQuery === "" ||
        order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.orderItems?.[0]?.productName
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        order.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const paginatedOrders = useMemo(() => {
    const start = currentPage * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [currentPage, filteredOrders]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case "DELIVERED":
        return <CheckCircle size={18} className="text-green-600" />;
      case "SHIPPED":
        return <Truck size={18} className="text-blue-600" />;
      case "PROCESSING":
        return <Clock size={18} className="text-yellow-600" />;
      default:
        return <Package size={18} className="text-gray-600" />;
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status?.toUpperCase()) {
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "SHIPPED":
        return "bg-blue-100 text-blue-800";
      case "PROCESSING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Package size={32} />
            Order History
          </h1>
          <p className="text-gray-600">View and manage your past orders</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by order ID or product name..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(0);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setCurrentPage(0);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    statusFilter === status
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        {filteredOrders.length > 0 && (
          <p className="text-sm text-gray-600">
            Showing {paginatedOrders.length} of {filteredOrders.length} orders
          </p>
        )}

        {/* Orders List */}
        {paginatedOrders.length > 0 ? (
          <div className="space-y-4">
            {paginatedOrders.map((order) => (
              <Link
                key={order.id}
                to={`/order-details/${order.orderId}`}
                className="block bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all p-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Product Image & Info */}
                  <div className="md:col-span-2 flex gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package size={32} className="text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {order.orderItems?.[0]?.productName}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {order.items}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(order.orderTime).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex flex-col items-start md:items-center justify-center">
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeColor(order.status)}`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex flex-col items-end justify-center">
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{order.totalAmount.toLocaleString()}
                    </p>
                    <ChevronRight size={20} className="text-gray-400 mt-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery || statusFilter !== "All"
                ? "No matching orders"
                : "No orders yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || statusFilter !== "All"
                ? "Try adjusting your search or filter"
                : "Your order history will appear here once you make a purchase"}
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              <ShoppingBag size={18} />
              Start Shopping
            </Link>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 pt-6">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                    currentPage === i
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage >= totalPages - 1}
              className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
