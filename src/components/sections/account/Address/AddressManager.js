import React, { useState } from 'react';
import { 
  FiPlus, FiCreditCard, FiTruck, FiEdit2, 
  FiCheckCircle, FiTrash2, FiMapPin, FiX, FiSave 
} from 'react-icons/fi';
import './AddressStyles.css';

const AddressManager = () => {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'billing',
      name: 'John Benjamin',
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'United States',
      phone: '(123) 456-7890',
      isDefault: true
    },
    {
      id: 2,
      type: 'shipping',
      name: 'John Benjamin',
      street: '456 Broadway',
      city: 'Brooklyn',
      state: 'NY',
      zip: '11211',
      country: 'United States',
      phone: '(123) 456-7890',
      isDefault: false
    }
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    type: 'shipping',
    name: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
    phone: '',
    isDefault: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAddAddress = () => {
    setIsFormOpen(true);
    setEditingId(null);
    setFormData({
      type: 'shipping',
      name: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'United States',
      phone: '',
      isDefault: false
    });
  };

  const handleEditAddress = (address) => {
    setIsFormOpen(true);
    setEditingId(address.id);
    setFormData({ ...address });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.isDefault) {
      // Reset all other addresses to non-default
      const updatedAddresses = addresses.map(addr => ({
        ...addr,
        isDefault: false
      }));
      
      if (editingId) {
        // Update existing address
        const finalAddresses = updatedAddresses.map(addr => 
          addr.id === editingId ? formData : addr
        );
        setAddresses(finalAddresses);
      } else {
        // Add new address
        const newAddress = {
          ...formData,
          id: Date.now() // Simple ID generation
        };
        setAddresses([...updatedAddresses, newAddress]);
      }
    } else {
      if (editingId) {
        // Update existing address without changing defaults
        setAddresses(addresses.map(addr => 
          addr.id === editingId ? formData : addr
        ));
      } else {
        // Add new non-default address
        const newAddress = {
          ...formData,
          id: Date.now()
        };
        setAddresses([...addresses, newAddress]);
      }
    }
    
    setIsFormOpen(false);
  };

  const handleSetDefault = (id) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  const handleRemoveAddress = (id) => {
    // Don't allow removal if it's the last address
    if (addresses.length <= 1) return;
    
    // If removing default address, set another one as default
    const addressToRemove = addresses.find(addr => addr.id === id);
    if (addressToRemove.isDefault) {
      const otherAddresses = addresses.filter(addr => addr.id !== id);
      setAddresses([
        { ...otherAddresses[0], isDefault: true },
        ...otherAddresses.slice(1)
      ]);
    } else {
      setAddresses(addresses.filter(addr => addr.id !== id));
    }
  };

  return (
    <div className="address-manager">
      <div className="address-header">
        <div>
          <h1>My Addresses</h1>
          <p>Manage your shipping and billing addresses</p>
        </div>
        <button 
          className="add-address-btn"
          onClick={handleAddAddress}
        >
          <FiPlus /> Add New Address
        </button>
      </div>

      <div className="address-grid">
        {addresses.map(address => (
          <div 
            key={address.id} 
            className={`address-card ${address.isDefault ? 'default' : ''}`}
          >
            <div className="card-header">
              <div className="address-type">
                {address.type === 'billing' ? <FiCreditCard /> : <FiTruck />}
                <span>{address.type.charAt(0).toUpperCase() + address.type.slice(1)} Address</span>
              </div>
              {address.isDefault && (
                <span className="default-badge">Default</span>
              )}
            </div>
            
            <div className="card-body">
              <div className="address-details">
                <p className="name">{address.name}</p>
                <p>{address.street}</p>
                <p>{address.city}, {address.state} {address.zip}</p>
                <p>{address.country}</p>
                <p className="phone">Phone: {address.phone}</p>
              </div>
            </div>
            
            <div className="card-footer">
              <button 
                className="btn-edit"
                onClick={() => handleEditAddress(address)}
              >
                <FiEdit2 /> Edit
              </button>
              {!address.isDefault && (
                <button 
                  className="btn-set-default"
                  onClick={() => handleSetDefault(address.id)}
                >
                  <FiCheckCircle /> Set as Default
                </button>
              )}
              <button 
                className="btn-remove"
                onClick={() => handleRemoveAddress(address.id)}
                disabled={addresses.length <= 1}
              >
                <FiTrash2 /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {isFormOpen && (
        <div className="address-form-overlay">
          <div className="address-form-container">
            <div className="form-header">
              <h2>{editingId ? 'Edit Address' : 'Add New Address'}</h2>
              <button 
                className="close-btn" 
                onClick={() => setIsFormOpen(false)}
              >
                <FiX />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Address Type</label>
                <div className="radio-group">
                  <label className={`radio-option ${formData.type === 'shipping' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="type"
                      value="shipping"
                      checked={formData.type === 'shipping'}
                      onChange={handleInputChange}
                    />
                    <FiTruck /> Shipping
                  </label>
                  <label className={`radio-option ${formData.type === 'billing' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="type"
                      value="billing"
                      checked={formData.type === 'billing'}
                      onChange={handleInputChange}
                    />
                    <FiCreditCard /> Billing
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="street">Street Address</label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="state">State/Province</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="zip">ZIP/Postal Code</label>
                  <input
                    type="text"
                    id="zip"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="country">Country</label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleInputChange}
                  />
                  Set as default address
                </label>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => setIsFormOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  <FiSave /> {editingId ? 'Update Address' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressManager;