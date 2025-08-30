import React, { useState, useEffect } from 'react';
import { useAddressesByCustomer, useCreateAddress, useUpdateAddress, useAddressById, useDeleteAddress } from '../../../../hook/address/useAddress';
import { toast } from "react-toastify";
import './ReturnOrderFlow.css';

const mockItem = {
    imagePath: 'https://images.pexels.com/photos/6387626/pexels-photo-6387626.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
    name: 'Sample Product',
    price: 999,
    size: 'M',
    color: 'Blue',
    orderId: '#123456',
    orderDate: '2023-05-15'
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
        customerId, name: '', phone: '', pincode: '', locality: '', addressLine: '',
        city: '', state: '', landmark: '', alternatePhone: '', isDefault: false,
        gstNumber: '', companyName: '',
    });

    const { data: addresses, isLoading: addressesLoading } = useAddressesByCustomer(customerId);
    const createAddressMutation = useCreateAddress();
    const updateAddressMutation = useUpdateAddress();
    const deleteAddressMutation = useDeleteAddress();
    const { data: editAddress } = useAddressById(isEdit ? selectedAddressId : null);

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
            city: '', state: '', landmark: '', alternatePhone: '', isDefault: false, gstNumber: '', companyName: ''
        });
        setFormErrors({});
        setShowModal(true);
    };

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormAddress({ ...formAddress, [name]: type === 'checkbox' ? checked : value });
        setFormErrors({ ...formErrors, [name]: '' });
    };

    const validateAddressForm = () => {
        const errors = {};
        if (!formAddress.name) errors.name = 'Name is required';
        if (!formAddress.phone) errors.phone = 'Phone is required';
        else if (!/^[0-9]{10}$/.test(formAddress.phone)) errors.phone = 'Phone must be 10 digits';
        if (!formAddress.pincode) errors.pincode = 'Pincode is required';
        else if (!/^[0-9]{6}$/.test(formAddress.pincode)) errors.pincode = 'Pincode must be 6 digits';
        if (!formAddress.locality) errors.locality = 'Locality is required';
        if (!formAddress.addressLine) errors.addressLine = 'Address Line is required';
        if (!formAddress.city) errors.city = 'City is required';
        if (!formAddress.state) errors.state = 'State is required';
        if (!formAddress.landmark) errors.landmark = 'Landmark is required';
        if (formAddress.isDefault === null) errors.isDefault = 'Default flag is required';
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
                toast.success(`Address ${isEdit ? 'updated' : 'created'} successfully`);
                setShowModal(false);
            },
        });
    };

    const handleDeleteAddress = (id) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            deleteAddressMutation.mutate(id);
        }
    };

    const validateStep = (step) => {
        switch (step) {
            case 1: return reason && comments.length >= 5;
            case 2: return selectedAddressId;
            case 3: return returnAction;
            case 4: return returnAction === 'Exchange' || refundMode;
            default: return false;
        }
    };

    const handleNext = () => validateStep(activeStep) ? setActiveStep(activeStep + 1) : toast.error('Please complete the current step');
    const handlePrev = () => activeStep > 1 && setActiveStep(activeStep - 1);
    const handleConfirm = () => validateStep(4) ? toast.success('Return confirmed!') : toast.error('Please select refund mode if applicable');

    const getStepClass = (step) => step === activeStep ? 'return-flow__step--active' : step < activeStep ? 'return-flow__step--completed' : '';

    return (
        <div className="return-flow">
            <div className="return-flow__container">
                <h2 className="return-flow__title">Return Order</h2>

                <div className="return-flow__content">
                    <div className="return-flow__main">
                        <ol className="return-flow__progress">
                            {['Reason', 'Address', 'Action', 'Confirm'].map((label, idx) => (
                                <li key={idx} className={`return-flow__progress-step ${getStepClass(idx + 1)}`}>
                                    <span className="return-flow__step-number">{idx + 1}</span>
                                    <span className="return-flow__step-label">{label}</span>
                                </li>
                            ))}
                        </ol>

                        <div className="return-flow__steps">
                            {activeStep === 1 && (
                                <div className="return-flow__step-card">
                                    <h4 className="return-flow__step-title">Reason for Return</h4>
                                    <div className="return-flow__options">
                                        {['Damaged', 'Wrong Item', 'Not as Expected', 'Don’t want anymore'].map((opt) => (
                                            <label key={opt} className="return-flow__option">
                                                <input
                                                    type="radio"
                                                    name="reason"
                                                    checked={reason === opt}
                                                    onChange={() => setReason(opt)}
                                                />
                                                <span className="return-flow__option-label">{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <div className="return-flow__field">
                                        <label className="return-flow__field-label">Comments (min 5 characters)</label>
                                        <textarea
                                            rows="3"
                                            value={comments}
                                            onChange={(e) => setComments(e.target.value)}
                                            className="return-flow__textarea"
                                        />
                                    </div>
                                </div>
                            )}

                            {activeStep === 2 && (
                                <div className="return-flow__step-card">
                                    <h4 className="return-flow__step-title">Pickup Address</h4>
                                    {addressesLoading ? (
                                        <p className="return-flow__loading">Loading addresses...</p>
                                    ) : (
                                        <>
                                            <div className="return-flow__address-list" >
                                                {addresses?.map((addr) => (
                                                    <div key={addr.id} className={`return-flow__address-item ${selectedAddressId === addr.id ? 'return-flow__address-item--selected' : ''}`} onClick={() => setSelectedAddressId(addr.id)}>
                                                        <label className="return-flow__option">
                                                            <input
                                                                type="radio"
                                                                checked={selectedAddressId === addr.id}
                                                                onChange={() => setSelectedAddressId(addr.id)}
                                                            />
                                                            <span className="return-flow__option-label" />
                                                        </label>
                                                        <div className="return-flow__address-details" >
                                                            <p><strong>{addr.name}</strong></p>
                                                            <p>{addr.addressLine}, {addr.locality}</p>
                                                            <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                                                            {addr.isDefault && <span className="return-flow__default-tag">Default</span>}
                                                        </div>
                                                        <div className="return-flow__address-actions">
                                                            <button onClick={() => handleShowModal(true, addr.id)} className="return-flow__action-btn">Edit</button>
                                                            <button onClick={() => handleDeleteAddress(addr.id)} className="return-flow__action-btn return-flow__action-btn--delete">Delete</button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <button onClick={() => handleShowModal(false)} className="return-flow__add-btn">Add New Address</button>
                                        </>
                                    )}
                                </div>
                            )}

                            {activeStep === 3 && (
                                <div className="return-flow__step-card">
                                    <h4 className="return-flow__step-title">Return Action</h4>
                                    <div className="return-flow__options">
                                        {['Refund', 'Exchange'].map((opt) => (
                                            <label key={opt} className="return-flow__option">
                                                <input
                                                    type="radio"
                                                    name="returnAction"
                                                    checked={returnAction === opt}
                                                    onChange={() => setReturnAction(opt)}
                                                />
                                                <span className="return-flow__option-label">{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeStep === 4 && (
                                <div className="return-flow__step-card">
                                    <h4 className="return-flow__step-title">Confirm Return</h4>
                                    {returnAction === 'Refund' && (
                                        <div className="return-flow__options">
                                            <p className="return-flow__field-label">Refund Mode:</p>
                                            {['Gift Card Wallet', 'Original Payment Mode'].map((opt) => (
                                                <label key={opt} className="return-flow__option">
                                                    <input
                                                        type="radio"
                                                        name="refundMode"
                                                        checked={refundMode === opt}
                                                        onChange={() => setRefundMode(opt)}
                                                    />
                                                    <span className="return-flow__option-label">{opt}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                    <button
                                        onClick={handleConfirm}
                                        disabled={!validateStep(4)}
                                        className="return-flow__confirm-btn"
                                    >
                                        Confirm Return
                                    </button>
                                </div>
                            )}

                            <div className="return-flow__navigation">
                                {activeStep > 1 && (
                                    <button onClick={handlePrev} className="return-flow__nav-btn return-flow__nav-btn--secondary">Previous</button>
                                )}
                                {activeStep < 4 && (
                                    <button
                                        onClick={handleNext}
                                        disabled={!validateStep(activeStep)}
                                        className="return-flow__nav-btn return-flow__nav-btn--primary"
                                    >
                                        Next
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="return-flow__sidebar">
                        <div className="return-flow__product-card">
                            <h4 className="return-flow__product-title">Product Details</h4>
                            <div className="return-flow__product-content">
                                
                                <div className="return-flow__product-info">
                                    <h5 className="return-flow__product-name">{mockItem.name}</h5>
                                    <p className="return-flow__product-price">₹ {mockItem.price.toFixed(2)}</p>
                                
                                </div>
                                <img src={mockItem.imagePath} alt={mockItem.name} className="return-flow__product-image" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="return-flow__modal">
                    <div className="return-flow__modal-content">
                        <div className="return-flow__modal-header">
                            <h3>{isEdit ? 'Edit Address' : 'Add New Address'}</h3>
                            <button onClick={() => setShowModal(false)} className="return-flow__modal-close">×</button>
                        </div>
                        <div className="return-flow__modal-body">
                            {[
                                { name: 'name', label: 'Name *', type: 'text', required: true },
                                { name: 'phone', label: 'Phone (10 digits) *', type: 'text', required: true },
                                { name: 'pincode', label: 'Pincode (6 digits) *', type: 'text', required: true },
                                { name: 'locality', label: 'Locality *', type: 'text', required: true },
                                { name: 'addressLine', label: 'Address Line *', type: 'text', required: true },
                                { name: 'city', label: 'City *', type: 'text', required: true },
                                { name: 'state', label: 'State *', type: 'text', required: true },
                                { name: 'landmark', label: 'Landmark *', type: 'text', required: true },
                                { name: 'alternatePhone', label: 'Alternate Phone', type: 'text' },
                                { name: 'gstNumber', label: 'GST Number', type: 'text' },
                                { name: 'companyName', label: 'Company Name', type: 'text' },
                            ].map(({ name, label, type, required }) => (
                                <div key={name} className="return-flow__form-field">
                                    <label className="return-flow__form-label">{label}</label>
                                    <input
                                        type={type}
                                        name={name}
                                        value={formAddress[name]}
                                        onChange={handleFormChange}
                                        className={`return-flow__form-input ${formErrors[name] ? 'return-flow__form-input--error' : ''}`}
                                    />
                                    {formErrors[name] && <p className="return-flow__form-error">{formErrors[name]}</p>}
                                </div>
                            ))}
                            <label className="return-flow__checkbox">
                                <input
                                    type="checkbox"
                                    name="isDefault"
                                    checked={formAddress.isDefault}
                                    onChange={handleFormChange}
                                />
                                <span className="return-flow__checkbox-label">Set as Default Address *</span>
                                {formErrors.isDefault && <p className="return-flow__form-error">{formErrors.isDefault}</p>}
                            </label>
                        </div>
                        <div className="return-flow__modal-footer">
                            <button onClick={() => setShowModal(false)} className="return-flow__btn return-flow__btn--secondary">Close</button>
                            <button onClick={handleSubmitAddress} className="return-flow__btn return-flow__btn--primary">Save Address</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReturnOrderFlow;