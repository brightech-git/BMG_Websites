import React, { useState } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { 
  FiShoppingBag, FiFilter, FiSearch, FiChevronDown,
  FiTruck, FiCheckCircle, FiClock, FiX
} from 'react-icons/fi';
import './OrderStyles.css';

const Orders = () => {
  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const statusFilter = query.get('status') || 'all';
  
  const orders = [
    { id: '#3258', date: '12 Jun 2023', status: 'Delivered', total: '$149.99', items: 2 },
    { id: '#3257', date: '10 Jun 2023', status: 'Shipped', total: '$89.99', items: 1 },
    { id: '#3256', date: '05 Jun 2023', status: 'Processing', total: '$249.99', items: 2 },
    { id: '#3255', date: '01 Jun 2023', status: 'Delivered', total: '$79.99', items: 1 },
    { id: '#3254', date: '28 May 2023', status: 'Delivered', total: '$199.99', items: 3 },
    { id: '#3253', date: '25 May 2023', status: 'Cancelled', total: '$59.99', items: 1 }
  ];

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status.toLowerCase() === statusFilter.toLowerCase());

  const handleStatusFilter = (status) => {
    const newQuery = new URLSearchParams();
    if (status !== 'all') {
      newQuery.set('status', status);
    }
    history.push({
      pathname: location.pathname,
      search: newQuery.toString()
    });
  };

  const statusFilters = [
    { value: 'all', label: 'All Orders' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const getStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case 'delivered': return <FiCheckCircle className="mr-1" />;
      case 'shipped': return <FiTruck className="mr-1" />;
      case 'processing': return <FiClock className="mr-1" />;
      case 'cancelled': return <FiX className="mr-1" />;
      default: return <FiShoppingBag className="mr-1" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-amber-100 text-amber-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>My Orders</h1>
        <p>View and manage your order history</p>
      </div>

      <div className="orders-toolbar">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="filters">
          <button 
            className="filter-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FiFilter className="mr-2" />
            Filters
            <FiChevronDown className={`ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          
          {showFilters && (
            <div className="filter-dropdown">
              {statusFilters.map(filter => (
                <button
                  key={filter.value}
                  className={`filter-option ${statusFilter === filter.value ? 'active' : ''}`}
                  onClick={() => {
                    handleStatusFilter(filter.value);
                    setShowFilters(false);
                  }}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="status-tabs">
        {statusFilters.map(filter => (
          <button
            key={filter.value}
            className={`status-tab ${statusFilter === filter.value ? 'active' : ''}`}
            onClick={() => handleStatusFilter(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="empty-orders">
          <FiShoppingBag size={48} className="empty-icon" />
          <h3>No orders found</h3>
          <p>You don't have any {statusFilter === 'all' ? '' : statusFilter} orders yet</p>
          <Link to="/shop" className="shop-btn">Start Shopping</Link>
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map(order => (
            <Link to={`/account/orders/${order.id}`} key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <h3>Order {order.id}</h3>
                  <p className="order-date">Placed on {order.date}</p>
                </div>
                <span className={`status-badge ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </span>
              </div>
              
              <div className="order-details">
                <div className="order-items">
                  <span className="items-count">{order.items} item{order.items > 1 ? 's' : ''}</span>
                </div>
                <div className="order-total">
                  <span>Total:</span>
                  <span className="total-amount">{order.total}</span>
                </div>
              </div>
              
              <div className="order-actions">
                <button 
                  className="action-btn reorder"
                  onClick={(e) => {
                    e.preventDefault();
                    // Handle reorder logic here
                  }}
                >
                  Reorder
                </button>
                <button 
                  className="action-btn details"
                  onClick={(e) => {
                    e.preventDefault();
                    history.push(`/account/orders/${order.id}`);
                  }}
                >
                  View Details
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;