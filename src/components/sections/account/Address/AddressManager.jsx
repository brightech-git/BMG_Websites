import React, { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  Plus, Edit2, CheckCircle, Trash2, MapPin, X, Save,
  Home, Briefcase, Phone, Navigation, User, Building,
  Tag, Star, Globe, AlertCircle, Loader2 ,Map
} from "lucide-react";
import {
  useAddressesByCustomer,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
} from "../../../../hook/address/useAddress";

const AddressManager = () => {
  const user = useSelector((state) => state.user.user);
  const customerId = user?.id;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

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
      // Reset all others
      await Promise.all(
        addresses
          .filter(a => a.id !== id && a.isDefault)
          .map(a => updateMutation.mutateAsync({ id: a.id, address: { ...a, isDefault: false } }))
      );
      // Set this one
      const addr = addresses.find(a => a.id === id);
      if (!addr?.isDefault) {
        await updateMutation.mutateAsync({ id, address: { ...addr, isDefault: true } });
      }
      refetch();
    } catch (err) {
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
    } catch (err) {
      setError("Failed to delete address");
    }
  };

  if (!customerId) {
    return (
      <div className="min-h-screen bg-[#eeece8] flex items-center justify-center p-4">
        <div className="bg-white border border-gray-300 rounded-sm p-10 text-center">
          <AlertCircle className="w-14 h-14 text-red-500 mx-auto mb-4" />
          <p className="text-lg font-medium">Please log in to manage addresses</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#eeece8] flex items-center justify-center p-4">
        <div className="bg-white border border-gray-300 rounded-sm p-16 text-center">
          <Loader2 className="w-12 h-12 text-[#f16137] animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Loading addresses...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { transform: translateX(-20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-fade { animation: fadeInUp 0.4s ease-out forwards; }
        .animate-slide { animation: slideIn 0.4s ease-out forwards; }
      `}</style>

      <div className="min-h-screen mt-[100px] md:mt-0 bg-[#eeece8] px-3 py-3 font-secondary text-[#041f60]">

        {/* Header */}
        <div className="bg-white border border-gray-300 rounded-xl p-2 mb-2 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-[var(--primary-hover-color)]">Manage Addresses</h2>
            <p className="text-sm text-[var(--primary-text-color)]">Add or edit delivery addresses</p>
          </div>
          <button
            onClick={() => { setIsFormOpen(true); resetForm(); }}
            className="flex items-center gap-2 px-2 py-2 bg-[#041f60] text-white rounded hover:bg-[#f16137] text-xs font-medium transition"
          >
            <Plus className="w-5 h-5" /> Add New Address
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-sm p-3 mb-4 flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)}><X className="w-5 h-5 text-red-600" /></button>
          </div>
        )}

        {/* Address Cards */}
        {addresses.length === 0 ? (
          <div className="bg-white border border-gray-300 rounded-sm p-16 text-center">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">No addresses yet</p>
            <button
              onClick={() => { setIsFormOpen(true); resetForm(); }}
              className="mt-4 px-6 py-2.5 bg-[#f16137] text-white rounded text-sm font-medium hover:bg-[#d84141]"
            >
              Add First Address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {addresses.map((addr, i) => (
              <div
                key={addr.id}
                className={`bg-white border ${addr.isDefault ? "border-[#f16137]" : "border-gray-300"} rounded-xl p-3 relative hover:shadow-md transition animate-slide`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {addr.isDefault && (
                  <div className="absolute top-3 right-3 bg-[#f16137] text-white text-xs px-2.5 py-1 rounded flex items-center gap-1">
                    <Star className="w-3.5 h-3.5" /> Default
                  </div>
                )}

                <div className="flex items-start gap-3 mb-3">
                  {addr.companyName ? <Briefcase className="w-6 h-6 text-gray-600 mt-1" /> : <Home className="w-6 h-6 text-gray-600 mt-1" />}
                  <div>
                    <p className="font-bold text-base">{addr.name}</p>
                    <p className="text-sm text-gray-600">{addr.phone}</p>
                  </div>
                </div>

                <div className="text-sm space-y-1 text-gray-700">
                  <p>{addr.addressLine}</p>
                  <p>{addr.locality}, {addr.city}, {addr.state} - {addr.pincode}</p>
                  {addr.landmark && <p className="text-gray-500">Near {addr.landmark}</p>}
                  {addr.companyName && <p className="font-medium">{addr.companyName}</p>}
                  {addr.gstNumber && <p className="text-xs">GST: {addr.gstNumber}</p>}
                </div>

                <div className="flex gap-2 mt-5">
                  <button
                    onClick={() => {
                      setFormData({ ...addr, addressType: addr.companyName ? "work" : "home" });
                      setEditingId(addr.id);
                      setIsFormOpen(true);
                    }}
                    className="flex-1 py-2.5 border border-gray-300 rounded text-sm hover:bg-gray-50 flex items-center justify-center gap-1.5"
                  >
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      className="flex-1 py-2.5 border border-[#f16137] text-[#f16137] rounded text-sm hover:bg-orange-50"
                    >
                      Set Default
                    </button>
                  )}
                  {addresses.length > 1 && (
                    <button
                      onClick={() => handleDelete(addr.id)}
                      className="px-3 py-2.5 border border-red-300 text-red-600 rounded hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-1 ">
            <div className="bg-white rounded-sm max-w-2xl w-full max-h-[100%] overflow-y-auto border border-gray-300">
              <div className="p-2 border-b border-gray-300 flex justify-between items-center">
                <h3 className="text-lg font-bold text-[var(--primary-hover-color)]">{editingId ? "Edit" : "Add New"} Address</h3>
                <button onClick={() => { setIsFormOpen(false); resetForm(); }}>
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-3 space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">

                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#041f60] flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      Full Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      required
                      value={formData.name}
                      onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      placeholder="Enter full name"
                      className="w-full text-[#041f60] bg-white px-2 py-1 h-10 border border-gray-300 rounded-sm focus:border-[#f16137] focus:ring-2 focus:ring-orange-100 outline-none transition"
                    />
                  </div>

                  {/* Mobile Number */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#041f60] flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      Mobile Number <span className="text-red-600">*</span>
                    </label>
                    <input
                      required
                      value={formData.phone}
                      onChange={e => setFormData(p => ({ ...p, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
                      placeholder="10-digit mobile number"
                      maxLength="10"
                      className="w-full bg-white text-[#041f60] px-2 py-1 h-10 border border-gray-300 rounded-sm focus:border-[#f16137] focus:ring-2 focus:ring-orange-100 outline-none transition"
                    />
                  </div>

                  {/* Pincode */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#041f60] flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      Pincode <span className="text-red-600">*</span>
                    </label>
                    <input
                      required
                      value={formData.pincode}
                      onChange={e => setFormData(p => ({ ...p, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) }))}
                      placeholder="6-digit pincode"
                      maxLength="6"
                      className="w-full px-2 py-1  text-[#041f60] h-10 bg-white  border border-gray-300 rounded-sm focus:border-[#f16137] focus:ring-2 focus:ring-orange-100 outline-none transition"
                    />
                  </div>

                  {/* Locality */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#041f60] flex items-center gap-2">
                      <Map className="w-4 h-4 text-gray-500" />
                      Locality / Area <span className="text-red-600">*</span>
                    </label>
                    <input
                      required
                      value={formData.locality}
                      onChange={e => setFormData(p => ({ ...p, locality: e.target.value }))}
                      placeholder="e.g. Sector 18, Gandhi Nagar"
                      className="w-full px-2 py-1 h-10 bg-white text-[#041f60]  border border-gray-300 rounded-sm focus:border-[#f16137] focus:ring-2 focus:ring-orange-100 outline-none transition"
                    />
                  </div>

                  {/* Full Address */}
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-sm font-medium text-[#041f60] flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-gray-500" />
                      Flat, House no., Building, Street <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      required
                      value={formData.addressLine}
                      onChange={e => setFormData(p => ({ ...p, addressLine: e.target.value }))}
                      placeholder="House no., apartment, building name, street"
                      rows="3"
                      className="w-full px-2 py-1 h-20 bg-white text-[#041f60] border border-gray-300 rounded-sm focus:border-[#f16137] focus:ring-2 focus:ring-orange-100 outline-none transition resize-none"
                    />
                  </div>

                  {/* City */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#041f60] flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-500" />
                      City / District <span className="text-red-600">*</span>
                    </label>
                    <input
                      required
                      value={formData.city}
                      onChange={e => setFormData(p => ({ ...p, city: e.target.value }))}
                      placeholder="e.g. Mumbai"
                      className="w-full px-2 py-1 h-10 bg-white border text-[#041f60] border-gray-300 rounded-sm focus:border-[#f16137] focus:ring-2 focus:ring-orange-100 outline-none transition"
                    />
                  </div>

                  {/* State */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#041f60] flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-500" />
                      State <span className="text-red-600">*</span>
                    </label>
                    <input
                      required
                      value={formData.state}
                      onChange={e => setFormData(p => ({ ...p, state: e.target.value }))}
                      placeholder="e.g. Maharashtra"
                      className="w-full px-2 py-1 h-10 border  bg-white text-[#041f60] border-gray-300 rounded-sm focus:border-[#f16137] focus:ring-2 focus:ring-orange-100 outline-none transition"
                    />
                  </div>

                  {/* Landmark (Optional) */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#041f60] flex items-center gap-2">
                      <Tag className="w-4 h-4 text-gray-500" />
                      Landmark <span className="text-gray-500">(Optional)</span>
                    </label>
                    <input
                      value={formData.landmark}
                      onChange={e => setFormData(p => ({ ...p, landmark: e.target.value }))}
                      placeholder="e.g. Near Apollo Hospital"
                      className="w-full px-2 py-1 h-10 border  bg-white text-[#041f60] border-gray-300 rounded-sm focus:border-[#f16137] focus:ring-2 focus:ring-orange-100 outline-none transition"
                    />
                  </div>

                  {/* Alternate Phone (Optional) */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#041f60] flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      Alternate Phone <span className="text-gray-500">(Optional)</span>
                    </label>
                    <input
                      value={formData.alternatePhone}
                      onChange={e => setFormData(p => ({ ...p, alternatePhone: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
                      placeholder="Another 10-digit number"
                      maxLength="10"
                      className="w-full px-2 py-1 h-10 border  bg-white text-[#041f60] border-gray-300 rounded-sm focus:border-[#f16137] focus:ring-2 focus:ring-orange-100 outline-none transition"
                    />
                  </div>

                  {/* Default Address Checkbox */}
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-3 cursor-pointer text-sm font-medium">
                      <input
                        type="checkbox"
                        checked={formData.isDefault}
                        onChange={e => setFormData(p => ({ ...p, isDefault: e.target.checked }))}
                        className="w-4 h-4 text-[#f16137] rounded focus:ring-[#f16137]"
                      />
                      <span className="flex items-center gap-2">
                        <Star className="w-3 h-3 text-yellow-500" />
                        Set as default address
                      </span>
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => { setIsFormOpen(false); resetForm(); }}
                    className="px-6 py-2.5 border border-gray-300 rounded text-xs font-medium hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="px-6 py-2.5 bg-[#f16137] text-white rounded text-xs font-medium hover:bg-[#d84141] disabled:opacity-70 flex items-center gap-2 transition"
                  >
                    {(createMutation.isPending || updateMutation.isPending) ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {editingId ? "Update" : "Save"} Address
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AddressManager;