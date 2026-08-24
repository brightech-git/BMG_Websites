import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import GeoLocationPicker from '../../location/GeoLocationPicker';
import { Check, Plus, Phone, MapPin, User, X, Map, Building, Globe, Tag, Star, Loader2 } from 'lucide-react';
import { checkPincodeService } from '../../../service/pincodeChecking';

export const AddressModal = ({
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
    const [pincodeCheck, setPincodeCheck] = useState({ status: 'idle', pincode: '', message: '' });
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
        if (name === 'pincode') {
            const nextPincode = value.replace(/\D/g, '').slice(0, 6);
            setFormData(prev => ({ ...prev, pincode: nextPincode }));
            setPincodeCheck({ status: 'idle', pincode: '', message: '' });
            setShowPostOfficeList(false);
            return;
        }
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };


    useEffect(() => {
        if (!/^\d{6}$/.test(formData.pincode)) {
            onPincodeChange?.(null);
            return;
        }
        onPincodeChange?.(formData.pincode);
    }, [formData.pincode, onPincodeChange]);

    const isPincodeConfirmed =
        pincodeCheck.status === 'available' &&
        pincodeCheck.pincode === formData.pincode;

    const resetPincodeCheck = () => {
        setPincodeCheck({ status: 'idle', pincode: '', message: '' });
        setShowPostOfficeList(false);
    };

    const handleCheckPincode = async () => {
        const pincode = formData.pincode;
        if (!/^\d{6}$/.test(pincode)) {
            setPincodeCheck({ status: 'error', pincode, message: 'Enter a valid 6-digit pincode' });
            return;
        }

        setPincodeCheck({ status: 'checking', pincode, message: 'Checking delivery availability...' });
        try {
            const response = await checkPincodeService(pincode);
            const isAvailable = response?.status === true;
            setPincodeCheck({
                status: isAvailable ? 'available' : 'unavailable',
                pincode,
                message: response?.message || (isAvailable
                    ? 'Delivery is available for this pincode'
                    : 'Delivery is not available for this pincode')
            });
        } catch (error) {
            setPincodeCheck({
                status: 'error',
                pincode,
                message: error.message || 'Unable to check pincode availability'
            });
        }
    };

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
        resetPincodeCheck();
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
        resetPincodeCheck();
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
        const nextPincode = String(geoRes.pincode || formData.pincode || '')
            .replace(/\D/g, '')
            .slice(0, 6);
        resetPincodeCheck();
        setFormData(prev => ({
            ...prev,
            addressLine: geoRes.addressLine || prev.addressLine,
            city: geoRes.city || prev.city,
            state: geoRes.state || prev.state,
            pincode: nextPincode,
            locality: geoRes.locality || prev.locality,
            landmark: geoRes.landmark || prev.landmark,
            latitude: geoRes.latitude,
            longitude: geoRes.longitude
        }));
        setClear(true);
    };

    const handleEdit = (address) => {
        setCurrentAddress(address);
        resetPincodeCheck();
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
        if (!isPincodeConfirmed) {
            toast.error('Check and confirm pincode availability before saving the address');
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
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleChange}
                                            pattern="[0-9]{6}"
                                            maxLength={6}
                                            className="min-w-0 flex-1 px-3 py-2 h-10 bg-white border-2 border-[#FED7AA] rounded-xl text-[#7C2D12] placeholder:text-[#FDBA74]/70 focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 outline-none transition-all"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={handleCheckPincode}
                                            disabled={pincodeCheck.status === 'checking' || formData.pincode.length !== 6}
                                            className="px-3 h-10 rounded-xl bg-[#F97316] text-white text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {pincodeCheck.status === 'checking'
                                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                                : 'Check'}
                                        </button>
                                    </div>
                                    {pincodeCheck.message && (
                                        <p className={`text-xs font-medium ${isPincodeConfirmed
                                            ? 'text-emerald-600'
                                            : pincodeCheck.status === 'checking' ? 'text-amber-600' : 'text-rose-600'}`}>
                                            {isPincodeConfirmed && <Check className="inline w-3.5 h-3.5 mr-1" />}
                                            {pincodeCheck.message}
                                        </p>
                                    )}
                                    {postOffices.length > 0 && (
                                        <button
                                            type="button"
                                            className="text-xs font-medium text-[#F97316] hover:text-[#EA580C]"
                                            onClick={() => setShowPostOfficeList(prev => !prev)}
                                        >
                                            {showPostOfficeList ? 'Hide localities' : 'Choose locality'}
                                        </button>
                                    )}

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
                                    disabled={!isPincodeConfirmed}
                                    className="px-6 py-2 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white rounded-xl text-xs font-medium hover:shadow-lg hover:shadow-[#F97316]/30 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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