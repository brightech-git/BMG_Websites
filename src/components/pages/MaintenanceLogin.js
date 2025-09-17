import React, { useState, useEffect } from "react";
import "./MaintenanceLogin.css";
import loginimage from "../../assets/img/bg/login-bg.png";

const MaintenanceLogin = ({ onAccess }) => {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const HARD_CODED_PASSWORD = "Bmg@123";
    const EXPIRY_DURATION = 1000 * 60 * 30; 

    useEffect(() => {
        const storedAccess = localStorage.getItem("admin_access");
        const storedTime = localStorage.getItem("admin_access_time");

        if (storedAccess === "true" && storedTime) {
            const isExpired = Date.now() - parseInt(storedTime, 10) > EXPIRY_DURATION;
            if (isExpired) {
                localStorage.removeItem("admin_access");
                localStorage.removeItem("admin_access_time");
                setError("⏳ Access expired. Please login again.");
            } else {
                onAccess(); // ✅ still valid
            }
        }
    }, [onAccess]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === HARD_CODED_PASSWORD) {
            localStorage.setItem("admin_access", "true");
            localStorage.setItem("admin_access_time", Date.now().toString());
            onAccess();
        } else {
            setError("Invalid password. Try again.");
        }
    };

    return (
        <div className="maintenance-container">
            <div className="maintenance-content">
                <div className="image-section">
                    <img src={loginimage} alt="Showroom Preview" className="showroom-image" />
                </div>

                <div className="form-section">
                    <div className="maintenance-card">
                        <h1>🚧 Under Maintenance</h1>
                        <p>Our shop is currently undergoing updates. Please check back later.</p>

                        <form onSubmit={handleLogin}>
                            <input
                                type="password"
                                placeholder="Enter admin password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {error && <p className="maintenance-error">{error}</p>}
                            <button type="submit">Access Website</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaintenanceLogin;
