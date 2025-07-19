import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../../../context/authContext/UserAuthContext';
import loginbg from '../../../assets/img/bg/sign.webp';

const Content = () => {

    const [contactOrEmailOrUsername, setContactOrEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login } = useAuth();
    const history = useHistory();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await login({ contactOrEmailOrUsername, password });
            console.log(response);

            if (response?.token) {
                history.push('/'); // redirect to home
            } else {
                console.log(response);
                setError('Invalid credentials');
            }
        } catch (err) {
            
            setError(err.message || 'Login failed');
        }
    };

    return (
        <section className="login-sec pt-120 pb-120">
            <div className="container">
                <div className="account-wrapper">
                    <div className="row no-gutters">
                        <div className="col-lg-6">
                            <div
                                className="login-content"
                                style={{ backgroundImage: `url(${loginbg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                            >
                                <div className="description text-center"></div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="login-form">
                                <h2>Log in</h2>

                                {error && (
                                    <div className="alert alert-danger" style={{ fontSize: '14px' }}>
                                        {error}
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
                                        <Link
                                            to="/register"
                                            className="d-inline-block"
                                            style={{ marginLeft: '10px' }}
                                        >
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
