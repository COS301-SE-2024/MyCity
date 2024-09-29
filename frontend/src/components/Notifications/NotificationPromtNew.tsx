"use client";

import React, { useEffect, useState } from "react";
import { generateToken, messaging } from "@/components/Notifications/firebase";
import { onMessage } from "@firebase/messaging";
import { useProfile } from "@/hooks/useProfile";
import { StoreToken } from "@/services/notification.service";
import { X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { getNotificationPermissionStatus, requestNotificationPermission } from "@/utils/permissions.utils";


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
  const { getUserProfile } = useProfile();
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
  const [message, setMessage] = useState("Enable notifications to stay updated with the latest information and updates.\nClick on the \"Allow\" button at the top left of your screen.");

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

      const isAdded = await StoreToken(
        sessiont,
        userEmail,
        getBrowserInfo(),
        token
      );
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

  useEffect(() => {
    const requestPermission = async () => {
      const notificationPermissionStatus = await requestNotificationPermission();
      if (notificationPermissionStatus == "granted") {
        setMessage("Notifications enabled successfully!");
        setTimeout(() => {
          setShowNotificationPrompt(false);
        }, 1500);

        await storeToken();
        onMessage(messaging, (payload) => {
          console.log("Message received. ", payload);
        });
      }
      else if (notificationPermissionStatus == "denied") {
        setMessage("Notifications permission denied. We will not ask again.");
        setTimeout(() => {
          setShowNotificationPrompt(false);
        }, 1500);
      }
      else {
        setShowNotificationPrompt(false);
      }
    };

    const checkNotificationPermission = async () => {
      const notificationPermissionStatus = await getNotificationPermissionStatus();
      if (notificationPermissionStatus === "granted" || notificationPermissionStatus === "denied") {
        return;
      }
      else if (notificationPermissionStatus === "default") {
        requestPermission();
        setShowNotificationPrompt(true);
      }
    };

    checkNotificationPermission();
  }, []);


  const closePopup = () => setShowNotificationPrompt(false);

  return (
    <>
      {showNotificationPrompt ? (
        <div>
          {/* Desktop View */}
          <div
            className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 z-[999999]"
            onClick={closePopup}
          >
            <div
              className="dark:bg-gray-700 dark:text-white bg-white w-1/3 rounded-lg p-4 relative z-[999999]"
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
                  height={100}
                  className="p-2"
                />
              </div>
              <h1 className="text-2xl font-bold my-4 text-center">
                Stay Connected!
              </h1>
              <p className="text-md mb-4 text-center">
                {message}
              </p>
            </div>
          </div>


          {/* Mobile View */}
          <div className="block sm:hidden">
            <div
              className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 z-[100000]"
              onClick={closePopup}
            >
              <div
                className="bg-white w-5/6 border rounded-lg p-2 relative z-[100001]"
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
                    height={100}
                    className="p-2"
                  />
                </div>
                <h1 className="text-2xl font-bold my-2 text-center">
                  Stay Connected!
                </h1>
                <p className="text-sm mb-4 text-center">
                  {message}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : undefined}
    </>);
}
