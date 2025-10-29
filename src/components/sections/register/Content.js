import React, { useState, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signup, verifyOtp, clearError } from '../../../redux/slices/userSlice';
import loginbg from '../../../assets/img/bg/sign.webp';
import GoogleLoginButton from './GoogleLoginButton';
import './Register.css';

const Content = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [tempContactNumber, setTempContactNumber] = useState('');
    const [errors, setErrors] = useState({});

    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    const { isAuthenticated, error, loading } = useSelector((state) => state.user);

    const roles = ["ROLE_USER"];

    const validateForm = () => {
        const newErrors = {};

        if (!username.trim() || username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters long';
        }

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!email.endsWith('@gmail.com')) {
            newErrors.email = 'Email must be a valid Gmail address (@gmail.com)';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!contactNumber) {
            newErrors.contactNumber = 'Mobile number is required';
        } else if (!/^\d{10}$/.test(contactNumber)) {
            newErrors.contactNumber = 'Mobile number must be exactly 10 digits';
        }

        if (!password || password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
        }

        if (!roles || roles.length === 0) {
            newErrors.roles = 'Role must be set for this account';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = (e) => {
        e.preventDefault();
        if (loading) return;
        if (validateForm()) {
            console.log('Dispatching signup with:', { username, email, contactNumber, password, roles });
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
        if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
            setErrors({ ...errors, otp: 'Please enter a valid 6-digit OTP' });
            return;
        }

        const payload = {
            contactNumber: tempContactNumber || contactNumber,
            otp: otp.trim(),
        };
        console.log('Dispatching verifyOtp with:', payload);
        dispatch(verifyOtp(payload))
            .unwrap()
            .then(() => {
                setShowOtpModal(false);
                history.push('/');
            })
            .catch(() => { });
    };

    useEffect(() => {
        if (isAuthenticated && !showOtpModal) {
            const lastVisited = localStorage.getItem('lastVisited') || '/';
            if (lastVisited !== '/register') {
                history.push(lastVisited);
            } else {
                history.push('/');
            }
        }
    }, [isAuthenticated, showOtpModal, history]);

    useEffect(() => {
        if (errors) {
            const timer = setTimeout(() => {
                dispatch(clearError());
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [errors, dispatch]);

    useEffect(() => {
        setErrors({});
        dispatch(clearError());
    }, [location.pathname, dispatch]);

    return (
        <section className="auth-section">
            <div className="container">
                <div className="auth-wrapper">
                    <div className="auth-grid">
                        <div className="auth-visual">
                           
                        </div>

                        <div className="auth-form-container">
                            <div className="form-header">
                                <h1 className="form-title">
                                    {showOtpModal ? 'Verify Your Account' : 'Create Your Account'}
                                </h1>
                                <p className="form-subtitle">
                                    {showOtpModal
                                        ? 'Enter the 6-digit code sent to your mobile'
                                        : 'Fill in your details to get started'
                                    }
                                </p>
                            </div>

                            {error && !showOtpModal && (
                                <div className="error-message">
                                    <svg className="error-icon" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v2h-2v-2zm0-8h2v6h-2V9z" />
                                    </svg>
                                    <span>{error}</span>
                                </div>
                            )}

                            {!showOtpModal ? (
                                <form onSubmit={handleRegister} className="auth-form" autoComplete="off">
                                    <div className="form-field">
                                        <label htmlFor="username" className="field-label">
                                            Username
                                        </label>
                                        <input
                                            id="username"
                                            type="text"
                                            placeholder="Enter your username"
                                            value={username}
                                            onChange={(e) => {
                                                setUsername(e.target.value);
                                                if (errors.username) setErrors({ ...errors, username: '' });
                                            }}
                                            className={`field-input ${errors.username ? 'field-error' : ''}`}
                                            aria-describedby={errors.username ? "username-error" : undefined}
                                        />
                                        {errors.username && (
                                            <div id="username-error" className="field-error-message">
                                                <svg className="error-icon-sm" viewBox="0 0 24 24">
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v2h-2v-2zm0-8h2v6h-2V9z" />
                                                </svg>
                                                {errors.username}
                                            </div>
                                        )}
                                    </div>

                                    <div className="form-field">
                                        <label htmlFor="email" className="field-label">
                                            Email Address
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                if (errors.email) setErrors({ ...errors, email: '' });
                                            }}
                                            className={`field-input ${errors.email ? 'field-error' : ''}`}
                                            aria-describedby={errors.email ? "email-error" : undefined}
                                        />
                                        {errors.email && (
                                            <div id="email-error" className="field-error-message">
                                                <svg className="error-icon-sm" viewBox="0 0 24 24">
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v2h-2v-2zm0-8h2v6h-2V9z" />
                                                </svg>
                                                {errors.email}
                                            </div>
                                        )}
                                    </div>

                                    <div className="form-field">
                                        <label htmlFor="mobile" className="field-label">
                                            Mobile Number
                                        </label>
                                        <input
                                            id="mobile"
                                            type="text"
                                            placeholder="Enter 10-digit mobile number"
                                            value={contactNumber}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '');
                                                setContactNumber(value);
                                                if (errors.contactNumber) setErrors({ ...errors, contactNumber: '' });
                                            }}
                                            maxLength={10}
                                            className={`field-input ${errors.contactNumber ? 'field-error' : ''}`}
                                            aria-describedby={errors.contactNumber ? "mobile-error" : undefined}
                                        />
                                        {errors.contactNumber && (
                                            <div id="mobile-error" className="field-error-message">
                                                <svg className="error-icon-sm" viewBox="0 0 24 24">
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v2h-2v-2zm0-8h2v6h-2V9z" />
                                                </svg>
                                                {errors.contactNumber}
                                            </div>
                                        )}
                                    </div>

                                    <div className="form-field">
                                        <label htmlFor="password" className="field-label">
                                            Password
                                        </label>
                                        <input
                                            id="password"
                                            type="password"
                                            placeholder="Create a strong password"
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                if (errors.password) setErrors({ ...errors, password: '' });
                                            }}
                                            className={`field-input ${errors.password ? 'field-error' : ''}`}
                                            aria-describedby={errors.password ? "password-error" : undefined}
                                        />
                                        {errors.password && (
                                            <div id="password-error" className="field-error-message">
                                                <svg className="error-icon-sm" viewBox="0 0 24 24">
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v2h-2v-2zm0-8h2v6h-2V9z" />
                                                </svg>
                                                {errors.password}
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        className="auth-button primary"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="spinner" viewBox="0 0 24 24">
                                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                                                </svg>
                                                Creating Account...
                                            </>
                                        ) : (
                                            <>
                                                Create Account
                                                <svg className="button-arrow" viewBox="0 0 24 24">
                                                    <path d="M5 12h14m-7-7l7 7-7 7" />
                                                </svg>
                                            </>
                                        )}
                                    </button>

                                    <div className="auth-divider">
                                        <span>or</span>
                                    </div>

                                    <div className="social-auth">
                                        <GoogleLoginButton />
                                    </div>

                                    <div className="auth-redirect">
                                        <span className="redirect-text">Already have an account?</span>
                                        <Link to="/login" className="redirect-link">
                                            Sign In
                                        </Link>
                                    </div>
                                </form>
                            ) : (
                                <form onSubmit={handleVerifyOtp} className="auth-form" autoComplete="off">
                                    <div className="form-field">
                                        <label htmlFor="otp" className="field-label">
                                            Verification Code
                                        </label>
                                        <input
                                            id="otp"
                                            type="text"
                                            placeholder="Enter 6-digit OTP"
                                            value={otp}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '');
                                                setOtp(value);
                                                if (errors.otp) setErrors({ ...errors, otp: '' });
                                            }}
                                            maxLength={6}
                                            className={`field-input ${errors.otp ? 'field-error' : ''}`}
                                            aria-describedby={errors.otp ? "otp-error" : undefined}
                                        />
                                        {errors.otp && (
                                            <div id="otp-error" className="field-error-message">
                                                <svg className="error-icon-sm" viewBox="0 0 24 24">
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v2h-2v-2zm0-8h2v6h-2V9z" />
                                                </svg>
                                                {errors.otp}
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        className="auth-button primary"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="spinner" viewBox="0 0 24 24">
                                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                                                </svg>
                                                Verifying...
                                            </>
                                        ) : (
                                            'Verify OTP'
                                        )}
                                    </button>

                                    <div className="auth-redirect">
                                        <span className="redirect-text">Back to</span>
                                        <button
                                            type="button"
                                            className="redirect-link"
                                            onClick={() => {
                                                setShowOtpModal(false);
                                                dispatch(clearError());
                                            }}
                                        >
                                            Registration
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Content;