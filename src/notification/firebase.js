import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyD9Vdc-aM_Efiftxq9XqBgSVki2i2j-ofw",
    authDomain: "pushnotification-f01ab.firebaseapp.com",
    projectId: "pushnotification-f01ab",
    storageBucket: "pushnotification-f01ab.firebasestorage.app",
    messagingSenderId: "403694228532",
    appId: "1:403694228532:web:4f48a0950bb66b77e26661",
    measurementId: "G-7V3CXQZ422"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);

export const requestForToken = async () => {
    try {
        const permission = Notification.permission;
        //console.log("Current Notification Permission:", permission);

        if (permission === "granted") {
            return await getToken(messaging, {
                vapidKey: "BOxFjBExCqS7C90dhsvp0qFhAVSpDJFjG4PN8yRhGzfDpwdv-9_saKdBJe6Hhc0L9bqRUz9RD4tbbJOBsmPEbDs",
            });

        } else if (permission === "default") {
            const newPermission = await Notification.requestPermission();
            if (newPermission === "granted") {
                return await getToken(messaging, {
                    vapidKey: "BOxFjBExCqS7C90dhsvp0qFhAVSpDJFjG4PN8yRhGzfDpwdv-9_saKdBJe6Hhc0L9bqRUz9RD4tbbJOBsmPEbDs",
                });
            }
        }
    } catch (err) {
        console.error("An error occurred while retrieving token: ", err);
    }
};

// 👇 Add this helper so you can import in your context
export const onMessageListener = () =>
    new Promise((resolve, reject) => {
        try {
            onMessage(messaging, (payload) => {
                resolve(payload);
            });
        } catch (err) {
            reject(err);
        }
    });
