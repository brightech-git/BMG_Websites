import React, { useState, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../../../redux/slices/userSlice';
import './LoginContent.css';
import GoogleLoginButton from '../register/GoogleLoginButton';
import { usePostNotification } from '../../../hook/notification/useNotificationQuery';

const Content = () => {
    const [contactOrEmailOrUsername, setContactOrEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState(null);

    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();

    const { mutate } = usePostNotification(); 

    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const error = useSelector((state) => state.user.error);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!contactOrEmailOrUsername || !password) {
            setLocalError('Please fill in all fields');
            return;
        }

        try {
            const resultAction = await dispatch(
                login({
                    contactOrEmailOrUsername: contactOrEmailOrUsername,
                    password: password,
                })
            ).unwrap();
            console.log(resultAction ,'resultActions')
            if (resultAction?.token) {
                setContactOrEmailOrUsername('');
                setPassword('');
                setLocalError(null);

                

                const lastVisited = localStorage.getItem("lastVisited");
                
                
                let parsedLastVisited = null;

                try {
                    parsedLastVisited = lastVisited ? JSON.parse(lastVisited) : null;
                } catch (e) {
                    console.error("Error parsing lastVisited from localStorage", e);
                }

                const redirectTo =
                    parsedLastVisited?.from ||
                    location.state?.from ||
                    "/";

                console.log("Final redirect target:", redirectTo);

                history.push(redirectTo);
            }
        } catch (err) {
            setLocalError(err || 'Login failed');
        }
    };

    useEffect(() => {
        if (localError) {
            const timer = setTimeout(() => setLocalError(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [localError]);

    useEffect(() => {
        if (contactOrEmailOrUsername || password) {
            setLocalError(null);
        }
    }, [contactOrEmailOrUsername, password]);

    useEffect(() => {
        setLocalError(null);
        dispatch(clearError());
    }, [location.pathname, dispatch]);

    useEffect(() => {
        if (isAuthenticated) {
            const lastVisited = localStorage.getItem("lastVisited");
            if (lastVisited && lastVisited !== '/login') {
                history.push(lastVisited);
            } else {
                history.push('/');
            }
        }
    }, [isAuthenticated, history]);

    return (
        <section className="login-auth-section">
            <div className="container">
                <div className="login-wrapper">
                    <div className="login-grid">
                        <div className="login-visual">  
                        </div>

                        <div className="signin-form-container">
                           

                            {localError && (
                                <div className="error-alert">
                                    <svg className="error-icon" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v2h-2v-2zm0-8h2v6h-2V9z" />
                                    </svg>
                                    <span>{localError}</span>
                                </div>
                            )}

                            <form onSubmit={handleLogin} className="signin-form">
                                <div className="signin-form-header">
                                    <h1 className="signin-form-title">
                                        Signin to Your Account
                                    </h1>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="mobile" className="form-label">
                                        Mobile Number
                                    </label>
                                    <input
                                        id="mobile"
                                        type="text"
                                        placeholder="Enter your mobile number"
                                        value={contactOrEmailOrUsername}
                                        onChange={(e) => setContactOrEmailOrUsername(e.target.value)}
                                        required
                                        className="signin-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="password" className="form-label">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="signin-input"
                                    />
                                </div>

                                <div className="form-options">
                                    <Link to="/forgot-password" className="forgot-link">
                                        Forgot Password?
                                    </Link>
                                </div>

                                <button type="submit" className="login-button">
                                    <span className="button-text">Sign In</span>
                                    <svg className="button-icon" viewBox="0 0 24 24">
                                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                                    </svg>
                                </button>
                                <div style={{marginBottom:'5px'}}>
                                    <GoogleLoginButton />
                                </div>
                                

                                <div className="register-section">
                                    <span className="register-text">Don't have an account?</span>
                                    <Link to="/register" className="register-link">
                                        Create Account
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Content;