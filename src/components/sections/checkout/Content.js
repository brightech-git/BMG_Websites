import React, { useState, useEffect, useCallback } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Modal, Button, Badge, Form } from 'react-bootstrap';
import { useCreateOrder } from '../../../hook/order/useOrderMutation';
import { useCurrentProfile } from '../../../hook/userProfile/useUserProfileQuery';
import {
  useCreateAddress,
  useUpdateAddress,
  useAddressesByCustomer,
  useDeleteAddress,
} from '../../../hook/address/useNewAddress';
import { toast } from 'react-toastify';
import AddressView from './address/AddressView';
import './Checkout.css';
import './address/AddressView.css';

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
  const [mode, setMode] = useState('list'); // 'list', 'add', 'edit'
  const [currentAddress, setCurrentAddress] = useState(null);

  const [formData, setFormData] = useState({
    name: customerProfile?.name || '',
    phone: customerProfile?.contactNumber || '',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    locality: '',
    landmark: '',
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
    setFormData({
      name: customerProfile?.name || '',
      phone: customerProfile?.contactNumber || '',
      addressLine: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
      locality: '',
      landmark: '',
      isDefault: false
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
      isDefault: address.isDefault
    });
    setMode('edit');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.phone || !formData.addressLine ||
      !formData.city || !formData.state || !formData.pincode) {
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
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {mode === 'list' ? 'Select Delivery Address' :
            mode === 'add' ? 'Add New Address' : 'Edit Address'}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {mode === 'list' ? (
          <div className="address-list-container">
            {addresses.map(address => (
              <div
                key={address.id}
                className={`address-item mb-3 ${selectedAddress?.id === address.id ? 'selected' : ''}`}
              >
                <AddressView
                  address={address}
                  variant="card"
                  showActions={true}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  className={selectedAddress?.id === address.id ? 'selected' : ''}
                />
                <div className="d-grid mt-2">
                  <Button
                    variant={selectedAddress?.id === address.id ? 'primary' : 'outline-primary'}
                    onClick={() => {
                      onSelectAddress(address);
                      onHide();
                    }}
                  >
                    {selectedAddress?.id === address.id ? 'Selected' : 'Deliver Here'}
                  </Button>
                </div>
              </div>
            ))}

            <Button
              variant="outline-secondary"
              className="w-100 mt-3"
              onClick={handleAddNew}
            >
              + Add New Address
            </Button>
          </div>
        ) : (
          <Form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <Form.Group controlId="name">
                  <Form.Label>Full Name*</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="phone">
                  <Form.Label>Phone Number*</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    pattern="[0-9]{10}"
                    required
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group controlId="addressLine" className="mb-3">
              <Form.Label>Address Line*</Form.Label>
              <Form.Control
                as="textarea"
                name="addressLine"
                value={formData.addressLine}
                onChange={handleChange}
                required
                rows={3}
              />
            </Form.Group>

            <div className="row mb-3">
              <div className="col-md-6">
                <Form.Group controlId="locality">
                  <Form.Label>Locality*</Form.Label>
                  <Form.Control
                    type="text"
                    name="locality"
                    value={formData.locality}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="landmark">
                  <Form.Label>Landmark</Form.Label>
                  <Form.Control
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <Form.Group controlId="city">
                  <Form.Label>City*</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="state">
                  <Form.Label>State*</Form.Label>
                  <Form.Control
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <Form.Group controlId="pincode">
                  <Form.Label>Pincode*</Form.Label>
                  <Form.Control
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    pattern="[0-9]{6}"
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="country">
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    disabled
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group controlId="isDefault" className="mb-3">
              <Form.Check
                type="checkbox"
                name="isDefault"
                label="Set as default address"
                checked={formData.isDefault}
                onChange={handleChange}
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setMode('list')}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {currentAddress ? 'Update Address' : 'Save Address'}
              </Button>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

const OrderSummaryContent = ({ items, subtotal, total }) => {
  return (
    <aside className="checkout-summary-panel">
      <h3 className="summary-title">Order Summary</h3>
      {items.map((item, index) => (
        <div key={index} className="summary-product-row">
          <div className="summary-product-thumb-wrap">
            <img
              src={item.imagePath}
              alt={item.productName || item.name}
              className="summary-product-thumb"
            />
          </div>
          <div className="summary-product-details">
            <div className="summary-product-title">{item.productName || item.name}</div>
            <div className="summary-product-variant">{item.sno || item.tagNo}</div>
          </div>
          <div className="summary-product-price">₹{(item.price * item.quantity).toFixed(2)}</div>
        </div>
      ))}
      <div className="summary-breakdown">
        <div className="summary-row">
          <div>Subtotal</div>
          <div>₹{subtotal.toFixed(2)}</div>
        </div>
        <div className="summary-row">
          <div>Shipping</div>
          <div className="summary-hint">Calculated at next step</div>
        </div>
        <div className="summary-row summary-row-total">
          <div>
            <b>Total</b>
          </div>
          <div>
            <b>₹{total.toFixed(2)}</b>
          </div>
        </div>
      </div>
    </aside>
  );
};

const Checkout = ({ location, history }) => {
  const { state: checkoutPayload = {} } = location || {};
  const { items: initialCartItems = [], totalAmount: initialTotalAmount = 0 } =
    checkoutPayload;
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [totalAmount, setTotalAmount] = useState(initialTotalAmount);
  const { data: profile, isLoading: profileLoading } = useCurrentProfile();

  // Address related states
  const [showAddressModal, setShowAddressModal] = useState(false);
  const {
    data: addresses,
    isLoading: addressesLoading,
    refetch: refetchAddresses
  } = useAddressesByCustomer(profile?.id);

  const [summaryOpen, setSummaryOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMode, setPaymentMode] = useState('ONLINE');

  const { mutate: createOrder } = useCreateOrder();
  const { mutate: createAddress } = useCreateAddress();
  const { mutate: updateAddress } = useUpdateAddress();
  const { mutate: deleteAddress } = useDeleteAddress();

  // Restore cart from localStorage if available
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

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cartitems', JSON.stringify({ items: cartItems, totalAmount }));
  }, [cartItems, totalAmount]);

  // Set default address if available
  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0];
      setSelectedAddress(defaultAddress);
    }
  }, [addresses]);

  const handlePaymentChange = useCallback((e) => {
    setPaymentMode(e.target.value);
  }, []);

  const formatAddress = useCallback((address) => {
    if (!address) return '';
    return `${address.addressLine}, ${address.locality}, ${address.city}, ${address.state} - ${address.pincode}, ${address.country || 'India'}`;
  }, []);

  const handleSaveAddress = (addressData) => {
    const payload = {
      ...addressData,
      customerId: profile.id
    };

    if (addressData.id) {
      updateAddress({ id: addressData.id, addressData: payload }, {
        onSuccess: () => {
          toast.success('Address updated successfully');
          refetchAddresses();
        },
        onError: (error) => {
          toast.error(error.response?.data || 'Failed to update address');
        }
      });
    } else {
      createAddress(payload, {
        onSuccess: () => {
          toast.success('Address created successfully');
          refetchAddresses();
        },
        onError: (error) => {
          toast.error(error.response?.data || 'Failed to create address');
        }
      });
    }
  };

  const handleDeleteAddress = (addressId) => {
    deleteAddress(addressId, {
      onSuccess: () => {
        toast.success('Address deleted successfully');
        refetchAddresses();
        if (selectedAddress?.id === addressId) {
          setSelectedAddress(null);
        }
      },
      onError: (error) => {
        toast.error(error.response?.data || 'Failed to delete address');
      }
    });
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
      address: formatAddress(selectedAddress),
      paymentMode,
      items: cartItems.map((item) => ({
        productId: item.itemId - item.tagNo,
        productName: item.productName,
        price: parseFloat(item.price),
        itemId: item.itemId,
        tagNo: item.tagNo,
        sno: item.sno,
        imagePath: item.imagePath,
        quantity: item.quantity,
      })),
    };

    createOrder(orderPayload, {
      onSuccess: (data) => {
        if (paymentMode === 'ONLINE') {
          if (data.orderId) {
            history.push(`/payment/${data.orderId}`);
          } else {
            toast.error('Order created but orderId not returned.');
          }
        } else {
          history.push('/orders', { state: { orderSuccess: true } });
        }
      },
      onError: (error) => {
        console.error('Order creation failed:', error);
        toast.error('Failed to create order: ' + error.message);
      },
    });
  }, [cartItems, totalAmount, selectedAddress, profile?.email, paymentMode, history, createOrder, formatAddress]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="shopify-checkout-root">
      <div className="shopify-checkout-main">
        <div className="order-summary-toggle-mobile">
          <button
            className="order-summary-toggle-btn"
            onClick={() => setSummaryOpen(!summaryOpen)}
            aria-expanded={summaryOpen}
            aria-controls="orderSummaryMobile"
          >
            <span>Show order summary</span>
            <span className="order-summary-toggle-total">
              <span className="order-summary-toggle-currency">INR</span> ₹
              {totalAmount.toFixed(2)}
            </span>
            <span className="order-summary-toggle-arrow">{summaryOpen ? '▲' : '▼'}</span>
          </button>
          <div
            className={`order-summary-mobile-panel${summaryOpen ? ' open' : ''}`}
            id="orderSummaryMobile"
            aria-hidden={!summaryOpen}
          >
            <OrderSummaryContent items={cartItems} subtotal={subtotal} total={totalAmount} />
          </div>
        </div>
        <div className="shopify-checkout-form">
          <form>
            <section className="section-block">
              <div className="checkout-row between">
                <h2 className="section-title">Contact</h2>
                {profileLoading ? (
                  <span>Loading...</span>
                ) : profile?.contactNumber ? (
                  <span className="contact-email">{profile.contactNumber}</span>
                ) : (
                  <Link className="checkout-login-link" to="/login">
                    Log in
                  </Link>
                )}
              </div>
              {profileLoading ? (
                <input className="checkout-input" disabled placeholder="Loading..." />
              ) : (
                <input
                  className="checkout-input"
                  type="tel"
                  name="contactNumber"
                  placeholder="Contact Number"
                  value={profile?.contactNumber || ''}
                  disabled
                />
              )}
            </section>

            {/* Enhanced Address Section */}
            <section className="section-block">
              <div className="checkout-row between">
                <h2 className="section-title">Delivery Address</h2>
                <button
                  type="button"
                  className="checkout-add-address-btn"
                  onClick={() => setShowAddressModal(true)}
                >
                  {addresses?.length ? 'Change' : 'Add Address'}
                </button>
              </div>

              {addressesLoading ? (
                <div className="text-center py-4">Loading addresses...</div>
              ) : selectedAddress ? (
                <div className="selected-address-container">
                  <AddressView
                    address={selectedAddress}
                    variant="default"
                    className="checkout-selected-address"
                  />
                </div>
              ) : (
                <div className="no-address-placeholder border rounded p-4 text-center">
                  <p className="mb-3">No delivery address selected</p>
                  <Button
                    variant="primary"
                    onClick={() => setShowAddressModal(true)}
                  >
                    Add Delivery Address
                  </Button>
                </div>
              )}
            </section>

            <section className="section-block">
              <h2 className="section-title">Payment</h2>
              <div className="checkout-payment-hint">
                All transactions are secure and encrypted.
              </div>
              <div className="checkout-payment-wrapper">
                <div className="checkout-payment-tab">
                  <select
                    className="checkout-input payment-select"
                    value={paymentMode}
                    onChange={handlePaymentChange}
                  >
                    <option value="ONLINE">Online Payment</option>
                    <option value="CASH">Cash on Delivery</option>
                  </select>
                </div>
              </div>
              <div className="pay-now-btn-container">
                <button
                  type="button"
                  className="main-btn btn-filled pay-now-btn"
                  onClick={submitOrder}
                  disabled={!selectedAddress}
                >
                  {selectedAddress ? `Pay Now (₹${totalAmount.toFixed(2)})` : 'Select Address to Proceed'}
                </button>
              </div>
            </section>
          </form>
        </div>
        <div className="shopify-checkout-summary">
          <OrderSummaryContent items={cartItems} subtotal={subtotal} total={totalAmount} />
          <button
            onClick={submitOrder}
            className="main-btn btn-filled pay-now-btn"
            disabled={!selectedAddress}
          >
            {selectedAddress ? `Pay Now (₹${totalAmount.toFixed(2)})` : 'Select Address to Proceed'}
          </button>
        </div>
      </div>

      {/* Address Modal */}
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

export default withRouter(Checkout);