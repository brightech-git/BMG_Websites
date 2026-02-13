"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    X, Check, Upload, MapPin, Package, RefreshCw,
    DollarSign, Camera, Image, FileText, ChevronRight,
    AlertCircle, Home, Truck, Plus, User, Phone, Map, Building, Star, Tag, Globe, ShoppingBag, Calendar, CreditCard
} from "lucide-react";
import "animate.css";
import { AddressModal } from '../address/AddressModal';
import { useAddressesByCustomer, useCreateAddress, useUpdateAddress, useDeleteAddress } from '../../../hook/address/useAddress';
import { toast } from 'react-toastify';
import { useRefundOrder } from "../../../hook/order/useOrderMutation";
// ========== PROGRESS STEPPER ==========
const ProgressStepper = ({ currentStep }) => {
    const steps = [
        { id: 1, name: 'Select Reason', icon: FileText },
        { id: 2, name: 'Upload Photos', icon: Camera },
        { id: 3, name: 'Pickup Address', icon: MapPin },
        { id: 4, name: 'Choose Option', icon: RefreshCw },
        { id: 5, name: 'Submit', icon: Check }
    ];

    return (
        <div className="w-full py-2 px-1 bg-transparent animate__animated animate__fadeIn">
            <div className="flex items-start justify-between max-w-4xl mx-auto relative">
                {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id;
                    const isLastStep = index === steps.length - 1;

                    return (
                        <React.Fragment key={step.id}>
                            <div className="flex flex-col items-center relative z-10 flex-1">
                                <div className="flex flex-col items-center text-center gap-1 relative z-20">
                                    <div className={`
                                        w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center relative transition-all duration-500
                                        border-2 transform hover:scale-110
                                        ${isCompleted ? 'border-[#10B981] bg-[#10B981] shadow-lg shadow-[#10B981]/30' :
                                            isActive ? 'border-[#F97316] bg-[#F97316] shadow-lg shadow-[#F97316]/30 animate-pulse' :
                                                'border-[#FED7AA] bg-white hover:border-[#FDBA74]'}
                                    `}>
                                        {isCompleted ? (
                                            <Check size={14} className="text-white" />
                                        ) : (
                                            <Icon size={14} className={`${isActive ? 'text-white' : 'text-[#9A3412]'}`} />
                                        )}
                                        {isActive && !isCompleted && (
                                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#F97316] rounded-full border-2 border-white animate-ping"></span>
                                        )}
                                    </div>
                                    <span
                                        className={`
    text-[8px] xs:text-[10px] sm:text-xs font-medium
    px-1.5 py-0.5 rounded-full text-center leading-tight
    whitespace-normal line-clamp-2
    ${isCompleted ? 'text-[#10B981] bg-[#10B981]/10' :
                                                isActive ? 'text-[#F97316] bg-[#FFF7ED] font-semibold' :
                                                    'text-[#9A3412] bg-transparent'}
  `}
                                    >
                                        {step.name}
                                    </span>

                                </div>
                                {!isLastStep && (
                                    <div className="absolute top-4 left-[60%] right-[-40%] h-0.5 -translate-y-1/2 z-0 block">
                                        <div className={`
                                            h-0.5 w-full transition-all duration-700
                                            ${isCompleted ? 'bg-[#10B981]' : 'bg-[#FED7AA]'}
                                        `} />
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

// ========== REASON CARDS ==========
const reasons = [
    { id: 'damaged', label: 'Item arrived damaged / broken', icon: AlertCircle },
    { id: 'finish_issue', label: 'Finish or polish not as expected', icon: RefreshCw },
    { id: 'design_difference', label: 'Design looks different from photos', icon: X },
    { id: 'size_fit', label: 'Ring/chain size or fitting issue', icon: Package },
    { id: 'wrong_item', label: 'Received wrong item', icon: FileText },
    { id: 'gift_change', label: 'Purchased for gift – need different model', icon: RefreshCw },
    { id: 'quality_feel', label: 'Did not like the look or feel in person', icon: AlertCircle },
    { id: 'other', label: 'Other reason', icon: FileText }
];

const ReasonStep = ({ selectedReason, onSelectReason, description, onDescriptionChange }) => (
    <div className="space-y-4 animate__animated animate__fadeIn">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {reasons.map((reason) => {
                const Icon = reason.icon;
                const isSelected = selectedReason === reason.id;
                return (
                    <button
                        key={reason.id}
                        onClick={() => onSelectReason(reason.id)}
                        className={`
                            p-3 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-1.5
                            ${isSelected
                                ? 'border-[#F97316] bg-[#FFF7ED] shadow-lg shadow-[#F97316]/10 scale-105'
                                : 'border-[#FED7AA] hover:border-[#FDBA74] hover:bg-[#FFF7ED]/50'}
                        `}
                    >
                        <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center
                            ${isSelected ? 'bg-[#F97316]' : 'bg-[#FFEDD5]'}
                        `}>
                            <Icon size={14} className={isSelected ? 'text-white' : 'text-[#9A3412]'} />
                        </div>
                        <span className="text-[10px] sm:text-xs font-medium text-[#7C2D12]">{reason.label}</span>
                    </button>
                );
            })}
        </div>
        {selectedReason === 'other' && (
            <div className="space-y-1.5 animate__animated animate__fadeIn">
                <label className="text-xs font-semibold text-[#7C2D12] flex items-center gap-1.5">
                    <FileText size={14} className="text-[#F97316]" />
                    Describe your issue
                </label>
                <textarea
                    value={description}
                    onChange={(e) => onDescriptionChange(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 bg-white h-20 border-2 border-[#FED7AA] rounded-xl text-xs text-[#7C2D12] placeholder:text-[#FDBA74]/70 focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 outline-none transition-all resize-none"
                    placeholder="Please tell us more about the issue..."
                />
            </div>
        )}
    </div>
);

// ========== PHOTO UPLOAD ==========
const PhotoUploadStep = ({ photos, onUpload, onRemove }) => {
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (photos.length + files.length > 5) {
            toast.error('Maximum 5 photos allowed');
            return;
        }
        onUpload([...photos, ...files]);
    };

    return (
        <div className="space-y-4 animate__animated animate__fadeIn">
            <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#FED7AA] rounded-xl p-6 hover:border-[#F97316] hover:bg-[#FFF7ED]/30 transition-all cursor-pointer text-center"
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple
                    accept="image/*"
                    className="hidden"
                />
                <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-[#FFEDD5] rounded-full flex items-center justify-center">
                        <Upload size={20} className="text-[#F97316]" />
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-[#7C2D12]">
                        Click to upload photos
                    </p>
                    <p className="text-[10px] text-[#9A3412]">
                        PNG, JPG up to 5MB (Max 5 photos)
                    </p>
                </div>
            </div>
            {photos.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {photos.map((photo, index) => (
                        <div key={index} className="relative group animate__animated animate__fadeIn">
                            <img
                                src={URL.createObjectURL(photo)}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-20 object-cover rounded-lg border-2 border-[#FED7AA]"
                            />
                            <button
                                onClick={() => onRemove(index)}
                                className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X size={12} className="text-white" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// ========== ADDRESS SELECTION ==========
const AddressSelectionStep = ({
    addresses,
    selectedAddress,
    onSelectAddress,
    onShowAddressModal,
    isLoading
}) => (
    <div className="space-y-3 animate__animated animate__fadeIn">
        {isLoading ? (
            <div className="space-y-3">
                {[1, 2].map(i => (
                    <div key={i} className="border-2 border-[#FED7AA] rounded-xl p-3 animate-pulse">
                        <div className="flex gap-2">
                            <div className="w-7 h-7 bg-gray-200 rounded-lg"></div>
                            <div className="flex-1">
                                <div className="h-3 w-24 bg-gray-200 rounded mb-2"></div>
                                <div className="h-2 w-full bg-gray-200 rounded mb-1"></div>
                                <div className="h-2 w-32 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : addresses.length === 0 ? (
            <div className="text-center py-6">
                <MapPin size={24} className="mx-auto text-[#9A3412] mb-2" />
                <p className="text-xs text-[#7C2D12] mb-3">No saved addresses found</p>
                <button
                    onClick={onShowAddressModal}
                    className="px-4 py-2 bg-[#F97316] text-white rounded-xl text-xs font-medium hover:bg-[#EA580C] transition-all"
                >
                    Add New Address
                </button>
            </div>
        ) : (
            <>
                {addresses.map(address => (
                    <div
                        key={address.id}
                        className={`
                            border-2 rounded-xl p-3 transition-all duration-300
                            ${selectedAddress?.id === address.id
                                ? 'border-[#F97316] bg-[#FFF7ED]/30 shadow-lg shadow-[#F97316]/10'
                                : 'border-[#FED7AA] hover:border-[#FDBA74] hover:shadow-md'}
                        `}
                    >
                        <div className="flex items-start gap-2">
                            <div className="w-7 h-7 bg-[#FFF7ED] rounded-lg flex items-center justify-center flex-shrink-0">
                                <MapPin size={14} className="text-[#F97316]" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <h6 className="font-semibold text-xs text-[#7C2D12] truncate">{address.name}</h6>
                                    {address.isDefault && (
                                        <span className="bg-[#10B981] text-white text-[8px] px-1.5 py-0.5 rounded-full">
                                            Default
                                        </span>
                                    )}
                                </div>
                                <p className="text-[10px] text-[#9A3412] leading-tight">
                                    {address.addressLine}, {address.locality}, {address.city}, {address.state} - {address.pincode}
                                </p>
                                <p className="text-[10px] text-[#7C2D12] mt-1 flex items-center gap-1">
                                    <Phone size={10} className="text-[#F97316]" /> {address.phone}
                                </p>
                            </div>
                            <button
                                onClick={() => onSelectAddress(address)}
                                className={`
                                    px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all ml-1 flex-shrink-0
                                    ${selectedAddress?.id === address.id
                                        ? 'bg-[#10B981] text-white'
                                        : 'border border-[#F97316] text-[#F97316] hover:bg-[#FFF7ED]'}
                                `}
                            >
                                {selectedAddress?.id === address.id ? 'Selected' : 'Select'}
                            </button>
                        </div>
                    </div>
                ))}
                <button
                    onClick={onShowAddressModal}
                    className="w-full py-2.5 border-2 border-dashed border-[#F97316] rounded-xl text-[#F97316] text-xs font-medium hover:bg-[#FFF7ED] hover:border-solid transition-all flex items-center justify-center gap-1.5"
                >
                    <Plus size={14} />
                    Add New Address
                </button>
            </>
        )}
    </div>
);

// ========== RETURN/REPLACE OPTIONS ==========
const OptionStep = ({ selectedOption, onSelectOption }) => (
    <div className="grid grid-cols-2 gap-3 animate__animated animate__fadeIn">
        <button
            onClick={() => onSelectOption('return')}
            className={`
                p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2
                ${selectedOption === 'return'
                    ? 'border-[#F97316] bg-[#FFF7ED] shadow-lg shadow-[#F97316]/10 scale-105'
                    : 'border-[#FED7AA] hover:border-[#FDBA74] hover:bg-[#FFF7ED]/50'}
            `}
        >
            <div className={`
                w-10 h-10 rounded-full flex items-center justify-center
                ${selectedOption === 'return' ? 'bg-[#F97316]' : 'bg-[#FFEDD5]'}
            `}>
                <RefreshCw size={18} className={selectedOption === 'return' ? 'text-white' : 'text-[#9A3412]'} />
            </div>
            <span className="text-xs sm:text-sm font-bold text-[#7C2D12]">Return</span>
            <span className="text-[10px] text-[#9A3412]">Refund to original payment</span>
        </button>
        {/* <button
            onClick={() => onSelectOption('replace')}
            className={`
                p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2
                ${selectedOption === 'replace'
                    ? 'border-[#F97316] bg-[#FFF7ED] shadow-lg shadow-[#F97316]/10 scale-105'
                    : 'border-[#FED7AA] hover:border-[#FDBA74] hover:bg-[#FFF7ED]/50'}
            `}
        >
            <div className={`
                w-10 h-10 rounded-full flex items-center justify-center
                ${selectedOption === 'replace' ? 'bg-[#F97316]' : 'bg-[#FFEDD5]'}
            `}>
                <Package size={18} className={selectedOption === 'replace' ? 'text-white' : 'text-[#9A3412]'} />
            </div>
            <span className="text-xs sm:text-sm font-bold text-[#7C2D12]">Replace</span>
            <span className="text-[10px] text-[#9A3412]">Same product replacement</span>
        </button> */}
    </div>
);

// ========== ORDER DETAILS SIDEBAR ==========
const OrderDetailsSidebar = ({ orderData }) => {
    if (!orderData) return null;

    return (
        <div className="bg-gradient-to-b from-[#FFF7ED] to-[#FFEDD5] rounded-2xl p-4 border-2 border-[#FED7AA] sticky top-4">
            {/* Order Header */}
            <div className="flex items-center gap-2 pb-3 border-b border-[#FED7AA]">
                <div className="w-8 h-8 bg-[#F97316] rounded-lg flex items-center justify-center">
                    <ShoppingBag size={16} className="text-white" />
                </div>
                <div>
                    <h3 className="text-xs font-bold text-[#7C2D12]">Order #{orderData.order_id}</h3>
                    <p className="text-[10px] text-[#9A3412] flex items-center gap-1">
                        <Calendar size={10} />
                        {new Date(orderData.history?.[0]?.updated_at).toLocaleDateString()}
                    </p>
                </div>
            </div> 

            {/* Order Items */}
            <div className="py-3 space-y-3">
                <p className="text-[10px] font-semibold text-[#7C2D12]">Items ({orderData.items?.length})</p>
                {orderData.items?.map((item, idx) => (
                    <div key={item.id || idx} className="flex gap-2">
                        <div className="w-12 h-12 bg-white rounded-lg border-2 border-[#FED7AA] flex items-center justify-center flex-shrink-0">
                            {item.image_path ? (
                                <img src={item.image_path} alt={item.productName} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                                <Package size={20} className="text-[#9A3412]" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-medium text-[#7C2D12] truncate">{item.productName}</h4>
                            <p className="text-[10px] text-[#9A3412]">SNO: {item.sno}</p>
                            <div className="flex justify-between items-center mt-1">
                                <span className="text-[10px] text-[#9A3412]">Qty: {item.quantity}</span>
                                <span className="text-xs font-bold text-[#F97316]">₹{item.price?.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Order Summary */}
            <div className="pt-3 border-t border-[#FED7AA] space-y-2">
                <div className="flex justify-between text-[10px]">
                    <span className="text-[#9A3412]">Subtotal</span>
                    <span className="font-medium text-[#7C2D12]">₹{orderData.total_amount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                    <span className="text-[#9A3412]">Shipping</span>
                    <span className="font-medium text-[#7C2D12]">₹{orderData.shipping_fee?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold pt-1">
                    <span className="text-[#7C2D12]">Total</span>
                    <span className="text-[#F97316]">₹{orderData.total_summary?.toFixed(2)}</span>
                </div>
            </div>

            {/* Payment Info */}
            <div className="mt-3 pt-3 border-t border-[#FED7AA]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <CreditCard size={12} className="text-[#F97316]" />
                        <span className="text-[10px] text-[#9A3412]">Payment</span>
                    </div>
                    <span className={`
                        text-[10px] font-medium px-2 py-0.5 rounded-full
                        ${orderData.payment_mode === 'COD'
                            ? 'bg-[#FFEDD5] text-[#F97316]'
                            : 'bg-[#10B981]/10 text-[#10B981]'}
                    `}>
                        {orderData.payment_mode}
                    </span>
                </div>
                <p className="text-[10px] text-[#7C2D12] mt-1">
                    Status: <span className={`
                        font-medium capitalize
                        ${orderData.payment_status === 'PAID' ? 'text-[#10B981]' : 'text-[#F97316]'}
                    `}>{orderData.payment_status}</span>
                </p>
            </div>

            {/* Delivery Address */}
            {orderData.delivery_address && (
                <div className="mt-3 pt-3 border-t border-[#FED7AA]">
                    <div className="flex items-center gap-1.5 mb-1">
                        <MapPin size={12} className="text-[#F97316]" />
                        <span className="text-[10px] font-medium text-[#7C2D12]">Delivery Address</span>
                    </div>
                    <p className="text-[9px] text-[#9A3412] leading-tight">
                        {orderData.delivery_address.name}<br />
                        {orderData.delivery_address.addressLine},<br />
                        {orderData.delivery_address.city}, {orderData.delivery_address.state} - {orderData.delivery_address.pincode}<br />
                        <span className="flex items-center gap-1 mt-1">
                            <Phone size={8} /> {orderData.delivery_address.phone}
                        </span>
                    </p>
                </div>
            )}
        </div>
    );
};

// ========== SUCCESS MODAL ==========
const SuccessModal = ({ show, onClose, type, orderId }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate__animated animate__fadeIn">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white/95 backdrop-blur-md rounded-2xl max-w-sm w-full p-6 shadow-2xl border-2 border-[#FED7AA] animate__animated animate__fadeInUp">
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-[#10B981] rounded-full flex items-center justify-center mb-4">
                        <Check size={28} className="text-white" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-[#7C2D12] mb-2">
                        {type === 'return' ? 'Return' : 'Replacement'} Initiated Successfully!
                    </h3>
                    <p className="text-xs text-[#9A3412] mb-1">
                        Order #{orderId}
                    </p>
                    <p className="text-xs text-[#9A3412] mb-6">
                        You will get a call shortly from our support team.
                    </p>
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white rounded-xl text-xs font-medium hover:shadow-lg transition-all"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

// ========== MAIN COMPONENT ==========
const ReturnReplaceFlow = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const orderData = location.state;


    const refunOrder = useRefundOrder();

    // Redirect if no order data
    useEffect(() => {
        if (!orderData) {
            toast.error('Order details not found');
            navigate(-1);
            return;
        }
    }, [orderData, navigate]);

    // Address hooks
    const customerId = orderData?.user?.contact || orderData?.delivery_address?.customerId;

    console.log(customerId,'customerId')
    const { data: addressesData, isLoading: addressesLoading } = useAddressesByCustomer(10085);
    const createAddress = useCreateAddress();
    const updateAddress = useUpdateAddress();
    const deleteAddress = useDeleteAddress();

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedReason, setSelectedReason] = useState(null);
    const [description, setDescription] = useState('');
    const [photos, setPhotos] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [pincodeAddress, setPincodeAddress] = useState(null);

    console.log(addressesData,'addressesData')
    // Set default selected address
    useEffect(() => {
        if (addressesData?.length && !selectedAddress) {
            const defaultAddress = addressesData.find(addr => addr.isDefault) || addressesData[0];
            setSelectedAddress(defaultAddress);
        }
    }, [addressesData, selectedAddress]);

    console.log(selectedAddress,'selectedAddress')

    if (!orderData) return null;

    const handlePincodeChange = useCallback(async (pincode) => {
        if (pincode?.length === 6) {
            try {
                const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
                const data = await response.json();
                setPincodeAddress(data);
            } catch (error) {
                console.error('Error fetching pincode:', error);
                setPincodeAddress(null);
            }
        }
    }, []);

    const handleSaveAddress = async (addressData) => {
        try {
            if (addressData.id) {
                await updateAddress.mutateAsync(addressData);
                toast.success('Address updated successfully');
            } else {
                await createAddress.mutateAsync({ ...addressData, customerId });
                toast.success('Address added successfully');
            }
            setShowAddressModal(false);
        } catch (error) {
            toast.error(error.message || 'Failed to save address');
        }
    };

    const handleDeleteAddress = async (addressId) => {
        try {
            await deleteAddress.mutateAsync(addressId);
            toast.success('Address deleted successfully');
        } catch (error) {
            toast.error(error.message || 'Failed to delete address');
        }
    };

    const handleNext = () => {
        if (currentStep === 1 && !selectedReason) {
            toast.error('Please select a reason');
            return;
        }
        if (currentStep === 2 && photos.length === 0) {
            toast.error('Please upload at least 1 photo');
            return;
        }
        if (currentStep === 3 && !selectedAddress) {
            toast.error('Please select pickup address');
            return;
        }
        if (currentStep === 4 && !selectedOption) {
            toast.error('Please select return or replacement');
            return;
        }
        if (currentStep === 5) {
            handleSubmit();
        } else {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = () => {
        if (!selectedReason || !selectedOption || !selectedAddress) {
            alert("Please complete all required fields.");
            return;
        }

        const formData = new FormData();

        formData.append('orderId', orderData?.order_id);
        formData.append('reason', selectedReason);
        formData.append('comments', description || '');
        formData.append('action', selectedOption);
        formData.append('addresses', JSON.stringify(selectedAddress));
        formData.append('products', JSON.stringify(orderData?.items || []));
        formData.append('image', photos); // better to use same key if backend expects array


        refunOrder.mutate(formData);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Return/Replace Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-lg border-2 border-[#FED7AA] p-4 sm:p-5">
                        {/* Progress Stepper */}
                        <ProgressStepper currentStep={currentStep} />

                        {/* Divider */}
                        <div className="h-0.5 bg-gradient-to-r from-transparent via-[#FED7AA] to-transparent my-4" />

                        {/* Step Content */}
                        <div className="min-h-[350px] py-2">
                            {currentStep === 1 && (
                                <ReasonStep
                                    selectedReason={selectedReason}
                                    onSelectReason={setSelectedReason}
                                    description={description}
                                    onDescriptionChange={setDescription}
                                />
                            )}

                            {currentStep === 2 && (
                                <PhotoUploadStep
                                    photos={photos}
                                    onUpload={setPhotos}
                                    onRemove={(index) => setPhotos(photos.filter((_, i) => i !== index))}
                                />
                            )}

                            {currentStep === 3 && (
                                <AddressSelectionStep
                                    addresses={addressesData || []}
                                    selectedAddress={selectedAddress}
                                    onSelectAddress={setSelectedAddress}
                                    onShowAddressModal={() => setShowAddressModal(true)}
                                    isLoading={addressesLoading}
                                />
                            )}

                            {currentStep === 4 && (
                                <OptionStep
                                    selectedOption={selectedOption}
                                    onSelectOption={setSelectedOption}
                                />
                            )}

                            {currentStep === 5 && (
                                <div className="space-y-4 animate__animated animate__fadeIn">
                                    <h4 className="text-xs font-bold text-[#7C2D12] flex items-center gap-1.5">
                                        <FileText size={14} className="text-[#F97316]" />
                                        Review Your Request
                                    </h4>
                                    <div className="bg-[#FFF7ED] rounded-xl p-4 space-y-3">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-[#9A3412]">Order ID:</span>
                                            <span className="font-medium text-[#7C2D12]">{orderData.order_id}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-[#9A3412]">Reason:</span>
                                            <span className="font-medium text-[#7C2D12]">
                                                {reasons.find(r => r.id === selectedReason)?.label}
                                            </span>
                                        </div>
                                        {description && (
                                            <div className="flex justify-between text-xs">
                                                <span className="text-[#9A3412]">Description:</span>
                                                <span className="font-medium text-[#7C2D12] max-w-[200px] text-right">
                                                    {description}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-xs">
                                            <span className="text-[#9A3412]">Photos:</span>
                                            <span className="font-medium text-[#7C2D12]">{photos.length} uploaded</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-[#9A3412]">Pickup Address:</span>
                                            <span className="font-medium text-[#7C2D12] text-right max-w-[200px]">
                                                {selectedAddress?.addressLine}, {selectedAddress?.city}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-[#9A3412]">Option:</span>
                                            <span className="font-medium text-[#7C2D12] capitalize">{selectedOption}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between gap-3 mt-6 pt-4 border-t-2 border-[#FED7AA]">
                            <button
                                onClick={handleBack}
                                disabled={currentStep === 1}
                                className={`
                                    px-4 py-2 rounded-xl text-xs font-medium transition-all
                                    ${currentStep === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'border-2 border-[#FED7AA] text-[#7C2D12] hover:bg-[#FFF7ED] hover:border-[#FDBA74]'}
                                `}
                            >
                                Back
                            </button>
                            <button
                                onClick={handleNext}
                                className="px-6 py-2 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white rounded-xl text-xs font-medium hover:shadow-lg hover:shadow-[#F97316]/30 transition-all transform hover:scale-105 flex items-center gap-1.5"
                            >
                                {currentStep === 5 ? 'Submit Request' : 'Next'}
                                {currentStep !== 5 && <ChevronRight size={14} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column - Order Details */}
                <div className="lg:col-span-1">
                    <OrderDetailsSidebar orderData={orderData} />
                </div>
            </div>

            {/* Address Modal */}
            {showAddressModal && (
                <AddressModal
                    show={showAddressModal}
                    onHide={() => setShowAddressModal(false)}
                    addresses={addressesData?.data || []}
                    selectedAddress={selectedAddress}
                    onSelectAddress={(addr) => {
                        setSelectedAddress(addr);
                        setShowAddressModal(false);
                    }}
                    onSaveAddress={handleSaveAddress}
                    onDeleteAddress={handleDeleteAddress}
                    customerProfile={{
                        name: orderData?.user?.user_name,
                        contactNumber: orderData?.user?.contact
                    }}
                    onPincodeChange={handlePincodeChange}
                    pincodeAddress={pincodeAddress}
                />
            )}

            {/* Success Modal */}
            <SuccessModal
                show={showSuccessModal}
                onClose={() => {
                    setShowSuccessModal(false);
                    navigate(`/account/orderdetails/${orderData.order_id}`); // Navigate to orders page
                }}
                type={selectedOption}
                orderId={orderData.order_id}
            />
        </div>
    );
};

export default ReturnReplaceFlow;