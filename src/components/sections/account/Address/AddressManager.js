import React, { useState, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import {
  FiPlus,
  FiEdit2,
  FiCheckCircle,
  FiTrash2,
  FiMapPin,
  FiX,
  FiSave,
  FiHome,
  FiBriefcase,
  FiPhone,
  FiNavigation,
} from "react-icons/fi";
import {
  useAddressesByCustomer,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
} from "../../../../hook/address/useAddress";
import "./AddressStyles.css";

const AddressManager = () => {
  const user = useSelector((state) => state.user.user);
  const customerId = user?.id;
  const queryClient = useQueryClient();

  // State management
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [showBusinessFields, setShowBusinessFields] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    pincode: "",
    locality: "",
    addressLine: "",
    city: "",
    state: "",
    landmark: "",
    alternatePhone: "",
    gstNumber: "",
    companyName: "",
    isDefault: false,
    addressType: "home",
  });

  // Query hooks
  const {
    data: addresses = [],
    isLoading,
    isError,
    error: queryError,
    refetch: refetchAddresses,
  } = useAddressesByCustomer(customerId);

  const createMutation = useCreateAddress();
  const updateMutation = useUpdateAddress();
  const deleteMutation = useDeleteAddress();

  // Filter addresses based on active tab
  const filteredAddresses = addresses.filter((address) => {
    if (activeTab === "all") return true;
    if (activeTab === "default") return address.isDefault;
    if (activeTab === "home") return !address.companyName;
    if (activeTab === "work") return address.companyName;
    return true;
  });

  // Handle input changes
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  // Reset form to default values
  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      phone: "",
      pincode: "",
      locality: "",
      addressLine: "",
      city: "",
      state: "",
      landmark: "",
      alternatePhone: "",
      gstNumber: "",
      companyName: "",
      isDefault: false,
      addressType: "home",
    });
    setShowBusinessFields(false);
    setError(null);
  }, []);

  // Open form to add new address
  const handleAddAddress = useCallback(() => {
    setIsFormOpen(true);
    setEditingId(null);
    resetForm();
  }, [resetForm]);

  // Open form to edit existing address
  const handleEditAddress = useCallback((address) => {
    setIsFormOpen(true);
    setEditingId(address.id);
    setFormData({
      ...address,
      gstNumber: address.gstNumber || "",
      companyName: address.companyName || "",
      addressType: address.companyName ? "work" : "home",
    });
    setShowBusinessFields(!!address.gstNumber || !!address.companyName);
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError(null);

    const addressData = {
      ...formData,
      customerId,
      addressType: undefined,
    };

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          address: addressData,
        });
      } else {
        await createMutation.mutateAsync(addressData);
      }

      await refetchAddresses();
      setIsFormOpen(false);
    } catch (err) {
      setError(err.message || "Failed to save address. Please try again.");
    }
  }, [formData, editingId, customerId, updateMutation, createMutation, refetchAddresses]);

  // Set address as default
  const handleSetDefault = useCallback(async (id) => {
    try {
      // Reset all addresses to non-default first
      await Promise.all(
        addresses.map((addr) => {
          if (addr.id !== id && addr.isDefault) {
            return updateMutation.mutateAsync({
              id: addr.id,
              address: { ...addr, isDefault: false },
            });
          }
          return Promise.resolve();
        })
      );

      // Set the selected address as default
      const addressToUpdate = addresses.find((addr) => addr.id === id);
      if (!addressToUpdate.isDefault) {
        await updateMutation.mutateAsync({
          id,
          address: { ...addressToUpdate, isDefault: true },
        });
      }

      await refetchAddresses();
    } catch (err) {
      setError(
        err.message || "Failed to set default address. Please try again."
      );
    }
  }, [addresses, updateMutation, refetchAddresses]);

  // Delete address by ID
  const handleDeleteAddress = useCallback(async (id) => {
    if (addresses.length <= 1) {
      setError("You must have at least one address.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this address?")) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
      await refetchAddresses();
    } catch (err) {
      setError(err.message || "Failed to delete address. Please try again.");
    }
  }, [addresses.length, deleteMutation, refetchAddresses]);

  // Handle address type toggle in form
  const handleAddressTypeToggle = useCallback((type) => {
    setFormData((prev) => ({
      ...prev,
      addressType: type,
    }));
    setShowBusinessFields(type === "work");
  }, []);

  // Handle tab change
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  // Early return if no customerId
  if (!customerId) {
    return (
      <div className="address-page-layout">
        <main className="address-manager-container">
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h3>User not authenticated</h3>
            <p>Please log in to manage your addresses</p>
          </div>
        </main>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="address-page-layout">
        <main className="address-manager-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your addresses...</p>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="address-page-layout">
        <main className="address-manager-container">
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h3>Failed to load addresses</h3>
            <p>{queryError?.message || "Please try again later"}</p>
            <button className="retry-button" onClick={() => refetchAddresses()}>
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="address-page-layout">
  

      <main className="address-manager-container">
        <div className="address-manager">
          <div className="address-header">
            <div className="header-content">
              <h1 className="header-title">My Addresses</h1>
              <p className="header-subtitle">
                Manage your shipping and billing addresses
              </p>
            </div>
            <button
              className="add-address-btn"
              onClick={handleAddAddress}
              disabled={createMutation.isPending}
            >
              <FiPlus className="btn-icon" /> Add New Address
            </button>
          </div>

          {error && (
            <div className="error-message">
              <span>{error}</span>
              <button
                className="error-close-btn"
                onClick={() => setError(null)}
              >
                <FiX />
              </button>
            </div>
          )}

          {/* Address Tabs */}
          <div className="address-tabs">
            <button
              className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
              onClick={() => handleTabChange("all")}
            >
              All Addresses ({addresses.length})
            </button>
            <button
              className={`tab-btn ${activeTab === "default" ? "active" : ""}`}
              onClick={() => handleTabChange("default")}
            >
              Default ({addresses.filter((a) => a.isDefault).length})
            </button>
            <button
              className={`tab-btn ${activeTab === "home" ? "active" : ""}`}
              onClick={() => handleTabChange("home")}
            >
              <FiHome className="tab-icon" /> Home
            </button>
            <button
              className={`tab-btn ${activeTab === "work" ? "active" : ""}`}
              onClick={() => handleTabChange("work")}
            >
              <FiBriefcase className="tab-icon" /> Work
            </button>
          </div>

          {filteredAddresses.length === 0 ? (
            <div className="no-addresses">
              <FiMapPin className="empty-icon" />
              <h3>No addresses found</h3>
              <p>Add an address to get started</p>
              <button
                className="add-first-address-btn"
                onClick={handleAddAddress}
                disabled={createMutation.isPending}
              >
                <FiPlus className="btn-icon" /> Add Your First Address
              </button>
            </div>
          ) : (
            <div className="address-grid">
              {filteredAddresses.map((address, index) => (
                <div
                  key={`address-${address.id}-${index}`}
                  className={`address-card ${
                    address.isDefault ? "default" : ""
                  } ${address.companyName ? "work" : "home"}`}
                >
                  <div className="card-header">
                    <div className="address-type">
                      {address.companyName ? (
                        <FiBriefcase className="address-icon work" />
                      ) : (
                        <FiHome className="address-icon home" />
                      )}
                      <div className="address-summary">
                        <span className="name">{address.name}</span>
                        {/* {address.isDefault && (
                          <span className="default-badge">
                            <FiCheckCircle /> Default
                          </span>
                        )} */}
                      </div>
                    </div>
                  </div>

                  <div className="card-details">
                    <div className="address-details">
                      <div className="detail-row">
                        <FiNavigation className="detail-icon" />
                        <div>
                          <p className="detail-label">Address</p>
                          <p className="detail-value">
                            {address.addressLine}
                          </p>
                        </div>
                      </div>
                      <div className="detail-row">
                        <FiMapPin className="detail-icon" />
                        <div>
                          <p className="detail-label">Locality/City</p>
                          <p className="detail-value">
                            {address.locality}, {address.city}
                          </p>
                        </div>
                      </div>
                      <div className="detail-row">
                        <FiMapPin className="detail-icon" />
                        <div>
                          <p className="detail-label">State/Pincode</p>
                          <p className="detail-value">
                            {address.state} - {address.pincode}
                          </p>
                        </div>
                      </div>
                      <div className="detail-row">
                        <FiPhone className="detail-icon" />
                        <div>
                          <p className="detail-label">Phone</p>
                          <p className="detail-value">{address.phone}</p>
                        </div>
                      </div>
                      {address.alternatePhone && (
                        <div className="detail-row">
                          <FiPhone className="detail-icon" />
                          <div>
                            <p className="detail-label">Alternate Phone</p>
                            <p className="detail-value">
                              {address.alternatePhone}
                            </p>
                          </div>
                        </div>
                      )}
                      {address.landmark && (
                        <div className="detail-row">
                          <FiMapPin className="detail-icon" />
                          <div>
                            <p className="detail-label">Landmark</p>
                            <p className="detail-value">{address.landmark}</p>
                          </div>
                        </div>
                      )}
                      {address.companyName && (
                        <div className="detail-row">
                          <FiBriefcase className="detail-icon" />
                          <div>
                            <p className="detail-label">Company</p>
                            <p className="detail-value">
                              {address.companyName}
                            </p>
                          </div>
                        </div>
                      )}
                      {address.gstNumber && (
                        <div className="detail-row">
                          <FiBriefcase className="detail-icon" />
                          <div>
                            <p className="detail-label">GST Number</p>
                            <p className="detail-value">
                              {address.gstNumber}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="card-actions">
                      <button
                        className="btn-edit"
                        onClick={() => handleEditAddress(address)}
                        disabled={updateMutation.isPending}
                      >
                        <FiEdit2 className="btn-icon" /> Edit
                      </button>
                      {!address.isDefault && (
                        <button
                          className="btn-set-default"
                          onClick={() => handleSetDefault(address.id)}
                          disabled={updateMutation.isPending}
                        >
                          <FiCheckCircle className="btn-icon" /> Set Default
                        </button>
                      )}
                      {addresses.length > 1 && (
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteAddress(address.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <FiTrash2 className="btn-icon" /> Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Address Form Modal */}
          {isFormOpen && (
            <div className="address-form-overlay">
              <div className="address-form-container">
                <div className="form-header">
                  <h2>{editingId ? "Edit Address" : "Add New Address"}</h2>
                  <button
                    className="close-btn"
                    onClick={() => setIsFormOpen(false)}
                    disabled={
                      createMutation.isPending || updateMutation.isPending
                    }
                  >
                    <FiX />
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="form-grid">
                    {/* Address Type Toggle */}
                    <div className="form-group full-width address-type-toggle">
                      <button
                        type="button"
                        className={`type-btn ${
                          formData.addressType === "home" ? "active" : ""
                        }`}
                        onClick={() => handleAddressTypeToggle("home")}
                      >
                        <FiHome className="btn-icon" /> Home
                      </button>
                      <button
                        type="button"
                        className={`type-btn ${
                          formData.addressType === "work" ? "active" : ""
                        }`}
                        onClick={() => handleAddressTypeToggle("work")}
                      >
                        <FiBriefcase className="btn-icon" /> Work
                      </button>
                    </div>

                    <div className="form-group">
                      <label htmlFor="name">Full Name*</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your full name"
                        disabled={
                          createMutation.isPending || updateMutation.isPending
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="phone">Mobile Number*</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="10-digit mobile number"
                        pattern="[0-9]{10}"
                        maxLength="10"
                        disabled={
                          createMutation.isPending || updateMutation.isPending
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="pincode">Pincode*</label>
                      <input
                        type="text"
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        required
                        placeholder="6-digit pincode"
                        pattern="[0-9]{6}"
                        maxLength="6"
                        disabled={
                          createMutation.isPending || updateMutation.isPending
                        }
                      />
                    </div>

                    <div className="form-group full-width">
                      <label htmlFor="addressLine">Complete Address*</label>
                      <textarea
                        id="addressLine"
                        name="addressLine"
                        value={formData.addressLine}
                        onChange={handleInputChange}
                        required
                        placeholder="House no, building, street, area"
                        rows="2"
                        disabled={
                          createMutation.isPending || updateMutation.isPending
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="locality">Locality*</label>
                      <input
                        type="text"
                        id="locality"
                        name="locality"
                        value={formData.locality}
                        onChange={handleInputChange}
                        required
                        placeholder="Area/Locality"
                        disabled={
                          createMutation.isPending || updateMutation.isPending
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="city">City*</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        placeholder="City"
                        disabled={
                          createMutation.isPending || updateMutation.isPending
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="state">State*</label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        placeholder="State"
                        disabled={
                          createMutation.isPending || updateMutation.isPending
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="landmark">Landmark (Optional)</label>
                      <input
                        type="text"
                        id="landmark"
                        name="landmark"
                        value={formData.landmark}
                        onChange={handleInputChange}
                        placeholder="Nearby landmark"
                        disabled={
                          createMutation.isPending || updateMutation.isPending
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="alternatePhone">
                        Alternate Phone (Optional)
                      </label>
                      <input
                        type="tel"
                        id="alternatePhone"
                        name="alternatePhone"
                        value={formData.alternatePhone}
                        onChange={handleInputChange}
                        placeholder="Alternate phone number"
                        pattern="[0-9]{10}"
                        maxLength="10"
                        disabled={
                          createMutation.isPending || updateMutation.isPending
                        }
                      />
                    </div>

                    <div className="form-group full-width checkbox-group">
                      <label className="custom-checkbox">
                        <input
                          type="checkbox"
                          name="isDefault"
                          checked={formData.isDefault}
                          onChange={handleInputChange}
                          disabled={
                            createMutation.isPending || updateMutation.isPending
                          }
                        />
                        <span className="checkmark"></span>
                        Set as default address
                      </label>
                    </div>

                    {/* Business Fields (shown when work address is selected) */}
                    {showBusinessFields && (
                      <>
                        <div className="form-group">
                          <label htmlFor="companyName">Company Name</label>
                          <input
                            type="text"
                            id="companyName"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleInputChange}
                            placeholder="Your company name"
                            disabled={
                              createMutation.isPending ||
                              updateMutation.isPending
                            }
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="gstNumber">GST Number</label>
                          <input
                            type="text"
                            id="gstNumber"
                            name="gstNumber"
                            value={formData.gstNumber}
                            onChange={handleInputChange}
                            placeholder="Enter GST Number"
                            pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"
                            title="Enter valid GST number (e.g., 22AAAAA0000A1Z5)"
                            disabled={
                              createMutation.isPending ||
                              updateMutation.isPending
                            }
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => setIsFormOpen(false)}
                      disabled={
                        createMutation.isPending || updateMutation.isPending
                      }
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-save"
                      disabled={
                        createMutation.isPending || updateMutation.isPending
                      }
                    >
                      {createMutation.isPending || updateMutation.isPending ? (
                        <span className="spinner"></span>
                      ) : (
                        <>
                          <FiSave className="btn-icon" />{" "}
                          {editingId ? "Update" : "Save"}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AddressManager;