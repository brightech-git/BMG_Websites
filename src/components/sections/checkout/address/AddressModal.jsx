import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import 'animate.css/animate.min.css';

const AddressModal = ({
    show,
    onHide,
    addresses,
    selectedAddress,
    onSelectAddress,
    onSaveAddress,
    onDeleteAddress,
    customerProfile
}) => {
    const [mode, setMode] = useState("list");
    const [currentAddress, setCurrentAddress] = useState(null);
    const [showAdditionalDetails, setShowAdditionalDetails] = useState(false);
    const [animateClass, setAnimateClass] = useState("animate__fadeIn");

    const [formData, setFormData] = useState({
        name: customerProfile?.name || "",
        phone: customerProfile?.contactNumber || "",
        addressLine: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
        locality: "",
        landmark: "",
        alternatePhone: "",
        gstNumber: "",
        companyName: "",
        isDefault: false
    });

    useEffect(() => {
        if (show) {
            setAnimateClass("animate__fadeInUp");
        }
    }, [show]);

    const handleAnimationEnd = () => {
        if (!show) {
            setAnimateClass("animate__fadeOutDown");
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAddNew = () => {
        setAnimateClass("animate__fadeOut");
        setTimeout(() => {
            setCurrentAddress(null);
            setShowAdditionalDetails(false);
            setFormData({
                name: customerProfile?.name || "",
                phone: customerProfile?.contactNumber || "",
                addressLine: "",
                city: "",
                state: "",
                pincode: "",
                country: "India",
                locality: "",
                landmark: "",
                alternatePhone: "",
                gstNumber: "",
                companyName: "",
                isDefault: false
            });
            setMode("add");
            setAnimateClass("animate__fadeIn");
        }, 300);
    };

    const handleEdit = (address) => {
        setAnimateClass("animate__fadeOut");
        setTimeout(() => {
            setCurrentAddress(address);
            setShowAdditionalDetails(Boolean(address.gstNumber || address.companyName));
            setFormData({
                name: address.name,
                phone: address.phone,
                addressLine: address.addressLine,
                city: address.city,
                state: address.state,
                pincode: address.pincode,
                country: address.country || "India",
                locality: address.locality || "",
                landmark: address.landmark || "",
                alternatePhone: address.alternatePhone || "",
                gstNumber: address.gstNumber || "",
                companyName: address.companyName || "",
                isDefault: address.isDefault
            });
            setMode("edit");
            setAnimateClass("animate__fadeIn");
        }, 300);
    };

    const handleBackToList = () => {
        setAnimateClass("animate__fadeOut");
        setTimeout(() => {
            setMode("list");
            setAnimateClass("animate__fadeIn");
        }, 300);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name || !formData.phone || !formData.addressLine ||
            !formData.city || !formData.state || !formData.pincode) {
            toast.error("Please fill all required fields");
            return;
        }

        if (!/^\d{10}$/.test(formData.phone)) {
            toast.error("Phone number must be 10 digits");
            return;
        }

        if (formData.alternatePhone && !/^\d{10}$/.test(formData.alternatePhone)) {
            toast.error("Alternate phone must be 10 digits");
            return;
        }

        if (!/^\d{6}$/.test(formData.pincode)) {
            toast.error("Pincode must be 6 digits");
            return;
        }

        onSaveAddress(currentAddress?.id ? { id: currentAddress.id, ...formData } : formData);
        toast.success(currentAddress ? "Address updated successfully!" : "Address added successfully!");

        setAnimateClass("animate__bounceOut");
        setTimeout(() => {
            setMode("list");
            setAnimateClass("animate__fadeIn");
        }, 500);
    };

    const handleDelete = (addressId) => {
        if (window.confirm("Are you sure you want to delete this address?")) {
            onDeleteAddress(addressId);
            toast.success("Address deleted successfully!");
        }
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            centered
            onExited={handleAnimationEnd}
            className="overflow-hidden"
        >
            <div className={`animate__animated ${animateClass}`}>
                <Modal.Header closeButton className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                    <Modal.Title className="font-bold text-xl text-gray-800">
                        {mode === "list" ? "Select Delivery Address" :
                            mode === "add" ? "✚ Add New Address" : "✎ Edit Address"}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className="p-6 max-h-[70vh] overflow-y-auto">
                    {mode === "list" ? (
                        <div className="space-y-4">
                            {addresses.length === 0 ? (
                                <div className="text-center py-10 animate__animated animate__pulse">
                                    <div className="text-gray-400 mb-4">
                                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-600 mb-6">No addresses saved yet</p>
                                    <Button
                                        variant="primary"
                                        className="bg-gradient-to-r from-blue-500 to-indigo-600 border-0 hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                                        onClick={handleAddNew}
                                    >
                                        + Add Your First Address
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    {addresses.map((address, index) => (
                                        <div
                                            key={address.id}
                                            className={`relative rounded-xl border-2 p-5 transition-all duration-300 hover:shadow-lg cursor-pointer animate__animated animate__fadeInUp`}
                                            style={{ animationDelay: `${index * 100}ms` }}
                                            onClick={() => {
                                                onSelectAddress(address);
                                                onHide();
                                            }}
                                        >
                                            <div className={`absolute inset-0 rounded-xl ${selectedAddress?.id === address.id ?
                                                'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300' :
                                                'border-gray-200 hover:border-blue-300'}`}>
                                            </div>

                                            <div className="relative">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex items-center space-x-3">
                                                        <div className={`w-3 h-3 rounded-full ${selectedAddress?.id === address.id ?
                                                            'bg-gradient-to-r from-blue-500 to-indigo-600 animate-pulse' :
                                                            'bg-gray-300'}`}></div>
                                                        <h5 className="font-bold text-gray-800">{address.name}</h5>
                                                        {address.isDefault && (
                                                            <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full animate__animated animate__pulse animate__infinite animate__slow">
                                                                Default
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEdit(address);
                                                            }}
                                                            className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-colors duration-200"
                                                            title="Edit"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </button>
                                                        {!address.isDefault && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDelete(address.id);
                                                                }}
                                                                className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors duration-200"
                                                                title="Delete"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex items-center text-gray-600">
                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                        </svg>
                                                        <span>{address.phone}</span>
                                                    </div>
                                                    <div className="flex items-start text-gray-600">
                                                        <svg className="w-4 h-4 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        <div>
                                                            <p className="font-medium">{address.addressLine}</p>
                                                            <p className="text-sm">
                                                                {address.locality}, {address.city}, {address.state} - {address.pincode}
                                                            </p>
                                                            {address.landmark && (
                                                                <p className="text-sm text-gray-500 mt-1">
                                                                    📍 Near: {address.landmark}
                                                                </p>
                                                            )}
                                                            {address.companyName && (
                                                                <p className="text-sm text-blue-600 font-medium mt-1">
                                                                    🏢 {address.companyName}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-4 flex justify-end">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onSelectAddress(address);
                                                            onHide();
                                                        }}
                                                        className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${selectedAddress?.id === address.id ?
                                                            'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg' :
                                                            'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 hover:shadow-md'}`}
                                                    >
                                                        {selectedAddress?.id === address.id ? '✓ Selected' : 'Select This Address'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="pt-6 border-t border-gray-200">
                                        <button
                                            onClick={handleAddNew}
                                            className="group w-full py-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 flex flex-col items-center justify-center animate__animated animate__pulse animate__infinite animate__slower"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center group-hover:from-blue-200 group-hover:to-indigo-200 transition-all duration-300">
                                                    <svg className="w-6 h-6 text-blue-600 group-hover:text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                                    </svg>
                                                </div>
                                                <span className="font-semibold text-gray-700 group-hover:text-blue-700">
                                                    Add New Address
                                                </span>
                                            </div>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Contact Information */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 animate__animated animate__fadeIn">
                                <h6 className="font-bold text-gray-700 mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Contact Information
                                </h6>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                                            required
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                                            pattern="[0-9]{10}"
                                            required
                                            placeholder="10-digit mobile number"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Address Details */}
                            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-5 border border-gray-200 animate__animated animate__fadeIn animate__delay-1s">
                                <h6 className="font-bold text-gray-700 mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Address Details
                                </h6>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Address Line <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            name="addressLine"
                                            value={formData.addressLine}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                                            rows="2"
                                            required
                                            placeholder="House No., Building, Street, Area"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Locality <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="locality"
                                                value={formData.locality}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                                                required
                                                placeholder="Locality / Town"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Landmark
                                            </label>
                                            <input
                                                type="text"
                                                name="landmark"
                                                value={formData.landmark}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                                                placeholder="Nearby landmark (optional)"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                City <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                                                required
                                                placeholder="City"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                State <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                                                required
                                                placeholder="State"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Pincode <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="pincode"
                                                value={formData.pincode}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                                                pattern="[0-9]{6}"
                                                required
                                                placeholder="6-digit pincode"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Details Toggle */}
                            <div className="bg-gradient-to-r from-gray-50 to-indigo-50 rounded-xl p-5 border border-gray-200 animate__animated animate__fadeIn animate__delay-2s">
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                id="showAdditionalDetails"
                                                checked={showAdditionalDetails}
                                                onChange={(e) => setShowAdditionalDetails(e.target.checked)}
                                                className="sr-only"
                                            />
                                            <div className={`w-12 h-6 rounded-full transition-all duration-300 ${showAdditionalDetails ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 'bg-gray-300'}`}>
                                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 transform ${showAdditionalDetails ? 'left-7' : 'left-1'}`}></div>
                                            </div>
                                        </div>
                                        <span className="font-medium text-gray-700">
                                            Add business/additional details
                                        </span>
                                    </label>
                                    {showAdditionalDetails && (
                                        <span className="text-sm text-blue-600 animate__animated animate__bounceIn">
                                            🏢 Business Information
                                        </span>
                                    )}
                                </div>

                                {showAdditionalDetails && (
                                    <div className="mt-6 space-y-4 animate__animated animate__slideInDown">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Company Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="companyName"
                                                    value={formData.companyName}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                                                    placeholder="Company name (optional)"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    GST Number
                                                </label>
                                                <input
                                                    type="text"
                                                    name="gstNumber"
                                                    value={formData.gstNumber}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                                                    placeholder="15-digit GST (optional)"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Alternate Phone
                                            </label>
                                            <input
                                                type="tel"
                                                name="alternatePhone"
                                                value={formData.alternatePhone}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                                                pattern="[0-9]{10}"
                                                placeholder="Alternate phone (optional)"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Default Address Setting */}
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200 animate__animated animate__fadeIn animate__delay-3s">
                                <label className="flex items-center justify-between cursor-pointer">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center">
                                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">Set as default address</span>
                                            <p className="text-sm text-gray-500">This address will be selected by default for future orders</p>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            id="isDefault"
                                            name="isDefault"
                                            checked={formData.isDefault}
                                            onChange={handleChange}
                                            className="sr-only"
                                        />
                                        <div className={`w-14 h-7 rounded-full transition-all duration-300 ${formData.isDefault ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gray-300'}`}>
                                            <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all duration-300 transform ${formData.isDefault ? 'left-8' : 'left-1'}`}></div>
                                        </div>
                                    </div>
                                </label>
                            </div>

                            {/* Form Actions */}
                            <div className="flex justify-between space-x-4 pt-4 animate__animated animate__fadeInUp">
                                <button
                                    type="button"
                                    onClick={handleBackToList}
                                    className="px-8 py-3 rounded-lg font-medium bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
                                >
                                    ← Back to List
                                </button>
                                <button
                                    type="submit"
                                    className="px-8 py-3 rounded-lg font-medium bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 animate__animated animate__pulse animate__infinite animate__slow"
                                >
                                    {currentAddress ? (
                                        <>
                                            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            Update Address
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                            </svg>
                                            Save Address
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </Modal.Body>
            </div>
        </Modal>
    );
};

export default AddressModal;