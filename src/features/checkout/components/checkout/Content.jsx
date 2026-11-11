import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, ChevronDown, CreditCard, Home, LoaderCircle, MapPin, ShoppingBag, Truck } from "lucide-react";
import { toast } from "react-toastify";
import { useCreateOrder } from "../../../orders/hooks/order/useOrderMutation";
import { useCurrentProfile } from "../../../account/hooks/userProfile/useUserProfileQuery";
import { useCreateAddress, useUpdateAddress, useAddressesByCustomer, useDeleteAddress } from "../../../address/hooks/address/useNewAddress";
import { useAddressesByPincode } from "../../../address/hooks/address/useGetAddressByPincode";
import { useCheckPincode, useCheckShippingPrice } from "../../../address/hooks/pincode/usePincode";
import { usePincode } from "../../../../context/pinocde/PincodeContext";
import { getImage } from "../../../../utils/getProductImages";
import { formatCurrency, formatNumber, formatWeight } from "../../../../utils/index.js";
import fallbackImage from "../../../../assets/icons/silverIcon.png";
import { AddressModal } from "../../../address/components/address/AddressModal";
import PaymentOptionsDialog from "./PaymentOption";
import { usePayments } from "../../../payment/hooks/payment/usePaymentOption.js";


const STEPS = ["Delivery", "Review", "Payment"];
const panel = "overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm";
const primary = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-4 text-sm font-bold text-white hover:bg-[var(--brand-hover)] disabled:opacity-50";
const secondary = "inline-flex min-h-11 items-center justify-center rounded-xl border border-orange-200 bg-white px-4 text-sm font-bold text-[var(--brand-hover)] hover:bg-orange-50";

