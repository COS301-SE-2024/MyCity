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

  useEffect(() => {
    if ("Notification" in window) {
      setNotificationSupported(true);
    }
  }, []);

  async function enableNotifsAndClose() {
    await notifyUser();
    setUserResponded(true);
  }

  function disableNotifsAndClose() {
    setUserResponded(true);
  }

  if (!notificationSupported) {
    return (
      <div>
        <h1>Notifications are not supported by your browser.</h1>
      </div>
    );
  }

  return !userResponded && Notification.permission !== "granted" ? (

    <div className="bg-white">
      <div>
        <div>
          <h1>Notifications</h1>
          <h2>Would you like to receive notifications from MyCity?</h2>
          <div>
            <button onClick={enableNotifsAndClose}>Sure!</button>
            <button onClick={disableNotifsAndClose}>No Thanks!</button>
          </div>
        </div>
      </div>
    </div>

  ) : (
    <></>
  );
}
