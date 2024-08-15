// // public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

// import { initializeApp } from "../firebase/app";
// import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
apikey: String(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
authDomain: String(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
projectId: String(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
storageBucket: String(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
messagingSenderId: String(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
appId: String(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
measurementId: String(process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID)
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});