import { revalidateTag } from "next/cache";
import { FaultType } from "@/types/custom.types";

export async function getTicket(ticketId: string, revalidate?: boolean) {
    if (revalidate) {
        revalidateTag("tickets-view"); //invalidate the cache
    }

    try {
        const response = await fetch(`/api/tickets/view?ticket_id=${encodeURIComponent(ticketId)}`,
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

        const data = result.data as any[];

        return data;

    } catch (error) {
        throw error;
    }
}

export async function getTicketsInMunicipality(municipality: string | undefined, revalidate?: boolean) {
    if (!municipality) {
        throw new Error("Missing municipality");
    }

    if (revalidate) {
        revalidateTag("tickets-getinarea"); //invalidate the cache
    }

    try {
        const apiUrl = "/api/tickets/getinarea?municipality=" + municipality;
        const response = await fetch(apiUrl,
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

        const data = result.data as any[];

        return data;

    } catch (error) {
        throw error;
    }
}

export async function getFaultTypes(revalidate?: boolean) {
    if (revalidate) {
        revalidateTag("tickets-fault-types"); //invalidate the cache
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

export async function CreatTicket(sessiont: string, assett: string, descrip: string, lat: string, longi: string, usern: string): Promise<boolean> {
    const data = {
        asset: assett,
        description: descrip,
        latitude: lat,
        longitude: longi,
        username: usern,
        state: "OPEN"
    };
    const apiURL = "/api/tickets/create";
    const response = await fetch(apiURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessiont || "",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        return false;
    }
    else return true;
}