import { revalidateTag } from "next/cache";
import { FaultType } from "@/types/custom.types";
import { json } from "stream/consumers";
import { UserData, UserRole } from '@/types/user.types';

const baseURL = String(process.env.NEXT_PUBLIC_API_BASE_URL)

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


// temporary function (request method must be changed to GET)
export async function getTicketsInMunicipality(municipality: string | undefined, revalidate?: boolean) {
    if (!municipality) {
        throw new Error("Missing municipality");
    }

    if (revalidate) {
        revalidateTag("tickets-getinarea"); //invalidate the cache
    }

    try {
        const apiUrl = baseURL + "/api/tickets/getinarea?municipality="+ municipality
        const response = await fetch(apiUrl,
            {
                method: "GET",
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

//// will replace temporary function defined above once request method on api has been changed from POST to GET
// export async function getTicketsInMunicipality(municipality:string, revalidate?: boolean) {
//     if (revalidate) {
//         revalidateTag("tickets-getinarea"); //invalidate the cache
//     }

//     try {
//         const response = await fetch("/api/tickets/getinarea",
//             {
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//             }
//         );

//         if (!response.ok) {
//             throw new Error(`Error fetching: ${response.statusText}`);
//         }

//         const result = await response.json();

//         const data = result.data as any[];

//         return data;

//     } catch (error) {
//         throw error;
//     }
// }


export async function getFaultTypes(revalidate?: boolean) {
    if (revalidate) {
        revalidateTag("tickets-fault-types"); //invalidate the cache
    }

    try {
        const apiURL = baseURL + "/tickets/fault-types"
        const response = await fetch(apiURL,
            {
                method : "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Error fetching: ${response.statusText}`);
        }

        const result = await response.json()

        const data = result as FaultType[];

        return data;

    } catch (error) {
        throw error;
    }
}

export async function CreatTicket( sessiont : string, assett: string,descrip : string, lat : string, longi : string, usern : string) : Promise<boolean> {
    const data = {
        asset : assett,
        description : descrip,
        latitude : lat,
        longitude : longi,
        username : usern,
        state : "OPEN"
    }
    const apiURL = baseURL + "/tickets/create"
    const response = await fetch(apiURL,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization" : sessiont || "",
        },
        body : JSON.stringify(data),
    });

    if(!response.ok)
    {
        return false;
    }
    else return true;
}