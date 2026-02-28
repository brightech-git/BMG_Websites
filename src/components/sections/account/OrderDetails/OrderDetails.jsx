'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBox, faBoxOpen, faExclamationCircle, faSpinner, faImage,
  faAngleLeft, faReceipt, faCheckCircle, faTimesCircle, faTruck,
  faShoppingBag, faInfoCircle, faQuestionCircle, faMapMarkerAlt,
  faCreditCard, faCalendarAlt, faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import { formatCurrency } from '../../../../utils/formatters';
import { Link } from 'react-router-dom';

import { toast } from 'react-toastify';
import SmartButton from '../../../ui/SmartButton';
import { useNavigate, useParams } from 'react-router-dom';

import TrackOrderModal from '../../../wrapper/TrackOrderModal';
import HorizontalTimeline from '../../../ui/HorizontalTimeLine';
import { ORDER_STATUS_MASTER } from '../../../../data/orderStatusMaster';


import { useCreateReOrder } from '../../../../hook/order/useReorder';
import { useCancelOrder } from '../../../../hook/order/useOrderMutation';
import { useTrackingById } from '../../../../hook/order/useOrderTracking';
import { useOrderStatusMaster } from '../../../../hook/order/useOrderTracking';


import {getImage} from '../../../../utils/getProductImages';



