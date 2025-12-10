import { useState } from "react";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../../../../redux/slices/userSlice";

export default function ChangePassword() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const toggleShow = (field) => {
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.currentPassword) newErrors.currentPassword = "Current password is required";

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(formData.newPassword)) {
      newErrors.newPassword = "Must contain one uppercase letter";
    } else if (!/[0-9]/.test(formData.newPassword)) {
      newErrors.newPassword = "Must contain one number";
    } else if (!/[^A-Za-z0-9]/.test(formData.newPassword)) {
      newErrors.newPassword = "Must contain one special character";
    }

    if (formData.confirmPassword !== formData.newPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await dispatch(
        changePassword({
          oldPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        })
      ).unwrap();

      setSuccess(true);
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setErrors({ submit: err?.message || "Failed to change password" });
    }
  };

  const strength = {
    length: formData.newPassword.length >= 8,
    upper: /[A-Z]/.test(formData.newPassword),
    number: /[0-9]/.test(formData.newPassword),
    special: /[^A-Za-z0-9]/.test(formData.newPassword),
  };

  const score = Object.values(strength).filter(Boolean).length;
  const strengthText = ["", "Weak", "Fair", "Good", "Strong"][score] || "Very Strong";
  const strengthColor = score <= 1 ? "bg-red-500" : score <= 2 ? "bg-orange-500" : score <= 3 ? "bg-yellow-500" : "bg-green-500";

  return (
    <div className=" mt-[100px] md:mt-0  bg-[#eeece8] px-2 py-4 flex items-center justify-center">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-6">

          {/* Header */}
          <div className="text-center mb-3">
            <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-1">
              <Lock className="w-8 h-8 text-[#f16137]" />
            </div>
            <h1 className="text-2xl font-bold text-[#041f60]">Change Password</h1>
            <p className="text-sm text-gray-600 mt-1">Keep your account secure</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-sm flex items-start gap-3 animate-fade">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-900">Password Updated!</p>
                <p className="text-sm text-green-700">Your password has been changed successfully.</p>
              </div>
            </div>
          )}

          {/* Server Error */}
          {errors.submit && (
            <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-sm flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900">Error</p>
                <p className="text-sm text-red-700">{errors.submit}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Current Password */}
            <div>
              <label className="text-sm font-medium text-[#041f60] flex items-center gap-2 mb-1">
    
                Current Password
              </label>
              <div className="relative">
                <input
                  type={show.current ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className={`w-full px-5 py-3 bg-white text-[var(--primary-text-color)] pl-10 h-12 border ${errors.currentPassword ? "border-red-500" : "border-gray-300"} rounded-sm focus:border-[#f16137] focus:ring-2 focus:ring-orange-100 outline-none transition`}
                  placeholder="Enter current password"
                />
                <Lock className="w-5 h-5 text-black-600  absolute left-3 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => toggleShow("current")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {show.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.currentPassword && <p className="text-red-600 text-sm mt-1">{errors.currentPassword}</p>}
            </div>

            {/* New Password */}
            <div>
              <label className="text-sm font-medium text-[#041f60] flex items-center gap-2 mb-1.5">
   
                New Password
              </label>
              <div className="relative">
                <input
                  type={show.new ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className={`w-full px-5 py-3 pl-11 h-12 bg-white border ${errors.newPassword ? "border-red-500" : "border-gray-300"} rounded-sm focus:border-[#f16137] focus:ring-2 focus:ring-orange-100 outline-none transition`}
                  placeholder="Create new password"
                />
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => toggleShow("new")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {show.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.newPassword && <p className="text-red-600 text-sm mt-1">{errors.newPassword}</p>}
            </div>

            {/* Password Strength */}
            {formData.newPassword && (
              <div className="space-y-3 p-4 bg-gray-50 rounded-sm border border-gray-200">
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-2 flex-1 rounded-full transition-all ${i <= score ? strengthColor : "bg-gray-300"}`}
                    />
                  ))}
                </div>
                <p className="text-sm font-medium text-gray-700">Strength: <span className={score >= 4 ? "text-green-600" : score >= 3 ? "text-yellow-600" : "text-red-600"}>{strengthText}</span></p>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={`${strength.length ? "text-green-600" : "text-gray-500"} flex items-center gap-1.5`}>
                    {strength.length ? "Check" : "Cross"} 8+ characters
                  </div>
                  <div className={`${strength.upper ? "text-green-600" : "text-gray-500"} flex items-center gap-1.5`}>
                    {strength.upper ? "Check" : "Cross"} One uppercase
                  </div>
                  <div className={`${strength.number ? "text-green-600" : "text-gray-500"} flex items-center gap-1.5`}>
                    {strength.number ? "Check" : "Cross"} One number
                  </div>
                  <div className={`${strength.special ? "text-green-600" : "text-gray-500"} flex items-center gap-1.5`}>
                    {strength.special ? "Check" : "Cross"} One special char
                  </div>
                </div>
              </div>
            )}

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-medium text-[#041f60] flex items-center gap-2 mb-1.5">
     
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={show.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-5 py-3 pl-11 h-12 bg-white border ${errors.confirmPassword ? "border-red-500" : "border-gray-300"} rounded-sm focus:border-[#f16137] focus:ring-2 focus:ring-orange-100 outline-none transition`}
                  placeholder="Re-enter new password"
                />
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => toggleShow("confirm")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {show.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#f16137] hover:bg-[#f16157] text-white rounded-xl font-semibold py-3.5 rounded-sm transition flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}