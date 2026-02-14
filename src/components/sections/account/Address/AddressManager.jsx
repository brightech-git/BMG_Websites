import React, { useState, useCallback } from "react";
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
      <div className="min-h-screen bg-gradient-to-br from-[#FFF7ED] to-[#FFEDD5] flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-md border border-[#FED7AA] rounded-2xl p-10 text-center shadow-lg shadow-[#F97316]/5 animate__animated animate__fadeIn">
          <div className="relative">
            <AlertCircle className="w-16 h-16 text-[#F97316] mx-auto mb-4" />
            <div className="absolute inset-0 bg-[#F97316]/10 rounded-full blur-2xl -z-10"></div>
          </div>
          <p className="text-xl font-bold text-[#7C2D12] mb-2">Login Required</p>
          <p className="text-[#9A3412]">Please log in to manage your addresses</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF7ED] to-[#FFEDD5] flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-md border border-[#FED7AA] rounded-2xl p-16 text-center shadow-lg shadow-[#F97316]/5 animate__animated animate__fadeIn">
          <Loader2 className="w-16 h-16 text-[#F97316] animate-spin mx-auto" />
          <p className="mt-6 text-[#7C2D12] font-medium">Loading your addresses...</p>
          <p className="mt-2 text-sm text-[#9A3412]">Just a moment please</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-fadeInUp { animation: fadeInUp 0.5s ease-out forwards; }
        .animate-slideIn { animation: slideIn 0.4s ease-out forwards; }
      `}</style>

      <div className="min-h-screen mt-[100px] md:mt-0 bg-gradient-to-br from-[#FFF7ED] via-[#FFEDD5] to-[#FFF3E6] px-3 sm:px-4 py-3 sm:py-4 font-secondary text-[#7C2D12]">

        {/* Decorative Elements */}
        <div className="fixed top-20 left-10 w-64 h-64 bg-[#F97316]/5 rounded-full blur-3xl -z-10 animate-float"></div>
        <div className="fixed bottom-20 right-10 w-80 h-80 bg-[#FB923C]/5 rounded-full blur-3xl -z-10 animate-float" style={{ animationDelay: '2s' }}></div>

        {/* Header */}
        <div className="bg-white/90 backdrop-blur-md border border-[#FED7AA] rounded-2xl p-3 sm:p-4 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-lg shadow-[#F97316]/5 animate__animated animate__fadeInDown hover:border-[#FDBA74] transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-xl flex items-center justify-center shadow-md">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#7C2D12]">Manage Addresses</h2>
              <p className="text-xs sm:text-sm text-[#9A3412]">Add or edit your delivery addresses</p>
            </div>
          </div>
          <button
            onClick={() => { setIsFormOpen(true); resetForm(); }}
            className="group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white rounded-xl hover:shadow-lg hover:shadow-[#F97316]/30 transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm font-medium"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            Add New Address
          </button>
        </div>

        {/* Error Toast */}
        {error && (
          <div className="bg-rose-50/90 backdrop-blur-sm border border-rose-200 rounded-xl p-3 sm:p-4 mb-4 flex justify-between items-center shadow-lg animate__animated animate__shakeX">
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="w-5 h-5 text-rose-500" />
              <span className="text-rose-700 font-medium">{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="p-1.5 hover:bg-rose-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-rose-500" />
            </button>
          </div>
        )}

        {/* Address Cards Grid */}
        {addresses.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-md border border-[#FED7AA] rounded-2xl p-12 sm:p-16 text-center shadow-lg shadow-[#F97316]/5 animate__animated animate__fadeIn">
            <div className="relative inline-block">
              <MapPin className="w-20 h-20 text-[#FDBA74] mx-auto mb-4" />
              <div className="absolute inset-0 bg-[#F97316]/10 rounded-full blur-3xl"></div>
            </div>
            <p className="text-xl font-bold text-[#7C2D12] mb-2">No addresses yet</p>
            <p className="text-[#9A3412] mb-6">Add your first delivery address</p>
            <button
              onClick={() => { setIsFormOpen(true); resetForm(); }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white rounded-xl hover:shadow-lg hover:shadow-[#F97316]/30 transition-all duration-300 transform hover:scale-105 text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add First Address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {addresses.map((addr, i) => (
              <div
                key={addr.id}
                className={`group bg-white/90 backdrop-blur-md border-2 ${addr.isDefault ? "border-[#F97316]" : "border-[#FED7AA] hover:border-[#FDBA74]"
                  } rounded-2xl p-4 sm:p-5 relative hover:shadow-xl hover:shadow-[#F97316]/10 transition-all duration-300 animate__animated animate__fadeInUp`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Default Badge */}
                {addr.isDefault && (
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg z-10 animate-pulse">
                    <Star className="w-3.5 h-3.5 fill-white" />
                    Default
                  </div>
                )}

                {/* Address Type Icon & Name */}
                <div className="flex items-start gap-3 mb-4">
                  <div className={`p-2.5 rounded-xl ${addr.companyName
                      ? 'bg-[#FFF7ED] text-[#F97316]'
                      : 'bg-[#FFF7ED] text-[#F97316]'
                    }`}>
                    {addr.companyName ? (
                      <Briefcase className="w-5 h-5" />
                    ) : (
                      <Home className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-[#7C2D12] text-base">{addr.name}</p>
                      {addr.addressType === "work" && (
                        <span className="text-[10px] bg-[#FFF7ED] text-[#F97316] px-2 py-0.5 rounded-full border border-[#FED7AA]">
                          Work
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#9A3412] flex items-center gap-1 mt-0.5">
                      <Phone className="w-3.5 h-3.5" />
                      {addr.phone}
                    </p>
                  </div>
                </div>

                {/* Address Details */}
                <div className="text-sm space-y-1.5 text-[#9A3412] bg-[#FFF7ED]/50 p-3 rounded-xl border border-[#FED7AA]/50">
                  <p className="text-[#7C2D12] font-medium">{addr.addressLine}</p>
                  <p>{addr.locality}, {addr.city}</p>
                  <p>{addr.state} - <span className="font-semibold">{addr.pincode}</span></p>
                  {addr.landmark && (
                    <p className="text-[#F97316] flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" />
                      Near {addr.landmark}
                    </p>
                  )}
                  {addr.companyName && (
                    <p className="font-medium text-[#7C2D12] pt-1 border-t border-[#FED7AA] mt-2">
                      {addr.companyName}
                    </p>
                  )}
                  {addr.gstNumber && (
                    <p className="text-[10px] bg-white px-2 py-1 rounded border border-[#FED7AA] inline-block">
                      GST: {addr.gstNumber}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-5">
                  <button
                    onClick={() => {
                      setFormData({ ...addr, addressType: addr.companyName ? "work" : "home" });
                      setEditingId(addr.id);
                      setIsFormOpen(true);
                    }}
                    className="flex-1 py-2.5 border-2 border-[#FED7AA] text-[#7C2D12] rounded-xl text-sm hover:bg-[#FFF7ED] hover:border-[#F97316] transition-all duration-300 flex items-center justify-center gap-1.5 group/edit"
                  >
                    <Edit2 className="w-4 h-4 group-hover/edit:scale-110 transition-transform" />
                    Edit
                  </button>

                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      className="flex-1 py-2.5 border-2 border-[#F97316] text-[#F97316] rounded-xl text-sm hover:bg-[#FFF7ED] hover:border-[#EA580C] hover:text-[#EA580C] transition-all duration-300 flex items-center justify-center gap-1.5 group/default"
                    >
                      <Star className="w-4 h-4 group-hover/default:fill-[#F97316] transition-all" />
                      Set Default
                    </button>
                  )}

                  {addresses.length > 1 && (
                    <button
                      onClick={() => handleDelete(addr.id)}
                      className="px-3 py-2.5 border-2 border-rose-200 text-rose-500 rounded-xl hover:bg-rose-50 hover:border-rose-400 transition-all duration-300 group/delete"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 group-hover/delete:scale-110 transition-transform" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
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
                    <input
                      required
                      value={formData.pincode}
                      onChange={e => setFormData(p => ({ ...p, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) }))}
                      placeholder="6-digit pincode"
                      maxLength="6"
                      className="w-full px-3 py-2.5 h-11 bg-white border-2 border-[#FED7AA] rounded-xl text-[#7C2D12] placeholder:text-[#FDBA74]/70 focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 outline-none transition-all"
                    />
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
                    disabled={createMutation.isPending || updateMutation.isPending}
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
    </>
  );
};

export default AddressManager;