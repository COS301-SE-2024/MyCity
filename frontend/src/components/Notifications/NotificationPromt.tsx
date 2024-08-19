"use client";

import React, { useEffect, useState } from "react";

async function notifyUser(
  notificationText = "Thank you for enabling notifications!"
) {
  if (!("Notification" in window)) {
    alert("Browser does not support notifications.");
  } else if (Notification.permission === "granted") {
    new Notification(notificationText);
  } else if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      new Notification(notificationText);
    }
  }
}

export default function Promt_Popup() {
  const [userResponded, setUserResponded] = useState(false);
  const [notificationSupported, setNotificationSupported] = useState(false);

  return !userResponded && Notification.permission !== "granted" ? (
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
                onClick={() => {
                  notifyUser();
                  setUserResponded(true);
                }}
              >
                Enable Notifications
              </button>
              <button
                className="bg-blue-100 border px-4 py-2 rounded-lg mr-4"
                onClick={() => {
                  setUserResponded(true);
                }}
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
