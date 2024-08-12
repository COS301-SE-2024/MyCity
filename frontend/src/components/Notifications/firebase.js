// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging"; // Import the necessary Firebase Cloud Messaging functions
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
//config
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Cloud Messaging
const messaging = getMessaging(app);

export const requestForToken = () => {
  // The method getToken(): Promise<string> allows FCM to use the VAPID key credential
  // when sending message requests to different push services
  return getToken(messaging, { vapidKey: process.env.FIREBASE_VAPID_KEY }) //to authorize send requests to supported web push services
      .then((currentToken) => {
          if (currentToken) {
              console.log('current token for client: ', currentToken);

              if(localStorage.getItem('fcmToken') && currentToken !==localStorage.getItem('fcmToken')){
                  localStorage.setItem('fcmToken', currentToken);

              }

              else if(!localStorage.getItem('fcmToken')){
                  localStorage.setItem('fcmToken', currentToken);

              }


          } else {
              console.log('No registration token available. Request permission to generate one.');
          }
      })
      .catch((err) => {
          console.log('An error occurred while retrieving token. ', err);
      });
};



export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

// const setupNotifications = async () => {
//   try {
//     // Request permission for notifications
//     const permission = await Notification.requestPermission();

//     if (permission === 'granted') {
//       console.log('Notification permission granted.');
//       // Get the FCM token
//       const token = await getToken(messaging);
//       console.log('FCM Token:', token);
//     } else {
//       console.log('Notification permission denied.');
//     }
//     // Handle foreground notifications
//     onMessage(messaging, (payload) => {
//       console.log('Foreground Message:', payload);
//       // Handle the notification or update your UI
//     });
//   } catch (error) {
//     console.error('Error setting up notifications:', error);
//   }
// };
// export { messaging, setupNotifications };