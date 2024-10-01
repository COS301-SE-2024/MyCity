import { UserLngLat } from "@/types/custom.types";

export const getLocationPermissionStatus = async () => {
    if (!navigator.geolocation) {
        console.error("Geolocation is not supported by this browser.");
        return "denied"; // we'll just assume it's denied if the browser doesn't support it
    }

    try {
        const result = await navigator.permissions.query({ name: "geolocation" });
        return result.state;
    } catch (error) {
        console.error("Error checking geolocation permissions:", error);
        return "prompt"; // an error occurred, so we'll just prompt the user
    }
};

export const getUserLocation = async () => {
    if (!navigator.geolocation) {
        console.error("Geolocation is not supported by this browser.");
        return null;
    }

    return new Promise<UserLngLat | null>((resolve) => {
        navigator.geolocation.getCurrentPosition(
            (position) => resolve([position.coords.latitude, position.coords.longitude]),
            (error) => {
                console.error("Error getting user location:", error);
                resolve(null);
            }
        );
    });
};

export const getNotificationPermissionStatus = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
        return Notification.permission;
    }

    console.error("Notifications are not supported by this browser.");
    return "denied";
};


export const requestNotificationPermission = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
        return Notification.requestPermission();
    }

    console.error("Notifications are not supported by this browser.");
    return "denied";
};