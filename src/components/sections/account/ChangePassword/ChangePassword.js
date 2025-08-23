import React, { useState } from 'react';
import { FiLock, FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword } from '../../../../redux/slices/userSlice';
import AccountSideBar from '../AccountSidebar/AccountSideBar';
import './ChangePassword.css';

const ChangePassword = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain at least one uppercase letter';
    } else if (!/[0-9]/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain at least one number';
    } else if (!/[^A-Za-z0-9]/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain at least one special character';
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      try {
        await dispatch(
          changePassword({
            oldPassword: formData.currentPassword, // backend expects oldPassword
            newPassword: formData.newPassword
          })
        ).unwrap();

        setSuccess(true);
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });

        setTimeout(() => setSuccess(false), 5000);
      } catch (err) {
        console.error('Password change failed:', err);
      }
    }
  };

  return (
    <div className="change-password-page">
      <AccountSideBar />

      <main className="change-password-main">
        <div className="change-password-container">
          <div className="change-password-header">
            <h1 className="page-title">Change Password</h1>
            <p className="page-subtitle">Secure your account with a new password</p>
          </div>

          {success && (
            <div className="success-message">
              <FiCheckCircle className="success-icon" />
              <span>Your password has been updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="password-form">
            {/* Current Password */}
            <div className={`form-group ${errors.currentPassword ? 'error' : ''}`}>
              <label htmlFor="currentPassword">Current Password</label>
              <div className="input-wrapper">
              
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder=  "Enter current password"
                  className="password-input"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                >
                  {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="error-message">{errors.currentPassword}</p>
              )}
            </div>

            {/* New Password */}
            <div className={`form-group ${errors.newPassword ? 'error' : ''}`}>
              <label htmlFor="newPassword">New Password</label>
              <div className="input-wrapper">
             
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className="password-input"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                >
                  {showNewPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="error-message">{errors.newPassword}</p>
              )}
              <div className="password-strength">
                <div className={`strength-indicator ${formData.newPassword.length >= 8 ? 'active' : ''}`}>
                  Minimum 8 characters
                </div>
                <div className={`strength-indicator ${/[A-Z]/.test(formData.newPassword) ? 'active' : ''}`}>
                  Uppercase letter
                </div>
                <div className={`strength-indicator ${/[0-9]/.test(formData.newPassword) ? 'active' : ''}`}>
                  Number
                </div>
                <div className={`strength-indicator ${/[^A-Za-z0-9]/.test(formData.newPassword) ? 'active' : ''}`}>
                  Special character
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div className={`form-group ${errors.confirmPassword ? 'error' : ''}`}>
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <div className="input-wrapper">
              
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  className="password-input"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="error-message">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit */}
            <div className="form-footer">
              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading-spinner"></span>
                ) : (
                  'Update Password'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ChangePassword;
