import React, { useState, useEffect } from 'react';
import { useAddressesByCustomer, useCreateAddress, useUpdateAddress, useAddressById, useDeleteAddress } from '../../../../hook/address/useAddress';
import { toast } from "react-toastify";
import './ReturnOrderFlow.css';
import Header from '../../../layouts/HeaderWithAuth';
import { ChevronDown, ChevronUp } from "lucide-react";

const mockItem = {
    imagePath: 'https://images.pexels.com/photos/6387626/pexels-photo-6387626.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
    name: 'Premium Cotton T-Shirt',
    price: 2499.99,
    size: 'M',
    color: 'Navy Blue',
    orderId: '#ORD-789456',
    orderDate: '2024-01-15'
};

const user = JSON.parse(localStorage.getItem('user'));
const customerId = user?.id;

const ReturnOrderFlow = () => {
    const [activeStep, setActiveStep] = useState(1);
    const [reason, setReason] = useState('');
    const [comments, setComments] = useState('');
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [returnAction, setReturnAction] = useState('');
    const [refundMode, setRefundMode] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const [formAddress, setFormAddress] = useState({
        customerId,
        name: '',
        phone: '',
        pincode: '',
        locality: '',
        addressLine: '',
        city: '',
        state: '',
        landmark: '',
        alternatePhone: '',
        isDefault: false,
        gstNumber: '',
        companyName: '',
    });

    const { data: addresses, isLoading: addressesLoading } = useAddressesByCustomer(customerId);
    const createAddressMutation = useCreateAddress();
    const updateAddressMutation = useUpdateAddress();
    const deleteAddressMutation = useDeleteAddress();
    const { data: editAddress } = useAddressById(isEdit ? selectedAddressId : null);
    const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

    // Calculate total items (you can modify this based on your actual data)
    const totalItems = 1; // Since we have one mock item, adjust as needed

    useEffect(() => {
        if (isEdit && editAddress) {
            setFormAddress({ customerId, ...editAddress });
        }
    }, [editAddress, isEdit, customerId]);

    const handleShowModal = (edit = false, id = null) => {
        setIsEdit(edit);
        if (edit) setSelectedAddressId(id);
        else setFormAddress({
            customerId, name: '', phone: '', pincode: '', locality: '', addressLine: '',
            city: '', state: '', landmark: '', alternatePhone: '', isDefault: false,
            gstNumber: '', companyName: ''
        });
        setFormErrors({});
        setShowModal(true);
    };

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormAddress({
            ...formAddress,
            [name]: type === 'checkbox' ? checked : value
        });
        setFormErrors({ ...formErrors, [name]: '' });
    };

    const validateAddressForm = () => {
        const errors = {};
        if (!formAddress.name.trim()) errors.name = 'Full name is required';
        if (!formAddress.phone) errors.phone = 'Phone number is required';
        else if (!/^[0-9]{10}$/.test(formAddress.phone)) errors.phone = 'Enter a valid 10-digit phone number';
        if (!formAddress.pincode) errors.pincode = 'Pincode is required';
        else if (!/^[0-9]{6}$/.test(formAddress.pincode)) errors.pincode = 'Enter a valid 6-digit pincode';
        if (!formAddress.locality.trim()) errors.locality = 'Locality is required';
        if (!formAddress.addressLine.trim()) errors.addressLine = 'Address line is required';
        if (!formAddress.city.trim()) errors.city = 'City is required';
        if (!formAddress.state.trim()) errors.state = 'State is required';
        if (!formAddress.landmark.trim()) errors.landmark = 'Landmark is required';
        return errors;
    };

    const handleSubmitAddress = () => {
        const errors = validateAddressForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        const mutation = isEdit ? updateAddressMutation : createAddressMutation;
        mutation.mutate(isEdit ? { id: selectedAddressId, address: formAddress } : formAddress, {
            onSuccess: () => {
                toast.success(`Address ${isEdit ? 'updated' : 'added'} successfully`);
                setShowModal(false);
            },
            onError: () => {
                toast.error(`Failed to ${isEdit ? 'update' : 'create'} address`);
            }
        });
    };

    const handleDeleteAddress = (id) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            deleteAddressMutation.mutate(id, {
                onSuccess: () => {
                    toast.success('Address deleted successfully');
                },
                onError: () => {
                    toast.error('Failed to delete address');
                }
            });
        }
    };

    const validateStep = (step) => {
        switch (step) {
            case 1: return reason && comments.length >= 15;
            case 2: return selectedAddressId;
            case 3: return returnAction;
            case 4: return returnAction === 'Exchange' || refundMode;
            default: return false;
        }
    };

    const handleNext = () => {
        if (validateStep(activeStep)) {
            setActiveStep(activeStep + 1);
        } else {
            toast.error('Please complete all required fields to continue');
        }
    };

    const handlePrev = () => activeStep > 1 && setActiveStep(activeStep - 1);

    const handleConfirm = () => {
        if (validateStep(4)) {
            toast.success('Return request submitted successfully!');
            // Here you would typically make an API call to submit the return
        } else {
            toast.error('Please complete all required fields');
        }
    };

    const getStepSegmentClass = (step) => {
        if (step < activeStep) return 'return-flow__progress-segment--completed';
        if (step === activeStep) return 'return-flow__progress-segment--active';
        return '';
    };

    const getStepLabelClass = (step) => {
        if (step < activeStep) return 'return-flow__progress-label--completed';
        if (step === activeStep) return 'return-flow__progress-label--active';
        return '';
    };
    const getStepConnectorClass = (step) => {
        if (step < activeStep) return 'return-flow__progress-connector--completed';
        return '';
    };

    return (
        <> 
        <Header />
        <div className="return-flow">
            <div className="return-flow__container">
                <header className="return-flow__header">
                    <h1 className="return-flow__title">Initiate Return</h1>
                    <p className="return-flow__subtitle">Process your return in a few simple steps</p>
                </header>

                <div className="return-flow__content">
                    <main className="return-flow__main">
                        {/* Progress Indicator */}
                        <div className="return-flow__progress-container">
                            <div className="return-flow__progress-track">
                                {[1, 2, 3, 4].map((step) => (
                                    <React.Fragment key={step}>
                                        <div className={`return-flow__progress-segment ${getStepSegmentClass(step)}`}>
                                            <div className="return-flow__progress-dot">
                                                {step < activeStep ? (
                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                                        <path d="M13.78 4.28L6 12.06l-3.78-3.78-1.06 1.06L6 14.18l8.84-8.84-1.06-1.06z" />
                                                    </svg>
                                                ) : step === activeStep ? (
                                                    <div className="return-flow__progress-active"></div>
                                                ) : null}
                                            </div>
                                        </div>
                                        {step < 4 && (
                                            <div className={`return-flow__progress-connector ${getStepConnectorClass(step)}`}></div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                            <div className="return-flow__progress-labels">
                                {['Return Reason', 'Pickup Address', 'Return Action', 'Confirmation'].map((label, idx) => (
                                    <div key={idx} className="return-flow__progress-label-container">
                                        <span className={`return-flow__progress-label ${getStepLabelClass(idx + 1)}`}>
                                            {label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Steps Content */}
                        <div className="return-flow__steps">
                            {/* Step 1: Reason for Return */}
                            {activeStep === 1 && (
                                <section className="return-flow__step-card">
                                    <div className="return-flow__step-header">
                                        <div className="return-flow__step-indicator">Step 1 of 4</div>
                                        <h2 className="return-flow__step-title">Reason for Return</h2>
                                        <p className="return-flow__step-description">
                                            Please tell us why you're returning this item
                                        </p>
                                    </div>

                                    <div className="return-flow__options-grid">
                                        {[
                                            { value: 'Damaged', label: 'Item Damaged', description: 'Product arrived damaged or defective' },
                                            { value: 'Wrong Item', label: 'Wrong Item', description: 'Received different product than ordered' },
                                            { value: 'Not as Expected', label: 'Not as Described', description: 'Product doesn\'t match description' },
                                            { value: 'Don\'t want anymore', label: 'No Longer Needed', description: 'Changed my mind about the purchase' }
                                        ].map((opt) => (
                                            <label key={opt.value} className="return-flow__option-card">
                                                <input
                                                    type="radio"
                                                    name="reason"
                                                    value={opt.value}
                                                    checked={reason === opt.value}
                                                    onChange={(e) => setReason(e.target.value)}
                                                    className="return-flow__option-input"
                                                />
                                                <div className="return-flow__option-content">
                                                    <div className="return-flow__option-check"></div>
                                                    <div className="return-flow__option-text">
                                                        <span className="return-flow__option-label">{opt.label}</span>
                                                        {/* <span className="return-flow__option-description">{opt.description}</span> */}
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>

                                    <div className="return-flow__field">
                                        <label className="return-flow__field-label">
                                            Additional Comments
                                            <span className="return-flow__field-required">*</span>
                                        </label>
                                        <p className="return-flow__field-hint">
                                            Please provide specific details about your return reason (minimum 5 characters)
                                        </p>
                                        <textarea
                                            rows={4}
                                            value={comments}
                                            onChange={(e) => setComments(e.target.value)}
                                            className="return-flow__textarea"
                                            placeholder="Example: The item arrived with visible scratches on the surface and the packaging was torn..."
                                        />
                                        <div className="return-flow__character-count">
                                            <span className={comments.length >= 15 ? 'return-flow__character-count--valid' : ''}>
                                                {comments.length}
                                            </span>
                                            /15 characters minimum
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* Step 2: Pickup Address */}
                            {activeStep === 2 && (
                                <section className="return-flow__step-card">
                                    <div className="return-flow__step-header">
                                        <div className="return-flow__step-indicator">Step 2 of 4</div>
                                        <h2 className="return-flow__step-title">Pickup Address</h2>
                                        <p className="return-flow__step-description">
                                            Where should we pick up the return item from?
                                        </p>
                                    </div>

                                    {addressesLoading ? (
                                        <div className="return-flow__loading-state">
                                            <div className="return-flow__loading-spinner"></div>
                                            <p>Loading your addresses...</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="return-flow__address-list">
                                                {addresses?.length > 0 ? addresses.map((addr) => (
                                                    <div
                                                        key={addr.id}
                                                        className={`return-flow__address-card ${selectedAddressId === addr.id ? 'return-flow__address-card--selected' : ''}`}
                                                        onClick={() => setSelectedAddressId(addr.id)}
                                                    >
                                                        <div className="return-flow__address-main">
                                                            <div className="return-flow__address-radio">
                                                                <input
                                                                    type="radio"
                                                                    name="address"
                                                                    checked={selectedAddressId === addr.id}
                                                                    onChange={() => setSelectedAddressId(addr.id)}
                                                                />
                                                            </div>
                                                            <div className="return-flow__address-details">
                                                                <div className="return-flow__address-header">
                                                                    <h4 className="return-flow__address-name">{addr.name}</h4>
                                                                    {addr.isDefault && (
                                                                        <span className="return-flow__default-badge">Default</span>
                                                                    )}
                                                                </div>
                                                                <p className="return-flow__address-text">{addr.addressLine}</p>
                                                                <p className="return-flow__address-text">{addr.locality}, {addr.city}</p>
                                                                <p className="return-flow__address-text">{addr.state} - {addr.pincode}</p>
                                                                {addr.landmark && (
                                                                    <p className="return-flow__address-text">Landmark: {addr.landmark}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="return-flow__address-actions">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleShowModal(true, addr.id);
                                                                }}
                                                                className="return-flow__action-btn return-flow__action-btn--edit"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDeleteAddress(addr.id);
                                                                }}
                                                                className="return-flow__action-btn return-flow__action-btn--delete"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                )) : (
                                                    <div className="return-flow__empty-state">
                                                        <p>No addresses found. Please add an address to continue.</p>
                                                    </div>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => handleShowModal(false)}
                                                className="return-flow__add-address-btn"
                                            >
                                                <span className="return-flow__add-icon">+</span>
                                                Add New Address
                                            </button>
                                        </>
                                    )}
                                </section>
                            )}

                            {/* Step 3: Return Action */}
                            {activeStep === 3 && (
                                <section className="return-flow__step-card">
                                    <div className="return-flow__step-header">
                                        <div className="return-flow__step-indicator">Step 3 of 4</div>
                                        <h2 className="return-flow__step-title">Return Action</h2>
                                        <p className="return-flow__step-description">
                                            Choose how you'd like to proceed with your return
                                        </p>
                                    </div>

                                    <div className="return-flow__action-cards">
                                        {[
                                            {
                                                value: 'Refund',
                                                label: 'Refund',
                                                icon: '💳',
                                                description: 'Get your money back via your preferred method',
                                                details: 'Full refund processed within 5-7 business days'
                                            },
                                            {
                                                value: 'Exchange',
                                                label: 'Exchange',
                                                icon: '🔄',
                                                description: 'Exchange this item for a different product',
                                                details: 'Same product in different size/color or different product'
                                            }
                                        ].map((opt) => (
                                            <label key={opt.value} className="return-flow__action-card">
                                                <input
                                                    type="radio"
                                                    name="returnAction"
                                                    value={opt.value}
                                                    checked={returnAction === opt.value}
                                                    onChange={(e) => setReturnAction(e.target.value)}
                                                    className="return-flow__action-input"
                                                />
                                                <div className="return-flow__action-content">
                                                    <div className="return-flow__action-icon">{opt.icon}</div>
                                                    <div className="return-flow__action-info">
                                                        <span className="return-flow__action-label">{opt.label}</span>
                                                        <span className="return-flow__action-description">{opt.description}</span>
                                                        <span className="return-flow__action-details">{opt.details}</span>
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Step 4: Confirm Return */}
                            {activeStep === 4 && (
                                <section className="return-flow__step-card">
                                    <div className="return-flow__step-header">
                                        <div className="return-flow__step-indicator">Step 4 of 4</div>
                                        <h2 className="return-flow__step-title">Confirm Return</h2>
                                        <p className="return-flow__step-description">
                                            Review your return details and submit your request
                                        </p>
                                    </div>

                                    {returnAction === 'Refund' && (
                                        <div className="return-flow__refund-section">
                                            <h3 className="return-flow__section-label">Refund Method</h3>
                                            <div className="return-flow__refund-options">
                                                {[
                                                    { value: 'Gift Card Wallet', label: 'Gift Card Wallet', description: 'Instant store credit' },
                                                    { value: 'Original Payment Mode', label: 'Original Payment Method', description: 'Refund to original payment source' }
                                                ].map((opt) => (
                                                    <label key={opt.value} className="return-flow__refund-option">
                                                        <input
                                                            type="radio"
                                                            name="refundMode"
                                                            value={opt.value}
                                                            checked={refundMode === opt.value}
                                                            onChange={(e) => setRefundMode(e.target.value)}
                                                            className="return-flow__finalStep-option-input"

                                                        />
                                                        <div className="return-flow__refund-option-content">
                                                            <span className="return-flow__refund-option-label">{opt.label}</span>
                                                            <span className="return-flow__refund-option-description">{opt.description}</span>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="return-flow__confirmation-section">
                                        <h3 className="return-flow__section-label">Return Summary</h3>
                                        <div className="return-flow__summary-list">
                                            <div className="return-flow__summary-item">
                                                <span>Return Reason:</span>
                                                <span>{reason}</span>
                                            </div>
                                            <div className="return-flow__summary-item">
                                                <span>Action:</span>
                                                <span>{returnAction}</span>
                                            </div>
                                            {returnAction === 'Refund' && refundMode && (
                                                <div className="return-flow__summary-item">
                                                    <span>Refund Method:</span>
                                                    <span>{refundMode}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleConfirm}
                                        disabled={!validateStep(4)}
                                        className="return-flow__confirm-btn"
                                    >
                                        Submit Return Request
                                    </button>
                                </section>
                            )}

                            {/* Navigation */}
                            <nav className="return-flow__navigation">
                                <div className="return-flow__navigation-inner">
                                    {activeStep > 1 && (
                                        <button
                                            onClick={handlePrev}
                                            className="return-flow__nav-btn return-flow__nav-btn--secondary"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                                <path d="M10 12l-4-4 4-4" />
                                            </svg>
                                            Previous
                                        </button>
                                    )}
                                    {activeStep < 4 && (
                                        <button
                                            onClick={handleNext}
                                            disabled={!validateStep(activeStep)}
                                            className="return-flow__nav-btn return-flow__nav-btn--primary"
                                        >
                                            Continue
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                                <path d="M6 12l4-4-4-4" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </nav>
                        </div>
                    </main>

                    {/* Sidebar */}
                    <aside className="return-flow__sidebar">
                            <div className={`return-flow__summary-card ${isSummaryExpanded ? 'return-flow__summary-card--expanded' : ''}`}>
                                <div
                                    className="return-flow__summary-header"
                                    onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
                                >
                                    <div className="return-flow__summary-header-content">
                                        <h3 className="return-flow__summary-title">Order Summary</h3>
                                        <div className="return-flow__summary-badge">
                                            {totalItems} {totalItems === 1 ? 'item' : 'items'}
                                        </div>
                                    </div>
                                    <div className="return-flow__summary-toggle">
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            className={`return-flow__toggle-icon ${isSummaryExpanded ? 'return-flow__toggle-icon--expanded' : ''}`}
                                        >
                                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                        </svg>
                                    </div>
                                </div>

                                <div className="return-flow__summary-content">
                                    <div className="return-flow__product-summary">
                                        <img
                                            src={mockItem.imagePath}
                                            alt={mockItem.name}
                                            className="return-flow__product-image"
                                        />
                                        <div className="return-flow__product-details">
                                            <h4 className="return-flow__product-name">{mockItem.name}</h4>
                                            <p className="return-flow__product-price">₹{mockItem.price.toFixed(2)}</p>
                                            <div className="return-flow__product-meta">
                                                <span>Size: {mockItem.size}</span>
                                                <span>Color: {mockItem.color}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="return-flow__order-details">
                                        <div className="return-flow__order-item">
                                            <span>Order ID:</span>
                                            <span>{mockItem.orderId}</span>
                                        </div>
                                        <div className="return-flow__order-item">
                                            <span>Order Date:</span>
                                            <span>{mockItem.orderDate}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    </aside>
                </div>
            </div>

            {/* Address Modal */}
            {showModal && (
                <div className="return-flow__modal">
                    <div className="return-flow__modal-content">
                        <div className="return-flow__modal-header">
                            <h3>{isEdit ? 'Edit Address' : 'Add New Address'}</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="return-flow__modal-close"
                                aria-label="Close modal"
                            >
                                ×
                            </button>
                        </div>
                        <div className="return-flow__modal-body">
                            <div className="return-flow__form-grid">
                                {[
                                    { name: 'name', label: 'Full Name *', type: 'text', placeholder: 'Enter your full name' },
                                    { name: 'phone', label: 'Phone Number *', type: 'tel', placeholder: '10-digit mobile number' },
                                    { name: 'pincode', label: 'Pincode *', type: 'text', placeholder: '6-digit pincode' },
                                    { name: 'locality', label: 'Locality *', type: 'text', placeholder: 'Area/Locality' },
                                    { name: 'addressLine', label: 'Address Line *', type: 'text', placeholder: 'House/Flat number, Street' },
                                    { name: 'city', label: 'City *', type: 'text', placeholder: 'City' },
                                    { name: 'state', label: 'State *', type: 'text', placeholder: 'State' },
                                    { name: 'landmark', label: 'Landmark *', type: 'text', placeholder: 'Nearby landmark' },
                                    { name: 'alternatePhone', label: 'Alternate Phone', type: 'tel', placeholder: 'Optional alternate number' },
                                    { name: 'companyName', label: 'Company Name', type: 'text', placeholder: 'Optional' },
                                    { name: 'gstNumber', label: 'GST Number', type: 'text', placeholder: 'Optional' },
                                ].map(({ name, label, type, placeholder }) => (
                                    <div key={name} className="return-flow__form-field">
                                        <label className="return-flow__form-label">{label}</label>
                                        <input
                                            type={type}
                                            name={name}
                                            value={formAddress[name]}
                                            onChange={handleFormChange}
                                            placeholder={placeholder}
                                            className={`return-flow__form-input ${formErrors[name] ? 'return-flow__form-input--error' : ''}`}
                                        />
                                        {formErrors[name] && (
                                            <p className="return-flow__form-error">{formErrors[name]}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <label className="return-flow__checkbox">
                                <input
                                    type="checkbox"
                                    name="isDefault"
                                    checked={formAddress.isDefault}
                                    onChange={handleFormChange}
                                />
                                <span className="return-flow__checkbox-label">Set as default address</span>
                            </label>
                        </div>
                        <div className="return-flow__modal-footer">
                            <button
                                onClick={() => setShowModal(false)}
                                className="return-flow__btn return-flow__btn--secondary"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitAddress}
                                disabled={createAddressMutation.isLoading || updateAddressMutation.isLoading}
                                className="return-flow__btn return-flow__btn--primary"
                            >
                                {createAddressMutation.isLoading || updateAddressMutation.isLoading ? (
                                    <>
                                        <div className="return-flow__btn-spinner"></div>
                                        Saving...
                                    </>
                                ) : (
                                    'Save Address'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </>
    );
};

export default ReturnOrderFlow;