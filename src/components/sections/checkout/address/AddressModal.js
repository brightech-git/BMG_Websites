import React, { useEffect } from 'react';
import './AddressModal.css';

const AddressModal = ({
    addresses,
    selectedAddress,
    onSelectAddress,
    onClose,
    onAddNew
}) => {
    // Prevent clicks inside the modal from closing it
    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    // Close modal on Escape key press
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                console.log('AddressModal: Escape key pressed, closing modal');
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        <div className="address-modal-overlay" onClick={onClose}>
            <div className="address-modal" onClick={handleModalClick}>
                <div className="address-modal-header">
                    <h3>Select Delivery Address</h3>
                    <button
                        className="close-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                        aria-label="Close modal"
                    >
                        ×
                    </button>
                </div>
                <div className="address-list">
                    {addresses && addresses.length > 0 ? (
                        addresses.map(address => (
                            <div
                                key={address.id}
                                className={`address-item ${selectedAddress === address.id ? 'selected' : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('AddressModal: Selected address ID:', address.id);
                                    onSelectAddress(address.id);
                                }}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        onSelectAddress(address.id);
                                    }
                                }}
                            >
                                <div className="address-details">
                                    <p>
                                        <strong>{address.name}</strong> - {address.phone}
                                    </p>
                                    <p>{address.addressLine}</p>
                                    <p>
                                        {address.locality}, {address.landmark}
                                    </p>
                                    <p>
                                        {address.city}, {address.state} - {address.pincode}
                                    </p>
                                    {address.alternatePhone && <p>Alternate: {address.alternatePhone}</p>}
                                    {address.isDefault && <span className="default-badge">Default</span>}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No addresses available</p>
                    )}
                </div>
                <div className="address-modal-footer">
                    <button
                        className="main-btn btn-filled"
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log('AddressModal: Add New Address clicked');
                            onAddNew();
                        }}
                    >
                        + Add New Address
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddressModal;