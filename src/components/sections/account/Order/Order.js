// OrdersPage.jsx (Enhanced with classNames, accessibility, and structure)
// NOTE: This code assumes CSS classes (shown below) exist and are scoped properly.

import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useOrderHistory } from '../../../../hook/order/useOrderHistoryQuery';
import { formatCurrency } from '../../../../assets/utills/formatters';
import AccountSideBar from '../AccountSidebar/AccountSideBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBox, faBoxOpen, faExclamationCircle, faSpinner, faAngleLeft,
  faAngleRight, faShoppingBag, faUndo, faCalendarAlt, faReceipt,
  faUser, faCreditCard
} from '@fortawesome/free-solid-svg-icons';
import './OrderStyles.css';

const getFirstImageUrl = (imagePath) => {
  if (!imagePath) return null;
  const cleaned = imagePath.trim().replace(/\[|\]/g, '');
  const paths = cleaned.split(/["',]+/).filter(p => p.startsWith('/uploads'));
  return paths.length ? `https://app.bmgjewellers.com${paths[0]}` : null;
};

const OrdersPage = () => {
  const history = useHistory();
  const [currentPage, setCurrentPage] = useState(0);
  const { data, isLoading, error } = useOrderHistory({ page: currentPage, size: 10 });
  const orders = Array.isArray(data?.content) ? data.content : (Array.isArray(data) ? data : []);

  const handlePageChange = (page) => {
    if (page >= 0 && page < (data?.totalPages || 1)) setCurrentPage(page);
  };

  const handleOrderClick = (order) => {
    history.push({
      pathname: `/orderdetail/${order.orderId || order.id}`,
      state: { orderData: order },
    });
  };

  return (
    <div className="account-container">
      <AccountSideBar />
      <div className="order-content">
        {isLoading ? (
          <div className="order-loading">
            <FontAwesomeIcon icon={faSpinner} spin size="3x" />
            <p>Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="order-error">
            <FontAwesomeIcon icon={faExclamationCircle} size="3x" />
            <h3>Something went wrong</h3>
            <p>{error.message || 'Please try refreshing the page.'}</p>
            <button onClick={() => window.location.reload()}>
              <FontAwesomeIcon icon={faUndo} /> Retry
            </button>
          </div>
        ) : !orders.length ? (
          <div className="order-empty">
            <FontAwesomeIcon icon={faBoxOpen} size="5x" />
            <h3>No orders yet</h3>
            <p>Your order history will appear here once you make a purchase.</p>
            <button onClick={() => history.push('/shop-left')}>
              <FontAwesomeIcon icon={faShoppingBag} /> Start Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="order-header">
              <h1><FontAwesomeIcon icon={faBox} /> Order History</h1>
              <p>View and manage your past orders</p>
            </div>

            {/* Desktop View */}
            <div className="order-table-wrapper desktop-view">
              <table className="order-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.orderId || order.id} onClick={() => handleOrderClick(order)}>
                      <td>
                        <div className="order-summary">
                          <img src={getFirstImageUrl(order.orderItems?.[0]?.image_path)} alt="Product" />
                          <div>
                            <div>#{order.orderId || order.id}</div>
                            <div>{order.orderItems?.[0]?.productName}</div>
                          </div>
                        </div>
                      </td>
                      <td>{new Date(order.orderTime || order.createdAt).toLocaleDateString()}</td>
                      <td><FontAwesomeIcon icon={faUser} /> {order.customerName}</td>
                      <td className={`status ${order.status?.toLowerCase().replace(/\s/g, '-')}`}>{order.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="mobile-view">
              {orders.map((order) => (
                <div className="order-card" key={order.orderId || order.id} onClick={() => handleOrderClick(order)}>
                  <div className="order-card-header">
                    <span><FontAwesomeIcon icon={faReceipt} /> #{order.orderId || order.id}</span>
                    <span className={`status ${order.status?.toLowerCase().replace(/\s/g, '-')}`}>{order.status}</span>
                  </div>
                  <div className="order-card-body">
                    <img src={getFirstImageUrl(order.orderItems?.[0]?.image_path)} alt="Product" />
                    <div>
                      <div>{order.orderItems?.[0]?.productName}</div>
                      <div><FontAwesomeIcon icon={faCalendarAlt} /> {new Date(order.orderTime || order.createdAt).toLocaleDateString()}</div>
                      <div><FontAwesomeIcon icon={faUser} /> {order.customerName}</div>
                      {/* <div><FontAwesomeIcon icon={faCreditCard} /> {order.paymentMethod}</div> */}
                      <div>Total: {formatCurrency(order.totalAmount || order.amount)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {data?.totalPages > 1 && (
              <div className="pagination-controls">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>
                  <FontAwesomeIcon icon={faAngleLeft} /> Prev
                </button>
                <span>Page {currentPage + 1} of {data.totalPages}</span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= data.totalPages - 1}>
                  Next <FontAwesomeIcon icon={faAngleRight} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;