import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { forgotPassword, resetPassword, clearError } from '../../../../redux/slices/userSlice';
import './ForgotPassword.css';

const ForgotPassword = () => {
    const [contactNumber, setContactNumber] = useState('');
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});

    const dispatch = useDispatch();
    const history = useNavigate();
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
            navigate('/login');
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
                <div className="auth-container animate-fade-in-up">
                    <div className="auth-form animate-fade-in-down">
                        <h2>{step === 1 ? 'Forgot Password' : 'Reset Password'}</h2>

                        {(error || errors.general) && (
                            <div className="alert alert-danger animate-shake">
                                {error || errors.general}
                            </div>
                        )}

                        {step === 1 ? (
                            <form onSubmit={handleSendOtp} className="animate-bounce-in">
                                <div className="input-field input-field-styled mb-20">
                                    <label htmlFor="contactNumber">Mobile Number</label>
                                    <input
                                        id="contactNumber"
                                        type="tel"
                                        placeholder="Enter your mobile number"
                                        value={contactNumber}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, "");
                                            if (value.length <= 10) setContactNumber(value);
                                            if (errors.contactNumber) setErrors({ ...errors, contactNumber: '' });
                                        }}
                                        maxLength={10}
                                        className={errors.contactNumber ? 'is-invalid mobile-input' : 'mobile-input'}
                                        required
                                    />
                                    {errors.contactNumber && (
                                        <div className="error-feedback">{errors.contactNumber}</div>
                                    )}
                                </div>

                                <div className='button-section'>
                                    <button
                                        type="submit"
                                        className="btn-main main-filled"
                                        disabled={loading}
                                    >
                                        {loading ? 'Sending OTP...' : 'Send OTP'}
                                    </button>
                                </div>

                                <div className="auth-link-container">
                                    <Link to="/login" className="auth-link">
                                        Remember your password? <span className="auth-link-login">Login</span>
                                    </Link>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleResetPassword} className="animate-bounce-in">
                                <div className="input-field input-field-styled mb-20">
                                    <label htmlFor="otp">OTP</label>
                                    <input
                                        id="otp"
                                        type="text"
                                        placeholder="Enter OTP"
                                        value={otp}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, "");
                                            if (value.length <= 6) setOtp(value);
                                            if (errors.otp) setErrors({ ...errors, otp: '' });
                                        }}
                                        maxLength={6}
                                        className={errors.otp ? 'is-invalid mobile-input' : 'mobile-input'}
                                        required
                                    />
                                    {errors.otp && <div className="error-feedback">{errors.otp}</div>}
                                </div>

                                <div className="input-field input-field-styled mb-20">
                                    <label htmlFor="newPassword">New Password</label>
                                    <input
                                        id="newPassword"
                                        type="password"
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => {
                                            setNewPassword(e.target.value);
                                            if (errors.newPassword) setErrors({ ...errors, newPassword: '' });
                                        }}
                                        className={errors.newPassword ? 'is-invalid mobile-input' : 'mobile-input'}
                                        required
                                    />
                                    {errors.newPassword && <div className="error-feedback">{errors.newPassword}</div>}
                                </div>

                                <div className="input-field input-field-styled mb-30">
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);
                                            if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                                        }}
                                        className={errors.confirmPassword ? 'is-invalid mobile-input' : 'mobile-input'}
                                        required
                                    />
                                    {errors.confirmPassword && <div className="error-feedback">{errors.confirmPassword}</div>}
                                </div>

                                <div className='button-section'>
                                    <button
                                        type="submit"
                                        className="btn-main main-filled"
                                        disabled={loading}
                                    >
                                        {loading ? 'Resetting...' : 'Reset Password'}
                                    </button>
                                </div>

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
        </section>
    );
};

export default ForgotPassword;
