// firebase.js
import { initializeApp, FirebaseApp } from "firebase/app";
import { getMessaging, Messaging, onMessage, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

let messaging: Messaging;

if (typeof window !== "undefined") {
  // Browser environment
  messaging = getMessaging(app);
  onMessage(messaging, (payload) => {
    console.log("Message received. ", payload);
  });
}

export { app, messaging };

export const generateToken = async () => {
  if (typeof window === "undefined" || !messaging) {
    console.warn("Firebase messaging is not supported in this environment.");
    return;
  }

  if (typeof window !== "undefined" && "Notification" in window) {
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      try {
        const token = await getToken(messaging, {
          vapidKey: process.env.FIREBASE_VAPID_KEY || ""
        });
        // console.log("Token generated: ", token);
        return token;
      } catch (error) {
        console.error("Error getting token: ", error);
      }

    } else {
      console.warn("Notification permission not granted");
    }
  }
}
