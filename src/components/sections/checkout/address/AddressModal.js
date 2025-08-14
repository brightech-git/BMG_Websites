import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import "./AddressModal.css";

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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAddNew = () => {
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
    };

    const handleEdit = (address) => {
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
        setMode("list");
    };

    const handleDelete = (addressId) => {
        if (window.confirm("Are you sure you want to delete this address?")) {
            onDeleteAddress(addressId);
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered className="address-modal">
            <Modal.Header closeButton className="address-modal-header">
                <Modal.Title className="address-modal-title">
                    {mode === "list" ? "Select Delivery Address" :
                        mode === "add" ? "Add New Address" : "Edit Address"}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="address-modal-body">
                {mode === "list" ? (
                    <div className="address-list-container">
                        {addresses.map(address => (
                            <div
                                key={address.id}
                                className={`address-card ${selectedAddress?.id === address.id ? 'selected' : ''}`}
                            >
                                <div className="address-card-content">
                                    <div className="address-card-header">
                                        <h5 className="address-name">{address.name}</h5>
                                        {address.isDefault && (
                                            <span className="default-badge">Default</span>
                                        )}
                                    </div>
                                    <div className="address-info">
                                        <p className="phone-number">{address.phone}</p>
                                        <p className="address-line">{address.addressLine}</p>
                                        <p className="address-location">
                                            {address.locality}, {address.city}, {address.state} - {address.pincode}
                                        </p>
                                        {address.landmark && (
                                            <p className="landmark">Near: {address.landmark}</p>
                                        )}
                                        {address.companyName && (
                                            <p className="company-info">{address.companyName}</p>
                                        )}
                                    </div>
                                    <div className="address-card-actions">
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            className="action-btn edit-btn"
                                            onClick={() => handleEdit(address)}
                                        >
                                            Edit
                                        </Button>
                                        {!address.isDefault && (
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                className="action-btn delete-btn"
                                                onClick={() => handleDelete(address.id)}
                                            >
                                                Delete
                                            </Button>
                                        )}
                                        <Button
                                            variant={selectedAddress?.id === address.id ? "primary" : "outline-secondary"}
                                            size="sm"
                                            className="action-btn select-btn"
                                            onClick={() => {
                                                onSelectAddress(address);
                                                onHide();
                                            }}
                                        >
                                            {selectedAddress?.id === address.id ? "Selected" : "Select"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <Button
                            variant="outline-primary"
                            className="add-new-address-btn"
                            onClick={handleAddNew}
                        >
                            + Add New Address
                        </Button>
                    </div>
                ) : (
                    <Form onSubmit={handleSubmit} className="compact-address-form">
                        {/* Basic Details */}
                        <div className="form-section">
                            <h6 className="form-section-title">Contact Information</h6>
                            <Row className="compact-row">
                                <Col md={6}>
                                    <Form.Group className="compact-form-group">
                                        <Form.Label className="compact-label">Full Name*</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="compact-input"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="compact-form-group">
                                        <Form.Label className="compact-label">Phone Number*</Form.Label>
                                        <Form.Control
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="compact-input"
                                            pattern="[0-9]{10}"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </div>

                        {/* Address Details */}
                        <div className="form-section">
                            <h6 className="form-section-title">Address Details</h6>
                            <Form.Group className="compact-form-group">
                                <Form.Label className="compact-label">Address Line*</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="addressLine"
                                    value={formData.addressLine}
                                    onChange={handleChange}
                                    className="compact-textarea"
                                    required
                                    rows={2}
                                />
                            </Form.Group>

                            <Row className="compact-row">
                                <Col md={6}>
                                    <Form.Group className="compact-form-group">
                                        <Form.Label className="compact-label">Locality*</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="locality"
                                            value={formData.locality}
                                            onChange={handleChange}
                                            className="compact-input"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="compact-form-group">
                                        <Form.Label className="compact-label">Landmark</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="landmark"
                                            value={formData.landmark}
                                            onChange={handleChange}
                                            className="compact-input"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="compact-row">
                                <Col md={4}>
                                    <Form.Group className="compact-form-group">
                                        <Form.Label className="compact-label">City*</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="compact-input"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="compact-form-group">
                                        <Form.Label className="compact-label">State*</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            className="compact-input"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="compact-form-group">
                                        <Form.Label className="compact-label">Pincode*</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleChange}
                                            className="compact-input"
                                            pattern="[0-9]{6}"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </div>

                        {/* Additional Details Toggle */}
                        <div className="form-section">
                            <div className="additional-details-toggle">
                                <Form.Check
                                    type="checkbox"
                                    id="showAdditionalDetails"
                                    className="custom-checkbox"
                                    checked={showAdditionalDetails}
                                    onChange={(e) => setShowAdditionalDetails(e.target.checked)}
                                    label="Add business/additional details"
                                />
                            </div>

                            {showAdditionalDetails && (
                                <div className="additional-details-section">
                                    <h6 className="form-section-title">Business Information</h6>
                                    <Row className="compact-row">
                                        <Col md={6}>
                                            <Form.Group className="compact-form-group">
                                                <Form.Label className="compact-label">Company Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="companyName"
                                                    value={formData.companyName}
                                                    onChange={handleChange}
                                                    className="compact-input"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="compact-form-group">
                                                <Form.Label className="compact-label">GST Number</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="gstNumber"
                                                    value={formData.gstNumber}
                                                    onChange={handleChange}
                                                    className="compact-input"
                                                    placeholder="15 digit GST number"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Form.Group className="compact-form-group">
                                        <Form.Label className="compact-label">Alternate Phone</Form.Label>
                                        <Form.Control
                                            type="tel"
                                            name="alternatePhone"
                                            value={formData.alternatePhone}
                                            onChange={handleChange}
                                            className="compact-input"
                                            pattern="[0-9]{10}"
                                        />
                                    </Form.Group>
                                </div>
                            )}
                        </div>

                        {/* Default Address Setting */}
                        <div className="form-section">
                            <div className="default-address-setting">
                                <Form.Check
                                    type="switch"
                                    id="isDefault"
                                    name="isDefault"
                                    className="custom-switch"
                                    checked={formData.isDefault}
                                    onChange={handleChange}
                                    label="Set as default address"
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <Button
                                variant="outline-secondary"
                                className="cancel-btn"
                                onClick={() => setMode("list")}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                className="save-btn"
                            >
                                {currentAddress ? "Update Address" : "Save Address"}
                            </Button>
                        </div>
                    </Form>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default AddressModal;