import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Check, Plus, Edit, Trash2, Phone, Home, ShoppingBag, MapPin, User, CreditCard, X, ChevronDown, ChevronUp, Map, Shield, Truck, Edit2, Building, Globe, Tag, Star } from 'lucide-react';
import { useCreateOrder } from '../../../hook/order/useOrderMutation';
import { useCurrentProfile } from '../../../hook/userProfile/useUserProfileQuery';
import { useCreateAddress, useUpdateAddress, useAddressesByCustomer, useDeleteAddress } from '../../../hook/address/useNewAddress';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash, faPhone } from '@fortawesome/free-solid-svg-icons';
import GeoLocationPicker from '../../location/GeoLocationPicker';
import SmartButton from '../../ui/SmartButton';
import { useAddressesByPincode } from '../../../hook/address/useGetAddressByPincode';
import { useNavigate } from 'react-router-dom';
import { useCheckShippingPrice } from '../../../hook/pincode/usePincode';
import { usePincode } from '../../../context/pinocde/PincodeContext';
import { getImage } from '../../../utils/getProductImages';
import { formatCurrency } from '../../../utils/formatters';
import "animate.css";

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

// ========== ADDRESS MODAL ==========
const AddressModal = ({
  show,
  onHide,
  addresses,
  selectedAddress,
  onSelectAddress,
  onSaveAddress,
  onDeleteAddress,
  customerProfile,
  onPincodeChange,
  pincodeAddress
}) => {
  const [clear, setClear] = useState(false);
  const [mode, setMode] = useState('list');
  const [currentAddress, setCurrentAddress] = useState(null);
  const [showPostOfficeList, setShowPostOfficeList] = useState(false);
  const [pincodeVerified, setPincodeVerified] = useState(false);
  const [formData, setFormData] = useState({
    name: customerProfile?.username || customerProfile?.name || '',
    phone: customerProfile?.contactNumber || '',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    locality: '',
    landmark: '',
    gstNumber: '',
    companyName: '',
    alternatePhone: '',
    isDefault: false
  });

  const postOffices = pincodeAddress?.[0]?.PostOffice || [];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  useEffect(() => {
    if (postOffices.length > 0) {
      setPincodeVerified(false);
      setShowPostOfficeList(false);
    }
  }, [postOffices]);

  useEffect(() => {
    if (!/^\d{6}$/.test(formData.pincode)) {
      setShowPostOfficeList(false);
      setPincodeVerified(false);
      onPincodeChange(null);
      return;
    }
    onPincodeChange(formData.pincode);
  }, [formData.pincode, onPincodeChange]);

  const handleAddNew = () => {
    setCurrentAddress(null);
    setFormData({
      name: customerProfile?.name || customerProfile?.username || '',
      phone: customerProfile?.contactNumber || '',
      addressLine: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
      locality: '',
      landmark: '',
      gstNumber: '',
      companyName: '',
      alternatePhone: '',
      isDefault: false,
    });
    setMode('add');
  };

  const handleClear = () => {
    setFormData({
      name: '',
      phone: '',
      addressLine: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
      locality: '',
      landmark: '',
      gstNumber: '',
      companyName: '',
      alternatePhone: '',
      isDefault: false,
    });
    setClear(true);
  };

  const handlePostOfficeSelect = (po) => {
    setFormData(prev => ({
      ...prev,
      city: po.District || '',
      state: po.State || '',
      country: po.Country || 'India',
      locality: po.Name || '',
      pincode: po.Pincode || prev.pincode,
    }));
    setShowPostOfficeList(false);
  };

  const handleGeoFill = (geoRes) => {
    setFormData(prev => ({
      ...prev,
      addressLine: geoRes.addressLine || prev.addressLine,
      city: geoRes.city || prev.city,
      state: geoRes.state || prev.state,
      pincode: geoRes.pincode || prev.pincode,
      locality: geoRes.locality || prev.locality,
      landmark: geoRes.landmark || prev.landmark,
      latitude: geoRes.latitude,
      longitude: geoRes.longitude
    }));
    setClear(true);
  };

  const handleEdit = (address) => {
    setCurrentAddress(address);
    setShowPostOfficeList(false);
    setPincodeVerified(true);
    setFormData({
      name: address.name,
      phone: address.phone,
      addressLine: address.addressLine,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      country: address.country || 'India',
      locality: address.locality || '',
      landmark: address.landmark || '',
      gstNumber: address.gstNumber || '',
      companyName: address.companyName || '',
      alternatePhone: address.alternatePhone || '',
      isDefault: address.isDefault,
    });
    setMode('edit');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.addressLine || !formData.city || !formData.state || !formData.pincode) {
      toast.error('Please fill all required fields');
      return;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error('Phone number must be 10 digits');
      return;
    }
    if (!/^\d{6}$/.test(formData.pincode)) {
      toast.error('Pincode must be 6 digits');
      return;
    }
    onSaveAddress(currentAddress?.id ? { id: currentAddress.id, ...formData } : formData);
    setClear(true);
    setMode('list');
  };

  const handleDelete = (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      onDeleteAddress(addressId);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 animate__animated animate__fadeIn">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onHide}></div>

      {/* Modal Content */}
      <div className="relative bg-white/95 backdrop-blur-md rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border-2 border-[#FED7AA] animate__animated animate__fadeInUp">

        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#FFF7ED] to-[#FFEDD5] border-b border-[#FED7AA] px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-lg flex items-center justify-center shadow-md">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-bold text-[#7C2D12] text-lg">
              {mode === 'list' ? 'Select Address' : mode === 'add' ? 'Add Address' : 'Edit Address'}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {mode !== 'list' && (
              <GeoLocationPicker onAddressSelected={handleGeoFill} clear={clear} />
            )}
            <button
              onClick={onHide}
              className="w-8 h-8 rounded-lg hover:bg-white/80 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-[#9A3412]" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-4 py-4 overflow-y-auto max-h-[calc(90vh-80px)]">
          {mode === 'list' ? (
            <div className="space-y-4">
              {addresses.map(address => (
                <div
                  key={address.id}
                  className={`
                    border-2 rounded-xl p-4 transition-all duration-300 animate__animated animate__fadeIn
                    ${selectedAddress?.id === address.id
                      ? 'border-[#F97316] bg-[#FFF7ED]/30 shadow-lg shadow-[#F97316]/10'
                      : 'border-[#FED7AA] hover:border-[#FDBA74] hover:shadow-md'
                    }
                  `}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#FFF7ED] rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-[#F97316]" />
                      </div>
                      <h6 className="font-semibold text-[#7C2D12]">{address.name}</h6>
                      {address.isDefault && (
                        <span className="bg-gradient-to-r from-[#10B981] to-[#059669] text-white text-[10px] px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                    </div>

                    <div className="flex gap-1.5">
                      <button
                        className="w-7 h-7 rounded-lg bg-[#FFF7ED] text-[#F97316] flex items-center justify-center hover:bg-[#FFEDD5] transition-colors"
                        onClick={() => handleEdit(address)}
                        title="Edit address"
                      >
                        <FontAwesomeIcon icon={faPen} size="sm" />
                      </button>
                      {!address.isDefault && (
                        <button
                          className="w-7 h-7 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-100 transition-colors"
                          onClick={() => handleDelete(address.id)}
                          title="Delete address"
                        >
                          <FontAwesomeIcon icon={faTrash} size="sm" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="text-xs sm:text-sm text-[#9A3412] space-y-1 ml-10">
                    <p className="text-[#7C2D12] font-medium">{address.addressLine}</p>
                    <p>{[address.locality, address.city].filter(Boolean).join(', ')}</p>
                    <p>{address.state} - <span className="font-semibold">{address.pincode}</span></p>
                    {address.landmark && (
                      <p className="text-[#F97316]">Landmark: {address.landmark}</p>
                    )}
                    <p className="flex items-center gap-1.5 mt-2 text-[#7C2D12]">
                      <Phone className="w-3.5 h-3.5 text-[#F97316]" />
                      {address.phone}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#FED7AA]">
                    <button
                      onClick={() => { onSelectAddress(address); onHide(); }}
                      className={`
                        w-full py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300
                        ${selectedAddress?.id === address.id
                          ? 'bg-gradient-to-r from-[#10B981] to-[#059669] text-white shadow-md hover:shadow-lg'
                          : 'border-2 border-[#F97316] text-[#F97316] hover:bg-[#FFF7ED] hover:border-[#EA580C]'
                        }
                      `}
                    >
                      {selectedAddress?.id === address.id ? (
                        <span className="flex items-center justify-center gap-2">
                          <Check className="w-4 h-4" /> Selected
                        </span>
                      ) : (
                        'Deliver Here'
                      )}
                    </button>
                  </div>
                </div>
              ))}

              <button
                className="w-full py-3 border-2 border-dashed border-[#F97316] rounded-xl text-[#F97316] font-medium hover:bg-[#FFF7ED] hover:border-solid transition-all duration-300 flex items-center justify-center gap-2 group"
                onClick={handleAddNew}
              >
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                Add New Address
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#7C2D12] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#F97316]" />
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 h-10 bg-white border-2 border-[#FED7AA] rounded-xl text-[#7C2D12] placeholder:text-[#FDBA74]/70 focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 outline-none transition-all"
                    required
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#7C2D12] flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#F97316]" />
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    pattern="[0-9]{10}"
                    maxLength="10"
                    className="w-full px-3 py-2 h-10 bg-white border-2 border-[#FED7AA] rounded-xl text-[#7C2D12] placeholder:text-[#FDBA74]/70 focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Address Line */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#7C2D12] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#F97316]" />
                  Address Line <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="addressLine"
                  value={formData.addressLine}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 bg-white border-2 border-[#FED7AA] rounded-xl text-[#7C2D12] placeholder:text-[#FDBA74]/70 focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 outline-none transition-all resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pincode */}
                <div className="space-y-1.5 relative">
                  <label className="text-xs font-semibold text-[#7C2D12] flex items-center gap-1.5">
                    <Map className="w-3.5 h-3.5 text-[#F97316]" />
                    Pincode <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      pattern="[0-9]{6}"
                      maxLength={6}
                      className="w-full px-3 py-2 h-10 bg-white border-2 border-[#FED7AA] rounded-xl text-[#7C2D12] placeholder:text-[#FDBA74]/70 focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 outline-none transition-all pr-10"
                      required
                    />
                    {postOffices.length > 0 && (
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#10B981]/10 rounded-lg flex items-center justify-center hover:bg-[#10B981]/20 transition-colors"
                        onClick={() => {
                          setShowPostOfficeList(prev => !prev);
                          setPincodeVerified(true);
                        }}
                      >
                        <Check className="w-3.5 h-3.5 text-[#10B981]" />
                      </button>
                    )}
                  </div>

                  {/^\d{6}$/.test(formData.pincode) && showPostOfficeList && postOffices.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-50 bg-white border-2 border-[#FED7AA] rounded-xl shadow-lg max-h-48 overflow-y-auto mt-1 animate__animated animate__fadeIn">
                      {postOffices.map((po, index) => (
                        <div
                          key={index}
                          className="px-3 py-2 hover:bg-[#FFF7ED] cursor-pointer border-b border-[#FED7AA] last:border-b-0 transition-colors"
                          onClick={() => handlePostOfficeSelect(po)}
                        >
                          <div className="font-medium text-[#7C2D12]">{po.Name}</div>
                          <div className="text-xs text-[#9A3412]">
                            {po.Block}, {po.District}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Locality */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#7C2D12] flex items-center gap-1.5">
                    <Map className="w-3.5 h-3.5 text-[#F97316]" />
                    Locality <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="locality"
                    value={formData.locality}
                    onChange={handleChange}
                    className="w-full px-3 py-2 h-10 bg-white border-2 border-[#FED7AA] rounded-xl text-[#7C2D12] placeholder:text-[#FDBA74]/70 focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* City */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#7C2D12] flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-[#F97316]" />
                    City <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 h-10 bg-white border-2 border-[#FED7AA] rounded-xl text-[#7C2D12] placeholder:text-[#FDBA74]/70 focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 outline-none transition-all"
                    required
                  />
                </div>

                {/* State */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#7C2D12] flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#F97316]" />
                    State <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-3 py-2 h-10 bg-white border-2 border-[#FED7AA] rounded-xl text-[#7C2D12] placeholder:text-[#FDBA74]/70 focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Landmark */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#7C2D12] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#F97316]" />
                    Landmark <span className="text-[#9A3412] font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    className="w-full px-3 py-2 h-10 bg-white border-2 border-[#FED7AA] rounded-xl text-[#7C2D12] placeholder:text-[#FDBA74]/70 focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 outline-none transition-all"
                  />
                </div>

                {/* Alternate Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#7C2D12] flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#F97316]" />
                    Alternate Phone <span className="text-[#9A3412] font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="alternatePhone"
                    value={formData.alternatePhone}
                    onChange={handleChange}
                    pattern="[0-9]{10}"
                    maxLength="10"
                    className="w-full px-3 py-2 h-10 bg-white border-2 border-[#FED7AA] rounded-xl text-[#7C2D12] placeholder:text-[#FDBA74]/70 focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Company Fields - Work Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#7C2D12] flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-[#F97316]" />
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 h-10 bg-white border-2 border-[#FED7AA] rounded-xl text-[#7C2D12] placeholder:text-[#FDBA74]/70 focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#7C2D12] flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#F97316]" />
                    GST Number
                  </label>
                  <input
                    type="text"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 h-10 bg-white border-2 border-[#FED7AA] rounded-xl text-[#7C2D12] placeholder:text-[#FDBA74]/70 focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Default Address Checkbox */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#F97316] border-2 border-[#FED7AA] rounded-lg focus:ring-[#F97316]/20 transition-all"
                />
                <label className="text-xs sm:text-sm text-[#7C2D12] flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-[#FDBA74]" />
                  Set as default address
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t-2 border-[#FED7AA]">
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-4 py-2 border-2 border-[#FED7AA] text-[#7C2D12] rounded-xl text-xs font-medium hover:bg-[#FFF7ED] hover:border-[#FDBA74] transition-all duration-300"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => setMode('list')}
                  className="px-4 py-2 border-2 border-[#FED7AA] text-[#7C2D12] rounded-xl text-xs font-medium hover:bg-[#FFF7ED] hover:border-[#FDBA74] transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white rounded-xl text-xs font-medium hover:shadow-lg hover:shadow-[#F97316]/30 transition-all duration-300 transform hover:scale-105"
                >
                  {currentAddress ? 'Update' : 'Save'} Address
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// ========== ORDER SUMMARY PANEL ==========
const OrderSummaryPanel = ({
  items = [],
  subtotal = 0,
  shippingFee = 0,
  total = 0,
  isCompact = false
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
  const shippingText = shippingFee === 0 ? 'Free' : formatCurrency(shippingFee);

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
          <span className={`font-semibold ${shippingFee === 0 ? 'text-[#10B981]' : 'text-[#7C2D12]'}`}>
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
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [totalAmount, setTotalAmount] = useState(subtotal || 0);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMode, setPaymentMode] = useState('ONLINE');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [pincode, setPincode] = useState(null);
  const [shippingFee, setShippingFee] = useState(0);

  const { data: profile, isLoading: profileLoading } = useCurrentProfile();
  const { data: addressByPincode } = useAddressesByPincode(pincode);
  const { pincode: storedPincode } = usePincode();
  const { data: addresses, isLoading: addressesLoading, refetch: refetchAddresses } = useAddressesByCustomer(profile?.id);
  const { mutate: createOrderMutation } = useCreateOrder(navigate);
  const { mutate: createAddress } = useCreateAddress();
  const { mutate: updateAddress } = useUpdateAddress();
  const { mutate: deleteAddress } = useDeleteAddress();

  const finalPincode = selectedAddress?.pincode || storedPincode || pincode || null;

  const totalWeight = useMemo(() => {
    if (!cartItems?.length) return 0;
    return cartItems.reduce((total, item) => total + (item.weight || 0), 0);
  }, [cartItems]);

  const {
    data: shippingData,
    isLoading: shippingLoading,
    error: shippingError
  } = useCheckShippingPrice(finalPincode, totalWeight);

  useEffect(() => {
    if (shippingData?.totalAmount) {
      setShippingFee(shippingData.totalAmount);
      setTotalAmount((subtotal || 0) + shippingData.totalAmount);
    }
  }, [shippingData, subtotal]);

  useEffect(() => {
    const storedCart = localStorage.getItem('cartitems');
    if (!cartItems.length && storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        setCartItems(parsedCart.items || []);
        setTotalAmount(parsedCart.totalAmount || 0);
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0];
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
          toast.success('Address updated successfully');
        },
        onError: (error) => { toast.error(error.response?.data || 'Failed to update address'); }
      });
    } else {
      createAddress(payload, {
        onSuccess: () => {
          refetchAddresses();
          toast.success('Address added successfully');
        },
        onError: (error) => { toast.error(error.response?.data || 'Failed to create address'); }
      });
    }
  };

  const handleDeleteAddress = (addressId) => {
    deleteAddress(addressId, {
      onSuccess: () => {
        refetchAddresses();
        if (selectedAddress?.id === addressId) setSelectedAddress(null);
        toast.success('Address deleted successfully');
      },
      onError: (error) => { toast.error(error.response?.data || 'Failed to delete address'); }
    });
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const submitOrder = useCallback(() => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    const orderPayload = {
      customerName: selectedAddress.name,
      contact: selectedAddress.phone,
      email: profile?.email,
      totalAmount,
      paymentMode,
      paymentStatus: "PENDING",
      shippingPincode: finalPincode,
      address: {
        addressLine: `${selectedAddress.addressLine} ${selectedAddress.locality || ''} ${selectedAddress.city || ''} ${selectedAddress.state || ''} ${selectedAddress.country || ''} - ${selectedAddress.pincode || ''}`,
        city: selectedAddress.city,
        state: selectedAddress.state,
        country: selectedAddress.country || "India",
        pincode: selectedAddress.pincode,
      },
      items: cartItems.map((item) => ({
        productId: `${item.itemId}-${item.tagNo}`,
        productName: item.productName,
        price: parseFloat(item.price),
        grossAmount: parseFloat(item.price),
        itemId: item.itemId,
        tagNo: item.tagNo,
        sno: item.sno,
        netWt: item.weight,
        grsWt: item.weight,
        imagePath: item.imagePath,
        quantity: item.quantity,
        gstType: item.gstType,
        gstPer: parseFloat(item.gstPer),
        gstAmount: Number(item.gstAmount) || 0,
      })),
    };

    localStorage.setItem('order', JSON.stringify(orderPayload));
    createOrderMutation(orderPayload);
  }, [cartItems, totalAmount, selectedAddress, profile?.email, paymentMode, finalPincode, createOrderMutation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF7ED] via-[#FFEDD5] to-[#FFF3E6]">

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
                          <span className={`font-semibold ${shippingFee === 0 ? 'text-[#10B981]' : 'text-[#7C2D12]'}`}>
                            {shippingFee === 0 ? 'FREE' : formatCurrency(shippingFee)}
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
                    isDisabled={!selectedAddress}
                    className="ml-auto bg-gradient-to-r from-[#10B981] to-[#059669] text-white hover:shadow-lg hover:shadow-[#10B981]/30"
                  >
                    Place Order • {formatCurrency(totalAmount)}
                  </SmartButton>
                )}
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