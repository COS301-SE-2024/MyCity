import { DashboardTicket, FaultGeoData, FaultType, UnprocessedFaultGeoData } from "@/types/custom.types";
import { invalidateCache } from "@/utils/api.utils";
import { CognitoIdentityProviderClient, AdminGetUserCommand } from "@aws-sdk/client-cognito-identity-provider";

interface UserAttributes {
    given_name?: string; // FIRSTNAME
    family_name?: string; // SURNAME
    picture?: string; // Profile picture URL
}

export async function getMostUpvote(user_session: string, revalidate?: boolean) {
    if (revalidate) {
        invalidateCache("tickets-getUpvotes"); //invalidate the cache
    }

    try {
        const apiUrl = "/api/tickets/getUpvotes";
        const response = await fetch(apiUrl,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user_session}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Error fetching: ${response.statusText}`);
        }

        const result = await response.json();

        const data = result as any[];
        formatAddress(data)
        ChangeState(data)
        return data;

    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getOpenCompanyTickets(user_session: string, revalidate?: boolean) {
    if (revalidate) {
        invalidateCache("tickets-getopencompanytickets"); //invalidate the cache
    }
    try {
        const apiUrl = "/api/tickets/getopencompanytickets";
        const response = await fetch(apiUrl,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user_session}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Error fetching: ${response.statusText}`);
        }

        const result = await response.json();

        const data = result as any[];
        formatAddress(data)
        ChangeState(data)
        return data;

    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getCompanyTickets(companyname: string, user_session: string, revalidate?: boolean) {
    if (revalidate) {
        invalidateCache("tickets-getcompanytickets"); //invalidate the cache
    }

    try {
        const apiUrl = "/api/tickets/getcompanytickets";
        const urlWithParams = `${apiUrl}?company=${encodeURIComponent(companyname)}`;
        const response = await fetch(urlWithParams,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user_session}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Error fetching: ${response.statusText}`);
        }

        const result = await response.json();

        if (!Array.isArray(result)) {
            return [];
        }

        const data = result as any[];
        formatAddress(data)
        ChangeState(data)
        return data;

    } catch (error) {
        console.error("Error: " + error);
        throw error;
    }
}

export async function getWatchlistTickets(username: string, user_session: string, revalidate?: boolean) {
    if (revalidate) {
        invalidateCache("tickets-getwatchlist"); //invalidate the cache
    }

    try {
        const apiUrl = "/api/tickets/getwatchlist";
        const urlWithParams = `${apiUrl}?username=${encodeURIComponent(username)}`;
        const response = await fetch(urlWithParams,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user_session}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Error fetching: ${response.statusText}`);
        }

        const result = await response.json();

        if (!Array.isArray(result)) {
            return [];
        }

        const data = result as any[];
        formatAddress(data)
        ChangeState(data)
        return data;

    } catch (error) {
        console.error("Error: " + error);
        throw error;
    }
}

export async function getTicket(ticketId: string, user_session: string, revalidate?: boolean) {
    if (revalidate) {
        invalidateCache("tickets-view"); //invalidate the cache
    }

    try {
        const response = await fetch(`/api/tickets/view?ticket_id=${encodeURIComponent(ticketId)}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user_session}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Error fetching: ${response.statusText}`);
        }

        const result = await response.json();

        if (!Array.isArray(result)) {
            const result: DashboardTicket[] = [];
            return result;
        }

        const unprocessedData = result as any[];

        formatAddress(unprocessedData);
        ChangeState(unprocessedData);

        const data: DashboardTicket[] = unprocessedData;

        return data;

    } catch (error) {
        console.error("Error: " + error);
        throw error;
    }
}

