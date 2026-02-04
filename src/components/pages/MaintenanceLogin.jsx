import React, { useState, useEffect } from "react";
import "./MaintenanceLogin.css";
import { Cog } from "lucide-react"; // for the gear animation (Lucide icons)

const MaintenanceLogin = ({ onAccess }) => {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const HARD_CODED_PASSWORD = "bmg@123";
    const EXPIRY_DURATION = 1000 * 60 * 30; // 30 mins

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
                onAccess();
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
        <div className="maintenance-page">
            <div className="gear-wrapper">
                <Cog className="gear big" />
                <Cog className="gear medium" />
                <Cog className="gear small" />
            </div>

            <div className="text-section">
                <h1>Our Website is Under Maintenance</h1>
                <p>
                    We’re currently upgrading our servers. <br />
                    Please check back soon. Thank you for your patience.
                </p>

                <form onSubmit={handleLogin} className="access-form">
                    <input
                        type="password"
                        placeholder="Enter admin password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <p className="error-text">{error}</p>}
                    <button type="submit">Access Website</button>
                </form>
            </div>
        </div>
    );
};

export default MaintenanceLogin;
