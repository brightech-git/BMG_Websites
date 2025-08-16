import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import { forgotPassword, resetPassword } from '../../../../redux/slices/userSlice';
import { toast } from 'react-toastify';
import loginbg from '../../../../assets/img/bg/sign.webp';
import './ForgotPassword.css';

const ForgotPassword = () => {
    const [contactNumber, setContactNumber] = useState('');
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const dispatch = useDispatch();
    const history = useHistory();
    const { loading, error } = useSelector((state) => state.user);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!contactNumber) {
           
            return;
        }

        try {
            await dispatch(forgotPassword(contactNumber)).unwrap();
            setStep(2);
            
        } catch (err) {
            
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
          
            return;
        }
        if (newPassword.length < 6) {
           
            return;
        }

        try {
            await dispatch(resetPassword({ contactNumber, otp, newPassword })).unwrap();
           
            history.push('/login');
        } catch (err) {
           
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
                                <h2>{step === 1 ? 'Forgot Password' : 'Reset Password'}</h2>

                                {error && (
                                    <div className="alert alert-danger" style={{ fontSize: '14px' }}>
                                        {error}
                                    </div>
                                )}

                                {step === 1 ? (
                                    <form onSubmit={handleSendOtp}>
                                        <div className="input-group input-group-two mb-20">
                                            <input
                                                type="text"
                                                placeholder="Mobile Number"
                                                value={contactNumber}
                                                onChange={(e) => setContactNumber(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className='login-container'>
                                            <Link to="/login" className="forgot-password-link">
                                                Remember your password? <span className='forgot-password-link-login'>Login</span>
                                            </Link>
                                        </div>
                                        <button
                                            type="submit"
                                            className="main-btn btn-filled mt-20 login-btn"
                                            disabled={loading}
                                        >
                                            {loading ? 'Sending OTP...' : 'Send OTP'}
                                        </button>
                                    </form>
                                ) : (
                                    <form onSubmit={handleResetPassword}>
                                        <div className="input-group input-group-two mb-20">
                                            <input
                                                type="text"
                                                placeholder="OTP"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="input-group input-group-two mb-20">
                                            <input
                                                type="password"
                                                placeholder="New Password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="input-group input-group-two mb-30">
                                            <input
                                                type="password"
                                                placeholder="Confirm Password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="main-btn btn-filled mt-20 login-btn"
                                            disabled={loading}
                                        >
                                            {loading ? 'Resetting...' : 'Reset Password'}
                                        </button>

                                        <p className="mt-3" style={{ color: '#404040', fontFamily: 'Montserrat' }}>
                                            Didn't receive OTP?{' '}
                                            <button
                                                type="button"
                                                className="forgot-password-resend"
                                                onClick={handleSendOtp}
                                                style={{ background: 'none', border: 'none', padding: 0 }}
                                            >
                                                Resend OTP
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

export default ForgotPassword;