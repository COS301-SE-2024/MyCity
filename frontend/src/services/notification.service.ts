export async function StoreToken(sessiont: string, username: string, deviceID: string, token: string): Promise<boolean> {
    const data = {
        username: username,
        deviceID: deviceID,
        token: token
    };

    const apiURL = "/api/notifications/insert-tokens";
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
    else {
        return true;
    }
}

export async function GetTokens(sessiont: string, username: string): Promise<boolean> {
    const apiURL = `/api/notifications/get-tokens?username=${encodeURIComponent(username)}`;
    const response = await fetch(apiURL, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sessiont}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Error fetching: ${response.statusText}`);
    }
    else {
        const data = await response.json();
        return data;
    }
}