import React from 'react';
import { Badge } from 'react-bootstrap';
import './AddressView.css';

const AddressView = ({
    address,
    showActions = false,
    onEdit = null,
    onDelete = null,
    variant = 'default', // 'default', 'compact', 'card', 'minimal'
    className = ''
}) => {
    if (!address) return null;

    const renderActions = () => {
        if (!showActions || (!onEdit && !onDelete)) return null;

        return (
            <div className="address-view-actions">
                {onEdit && (
                    <button
                        className="address-action-btn edit-btn"
                        onClick={() => onEdit(address)}
                        aria-label="Edit address"
                    >
                        Edit
                    </button>
                )}
                {onDelete && !address.isDefault && (
                    <button
                        className="address-action-btn delete-btn"
                        onClick={() => onDelete(address.id)}
                        aria-label="Delete address"
                    >
                        Delete
                    </button>
                )}
            </div>
        );
    };

    const renderHeader = () => {
        if (variant === 'minimal') return null;

        return (
            <div className="address-view-header">
                <div className="address-view-name-section">
                    <h5 className="address-view-name">{address.name}</h5>
                    {address.isDefault && (
                        <Badge bg="success" className="address-default-badge">
                            Default
                        </Badge>
                    )}
                </div>
                {variant !== 'compact' && (
                    <p className="address-view-phone">{address.phone}</p>
                )}
            </div>
        );
    };

    const renderAddressLines = () => {
        const lines = [
            address.addressLine,
            [address.locality, address.city].filter(Boolean).join(', '),
            `${address.state} - ${address.pincode}`,
            address.country || 'India'
        ].filter(Boolean);

        if (address.landmark) {
            lines.push(`Landmark: ${address.landmark}`);
        }

        return (
            <div className="address-view-content">
                {variant === 'compact' && (
                    <span className="address-view-phone-compact">{address.phone} • </span>
                )}
                {lines.map((line, index) => (
                    <p
                        key={index}
                        className={`address-line ${index === lines.length - 1 && address.landmark ? 'landmark-line' : ''}`}
                    >
                        {line}
                    </p>
                ))}
            </div>
        );
    };

    return (
        <div className={`address-view address-view-${variant} ${className}`}>
            {renderHeader()}
            {renderAddressLines()}
            {renderActions()}
        </div>
    );
};

export default AddressView;