"use client";

import React from "react";

// export const toastNotification = ({ title, description, status }) => {
//   // Implement your toast notification logic
//   console.log(`Toast Notification: ${title} - ${description} - ${status}`);
// };

async function Prompt_Popup(
  notificationText = "Thank you for enabling notifications!"
) {
  if (!("Notification" in window)) {
    alert("Browser does not support notifications.");
  } else if (Notification.permission === "granted") {
    // sendNativeNotification({
    //   title: "Activated Notifications",
    //   body: notificationText,
    // });
  } else if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      // sendNativeNotification({
      //   title: "Activated Notifications",
      //   body: notificationText,
      // });
    }
  }
}

// export const sendNativeNotification = ({ title, body }) => {
//   // This logic sends the notification using the Notification API directly
//   new Notification(title, { body });

//   console.log(`Native Notification: ${title} - ${body}`);
// };

export default Prompt_Popup;
