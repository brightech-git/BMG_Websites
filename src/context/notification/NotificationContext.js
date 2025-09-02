// src/context/NotificationContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import NotificationModal from "../../components/pages/notificationModal/NotificationModal";
import { useNotification as useRegisterNotification } from "../../hook/notification/useNotificationQuery";
import { requestForToken, onMessageListener } from "../../notification/firebase";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    // separate states
    const [showPermissionModal, setShowPermissionModal] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
   const user = useSelector((state) => state.user.user) || {};
    console.log(user.id,'userprofile');
    const [notifData, setNotifData] = useState({ title: "", message: "", image: "" });
    const { mutate: registerDevice } = useRegisterNotification();

    // ---- Ask permission (only called manually) ----
    const askNotification = (title, message) => {
        if (Notification.permission === "default") {
            setNotifData({ title, message });
            setShowPermissionModal(true);
        }
    };

    const handleEnable = async () => {
        const fcmToken = await requestForToken();
        if (fcmToken) {
            registerDevice({
                userId: user?.id || 10001, // pass logged-in userId here
                deviceId: uuidv4(),
                deviceType: "WEB",
                fcmToken,
            });
        }

        setShowPermissionModal(false);
    };

    // ---- Foreground messages ----
    useEffect(() => {
        const unsubscribe = onMessageListener()
            .then(payload => {
                const { title, body, image } = payload.notification;
                setNotifData({ title, message: body, image });
                setShowMessageModal(true);
            })
            .catch(err => console.log("FCM foreground error: ", err));

        return () => unsubscribe;
    }, []);

    return (
        <NotificationContext.Provider value={{ askNotification }}>
            {children}

            {/* Permission modal */}
            <NotificationModal
                show={showPermissionModal}
                title={notifData.title}
                message={notifData.message}
                image={notifData.image}
                type="permission"
                onClose={() => setShowPermissionModal(false)}
                onAllow={handleEnable}
            />

            {/* Foreground message modal */}
            <NotificationModal
                show={showMessageModal}
                title={notifData.title}
                message={notifData.message}
                image={notifData.image}
                type="message"
                onClose={() => setShowMessageModal(false)}
            />
        </NotificationContext.Provider>
    );
};
