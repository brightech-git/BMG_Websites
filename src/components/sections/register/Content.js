import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '../../../redux/slices/userSlice';
import loginbg from '../../../assets/img/bg/sign.webp';

const Content = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const history = useHistory();

    const { user, error, loading } = useSelector((state) => state.user);
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

    const handleRegister = (e) => {
        e.preventDefault();
        dispatch(signup({ username, email, contactNumber, password }));
    };

    // Redirect after successful signup
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

                                {error && (
                                    <div className="alert alert-danger" style={{ fontSize: '14px' }}>
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleRegister}>
                                    <div className="input-group input-group-two mb-20">
                                        <input
                                            type="text"
                                            placeholder="Username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="input-group input-group-two mb-20">
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="input-group input-group-two mb-20">
                                        <input
                                            type="text"
                                            placeholder="Mobile Number"
                                            value={contactNumber}
                                            onChange={(e) => setContactNumber(e.target.value)}
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

                                    <button type="submit" className="main-btn btn-filled mt-20 login-btn" disabled={loading}>
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
