import React, { useState, useEffect } from 'react';
import { Link, useHistory ,useLocation} from 'react-router-dom';
import loginbg from '../../../assets/img/bg/sign.webp';

import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../../redux/slices/userSlice';

const Content = () => {
    const [contactOrEmailOrUsername, setContactOrEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState(null); // for field errors

    const dispatch = useDispatch();
    const history = useHistory();
    const location=useLocation();

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
                // Clear form and errors
                setContactOrEmailOrUsername('');
                setPassword('');
                setLocalError(null);

                // Redirect
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


    return (
        <section className="login-sec pt-120 pb-120">
            <div className="container">
                <div className="account-wrapper">
                    <div className="row no-gutters">
                        <div className="col-lg-6">
                            <div
                                className="login-content"
                                style={{
                                    backgroundImage: `url(${loginbg})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            >
                                <div className="description text-center"></div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="login-form">
                                <h2>Log in</h2>

                                {localError && (
                                    <div className="alert alert-danger" style={{ fontSize: '14px' }}>
                                        {localError}
                                    </div>
                                )}

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

                                    <Link to="/forgot-password">Forgot Password?</Link>

                                    <button type="submit" className="main-btn btn-filled mt-20 login-btn">
                                        Login
                                    </button>

                                    <p style={{ color: '#404040', fontFamily: 'Montserrat' }}>
                                        Don't have an Account?
                                        <Link to="/register" className="d-inline-block" style={{ marginLeft: '10px' }}>
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