export async function getTicketsInMunicipality(municipality: string | undefined, user_session: string, revalidate?: boolean) {
    if (!municipality) {
        throw new Error("Missing municipality");
    }

    if (revalidate) {
        invalidateCache("tickets-getinarea"); //invalidate the cache
    }

    try {

        const apiUrl = "/api/tickets/getinarea";
        const urlWithParams = `${apiUrl}?municipality=${encodeURIComponent(municipality)}`;
        const response = await fetch(urlWithParams,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user_session}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Error fetching: ${response.statusText}`);
        }


        const result = await response.json();

        if (!Array.isArray(result)) {
            return [];
        }

        const data = result as any[];

        formatAddress(data)
        ChangeState(data)
        return data;

    } catch (error) {
        console.error("Error: " + error);
        throw error;
    }
}

export async function getOpenTicketsInMunicipality(municipality: string | undefined, user_session: string, revalidate?: boolean) {
    if (!municipality) {
        throw new Error("Missing municipality");
    }

    if (revalidate) {
        invalidateCache("tickets-getinarea"); //invalidate the cache
    }

    try {

        const apiUrl = "/api/tickets/getopeninarea";
        const urlWithParams = `${apiUrl}?municipality=${encodeURIComponent(municipality)}`;
        const response = await fetch(urlWithParams,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user_session}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Error fetching: ${response.statusText}`);
        }

        const result = await response.json();

        if (!Array.isArray(result)) {
            return [];
        }

        const data = result as any[];

        formatAddress(data)
        ChangeState(data)
        return data;

    } catch (error) {
        console.error("Error: " + error);
        throw error;
    }
}

export async function AcceptTicket(ticket: string, user_session: string) {
    const data = {
        ticket_id: ticket,
    }

    const apiURL = "/api/tickets/accept";
    const response = await fetch(apiURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user_session}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        return false;
    }

    const result = await response.json();
    if (result.Status == "Success") {
        return true;
    }
    else {
        return false;
    }
}

export async function InteractTicket(ticket: string, interact_type: string, user_session: string) {
    const data = {
        type: interact_type,
        ticket_id: ticket,
    }

    const apiURL = "/api/tickets/interact";
    const response = await fetch(apiURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user_session}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        return false;
    }

    const result = await response.json();
    if (result.Status == "SUCCESFUL") {
        return result.vote;
    }
    else {
        return -1;
    }
}

export async function CloseTicket(ticket: string, user_session: string) {
    const data = {
        ticket_id: ticket,
    }

    const apiURL = "/api/tickets/close";
    const response = await fetch(apiURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user_session}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        return false;
    }

    const result = await response.json();
    if (result.Status == "Success") {
        return true;
    }
    else {
        return false;
    }
}

export async function getFaultTypes(revalidate?: boolean) {
    if (revalidate) {
        invalidateCache("tickets-fault-types"); //invalidate the cache
    }

    try {
        const apiURL = "/api/tickets/fault-types";

        const response = await fetch(apiURL,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Error fetching: ${response.statusText}`);
        }

        const result = await response.json();

        const data = result as FaultType[];

        return data;

    } catch (error) {
        throw error;
    }
}

export async function CreatTicket(sessiont: string, formData: FormData): Promise<boolean> {
    const API_BASE_URL = process.env.API_BASE_URL;
    const apiURL = `${API_BASE_URL}/tickets/create`;
    const response = await fetch(apiURL, {
        method: "POST",
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${sessiont}`,
        },
        body: formData,
    });

    if (!response.ok) {
        return false;
    }
    const result = await response.json();
    if (result.Status) {
        return false;
    }
    else {
        return true;
    }
}

