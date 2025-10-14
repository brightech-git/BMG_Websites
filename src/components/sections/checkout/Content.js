import React, { useState, useEffect, useCallback } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Modal, Button, Badge, Form } from 'react-bootstrap';
import { Check, Plus, Edit, Trash2, Phone, Home, ShoppingBag, MapPin, User, CreditCard } from 'lucide-react';
import { useCreateOrder } from '../../../hook/order/useOrderMutation';
import { useCurrentProfile } from '../../../hook/userProfile/useUserProfileQuery';
import { useCreateAddress, useUpdateAddress, useAddressesByCustomer, useDeleteAddress } from '../../../hook/address/useNewAddress';
import { toast } from 'react-toastify';
import './Checkout.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash, faPhone } from '@fortawesome/free-solid-svg-icons';



// Progress Stepper Component
const ProgressStepper = ({ currentStep }) => {
  const steps = [
    { id: 1, name: 'Address', icon: MapPin },
    { id: 2, name: 'Order', icon: ShoppingBag },
    { id: 3, name: 'Payment', icon: CreditCard }
  ];

  return (
    <div className="progress-tracker">
      <div className="tracker-container">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div key={step.id} className="tracker-step">
              <div className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                <div className="step-number-container">
                  <div className="step-number">{isCompleted ? <Check size={12} /> : step.id}</div>
                </div>
                <div className="step-info">
                  <span className="step-label">{step.name}</span>
                </div>
              </div>
              {index < steps.length - 1 && <div className="step-divider"></div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Address Modal
const AddressModal = ({ show, onHide, addresses, selectedAddress, onSelectAddress, onSaveAddress, onDeleteAddress, customerProfile }) => {

  console.log(customerProfile,'cust')
  const [mode, setMode] = useState('list');
  const [currentAddress, setCurrentAddress] = useState(null);
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
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
    setMode('add');
  };

  const handleEdit = (address) => {
    setCurrentAddress(address);
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
    setMode('list');
  };

  const handleDelete = (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      onDeleteAddress(addressId);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered className="address-modal">
      <Modal.Header closeButton className="modal-header-styled">
        <Modal.Title className="modal-title-styled">
          {mode === 'list' ? 'Select Address' : mode === 'add' ? 'Add Address' : 'Edit Address'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body-styled">
        {mode === 'list' ? (
          <div className="address-list">
            {addresses.map(address => (
              <div key={address.id} className={`address-item ${selectedAddress?.id === address.id ? 'selected' : ''}`}>
                <div className="address-content">
                  <div className="address-heading">
                    <div className="address-name-section">
                      <h6 className="address-name">{address.name}</h6>
                      {address.isDefault && <Badge bg="success" className="default-badge">Default</Badge>}
                    </div>
                    <div className="address-actions">
                      <button className="action-button edit-buttons" onClick={() => handleEdit(address)} title="Edit address">
                        <FontAwesomeIcon icon={faPen} size="sm" />
                      </button>
                      {!address.isDefault && (
                        <button className="action-button delete-button" onClick={() => handleDelete(address.id)} title="Delete address">
                          <FontAwesomeIcon icon={faTrash} size="sm" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="address-info">
                    <p className="address-line">{address.addressLine}</p>
                    <p className="address-line">{[address.locality, address.city].filter(Boolean).join(', ')}</p>
                    <p className="address-line">{address.state} - {address.pincode}, {address.country || 'India'}</p>
                    {address.landmark && <p className="landmark-line">Landmark: {address.landmark}</p>}
                    <p className="phone-info">
                      <FontAwesomeIcon icon={faPhone} size="sm" className="phone-icon" /> {address.phone}
                    </p>
                  </div>
                </div>
                <div className="address-select-area">
                  <Button
                    variant={selectedAddress?.id === address.id ? 'success' : 'outline-primary'}
                    onClick={() => { onSelectAddress(address); onHide(); }}
                    className="select-button"
                  >
                    {selectedAddress?.id === address.id ? (
                      <>
                        <Check size={15} className="check-icon" /> Selected
                      </>
                    ) : (
                      'Deliver Here'
                    )}
                  </Button>
                </div>
              </div>
            ))}
            <button className="add-new-address-button" onClick={handleAddNew}>
              <Plus size={14} className="plus-icon" /> Add New Address
            </button>
          </div>
        ) : (
          <Form onSubmit={handleSubmit} className="address-form-container">
            <div className="row mb-2">
              <div className="col-12 col-md-6 mb-2 mb-md-0">
                <Form.Group>
                  <Form.Label className="form-label">Full Name*</Form.Label>
                  <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" required />
                </Form.Group>
              </div>
              <div className="col-12 col-md-6">
                <Form.Group>
                  <Form.Label className="form-label">Phone Number*</Form.Label>
                  <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleChange} className="form-control" pattern="[0-9]{10}" required />
                </Form.Group>
              </div>
            </div>
            <Form.Group className="mb-2">
              <Form.Label className="form-label">Address Line*</Form.Label>
              <Form.Control as="textarea" name="addressLine" value={formData.addressLine} onChange={handleChange} className="form-control" rows={3} required />
            </Form.Group>
            <div className="row mb-2">
              <div className="col-12 col-md-6 mb-2 mb-md-0">
                <Form.Group>
                  <Form.Label className="form-label">Locality*</Form.Label>
                  <Form.Control type="text" name="locality" value={formData.locality} onChange={handleChange} className="form-control" required />
                </Form.Group>
              </div>
              <div className="col-12 col-md-6">
                <Form.Group>
                  <Form.Label className="form-label">Landmark</Form.Label>
                  <Form.Control type="text" name="landmark" value={formData.landmark} onChange={handleChange} className="form-control" />
                </Form.Group>
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-12 col-md-4 mb-2 mb-md-0">
                <Form.Group>
                  <Form.Label className="form-label">City*</Form.Label>
                  <Form.Control type="text" name="city" value={formData.city} onChange={handleChange} className="form-control" required />
                </Form.Group>
              </div>
              <div className="col-12 col-md-4 mb-2 mb-md-0">
                <Form.Group>
                  <Form.Label className="form-label">State*</Form.Label>
                  <Form.Control type="text" name="state" value={formData.state} onChange={handleChange} className="form-control" required />
                </Form.Group>
              </div>
              <div className="col-12 col-md-4">
                <Form.Group>
                  <Form.Label className="form-label">Pincode*</Form.Label>
                  <Form.Control type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="form-control" pattern="[0-9]{6}" required />
                </Form.Group>
              </div>
                
                <div className="col-12 col-md-4">
                  <Form.Group>
                    <Form.Label className="form-label">GstNumber</Form.Label>
                    <Form.Control type="text" name="gstNumber" value={formData.gstNumber} onChange={handleChange} className="form-control" />
                  </Form.Group>
                </div>
                <div className="col-12 col-md-4">
                  <Form.Group>
                    <Form.Label className="form-label">CompanyName</Form.Label>
                    <Form.Control type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="form-control" />
                  </Form.Group>
                </div>
                <div className="col-12 col-md-4">
                  <Form.Group>
                    <Form.Label className="form-label">Mobile 2</Form.Label>
                    <Form.Control type="text" name="alternatePhone" value={formData.alternatePhone} onChange={handleChange} className="form-control" pattern="[0-9]{10}" />
                  </Form.Group>
                </div>
            </div>
            <Form.Group className="mb-2">
              <Form.Check 
                type="checkbox" 
                name="isDefault" 
                label="Set as default address" 
                checked={formData.isDefault} 
                onChange={handleChange} 
                className="form-check"
              />
            </Form.Group>
            <div className="form-actions">
              <Button variant="outline-secondary" onClick={() => setMode('list')} className="cancel-button">Cancel</Button>
              <Button variant="primary" type="submit" className="save-button">{currentAddress ? 'Update' : 'Save'}</Button>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

// Order Summary Panel
const OrderSummaryPanel = ({ items, subtotal, total, isCompact = false }) => {

  console.log(items , 'ordersummary');
  return (
    <div className={`order-panel ${isCompact ? 'compact' : ''}`}>
      <div className="order-header">
        <h4 className="order-title"><ShoppingBag size={14} className="order-icon" /> Order Summary</h4>
        <span className="item-count-badge">{items.length} item{items.length > 1 ? 's' : ''}</span>
      </div>
      <div className="order-items">
        {items.map((item, index) => (
          <div key={index} className="order-item">
            <div className="item-image-container">
              <img src={item.imagePath || 'https://via.placeholder.com/40x40'} alt={item.productName || item.name} onError={(e) => { e.target.src = 'https://via.placeholder.com/40x40'; }} />
            </div>
            <div className="item-details">
              <h6 className="order-item-name">{item.productName || item.name}</h6>
              <p className="item-variant">SKU: {item.sno || item.tagNo}</p>
              <p className="item-variant">Weight: {item?.weight.toFixed(3) || item?.tagNo}</p>
            </div>
            <div className="item-price">₹{(item?.price).toFixed(2)}</div>
      
          </div>
        ))}
      </div>
      <div className="order-totals">
        <div className="total-row"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
        <div className="total-row"><span>Shipping</span><span className="free-shipping">FREE</span></div>
        <div className="total-row final-total"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
      </div>
    </div>
  );
};

// Main Checkout Component
const EnhancedCheckout = ({ location, history }) => {
  const { state: checkoutPayload = {} } = location || {};
  const { items: initialCartItems = [], totalAmount: initialTotalAmount = 0 } = checkoutPayload;
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [totalAmount, setTotalAmount] = useState(initialTotalAmount);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMode, setPaymentMode] = useState('ONLINE');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const { data: profile, isLoading: profileLoading } = useCurrentProfile();



  const { data: addresses, isLoading: addressesLoading, refetch: refetchAddresses } = useAddressesByCustomer(profile?.id);

  console.log('Profile:', profile);
  console.log('Addresses:', addresses);
  console.log('Selected Address:', selectedAddress);
  const { mutate: createOrder } = useCreateOrder();
  const { mutate: createAddress } = useCreateAddress();
  const { mutate: updateAddress } = useUpdateAddress();
  const { mutate: deleteAddress } = useDeleteAddress();

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
    localStorage.setItem('cartitems', JSON.stringify({ items: cartItems, totalAmount }));
  }, [cartItems, totalAmount]);

  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0];
      setSelectedAddress(defaultAddress);
    }
  }, [addresses]);

  // const formatAddress = useCallback((address) => {
  //   if (!address) return '';
  //   return `${address.addressLine}, ${address.locality}, ${address.city}, ${address.state} - ${address.pincode}, ${address.country || 'India'}`;
  // }, []);

  const handleSaveAddress = (addressData) => {
    const payload = { ...addressData, customerId: profile.id };
    if (addressData.id) {
      updateAddress({ id: addressData.id, addressData: payload }, {
        onSuccess: () => {refetchAddresses(); },
        onError: (error) => { toast.error(error.response?.data || 'Failed to update address'); }
      });
    } else {
      createAddress(payload, {
        onSuccess: () => { refetchAddresses(); },
        onError: (error) => { toast.error(error.response?.data || 'Failed to create address'); }
      });
    }
  };

  const handleDeleteAddress = (addressId) => {
    deleteAddress(addressId, {
      onSuccess: () => {
        refetchAddresses();
        if (selectedAddress?.id === addressId) setSelectedAddress(null);
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
      address: {
        addressLine: selectedAddress.addressLine,
        locality: selectedAddress.locality,
        landmark: selectedAddress.landmark,
        name: selectedAddress.name,
        phone: selectedAddress.phone,
        alternatePhone: selectedAddress.alternatePhone,
        isDefault: selectedAddress.isDefault,
        id: selectedAddress.id,
        customerId: selectedAddress.customerId,
        gstNumber: selectedAddress.gstNumber,
        companyName: selectedAddress.companyName,
        city: selectedAddress.city,
        state: selectedAddress.state,
        country: selectedAddress.country || "India",
        pincode: selectedAddress.pincode,
      },
      paymentMode,
      items: cartItems.map((item) => ({
        productId: `${item.itemId}-${item.tagNo}`, // fixed, string concat not subtraction
        productName: item.productName,
        price: parseFloat(item.price),
        itemId: item.itemId,
        tagNo: item.tagNo,
        sno: item.sno,
        imagePath: item.imagePath,
        quantity: item.quantity,
      })),
    };

    console.log('Order Payload:', orderPayload);

    // ✅ Store in localStorage (with JSON.stringify)
    localStorage.setItem('order', JSON.stringify(orderPayload));

    createOrder(orderPayload, {
      onSuccess: (data) => {
        console.log("Order created successfully:", data, "Payload:", orderPayload);

        if (data.orderId) {
          if (paymentMode === "ONLINE") {
            history.push({
              pathname: `/payment/${data.orderId}`,
              state: { orderPayload }, // ✅ pass in router state
            });
          } else if (paymentMode === "COD") {
            history.push({
              pathname: `/payment-success`,
              search: `?orderId=${data.orderId}&mode=COD`,
              state: { orderPayload }, // ✅ pass here too
            });
          }
        } else {
          toast.error("Order created but orderId not returned.");
        }
      },
      onError: (error) => {
        console.error("Order creation failed:", error);
        toast.error("Failed to create order: " + error.message);
      },
    });
  }, [cartItems, totalAmount, selectedAddress, profile?.email, paymentMode, history, createOrder]);


  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);
  return (
    <div className="checkout-wrapper">
      <div className="mobile-order-toggle">
        <button className="toggle-button" onClick={() => setSummaryOpen(!summaryOpen)}>
          <div className="toggle-content">
            <span>Order Summary</span>
            <span className="toggle-arrow">{summaryOpen ? '▲' : '▼'}</span>
          </div>
          <div className="toggle-total">₹{totalAmount.toFixed(2)}</div>
        </button>
        {summaryOpen && (
          <div className="mobile-order-panel">
            <OrderSummaryPanel items={cartItems} subtotal={subtotal} total={totalAmount} isCompact />
          </div>
        )}
      </div>
      <div className="checkout-layout">
        <div className="checkout-main">
          <ProgressStepper currentStep={currentStep} />
          <div className="step-section">
            {currentStep === 1 && (
              <div className="step-section">
                <div className="section-heading">
                  <h3 className="section-title"><MapPin size={14} className="section-icon" /> Delivery Address</h3>
                </div>
                <div className="contact-details">
                  <div className="contact-row">
                    <User size={12} className="contact-icon" />
                    <div>
                      <span className="contact-label">Contact:</span>
                      <span className="contact-value">{profileLoading ? 'Loading...' : profile?.contactNumber || 'Not provided'}</span>
                    </div>
                  </div>
                </div>
                {addressesLoading ? (
                  <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading addresses...</p>
                  </div>
                ) : selectedAddress ? (
                  <div className="address-display">
                    <div className="address-item selected">
                      <div className="address-content">
                        <div className="address-heading">
                          <h6 className="address-name">{selectedAddress.name}</h6>
                          {selectedAddress.isDefault && <Badge bg="success">Default</Badge>}
                        </div>
                        <div className="address-info">
                          <p>{selectedAddress.addressLine}</p>
                          <p>{selectedAddress.locality}, {selectedAddress.city}</p>
                          <p>{selectedAddress.state} - {selectedAddress.pincode}</p>
                          <p className="phone-info"><Phone size={10} className="phone-icon" /> {selectedAddress.phone}</p>
                        </div>
                      </div>
                    </div>
                    <button className="change-address-button" onClick={() => setShowAddressModal(true)}>Change Address</button>
                  </div>
                ) : (
                  <div className="no-address-state">
                    <div className="no-address-content">
                      <MapPin size={24} className="no-address-icon" />
                      <h5>No address selected</h5>
                      <p>Add a delivery address to continue</p>
                      <button className="add-address-button primary" onClick={() => setShowAddressModal(true)}>
                        <Plus size={12} className="plus-icon" /> Add Address
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {currentStep === 2 && (
              <div className="step-section">
                <div className="section-heading">
                  <h3 className="section-title"><ShoppingBag size={14} className="order-icon" /> Order Summary</h3>
                </div>
                <OrderSummaryPanel items={cartItems} subtotal={subtotal} total={totalAmount} />
              </div>
            )}
            {currentStep === 3 && (
              <div className="step-section">
                <div className="section-heading">
                  <h3 className="section-title"><CreditCard size={14} className="section-icon" /> Payment Method</h3>
                </div>
                <div className="payment-area">
                  <p className="payment-hint">All transactions are secure and encrypted.</p>
                  <div className="payment-options">
                    <div className="payment-option">
                      <input type="radio" id="online" name="payment" value="ONLINE" checked={paymentMode === 'ONLINE'} onChange={(e) => setPaymentMode(e.target.value)} />
                      <label htmlFor="online">
                        <CreditCard size={12} className="payment-icon" /> Online Payment
                        <span className="payment-desc">UPI, Cards, Net Banking</span>
                      </label>
                    </div>
                    <div className="payment-option">
                      <input type="radio" id="cod" name="payment" value="COD" checked={paymentMode === 'COD'} onChange={(e) => setPaymentMode(e.target.value)} />
                      <label htmlFor="cod">
                        <Home size={12} className="payment-icon" /> Cash on Delivery
                        <span className="payment-desc">Pay on delivery</span>
                      </label>
                    </div>
                  </div>
                  <div className="order-total-final">
                    <div className="total-breakdown">
                      <div className="total-row"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                      <div className="total-row"><span>Shipping</span><span>FREE</span></div>
                      <div className="total-row final"><span>Total</span><span>₹{totalAmount.toFixed(2)}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="step-controls">
            {currentStep > 1 && <button className="nav-button secondary" onClick={handlePrevStep}>Back</button>}
            {currentStep < 3 ? (
              <button className="nav-button primary" onClick={handleNextStep} disabled={currentStep === 1 && !selectedAddress}>Continue</button>
            ) : (
              <button className="nav-button primary place-order" onClick={submitOrder} disabled={!selectedAddress}>
                Place Order - ₹{totalAmount.toFixed(2)}
              </button>
            )}
          </div>
        </div>
        <div className="checkout-aside">
          <OrderSummaryPanel items={cartItems} subtotal={subtotal} total={totalAmount} />
        </div>
      </div>
      <AddressModal
        show={showAddressModal}
        onHide={() => setShowAddressModal(false)}
        addresses={addresses || []}
        selectedAddress={selectedAddress}
        onSelectAddress={setSelectedAddress}
        onSaveAddress={handleSaveAddress}
        onDeleteAddress={handleDeleteAddress}
        customerProfile={profile}
      />
    </div>
  );
};

export default withRouter(EnhancedCheckout);