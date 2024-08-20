export async function StoreToken(sessiont: string, username: string, deviceID: string, token: string): Promise<boolean> {
    const data = {
        username: username,
        deviceID: deviceID,
        token: token
        // date: date,
        // subscriptions: subscriptions
    };

    const apiURL = "/api/notifications/notification";
    const response = await fetch(apiURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sessiont}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        return false;
    }
    else return true;
}