export async function addWatchlist(ticket: string, usern: string, sessiont: string): Promise<boolean> {
    const lowerusern = usern.toLowerCase();
    const data = {
        username: lowerusern,
        ticket_id: ticket,
    }
    const apiURL = "/api/tickets/addwatchlist";
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

function CreateTicketNumber(municipality: string): string {
    let ticketnumber = municipality[0].toUpperCase();
    for (let index = 0; index < 2; index++) {
        let randint: number = Math.floor(Math.random() * municipality.length);
        while (municipality[randint] == " " || municipality[randint] == "-" || municipality[randint] == "_") {
            randint = Math.floor(Math.random() * municipality.length);
        }
        ticketnumber += municipality[randint].toUpperCase();
    }
    for (let index = 0; index < 2; index++) {
        const randint = Math.floor(Math.random() * municipality.length) + 1;
        ticketnumber += String(randint);
    }
    return ticketnumber;
}

function ChangeState(tickets: any[]) {
    tickets.forEach((item: any) => {
        if (item['state'] == "Assigning Contract") {
            item['state'] = "In Progress"
        }
        else if (item['state'] == "OPEN") {
            item['state'] == "Opened"
        }
    });
}

function AssignTicketNumbers(data: any[]) {
    data.forEach((item: any) => {
        item['ticketnumber'] = CreateTicketNumber(item.municipality_id);
    });
}

export async function addCommentWithImage(comment: string, ticket_id: string, image_url: string, user_id: string, user_session: string,) {
    try {
        const apiUrl = "/api/tickets/add-comment-with-image";
        const data = {
            comment,
            ticket_id,
            image_url,
            user_id
        };
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": user_session,
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Error fetching: ${response.statusText}`);
        }

        const result = await response.json();
        return result;

    } catch (error) {
        console.error("Error: " + error);
        throw error;
    }
}

export async function addCommentWithoutImage(comment: string, ticket_id: string, user_id: string, user_session: string,) {
    try {
        const apiUrl = "/api/tickets/add-comment-without-image";
        const data = {
            comment,
            ticket_id,
            user_id
        };
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": user_session,
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Error fetching: ${response.statusText}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error: " + error);
        throw error;
    }
}

export async function getTicketComments(ticket_id: string, user_session: string) {
    try {
        const apiUrl = `/api/tickets/comments`;
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Authorization": user_session,
                "Content-Type": "application/json",
                "X-Ticket-ID": ticket_id, // Add ticket_id in the headers
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching comments: ${response.statusText}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

export const getUserFirstLastName = async (username: string, userPoolID: string): Promise<UserAttributes | null> => {
    const client = new CognitoIdentityProviderClient({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
        },
    });

    try {
        const command = new AdminGetUserCommand({
            UserPoolId: userPoolID,
            Username: username,
        });

        const response = await client.send(command);

        const userAttributes: UserAttributes = {};

        response.UserAttributes?.forEach(attribute => {
            if (attribute.Name === "given_name") {
                userAttributes.given_name = attribute.Value;
            } else if (attribute.Name === "family_name") {
                userAttributes.family_name = attribute.Value;
            } else if (attribute.Name === "picture") {
                userAttributes.picture = attribute.Value;
            }
        });

        return userAttributes;
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
};

function formatAddress(data: any[]) {
    data.forEach(item => {
        let address = String(item.address)
        item['address'] = address.split(',').slice(0, 2).join(',');
    });
}

export async function getTicketsGeoData(sessionToken: string | undefined, revalidate?: boolean) {
    if (revalidate) {
        invalidateCache("tickets-geodata-all"); //invalidate the cache
    }

    try {

        const response = await fetch("/api/tickets/geodata/all",
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionToken}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Error fetching: ${response.statusText}`);
        }

        const result = await response.json();

        const rawData = result as UnprocessedFaultGeoData[];
        const data: FaultGeoData[] = [];

        for (const fault of rawData) {
            let faultColor: string | undefined = undefined;

            if (fault.urgency = "urgent") {
                faultColor = "#b91c1c"; //red-ish
            }
            else if (fault.urgency = "semi-urgent") {
                faultColor = "#ca8a04"; //yellow-ish
            }
            else if (fault.urgency = "non-urgent") {
                faultColor = "#15803d"; //green-ish
            }

            const faultResult: FaultGeoData = { ...fault, color: faultColor };
            data.push(faultResult);
        }

        return data;

    } catch (error) {
        console.error(error);
        throw error;
    }
}