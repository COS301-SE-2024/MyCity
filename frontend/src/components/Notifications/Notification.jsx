import React, { useState, useEffect } from 'react'
import { requestForToken, onMessageListener } from './firebase';
import { ToastContainer, toast } from 'react-toastify';

function notifyUser(notificationTitle = "Thank you for subscribing!") {
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
        const notification = new Notification(notificationTitle);

    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function (permission){
            if (permission === "granted") {
                const notification = new Notification(notificationTitle);
            }
        });
    }
}

const Notification = () => {
    const [notification, setNotification] = useState({ title: '', body: '' });
    // const notify = new Notification(notification.title);

    function ToastDisplay() {
        return (
            <div>
                <p><b>{notification?.title}</b></p>
                <p>{notification?.body}</p>
            </div>
        );
    };

    useEffect(() => {
        if (notification?.title) {
            if (permission === 'granted') {
                new Notification(notification.title);
            }
        }

    }, [notification])

    requestForToken();

    // Listener for push notifications
    onMessageListener()
        .then((payload) => {
            console.log("Received push notification: ", payload);
            // Display the notification or update the UI based on the payload
            alert(`Notification: ${payload.notification.title}`);
        })
        .catch((err) => console.log("Failed to receive push notification: ", err));


}

export default Notification