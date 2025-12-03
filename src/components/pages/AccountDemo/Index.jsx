
import {
  ShoppingBag,
  Zap,
  Truck,
  RotateCcw,
  Star,
  ChevronRight,
  Search,
  Heart,
  ShoppingCart,
} from "lucide-react";
import Layout from "./Layout";
import { Link } from "react-router-dom/cjs/react-router-dom.min";


export default function Index() {
  const categories = [
    {
      name: "Electronics",
      icon: "📱",
      color: "bg-blue-100",
      count: "2,456 items",
    },
    {
      name: "Fashion",
      icon: "👗",
      color: "bg-pink-100",
      count: "5,890 items",
    },
    {
      name: "Home & Garden",
      icon: "🏠",
      color: "bg-green-100",
      count: "1,234 items",
    },
    {
      name: "Sports",
      icon: "⚽",
      color: "bg-orange-100",
      count: "3,567 items",
    },
  ];

  const featuredProducts = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: 2499,
      rating: 4.5,
      reviews: 342,
      image: "bg-blue-200",
      discount: 20,
    },
    {
      id: 2,
      name: "Smartwatch",
      price: 4999,
      rating: 4.8,
      reviews: 156,
      image: "bg-purple-200",
      discount: 15,
    },
    {
      id: 3,
      name: "Camera",
      price: 34999,
      rating: 4.6,
      reviews: 89,
      image: "bg-amber-200",
      discount: 10,
    },
    {
      id: 4,
      name: "Laptop Stand",
      price: 1299,
      rating: 4.3,
      reviews: 234,
      image: "bg-cyan-200",
      discount: 25,
    },
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      text: "Great quality products and very fast delivery!",
      rating: 5,
    },
    {
      name: "Priya Singh",
      text: "Amazing customer service and affordable prices.",
      rating: 5,
    },
    {
      name: "Amit Patel",
      text: "Best shopping experience ever. Highly recommended!",
      rating: 4.5,
    },
  ];

  return (
    <Layout>
      <div className="space-y-12">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl overflow-hidden">
          <div className="relative z-10 px-6 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
            <div className="max-w-3xl">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Shop Amazing Products
              </h1>
              <p className="text-sm sm:text-base text-blue-100 mb-6">
                Discover thousands of quality items with fast delivery,
                competitive prices, and excellent customer service.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                  <ShoppingBag size={20} />
                  Start Shopping
                </button>
                <Link
                  to="/dashboard"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <User size={20} />
                  My Dashboard
                </Link>
              </div>
            </div>
          </div>
          {/* Background decoration */}
          <div className="absolute top-0 right-0 -mt-16 -mr-32 w-96 h-96 bg-blue-400 rounded-full opacity-20" />
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 flex items-start gap-4">
            <div className="bg-green-100 p-3 rounded-lg flex-shrink-0">
              <Zap size={24} className="text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Fast Delivery
              </h3>
              <p className="text-sm text-gray-600">
                Get your orders delivered within 2-3 days
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
              <Truck size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Free Shipping
              </h3>
              <p className="text-sm text-gray-600">
                On orders above ₹500
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 flex items-start gap-4">
            <div className="bg-purple-100 p-3 rounded-lg flex-shrink-0">
              <RotateCcw size={24} className="text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Easy Returns
              </h3>
              <p className="text-sm text-gray-600">
                30-day return policy on all products
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 flex items-start gap-4">
            <div className="bg-orange-100 p-3 rounded-lg flex-shrink-0">
              <ShoppingBag size={24} className="text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Secure Shopping
              </h3>
              <p className="text-sm text-gray-600">
                100% secure payment & data protection
              </p>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <button
                key={category.name}
                className={`${category.color} rounded-xl p-6 text-center hover:shadow-lg transition-all transform hover:scale-105`}
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-700">{category.count}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Featured Products Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Featured Products
            </h2>
            <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2">
              View All
              <ChevronRight size={20} />
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Product Image */}
                <div className={`${product.image} h-48 relative flex items-center justify-center`}>
                  {product.discount && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      -{product.discount}%
                    </div>
                  )}
                  <ShoppingBag size={64} className="text-gray-300 opacity-50" />
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm line-clamp-2">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < Math.floor(product.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      ({product.reviews})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <p className="text-xl font-bold text-gray-900">
                      ₹{product.price.toLocaleString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
                      <ShoppingCart size={18} />
                      Add to Cart
                    </button>
                    <button className="flex-1 border-2 border-gray-300 hover:border-red-500 text-gray-600 hover:text-red-500 font-semibold py-2 rounded-lg transition-colors flex items-center justify-center">
                      <Heart size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-8 text-center">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={
                        i < Math.floor(testimonial.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
                <p className="font-semibold text-gray-900">
                  {testimonial.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl overflow-hidden">
          <div className="px-6 py-12 sm:px-8 lg:px-12">
            <div className="max-w-2xl">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                Special Offer This Week!
              </h2>
              <p className="text-sm sm:text-base text-orange-100 mb-6">
                Get up to 40% discount on selected items. Limited time offer!
              </p>
              <button className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors flex items-center gap-2">
                Shop Now
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// User icon component (simple substitute)
function User({ size }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
