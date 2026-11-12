import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Plus, Edit2, CheckCircle, Trash2, MapPin, X, Save,
  Home, Briefcase, Phone, Navigation, User, Building,
  Tag, Star, Globe, AlertCircle, Loader2, Map
} from "lucide-react";
import {
  useAddressesByCustomer,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
} from "../../../../address/hooks/address/useAddress";
import { checkPincodeService } from "../../../../address/api/pincodeChecking";

import AccountSectionHeader, { accountButton } from "../AccountSectionHeader";

const AddressManager = () => {
  const user = useSelector((state) => state.user.user);
  const customerId = user?.id;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [pincodeCheck, setPincodeCheck] = useState({ status: "idle", pincode: "", message: "" });

  const [formData, setFormData] = useState({
    name: "", phone: "", pincode: "", locality: "", addressLine: "",
    city: "", state: "", landmark: "", alternatePhone: "",
    companyName: "", gstNumber: "", isDefault: false, addressType: "home"
  });

  // Hooks
  const { data: addresses = [], isLoading, isError, refetch } = useAddressesByCustomer(customerId);
  const createMutation = useCreateAddress();
  const updateMutation = useUpdateAddress();
  const deleteMutation = useDeleteAddress();

  const resetForm = () => {
    setFormData({
      name: "", phone: "", pincode: "", locality: "", addressLine: "",
      city: "", state: "", landmark: "", alternatePhone: "",
      companyName: "", gstNumber: "", isDefault: false, addressType: "home"
    });
    setEditingId(null);
    setError(null);
    setPincodeCheck({ status: "idle", pincode: "", message: "" });
  };

  const isPincodeConfirmed =
    pincodeCheck.status === "available" &&
    pincodeCheck.pincode === formData.pincode;

  const handlePincodeChange = (value) => {
    const nextPincode = value.replace(/\D/g, "").slice(0, 6);
    setFormData(prev => ({ ...prev, pincode: nextPincode }));
    setPincodeCheck({ status: "idle", pincode: "", message: "" });
  };

  const handleCheckPincode = async () => {
    const pincode = formData.pincode;
    if (!/^\d{6}$/.test(pincode)) {
      setPincodeCheck({
        status: "error",
        pincode,
        message: "Enter a valid 6-digit pincode"
      });
      return;
    }

    setPincodeCheck({ status: "checking", pincode, message: "Checking delivery availability..." });
    try {
      const response = await checkPincodeService(pincode);
      const isAvailable = response?.status === true;
      setPincodeCheck({
        status: isAvailable ? "available" : "unavailable",
        pincode,
        message: response?.message || (isAvailable
          ? "Delivery is available for this pincode"
          : "Delivery is not available for this pincode")
      });
    } catch (err) {
      setPincodeCheck({
        status: "error",
        pincode,
        message: err.message || "Unable to check pincode availability"
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!/^\d{6}$/.test(formData.pincode)) {
      setError("Enter a valid 6-digit pincode");
      return;
    }
    if (!isPincodeConfirmed) {
      setError("Check and confirm pincode availability before saving the address");
      return;
    }

    const payload = {
      ...formData,
      customerId,
      companyName: formData.addressType === "work" ? formData.companyName : null,
      gstNumber: formData.addressType === "work" ? formData.gstNumber : null,
    };

    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, address: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      await refetch();
      setIsFormOpen(false);
      resetForm();
    } catch (err) {
      setError(err.message || "Failed to save address");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await Promise.all(
        addresses
          .filter(a => a.id !== id && a.isDefault)
          .map(a => updateMutation.mutateAsync({ id: a.id, address: { ...a, isDefault: false } }))
      );
      const addr = addresses.find(a => a.id === id);
      if (!addr?.isDefault) {
        await updateMutation.mutateAsync({ id, address: { ...addr, isDefault: true } });
      }
      refetch();
    } catch {
      setError("Failed to set default address");
    }
  };

  const handleDelete = async (id) => {
    if (addresses.length <= 1) {
      setError("You must have at least one address");
      return;
    }
    if (!window.confirm("Delete this address?")) return;

    try {
      await deleteMutation.mutateAsync(id);
      refetch();
    } catch {
      setError("Failed to delete address");
    }
  };

  const saving = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  function openAddress(address) {
    resetForm();
    if (address) {
      setFormData({ ...address, addressType: address.addressType || (address.companyName ? "work" : "home") });
      setEditingId(address.id);
    }
    setIsFormOpen(true);
  }

  return (
    <div className="space-y-4">
      <AccountSectionHeader
        icon={MapPin}
        title="Address book"
        description="Save delivery addresses and choose your default for checkout."
      >
        <button type="button" disabled={!customerId || saving} onClick={() => openAddress()} className={accountButton}>
          <Plus size={18} aria-hidden="true" />
          Add address
        </button>
      </AccountSectionHeader>

      {!isFormOpen && error && <p role="alert" className="rounded-xl bg-rose-50 p-3 !text-rose-800">{error}</p>}
      {!customerId || isLoading || isError || addresses.length === 0 ? (
        <div className="rounded-2xl border border-orange-100 bg-white p-6 text-center">
          <MapPin size={28} className="mx-auto mb-2 text-[var(--brand-hover)]" aria-hidden="true" />
          <p role="status" className="font-bold">
            {!customerId ? "Sign in to manage addresses" : isLoading ? "Loading addresses…" : isError ? "We couldn’t load your addresses." : "No saved addresses yet"}
          </p>
          {isError && <button type="button" onClick={() => refetch()} className={`${accountButton} mt-3`}>Try again</button>}
        </div>
      ) : (
        <ul className="m-0 grid list-none gap-3 p-0 xl:grid-cols-2">
          {[...addresses].sort((first, second) => Number(second.isDefault) - Number(first.isDefault)).map((address) => (
            <li key={address.id} className={`flex min-w-0 flex-col rounded-2xl border bg-white p-4 shadow-sm ${address.isDefault ? "border-orange-300" : "border-orange-100"}`}>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 text-sm font-bold capitalize">
                  <MapPin size={17} className="text-[var(--brand-hover)]" aria-hidden="true" />
                  {address.addressType || (address.companyName ? "Work" : "Home")}
                </span>
                {address.isDefault && (
                  <span className="rounded-full bg-green-600 px-2.5 py-1 text-xs font-bold text-white">
                    Default address
                  </span>
                )}
              </div>
              <address className="mb-4 flex-1 break-words text-sm leading-relaxed not-italic">
                <strong className="block text-base">{address.name}</strong>
                {address.companyName && <span className="block">{address.companyName}</span>}
                <span className="block">{address.addressLine}</span>
                <span className="block">{[address.locality, address.city, address.state, address.pincode].filter(Boolean).join(", ")}</span>
                {address.landmark && <span className="block">Near {address.landmark}</span>}
                <span className="block">{address.phone}</span>
                {address.gstNumber && <span className="block">GST: {address.gstNumber}</span>}
              </address>
              <div className="flex flex-wrap gap-2 border-t border-orange-100 pt-3">
                <button type="button" disabled={saving} onClick={() => openAddress(address)} className="min-h-11 rounded-xl bg-orange-50 px-3 text-sm font-bold text-[var(--brand-hover)]">Edit</button>
                {!address.isDefault && (
                  <button type="button" disabled={saving} onClick={() => handleSetDefault(address.id)} className="min-h-11 rounded-xl border border-orange-200 px-3 text-sm font-bold text-[var(--brand-hover)]">Set as default</button>
                )}
                {addresses.length > 1 && (
                  <button type="button" disabled={saving} onClick={() => handleDelete(address.id)} aria-label={`Delete address for ${address.name}`} className="ml-auto grid h-11 w-11 place-items-center rounded-xl text-rose-700 hover:bg-rose-50">
                    <Trash2 size={17} aria-hidden="true" />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

        {/* Address Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/50  backdrop-blur-sm z-30 flex items-center justify-center p-3 animate__animated animate__fadeIn">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto border-2 border-[#FED7AA] shadow-2xl shadow-[#F97316]/20 animate__animated animate__fadeInUp">

              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-[#FFF7ED] to-[#FFEDD5] border-b border-[#FED7AA] px-4 sm:px-5 py-3 sm:py-4 flex justify-between items-center">
                <h3 className="text-lg sm:text-xl font-bold text-[#7C2D12] flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-lg flex items-center justify-center shadow-md">
                    {editingId ? (
                      <Edit2 className="w-4 h-4 text-white" />
                    ) : (
                      <Plus className="w-4 h-4 text-white" />
                    )}
                  </div>
                  {editingId ? "Edit" : "Add New"} Address
                </h3>
                <button
                  onClick={() => { setIsFormOpen(false); resetForm(); }}
                  className="p-2 hover:bg-white/80 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-[#9A3412]" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">

                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-sm font-semibold text-[#7C2D12] flex items-center gap-2">
                      <User className="w-4 h-4 text-[#F97316]" />
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      required
                      value={formData.name}
                      onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      placeholder="Enter full name"
                      className="w-full px-3 py-2.5 h-11 bg-white border-2 border-[#FED7AA] rounded-xl text-[#7C2D12] placeholder:text-[#FDBA74]/70 focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 outline-none transition-all"
                    />
                  </div>

                  {/* Mobile Number */}
                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-sm font-semibold text-[#7C2D12] flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#F97316]" />
                      Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      required
                      value={formData.phone}
                      onChange={e => setFormData(p => ({ ...p, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
                      placeholder="10-digit mobile number"
                      maxLength="10"
                      className="w-full px-3 py-2.5 h-11 bg-white border-2 border-[#FED7AA] rounded-xl text-[#7C2D12] placeholder:text-[#FDBA74]/70 focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 outline-none transition-all"
                    />
                  </div>

                  {/* Pincode */}
                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-sm font-semibold text-[#7C2D12] flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#F97316]" />
                      Pincode <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        required
                        value={formData.pincode}
                        onChange={e => handlePincodeChange(e.target.value)}
                        placeholder="6-digit pincode"
                        maxLength="6"
                        className="min-w-0 flex-1 px-3 py-2.5 h-11 bg-white border-2 border-[#FED7AA] rounded-xl text-[#7C2D12] placeholder:text-[#FDBA74]/70 focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={handleCheckPincode}
                        disabled={pincodeCheck.status === "checking" || formData.pincode.length !== 6}
                        className="px-3 h-11 rounded-xl bg-[#F97316] text-white text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {pincodeCheck.status === "checking" ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : "Check"}
                      </button>
                    </div>
                    {pincodeCheck.message && (
                      <p className={`text-xs font-medium ${
                        isPincodeConfirmed ? "text-emerald-600" :
                          pincodeCheck.status === "checking" ? "text-amber-600" : "text-rose-600"
                      }`}>
                        {isPincodeConfirmed && <CheckCircle className="inline w-3.5 h-3.5 mr-1" />}
                        {pincodeCheck.message}
                      </p>
                    )}
                  </div>

                  {/* Locality */}
                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-sm font-semibold text-[#7C2D12] flex items-center gap-2">
                      <Map className="w-4 h-4 text-[#F97316]" />
                      Locality / Area <span className="text-rose-500">*</span>
                    </label>
                    <input
                      required
                      value={formData.locality}
                      onChange={e => setFormData(p => ({ ...p, locality: e.target.value }))}
                      placeholder="e.g. Sector 18, Gandhi Nagar"
                      className="w-full px-3 py-2.5 h-11 bg-white border-2 border-[#FED7AA] rounded-xl text-[#7C2D12] placeholder:text-[#FDBA74]/70 focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 outline-none transition-all"
                    />
                  </div>

                  {/* Full Address */}
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs sm:text-sm font-semibold text-[#7C2D12] flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-[#F97316]" />
                      Flat, House no., Building, Street <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      value={formData.addressLine}
                      onChange={e => setFormData(p => ({ ...p, addressLine: e.target.value }))}
                      placeholder="House no., apartment, building name, street"
                      rows="2"
                      className="w-full px-3 py-2.5 h-20 bg-white border-2 border-[#FED7AA] rounded-xl text-[#7C2D12] placeholder:text-[#FDBA74]/70 focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 outline-none transition-all resize-none"
                    />
                  </div>

                  {/* City */}
                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-sm font-semibold text-[#7C2D12] flex items-center gap-2">
                      <Building className="w-4 h-4 text-[#F97316]" />
                      City / District <span className="text-rose-500">*</span>
                    </label>
                    <input
                      required
                      value={formData.city}
                      onChange={e => setFormData(p => ({ ...p, city: e.target.value }))}
                      placeholder="e.g. Mumbai"
                      className="w-full px-3 py-2.5 h-11 bg-white border-2 border-[#FED7AA] rounded-xl text-[#7C2D12] placeholder:text-[#FDBA74]/70 focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 outline-none transition-all"
                    />
                  </div>

                  {/* State */}
                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-sm font-semibold text-[#7C2D12] flex items-center gap-2">
                      <Globe className="w-4 h-4 text-[#F97316]" />
                      State <span className="text-rose-500">*</span>
                    </label>
                    <input
                      required
                      value={formData.state}
                      onChange={e => setFormData(p => ({ ...p, state: e.target.value }))}
                      placeholder="e.g. Maharashtra"
                      className="w-full px-3 py-2.5 h-11 bg-white border-2 border-[#FED7AA] rounded-xl text-[#7C2D12] placeholder:text-[#FDBA74]/70 focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 outline-none transition-all"
                    />
                  </div>

                  {/* Landmark */}
                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-sm font-semibold text-[#7C2D12] flex items-center gap-2">
                      <Tag className="w-4 h-4 text-[#F97316]" />
                      Landmark <span className="text-[#9A3412] font-normal">(Optional)</span>
                    </label>
                    <input
                      value={formData.landmark}
                      onChange={e => setFormData(p => ({ ...p, landmark: e.target.value }))}
                      placeholder="e.g. Near Apollo Hospital"
                      className="w-full px-3 py-2.5 h-11 bg-white border-2 border-[#FED7AA] rounded-xl text-[#7C2D12] placeholder:text-[#FDBA74]/70 focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 outline-none transition-all"
                    />
                  </div>

                  {/* Alternate Phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-sm font-semibold text-[#7C2D12] flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#F97316]" />
                      Alternate Phone <span className="text-[#9A3412] font-normal">(Optional)</span>
                    </label>
                    <input
                      value={formData.alternatePhone}
                      onChange={e => setFormData(p => ({ ...p, alternatePhone: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
                      placeholder="Another 10-digit number"
                      maxLength="10"
                      className="w-full px-3 py-2.5 h-11 bg-white border-2 border-[#FED7AA] rounded-xl text-[#7C2D12] placeholder:text-[#FDBA74]/70 focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 outline-none transition-all"
                    />
                  </div>

                  {/* Address Type */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs sm:text-sm font-semibold text-[#7C2D12] flex items-center gap-2">
                      <Home className="w-4 h-4 text-[#F97316]" />
                      Address Type
                    </label>
                    <div className="flex gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={formData.addressType === "home"}
                          onChange={() => setFormData(p => ({ ...p, addressType: "home", companyName: "", gstNumber: "" }))}
                          className="w-4 h-4 text-[#F97316] border-[#FED7AA] focus:ring-[#F97316]/20"
                        />
                        <span className="text-sm text-[#7C2D12]">Home</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={formData.addressType === "work"}
                          onChange={() => setFormData(p => ({ ...p, addressType: "work" }))}
                          className="w-4 h-4 text-[#F97316] border-[#FED7AA] focus:ring-[#F97316]/20"
                        />
                        <span className="text-sm text-[#7C2D12]">Work</span>
                      </label>
                    </div>
                  </div>

                  {/* Company Details (Work) */}
                  {formData.addressType === "work" && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-xs sm:text-sm font-semibold text-[#7C2D12] flex items-center gap-2">
                          <Building className="w-4 h-4 text-[#F97316]" />
                          Company Name
                        </label>
                        <input
                          value={formData.companyName}
                          onChange={e => setFormData(p => ({ ...p, companyName: e.target.value }))}
                          placeholder="Enter company name"
                          className="w-full px-3 py-2.5 h-11 bg-white border-2 border-[#FED7AA] rounded-xl text-[#7C2D12] placeholder:text-[#FDBA74]/70 focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs sm:text-sm font-semibold text-[#7C2D12] flex items-center gap-2">
                          <Tag className="w-4 h-4 text-[#F97316]" />
                          GST Number
                        </label>
                        <input
                          value={formData.gstNumber}
                          onChange={e => setFormData(p => ({ ...p, gstNumber: e.target.value }))}
                          placeholder="15-digit GST number"
                          className="w-full px-3 py-2.5 h-11 bg-white border-2 border-[#FED7AA] rounded-xl text-[#7C2D12] placeholder:text-[#FDBA74]/70 focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 outline-none transition-all"
                        />
                      </div>
                    </>
                  )}

                  {/* Default Address Checkbox */}
                  <div className="md:col-span-2 pt-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={formData.isDefault}
                          onChange={e => setFormData(p => ({ ...p, isDefault: e.target.checked }))}
                          className="w-5 h-5 text-[#F97316] border-2 border-[#FED7AA] rounded-lg focus:ring-[#F97316]/20 transition-all"
                        />
                      </div>
                      <span className="text-sm font-medium text-[#7C2D12] flex items-center gap-2">
                        <Star className={`w-4 h-4 ${formData.isDefault ? 'fill-[#F97316] text-[#F97316]' : 'text-[#FDBA74]'} transition-colors`} />
                        Set as default address
                      </span>
                    </label>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t-2 border-[#FED7AA]">
                  <button
                    type="button"
                    onClick={() => { setIsFormOpen(false); resetForm(); }}
                    className="px-6 py-2.5 border-2 border-[#FED7AA] text-[#7C2D12] rounded-xl text-xs sm:text-sm font-medium hover:bg-[#FFF7ED] hover:border-[#FDBA74] transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending ||
                      !isPincodeConfirmed}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white rounded-xl text-xs sm:text-sm font-medium hover:shadow-lg hover:shadow-[#F97316]/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 transition-all duration-300 transform hover:scale-105"
                  >
                    {(createMutation.isPending || updateMutation.isPending) ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {editingId ? "Updating..." : "Saving..."}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {editingId ? "Update" : "Save"} Address
                      </>
                    )}
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