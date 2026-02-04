import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signup, verifyOtp, clearError } from '../../../redux/slices/userSlice';
import GoogleLoginButton from './GoogleLoginButton';
import './RegisterContent.css';

const RegisterContent = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [tempContactNumber, setTempContactNumber] = useState('');
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useDispatch();
    const history = useNavigate();
    const location = useLocation();
    const { isAuthenticated, error, loading } = useSelector((state) => state.user);

    const roles = ["ROLE_USER"];

    const validateForm = () => {
        const newErrors = {};
        if (!username.trim() || username.length < 3) newErrors.username = 'Username min 3 characters';
        if (!email) newErrors.email = 'Email required';
        else if (!email.endsWith('@gmail.com')) newErrors.email = 'Email must be Gmail';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email';
        if (!contactNumber) newErrors.contactNumber = 'Mobile required';
        else if (!/^\d{10}$/.test(contactNumber)) newErrors.contactNumber = 'Must be 10 digits';
        if (!password || password.length < 6) newErrors.password = 'Password min 6 characters';
        if (!roles.length) newErrors.roles = 'Role required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = (e) => {
        e.preventDefault();
        if (loading) return;
        if (validateForm()) {
            dispatch(signup({ username, email, contactNumber, password, roles }))
                .unwrap()
                .then(() => {
                    setShowOtpModal(true);
                    setTempContactNumber(contactNumber);
                })
                .catch(() => { });
        }
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        if (loading) return;
        if (!/^\d{6}$/.test(otp)) {
            setErrors({ ...errors, otp: 'Enter valid 6-digit OTP' });
            return;
        }
        dispatch(verifyOtp({ contactNumber: tempContactNumber || contactNumber, otp }))
            .unwrap()
            .then(() => {
                setShowOtpModal(false);
                navigate('/');
            })
            .catch(() => { });
    };

    useEffect(() => {
        if (isAuthenticated && !showOtpModal) {
            const lastVisited = localStorage.getItem('lastVisited') || '/';
            navigate(lastVisited !== '/register' ? lastVisited : '/');
        }
    }, [isAuthenticated, showOtpModal, history]);

    useEffect(() => {
        if (errors) {
            const timer = setTimeout(() => dispatch(clearError()), 3000);
            return () => clearTimeout(timer);
        }
    }, [errors, dispatch]);

    useEffect(() => {
        setErrors({});
        dispatch(clearError());
    }, [location.pathname, dispatch]);

    const formFields = [
        { name: 'username', label: 'Username', type: 'text', placeholder: 'Enter username', value: username, setter: setUsername },
        { name: 'email', label: 'Email Address', type: 'email', placeholder: 'Enter your email', value: email, setter: setEmail },
        { name: 'contactNumber', label: 'Mobile Number', type: 'text', placeholder: 'Enter 10-digit mobile', value: contactNumber, setter: setContactNumber },
        { name: 'password', label: 'Password', type: 'password', placeholder: 'Create a strong password', value: password, setter: setPassword }
    ];

    return (
        <div className="register-container">
            <section className="register-section animate-fade-in">
                <div className="register-box animate-fade-in-up">
                    <div className="register-header animate-fade-in-down">
                        <h1 className="register-title">{showOtpModal ? 'Verify Your Account' : 'Create Your Account Today'}</h1>
                        <p className="register-subtitle">{showOtpModal ? 'Enter the 6-digit code sent to your mobile' : 'Fill in your details to get started'}</p>
                    </div>

                    {error && !showOtpModal && (
                        <div className="register-error animate-shake">
                            <svg className="error-icon" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v2h-2v-2zm0-8h2v6h-2V9z" /></svg>
                            <span>{error}</span>
                        </div>
                    )}

                    {!showOtpModal ? (
                        <form onSubmit={handleRegister} className="register-form" autoComplete="off">
                            {formFields.map((f) => {
                                const isPassword = f.name === 'password';
                                return (
                                    <div className={isPassword ? "auth-password-wrapper" : "register-field"} key={f.name}>
                                        <label className="register-label">{f.label}</label>
                                        <input
                                            type={isPassword ? (showPassword ? "text" : "password") : f.type}
                                            placeholder={f.placeholder}
                                            value={f.value}
                                            maxLength={f.name === 'contactNumber' ? 10 : undefined} // limit to 10 digits
                                            onChange={(e) => {
                                                if (f.name === 'contactNumber') {
                                                    // remove any non-digit character
                                                    f.setter(e.target.value.replace(/\D/g, ''));
                                                } else {
                                                    f.setter(e.target.value);
                                                }
                                            }}
                                            className={`register-input ${errors[f.name] ? 'input-error' : ''}`}
                                        />

                                        {errors[f.name] && <div className="field-error-message">{errors[f.name]}</div>}

                                        {isPassword && (
                                            <span
                                                className="register-password-icon"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <svg viewBox="0 0 24 24">
                                                        <path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12a5 5 0 110-10 5 5 0 010 10zm0-8a3 3 0 100 6 3 3 0 000-6z" />
                                                    </svg>
                                                ) : (
                                                    <svg viewBox="0 0 24 24">
                                                        <path d="M12 5c-7 0-10 7-10 7s3 7 10 7c2.3 0 4.2-.7 5.8-1.7l1.4 1.4 1.4-1.4L4.3 4.3 2.9 5.7 6 8.8C4.3 10.1 3 12 3 12s3 7 10 7c1.6 0 3-.3 4.3-.8l2.6 2.6 1.4-1.4L4.3 4.3 2.9 5.7 6 8.8M12 7a5 5 0 015 5c0 .6-.1 1.1-.3 1.6l-1.5-1.5A3 3 0 0012 9c-.4 0-.8.1-1.1.2L9.4 7.7A5 5 0 0112 7z" />
                                                    </svg>
                                                )}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}


                            <button type="submit" className="register-btn animate-bounce-in" disabled={loading}>
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>

                            <div className="register-divider"><span>or</span></div>
                            <div className="register-social"><GoogleLoginButton /></div>
                            <div className="register-redirect">
                                <span>Already have an account?</span>
                                <Link to="/login" className="redirect-link">Sign In</Link>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="register-form">
                            <div className="register-field">
                                <label className="register-label">Verification Code</label>
                                <input
                                    type="text"
                                    placeholder="Enter 6-digit OTP"
                                    value={otp}
                                    maxLength={6}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    className={`register-input ${errors.otp ? 'input-error' : ''}`}
                                />
                                {errors.otp && <div className="field-error-message">{errors.otp}</div>}
                            </div>
                            <button type="submit" className="register-btn animate-bounce-in" disabled={loading}>
                                {loading ? 'Verifying...' : 'Verify OTP'}
                            </button>
                            <div className="register-redirect">
                                <span>Back to</span>
                                <button type="button" className="redirect-link" onClick={() => setShowOtpModal(false)}>Registration</button>
                            </div>
                        </form>
                    )}
                </div>
            </section>
        </div>
    );
};

export default RegisterContent;
