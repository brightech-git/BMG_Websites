'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBox, faBoxOpen, faExclamationCircle, faSpinner, faImage,
  faAngleLeft, faReceipt, faCheckCircle, faTimesCircle, faTruck,
  faShoppingBag, faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import { formatCurrency } from '../../../../assets/utills/formatters';
import { Link, useLocation } from 'react-router-dom';
import { useCancelOrder } from '../../../../hook/order/useOrderMutation';
import { useTrackOrderById } from '../../../../hook/order/useOrderTracking';
import { toast } from 'react-toastify';
import { useAdminAddress } from '../../../../hook/address/useAdminAddress';
import SmartButton from '../../../ui/SmartButton';
import { useHistory, useParams } from 'react-router-dom';
import { getOrderHistory } from "../../../../service/orderService";
import { getPaymentStatus } from '../../../../service/paymentServiceicici';


const OrderDetail = () => {
  const location = useLocation();

  const { id } = useParams();

  const passedOrder = location.state?.order || null;


  const passedOrderId = location?.state?.orderId || id ;

  // console.log(passedOrderId ,'passed')
  const [loading, setLoading] = useState(true);
  const[ordersData , setOrdersData] =useState(null);
  const [order, setOrder] = useState(passedOrder);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const history = useHistory();

  const canReorder = ["pending"]

  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);

  const pageSize = 10;

  const orderId= order?.orderId;
  const { mutate: cancelOrder, isLoading: isCancelling } = useCancelOrder();
  const { data: trackData, refetch: fetchTrackData, isLoading: isTracking } = useTrackOrderById(order?.orderId || orderId);
  const { data: adminAddress, isLoading: addrLoading, isError: addrError } = useAdminAddress();

  const defaultAddress = useMemo(() =>
    adminAddress?.find((a) => a.isDefault) || null, [adminAddress]
  );
 useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getOrderHistory(currentPage, pageSize);
        setOrdersData(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [currentPage]);

  const orders = useMemo(() => {
    if (!ordersData) return [];
    return Array.isArray(ordersData) ? ordersData : [];
  }, [ordersData]); 
  
  useEffect(() => {
    if (!passedOrder && passedOrderId && orders.length > 0) {
      const matched = orders.find(o => o.orderId === passedOrderId);
      if (matched) {
        setOrder(matched);
      } else {
        setError("Order not found");
      }
    }
  }, [passedOrder, passedOrderId, orders]);

  useEffect(() => {
    if ((order?.orderId || orderId) && !trackData) fetchTrackData();
  }, [order?.orderId, orderId, fetchTrackData, trackData]);

  const currentStatus = trackData?.current_status || order?.status || 'PLACED';
  const canCancel = trackData?.canCancel ?? !['SHIPPED', 'SHIPPING', 'OUT_FOR_DELIVERY', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED', 'Booked'].includes(currentStatus);

  const getStatusIcon = (status) => {
    const map = {
      PLACED: faReceipt, IN_PROCESSING: faSpinner, PACKED: faBox,
      SHIPPED: faTruck, SHIPPING: faTruck, Booked: faTruck,
      OUT_FOR_DELIVERY: faTruck, IN_TRANSIT: faTruck,
      DELIVERED: faCheckCircle, DELIVERY_FAILED: faExclamationCircle,
      CANCELLED: faTimesCircle
    };
    return map[status] || faInfoCircle;
  };

  const getStatusLabel = (status) => {
    const map = {
      PENDING: 'Pending', PLACED: 'Order Placed', IN_PROCESSING: 'Processing',
      PACKED: 'Packed', SHIPPED: 'Shipped', SHIPPING: 'Shipping',
      Booked: 'Booked', OUT_FOR_DELIVERY: 'Out for Delivery',
      IN_TRANSIT: 'In Transit', DELIVERED: 'Delivered',
      DELIVERY_FAILED: 'Delivery Failed', CANCELLED: 'Cancelled'
    };
    return map[status] || status;
  };

  const timeline = useMemo(() => {
    if (!trackData?.timeline?.length) {
      return [{ label: getStatusLabel(currentStatus), updated_at: order?.orderTime || new Date().toISOString() }];
    }
    return [...trackData.timeline].sort((a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime());
  }, [trackData, currentStatus, order?.orderTime]);

  const handleCancel = () => {
    const reason = prompt('Why do you want to cancel this order?');
    if (!reason) return;
    
    if (!window.confirm(`Cancel order? Reason: ${reason}`)) return;

    cancelOrder(
      { orderId: order.orderId, newStatus: 'CANCELLED', remarks: `Cancelled by user: ${reason}`, paymentMode: order.paymentMode, paymentStatus: order.paymentStatus },
      {
        onSuccess: () => { 
          toast.success('Order cancelled'); 
          setIsStatusModalOpen(false); },
        onError: () => toast.error('Failed to cancel')
      }
    );
  };

  const handleReorder = async (order) => {
    console.log(order,'single order')
    try {
      // 🚫 If order status is not allowed, redirect to products
      if (!canReorder.includes(order.status.toLowerCase())) {
        history.push("/products-page");
        return;
      }

      // ✅ Confirm action
      const isConfirmed = window.confirm(
        "Do you want to proceed to payment for this order again?"
      );

      if (!isConfirmed) return;

      // 🔄 Check payment / create new order
      const paymentResult = await getPaymentStatus(order.orderId);

      const newOrderId = paymentResult?.newOrderId;

      if (!newOrderId) {
        console.error("New order ID not returned");
        return;
      }

      // 🚀 Redirect to payment
      history.push(`/payment/${newOrderId}`);
    } catch (error) {
      console.error("Reorder failed:", error);
    }
  };


  const OrderDetailsSkeleton = () => {
    return (
      <div className="bg-[#eeece8] text-[var(--primary-text-color)] py-2 mt-[130px] md:mt-0 px-2 lg:px-3">
        <div className="max-w mx-auto space-y-2 animate-pulse">

          {/* Status Bar */}
          <div className="bg-white rounded-xl border border-gray-300 p-2 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-2">
              <div className="h-4 w-16 bg-gray-300 rounded"></div>
              <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
            </div>
            <div className="h-8 w-24 bg-gray-300 rounded"></div>
          </div>

          <div className="grid lg:grid-cols-3 gap-2">

            {/* Items Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Items Card */}
              <div className="bg-white rounded-xl border border-gray-300 shadow-sm overflow-hidden">
                <div className="bg-[#f7f7f7] border-b border-gray-300 px-2 py-1.5 font-semibold text-lg flex items-center gap-2">
                  <div className="h-5 w-5 bg-gray-300 rounded"></div>
                  <div className="h-5 w-40 bg-gray-300 rounded"></div>
                </div>

                <div className="p-2 space-y-3">

                  {[1, 2].map((i) => (
                    <div key={i} className="flex gap-2 p-2 bg-white border border-gray-200 rounded-lg">
                      <div className="w-10 sm:w-16 h-10 sm:h-16 bg-gray-200 rounded-sm"></div>

                      <div className="flex-1 flex justify-between items-center">
                        <div className="space-y-2">
                          <div className="h-4 w-32 bg-gray-300 rounded"></div>
                          <div className="h-3 w-24 bg-gray-200 rounded"></div>
                        </div>

                        <div className="h-4 w-16 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  ))}

                </div>
              </div>

              {/* Addresses */}
              <div className="grid md:grid-cols-2 gap-2">

                {/* Delivery From */}
                <div className="bg-white rounded-xl border border-gray-300 p-2 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-5 w-5 bg-gray-300 rounded"></div>
                    <div className="h-5 w-32 bg-gray-300 rounded"></div>
                  </div>

                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    <div className="h-3 w-40 bg-gray-200 rounded"></div>
                    <div className="h-3 w-36 bg-gray-200 rounded"></div>
                    <div className="h-3 w-48 bg-gray-200 rounded"></div>
                    <div className="h-3 w-28 bg-gray-200 rounded mt-2"></div>
                  </div>
                </div>

                {/* Shipping To */}
                <div className="bg-white rounded-xl border border-gray-300 p-2 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-5 w-5 bg-gray-300 rounded"></div>
                    <div className="h-5 w-32 bg-gray-300 rounded"></div>
                  </div>

                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    <div className="h-3 w-48 bg-gray-200 rounded"></div>
                    <div className="h-3 w-36 bg-gray-200 rounded"></div>
                    <div className="h-3 w-48 bg-gray-200 rounded"></div>
                    <div className="h-3 w-28 bg-gray-200 rounded"></div>
                  </div>
                </div>

              </div>

            </div>

            {/* Summary */}
            <div className="bg-white rounded-xl border border-gray-300 shadow-sm p-2 h-fit">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-5 w-5 bg-gray-300 rounded"></div>
                <div className="h-5 w-32 bg-gray-300 rounded"></div>
              </div>

              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  </div>
                ))}

                <div className="border-t pt-3 flex justify-between">
                  <div className="h-5 w-24 bg-gray-300 rounded"></div>
                  <div className="h-5 w-20 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>

          </div>

          <div className="text-center">
            <div className="h-10 w-40 bg-gray-300 rounded mx-auto"></div>
          </div>

        </div>
      </div>
    );
  };

  if (loading) {
    return (
    <OrderDetailsSkeleton />
    );
  }
  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#eeece8] p-6">
        <FontAwesomeIcon icon={faBoxOpen} size="5x" className="text-gray-400 mb-6" />
        <h3 className="text-2xl font-bold text-[var(--primary-text-color)] mb-2">Order not found</h3>
        <Link to="/products-page" className="mt-6 bg-[#f16137] text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-[#d84141] transition">
          <FontAwesomeIcon icon={faShoppingBag} /> Continue Shopping
        </Link>
      </div>
    );
  }

  const items = order.orderItems || trackData?.items || [];

  return (
    <>
      <style jsx>{`
        @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.15); } }
        @keyframes shimmer { 0% { background-position: -200px 0; } 100% { background-position: 200px 0; } }
      `}</style>

      <div className=" bg-[#eeece8] text-[var(--primary-text-color)] py-2 mt-[130px] md:mt-0 px-2 lg:px-3">
        <div className="max-w mx-auto space-y-2">

          {/* Status Bar */}
          <div className="bg-white rounded-xl border border-gray-300 p-2 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">#{trackData?.order_id || order.orderId}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${currentStatus === 'DELIVERED' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                {getStatusLabel(currentStatus)}
              </span>
            </div>
            <SmartButton onClick={() => setIsStatusModalOpen(true)}>
              Track Order
            </SmartButton>
          </div>

          <div className="grid lg:grid-cols-3 gap-2">
            {/* Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl border border-gray-300 shadow-sm overflow-hidden">
                <h3 className="bg-[#f7f7f7] border-b border-gray-300 px-2 py-1.5 font-semibold flex items-center gap-2 text-lg">
                  <FontAwesomeIcon icon={faBox} className="text-[var(--primary-hover-color)]" /> Items in your order
                </h3>
                <div className="p-2 space-y-2  overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-2 p-2 bg-[#ffffff] border border-gray-200 rounded-lg hover:shadow-md transition">
                      <div className="w-10 sm:w-16 h-10 sm:h-16 bg-gray-200 border-1 border-dashed rounded-sm overflow-hidden flex-shrink-0">
                        {item.imagePath ? (
                          <img src={item.imagePath.startsWith('http') ? item.imagePath : `https://app.bmgjewellers.com${item.imagePath}`} alt={item.productName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <FontAwesomeIcon icon={faImage} size="2x" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-[var(--primary-text-color)] text-xs line-clamp-2">{item.productName}</h4>
                          {item?.weight && <p className="text-sm text-gray-600 mt-1">Weight: {item.weight}</p>}
                        </div>
                        <p className="font-bold text-[var(--primary-hover-color)] text-sm">₹{item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Addresses */}
              <div className="grid md:grid-cols-2 gap-2">
                <div className="bg-white rounded-xl border border-gray-300 p-2 shadow-sm">
                  <h3 className="font-semibold text-sm sm:text-lg mb-2 flex items-center gap-3">
                    <FontAwesomeIcon icon={faTruck} className="text-[var(--primary-hover-color)]" /> Delivery From
                  </h3>
                  {addrLoading ? <div className="space-y-3"><div className="h-4 bg-gray-200 rounded animate-pulse" style={{ animation: 'shimmer 1.5s infinite linear', background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', backgroundSize: '200px 100%' }}></div></div> :
                    defaultAddress ? (
                      <div className="text-sm space-y-1">
                        <p className="font-medium">{defaultAddress.name}</p>
                        <p>{defaultAddress.addressLine1}</p>
                        {defaultAddress.addressLine2 && <p>{defaultAddress.addressLine2}</p>}
                        <p>{defaultAddress.city}, {defaultAddress.state} - {defaultAddress.pincode}</p>
                        <p className="font-medium mt-2">Phone: {defaultAddress.phone}</p>
                      </div>
                    ) : <p className="text-gray-500">No address available</p>}
                </div>

                <div className="bg-white rounded-xl border border-gray-300 p-2 shadow-sm">
                  <h3 className="font-semibold text-sm sm:text-lg mb-2 flex items-center gap-2">
                    <FontAwesomeIcon icon={faTruck} className="text-[var(--primary-hover-color)]" /> Shipping To
                  </h3>
                  <div className="text-sm space-y-1">
                    <p className="font-medium">{order.customerName}</p>
                    <p>{order.address.addressLine}</p>
                    <p>{order.address.locality}</p>
                    <p>{order.address.city}, {order.address.state} - {order.address.pincode}</p>
                    {order.address.landmark && <p>Landmark: {order.address.landmark}</p>}
                    <p className="font-medium mt-2">Phone: {order.contact}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-xl border border-gray-300 shadow-sm p-2 h-fit">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-3">
                <FontAwesomeIcon icon={faReceipt} className="text-[var(--primary-hover-color)]" /> Order Summary
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(order.totalAmount)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>{order.shippingFee ? `${order.shippingFee}` : 'Free'}</span></div>
                <div className="flex justify-between text-gray-600"><span>Paid via</span><span>{order.paymentMode}</span></div>
                <div className="flex justify-between text-gray-600"><span>Status</span><span>{order.paymentStatus}</span></div>
                <div className="border-t pt-3 font-bold text-lg flex justify-between text-[var(--primary-hover-color)]">
                  <span>Total</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <SmartButton onClick={() => handleReorder(order)} className="bg-[#f16137] text-white px-3 py-2 rounded-lg font-medium hover:bg-[#d84141] transition flex items-center text-sm gap-1 mx-auto">
              <FontAwesomeIcon icon={faShoppingBag} /> Continue Shopping
            </SmartButton>
          </div>
        </div>

        {/* Tracking Modal */}
        {isStatusModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] p-2" onClick={() => setIsStatusModalOpen(false)}>
            <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="bg-[#f7f7f7] border-b px-2 py-2 flex justify-between items-center">
                <h3 className="text-lg font-bold text-[var(--primary-text-color)]">Order #{order.orderId} Tracking</h3>
                <button onClick={() => setIsStatusModalOpen(false)} className="text-2xl hover:bg-gray-200 rounded-full w-10 h-10">&times;</button>
              </div>

              <div className="p-2 overflow-y-auto max-h-[70vh]">
                {/* Current Status */}
                <div className="flex items-center gap-2 mb-3 p-2 bg-orange-50 rounded-lg border-l-4 border-[#f16137] mb-4">
                  <div className="w-12 h-12 bg-[#f16137] rounded-full flex items-center justify-center text-white animate-pulse">
                    <FontAwesomeIcon icon={getStatusIcon(currentStatus)} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{getStatusLabel(currentStatus)}</h4>
                    <p className="text-sm  text-gray-600">Placed on {new Date(order.orderTime).toLocaleDateString('en-IN')}</p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="relative">
                  {isTracking ? (
                    <div className="text-center py-2"><FontAwesomeIcon icon={faSpinner} spin className="text-3xl text-[var(--primary-hover-color)]" /></div>
                  ) : (
                    timeline.map((step, i) => {
                      const isActive = i === timeline.length - 1;
                      const isDone = i < timeline.length - 1 || currentStatus === 'DELIVERED';
                      return (
                        <div key={i} className="flex gap-2 pb-2 last:pb-0 relative">
                          <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold z-10 ${isActive ? 'bg-[#f16137] animate-pulse' : isDone ? 'bg-green-500' : 'bg-gray-300'}`}>
                              <FontAwesomeIcon icon={isActive && currentStatus === 'CANCELLED' ? faTimesCircle : faCheckCircle} />
                            </div>
                            {i < timeline.length - 1 && <div className="w-0.5 bg-gray-300 h-full absolute top-10 left-5 -z-0"></div>}
                          </div>
                          <div className="flex-1 pb-3">
                            <div className="flex justify-between items-center">
                              <h5 className="font-semibold text-sm">{step.label || getStatusLabel(step.status)}</h5>
                              <span className="text-xs text-gray-500">{new Date(step.updated_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            {step.remarks && <p className="text-sm text-gray-600 mt-1">{step.remarks}</p>}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {canCancel && (
                  <div className="mt-1 pt-2 border-t flex items-center justify-center text-center">
                    <SmartButton onClick={handleCancel} disabled={isCancelling} >
                      {isCancelling ? <><FontAwesomeIcon icon={faSpinner} spin /> Cancelling...</> : 'Cancel Order'}
                    </SmartButton>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default OrderDetail;