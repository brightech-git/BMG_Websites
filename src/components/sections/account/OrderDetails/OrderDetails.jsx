'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBox, faBoxOpen, faExclamationCircle, faSpinner, faImage,
  faAngleLeft, faReceipt, faCheckCircle, faTimesCircle, faTruck,
  faShoppingBag, faInfoCircle, faQuestionCircle
} from '@fortawesome/free-solid-svg-icons';
import { formatCurrency } from '../../../../utils/formatters';
import { Link } from 'react-router-dom';
import { useCancelOrder } from '../../../../hook/order/useOrderMutation';
import { toast } from 'react-toastify';
import SmartButton from '../../../ui/SmartButton';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateReOrder } from '../../../../hook/order/useReorder';
import TrackOrderModal from '../../../wrapper/TrackOrderModal';
import HorizontalTimeline from '../../../ui/HorizontalTimeLine';
import { ORDER_STATUS_MASTER } from '../../../../data/orderStatusMaster';
import { useTrackingById } from '../../../../hook/order/useOrderTracking';
import { useOrderStatusMaster } from '../../../../hook/order/useOrderTracking';


const OrderDetail = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const { data: orderTrackData, refetch: fetchOrderTrackData, isLoading: orderTrackLoading, isError: orderTrackError } = useTrackingById(id);

  const { mutate: cancelOrder, isLoading: isCancelling } = useCancelOrder();
  const { mutateAsync: createReOrder, isLoading: isReordering } = useCreateReOrder();

  const { data: orderStatusMaster, isLoading: orderStatusMasterLoading, isError: statusMasterError, refetch: refetchStatusmaster } = useOrderStatusMaster();
  const paymentStatus = orderTrackData?.payment_status || "PENDING";
  const currentStatus = orderTrackData?.current_status || "PLACED";
  const canCancel = orderTrackData?.canCancel;
  const canReorder = orderTrackData?.canReorder;
  const items = orderTrackData?.items || [];

  const deliveryAddress = orderTrackData?.delivery_address;
  const originAddress = orderTrackData?.origin_address;


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
          toast.success("Order cancelled");
          fetchOrderTrackData();
          setIsStatusModalOpen(false);
        },
        onError: () => toast.error("Failed to cancel order")
      }
    );
  };
  const handleReorder = async () => {
    if (!canReorder) {
      navigate('/products-page')
      // toast.info("You are navigated to ProductsPage with same filters");

      return;
    }

    const confirm = window.confirm("Do you want to place this order again?");
    if (!confirm) return;

    const result = await createReOrder(orderTrackData.order_id);
    if (result?.newOrderId) {
      navigate(`/payment/${result.newOrderId}`);
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

  if (orderTrackLoading) {
    return (
      <OrderDetailsSkeleton />
    );
  }
  if (!orderTrackData) {
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

  return (
    <>
      <style jsx>{`
        @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.15); } }
        @keyframes shimmer { 0% { background-position: -200px 0; } 100% { background-position: 200px 0; } }
      `}</style>

      <div className=" bg-[#eeece8] text-[var(--primary-text-color)] py-2 mt-[180px] md:mt-0 px-2 lg:px-3">
        <div className="max-w mx-auto space-y-2">

          {/* Status Bar */}
          <div className="bg-white rounded-xl border border-gray-300 p-2 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">#{id}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${currentStatus === 'DELIVERED' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                {getStatusLabel(currentStatus)}
              </span>
            </div>
            <div className="flex items-center gap-2">

              {/* Cancel Order */}
              {canCancel && (
                <div className="flex items-center justify-center">
                  <SmartButton
                    onClick={() => {
                      const reason = prompt("Why do you want to cancel this order?");
                      if (!reason) return;
                      handleCancel(reason);
                    }}
                    disabled={isCancelling}
                    tooltip="Cancel Order"
                    size="sm"
                    variant="ghost"
                  > <span className='flex flex-col items-center'>
                      <FontAwesomeIcon icon={faQuestionCircle} className="w-4 sm:w-6 h-4 sm:h-6" />
                      <span className='text-[9px]'>
                        cancal order
                      </span>
                    </span>
                    {isCancelling && <FontAwesomeIcon icon={faSpinner} spin className="ml-1" />}
                  </SmartButton>
                </div>
              )}

              {/* Track Order */}
              <div className="animate-wobble">
                <SmartButton
                  onClick={() => setIsStatusModalOpen(true)}
                  tooltip="Track Order"
                  size="sm"
                  variant="ghost"
                >  <span className='flex flex-col items-center'>
                    <FontAwesomeIcon icon={faTruck} className="w-4 sm:w-6 h-4 sm:h-6" />
                    <span className='text-[9px]'>
                      track order
                    </span>
                  </span>
                </SmartButton>
              </div>
            </div>

          </div>
          <div className='bg-white rounded-xl border border-gray-300 shadow-sm overflow-hidden'>
            <HorizontalTimeline currentStatus={currentStatus} statuses={orderStatusMaster?.statuses || ORDER_STATUS_MASTER} />
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
                      <div className="w-10 sm:w-16 h-10 sm:h-16 bg-gray-200 border-1 border-dashed rounded-lg overflow-hidden flex-shrink-0">
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
                  <div className="space-y-3">
                  </div>
                  <div className="text-sm space-y-1">
                    <p className="font-medium">{originAddress.name}</p>
                    <p>{originAddress.address_line_1}</p>
                    {originAddress.addressLine2 && <p>{originAddress.addressLine2}</p>}
                    <p>{originAddress.city}, {originAddress.state} - {originAddress.pincode}</p>
                    <p className="font-medium mt-2">Phone: {originAddress.phone}</p>
                  </div>

                </div>

                <div className="bg-white rounded-xl border border-gray-300 p-2 shadow-sm">
                  <h3 className="font-semibold text-sm sm:text-lg mb-2 flex items-center gap-2">
                    <FontAwesomeIcon icon={faTruck} className="text-[var(--primary-hover-color)]" /> Shipping To
                  </h3>
                  <div className="text-sm space-y-1">
                    <p className="font-medium">{deliveryAddress.customerName}</p>
                    <p>{deliveryAddress.addressLine}</p>
                    <p>{deliveryAddress.locality}</p>
                    <p>{deliveryAddress.city}, {deliveryAddress.state} - {deliveryAddress.pincode}</p>
                    {deliveryAddress.landmark && <p>Landmark: {deliveryAddress.landmark}</p>}
                    <p className="font-medium mt-2">Phone: {deliveryAddress.phone}</p>
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
                <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(2000)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>{orderTrackData.shippingFee ? `${orderTrackData.shippingFee}` : 'Free'}</span></div>
                <div className="flex justify-between text-gray-600"><span>Paid via</span><span>{orderTrackData?.paymentMode || "ONLINE"}</span></div>
                <div className="flex justify-between text-gray-600"><span>Status</span><span>{paymentStatus}</span></div>
                <div className="border-t pt-3 font-bold text-lg flex justify-between text-[var(--primary-hover-color)]">
                  <span>Total</span>
                  <span>{formatCurrency(2000)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <SmartButton onClick={handleReorder} className="bg-[#f16137] text-white px-3 py-2 rounded-lg font-medium hover:bg-[#d84141] transition flex items-center text-sm gap-1 mx-auto">
              <FontAwesomeIcon icon={faShoppingBag} /> Continue Shopping
            </SmartButton>
          </div>
        </div>

        {/* Tracking Modal */}
        {isStatusModalOpen &&
          <div>
            <TrackOrderModal orderId={id} data={orderTrackData} refetch={fetchOrderTrackData} loading={orderTrackLoading} error={orderTrackError} open={isStatusModalOpen} onClose={() => setIsStatusModalOpen(false)} />
          </div>
        }
      </div>
    </>
  );
};

export default OrderDetail;