"use client";

import React, { useEffect, useState } from "react";
import { generateToken, messaging } from "@/components/Notifications/firebase";
import { onMessage } from "@firebase/messaging";
import { useProfile } from "@/hooks/useProfile";
import { StoreToken } from "@/services/notification.service";
import { X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

declare global {
  interface Navigator {
    brave?: {
      isBrave: () => Promise<boolean>;
    };
  }
}

interface NotificationPromtProps {
  userEmail: string;
}

export default function Promt_Popup({ userEmail }: NotificationPromtProps) {
  const [userResponded, setUserResponded] = useState(false);
  const { getUserProfile } = useProfile();

  function getBrowserInfo() {
    const userAgent = navigator.userAgent;
    const isBrave = navigator.brave ? true : false;

    if (userAgent.includes("Edge/")) {
      return "Microsoft Edge";
    } else if (userAgent.includes("Edg/")) {
      return "Microsoft Edge (Chromium-based)";
    } else if (userAgent.includes("OPR/") || userAgent.includes("Opera/")) {
      return "Opera";
    } else if (isBrave) {
      return "Brave";
    } else if (userAgent.includes("Chrome/") && !isBrave) {
      return "Google Chrome";
    } else if (userAgent.includes("Firefox/")) {
      return "Mozilla Firefox";
    } else if (userAgent.includes("Safari/") && !isBrave) {
      return "Apple Safari";
    } else {
      return "Unknown Browser";
    }
  }

  async function storeToken() {
    const user_data = await getUserProfile();
    
    

    // const token = await generateToken();


    var token = await generateToken();
    while (!token) {
      token = await generateToken();
    }
    

    try {
      const sessiont = user_data.current?.session_token || " ";
      console.log("Session Token: ", sessiont);
      console.log("User: ", userEmail);
      console.log("Browser: ", getBrowserInfo());
      console.log("Token generated: ", token);

      
      const isAdded = await StoreToken(sessiont, userEmail, getBrowserInfo(), token);
      console.log("Token stored: ", isAdded);
      
      if (isAdded === true) {
        toast.success("Notifications enabled!");
        console.log("Token stored successfully");
      } else {
        throw new Error("Storing Token failed");
      }

    } catch (error: any) {
      console.error("Error:", error);
    }
  }

  async function handleEnableNotifications() {
    try {
      storeToken();
      setUserResponded(true);
    } catch (error) {
      console.error("Error enabling notifications:", error);
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (userResponded || Notification.permission === "granted") {
        onMessage(messaging, (payload) => {
          console.log("Message received. ", payload);
        });
      }
    }
  }, [userResponded]);

  const closePopup = () => setUserResponded(true);

  return typeof window !== "undefined" &&
    !userResponded &&
    Notification.permission !== "granted" ? (
    <div
      className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
      onClick={closePopup}
    >
      <div
        className="bg-white w-1/3 border rounded-lg p-4 relative"
        onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the popup
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={closePopup}
        >
          <X size={24} />
        </button>
        <div className="flex justify-center">
          <img
            src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/notification_icon.webp"
            alt="Notification Logo"
            width={100}
            className="p-2"
          />
        </div>
        <h1 className="text-2xl font-bold my-4 text-center">Stay Connected!</h1>
        <p className="text-md mb-4 text-center">
          Enable notifications to stay updated with the latest information and updates.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-3xl hover:bg-blue-600 transition duration-300"
            onClick={handleEnableNotifications}
          >
            Enable Notifications
          </button>
          <button
            className="bg-blue-100 text-gray-700 px-4 py-2 rounded-3xl hover:bg-blue-200 transition duration-300"
            onClick={closePopup}
          >
            No Thanks
          </button>
        </div>
      </div>
    </div>
  ) : null;
}
