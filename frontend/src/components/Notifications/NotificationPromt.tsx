"use client";

import React, { useEffect, useState } from "react";
import { generateToken, messaging } from "@/components/Notifications/firebase";
import { onMessage } from "@firebase/messaging";

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

  // async function notifyUser(
  //   notificationText = "Thank you for enabling notifications!"
  // ) {
  //   if (Notification.permission === "granted") {
  //     new Notification(notificationText);
  //   }
  // }

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
    console.log("User: ", userEmail);
    console.log("Browser: ", getBrowserInfo());

    const token = await generateToken();
    console.log("Token generated: ", token);

    const subscriptions = ["status", "upvotes", "comments"];
    console.log("Subscriptions: ", subscriptions);

    const date = new Date();
    console.log("Date: ", date);
  }

  async function handleEnableNotifications() {
    try {
      // notifyUser();
      storeToken();
      setUserResponded(true);
    } catch (error) {
      console.error("Error enabling notifications:", error);
    }
  }

  useEffect(() => {
    // Ensure this code runs only in the browser
    if (typeof window !== "undefined" && "Notification" in window) {
      if (userResponded || Notification.permission === "granted") {
        onMessage(messaging, (payload) => {
          console.log("Message received. ", payload);
        });
      }
    }
  }, [userResponded]);

  return typeof window !== "undefined" &&
    !userResponded &&
    Notification.permission !== "granted" ? (
    <div className="bg-white w-1/3 border rounded-lg justiy-center">
      <table>
        <tr>
          <td rowSpan={3} width={100}>
            <img
              src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/notification_icon.webp"
              alt="Notification Logo"
              width={100}
              className="p-2"
            />
          </td>

          <td>
            <h1 className="text-2xl font-bold m-2 flex justify-center">
              Stay Connected!
            </h1>
            <div className="flex items-center">
              <p className="text-lg mb-4 justiy-center">
                Enable notifications to stay updated with the latest information
                and updates.
              </p>
            </div>
            <div className="flex justify-center py-2">
              <button
                className="bg-purple-500 text-white border px-4 py-2 rounded-lg mr-4"
                onClick={handleEnableNotifications}
              >
                Enable Notifications
              </button>
              <button
                className="bg-blue-100 border px-4 py-2 rounded-lg mr-4"
                onClick={() => setUserResponded(true)}
              >
                No Thanks
              </button>
            </div>
          </td>

          <td rowSpan={3} width={100}></td>
        </tr>
      </table>
    </div>
  ) : (
    <></>
  );
}
