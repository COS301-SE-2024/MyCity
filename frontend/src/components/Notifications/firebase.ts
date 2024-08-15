// firebase.js
import { initializeApp, FirebaseApp } from "firebase/app";
import { getMessaging, Messaging, onMessage, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
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

  const permission = await Notification.requestPermission();

  if (permission === 'granted') {
    try {
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || ""
      });
      console.log("Token generated: ", token);
    } catch (error) {
      console.error("Error getting token: ", error);
    }
  } else {
    console.warn("Notification permission not granted");
  }
}
