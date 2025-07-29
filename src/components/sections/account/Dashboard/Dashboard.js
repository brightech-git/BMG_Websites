import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiShoppingBag, FiPackage, FiHeart, FiShoppingCart,
  FiTruck, FiCheckCircle, FiClock
} from 'react-icons/fi';
import './Dashboard.css';

const Dashboard = () => {
  const stats = [
    { icon: <FiShoppingBag size={24} />, value: 12, label: 'Total Orders', link: '/account/orders', color: 'bg-blue-100 text-blue-600' },
    { icon: <FiClock size={24} />, value: 3, label: 'Pending', link: '/account/orders?status=pending', color: 'bg-amber-100 text-amber-600' },
    { icon: <FiTruck size={24} />, value: 5, label: 'Shipped', link: '/account/orders?status=shipped', color: 'bg-indigo-100 text-indigo-600' },
    { icon: <FiCheckCircle size={24} />, value: 4, label: 'Delivered', link: '/account/orders?status=delivered', color: 'bg-green-100 text-green-600' },
    { icon: <FiHeart size={24} />, value: 8, label: 'Wishlist', link: '/account/wishlist', color: 'bg-rose-100 text-rose-600' },
    { icon: <FiShoppingCart size={24} />, value: 2, label: 'Cart', link: '/account/cart', color: 'bg-purple-100 text-purple-600' }
  ];

  const recentOrders = [
    { id: '#3258', date: '12 Jun 2023', status: 'Delivered', total: '$149.99', items: ['Wireless Earbuds', 'Phone Case'] },
    { id: '#3257', date: '10 Jun 2023', status: 'Shipped', total: '$89.99', items: ['Smart Watch'] },
    { id: '#3256', date: '05 Jun 2023', status: 'Processing', total: '$249.99', items: ['Bluetooth Speaker', 'USB Cable'] }
  ];

  const getStatusBadge = (status) => {
    switch(status.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back, John! Here's what's happening with your account.</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <Link to={stat.link} key={index} className={`stat-card ${stat.color}`}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="recent-orders">
        <div className="section-header">
          <h2>Recent Orders</h2>
          <Link to="/account/orders" className="view-all-btn">View All Orders</Link>
        </div>
        
        <div className="orders-table">
          <div className="table-header">
            <div>Order ID</div>
            <div>Date</div>
            <div>Items</div>
            <div>Total</div>
            <div>Status</div>
          </div>
          
          {recentOrders.map((order, index) => (
            <Link to={`/account/orders/${order.id}`} key={index} className="table-row">
              <div className="font-medium">{order.id}</div>
              <div>{order.date}</div>
              <div className="truncate">{order.items.join(', ')}</div>
              <div>{order.total}</div>
              <div>
                <span className={`status-badge ${getStatusBadge(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;