<<<<<<< Updated upstream
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import loginbg from '../../../assets/img/bg/sign.webp';

import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../../redux/slices/userSlice';

const Content = () => {
    const [contactOrEmailOrUsername, setContactOrEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState(null); // for field errors

    const dispatch = useDispatch();
    const history = useHistory();

    // Redux state
    const user = useSelector((state) => state.user.user);
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const error = useSelector((state) => state.user.error);


    // Handle login submit
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
                    password: password, // adjust field name based on your AuthService
                })
            ).unwrap();

            if (resultAction?.token) {
                const lastVisited = localStorage.getItem('lastVisited');
                history.push(lastVisited || '/');
            }
            if (resultAction?.token) {
                // Clear form and errors
                setContactOrEmailOrUsername('');
                setPassword('');
                setLocalError(null);

                // Redirect
                const lastVisited = localStorage.getItem('lastVisited');
                history.push(lastVisited || '/');
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
            setLocalError(null); // reset error when user types again
        }
    }, [contactOrEmailOrUsername, password]);

    // Clear local error if Redux error appears
    useEffect(() => {
        if (error) setLocalError(error);
    }, [error]);
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

=======
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/authContext/UserAuthContext';
import loginbg from '../../../assets/img/bg/sign.webp';

const Content = () => {
    const [contactOrEmailOrUsername, setContactOrEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate(); 

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await login({
                contactOrEmailOrUsername,
                password,
            });

            if (response?.token) {
                navigate('/'); // changed from history.push
            } else {
                setError('Invalid credentials');
            }
        } catch (err) {
            setError(err.message || 'Login failed');
        }
    };
>>>>>>> Stashed changes

    return (
        <section className="login-sec pt-120 pb-120">
            <div className="container">
                <div className="account-wrapper">
                    <div className="row no-gutters">
                        <div className="col-lg-6">
                            <div
                                className="login-content"
<<<<<<< Updated upstream
                                style={{
                                    backgroundImage: `url(${loginbg})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
=======
                                style={{ backgroundImage: `url(${loginbg})` }}
>>>>>>> Stashed changes
                            >
                                <div className="description text-center"></div>
                            </div>
                        </div>
<<<<<<< Updated upstream

                        <div className="col-lg-6">
                            <div className="login-form">
                                <h2>Log in</h2>

                                {localError && (
                                    <div className="alert alert-danger" style={{ fontSize: '14px' }}>
                                        {localError}
                                    </div>
                                )}

=======
                        <div className="col-lg-6">
                            <div className="login-form">
                                <h2>Log in</h2>
                                {error && (
                                    <div className="alert alert-danger" style={{ fontSize: '14px' }}>
                                        {error}
                                    </div>
                                )}
>>>>>>> Stashed changes
                                <form onSubmit={handleLogin}>
                                    <div className="input-group input-group-two mb-20">
                                        <input
                                            type="text"
                                            placeholder="Mobile Number"
                                            value={contactOrEmailOrUsername}
                                            onChange={(e) => setContactOrEmailOrUsername(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="input-group input-group-two mb-30">
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
<<<<<<< Updated upstream

                                    <Link to="/forgot-password">Forgot Password?</Link>

                                    <button type="submit" className="main-btn btn-filled mt-20 login-btn">
                                        Login
                                    </button>

                                    <p style={{ color: '#404040', fontFamily: 'Montserrat' }}>
                                        Don't have an Account?
                                        <Link to="/register" className="d-inline-block" style={{ marginLeft: '10px' }}>
=======
                                    <Link to="/forgot-password">Forgot Password?</Link>
                                    <button type="submit" className="main-btn btn-filled mt-20 login-btn">
                                        Login
                                    </button>
                                    <p style={{ color: '#404040', fontFamily: 'Montserrat' }}>
                                        Don't have an Account?
                                        <Link
                                            to="/register"
                                            className="d-inline-block"
                                            style={{ marginLeft: '10px' }}
                                        >
>>>>>>> Stashed changes
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
