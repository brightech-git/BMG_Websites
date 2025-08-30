// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

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
const messaging = getMessaging(app);

export const requestForToken = async() => {
  const permission = await Notification.requestPermission();
    console.log(permission);
}