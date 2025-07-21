import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { useCreateOrder } from '../../../hook/order/useOrderMutation';
import { useCurrentProfile } from '../../../hook/userProfile/useUserProfileQuery';
import { useCreateAddress, useUpdateAddress, useAddressesByCustomer } from '../../../hook/address/useAddress';
import AddressSection from './address/AddressSection';
import AddressModal from './address/AddressModal';
import "./Checkout.css";

const Checkout = ({ location, history }) => {
  const { state: checkoutPayload } = location || {};
  const { items: cartItems, totalAmount } = checkoutPayload || { items: [], totalAmount: 0 };
  console.log(cartItems,'catss')
  const { data: profile, isLoading: profileLoading } = useCurrentProfile();
  const { data: addresses, refetch: refetchAddresses, isLoading: addressesLoading } = useAddressesByCustomer(profile?.id);
  const { mutate: createAddress, isLoading: creatingAddress } = useCreateAddress();
  const { mutate: updateAddress, isLoading: updatingAddress } = useUpdateAddress();
  const { mutate: createOrder } = useCreateOrder();
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);

  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const defaultAddress = addresses.find(a => a.isDefault);
      setSelectedAddress(defaultAddress ? defaultAddress.id : addresses[0].id);
    }
  }, [addresses]);

  const handleEdit = (addressId) => {
    setSelectedAddress(addressId);
    setShowForm(true);
  };

  const handleAdd = () => {
    setSelectedAddress(null);
    setShowForm(true);
  };

  const handleSave = (formData) => {
    const addressData = {
      ...formData,
      customerId: profile?.id,
      name: formData.name,
      phone: formData.phone,
      addressLine: formData.addressLine,
      pincode: formData.pincode,
      locality: formData.locality,
      landmark: formData.landmark,
      city: formData.city,
      state: formData.state,
      alternatePhone: formData.alternatePhone,
      isDefault: formData.isDefault,
    };

    const afterAddressSave = async () => {
      await refetchAddresses();
      setShowForm(false);
      if (formData.addressId) {
        setSelectedAddress(formData.addressId);
      } else {
        const newAddresses = await refetchAddresses();
        const newAddress = newAddresses.data.find(a => a.addressLine === formData.addressLine);
        setSelectedAddress(newAddress?.id);
      }
    };

    if (formData.addressId) {
      updateAddress(
        { id: formData.addressId, address: addressData },
        {
          onSuccess: afterAddressSave,
          onError: (error) => {
            console.error('Failed to update address:', error);
            alert('Failed to update address. Please try again.');
          }
        }
      );
    } else {
      createAddress(addressData, {
        onSuccess: afterAddressSave,
        onError: (error) => {
          console.error('Failed to create address:', error);
          alert('Failed to create address. Please try again.');
        }
      });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    if (addresses && addresses.length > 0) {
      const defaultAddress = addresses.find(a => a.isDefault);
      setSelectedAddress(defaultAddress ? defaultAddress.id : addresses[0].id);
    }
  };

  const handleChangeAddress = () => {
    if (addresses && addresses.length > 0) {
      setShowAddressModal(true);
    } else {
      handleAdd(); // If no addresses, open form to add new address
    }
  };

  const handleSelectAddress = (addressId) => {
    setSelectedAddress(addressId);
    setShowAddressModal(false);
  };

  const formatAddress = (address) => {
    return `${address.addressLine}, ${address.city}, ${address.state}, ${address.pincode}, ${address.country || 'India'}`;
  };

  const paymentMode = "ONLINE";

  const submitOrder = () => {
    if (!selectedAddress) {
      alert('Please select a delivery address');
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    const shippingAddress = addresses?.find(a => a.id === selectedAddress);

    const orderPayload = {
      customerName: shippingAddress.name,
      contact: shippingAddress.phone,
      email: profile?.email,
      totalAmount,
      address: formatAddress(shippingAddress),
      paymentMode,
      items: cartItems.map(item => ({
        productId: item.itemId - item.tagNo,
        productName: item.productName,
        price: parseFloat(item.price),
        itemId: item.itemId,
        tagNo: item.tagNo,
        sno: item.sno,
        imagePath: item.imagePath,
        quantity: item.quantity,
      })),
      shippingAddressId: selectedAddress,
    };

    console.log("Order Payload:", orderPayload); // Debug

    createOrder(orderPayload, {
      onSuccess: (data) => {
        console.log("Order Success:", data); // Debug

        if (paymentMode === 'ONLINE') {
          if (data.orderId) {
            history.push(`/payment/${data.orderId}`);
          } else {
            alert('Order created but orderId not returned.');
          }
        } else {
          history.push('/orders', { state: { orderSuccess: true } });
        }
      },
      onError: (error) => {
        console.error("Order creation failed:", error);
        alert('Failed to create order: ' + error.message);
      },
    });
  };


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
            <span className="order-summary-toggle-arrow">
              {summaryOpen ? "▲" : "▼"}
            </span>
          </button>
          <div
            className={`order-summary-mobile-panel${summaryOpen ? " open" : ""}`}
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
                  value={profile?.contactNumber || ""}
                  disabled
                />
              )}
            </section>
            <AddressSection
              user={profile}
              address={addresses?.find(a => a.id === selectedAddress)}
              showForm={showForm}
              formMode={selectedAddress ? 'edit' : 'add'}
              onEdit={handleEdit}
              onAdd={handleAdd}
              onSave={handleSave}
              onCancel={handleCancel}
              onChangeAddress={handleChangeAddress}
            />
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
                    disabled
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
                  disabled={creatingAddress || updatingAddress || addressesLoading}
                >
                  Pay Now (₹{totalAmount.toFixed(2)})
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
            disabled={creatingAddress || updatingAddress || addressesLoading}
          >
            Pay Now (₹{totalAmount.toFixed(2)})
          </button>
        </div>
        {showAddressModal && (
          <AddressModal
            addresses={addresses || []}
            selectedAddress={selectedAddress}
            onSelectAddress={handleSelectAddress}
            onClose={() => {
              console.log('Checkout: Closing address modal');
              setShowAddressModal(false);
            }}
            onAddNew={() => {
              console.log('Checkout: Adding new address from modal');
              setShowAddressModal(false);
              handleAdd();
            }}
          />
        )}
      </div>
    </div>
  );
};

function OrderSummaryContent({ items, subtotal, total }) {
  return (
    <aside className="checkout-summary-panel">
      {items.map((item, index) => (
        <div key={index} className="summary-product-row">
          <div className="summary-product-thumb-wrap">
            <img
              src={item.imagePath || item.image_path}
              alt={item.productName || item.name}
              className="summary-product-thumb"
            />
          </div>
          <div className="summary-product-details">
            <div className="summary-product-title">{item.productName || item.name}</div>
            <div className="summary-product-desc">{`Qty: ${item.quantity}`}</div>
          </div>
          <div className="summary-product-price">
            ₹{(item.price * item.quantity).toFixed(2)}
          </div>
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
          <div><b>Total</b></div>
          <div><b>₹{total.toFixed(2)}</b></div>
        </div>
      </div>
    </aside>
  );
}

export default withRouter(Checkout);