import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import { forgotPassword, resetPassword, clearError } from '../../../../redux/slices/userSlice';
import loginbg from '../../../../assets/img/bg/sign.webp';
import './ForgotPassword.css';

const ForgotPassword = () => {
    const [contactNumber, setContactNumber] = useState('');
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});

    const dispatch = useDispatch();
    const history = useHistory();
    const { loading, error } = useSelector((state) => state.user);

    const validateSendOtp = () => {
        const newErrors = {};
        if (!contactNumber) {
            newErrors.contactNumber = 'Mobile number is required';
        } else if (!/^\d{10}$/.test(contactNumber)) {
            newErrors.contactNumber = 'Mobile number must be exactly 10 digits';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateResetPassword = () => {
        const newErrors = {};
        if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
            newErrors.otp = 'Please enter a valid 6-digit OTP';
        }
        if (!newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if (newPassword.length < 6) {
            newErrors.newPassword = 'Password must be at least 6 characters long';
        }
        if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!validateSendOtp()) return;

        try {
            await dispatch(forgotPassword(contactNumber)).unwrap();
            setStep(2);
            setErrors({});
        } catch (err) {
            setErrors({ general: err.message || 'Failed to send OTP' });
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!validateResetPassword()) return;

        try {
            await dispatch(resetPassword({ contactNumber, otp, newPassword })).unwrap();
            setErrors({});
            history.push('/login');
        } catch (err) {
            setErrors({ general: err.message || 'Failed to reset password' });
        }
    };

    useEffect(() => {
        dispatch(clearError());
        setErrors({});
    }, [dispatch]);

    useEffect(() => {
        if (errors.general) {
            const timer = setTimeout(() => {
                setErrors({ ...errors, general: '' });
                dispatch(clearError());
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [errors, dispatch]);

    return (
        <section className="auth-section">
            <div className="container">
                <div className="auth-container">
                    <div className="row no-gutters">
                        <div className="col-lg-6">
                            <div className="auth-background">
                                <div className="description text-center"></div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="auth-form">
                                <h2>{step === 1 ? 'Forgot Password' : 'Reset Password'}</h2>

                                {(error || errors.general) && (
                                    <div className="alert alert-danger">
                                        {error || errors.general}
                                    </div>
                                )}

                                {step === 1 ? (
                                    <form onSubmit={handleSendOtp}>
                                        <div className="input-field input-field-styled mb-20">
                                            <input
                                                type="tel"
                                                placeholder="Mobile Number"
                                                value={contactNumber}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/\D/g, "");
                                                    if (value.length <= 10) {
                                                        setContactNumber(value);
                                                        if (errors.contactNumber) {
                                                            setErrors({ ...errors, contactNumber: '' });
                                                        }
                                                    }
                                                }}
                                                maxLength={10}
                                                className={errors.contactNumber ? 'is-invalid' : ''}
                                                required
                                            />
                                            {errors.contactNumber && (
                                                <div className="error-feedback">{errors.contactNumber}</div>
                                            )}
                                        </div>

                                        <div className="auth-link-container">
                                            <Link to="/login" className="auth-link">
                                                Remember your password? <span className="auth-link-login">Login</span>
                                            </Link>
                                        </div>

                                        <button
                                            type="submit"
                                            className="primary-btn"
                                            disabled={loading}
                                        >
                                            {loading ? 'Sending OTP...' : 'Send OTP'}
                                        </button>
                                    </form>
                                ) : (
                                    <form onSubmit={handleResetPassword}>
                                        <div className="input-field input-field-styled mb-20">
                                            <input
                                                type="text"
                                                placeholder="OTP"
                                                value={otp}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/\D/g, "");
                                                    setOtp(value);
                                                    if (errors.otp) {
                                                        setErrors({ ...errors, otp: '' });
                                                    }
                                                }}
                                                maxLength={6}
                                                className={errors.otp ? 'is-invalid' : ''}
                                                required
                                            />
                                            {errors.otp && <div className="error-feedback">{errors.otp}</div>}
                                        </div>

                                        <div className="input-field input-field-styled mb-20">
                                            <input
                                                type="password"
                                                placeholder="New Password"
                                                value={newPassword}
                                                onChange={(e) => {
                                                    setNewPassword(e.target.value);
                                                    if (errors.newPassword) {
                                                        setErrors({ ...errors, newPassword: '' });
                                                    }
                                                }}
                                                className={errors.newPassword ? 'is-invalid' : ''}
                                                required
                                            />
                                            {errors.newPassword && (
                                                <div className="error-feedback">{errors.newPassword}</div>
                                            )}
                                        </div>

                                        <div className="input-field input-field-styled mb-30">
                                            <input
                                                type="password"
                                                placeholder="Confirm Password"
                                                value={confirmPassword}
                                                onChange={(e) => {
                                                    setConfirmPassword(e.target.value);
                                                    if (errors.confirmPassword) {
                                                        setErrors({ ...errors, confirmPassword: '' });
                                                    }
                                                }}
                                                className={errors.confirmPassword ? 'is-invalid' : ''}
                                                required
                                            />
                                            {errors.confirmPassword && (
                                                <div className="error-feedback">{errors.confirmPassword}</div>
                                            )}
                                        </div>

                                        <button
                                            type="submit"
                                            className="primary-btn"
                                            disabled={loading}
                                        >
                                            {loading ? 'Resetting...' : 'Reset Password'}
                                        </button>

                                        <p className="resend-prompt">
                                            Didn't receive OTP?{' '}
                                            <button
                                                type="button"
                                                className="resend-otp"
                                                onClick={handleSendOtp}
                                            >
                                                Resend OTP
                                            </button>
                                        </p>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ForgotPassword;