function ProgressStepper({ currentStep, onStepChange, disabled }) {
    return (
        <ol aria-label="Checkout progress" className="m-0 grid list-none grid-cols-3 gap-1 p-0 sm:gap-3">
            {STEPS.map((label, index) => {
                const step = index + 1;
                const complete = step < currentStep;
                const active = step === currentStep;
                const content = (
                    <>
                        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold ${
                            active ? "bg-[var(--brand-primary)] text-white" : "bg-orange-100 text-[var(--brand-hover)]"
                        }`}>
                            {complete ? <Check size={16} aria-label="Completed" /> : step}
                        </span>
                        <span>{label}</span>
                    </>
                );
                const style = `flex min-h-14 w-full flex-col items-center justify-center gap-1 rounded-xl p-1.5 text-xs font-bold sm:flex-row sm:gap-2 sm:text-sm ${
                    active ? "bg-orange-50 text-[var(--brand-hover)]" : "text-stone-600"
                }`;

                return (
                    <li key={label} aria-current={active ? "step" : undefined}>
                        {complete ? (
                            <button
                                type="button"
                                disabled={disabled}
                                onClick={() => onStepChange(step)}
                                className={`${style} hover:bg-orange-50`}
                            >
                                {content}
                            </button>
                        ) : (
                            <span className={style}>{content}</span>
                        )}
                    </li>
                );
            })}
        </ol>
    );
}

function getShippingDisplay({ shippingFee, hasPincode, isLoading, isUnavailable, error }) {
    if (!hasPincode) return "Select a delivery address";
    if (isLoading) return "Checking delivery…";
    if (isUnavailable) return "Delivery unavailable";
    if (error || shippingFee == null) return "Unable to calculate";
    return shippingFee === 0 ? "Free" : formatCurrency(shippingFee);
}

function OrderSummary({ items, subtotal, total, shippingFee, shippingText, showItems = true }) {
    return (
        <div className="space-y-4">
            {showItems && (
                <ul className="m-0 max-h-80 list-none divide-y divide-orange-100 overflow-y-auto p-0">
                    {items.map((item, index) => {
                        const name = item.productName || item.name || item.itemName || "Jewellery";
                        const weight = Number(item.netWt ?? item.weight);
                        return (
                            <li key={item.productId || item.sno || index} className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 py-3 first:pt-0">
                                <img
                                    src={getImage(item.imagePath || item.image, fallbackImage)}
                                    alt=""
                                    loading="lazy"
                                    className="row-span-2 aspect-square w-14 rounded-lg bg-orange-50 object-cover"
                                />
                                <p className="break-words text-sm font-bold">{name}</p>
                                <div className="flex flex-wrap justify-between gap-x-2 gap-y-1 text-sm">
                                    {weight > 0 && <span className="text-stone-600">{formatWeight(weight)}</span>}
                                    <span className="ml-auto font-bold tabular-nums text-[var(--brand-hover)]">
                                        {formatCurrency(item.price)}
                                    </span>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}

            <dl className="m-0 space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                    <dt>Subtotal</dt>
                    <dd className="m-0 font-bold tabular-nums">{formatCurrency(subtotal)}</dd>
                </div>
                <div className="flex justify-between gap-3" role="status">
                    <dt>Delivery</dt>
                    <dd className="m-0 text-right font-bold">{shippingText}</dd>
                </div>
                <div className="flex flex-wrap justify-between gap-2 rounded-xl bg-orange-50 p-3">
                    <dt className="font-bold">{shippingFee == null ? "Subtotal before delivery" : "Order total"}</dt>
                    <dd className="m-0 text-base font-bold tabular-nums text-[var(--brand-hover)]">
                        {formatCurrency(total)}
                    </dd>
                </div>
            </dl>
        </div>
    );
}

const EnhancedCheckout = ({ initialCartItems, subtotal }) => {



  const navigate = useNavigate();
  const [cartItems] = useState(() => {
    if (initialCartItems?.length) return initialCartItems;
    try {
      const storedCart = JSON.parse(localStorage.getItem('cartitems') || 'null');
      return storedCart?.items || [];
    } catch (error) {
      console.error('Failed to parse cart from localStorage:', error);
      return [];
    }
  });



  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMode, setPaymentMode] = useState('ONLINE');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [pincode, setPincode] = useState(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const orderInFlight = useRef(false);

  const { data: profile, isLoading: profileLoading } = useCurrentProfile();
  const { data: addressByPincode } = useAddressesByPincode(pincode);
  const { pincode: storedPincode } = usePincode();
  const { data: addresses, isLoading: addressesLoading, refetch: refetchAddresses } = useAddressesByCustomer(profile?.id);
  const { mutate: createOrderMutation } = useCreateOrder();
  const { mutate: createAddress } = useCreateAddress();
  const { mutate: updateAddress } = useUpdateAddress();
  const { mutate: deleteAddress } = useDeleteAddress();


  const { data: paymentOptions, isLoading: paymentOptionsLoading } = usePayments();
  

  const finalPincode = selectedAddress?.pincode || storedPincode || pincode || null;
  const normalizedFinalPincode = String(finalPincode || '').trim();
  const hasPincode = /^\d{6}$/.test(normalizedFinalPincode);
  const {
    data: pincodeAvailability,
    isLoading: pincodeLoading,
    error: pincodeError
  } = useCheckPincode(hasPincode ? normalizedFinalPincode : '');
  const isPincodeServiceable = pincodeAvailability?.status === true;
  const isPincodeUnavailable = hasPincode && !pincodeLoading &&
    pincodeAvailability?.status === false;

  const totalWeight = useMemo(() => {
    if (!cartItems?.length) return 0;
    return cartItems.reduce((total, item) => total + (Number(item.netWt) || 0), 0);
  }, [cartItems]);

  const {
    data: shippingData,
    isLoading: shippingLoading,
    error: shippingError
  } = useCheckShippingPrice(isPincodeServiceable ? normalizedFinalPincode : null, totalWeight);
  const parsedShippingFee = Number(shippingData?.totalAmount);
  const shippingFee = hasPincode && isPincodeServiceable &&
    shippingData?.totalAmount != null && Number.isFinite(parsedShippingFee)
    ? parsedShippingFee : null;
  const totalAmount = (subtotal || 0) + (shippingFee ?? 0);

  const isShippingLoading = hasPincode &&
    (pincodeLoading || (isPincodeServiceable && shippingLoading));
  const shippingDisplayError = pincodeError || shippingError;
  const shippingDisplayText = getShippingDisplay({
    shippingFee,
    hasPincode,
    isLoading: isShippingLoading,
    isUnavailable: isPincodeUnavailable,
    error: shippingDisplayError
  });

  useEffect(() => {
    if (!Array.isArray(addresses)) return;
    setSelectedAddress((current) =>
      addresses.find((address) => address.id === current?.id) ||
      addresses.find((address) => address.isDefault) ||
      addresses[0] ||
      null
    );
  }, [addresses]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const handleSaveAddress = (addressData) => {
    const payload = { ...addressData, customerId: profile?.id };
    if (addressData.id) {
      updateAddress({ id: addressData.id, addressData: payload }, {
        onSuccess: () => {
          refetchAddresses();
        }

      });
    } else {
      createAddress(payload, {
        onSuccess: () => {
          refetchAddresses();
        },

      });
    }
  };

  const handleDeleteAddress = (addressId) => {
    deleteAddress(addressId, {
      onSuccess: () => {
        refetchAddresses();
        if (selectedAddress?.id === addressId) setSelectedAddress(null);

      },

    });
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }
    if (currentStep === 1 && !hasPincode) {
      toast.error('Please set a valid delivery pincode');
      return;
    }
    if (currentStep === 1 && isShippingLoading) {
      toast.info('Please wait while shipping availability is checked');
      return;
    }
    if (currentStep === 1 && isPincodeUnavailable) {
      toast.error('Delivery is not available for this pincode');
      return;
    }
    if (currentStep === 1 && shippingDisplayError) {
      toast.error('Unable to calculate shipping for this pincode');
      return;
    }
    if (currentStep === 1 && shippingFee == null) {
      toast.info('Please wait for the shipping fee');
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const proceedWithOrder = useCallback(
    (paymentMode, paymentType = null) => {
      if (orderInFlight.current || !selectedAddress || shippingFee == null) return;

      const orderPayload = {
        customerName: selectedAddress.name,
        contact: selectedAddress.phone,
        email: profile?.email,
        totalAmount,
        paymentMode,          // 'ONLINE' or 'COD'
        paymentType,          // only used for online
        paymentStatus: "PENDING",
        shippingPincode: finalPincode,
        address:selectedAddress,
        items: cartItems.map((item) => ({
          itemId: item.itemId,
          productName: item.productName,
          grossAmount: parseFloat(item.grossAmount),
          price: parseFloat(item.price),
          tagNo: item.tagNo,
          sno: item.sno,
          grsWt: parseFloat(item.grsWt),
          netWt: parseFloat(item.netWt),
          imagePath: item.imagePath,
          quantity: item.quantity,
          gstType: item.gstType,
          gstPer: parseFloat(item.gstPer),
          gstAmount: Number(item.gstAmount) || 0,
          ...(item.comboId && {
            comboId: item.comboId,
          }),
        })),
      };



      // Save to localStorage
      localStorage.setItem("order", JSON.stringify(orderPayload));

      orderInFlight.current = true;
      setIsProcessing(true);


      createOrderMutation(orderPayload, {
        onSuccess: (response) => {
          if (!response?.orderId) {
            orderInFlight.current = false;
            setIsProcessing(false);
            toast.error("The order reference was not returned.");
            return;
          }

          if (paymentMode === "ONLINE") {
            navigate(`/payment/${response.orderId}`, {
              state: { orderPayload, paymentMode, paymentType, isOnlinePayment: true },
            });
          } else {
            toast.success("Order placed successfully!");
            navigate(`/payment-success?orderId=${response.orderId}&mode=cod`, {
              state: { orderPayload },
            });
          }
        },
        onError: (error) => {
          orderInFlight.current = false;
          setIsProcessing(false);
          toast.error(error.message || "Failed to create order. Please try again.");
        },
      });
    },
    [cartItems, totalAmount, selectedAddress, profile?.email, finalPincode, shippingFee, createOrderMutation, navigate]
  );

  // Handle payment method selection from dialog (only for online)
  const handlePaymentMethodSelect = (method) => {
    // Pass both mode and method to the unified function
    proceedWithOrder("ONLINE", method);
    setShowPaymentDialog(false); // close the dialog
  };

  const submitOrder = useCallback(() => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (paymentMode === "ONLINE") {
      // Show payment options dialog
      setShowPaymentDialog(true);
      return;
    }

    if (paymentMode === "COD") {
      // Directly proceed with COD
      proceedWithOrder("COD");
    }
  }, [selectedAddress, cartItems, paymentMode, proceedWithOrder]);



  const summaryProps = {
    items: cartItems,
    subtotal,
    total: totalAmount,
    shippingFee,
    shippingText: shippingDisplayText,
  };
  const deliveryReady = Boolean(selectedAddress && hasPincode && !isShippingLoading &&
    !isPincodeUnavailable && !shippingDisplayError && shippingFee != null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white px-3 pb-32 pt-5 sm:px-6 lg:py-10 [font-family:var(--primary-font)]">
      {isProcessing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-stone-950/30 px-4" role="status">
          <div className="flex items-center gap-3 rounded-xl bg-white p-5 shadow-lg">
            <LoaderCircle size={22} className="animate-spin text-[var(--brand-primary)]" aria-hidden="true" />
            Creating your order…
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl space-y-4">
        <header className="flex flex-wrap items-end justify-between gap-3 pb-2">
          <div>
            <Link to="/cart" className="mb-2 inline-flex min-h-9 items-center gap-1.5 text-sm font-bold text-[var(--brand-hover)] hover:underline">
              <ArrowLeft size={16} aria-hidden="true" />
              Back to cart
            </Link>
            <h1 className="m-0 text-3xl font-bold tracking-tight sm:text-4xl">Checkout</h1>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-orange-200 bg-white px-3 py-2 text-sm font-bold text-[var(--brand-hover)]">
            <ShoppingBag size={17} aria-hidden="true" />
            {formatNumber(cartItems.length, 0)} {cartItems.length === 1 ? "item" : "items"}
          </div>
        </header>

        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(19rem,24rem)]">
          <div className="min-w-0 space-y-4">
            <div className={`${panel} p-3`}>
              <ProgressStepper
                currentStep={currentStep}
                onStepChange={setCurrentStep}
                disabled={isProcessing}
              />
            </div>

            {currentStep !== 2 && (
              <div className={`${panel} lg:hidden`}>
                <button
                  type="button"
                  aria-expanded={summaryOpen}
                  aria-controls="checkout-mobile-summary"
                  onClick={() => setSummaryOpen((open) => !open)}
                  className="flex min-h-12 w-full flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm font-bold text-[var(--brand-hover)]"
                >
                  <span>Order summary · {formatNumber(cartItems.length, 0)} items</span>
                  <span className="flex items-center gap-2">
                    {formatCurrency(totalAmount)}
                    <ChevronDown size={17} className={summaryOpen ? "rotate-180" : ""} aria-hidden="true" />
                  </span>
                </button>
                {summaryOpen && (
                  <div id="checkout-mobile-summary" className="border-t border-orange-100 p-4">
                    <OrderSummary {...summaryProps} />
                  </div>
                )}
              </div>
            )}

            <section className={panel} aria-labelledby="checkout-step-heading">
              <div className="border-b border-orange-100 bg-orange-50/60 px-4 py-4 sm:px-6">
                <h2 id="checkout-step-heading" className="m-0 text-xl font-bold sm:text-2xl">
                  {["Delivery address", "Review your order", "Payment method"][currentStep - 1]}
                </h2>
              </div>
              <div className="space-y-4 p-4 sm:p-6">

                {currentStep === 1 && (
                  <>
                    <p className="text-sm !text-stone-600">
                      Contact number: {profileLoading ? "Loading…" : profile?.contactNumber || "Not provided"}
                    </p>
                    {addressesLoading ? (
                      <p role="status" className="rounded-xl bg-orange-50 p-4">Loading addresses…</p>
                    ) : selectedAddress ? (
                      <div className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-orange-100 bg-orange-50 p-4">
                        <div className="flex min-w-0 items-start gap-2">
                          <MapPin size={19} className="shrink-0 text-[var(--brand-primary)]" aria-hidden="true" />
                          <address className="m-0 min-w-0 break-words text-sm not-italic">
                            <strong>{selectedAddress.name}</strong>
                            <div>{selectedAddress.addressLine}</div>
                            <div>{[selectedAddress.locality, selectedAddress.city, selectedAddress.state].filter(Boolean).join(", ")} {selectedAddress.pincode}</div>
                            <div>{selectedAddress.phone}</div>
                          </address>
                        </div>
                        <button type="button" onClick={() => setShowAddressModal(true)} className={secondary}>
                          Change address
                        </button>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-orange-100 bg-orange-50 p-4">
                        <p className="mb-3 text-sm">Add a delivery address to continue.</p>
                        <button type="button" onClick={() => setShowAddressModal(true)} className={primary}>
                          Add address
                        </button>
                      </div>
                    )}
                    {selectedAddress && <p role="status" className="text-sm !text-stone-600">Delivery: {shippingDisplayText}</p>}
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    {selectedAddress && (
                      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-orange-100 bg-orange-50 p-3">
                        <div className="flex min-w-0 items-start gap-2">
                          <Truck size={19} className="shrink-0 text-[var(--brand-hover)]" aria-hidden="true" />
                          <div>
                            <p className="text-sm font-bold">Deliver to {selectedAddress.name}</p>
                            <p className="break-words text-sm !text-stone-600">
                              {[selectedAddress.addressLine, selectedAddress.city, selectedAddress.pincode]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          className={secondary}
                        >
                          Edit delivery
                        </button>
                      </div>
                    )}
                    <OrderSummary {...summaryProps} />
                  </>
                )}

                {currentStep === 3 && (
                  <fieldset className="space-y-2">
                    <legend className="sr-only">Choose a payment method</legend>
                    {[
                      { value: "ONLINE", label: "Pay online", description: "UPI, card, or net banking", icon: CreditCard },
                     // { value: "COD", label: "Cash on delivery", description: "Pay when your order arrives", icon: Home },
                    ].map(({ value, label, description, icon: Icon }) => (
                      <label
                        key={value}
                        className={`flex min-h-16 cursor-pointer items-center gap-3 rounded-xl border p-3 ${
                          paymentMode === value ? "border-orange-300 bg-orange-50" : "border-stone-200 bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={value}
                          checked={paymentMode === value}
                          onChange={() => setPaymentMode(value)}
                          className="h-4 w-4 shrink-0 accent-[var(--brand-primary)]"
                        />
                        <Icon size={20} className="shrink-0 text-[var(--brand-hover)]" aria-hidden="true" />
                        <span>
                          <strong className="block text-sm">{label}</strong>
                          <span className="block text-xs text-stone-600">{description}</span>
                        </span>
                      </label>
                    ))}
                  </fieldset>
                )}
              </div>

              <div className={`z-30 flex flex-wrap items-center justify-end gap-2 border-t border-orange-100 bg-white px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:static lg:px-6 ${
                showAddressModal || showPaymentDialog || isProcessing ? "hidden lg:flex" : "fixed inset-x-0 bottom-0"
              }`}>
                <div className="mr-auto min-w-0">
                  <span className="block text-xs text-stone-600">
                    {shippingFee == null ? "Subtotal" : "Order total"}
                  </span>
                  <strong className="block tabular-nums text-[var(--brand-hover)]">
                    {formatCurrency(totalAmount)}
                  </strong>
                </div>
                {currentStep > 1 && (
                  <button type="button" onClick={handlePrevStep} disabled={isProcessing} className={secondary}>
                    Back
                  </button>
                )}
                {currentStep < 3 ? (
                  <button type="button" onClick={handleNextStep} disabled={!deliveryReady} className={primary}>
                    {currentStep === 1 ? "Review order" : "Continue to payment"}
                    <ArrowRight size={17} aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={submitOrder}
                    disabled={!deliveryReady || isProcessing}
                    className={primary}
                  >
                    {paymentMode === "ONLINE" ? "Choose payment option" : "Place order"}
                  </button>
                )}
              </div>
            </section>
          </div>

          <aside aria-labelledby="checkout-summary-heading" className={`${panel} hidden lg:block`}>
            <div className="flex items-center gap-2 border-b border-orange-100 bg-orange-50/60 px-5 py-4">
              <ShoppingBag size={19} className="text-[var(--brand-hover)]" aria-hidden="true" />
              <h2 id="checkout-summary-heading" className="m-0 text-lg font-bold">Order summary</h2>
            </div>
            <div className="p-5">
              <OrderSummary {...summaryProps} showItems={currentStep !== 2} />
            </div>
          </aside>
        </div>
      </div>

      <PaymentOptionsDialog
        isOpen={showPaymentDialog}
        onClose={() => setShowPaymentDialog(false)}
        onConfirm={handlePaymentMethodSelect}
      />
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
