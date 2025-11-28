// src/components/pages/notificationModal/NotificationModal.js
import React from "react";
import "./NotificationModal.css"; // external CSS

const NotificationModal = ({ show, onClose, onAllow, title, message, image, type }) => {
    if (!show) return null;

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains("notif-overlay")) {
            onClose();
        }
    };

    return (
        <div className="notif-overlay" onClick={handleOverlayClick}>
            <div className="notif-modal" onClick={(e) => e.stopPropagation()}>
                {image && <img src={image} alt="notification" className="notif-image" />}
                <h2 className="notif-title">{title || "Notification"}</h2>
                <p className="notif-message">
                    {message || "Stay updated with important updates."}
                </p>

                {type === "permission" && (
                    <div className="notif-actions">
                        <button className="notif-btn notif-allow" onClick={onAllow}>
                            Allow Notifications
                        </button>
                        <button className="notif-btn notif-cancel" onClick={onClose}>
                            Not Now
                        </button>
                    </div>
                )}
               
            </div>
        </div>
    );
};

export default NotificationModal;
