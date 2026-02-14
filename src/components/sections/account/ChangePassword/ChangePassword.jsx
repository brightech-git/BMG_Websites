import { useState } from "react";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader2, Shield, Key } from "lucide-react";
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
  const strengthColor =
    score <= 1 ? "bg-[#F97316]" :
      score <= 2 ? "bg-[#FB923C]" :
        score <= 3 ? "bg-[#FDBA74]" :
          "bg-[#10B981]";

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 5px rgba(249, 115, 22, 0.2); }
          50% { box-shadow: 0 0 20px rgba(249, 115, 22, 0.4); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-glow { animation: glow 2s ease-in-out infinite; }
      `}</style>

      <div className="min-h-screen  md:mt-0 bg-gradient-to-br from-[#FFF7ED] via-[#FFEDD5] to-[#FFF3E6] px-3 sm:px-4 py-4 sm:py-6 flex items-center justify-center animate__animated animate__fadeIn">

        {/* Decorative Elements */}
        <div className="fixed top-20 left-10 w-64 h-64 bg-[#F97316]/5 rounded-full blur-3xl -z-10 animate-float"></div>
        <div className="fixed bottom-20 right-10 w-80 h-80 bg-[#FB923C]/5 rounded-full blur-3xl -z-10 animate-float" style={{ animationDelay: '2s' }}></div>

        <div className="w-full max-w-md animate__animated animate__fadeInUp">

          {/* Main Card */}
          <div className="bg-white/90 backdrop-blur-md border-2 border-[#FED7AA] rounded-2xl shadow-lg shadow-[#F97316]/10 p-5 sm:p-6 hover:shadow-xl hover:shadow-[#F97316]/20 transition-all duration-300">

            {/* Header */}
            <div className="text-center mb-5">
              <div className="relative inline-block">
                <div className="w-16 h-16 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#FED7AA] rounded-full animate-pulse"></div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#7C2D12] mb-1">Change Password</h1>
              <p className="text-sm text-[#9A3412] flex items-center justify-center gap-1.5">
                <Shield className="w-4 h-4" />
                Keep your account secure
              </p>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl flex items-start gap-3 animate__animated animate__fadeInDown shadow-md">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-emerald-900">Password Updated!</p>
                  <p className="text-xs sm:text-sm text-emerald-700">Your password has been changed successfully.</p>
                </div>
                <button
                  onClick={() => setSuccess(false)}
                  className="text-emerald-600 hover:text-emerald-800"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Server Error */}
            {errors.submit && (
              <div className="mb-4 p-4 bg-gradient-to-r from-rose-50 to-red-50 border border-rose-200 rounded-xl flex items-start gap-3 animate__animated animate__shakeX shadow-md">
                <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-rose-900">Error</p>
                  <p className="text-xs sm:text-sm text-rose-700">{errors.submit}</p>
                </div>
                <button
                  onClick={() => setErrors({})}
                  className="text-rose-600 hover:text-rose-800"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Current Password */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-semibold text-[#7C2D12] flex items-center gap-2">
                  <div className="w-5 h-5 bg-[#FFF7ED] rounded-lg flex items-center justify-center">
                    <Key className="w-3.5 h-3.5 text-[#F97316]" />
                  </div>
                  Current Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative group">
                  <input
                    type={show.current ? "text" : "password"}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pl-11 h-12 bg-white border-2 ${errors.currentPassword ? "border-rose-400" : "border-[#FED7AA] group-hover:border-[#FDBA74]"
                      } rounded-xl text-[#7C2D12] placeholder:text-[#FDBA74]/70 focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 outline-none transition-all duration-300`}
                    placeholder="Enter current password"
                  />
                  <Lock className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${errors.currentPassword ? "text-rose-400" : "text-[#F97316]"
                    }`} />
                  <button
                    type="button"
                    onClick={() => toggleShow("current")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A3412] hover:text-[#F97316] transition-colors p-1 hover:bg-[#FFF7ED] rounded-lg"
                  >
                    {show.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="text-rose-600 text-xs sm:text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.currentPassword}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-semibold text-[#7C2D12] flex items-center gap-2">
                  <div className="w-5 h-5 bg-[#FFF7ED] rounded-lg flex items-center justify-center">
                    <Lock className="w-3.5 h-3.5 text-[#F97316]" />
                  </div>
                  New Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative group">
                  <input
                    type={show.new ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pl-11 h-12 bg-white border-2 ${errors.newPassword ? "border-rose-400" : "border-[#FED7AA] group-hover:border-[#FDBA74]"
                      } rounded-xl text-[#7C2D12] placeholder:text-[#FDBA74]/70 focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 outline-none transition-all duration-300`}
                    placeholder="Create new password"
                  />
                  <Lock className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${errors.newPassword ? "text-rose-400" : "text-[#F97316]"
                    }`} />
                  <button
                    type="button"
                    onClick={() => toggleShow("new")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A3412] hover:text-[#F97316] transition-colors p-1 hover:bg-[#FFF7ED] rounded-lg"
                  >
                    {show.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-rose-600 text-xs sm:text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.newPassword}
                  </p>
                )}
              </div>

              {/* Password Strength Meter */}
              {formData.newPassword && (
                <div className="space-y-3 p-4 bg-gradient-to-br from-[#FFF7ED] to-[#FFEDD5] rounded-xl border-2 border-[#FED7AA] animate__animated animate__fadeIn">

                  {/* Strength Bars */}
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-full transition-all duration-500 ${i <= score ? strengthColor : "bg-[#FED7AA]"
                          }`}
                      />
                    ))}
                  </div>

                  {/* Strength Text */}
                  <div className="flex justify-between items-center">
                    <p className="text-xs sm:text-sm font-medium text-[#7C2D12]">
                      Password Strength:
                    </p>
                    <span className={`text-xs sm:text-sm font-bold px-3 py-1 rounded-full border ${score >= 4 ? "bg-green-50 text-green-700 border-green-200" :
                        score >= 3 ? "bg-[#FED7AA] text-[#C2410C] border-[#FDBA74]" :
                          "bg-rose-50 text-rose-700 border-rose-200"
                      }`}>
                      {strengthText}
                    </span>
                  </div>

                  {/* Requirements Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm bg-white/50 p-3 rounded-lg border border-[#FED7AA]">
                    <div className={`flex items-center gap-1.5 ${strength.length ? "text-emerald-600" : "text-[#9A3412]"
                      }`}>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${strength.length ? "bg-emerald-100" : "bg-[#FED7AA]"
                        }`}>
                        {strength.length ? (
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <span className="text-[#9A3412] text-xs">•</span>
                        )}
                      </div>
                      8+ characters
                    </div>
                    <div className={`flex items-center gap-1.5 ${strength.upper ? "text-emerald-600" : "text-[#9A3412]"
                      }`}>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${strength.upper ? "bg-emerald-100" : "bg-[#FED7AA]"
                        }`}>
                        {strength.upper ? (
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <span className="text-[#9A3412] text-xs">•</span>
                        )}
                      </div>
                      Uppercase letter
                    </div>
                    <div className={`flex items-center gap-1.5 ${strength.number ? "text-emerald-600" : "text-[#9A3412]"
                      }`}>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${strength.number ? "bg-emerald-100" : "bg-[#FED7AA]"
                        }`}>
                        {strength.number ? (
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <span className="text-[#9A3412] text-xs">•</span>
                        )}
                      </div>
                      One number
                    </div>
                    <div className={`flex items-center gap-1.5 ${strength.special ? "text-emerald-600" : "text-[#9A3412]"
                      }`}>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${strength.special ? "bg-emerald-100" : "bg-[#FED7AA]"
                        }`}>
                        {strength.special ? (
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <span className="text-[#9A3412] text-xs">•</span>
                        )}
                      </div>
                      Special character
                    </div>
                  </div>
                </div>
              )}

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-semibold text-[#7C2D12] flex items-center gap-2">
                  <div className="w-5 h-5 bg-[#FFF7ED] rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-3.5 h-3.5 text-[#F97316]" />
                  </div>
                  Confirm New Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative group">
                  <input
                    type={show.confirm ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pl-11 h-12 bg-white border-2 ${errors.confirmPassword ? "border-rose-400" : "border-[#FED7AA] group-hover:border-[#FDBA74]"
                      } rounded-xl text-[#7C2D12] placeholder:text-[#FDBA74]/70 focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 outline-none transition-all duration-300`}
                    placeholder="Re-enter new password"
                  />
                  <Lock className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${errors.confirmPassword ? "text-rose-400" : "text-[#F97316]"
                    }`} />
                  <button
                    type="button"
                    onClick={() => toggleShow("confirm")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A3412] hover:text-[#F97316] transition-colors p-1 hover:bg-[#FFF7ED] rounded-lg"
                  >
                    {show.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-rose-600 text-xs sm:text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.confirmPassword}
                  </p>
                )}
                {formData.confirmPassword && formData.newPassword === formData.confirmPassword && !errors.confirmPassword && (
                  <p className="text-emerald-600 text-xs sm:text-sm mt-1 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Passwords match
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white rounded-xl font-semibold py-3.5 px-4 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg hover:shadow-[#F97316]/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base group animate-glow"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Updating Password...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                      Update Password
                    </>
                  )}
                </button>
              </div>

            </form>

            {/* Security Tip */}
            <div className="mt-5 pt-4 border-t-2 border-[#FED7AA] text-center">
              <p className="text-xs text-[#9A3412] flex items-center justify-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                Use a strong, unique password that you don't use elsewhere
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}