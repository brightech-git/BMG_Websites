import React, { useState, useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError } from "../../../redux/slices/userSlice";
import GoogleLoginButton from "../register/GoogleLoginButton";
import "./LoginContent.css";

const LoginContent = () => {
    const [contactOrEmailOrUsername, setContact] = useState("");
    const [password, setPassword] = useState("");
    const [localError, setLocalError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);


    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();

    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!contactOrEmailOrUsername || !password) {
            setLocalError("Please fill in all fields");
            return;
        }

        try {
            const result = await dispatch(
                login({
                    contactOrEmailOrUsername,
                    password,
                })
            ).unwrap();

            if (result?.token) {
                setContact("");
                setPassword("");
                setLocalError(null);

                const lastVisited = JSON.parse(localStorage.getItem("lastVisited") || "{}");
                const redirectTo = lastVisited?.from || location.state?.from || "/";

                history.push(redirectTo);
            }
        } catch (err) {
            setLocalError(err || "Login failed");
        }
    };

    useEffect(() => {
        if (localError) {
            const timer = setTimeout(() => setLocalError(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [localError]);

    useEffect(() => {
        dispatch(clearError());
    }, [location.pathname, dispatch]);

    useEffect(() => {
        if (isAuthenticated) {
            const lastVisited = localStorage.getItem("lastVisited") || "/";
            history.push(lastVisited !== "/login" ? lastVisited : "/");
        }
    }, [isAuthenticated, history]);

    return (
        <div className="container-login">
        <section className="auth-login-section animate-fade-in">
            <div className="auth-login-box animate-fade-in-up">

                {localError && (
                    <div className="auth-login-error animate-shake">
                        <svg className="auth-login-error-icon" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 
                                    10-4.48 10-10S17.52 2 12 2zm-1 15h2v2h-2v-2zm0-8h2v6h-2V9z" />
                        </svg>
                        <span>{localError}</span>
                    </div>
                )}

                <form onSubmit={handleLogin} className="auth-login-form animate-fade-in-up">

                    <div className="auth-login-title-wrapper animate-fade-in-down">
                        <h1 className="auth-login-title">Sign in to Your Account</h1>
                    </div>

                    <div className="auth-login-field animate-fade-in-up">
                        <label className="auth-login-label">Mobile Number</label>
                        <input
                            type="text"
                            placeholder="Enter your mobile number"
                            value={contactOrEmailOrUsername}
                            onChange={(e) => setContact(e.target.value)}
                            required
                            className="auth-login-input"
                        />
                    </div>

                        <div className="auth-login-field animate-fade-in-up">
                            <label className="auth-login-label">Password</label>

                            {/* Password wrapper fixed */}
                            <div className="auth-password-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="auth-login-input"
                                />

                                <span
                                    className="auth-password-icon"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <svg viewBox="0 0 24 24">
                                            <path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12a5 5 0 110-10 5 5 0 010 10zm0-8a3 3 0 100 6 3 3 0 000-6z" />
                                        </svg>
                                    ) : (
                                        <svg viewBox="0 0 24 24">
                                            <path d="M12 5c-7 0-10 7-10 7s3 7 10 7c2.3 0 4.2-.7 5.8-1.7l1.4 1.4 1.4-1.4L4.3 4.3 2.9 5.7 6 8.8C4.3 10.1 3 12 3 12s3 7 10 7c1.6 0 3-.3 4.3-.8l2.6 2.6 1.4-1.4L4.3 4.3 2.9 5.7 6 8.8M12 7a5 5 0 015 5c0 .6-.1 1.1-.3 1.6l-1.5-1.5A3 3 0 0012 9c-.4 0-.8.1-1.1.2L9.4 7.7A5 5 0 0112 7z" />
                                        </svg>
                                    )}
                                </span>
                            </div>
                        </div>


                    <div className="auth-login-options animate-fade-in-up">
                        <Link to="/forgot-password" className="auth-forgot-link">
                            Forgot Password?
                        </Link>
                    </div>

                    <button type="submit" className="auth-login-btn animate-bounce-in">
                        <span>Sign In</span>
                        <svg className="auth-login-btn-icon" viewBox="0 0 24 24">
                            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                        </svg>
                    </button>

                    <div className="auth-google-wrapper animate-fade-in-up">
                        <GoogleLoginButton />
                    </div>

                    <div className="auth-login-register animate-fade-in-up">
                        <span>Don't have an account?</span>
                        <Link to="/register" className="auth-register-link">Create Account</Link>
                    </div>

                </form>
            </div>
        </section>
        </div>
    );
};

export default LoginContent;
