import { useState } from "react";
import { Eye, EyeOff, CheckCircle, Shield } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../../../../../redux/slices/userSlice";
import AccountSectionHeader, { accountButton, accountField } from "../AccountSectionHeader";

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
    setSuccess(false);
    setErrors((prev) => ({ ...prev, [name]: "", submit: "" }));
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
      setShow({ current: false, new: false, confirm: false });
    } catch (err) {
      setErrors({ submit: typeof err === "string" ? err : err?.message || "Failed to change password" });
    }
  };

  const strength = {
    length: formData.newPassword.length >= 8,
    upper: /[A-Z]/.test(formData.newPassword),
    number: /[0-9]/.test(formData.newPassword),
    special: /[^A-Za-z0-9]/.test(formData.newPassword),
  };

  const fields = [
    { key: "current", name: "currentPassword", label: "Current password", autocomplete: "current-password" },
    { key: "new", name: "newPassword", label: "New password", autocomplete: "new-password" },
    { key: "confirm", name: "confirmPassword", label: "Confirm new password", autocomplete: "new-password" },
  ];
  const requirements = [
    [strength.length, "At least 8 characters"],
    [strength.upper, "One uppercase letter"],
    [strength.number, "One number"],
    [strength.special, "One special character"],
  ];

  return (
    <div className="space-y-4">
      <AccountSectionHeader
        icon={Shield}
        title="Change password"
        description="Choose a password you don’t use on other sites."
      />

      <form onSubmit={handleSubmit} className="grid gap-5 rounded-2xl border border-orange-100 bg-white p-4 shadow-sm sm:p-6 xl:grid-cols-[minmax(0,1fr)_15rem]">
        <div className="min-w-0 space-y-4">
          {success && <p role="status" className="rounded-xl bg-emerald-50 p-3 !text-emerald-800">Password updated successfully.</p>}
          {errors.submit && <p role="alert" className="rounded-xl bg-rose-50 p-3 !text-rose-800">{errors.submit}</p>}
          {fields.map(({ key, name, label, autocomplete }) => {
            const VisibilityIcon = show[key] ? EyeOff : Eye;
            return (
              <div key={name} className="flex items-center gap-2  sm:gap-4">
             

                <label htmlFor={name} className="min-w-[150px] mb-1 block text-sm font-bold">{label}</label>
                <div className="relative">
                  <input
                    id={name}
                    name={name}
                    type={show[key] ? "text" : "password"}
                    autoComplete={autocomplete}
                    value={formData[name]}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors[name])}
                    aria-describedby={errors[name] ? `${name}-error` : key === "new" ? "password-requirements" : undefined}
                    className={`${accountField} pr-14`}
                  />
                  <button
                    type="button"
                    aria-label={`${show[key] ? "Hide" : "Show"} ${label.toLowerCase()}`}
                    onClick={() => toggleShow(key)}
                    className="absolute right-0.5 top-0 grid h-10 w-10 place-items-center rounded-xl text-[var(--brand-hover)]"
                  >
                    <VisibilityIcon size={19} aria-hidden="true" />
                  </button>
                </div>
                {errors[name] && <p id={`${name}-error`} role="alert" className="mt-1 text-sm !text-rose-700">{errors[name]}</p>}
              </div>
            );
          })}
        </div>

        <div id="password-requirements" className="self-start rounded-2xl border border-orange-100 bg-orange-50 p-4">
          <h3 className="mb-2 text-base font-bold">Password requirements</h3>
          <ul className="m-0 list-none space-y-2 p-0 text-sm">
            {requirements.map(([met, label]) => (
              <li key={label} className="flex items-center gap-2">
                <CheckCircle size={17} className={met ? "text-emerald-700" : "text-stone-500"} aria-hidden="true" />
                <span className="sr-only">{met ? "Met: " : "Required: "}</span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-orange-100 pt-4 xl:col-span-2">
          <button type="submit" disabled={loading} className={`${accountButton} w-full sm:w-auto`}>
            {loading ? "Updating password…" : "Update password"}
          </button>
        </div>
      </form>
    </div>
  );
}
