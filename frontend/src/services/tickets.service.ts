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


// temporary function (request method must be changed to GET)
export async function getTicketsInMunicipality(municipality: string | undefined, revalidate?: boolean) {
    if (!municipality) {
        throw new Error("Missing municipality");
    }

    if (revalidate) {
        revalidateTag("tickets-getinarea"); //invalidate the cache
    }

    try {
        const response = await fetch("/api/tickets/getinarea",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    municipality_id: municipality
                })
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
        const response = await fetch("/api/tickets/fault-types",
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

        const data = result.data as FaultType[];

        return data;

    } catch (error) {
        throw error;
    }
}