import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../../../context/authContext/UserAuthContext';
import loginbg from '../../../assets/img/bg/sign.webp';

const Content = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { signup } = useAuth();
    const history = useHistory();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);

        const userData = {
            username,
            email,
            contactNumber,
            password
        };

        try {
            const response = await signup(userData);

            // If response is truthy and has an `id`, assume success
            if (response?.id) {
                // Save to localStorage if needed
                localStorage.setItem("user", JSON.stringify(response));
                
                // Redirect to homepage
                history.push('/');
            } else {
                setError("Signup failed. Please try again.");
            }
        } catch (err) {
            setError(err.message || "Something went wrong during registration");
        }
    };


    return (
        <section className="login-sec pt-80 pb-80">
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
                                <h2>Create Account</h2>

                                {error && (
                                    <div className="alert alert-danger" style={{ fontSize: '14px' }}>
                                        {typeof error === 'string' ? error : error.message || "An unknown error occurred"}
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

                                   

                                    <button type="submit" className="main-btn btn-filled mt-20 login-btn">
                                        Register
                                    </button>

                                    <p style={{ color: '#404040', fontFamily: 'Montserrat' }}>
                                        Already have an Account?
                                        <Link
                                            to="/login"
                                            className="d-inline-block"
                                            style={{ marginLeft: '10px' }}
                                        >
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
