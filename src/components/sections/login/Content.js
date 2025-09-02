import React, { useState, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import loginbg from '../../../assets/img/bg/sign.webp';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../../../redux/slices/userSlice';
import './LoginContent.css';

const Content = () => {
    const [contactOrEmailOrUsername, setContactOrEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState(null);

    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();

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
        <section className="login-sec pt-120 pb-120">
            <div className="container">
                <div className="account-wrapper">
                    <div className="row no-gutters">
                        <div className="col-lg-6">
                            <div className="login-content">
                                <div className="description text-center"></div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="login-form">
                                <h4 >Log in</h4>

                                {localError && (
                                    <div className="alert alert-danger">
                                        {localError}
                                    </div>
                                )}

                                <form onSubmit={handleLogin}>
                                    <div className="input-group input-group-two mb-10">
                                        <input
                                            type="text"
                                            placeholder="Mobile Number"
                                            value={contactOrEmailOrUsername}
                                            onChange={(e) => setContactOrEmailOrUsername(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="input-group input-group-two mb-20">
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <Link to="/forgot-password" className='forgot'>Forgot Password?</Link>

                                    <button type="submit" className="main-btn btn-filled  login-btn">
                                        Login
                                    </button>

                                    <p className="register-prompt">
                                        Don't have an Account?
                                        <Link to="/register" className="d-inline-block create-account-link">
                                            Create One
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