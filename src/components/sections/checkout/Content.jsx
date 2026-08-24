import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Check, Plus, Edit, Trash2, Phone, Home, ShoppingBag, MapPin, User, CreditCard, X, ChevronDown, ChevronUp, Map, Shield, Truck, Edit2, Building, Globe, Tag, Star } from 'lucide-react';
import { useCreateOrder } from '../../../hook/order/useOrderMutation';
import { useCurrentProfile } from '../../../hook/userProfile/useUserProfileQuery';
import { useCreateAddress, useUpdateAddress, useAddressesByCustomer, useDeleteAddress } from '../../../hook/address/useNewAddress';
import { toast } from 'react-toastify';
import SmartButton from '../../ui/SmartButton';
import { useAddressesByPincode } from '../../../hook/address/useGetAddressByPincode';
import { useNavigate } from 'react-router-dom';
import { useCheckPincode, useCheckShippingPrice } from '../../../hook/pincode/usePincode';
import { usePincode } from '../../../context/pinocde/PincodeContext';
import { getImage } from '../../../utils/getProductImages';
import { formatCurrency } from '../../../utils/formatters';

import { AddressModal } from '../address/AddressModal';
import PaymentOptionsDialog from './PaymentOption';
import Loader from '../../../component/loader/Loader'
// ========== PROGRESS STEPPER ==========
const ProgressStepper = ({ currentStep }) => {
  const steps = [
    { id: 1, name: 'Delivery Address', icon: MapPin },
    { id: 2, name: 'Order Summary', icon: ShoppingBag },
    { id: 3, name: 'Payment Method', icon: CreditCard }
  ];

  return (
    <div className="w-full py-3 px-2 bg-transparent animate__animated animate__fadeIn">
      <div className="flex items-start justify-between max-w-4xl mx-auto relative">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          const isLastStep = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center relative z-10 flex-1">
                <div className="flex flex-col items-center text-center gap-1.5 relative z-20">
                  {/* Step Circle */}
                  <div className={`
                    w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center relative transition-all duration-500
                    border-2 transform hover:scale-110
                    ${isCompleted ? 'border-[#10B981] bg-[#10B981] shadow-lg shadow-[#10B981]/30' :
                      isActive ? 'border-[#F97316] bg-[#F97316] shadow-lg shadow-[#F97316]/30 animate-pulse' :
                        'border-[#FED7AA] bg-white hover:border-[#FDBA74]'}
                  `}>
                    {isCompleted ? (
                      <Check size={16} className="text-white" />
                    ) : (
                      <Icon size={16} className={`${isActive ? 'text-white' : 'text-[#9A3412]'}`} />
                    )}

                    {isActive && !isCompleted && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#F97316] rounded-full border-2 border-white animate-ping"></span>
                    )}
                  </div>

                  {/* Step Name */}
                  <span className={`
                    text-[10px] sm:text-xs font-medium whitespace-nowrap px-2 py-1 rounded-full
                    ${isCompleted ? 'text-[#10B981] bg-[#10B981]/10' :
                      isActive ? 'text-[#F97316] bg-[#FFF7ED] font-semibold' :
                        'text-[#9A3412] bg-transparent'}
                  `}>
                    {step.name}
                  </span>
                </div>

                {/* Connector Line */}
                {!isLastStep && (
                  <div className="absolute top-5 left-[60%] right-[-40%] h-0.5 -translate-y-1/2 z-0  block">
                    <div className={`
                      h-0.5 w-full transition-all duration-700
                      ${isCompleted ? 'bg-[#10B981]' : 'bg-[#FED7AA]'}
                    `}>

                    </div>
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};


const getShippingDisplay = ({
  shippingFee,
  hasPincode,
  isLoading,
  isUnavailable,
  error
}) => {
  if (!hasPincode) return 'Update the pincode';
  if (isLoading) return 'Calculating...';
  if (isUnavailable) return 'Delivery unavailable';
  if (error || shippingFee == null) return 'Unable to calculate';
  if (Number(shippingFee) === 0) return 'Free Shipping';
  return formatCurrency(shippingFee);
};

// ========== ORDER SUMMARY PANEL ==========
const OrderSummaryPanel = ({
  items = [],
  subtotal = 0,
  shippingFee = null,
  total = 0,
  isCompact = false,
  hasPincode = false,
  shippingLoading = false,
  shippingUnavailable = false,
  shippingError = null
}) => {
  const getSafeImagePath = (item) => {
    const imagePath = getImage(item?.imagePath) || item?.image;
    if (!imagePath || typeof imagePath !== 'string') {
      return 'https://via.placeholder.com/40x40';
    }
    return imagePath;
  };

  const getProductName = (item) => {
    return item?.productName || item?.name || item?.itemName || 'Product Name Unavailable';
  };

  const getSkuText = (item) => {
    const itemId = item?.itemId;
    const tagNo = item?.tagNo;
    if (itemId && tagNo) return `SKU: ${itemId}-${tagNo}`;
    if (itemId) return `SKU: ${itemId}`;
    if (tagNo) return `Tag: ${tagNo}`;
    return 'SKU: Not Available';
  };

  const getWeightText = (item) => {
    const weight = item?.weight;
    if (typeof weight === 'number' && !isNaN(weight)) {
      return `Weight: ${weight.toFixed(3)}g`;
    }
    return null;
  };

  const itemCount = Array.isArray(items) ? items.length : 0;
  const itemCountText = `${itemCount} item${itemCount !== 1 ? 's' : ''}`;
  const shippingText = getShippingDisplay({
    shippingFee,
    hasPincode,
    isLoading: shippingLoading,
    isUnavailable: shippingUnavailable,
    error: shippingError
  });
  const isFreeShipping = hasPincode && !shippingLoading && !shippingUnavailable &&
    !shippingError && Number(shippingFee) === 0;

  return (
    <div className={`
      bg-white/95 backdrop-blur-md rounded-2xl border-2 border-[#FED7AA] shadow-lg shadow-[#F97316]/5 overflow-hidden
      ${isCompact ? 'p-3' : 'p-4'}
      hover:shadow-xl hover:border-[#FDBA74] transition-all duration-300
    `}>
      <div className="flex justify-between items-center mb-3 pb-2 border-b border-[#FED7AA]">
        <h4 className="font-bold text-[#7C2D12] flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-lg flex items-center justify-center shadow-md">
            <ShoppingBag className="w-3.5 h-3.5 text-white" />
          </div>
          Order Summary
        </h4>
        {itemCount > 0 && (
          <span className="bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white text-[10px] font-medium px-2.5 py-1 rounded-full shadow-md">
            {itemCountText}
          </span>
        )}
      </div>

      {itemCount > 0 ? (
        <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
          {items.map((item, index) => {
            const weightText = getWeightText(item);
            return (
              <div
                key={item?.id || index}
                className="flex items-start gap-3 pb-3 border-b border-[#FED7AA] last:border-0 last:pb-0 group animate__animated animate__fadeIn"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-[#FED7AA] flex-shrink-0 group-hover:border-[#F97316] transition-all duration-300">
                  <img
                    src={getSafeImagePath(item)}
                    alt={getProductName(item)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/40x40';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h6 className="font-semibold text-sm text-[#7C2D12] truncate group-hover:text-[#F97316] transition-colors">
                    {getProductName(item)}
                  </h6>
                  <p className="text-[10px] sm:text-xs text-[#9A3412] mt-0.5">{getSkuText(item)}</p>
                  {weightText && (
                    <p className="text-[10px] sm:text-xs text-[#9A3412]">{weightText}</p>
                  )}
                </div>
                <div className="font-bold text-sm text-[#F97316] whitespace-nowrap">
                  {formatCurrency(item?.price)}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-6 text-center animate__animated animate__fadeIn">
          <ShoppingBag className="w-12 h-12 text-[#FDBA74] mx-auto mb-2" />
          <p className="text-[#9A3412]">No items in order</p>
        </div>
      )}

      <div className="space-y-2 pt-3 border-t-2 border-[#FED7AA]">
        <div className="flex justify-between text-xs sm:text-sm">
          <span className="text-[#9A3412]">Subtotal</span>
          <span className="font-semibold text-[#7C2D12]">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-xs sm:text-sm">
          <span className="text-[#9A3412] flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-[#F97316]" />
            Shipping
          </span>
          <span className={`font-semibold ${isFreeShipping ? 'text-[#10B981]' : 'text-[#7C2D12]'}`}>
            {shippingText}
          </span>
        </div>
        <div className="flex justify-between text-sm sm:text-base pt-3 border-t-2 border-[#FED7AA]">
          <span className="font-bold text-[#7C2D12]">Total</span>
          <span className="font-bold text-lg text-[#F97316]">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
};

// ========== MAIN CHECKOUT COMPONENT ==========
const EnhancedCheckout = ({ initialCartItems, subtotal }) => {


  const navigate = useNavigate();
  const [cartItems] = useState(() => {
    if (initialCartItems?.length) return initialCartItems;
    try {
      const storedCart = JSON.parse(localStorage.getItem('cartitems') || 'null');
      return storedCart?.items || [];
    } catch (error) {
      console.error('Failed to parse cart from localStorage:', error);
      return [];
    }
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMode, setPaymentMode] = useState('ONLINE');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [pincode, setPincode] = useState(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const [isProcessing ,setIsProcessing] = useState(false);

  const { data: profile, isLoading: profileLoading } = useCurrentProfile();
  const { data: addressByPincode } = useAddressesByPincode(pincode);
  const { pincode: storedPincode } = usePincode();
  const { data: addresses, isLoading: addressesLoading, refetch: refetchAddresses } = useAddressesByCustomer(profile?.id);
  const { mutate: createOrderMutation } = useCreateOrder(navigate);
  const { mutate: createAddress } = useCreateAddress();
  const { mutate: updateAddress } = useUpdateAddress();
  const { mutate: deleteAddress } = useDeleteAddress();

  const finalPincode = selectedAddress?.pincode || storedPincode || pincode || null;
  const normalizedFinalPincode = String(finalPincode || '').trim();
  const hasPincode = /^\d{6}$/.test(normalizedFinalPincode);
  const {
    data: pincodeAvailability,
    isLoading: pincodeLoading,
    error: pincodeError
  } = useCheckPincode(hasPincode ? normalizedFinalPincode : '');
  const isPincodeServiceable = pincodeAvailability?.status === true;
  const isPincodeUnavailable = hasPincode && !pincodeLoading &&
    pincodeAvailability?.status === false;

  const totalWeight = useMemo(() => {
    if (!cartItems?.length) return 0;
    return cartItems.reduce((total, item) => total + (item.netWt || 0), 0);
  }, [cartItems]);

  const {
    data: shippingData,
    isLoading: shippingLoading,
    error: shippingError
  } = useCheckShippingPrice(isPincodeServiceable ? normalizedFinalPincode : null, totalWeight);
  const parsedShippingFee = Number(shippingData?.totalAmount);
  const shippingFee = hasPincode && isPincodeServiceable &&
    shippingData?.totalAmount != null && Number.isFinite(parsedShippingFee)
    ? parsedShippingFee : null;
  const totalAmount = (subtotal || 0) + (shippingFee ?? 0);

  const isShippingLoading = hasPincode &&
    (pincodeLoading || (isPincodeServiceable && shippingLoading));
  const shippingDisplayError = pincodeError || shippingError;
  const shippingDisplayText = getShippingDisplay({
    shippingFee,
    hasPincode,
    isLoading: isShippingLoading,
    isUnavailable: isPincodeUnavailable,
    error: shippingDisplayError
  });



  console.log(shippingData,'shippingData')



  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0];
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedAddress(defaultAddress);
    }
  }, [addresses]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const handleSaveAddress = (addressData) => {
    const payload = { ...addressData, customerId: profile?.id };
    if (addressData.id) {
      updateAddress({ id: addressData.id, addressData: payload }, {
        onSuccess: () => {
          refetchAddresses();
        }
      
      });
    } else {
      createAddress(payload, {
        onSuccess: () => {
          refetchAddresses();
        },
    
      });
    }
  };

  const handleDeleteAddress = (addressId) => {
    deleteAddress(addressId, {
      onSuccess: () => {
        refetchAddresses();
        if (selectedAddress?.id === addressId) setSelectedAddress(null);
   
      },
 
    });
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }
    if (currentStep === 1 && !hasPincode) {
      toast.error('Please set a valid delivery pincode');
      return;
    }
    if (currentStep === 1 && isShippingLoading) {
      toast.info('Please wait while shipping availability is checked');
      return;
    }
    if (currentStep === 1 && isPincodeUnavailable) {
      toast.error('Delivery is not available for this pincode');
      return;
    }
    if (currentStep === 1 && shippingDisplayError) {
      toast.error('Unable to calculate shipping for this pincode');
      return;
    }
    if (currentStep === 1 && shippingFee == null) {
      toast.info('Please wait for the shipping fee');
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  console.log(cartItems,'cartItems')

  const proceedWithOrder = useCallback(
    (paymentMode, paymentType = null) => {
      // Build the payload
      const orderPayload = {
        customerName: selectedAddress.name,
        contact: selectedAddress.phone,
        email: profile?.email,
        totalAmount,
        paymentMode,          // 'ONLINE' or 'COD'
        paymentType,          // only used for online
        paymentStatus: "PENDING",
        shippingPincode: finalPincode,
        address:selectedAddress,
        items: cartItems.map((item) => ({
          itemId: item.itemId,
          productName: item.productName,
          grossAmount: parseFloat(item.grossAmount),
          price: parseFloat(item.price),
          tagNo: item.tagNo,
          sno: item.sno,
          grsWt: parseFloat(item.grsWt),
          netWt: parseFloat(item.netWt),
          imagePath: item.imagePath,
          quantity: item.quantity,
          gstType: item.gstType,
          gstPer: parseFloat(item.gstPer),
          gstAmount: Number(item.gstAmount) || 0,
        })),
      };
      console.log(orderPayload, 'orderPayload');
    
    
      // Save to localStorage
      localStorage.setItem("order", JSON.stringify(orderPayload));

      setIsProcessing(true); // start loader

      createOrderMutation(orderPayload, {
        onSuccess: (response) => {
          setIsProcessing(false); // stop loader

          if (paymentMode === "ONLINE") {
            navigate(`/payment/${response.orderId}`, {
              state: { paymentMode, paymentType, isOnlinePayment: true },
            });
          } else {
            toast.success("Order placed successfully!");
            navigate(`/payment-success?orderId=${response.orderId}&mode=cod`);
          }
        },
        onError: () => {
          setIsProcessing(false); // stop loader on error
          toast.error("Failed to create order. Please try again.");
        },
      });
    },
    [cartItems, totalAmount, selectedAddress, profile?.email, finalPincode, createOrderMutation, navigate]
  );

  // Handle payment method selection from dialog (only for online)
  const handlePaymentMethodSelect = (method) => {
    // Pass both mode and method to the unified function
    proceedWithOrder("ONLINE", method);
    setShowPaymentDialog(false); // close the dialog
  };

  const submitOrder = useCallback(() => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (paymentMode === "ONLINE") {
      // Show payment options dialog
      setShowPaymentDialog(true);
      return;
    }

    if (paymentMode === "COD") {
      // Directly proceed with COD
      proceedWithOrder("COD");
    }
  }, [selectedAddress, cartItems, paymentMode, proceedWithOrder]);

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF7ED] via-[#FFEDD5] to-[#FFF3E6]">
      {isProcessing && (
        <Loader
          message="Creating your order, please wait..."
          size={16} // spinner size (Tailwind w-16 h-16)
          color="blue" // spinner color
        />
      )}

      {/* Decorative Elements */}
      <div className="fixed top-20 left-10 w-64 h-64 bg-[#F97316]/5 rounded-full blur-3xl -z-10 animate-float"></div>
      <div className="fixed bottom-20 right-10 w-80 h-80 bg-[#FB923C]/5 rounded-full blur-3xl -z-10 animate-float" style={{ animationDelay: '2s' }}></div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #FED7AA;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #F97316;
          border-radius: 10px;
        }
      `}</style>

      {/* Mobile Order Toggle */}
      <div className="lg:hidden px-4 pt-4">
        <button
          className="w-full bg-white/95 backdrop-blur-md border-2 border-[#FED7AA] rounded-xl p-4 flex justify-between items-center shadow-lg hover:border-[#FDBA74] transition-all duration-300 group"
          onClick={() => setSummaryOpen(!summaryOpen)}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-lg flex items-center justify-center shadow-md">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-semibold text-[#7C2D12] text-sm">Order Summary</span>
              <p className="text-[10px] text-[#9A3412]">{cartItems?.length || 0} items</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#F97316]">{formatCurrency(totalAmount)}</span>
            {summaryOpen ? (
              <ChevronUp className="w-4 h-4 text-[#F97316] group-hover:scale-110 transition-transform" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#F97316] group-hover:scale-110 transition-transform" />
            )}
          </div>
        </button>

        {summaryOpen && (
          <div className="mt-3 animate__animated animate__fadeIn">
            <OrderSummaryPanel
              items={cartItems}
              subtotal={subtotal}
              total={totalAmount}
              shippingFee={shippingFee}
              isCompact
              hasPincode={hasPincode}
              shippingLoading={isShippingLoading}
              shippingUnavailable={isPincodeUnavailable}
              shippingError={shippingDisplayError}
            />
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 lg:grid lg:grid-cols-1 lg:gap-4 xl:grid-cols-3">

        {/* Left Column - Steps & Content */}
        <div className="lg:col-span-2 space-y-4">

          {/* Progress Stepper */}
          <div className="bg-white/95 backdrop-blur-md border-2 border-[#FED7AA] rounded-2xl shadow-lg shadow-[#F97316]/5 p-2 hover:border-[#FDBA74] transition-all duration-300">
            <ProgressStepper currentStep={currentStep} />
          </div>

          {/* Step Content Card */}
          <div className="bg-white/95 backdrop-blur-md border-2 border-[#FED7AA] rounded-2xl shadow-lg shadow-[#F97316]/5 overflow-hidden hover:border-[#FDBA74] transition-all duration-300">

            <div className="p-4 sm:p-6">
              {/* STEP 1: DELIVERY ADDRESS */}
              {currentStep === 1 && (
                <div className="space-y-4 animate__animated animate__fadeIn">
                  <div className="flex items-center gap-2 pb-2 border-b-2 border-[#FED7AA]">
                    <div className="w-7 h-7 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-lg flex items-center justify-center shadow-md">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-[#7C2D12]">Delivery Address</h3>
                  </div>

                  {/* Contact Info */}
                  <div className="bg-[#FFF7ED] border-2 border-[#FED7AA] rounded-xl p-3 flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-[#F97316]" />
                    </div>
                    <div>
                      <span className="text-xs text-[#9A3412]">Contact</span>
                      <p className="font-semibold text-[#7C2D12] text-sm">
                        {profileLoading ? 'Loading...' : profile?.contactNumber || 'Not provided'}
                      </p>
                    </div>
                  </div>

                  {/* Address Display */}
                  {addressesLoading ? (
                    <div className="flex flex-col items-center justify-center py-8 animate__animated animate__fadeIn">
                      <div className="w-10 h-10 border-4 border-[#FED7AA] border-t-[#F97316] rounded-full animate-spin mb-4"></div>
                      <p className="text-[#9A3412]">Loading addresses...</p>
                    </div>
                  ) : selectedAddress ? (
                    <div className="space-y-3">
                      <div
                        className="border-2 border-[#FED7AA] rounded-xl p-4 hover:border-[#F97316] transition-all duration-300 cursor-pointer group"
                        onClick={() => setShowAddressModal(true)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#FFF7ED] rounded-lg flex items-center justify-center group-hover:bg-[#FFEDD5] transition-colors">
                              <User className="w-4 h-4 text-[#F97316]" />
                            </div>
                            <h6 className="font-semibold text-[#7C2D12]">{selectedAddress.name}</h6>
                            {selectedAddress.isDefault && (
                              <span className="bg-gradient-to-r from-[#10B981] to-[#059669] text-white text-[10px] px-2 py-1 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-xs sm:text-sm text-[#9A3412] space-y-1 ml-10">
                          <p className="text-[#7C2D12]">{selectedAddress.addressLine}</p>
                          <p>{selectedAddress.locality}, {selectedAddress.city}</p>
                          <p>{selectedAddress.state} - <span className="font-semibold">{selectedAddress.pincode}</span></p>
                          <p className="flex items-center gap-1.5 mt-2">
                            <Phone className="w-3.5 h-3.5 text-[#F97316]" />
                            {selectedAddress.phone}
                          </p>
                        </div>
                      </div>

                      <button
                        className="w-full py-2.5 border-2 border-[#F97316] text-[#F97316] rounded-xl font-medium hover:bg-[#FFF7ED] hover:border-[#EA580C] transition-all duration-300 flex items-center justify-center gap-2 group"
                        onClick={() => setShowAddressModal(true)}
                      >
                        <Edit2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        Change Address
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-8 animate__animated animate__fadeIn">
                      <div className="relative inline-block">
                        <MapPin className="w-16 h-16 text-[#FDBA74] mx-auto mb-3" />
                        <div className="absolute inset-0 bg-[#F97316]/10 rounded-full blur-2xl"></div>
                      </div>
                      <h5 className="font-bold text-[#7C2D12] mb-1">No address selected</h5>
                      <p className="text-[#9A3412] text-sm mb-4">Add a delivery address to continue</p>
                      <button
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[#F97316]/30 transition-all duration-300 transform hover:scale-105"
                        onClick={() => setShowAddressModal(true)}
                      >
                        <Plus className="w-4 h-4" />
                        Add Address
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: ORDER SUMMARY */}
              {currentStep === 2 && (
                <div className="space-y-4 animate__animated animate__fadeIn">
                  <div className="flex items-center gap-2 pb-2 border-b-2 border-[#FED7AA]">
                    <div className="w-7 h-7 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-lg flex items-center justify-center shadow-md">
                      <ShoppingBag className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-[#7C2D12]">Order Summary</h3>
                  </div>
                  <OrderSummaryPanel
                    items={cartItems}
                    subtotal={subtotal}
                    total={totalAmount}
                    shippingFee={shippingFee}
                    hasPincode={hasPincode}
                    shippingLoading={isShippingLoading}
                    shippingUnavailable={isPincodeUnavailable}
                    shippingError={shippingDisplayError}
                  />
                </div>
              )}

              {/* STEP 3: PAYMENT METHOD */}
              {currentStep === 3 && (
                <div className="space-y-4 animate__animated animate__fadeIn">
                  <div className="flex items-center gap-2 pb-2 border-b-2 border-[#FED7AA]">
                    <div className="w-7 h-7 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-lg flex items-center justify-center shadow-md">
                      <CreditCard className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-[#7C2D12]">Payment Method</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-[#FFF7ED] border-2 border-[#FED7AA] rounded-xl p-3">
                      <p className="text-xs text-[#9A3412] flex items-center gap-2">
                        <Shield className="w-4 h-4 text-[#F97316]" />
                        All transactions are secure and encrypted.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {/* Online Payment */}
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          id="online"
                          name="payment"
                          value="ONLINE"
                          checked={paymentMode === 'ONLINE'}
                          onChange={(e) => setPaymentMode(e.target.value)}
                          className="w-4 h-4 text-[#F97316] border-2 border-[#FED7AA] focus:ring-[#F97316]/20 focus:ring-2"
                        />
                        <label htmlFor="online" className="flex-1 cursor-pointer">
                          <div className={`
                            border-2 rounded-xl p-3 transition-all duration-300
                            ${paymentMode === 'ONLINE'
                              ? 'border-[#F97316] bg-[#FFF7ED] shadow-md'
                              : 'border-[#FED7AA] hover:border-[#FDBA74]'
                            }
                          `}>
                            <div className="flex items-center gap-2">
                              <CreditCard className={`w-4 h-4 ${paymentMode === 'ONLINE' ? 'text-[#F97316]' : 'text-[#9A3412]'}`} />
                              <span className="font-medium text-[#7C2D12]">Online Payment</span>
                            </div>
                            <p className="text-xs text-[#9A3412] mt-1 ml-6">UPI, Cards, Net Banking</p>
                          </div>
                        </label>
                      </div>

                      {/* Cash on Delivery */}
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          id="cod"
                          name="payment"
                          value="COD"
                          checked={paymentMode === 'COD'}
                          onChange={(e) => setPaymentMode(e.target.value)}
                          className="w-4 h-4 text-[#F97316] border-2 border-[#FED7AA] focus:ring-[#F97316]/20 focus:ring-2"
                        />
                        <label htmlFor="cod" className="flex-1 cursor-pointer">
                          <div className={`
                            border-2 rounded-xl p-3 transition-all duration-300
                            ${paymentMode === 'COD'
                              ? 'border-[#F97316] bg-[#FFF7ED] shadow-md'
                              : 'border-[#FED7AA] hover:border-[#FDBA74]'
                            }
                          `}>
                            <div className="flex items-center gap-2">
                              <Home className={`w-4 h-4 ${paymentMode === 'COD' ? 'text-[#F97316]' : 'text-[#9A3412]'}`} />
                              <span className="font-medium text-[#7C2D12]">Cash on Delivery</span>
                            </div>
                            <p className="text-xs text-[#9A3412] mt-1 ml-6">Pay on delivery</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Order Total Summary */}
                    <div className="bg-white border-2 border-[#FED7AA] rounded-xl p-4 mt-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-[#9A3412]">Subtotal</span>
                          <span className="font-semibold text-[#7C2D12]">{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[#9A3412]">Shipping</span>
                          <span className={`font-semibold ${shippingDisplayText === 'Free Shipping' ? 'text-[#10B981]' : 'text-[#7C2D12]'}`}>
                            {shippingDisplayText}
                          </span>
                        </div>
                        <div className="border-t-2 border-[#FED7AA] my-2"></div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-[#7C2D12]">Total Amount</span>
                          <span className="font-bold text-xl text-[#F97316]">{formatCurrency(totalAmount)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Step Controls */}
            <div className="border-t-2 border-[#FED7AA] p-4 bg-gradient-to-r from-[#FFF7ED]/50 to-[#FFEDD5]/50">
              <div className="flex justify-between">
                {currentStep > 1 && (
                  <SmartButton
                    variant="outline"
                    size="md"
                    onClick={handlePrevStep}
                    className="border-2 border-[#FED7AA] text-[#7C2D12] hover:bg-[#FFF7ED] hover:border-[#FDBA74]"
                  >
                    Back
                  </SmartButton>
                )}

                {currentStep < 3 ? (
                  <SmartButton
                    onClick={handleNextStep}
                    size="lg"
                    isDisabled={currentStep === 1 && !selectedAddress}
                    className="ml-auto bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white hover:shadow-lg hover:shadow-[#F97316]/30"
                  >
                    Continue
                  </SmartButton>
                ) : (
                  <SmartButton
            size="lg"
            onClick={submitOrder}
            isDisabled={!selectedAddress || !hasPincode || isShippingLoading ||
              isPincodeUnavailable || !!shippingDisplayError || shippingFee == null}
            className="ml-auto bg-gradient-to-r from-[#10B981] to-[#059669] text-white hover:shadow-lg hover:shadow-[#10B981]/30"
        >
            Place Order • {formatCurrency(totalAmount)}
        </SmartButton>

       
                )}
                <PaymentOptionsDialog
                  isOpen={showPaymentDialog}
                  onClose={() => setShowPaymentDialog(false)}
                  onConfirm={handlePaymentMethodSelect}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Order Summary - Right Column */}
        <div className="hidden lg:block lg:sticky lg:top-4 lg:self-start animate__animated animate__fadeInRight">
          <OrderSummaryPanel
            items={cartItems}
            subtotal={subtotal}
            shippingFee={shippingFee}
            total={totalAmount}
            hasPincode={hasPincode}
            shippingLoading={isShippingLoading}
            shippingUnavailable={isPincodeUnavailable}
            shippingError={shippingDisplayError}
          />

          {/* Secure Checkout Badge */}
          <div className="mt-4 bg-white/95 backdrop-blur-md border-2 border-[#FED7AA] rounded-xl p-4 shadow-lg text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-[#F97316]" />
              <span className="font-semibold text-[#7C2D12] text-sm">Secure Checkout</span>
            </div>
            <p className="text-[10px] text-[#9A3412]">
              Your information is encrypted and secure
            </p>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      <AddressModal
        show={showAddressModal}
        onHide={() => setShowAddressModal(false)}
        addresses={addresses || []}
        selectedAddress={selectedAddress}
        onSelectAddress={setSelectedAddress}
        onSaveAddress={handleSaveAddress}
        onDeleteAddress={handleDeleteAddress}
        customerProfile={profile}
        onPincodeChange={setPincode}
        pincodeAddress={addressByPincode}
      />
    </div>
  );
};

export default EnhancedCheckout;