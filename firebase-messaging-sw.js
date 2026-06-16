importScripts(
    "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);

importScripts(
    "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

firebase.initializeApp({
    apiKey: "AIzaSyD9Vdc-aM_Efiftxq9XqBgSVki2i2j-ofw",
    authDomain: "pushnotification-f01ab.firebaseapp.com",
    projectId: "pushnotification-f01ab",
    storageBucket: "pushnotification-f01ab.firebasestorage.app",
    messagingSenderId: "403694228532",
    appId: "1:403694228532:web:4f48a0950bb66b77e26661"
});

const messaging = firebase.messaging();