import { useState } from "react";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
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

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.currentPassword)
      newErrors.currentPassword = "Current password is required";

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

    if (!validate()) return;

    try {
      await dispatch(
        changePassword({
          oldPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        })
      ).unwrap();

      setSuccess(true);
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      setErrors({ submit: error?.message || "Failed to update password" });
    }
  };

  const passwordStrength = {
    hasMinLength: formData.newPassword.length >= 8,
    hasUppercase: /[A-Z]/.test(formData.newPassword),
    hasNumber: /[0-9]/.test(formData.newPassword),
    hasSpecialChar: /[^A-Za-z0-9]/.test(formData.newPassword),
  };

  const strengthScore = Object.values(passwordStrength).filter(Boolean).length;

  return (

      <div className="max-w-md mx-auto py-2">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">

          {/* Header */}
          <div className="text-center mb-1">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-2">
              <Lock size={32} className="text-blue-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Change Password</h1>
            <p className="text-gray-600">Secure your account with a new password</p>
          </div>

          {/* Success */}
          {success && (
            <div className="mb-2 flex items-center gap-3 bg-green-50 p-2 rounded-lg border border-green-200">
              <CheckCircle size={20} className="text-green-600" />
              <div>
                <p className="font-semibold text-green-900">Success!</p>
                <p className="text-sm text-green-800">
                  Your password has been updated successfully.
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {errors.submit && (
            <div className="mb-2 flex items-center gap-3 bg-red-50 p-4 rounded-lg border border-red-200">
              <AlertCircle size={20} className="text-red-600" />
              <div>
                <p className="font-semibold text-red-900">Error</p>
                <p className="text-sm text-red-800">{errors.submit}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">

            {/* Current Password */}
            <InputField
              label="Current Password"
              type={showCurrentPassword ? "text" : "password"}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              error={errors.currentPassword}
              icon={<Lock size={18} />}
              onToggle={() => setShowCurrentPassword(!showCurrentPassword)}
              showToggle={true}
              showPassword={showCurrentPassword}
            />

            {/* New Password */}
            <InputField
              label="New Password"
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              error={errors.newPassword}
              icon={<Lock size={18} />}
              onToggle={() => setShowNewPassword(!showNewPassword)}
              showToggle={true}
              showPassword={showNewPassword}
            />

            {/* Strength Bar */}
            {formData.newPassword && (
              <StrengthIndicator
                passwordStrength={passwordStrength}
                strengthScore={strengthScore}
              />
            )}

            {/* Confirm Password */}
            <InputField
              label="Confirm New Password"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              icon={<Lock size={18} />}
              onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
              showToggle={true}
              showPassword={showConfirmPassword}
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>

          </form>
        </div>
      </div>
 
  );
}

/* ------ Reusable Input Component ------ */
function InputField({
  label,
  type,
  name,
  value,
  onChange,
  error,
  icon,
  showToggle,
  onToggle,
  showPassword,
}) {
  const ToggleIcon = showPassword ? <EyeOff size={18} /> : <Eye size={18} />;

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={label}
          className={`w-full px-4 py-2 pl-10 border bg-white h-10 ${error ? "border-red-500" : "border-gray-300"
            }`}
        />
        <span className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </span>

        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {ToggleIcon}
          </button>
        )}
      </div>
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}

/* ------ Strength Indicator Component ------ */
function StrengthIndicator({ passwordStrength, strengthScore }) {
  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${i < strengthScore ? "bg-blue-600" : "bg-gray-200"
              }`}
          />
        ))}
      </div>

      <p className="text-xs text-gray-600">
        Strength:{" "}
        <span className="font-semibold">
          {["Weak", "Fair", "Good", "Strong", "Very Strong"][strengthScore]}
        </span>
      </p>

      {/* Requirements */}
      <div className="space-y-1 text-xs">
        {[
          ["Minimum 8 characters", passwordStrength.hasMinLength],
          ["Uppercase letter", passwordStrength.hasUppercase],
          ["Number", passwordStrength.hasNumber],
          ["Special character", passwordStrength.hasSpecialChar],
        ].map(([label, valid]) => (
          <div
            key={label}
            className={`flex items-center gap-2 ${valid ? "text-green-600" : "text-gray-600"
              }`}
          >
            <div
              className={`w-2 h-2 rounded-full border ${valid ? "bg-green-600 border-green-600" : "border-gray-300"
                }`}
            />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
