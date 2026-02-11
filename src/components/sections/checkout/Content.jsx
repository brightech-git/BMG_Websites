import React, { useState, useEffect, useCallback ,useMemo} from 'react';
import { Modal, Button, Badge, Form, InputGroup } from 'react-bootstrap';
import { Check, Plus, Edit, Trash2, Phone, Home, ShoppingBag, MapPin, User, CreditCard } from 'lucide-react';
import { useCreateOrder } from '../../../hook/order/useOrderMutation';
import { useCurrentProfile } from '../../../hook/userProfile/useUserProfileQuery';
import { useCreateAddress, useUpdateAddress, useAddressesByCustomer, useDeleteAddress } from '../../../hook/address/useNewAddress';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash, faPhone } from '@fortawesome/free-solid-svg-icons';
import GeoLocationPicker from '../../address/GeoLocationPicker';
import SmartButton from '../../ui/SmartButton';
import { useAddressesByPincode } from '../../../hook/address/useGetAddressByPincode';
import { useNavigate } from 'react-router-dom';
import { useCheckShippingPrice } from '../../../hook/pincode/usePincode';
import { usePincode } from '../../../context/pinocde/PincodeContext';
import  {getImage} from '../../../utils/getProductImages';
import { formatCurrency } from '../../../utils/formatters';
// Enhanced Progress Stepper with Icon-Centered Dividers
const ProgressStepper = ({ currentStep }) => {
  const steps = [
    { id: 1, name: 'Delivery Address', icon: MapPin },
    { id: 2, name: 'Order Summary', icon: ShoppingBag },
    { id: 3, name: 'Payment Method', icon: CreditCard }
  ];

  return (
    <div className="w-full py-2 bg-transparent">
      <div className="flex items-start justify-between max-w-4xl mx-auto relative">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          const isLastStep = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center relative z-10 flex-1">
                <div className="flex flex-col items-center text-center gap-2 relative z-20">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center relative transition-all duration-300
                    border-2 ${isCompleted ? 'border-[#116e05] bg-[#116e05] shadow-lg shadow-green-500/30' :
                      isActive ? 'border-[#f16137] bg-[#f16137]' : 'border-gray-300 bg-white shadow-sm'}
                  `}>
                    {isCompleted ? (
                      <div className="text-white">
                        <Check size={18} />
                      </div>
                    ) : (
                      <div className={`${isActive ? 'text-white' : 'text-gray-600'}`}>
                        <Icon size={18} />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 mt-2">
                    {/* <span className="text-xs font-medium uppercase tracking-wider text-gray-700">
                      Step {step.id}
                    </span> */}
                    <span className={`
                     text-xs sm:text-sm font-medium whitespace-nowrap
                      ${isCompleted ? 'text-[#116e05] font-semibold' :
                        isActive ? 'text-[#041f60] font-semibold' : 'text-gray-700'}
                    `}>
                      {step.name}
                    </span>
                  </div>
                </div>

                {!isLastStep && (
                  <div className="absolute top-6 left-1/2 right-[-50%] h-0.5 -translate-y-1/2 z-0">
                    <div className={`
                      h-0.5 w-full transition-all duration-300
                      ${isCompleted ? 'bg-[#116e05]' : 'bg-gray-300'}
                    `}></div>
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// Address Modal
const AddressModal = ({ show, onHide, addresses, selectedAddress, onSelectAddress, onSaveAddress, onDeleteAddress, customerProfile, onPincodeChange, pincodeAddress }) => {
  const [clear, setClear] = useState(false);
  const [mode, setMode] = useState('list');
  const [currentAddress, setCurrentAddress] = useState(null);
  const [showPostOfficeList, setShowPostOfficeList] = useState(false);
  const [pincodeVerified, setPincodeVerified] = useState(false);
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

  const postOffices = pincodeAddress?.[0]?.PostOffice || [];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  useEffect(() => {
    if (postOffices.length > 0) {
      setPincodeVerified(false);
      setShowPostOfficeList(false);
    }
  }, [postOffices]);

  useEffect(() => {
    if (!/^\d{6}$/.test(formData.pincode)) {
      setShowPostOfficeList(false);
      setPincodeVerified(false);
      onPincodeChange(null);
      return;
    }
    onPincodeChange(formData.pincode);
  }, [formData.pincode]);

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

  const handleClear = () => {
    setFormData({
      name: '',
      phone: '',
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
    setClear(true);
  };

  const handlePostOfficeSelect = (po) => {
    setFormData(prev => ({
      ...prev,
      city: po.District || '',
      state: po.State || '',
      country: po.Country || 'India',
      locality: po.Name || '',
      pincode: po.Pincode || prev.pincode,
    }));
    setShowPostOfficeList(false);
  };

  const handleGeoFill = (geoRes) => {
    setFormData(prev => ({
      ...prev,
      addressLine: geoRes.addressLine || prev.addressLine,
      city: geoRes.city || prev.city,
      state: geoRes.state || prev.state,
      pincode: geoRes.pincode || prev.pincode,
      locality: geoRes.locality || prev.locality,
      landmark: geoRes.landmark || prev.landmark,
      latitude: geoRes.latitude,
      longitude: geoRes.longitude
    }));
    setClear(true);
  };

  const handleEdit = (address) => {
    setCurrentAddress(address);
    setShowPostOfficeList(false);
    setPincodeVerified(true);
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
    setClear(true);
    setMode('list');
  };

  const handleDelete = (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      onDeleteAddress(addressId);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered className="!max-w-2xl ">
      <Modal.Header closeButton className="border-b border-gray-200 px-2 py-2 gap-2">
        <Modal.Title className="font-semibold text-lg text-[#041f60]">
          {mode === 'list' ? 'Select Address' : mode === 'add' ? 'Add Address' : 'Edit Address'}
        </Modal.Title>
        {mode !== 'list' && <GeoLocationPicker onAddressSelected={handleGeoFill} clear={clear} />}
      </Modal.Header>
      <Modal.Body className="px-2 py-2">
        {mode === 'list' ? (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {addresses.map(address => (
              <div key={address.id} className={`
                border rounded-lg transition-all duration-200
                ${selectedAddress?.id === address.id ? 'border-[#f16137] ring-1 ring-[#f16137]' : 'border-gray-200'}
              `}>
                <div className="p-3">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <h6 className="font-semibold text-[#041f60]">{address.name}</h6>
                      {address.isDefault && (
                        <Badge className="bg-[#024908] text-white text-xs px-2 py-1 rounded">Default</Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="w-8 h-8 rounded-lg bg-gray-100 text-[#023a72] flex items-center justify-center hover:bg-gray-200 transition-colors"
                        onClick={() => handleEdit(address)}
                        title="Edit address"
                      >
                        <FontAwesomeIcon icon={faPen} size="sm" />
                      </button>
                      {!address.isDefault && (
                        <button
                          className="w-8 h-8 rounded-lg bg-gray-100 text-red-600 flex items-center justify-center hover:bg-red-50 transition-colors"
                          onClick={() => handleDelete(address.id)}
                          title="Delete address"
                        >
                          <FontAwesomeIcon icon={faTrash} size="sm" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1 text-sm text-gray-700">
                    <p>{address.addressLine}</p>
                    <p>{[address.locality, address.city].filter(Boolean).join(', ')}</p>
                    <p>{address.state} - {address.pincode}, {address.country || 'India'}</p>
                    {address.landmark && <p className="text-gray-600">Landmark: {address.landmark}</p>}
                    <p className="flex items-center gap-2 mt-2 text-gray-800">
                      <FontAwesomeIcon icon={faPhone} size="sm" className="text-[#f16137]" /> {address.phone}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <SmartButton
                      variant={selectedAddress?.id === address.id ? 'success' : 'outline-primary'}
                      onClick={() => { onSelectAddress(address); onHide(); }}
                      className="w-full flex flex-row"
                      children={ selectedAddress?.id === address.id ? (
                        <>
                          {/* <Check size={16} />  */}
                          Selected
                        </>
                      ) : (
                        'Deliver Here'
                      )}
                    />
                     
                   
                  </div>
                </div>
              </div>
            ))}
            <button
              className="w-full py-3 border-2 border-dashed border-[#f16137] rounded-lg text-[#f16137] font-medium hover:border-solid hover:bg-[#f16137]/5 transition-all duration-200 flex items-center justify-center gap-2"
              onClick={handleAddNew}
            >
              <Plus size={16} /> Add New Address
            </button>
          </div>
        ) : (
          <Form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Group>
                <Form.Label className="font-medium text-sm text-[#041f60] mb-1">Full Name*</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border-gray-300 focus:border-[#f16137] focus:ring-[#f16137] rounded-lg h-10 transition-colors"
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label className="font-medium text-sm text-[#041f60] mb-1">Phone Number*</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                    className="border-gray-300 h-10 focus:border-[#f16137] focus:ring-[#f16137] rounded-lg transition-colors"
                  pattern="[0-9]{10}"
                  required
                />
              </Form.Group>
            </div>

            <Form.Group>
              <Form.Label className="font-medium text-sm text-[#041f60] mb-1">Address Line*</Form.Label>
              <Form.Control
                as="textarea"
                name="addressLine"
                value={formData.addressLine}
                onChange={handleChange}
                  className="border-gray-300 focus:border-[#f16137] focus:ring-[#f16137] rounded-lg h-20 transition-colors min-h-[80px]"
                rows={3}
                required
              />
            </Form.Group>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Group className="relative">
                  <Form.Label className="font-medium text-sm   text-[#041f60] mb-1">Pincode*</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    pattern="[0-9]{6}"
                    maxLength={6}
                      className="border-gray-300 focus:border-[#f16137] h-10 focus:ring-[#f16137] rounded-lg transition-colors"
                    required
                  />
                  {postOffices.length > 0 && (
                    <InputGroup.Text
                      role="button"
                      className="bg-white border-gray-300 cursor-pointer"
                      onClick={() => {
                        setShowPostOfficeList(prev => !prev);
                        setPincodeVerified(true);
                      }}
                    >
                      <Check className="text-[#024908]" size={16} />
                    </InputGroup.Text>
                  )}
                </InputGroup>

                {/^\d{6}$/.test(formData.pincode) && showPostOfficeList && postOffices.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto mt-1">
                    {postOffices.map((po, index) => (
                      <div
                        key={index}
                        className="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => handlePostOfficeSelect(po)}
                      >
                        <div className="font-medium text-gray-800">{po.Name}</div>
                        <div className="text-xs text-gray-600">
                          {po.Block}, {po.District}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Form.Group>

              <Form.Group>
                <Form.Label className="font-medium text-sm text-[#041f60] mb-1">Locality*</Form.Label>
                <Form.Control
                  type="text"
                  name="locality"
                  value={formData.locality}
                  onChange={handleChange}
                    className="border-gray-300 focus:border-[#f16137] h-10 focus:ring-[#f16137] rounded-lg transition-colors"
                  required
                />
              </Form.Group>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Group>
                <Form.Label className="font-medium text-sm text-[#041f60] mb-1">District*</Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                    className="border-gray-300 focus:border-[#f16137] h-10 focus:ring-[#f16137] rounded-lg transition-colors"
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label className="font-medium text-sm text-[#041f60] mb-1">State*</Form.Label>
                <Form.Control
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                    className="border-gray-300 focus:border-[#f16137] h-10 focus:ring-[#f16137] rounded-lg transition-colors"
                  required
                />
              </Form.Group>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Group>
                <Form.Label className="font-medium text-sm text-[#041f60] mb-1">Landmark</Form.Label>
                <Form.Control
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleChange}
                    className="border-gray-300 focus:border-[#f16137] h-10 focus:ring-[#f16137] rounded-lg transition-colors"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label className="font-medium text-sm text-[#041f60] mb-1">Mobile 2</Form.Label>
                <Form.Control
                  type="text"
                  name="alternatePhone"
                  value={formData.alternatePhone}
                  onChange={handleChange}
                    className="border-gray-300 focus:border-[#f16137] h-10 focus:ring-[#f16137] rounded-lg transition-colors"
                  pattern="[0-9]{10}"
                />
              </Form.Group>
            </div>

            <Form.Group className="flex items-center gap-2">
              <Form.Check
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
                className="!border-gray-300 !rounded focus:ring-[#f16137]"
              />
              <Form.Label className="text-sm text-gray-700 mb-0">Set as default address</Form.Label>
            </Form.Group>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <SmartButton
                onClick={handleClear}
                className="px-4 py-2 rounded-lg font-medium"
              >
                Clear
              </SmartButton>
                <SmartButton
                onClick={() => setMode('list')}
                className="px-4 py-2 rounded-lg font-medium"
              >
                Cancel
                </SmartButton>
                <SmartButton
                type="submit"
                className="px-4 py-2 rounded-lg font-medium bg-[#f16137] border-[#f16137] hover:bg-[#d3542e]"
              >
                {currentAddress ? 'Update' : 'Save'}
                </SmartButton>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

// Order Summary Panel
const OrderSummaryPanel = ({
  items = [],
  subtotal = 0,
  shippingFee = 0,
  total = 0,
  isCompact = false
}) => {
  console.log(items,'itemsitems')
  const formatCurrency = (value) => {
    if (typeof value !== 'number' || isNaN(value)) return '₹0.00';
    return `₹${value.toFixed(2)}`;
  };

  

  const getSafeImagePath = (item) => {
    const imagePath = getImage(item?.imagePath) || item?.image;
    if (!imagePath || typeof imagePath !== 'string') {
      return 'https://via.placeholder.com/40x40';
    }
    return imagePath;
  };

  const getProductName = (item) => {
    return item?.productName || item?.name || item?.itemName || 'Product Name Unavailable';
  };

  const getSkuText = (item) => {
    const itemId = item?.itemId;
    const tagNo = item?.tagNo;
    if (itemId && tagNo) return `SKU: ${itemId}-${tagNo}`;
    else if (itemId) return `SKU: ${itemId}`;
    else if (tagNo) return `Tag: ${tagNo}`;
    return 'SKU: Not Available';
  };

  const getWeightText = (item) => {
    const weight = item?.weight;
    if (typeof weight === 'number' && !isNaN(weight)) {
      return `Weight: ${weight.toFixed(3)}`;
    }
    return null;
  };

  const itemCount = Array.isArray(items) ? items.length : 0;
  const itemCountText = `${itemCount} item${itemCount !== 1 ? 's' : ''}`;
  const shippingText = shippingFee === 0 ? 'Free' : formatCurrency(shippingFee);

  return (
    <div className={`
      bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden
      ${isCompact ? 'p-2' : 'p-3'}
    `}>
      <div className="flex justify-between items-center mb-2 pb-1 border-b border-gray-200">
        <h4 className="font-semibold text-lg text-[#041f60] flex items-center gap-2">
          <ShoppingBag size={18} className="text-[#f16137]" />
          Order Summary
        </h4>
        {itemCount > 0 && (
          <span className="bg-[#f16137] text-white text-xs font-medium px-3 py-1 rounded-full">
            {itemCountText}
          </span>
        )}
      </div>

      {itemCount > 0 ? (
        <div className="space-y-2 mb-3">
          {items.map((item, index) => {
            const weightText = getWeightText(item);
            return (
              <div key={item?.id || index} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                  <img
                    src={getSafeImagePath(item)}
                    alt={getProductName(item)}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/40x40';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h6 className="font-medium text-sm text-[#041f60] truncate">{getProductName(item)}</h6>
                  <p className="text-xs text-gray-600 mt-1">{getSkuText(item)}</p>
                  {weightText && (
                    <p className="text-xs text-gray-600">{weightText}</p>
                  )}
                </div>
                <div className="font-semibold text-sm text-[#f16137] whitespace-nowrap">
                  {formatCurrency(item?.price)}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-3 text-center">
          <p className="text-gray-500">No items in order</p>
        </div>
      )}

      <div className="space-y-2 pt-2 border-t border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-700">Subtotal</span>
          <span className="font-medium text-gray-900">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-700">Shipping</span>
          <span className={shippingFee === 0 ? "font-medium text-[#024908]" : "font-medium text-gray-900"}>
            {shippingText}
          </span>
        </div>
        <div className="flex justify-between text-base pt-3 border-t border-gray-200">
          <span className="font-semibold text-[#041f60]">Total</span>
          <span className="font-bold text-sm text-[#f16137]">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
};

// Main Checkout Component
const EnhancedCheckout = ({ initialCartItems, subtotal }) => {

  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [totalAmount, setTotalAmount] = useState();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMode, setPaymentMode] = useState('ONLINE');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [pincode, setPincode] = useState(null);
  const [shippingFee ,setShippingFee] = useState();



  const { data: profile, isLoading: profileLoading } = useCurrentProfile();
  const { data: addressByPincode } = useAddressesByPincode(pincode);
  const { pincode: storedPincode } = usePincode();
  const { data: addresses, isLoading: addressesLoading, refetch: refetchAddresses } = useAddressesByCustomer(profile?.id);
  const { mutate: createOrderMutation } = useCreateOrder(navigate);

  const { mutate: createAddress } = useCreateAddress();
  const { mutate: updateAddress } = useUpdateAddress();
  const { mutate: deleteAddress } = useDeleteAddress();
  console.log(storedPincode,'storedPincode')

  const finalPincode = selectedAddress?.pincode || storedPincode || pincode || null;

  const totalWeight = useMemo(() => {
    if (!cartItems?.length) return 0;

    return cartItems.reduce((total, item) => {
      return total + (item.weight || 0);
    }, 0);
  }, [cartItems]);

  console.log(finalPincode, totalWeight,'finalPincode, totalWeight')

  const {
    data: shippingData,
    isLoading: shippingLoading,
    error: shippingError
  } = useCheckShippingPrice(finalPincode, totalWeight);


  console.log(shippingData,'shippingData')
  useEffect(() => {
    if (shippingData?.totalAmount) {
      setShippingFee(shippingData.totalAmount);
      setTotalAmount(subtotal + shippingData.totalAmount);
    }
  }, [shippingData, subtotal]);
  
  console.log(selectedAddress?.
    pincode,'selectedAddress')




  useEffect(() => {
    const storedCart = localStorage.getItem('cartitems');
    if (!cartItems.length && storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        setCartItems(parsedCart.items || []);
        setTotalAmount(parsedCart.totalAmount.toFixed(2) || 0);
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  const handleSaveAddress = (addressData) => {
    const payload = { ...addressData, customerId: profile.id };
    if (addressData.id) {
      updateAddress({ id: addressData.id, addressData: payload }, {
        onSuccess: () => { refetchAddresses(); },
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
      paymentMode,
      paymentStatus:"PENDING",
      shippingPincode: finalPincode,
      // shippingFee: parseFloat(shippingFee) || 0,
      address: {
        addressLine: `${selectedAddress.addressLine} ${selectedAddress.locality || ''} ${selectedAddress.city || ''} ${selectedAddress.state || ''} ${selectedAddress.country || ''} - ${selectedAddress.pincode || ''}`,
        // locality: selectedAddress.locality,
        // landmark: selectedAddress.landmark,
        // name: selectedAddress.name,
        // phone: selectedAddress.phone,
        // alternatePhone: selectedAddress.alternatePhone,
        // isDefault: selectedAddress.isDefault,
        // id: selectedAddress.id,
        // customerId: selectedAddress.customerId,
        // gstNumber: selectedAddress.gstNumber,
        // companyName: selectedAddress.companyName,
        city: selectedAddress.city,
        state: selectedAddress.state,
        country: selectedAddress.country || "India",
        pincode: selectedAddress.pincode,
      },

      items: cartItems.map((item) => ({
        productId: `${item.itemId}-${item.tagNo}`,
        productName: item.productName,
        price: parseFloat(item.price),
        grossAmount: parseFloat(item.price),
        itemId: item.itemId,
        tagNo: item.tagNo,
        sno: item.sno,
        netWt:item.weight,
        grsWt:item.weight,
        imagePath: item.imagePath,
        quantity: item.quantity,
        gstType: item.gstType,
        gstPer: parseFloat(item.gstPer),
        gstAmount: Number(item.gstAmount) || 0,


      })),
    };

    localStorage.setItem('order', JSON.stringify(orderPayload));

    createOrderMutation(orderPayload);

  }, [
    cartItems,
    totalAmount,
    selectedAddress,
    profile?.email,
    paymentMode,
    shippingFee,
    finalPincode,
    createOrderMutation
  ]);

  return (
    <div className="min-h-screen bg-[#eeece8] font-sans text-[#041f60] mt-[150px] sm:mt-[130px]">
      {/* Mobile Order Toggle */}
      <div className="lg:hidden p-4">
        <button
          className="w-full bg-white rounded-lg border border-gray-200 p-3 flex justify-between items-center shadow-sm"
          onClick={() => setSummaryOpen(!summaryOpen)}
        >
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">Order Summary</span>
            <span className="text-xs">{summaryOpen ? '▲' : '▼'}</span>
          </div>
          {/* <div className="font-bold text-[#f16137]">₹{totalAmount.toFixed(2)}</div> */}
        </button>
        {summaryOpen && (
          <div className="mt-2 animate-fadeIn">
            <OrderSummaryPanel
              items={cartItems}
              subtotal={subtotal}
              total={totalAmount}
              isCompact
              shippingFee={shippingFee}
            />
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-3 py-2 lg:grid lg:grid-cols-1 lg:gap-3 xl:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          {/* Progress Stepper */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1">
            <ProgressStepper currentStep={currentStep} />
          </div>

          {/* Step Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="border-b border-gray-200 ">
                    <h3 className="text-lg font-semibold text-[#041f60] flex items-center gap-2">
                      <MapPin size={16} className="text-[#f16137]"  />
                      Delivery Address
                    </h3>
                  </div>

                  <div className="bg-[#eeece8] rounded-lg p-2">
                    <div className="flex items-center gap-3">
                      <User size={16} className="text-[#f16137]" />
                      <div>
                        <span className="font-medium text-sm">Contact: </span>
                        <span className="font-semibold text-gray-900">
                          {profileLoading ? 'Loading...' : profile?.contactNumber || 'Not provided'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {addressesLoading ? (
                    <div className="flex flex-col items-center justify-center py-4">
                      <div className="w-8 h-8 border-2 border-[#f16137] border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-gray-600">Loading addresses...</p>
                    </div>
                  ) : selectedAddress ? (
                    <div className="space-y-4">
                      <div
                        className="border border-gray-200 rounded-lg p-4 hover:border-[#f16137] transition-colors cursor-pointer"
                        onClick={() => setShowAddressModal(true)}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <h6 className="font-semibold text-[#041f60]">{selectedAddress.name}</h6>
                            {selectedAddress.isDefault && (
                              <span className="bg-[#024908] text-white text-xs px-2 py-1 rounded">Default</span>
                            )}
                          </div>
                        </div>
                        <div className="space-y-1 text-sm text-gray-700">
                          <p>{selectedAddress.addressLine}</p>
                          <p>{selectedAddress.locality}, {selectedAddress.city}</p>
                          <p>{selectedAddress.state} - {selectedAddress.pincode}</p>
                          <p className="flex items-center gap-2 mt-2 text-gray-800">
                            <Phone size={14} className="text-[#f16137]" /> {selectedAddress.phone}
                          </p>
                        </div>
                      </div>
                      <button
                        className="w-full py-2 border border-[#f16137] text-[#f16137] rounded-lg font-medium hover:bg-[#f16137] hover:text-white transition-colors"
                        onClick={() => setShowAddressModal(true)}
                      >
                        Change Address
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MapPin size={48} className="text-gray-400 mx-auto mb-4" />
                      <h5 className="font-medium text-gray-900 mb-2">No address selected</h5>
                      <p className="text-gray-600 mb-4">Add a delivery address to continue</p>
                      <button
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#f16137] text-white rounded-lg font-medium hover:bg-[#d3542e] transition-colors"
                        onClick={() => setShowAddressModal(true)}
                      >
                        <Plus size={16} /> Add Address
                      </button>
                    </div>
                  )}
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-3">
                  <div className="border-b border-gray-200 ">
                    <h3 className="text-lg font-semibold text-[#041f60] flex items-center gap-2">
                      <ShoppingBag size={18} className="text-[#f16137]" />
                      Order Summary
                    </h3>
                  </div>
                  <OrderSummaryPanel items={cartItems} subtotal={subtotal} total={totalAmount} shippingFee={shippingFee} />
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-3">
                  <div className="border-b border-gray-200 ">
                    <h3 className="text-lg font-semibold text-[#041f60] flex items-center gap-2">
                      <CreditCard size={18} className="text-[#f16137]" />
                      Payment Method
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 bg-[#eeece8] p-2 rounded-lg">
                      All transactions are secure and encrypted.
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          id="online"
                          name="payment"
                          value="ONLINE"
                          checked={paymentMode === 'ONLINE'}
                          onChange={(e) => setPaymentMode(e.target.value)}
                          className="w-4 h-4 text-[#f16137] focus:ring-[#f16137] border-gray-300"
                        />
                        <label htmlFor="online" className="flex-1 cursor-pointer">
                          <div className={`
                            border rounded-lg p-3 transition-all duration-200
                            ${paymentMode === 'ONLINE' ? 'border-[#f16137] bg-[#f16137]/5' : 'border-gray-200 hover:border-gray-300'}
                          `}>
                            <div className="flex items-center gap-2">
                              <CreditCard size={16} className={paymentMode === 'ONLINE' ? 'text-[#f16137]' : 'text-gray-600'} />
                              <span className="font-medium">Online Payment</span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1 ml-6">UPI, Cards, Net Banking</p>
                          </div>
                        </label>
                      </div>

                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          id="cod"
                          name="payment"
                          value="COD"
                          checked={paymentMode === 'COD'}
                          onChange={(e) => setPaymentMode(e.target.value)}
                          className="w-4 h-4 text-[#f16137] focus:ring-[#f16137] border-gray-300"
                        />
                        <label htmlFor="cod" className="flex-1 cursor-pointer">
                          <div className={`
                            border rounded-lg p-3 transition-all duration-200
                            ${paymentMode === 'COD' ? 'border-[#f16137] bg-[#f16137]/5' : 'border-gray-200 hover:border-gray-300'}
                          `}>
                            <div className="flex items-center gap-2">
                              <Home size={16} className={paymentMode === 'COD' ? 'text-[#f16137]' : 'text-gray-600'} />
                              <span className="font-medium">Cash on Delivery</span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1 ml-6">Pay on delivery</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="bg-[#eeece8] rounded-lg p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700">Subtotal</span>
                          <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700">Shipping</span>
                          <span className="font-medium text-[#024908]">{shippingFee > 0 ? `₹${shippingFee.toFixed(2)}` : 'FREE'}</span>
                        </div>
                        <div className="flex justify-between text-base pt-2 border-t border-gray-300">
                          <span className="font-semibold">Total</span>
                          <span className="font-bold text-lg text-[#f16137]">₹{totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Step Controls */}
            <div className="border-t border-gray-200 p-6">
              <div className="flex justify-between">
                {currentStep > 1 && (
                  <SmartButton
                    variant='outline'
                    size='md'
                    onClick={handlePrevStep}
                    className="border-gray-300 text-gray-700 hover:border-gray-400"
                  >
                    Back
                  </SmartButton>
                )}
                {currentStep < 3 ? (
                  <SmartButton
                    onClick={handleNextStep}
                    size='lg'
                    isDisabled={currentStep === 1 && !selectedAddress}
                    className="ml-auto bg-[#f16137] hover:bg-[#d3542e]"
                  >
                    Continue
                  </SmartButton>
                ) : (
                  <SmartButton
                    size='md'
                    variant='success'
                    onClick={submitOrder}
                    isDisabled={!selectedAddress}
                    className="ml-auto bg-[#024908] hover:bg-[#013506]"
                  >
                      Place Order - ₹{formatCurrency(totalAmount)}
                  </SmartButton>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Order Summary */}
        <div className="hidden lg:block lg:sticky lg:top-4 lg:self-start">
          <OrderSummaryPanel
            items={cartItems}
            subtotal={subtotal}
            shippingFee={shippingFee}
            total={totalAmount}

          />
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
        onPincodeChange={setPincode}
        pincodeAddress={addressByPincode}
      />
    </div>
  );
};

export default EnhancedCheckout;