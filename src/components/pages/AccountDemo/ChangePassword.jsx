import { useState } from "react";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import Layout from "./Layout";

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(formData.newPassword)) {
      newErrors.newPassword = "Must contain at least one uppercase letter";
    } else if (!/[0-9]/.test(formData.newPassword)) {
      newErrors.newPassword = "Must contain at least one number";
    } else if (!/[^A-Za-z0-9]/.test(formData.newPassword)) {
      newErrors.newPassword = "Must contain at least one special character";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccess(true);
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      setErrors({
        submit: "Failed to update password. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = {
    hasMinLength: formData.newPassword.length >= 8,
    hasUppercase: /[A-Z]/.test(formData.newPassword),
    hasNumber: /[0-9]/.test(formData.newPassword),
    hasSpecialChar: /[^A-Za-z0-9]/.test(formData.newPassword),
  };

  const strengthScore =
    Object.values(passwordStrength).filter(Boolean).length;

  return (
    <Layout>
      <div className="max-w-md mx-auto py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Lock size={32} className="text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Change Password
            </h1>
            <p className="text-gray-600">
              Secure your account with a new password
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 flex items-center gap-3 bg-green-50 p-4 rounded-lg border border-green-200">
              <CheckCircle size={20} className="text-green-600" />
              <div>
                <p className="font-semibold text-green-900">Success!</p>
                <p className="text-sm text-green-800">
                  Your password has been updated successfully.
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errors.submit && (
            <div className="mb-6 flex items-center gap-3 bg-red-50 p-4 rounded-lg border border-red-200">
              <AlertCircle size={20} className="text-red-600" />
              <div>
                <p className="font-semibold text-red-900">Error</p>
                <p className="text-sm text-red-800">{errors.submit}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter your current password"
                  className={`w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.currentPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.currentPassword}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter your new password"
                  className={`w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.newPassword ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.newPassword}
                </p>
              )}

              {/* Password Strength Indicator */}
              {formData.newPassword && (
                <div className="mt-3 space-y-2">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          i < strengthScore
                            ? "bg-blue-600"
                            : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600">
                    Strength:{" "}
                    <span className="font-semibold">
                      {strengthScore === 0 && "Weak"}
                      {strengthScore === 1 && "Fair"}
                      {strengthScore === 2 && "Good"}
                      {strengthScore === 3 && "Strong"}
                      {strengthScore === 4 && "Very Strong"}
                    </span>
                  </p>

                  {/* Requirements */}
                  <div className="mt-3 space-y-1 text-xs">
                    <div
                      className={`flex items-center gap-2 ${
                        passwordStrength.hasMinLength
                          ? "text-green-600"
                          : "text-gray-600"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border ${
                          passwordStrength.hasMinLength
                            ? "bg-green-600 border-green-600"
                            : "border-gray-300"
                        }`}
                      />
                      Minimum 8 characters
                    </div>
                    <div
                      className={`flex items-center gap-2 ${
                        passwordStrength.hasUppercase
                          ? "text-green-600"
                          : "text-gray-600"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border ${
                          passwordStrength.hasUppercase
                            ? "bg-green-600 border-green-600"
                            : "border-gray-300"
                        }`}
                      />
                      Uppercase letter
                    </div>
                    <div
                      className={`flex items-center gap-2 ${
                        passwordStrength.hasNumber
                          ? "text-green-600"
                          : "text-gray-600"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border ${
                          passwordStrength.hasNumber
                            ? "bg-green-600 border-green-600"
                            : "border-gray-300"
                        }`}
                      />
                      Number
                    </div>
                    <div
                      className={`flex items-center gap-2 ${
                        passwordStrength.hasSpecialChar
                          ? "text-green-600"
                          : "text-gray-600"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border ${
                          passwordStrength.hasSpecialChar
                            ? "bg-green-600 border-green-600"
                            : "border-gray-300"
                        }`}
                      />
                      Special character
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your new password"
                  className={`w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Lock size={18} />
                  Update Password
                </>
              )}
            </button>
          </form>

          {/* Security Tip */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-900 font-semibold mb-1">
              Security Tip
            </p>
            <p className="text-xs text-blue-800">
              Use a unique password that you don't use on other websites. Keep
              your password confidential and never share it with anyone.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
