import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Package,
  Truck,
  MapPin,
  Phone,
  Calendar,
  DollarSign,
  Check,
  ChevronLeft,
  AlertCircle,
} from "lucide-react";
import Layout from "./Layout";

// Mock order details
const mockOrder = {
  orderId: "ORD-002",
  customerName: "Raj Kumar",
  contact: "+91 98765 43210",
  status: "In Transit",
  orderTime: "2024-01-10T14:45:00",
  totalAmount: 5499,
  shippingFee: 0,
  paymentMode: "Credit Card",
  paymentStatus: "Paid",
  orderItems: [
    {
      id: 1,
      productName: "Smartwatch Pro",
      imagePath: "/placeholder.svg",
      quantity: 1,
      price: 5499,
      weight: "150g",
    },
  ],
  address: {
    addressLine: "123 Main Street",
    locality: "Tech Park",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    landmark: "Near XYZ Mall",
  },
};

const mockTrackingTimeline = [
  {
    status: "Order Confirmed",
    date: "2024-01-10",
    time: "14:45",
    completed: true,
    remarks: "Your order has been confirmed",
  },
  {
    status: "Processing",
    date: "2024-01-10",
    time: "16:20",
    completed: true,
    remarks: "Your order is being prepared",
  },
  {
    status: "Packed",
    date: "2024-01-11",
    time: "09:30",
    completed: true,
    remarks: "Your order has been packed",
  },
  {
    status: "Shipped",
    date: "2024-01-11",
    time: "14:15",
    completed: true,
    remarks: "Your order has been shipped",
  },
  {
    status: "In Transit",
    date: "2024-01-12",
    time: "10:00",
    completed: true,
    remarks: "Your order is on the way to you",
  },
  {
    status: "Out for Delivery",
    date: "2024-01-14",
    time: "08:00",
    completed: false,
    remarks: "Your order is out for delivery",
  },
  {
    status: "Delivered",
    date: "2024-01-14",
    time: "Expected",
    completed: false,
    remarks: "Your order will be delivered soon",
  },
];

const mockAdminAddress = {
  name: "ShopHub Store",
  addressLine1: "456 Commerce Street",
  addressLine2: "Trade Center",
  city: "Bangalore",
  state: "Karnataka",
  pincode: "560001",
  country: "India",
  phone: "+91 80 1234 5678",
  alternatePhone: "+91 80 1234 5679",
};

export default function OrderDetails() {
  const { orderId } = useParams();
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const order = mockOrder; // Replace with actual data fetch using orderId

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "in transit":
        return "bg-blue-100 text-blue-800";
      case "processing":
      case "packed":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/orders"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
          >
            <ChevronLeft size={20} />
            Back to Orders
          </Link>
        </div>

        {/* Order Status Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Order ID</p>
              <p className="text-2xl font-bold text-gray-900">
                {order.orderId}
              </p>
            </div>

            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}
            >
              {order.status}
            </span>

            <button
              onClick={() => setIsTrackingOpen(!isTrackingOpen)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <Truck size={18} />
              Track Order
            </button>
          </div>
        </div>

        {/* Tracking Timeline Modal */}
        {isTrackingOpen && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Order Tracking - {order.orderId}
              </h2>
              <button
                onClick={() => setIsTrackingOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {mockTrackingTimeline.map((step, index) => {
                const isLast = index === mockTrackingTimeline.length - 1;
                const isCurrent = step.completed;

                return (
                  <div key={index} className="flex gap-4">
                    {/* Timeline Dot and Line */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                          isCurrent ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        {isCurrent ? (
                          <Check size={20} />
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </div>
                      {!isLast && (
                        <div
                          className={`w-1 h-16 ${
                            isCurrent ? "bg-green-500" : "bg-gray-300"
                          }`}
                        />
                      )}
                    </div>

                    {/* Timeline Content */}
                    <div className="flex-1 pt-2">
                      <h4 className="font-semibold text-gray-900">
                        {step.status}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {step.date} at {step.time}
                      </p>
                      {step.remarks && (
                        <p className="text-sm text-gray-700 mt-2">
                          {step.remarks}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Package size={24} />
            Items in Your Order
          </h2>

          <div className="space-y-4">
            {order.orderItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package size={32} className="text-gray-400" />
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {item.productName}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Quantity: {item.quantity}
                  </p>
                  {item.weight && (
                    <p className="text-sm text-gray-600">Weight: {item.weight}</p>
                  )}
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    ₹{item.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Order Summary
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <p className="text-gray-600">Subtotal</p>
              <p className="font-semibold text-gray-900">
                ₹{order.totalAmount.toLocaleString()}
              </p>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <p className="text-gray-600">Shipping</p>
              <p className="font-semibold text-gray-900">
                {order.shippingFee > 0
                  ? `₹${order.shippingFee.toLocaleString()}`
                  : "Free"}
              </p>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <p className="text-gray-600">Payment Method</p>
              <p className="font-semibold text-gray-900">{order.paymentMode}</p>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <p className="text-gray-600">Payment Status</p>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                {order.paymentStatus}
              </span>
            </div>

            <div className="flex justify-between items-center pt-4 bg-blue-50 p-4 rounded-lg">
              <p className="font-semibold text-gray-900">Total Amount</p>
              <p className="text-2xl font-bold text-blue-600">
                ₹{order.totalAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Delivery From */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Truck size={22} />
              Shipped From
            </h2>

            <div className="space-y-2 text-gray-700">
              <p className="font-semibold">{mockAdminAddress.name}</p>
              <p className="text-sm">{mockAdminAddress.addressLine1}</p>
              <p className="text-sm">{mockAdminAddress.addressLine2}</p>
              <p className="text-sm">
                {mockAdminAddress.city}, {mockAdminAddress.state} -{" "}
                {mockAdminAddress.pincode}
              </p>
              <p className="text-sm">{mockAdminAddress.country}</p>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Phone size={16} />
                  <span className="text-sm">{mockAdminAddress.phone}</span>
                </div>
                {mockAdminAddress.alternatePhone && (
                  <div className="flex items-center gap-2">
                    <Phone size={16} />
                    <span className="text-sm">
                      {mockAdminAddress.alternatePhone}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Shipping To */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin size={22} />
              Shipping To
            </h2>

            <div className="space-y-2 text-gray-700">
              <p className="font-semibold">{order.customerName}</p>
              <p className="text-sm">{order.address.addressLine}</p>
              <p className="text-sm">{order.address.locality}</p>
              <p className="text-sm">
                {order.address.city}, {order.address.state} -{" "}
                {order.address.pincode}
              </p>
              {order.address.landmark && (
                <p className="text-sm">Landmark: {order.address.landmark}</p>
              )}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  <span className="text-sm">{order.contact}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Shopping Button */}
        <div className="text-center py-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            <Package size={20} />
            Continue Shopping
          </Link>
        </div>
      </div>
    </Layout>
  );
}
