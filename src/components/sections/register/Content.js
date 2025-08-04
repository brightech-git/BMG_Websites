import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '../../../redux/slices/userSlice';
import { toast } from 'react-toastify';
import loginbg from '../../../assets/img/bg/sign.webp';

const Content = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    const dispatch = useDispatch();
    const navigate = useHistory();
    const { user, error, loading } = useSelector((state) => state.user);
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

    const validateForm = () => {
        const newErrors = {};

        // Username validation
        if (!username.trim() || username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters long';
        }

        // Email validation
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!email.endsWith('@gmail.com')) {
            newErrors.email = 'Email must be a valid Gmail address (@gmail.com)';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Invalid email format';
        }

        // Contact number validation
        if (!contactNumber) {
            newErrors.contactNumber = 'Mobile number is required';
        } else if (!/^\d{10}$/.test(contactNumber)) {
            newErrors.contactNumber = 'Mobile number must be exactly 10 digits';
        }

        // Password validation
        if (!password || password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = (e) => {
        e.preventDefault();

        if (validateForm()) {
            dispatch(signup({ username, email, contactNumber, password }));
        } else {
            toast.error('Please fix the form errors', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    useEffect(() => {
        if (isAuthenticated && user) {
            toast.success(`Registration successful for ${username}!`, {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: false,
                pauseOnHover: true,
                draggable: true,
            });

            setTimeout(() => {
                navigate.push('/'); // Redirect to home page
            }, 2200);
        }

        if (error) {
            toast.error(error, {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                pauseOnHover: true,
                draggable: true,
            });
        }
    }, [isAuthenticated, error, user, navigate, username]);

    return (
        <section className="login-sec pt-80 pb-80">
            <div className="container">
                <div className="account-wrapper">
                    <div className="row no-gutters">
                        <div className="col-lg-6">
                            <div
                                className="login-content"
                                style={{ backgroundImage: `url(${loginbg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                            />
                        </div>
                        <div className="col-lg-6">
                            <div className="login-form">
                                <h2>Create Account</h2>

                                <form onSubmit={handleRegister}>
                                    <div className="input-group input-group-two mb-20">
                                        <input
                                            type="text"
                                            placeholder="Username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className={errors.username ? 'is-invalid' : ''}
                                        />
                                        {errors.username && (
                                            <div className="invalid-feedback" style={{ fontSize: '12px', color: '#dc3545' }}>
                                                {errors.username}
                                            </div>
                                        )}
                                    </div>

                                    <div className="input-group input-group-two mb-20">
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className={errors.email ? 'is-invalid' : ''}
                                        />
                                        {errors.email && (
                                            <div className="invalid-feedback" style={{ fontSize: '12px', color: '#dc3545' }}>
                                                {errors.email}
                                            </div>
                                        )}
                                    </div>

                                    <div className="input-group input-group-two mb-20">
                                        <input
                                            type="text"
                                            placeholder="Mobile Number"
                                            value={contactNumber}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                                                setContactNumber(value);
                                            }}
                                            maxLength={10}
                                            className={errors.contactNumber ? 'is-invalid' : ''}
                                        />
                                        {errors.contactNumber && (
                                            <div className="invalid-feedback" style={{ fontSize: '12px', color: '#dc3545' }}>
                                                {errors.contactNumber}
                                            </div>
                                        )}
                                    </div>

                                    <div className="input-group input-group-two mb-20">
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className={errors.password ? 'is-invalid' : ''}
                                        />
                                        {errors.password && (
                                            <div className="invalid-feedback" style={{ fontSize: '12px', color: '#dc3545' }}>
                                                {errors.password}
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        className="main-btn btn-filled mt-20 login-btn"
                                        disabled={loading}
                                    >
                                        {loading ? 'Registering...' : 'Register'}
                                    </button>

                                    <p style={{ color: '#404040', fontFamily: 'Montserrat' }}>
                                        Already have an Account?
                                        <Link to="/login" className="d-inline-block" style={{ marginLeft: '10px' }}>
                                            Login
                                        </Link>
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Content;