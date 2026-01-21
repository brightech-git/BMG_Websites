// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
// Replace 10.13.2 with latest version of the Firebase JS SDK.
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyD9Vdc-aM_Efiftxq9XqBgSVki2i2j-ofw",
    authDomain: "pushnotification-f01ab.firebaseapp.com",
    projectId: "pushnotification-f01ab",
    storageBucket: "pushnotification-f01ab.firebasestorage.app",
    messagingSenderId: "403694228532",
    appId: "1:403694228532:web:4f48a0950bb66b77e26661",
    measurementId: "G-7V3CXQZ422"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
// const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//     console.log(
//         '[firebase-messaging-sw.js] Received background message ',
//         payload
//     );
//     // Customize notification here
//     const notificationTitle = payload.notification.title;
//     const notificationOptions = {
//         body: payload.notification.body,
//         icon: payload.notification.image
//     };

//     self.registration.showNotification(notificationTitle, notificationOptions);
// });

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log("[SW] Background message received:", payload);

    const data = payload.data || {};
    const notificationTitle = data.title || "New Notification";
    const notificationOptions = {
        body: data.body || data.message || "",
        icon: data.imageUrl || "/default-icon.png",
        image: data.imageUrl,
        tag: data.notificationId || Date.now().toString(),
        renotify: true,
        data: {
            url: data.url || "https://app.bmgjewellers.com"
        }
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});


self.addEventListener("notificationclick", function (event) {
    event.notification.close();

    // Log the data to check what is received
    console.log("[SW] Notification clicked, data:", event.notification.data);

    const targetUrl = event.notification.data?.url || "/";
    console.log("[SW] Target URL:", targetUrl);

    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true })
            .then(windowClients => {
                for (let client of windowClients) {
                    if (client.url === targetUrl && "focus" in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow(targetUrl);
                }
            })
    );
});

