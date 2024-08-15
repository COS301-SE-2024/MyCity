// // public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

// import { initializeApp } from "../firebase/app";
// import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
apikey: 'AIzaSyB1BJuObiD_QbZpWaAdsPL7DDOselHVrSE',
authDomain: 'mycity-ffe84.firebaseapp.com',
projectId: 'mycity-ffe84',
storageBucket: 'mycity-ffe84.appspot.com' ,
messagingSenderId: '135040867606',
appId: '1:135040867606:web:d2943820994c8c9e37c437',
measurementId: 'G-W2SVBQX1EY'
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