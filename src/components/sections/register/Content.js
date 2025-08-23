import React, { useState, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signup, verifyOtp } from '../../../redux/slices/userSlice';
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
        if (loading) return; // Prevent multiple submissions
        if (validateForm()) {
            console.log('Dispatching signup with:', { username, email, contactNumber, password, roles });
            dispatch(signup({ username, email, contactNumber, password, roles }))
                .unwrap()
                .then(() => {
                    setShowOtpModal(true);
                    setTempContactNumber(contactNumber);
                })
                .catch(() => {
                    // Error toast handled by userSlice.js
                });
        }
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        if (loading) return; // Prevent multiple submissions
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
            .catch(() => {
                // Error toast handled by userSlice.js
            });
    };

    // Redirect if authenticated and OTP modal is not shown
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

    // Clear errors on page navigation
    useEffect(() => {
        setErrors({});
    }, [location]);

    return (
        <section className="register-section pt-120 pb-120">
            <div className="container">
                <div className="account-wrapper">
                    <div className="row no-gutters">
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <div
                                className="login-content"
                                style={{
                                    backgroundImage: `url(${loginbg})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    height: '100%',
                                    borderRadius: '10px 0 0 10px',
                                    backgroundColor: '#f0f0f0', // Fallback color
                                }}
                            />
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <div
                                className="register-form"
                                style={{
                                    borderRadius: '0 10px 10px 0',
                                    padding: '40px',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    backgroundColor: '#fff',
                                }}
                            >
                                <h2>{showOtpModal ? 'Verify OTP' : 'Create Account'}</h2>

                                {error && !showOtpModal && (
                                    <div className="alert alert-danger" style={{ fontSize: '14px' }}>
                                        {error}
                                    </div>
                                )}

                                {!showOtpModal ? (
                                    <form onSubmit={handleRegister} autoComplete="off">
                                        <div className="input-group input-group-two mb-20">
                                            <input
                                                type="text"
                                                placeholder="Username"
                                                value={username}
                                                onChange={(e) => {
                                                    setUsername(e.target.value);
                                                    if (errors.username) setErrors({ ...errors, username: '' });
                                                }}
                                                className={errors.username ? 'is-invalid' : ''}
                                                aria-label="Username"
                                            />
                                            {errors.username && (
                                                <div className="invalid-feedback">{errors.username}</div>
                                            )}
                                        </div>

                                        <div className="input-group input-group-two mb-20">
                                            <input
                                                type="email"
                                                placeholder="Email"
                                                value={email}
                                                onChange={(e) => {
                                                    setEmail(e.target.value);
                                                    if (errors.email) setErrors({ ...errors, email: '' });
                                                }}
                                                className={errors.email ? 'is-invalid' : ''}
                                                aria-label="Email"
                                            />
                                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                        </div>

                                        <div className="input-group input-group-two mb-20">
                                            <input
                                                type="text"
                                                placeholder="Mobile Number"
                                                value={contactNumber}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/\D/g, '');
                                                    setContactNumber(value);
                                                    if (errors.contactNumber) setErrors({ ...errors, contactNumber: '' });
                                                }}
                                                maxLength={10}
                                                className={errors.contactNumber ? 'is-invalid' : ''}
                                                aria-label="Mobile Number"
                                            />
                                            {errors.contactNumber && (
                                                <div className="invalid-feedback">{errors.contactNumber}</div>
                                            )}
                                        </div>

                                        <div className="input-group input-group-two mb-20">
                                            <input
                                                type="password"
                                                placeholder="Password"
                                                value={password}
                                                onChange={(e) => {
                                                    setPassword(e.target.value);
                                                    if (errors.password) setErrors({ ...errors, password: '' });
                                                }}
                                                className={errors.password ? 'is-invalid' : ''}
                                                aria-label="Password"
                                            />
                                            {errors.password && (
                                                <div className="invalid-feedback">{errors.password}</div>
                                            )}
                                        </div>
                                        <div className='button'>
                                        <button
                                            type="submit"
                                            className="btn-main main-filled mt-20 login-btn"
                                            style={{ width: '150px' }}
                                            disabled={loading}
                                            aria-label="Register new account"
                                        >
                                            {loading ? 'Registering...' : 'Register'}
                                        </button>
                                        </div>
                                        <p className="register-link" style={{ color: '#404040', fontFamily: 'Montserrat', marginTop: '20px' }}>
                                            Already have an Account?
                                            <Link to="/login" className="login-redirect" style={{ marginLeft: '10px' }}>
                                                Login
                                            </Link>
                                        </p>
                                        {/* <GoogleLoginButton /> */}
                                    </form>
                                ) : (
                                    <form onSubmit={handleVerifyOtp} autoComplete="off">
                                        <div className="input-group input-group-two mb-20">
                                            <input
                                                type="text"
                                                placeholder="Enter 6-digit OTP"
                                                value={otp}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/\D/g, '');
                                                    setOtp(value);
                                                    if (errors.otp) setErrors({ ...errors, otp: '' });
                                                }}
                                                maxLength={6}
                                                className={errors.otp ? 'is-invalid' : ''}
                                                aria-label="OTP"
                                            />
                                            {errors.otp && <div className="invalid-feedback">{errors.otp}</div>}
                                        </div>
                                                <div className='button'>
                                        <button
                                            type="submit"
                                            className="btn-main main-filled mt-20 login-btn"
                                            style={{ width: '150px' }}
                                            disabled={loading}
                                            aria-label="Verify OTP"
                                        >
                                            {loading ? 'Verifying...' : 'Verify OTP'}
                                        </button>
                                            </div>
                                        <p className="register-link" style={{ color: '#404040', fontFamily: 'Montserrat', marginTop: '20px' }}>
                                            Back to
                                            <button
                                                type="button"
                                                className="back-to-register"
                                                onClick={() => setShowOtpModal(false)}
                                                style={{ marginLeft: '10px', background: 'none', border: 'none', color: '#007bff', cursor: 'pointer' }}
                                            >
                                                Register
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

export default Content;