const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);


  const { data: orderTrackData, refetch: fetchOrderTrackData, isLoading: orderTrackLoading, isError: orderTrackError } = useTrackingById(id);
  const { mutate: cancelOrder, isLoading: isCancelling } = useCancelOrder();
  const { mutateAsync: createReOrder, isLoading: isReordering } = useCreateReOrder();
  const { data: orderStatusMaster } = useOrderStatusMaster();

  const paidBy = orderTrackData?.payment_mode || "Online";
  const paymentStatus = orderTrackData?.payment_status || "PENDING";
  const shippingFee = orderTrackData?.shipping_fee || "Free";
  const currentStatus = orderTrackData?.current_status || "PLACED";
  const totalAmount = orderTrackData?.total_amount || 0;
  const subtotal = orderTrackData?.products_grandTotal || orderTrackData?.subtotal;

  const items = orderTrackData?.order_items || [];
  const deliveryAddress = orderTrackData?.delivery_address;
  const originAddress = orderTrackData?.origin_address;

  console.log(orderTrackData,'orderTrackData');
  const orderDate = orderTrackData?.order_date || orderTrackData?.created_at;
  
  const canCancel = orderTrackData?.canCancel;
  const canReorder = orderTrackData?.canRetryPayment;
  const canReturn = orderTrackData?.canReturn || orderTrackData?.current_status?.toLowerCase() === "delivered" ;


  console.log(orderTrackData, orderDate ,'ordersss')
  const handleCancel = () => {
    const reason = prompt("Why do you want to cancel this order?");
    if (!reason) return;
    cancelOrder(
      {
        orderId: orderTrackData.order_id,
        newStatus: "CANCELLED",
        remarks: `Cancelled by user: ${reason}`,
        paymentStatus: orderTrackData.payment_status
      },
      {
        onSuccess: () => {
          toast.success("Order cancelled successfully");
          fetchOrderTrackData();
          setIsStatusModalOpen(false);
        },
        onError: () => toast.error("Failed to cancel order")
      }
    );
  };

  const handleReorder = async () => {
    if (!canReorder) {
      navigate('/products-page');
      return;
    }
    const confirm = window.confirm("Do you want to place this order again?");
    if (!confirm) return;
    const result = await createReOrder(orderTrackData.order_id);
    if (result?.newOrderId) {
      navigate(`/payment/${result.newOrderId}`);
    }
  };

  const handleReturn = () =>{
    const confirm = window.confirm("Do you want to return this order ?");
    if (!confirm) return;
      navigate(`/return` ,{state:orderTrackData});
  }

  const getStatusColor = (status) => {
    const map = {
      DELIVERED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      SHIPPED: 'bg-blue-50 text-blue-700 border-blue-200',
      PROCESSING: 'bg-amber-50 text-amber-700 border-amber-200',
      PENDING: 'bg-orange-50 text-orange-700 border-orange-200',
      CANCELLED: 'bg-rose-50 text-rose-700 border-rose-200',
      PLACED: 'bg-orange-50 text-orange-700 border-orange-200',
      DELIVERY_FAILED: 'bg-red-50 text-red-700 border-red-200'
    };
    return map[status] || 'bg-orange-50 text-orange-700 border-orange-200';
  };

  const getStatusLabel = (status) => {
    const map = {
      PENDING: 'Pending',
      PLACED: 'Order Placed',
      IN_PROCESSING: 'Processing',
      PACKED: 'Packed',
      SHIPPED: 'Shipped',
      SHIPPING: 'Shipping',
      Booked: 'Booked',
      OUT_FOR_DELIVERY: 'Out for Delivery',
      IN_TRANSIT: 'In Transit',
      DELIVERED: 'Delivered',
      DELIVERY_FAILED: 'Delivery Failed',
      CANCELLED: 'Cancelled'
    };
    return map[status] || status;
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Skeleton Component with shimmer animation
  const OrderDetailsSkeleton = () => (
    <div className="bg-gradient-to-br from-[#FFF7ED] to-[#FFEDD5] text-[#7C2D12] py-2 mt-[100px] md:mt-0 px-2 lg:px-3 min-h-screen">
      <div className="max-w mx-auto space-y-2">
        {/* Animated shimmer effect */}
        <style>{`
          @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
          }
          .animate-shimmer {
            animation: shimmer 2s infinite linear;
            background: linear-gradient(to right, #ffedd5 4%, #fff7ed 25%, #ffedd5 36%);
            background-size: 1000px 100%;
          }
        `}</style>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#FED7AA] p-4 shadow-lg animate-pulse">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-8 w-24 bg-[#FED7AA] rounded-lg animate-shimmer"></div>
              <div className="h-7 w-28 bg-[#FED7AA] rounded-full animate-shimmer"></div>
            </div>
            <div className="h-8 w-32 bg-[#FED7AA] rounded-lg animate-shimmer"></div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#FED7AA] p-4 shadow-lg">
          <div className="h-16 w-full bg-[#FED7AA] rounded-lg animate-shimmer"></div>
        </div>

        <div className="grid lg:grid-cols-3 gap-3">
          <div className="lg:col-span-2 space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#FED7AA] p-4 shadow-lg animate__animated animate__fadeInUp" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex gap-3">
                  <div className="w-16 h-16 bg-[#FED7AA] rounded-xl animate-shimmer"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-[#FED7AA] rounded animate-shimmer"></div>
                    <div className="h-3 w-1/2 bg-[#FED7AA] rounded animate-shimmer"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#FED7AA] p-4 shadow-lg">
            <div className="space-y-3">
              <div className="h-6 w-32 bg-[#FED7AA] rounded animate-shimmer"></div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 w-20 bg-[#FED7AA] rounded animate-shimmer"></div>
                  <div className="h-4 w-16 bg-[#FED7AA] rounded animate-shimmer"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (orderTrackLoading) return <OrderDetailsSkeleton />;

  if (!orderTrackData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#FFF7ED] to-[#FFEDD5] p-6 animate__animated animate__fadeIn">
        <div className="relative">
          <FontAwesomeIcon icon={faBoxOpen} className="text-7xl text-[#FDBA74] mb-6 animate__animated animate__pulse animate__infinite" />
          <div className="absolute inset-0 bg-[#F97316]/10 rounded-full blur-3xl -z-10"></div>
        </div>
        <h3 className="text-2xl font-bold text-[#7C2D12] mb-2 animate__animated animate__fadeInUp">Order not found</h3>
        <p className="text-[#9A3412] mb-6 animate__animated animate__fadeInUp animate__delay-1s">The order you're looking for doesn't exist</p>
        <Link
          to="/products-page"
          className="group bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-lg hover:shadow-[#F97316]/30 transition-all duration-300 transform hover:scale-105 animate__animated animate__fadeInUp animate__delay-2s"
        >
          <FontAwesomeIcon icon={faShoppingBag} className="group-hover:rotate-12 transition-transform duration-300" />
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <>
      <div>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 5px rgba(249, 115, 22, 0.2); }
          50% { box-shadow: 0 0 20px rgba(249, 115, 22, 0.4); }
        }
        .animate-glow { animation: glow 2s ease-in-out infinite; }
      `}</style>

      <div className="px-2 sm:px-3 py-3 sm:py-4 text-xs sm:text-sm leading-tight bg-gradient-to-br from-[#FFF7ED] via-[#FFEDD5] to-[#FFF3E6] text-[#7C2D12] p-3 px-2 lg:px-3 animate__animated animate__fadeIn">

        {/* Decorative background elements */}
        <div className="fixed top-20 left-10 w-64 h-64 bg-[#F97316]/5 rounded-full blur-3xl -z-10 animate-float"></div>
        <div className="fixed bottom-20 right-10 w-80 h-80 bg-[#FB923C]/5 rounded-full blur-3xl -z-10 animate-float" style={{ animationDelay: '2s' }}></div>

        <div className="max-w-7xl mx-auto space-y-3 sm:space-y-4">

          {/* Status Bar - Professional Card */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-[#FED7AA] p-3 sm:p-4 flex flex-row justify-between items--center gap-3 shadow-lg shadow-[#F97316]/5 animate__animated animate__fadeInDown hover:border-[#FDBA74] transition-all duration-300 group">
            <div className="flex items-center gap-3 w-full xs:w-auto">
              <div className="flex items-center gap-2 bg-[#FFF7ED] px-3 py-1.5 rounded-xl border border-[#FED7AA] group-hover:border-[#F97316]/30 transition-colors">
                <FontAwesomeIcon icon={faReceipt} className="text-[#F97316] text-xs sm:text-sm" />
                <span className="font-mono font-bold text-xs sm:text-sm text-[#7C2D12]">{id}</span>
              </div>
              <span className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 ${getStatusColor(currentStatus)}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                {getStatusLabel(currentStatus)}
              </span>
            </div>

            <div className="flex items-center gap-2 w-full xs:w-auto justify-end">
              {canCancel && (
                <SmartButton
                  onClick={handleCancel}
                  disabled={isCancelling}
                  tooltip="Cancel Order"
                  size="sm"
                  variant="ghost"
                  className="!p-2 hover:bg-rose-50 transition-all duration-300 group/btn"
                >
                  <span className='flex flex-col items-center'>
                    <FontAwesomeIcon
                      icon={faTimesCircle}
                      className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-rose-500 group-hover/btn:scale-110 transition-transform duration-300"
                    />
                    <span className='text-[8px] sm:text-[9px] text-rose-600 font-medium'>cancel</span>
                  </span>
                  {isCancelling && <FontAwesomeIcon icon={faSpinner} spin className="ml-1 text-xs text-rose-500" />}
                </SmartButton>
              )}

              <SmartButton
                onClick={() => setIsStatusModalOpen(true)}
                tooltip="Track Order"
                size="sm"
                variant="ghost"
                className="p-2 hover:bg-orange-50 transition-all duration-300 group/btn animate-glow"
              >
                <span className='flex flex-row gap-2 items-center'>
                  <FontAwesomeIcon
                    icon={faTruck}
                    className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#F97316] group-hover/btn:scale-110 group-hover/btn:translate-x-0.5 transition-all duration-300"
                  />
                  <span className='text-[8px] sm:text-[9px] text-[#EA580C] font-medium'>track</span>
                </span>
              </SmartButton>
            </div>
          </div>

          {/* Order Timeline - Enhanced */}
          <div className='bg-white/90 backdrop-blur-md rounded-2xl border border-[#FED7AA] shadow-lg shadow-[#F97316]/5 overflow-hidden animate__animated animate__fadeInUp hover:border-[#FDBA74] transition-all duration-300'>
            <div className="overflow-x-auto">
              <div className="min-w-[600px] sm:min-w-0 p-3 sm:p-4">
                <HorizontalTimeline
                  currentStatus={currentStatus}
                  statuses={orderStatusMaster?.statuses || ORDER_STATUS_MASTER}
                />
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-3 sm:gap-4">

            {/* Left Column - Items & Addresses */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">

              {/* Order Items Card */}
              <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-[#FED7AA] shadow-lg shadow-[#F97316]/5 overflow-hidden animate__animated animate__fadeInLeft hover:border-[#FDBA74] transition-all duration-300">
                <div className="bg-gradient-to-r from-[#FFF7ED] to-[#FFEDD5] border-b border-[#FED7AA] px-3 sm:px-4 py-2.5 sm:py-3">
                  <h3 className="font-semibold text-sm sm:text-base text-[#7C2D12] flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-lg flex items-center justify-center shadow-md">
                      <FontAwesomeIcon icon={faBox} className="text-white text-xs" />
                    </div>
                    Items in your order ({items.length})
                  </h3>
                </div>

                <div className="p-3 sm:p-4 space-y-2">
                  {items.map((item, index) => (
                    <div
                      key={item.id}
                      className="group flex gap-3 p-2.5 sm:p-3 bg-white border border-[#FED7AA] rounded-xl hover:shadow-lg hover:border-[#F97316]/30 transition-all duration-300 animate__animated animate__fadeInUp"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#FFF7ED] to-[#FFEDD5] border-2 border-[#FED7AA] rounded-xl overflow-hidden flex-shrink-0 group-hover:border-[#F97316] transition-all duration-300">
                        {item.image_path ? (
                          <img
                            src={getImage(item.image_path || item.imagePath)}
                            alt={item.productName}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#FDBA74]">
                            <FontAwesomeIcon icon={faImage} size="2x" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 flex flex-row justify-between items-center gap-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-[#7C2D12] text-xs sm:text-sm line-clamp-2 group-hover:text-[#F97316] transition-colors">
                            {item.product_name}
                          </h4>
                          {item?.weight && (
                            <p className="text-[10px] sm:text-xs text-[#9A3412] mt-0.5 flex items-center gap-1">
                              <span className="w-1 h-1 rounded-full bg-[#FDBA74]"></span>
                              Weight: {item.net_wt}
                            </p>
                          )}
                    
                            <p className="text-[10px] text-[#F97316] mt-1 ">
                            Item ID: {item.itemid} - {item.tagno}
                            </p>
                        
                        </div>
                        <div className="flex items-center gap-2">
                          {item.quantity >= 1 && (
                            <span className="text-[10px] text-[#9A3412] bg-[#FFF7ED] px-2 py-1 rounded-full border border-[#FED7AA]">
                              x{item.quantity}
                            </span>
                          )}
                          <p className="font-bold text-[#F97316] text-xs sm:text-sm">
                            {formatCurrency(item.price)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Addresses Grid */}
              <div className="grid md:grid-cols-2 gap-3 sm:gap-4">

                {/* Origin Address */}
                <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-[#FED7AA] p-3 sm:p-4 shadow-lg shadow-[#F97316]/5 animate__animated animate__fadeInUp hover:border-[#FDBA74] transition-all duration-300 group">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-lg flex items-center justify-center shadow-md">
                      <FontAwesomeIcon icon={faTruck} className="text-white text-xs" />
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base text-[#7C2D12]">Delivery From</h3>
                  </div>
                  <div className="text-xs sm:text-sm space-y-1.5 text-[#9A3412]">
                    <p className="font-semibold text-[#7C2D12]">{originAddress?.name}</p>
                    <p className="flex items-start gap-1.5">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[#F97316] text-[10px] mt-0.5" />
                        <span>{originAddress?.addressLine1}</span>
                    </p>
                    {originAddress?.addressLine2 && <p className="ml-4">{originAddress.addressLine2}</p>}
                    <p className="ml-4">{originAddress?.city}, {originAddress?.state} - {originAddress?.pincode}</p>
                    <p className="pt-2 font-medium flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-[#F97316]"></span>
                      Phone: {originAddress?.phone}
                    </p>
                      <p className="pt-1 font-medium flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-[#F97316]"></span>
                        Alternate Phone: {originAddress?.alternatePhone}
                      </p>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-[#FED7AA] p-3 sm:p-4 shadow-lg shadow-[#F97316]/5 animate__animated animate__fadeInUp animate__delay-1s hover:border-[#FDBA74] transition-all duration-300 group">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-lg flex items-center justify-center shadow-md">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="text-white text-xs" />
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base text-[#7C2D12]">Shipping To</h3>
                  </div>
                  <div className="text-xs sm:text-sm space-y-1.5 text-[#9A3412]">
                    <p className="font-semibold text-[#7C2D12]">{deliveryAddress?.customerName}</p>
                    <p className="flex items-start gap-1.5">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[#F97316] text-[10px] mt-0.5" />
                      <span>{deliveryAddress?.addressLine}</span>
                    </p>
                    <p className="ml-4">{deliveryAddress?.locality}</p>
                    <p className="ml-4">{deliveryAddress?.city}, {deliveryAddress?.state} - {deliveryAddress?.pincode}</p>
                    {deliveryAddress?.landmark && (
                      <p className="ml-4 text-[#F97316]">Landmark: {deliveryAddress.landmark}</p>
                    )}
                    <p className="pt-2 font-medium flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-[#F97316]"></span>
                      Phone: {deliveryAddress?.phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-3 sm:space-y-4">
              <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-[#FED7AA] shadow-lg shadow-[#F97316]/5 overflow-hidden animate__animated animate__fadeInRight sticky top-24">
                <div className="bg-gradient-to-r from-[#FFF7ED] to-[#FFEDD5] border-b border-[#FED7AA] px-3 sm:px-4 py-2.5 sm:py-3">
                  <h3 className="font-semibold text-sm sm:text-base text-[#7C2D12] flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-lg flex items-center justify-center shadow-md">
                      <FontAwesomeIcon icon={faReceipt} className="text-white text-xs" />
                    </div>
                    Order Summary
                  </h3>
                </div>

                <div className="p-3 sm:p-4 space-y-3">
                  {/* Order Date */}
                  {/* <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-[#9A3412] flex items-center gap-1.5">
                      <FontAwesomeIcon icon={faCalendarAlt} className="text-[#F97316]" />
                      Order Date
                    </span>
                    <span className="font-medium text-[#7C2D12]">{formatDate(orderDate)}</span>
                  </div> */}

                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-[#9A3412]">Subtotal</span>
                      <span className="font-medium text-[#7C2D12]">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-[#9A3412] flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faTruck} className="text-[#F97316]" />
                        Shipping
                      </span>
                      <span className="font-medium text-[#7C2D12]">
                        {shippingFee === "Free" || shippingFee === "0" ? (
                          <span className="text-emerald-600">Free</span>
                        ) : (
                          formatCurrency(shippingFee)
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-[#FED7AA] my-2"></div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[#9A3412] text-xs sm:text-sm flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faCreditCard} className="text-[#F97316]" />
                        Payment Mode 
                      </span>
                      <span className="text-xs font-medium text-[#7C2D12] block">{paidBy}</span>
                     
                     
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className="text-[#9A3412] text-xs sm:text-sm flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faCreditCard} className="text-[#F97316]" />
                        Payment Status
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full mt-0.5 inline-block
                          ${paymentStatus === 'PAID' || paymentStatus === 'SUCCESS'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-orange-50 text-orange-700 border border-orange-200'
                        }`}
                      >
                        {paymentStatus}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-[#FED7AA] my-2"></div>

                  <div className="flex justify-between items-center pt-1">
                    <span className="font-bold text-sm sm:text-base text-[#7C2D12]">Total Amount</span>
                    <span className="font-bold text-lg sm:text-xl text-[#F97316]">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 space-y-2">
                    {canReorder && (
                      <SmartButton
                        onClick={handleReorder}
                        className="w-full bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white px-4 py-2.5 rounded-xl font-medium hover:shadow-lg hover:shadow-[#F97316]/30 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-sm group"
                      >
                        <FontAwesomeIcon
                          icon={faShoppingBag}
                          className="group-hover:rotate-12 transition-transform duration-300"
                        />
                              Reorder
                      </SmartButton>
                    )}
                      {canReturn && (
                        <SmartButton
                          onClick={handleReturn}
                          disabled={isReordering}
                          className="w-full bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white px-4 py-2.5 rounded-xl font-medium hover:shadow-lg hover:shadow-[#F97316]/30 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-sm group"
                        >
                          <FontAwesomeIcon
                            icon={faShoppingBag}
                            className="group-hover:rotate-12 transition-transform duration-300"
                          />
                          {isReordering ? 'Processing...' : 'Return'}
                          {isReordering && <FontAwesomeIcon icon={faSpinner} spin className="ml-1" />}
                        </SmartButton>
                      )}
                    <button
                      onClick={() => navigate('/products-page')}
                      className="w-full bg-white border-2 border-[#FED7AA] text-[#7C2D12] px-4 py-2.5 rounded-xl font-medium hover:bg-[#FFF7ED] hover:border-[#F97316] transition-all duration-300 flex items-center justify-center gap-2 text-sm group"
                    >
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        className="group-hover:translate-x-1 transition-transform duration-300"
                      />
                      Continue Shopping
                    </button>
                    
                  </div>
                </div>
              </div>

              {/* Order Support Card */}
              {/* <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-[#FED7AA] p-4 shadow-lg shadow-[#F97316]/5 animate__animated animate__fadeInRight animate__delay-2s">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#FFF7ED] rounded-full flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faInfoCircle} className="text-[#F97316] text-sm" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs sm:text-sm text-[#7C2D12]">Need Help?</h4>
                    <p className="text-[10px] sm:text-xs text-[#9A3412] mt-0.5">
                      Contact our support team for order assistance
                    </p>
                    <button className="mt-2 text-[10px] sm:text-xs text-[#F97316] font-medium hover:text-[#EA580C] transition-colors">
                      Contact Support →
                    </button>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Tracking Modal */}
        {isStatusModalOpen && (
          <TrackOrderModal
            orderId={id}
            data={orderTrackData}
            refetch={fetchOrderTrackData}
            loading={orderTrackLoading}
            error={orderTrackError}
            open={isStatusModalOpen}
            onClose={() => setIsStatusModalOpen(false)}
          />
        )}
      </div>
      </div>
    </>
  );
};

export default OrderDetail;