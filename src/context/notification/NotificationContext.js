// src/context/NotificationContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import NotificationModal from "../../components/pages/notificationModal/NotificationModal";
import { useNotification as useRegisterNotification } from "../../hook/notification/useNotificationQuery";
import { requestForToken, onMessageListener } from "../../notification/firebase";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import { toast } from "react-toastify"; // ✅ use toast for foreground messages

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [showPermissionModal, setShowPermissionModal] = useState(false);
    const user = useSelector((state) => state.user.user) || {};
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
                userId: user?.id || 10001,
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
            .then((payload) => {
                //console.log("FCM foreground payload: ", payload);
                const { title, body, image } = payload.notification;

                toast.info(
                    <div style={{ display: "flex", alignItems: "center" }}>
                        {image && (
                            <img
                                src={image}
                                alt="notification"
                                style={{
                                    width: 40,
                                    height: 40,
                                    objectFit: "cover",
                                    borderRadius: 6,
                                    marginRight: 10,
                                }}
                            />
                        )}
                        <div>
                            <strong>{title}</strong>
                            <div>{body}</div>
                        </div>
                    </div>,
                    {
                        position: "top-right",
                        autoClose: 4000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    }
                );
            })
            .catch((err) => console.log("FCM foreground error: ", err));

        return () => unsubscribe;
            }, []);


        return (
            <NotificationContext.Provider value={{ askNotification }}>
                {children}

                {/* Permission modal (only for asking notification permission) */}
                <NotificationModal
                    show={showPermissionModal}
                    title={notifData.title}
                    message={notifData.message}
                    image={notifData.image}
                    type="permission"
                    onClose={() => setShowPermissionModal(false)}
                    onAllow={handleEnable}
                />
            </NotificationContext.Provider>
        );
    };
