import { revalidateTag } from "next/cache";
import { FaultType } from "@/types/custom.types";
import { json } from "stream/consumers";
import { UserData, UserRole } from '@/types/user.types';

const baseURL = "https://dahex648v1.execute-api.eu-west-1.amazonaws.com/api"

export async function getMostUpvote( user_session : string, revalidate?: boolean) {
    
    // if (revalidate) {
    //     revalidateTag("tickets-getinarea"); //invalidate the cache
    // }

    try {
        console.log(baseURL)
        const apiUrl = `${baseURL}/tickets/getUpvotes`;
        console.log("Heres the api url using: " + apiUrl)
        const response = await fetch(apiUrl,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization" : user_session,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Error fetching: ${response.statusText}`);
        }

        const result = await response.json();

        const data = result;

        return data;

    } catch (error) {
        throw error;
    }
}


export async function getWatchlistTickets(username: string,user_session : string, revalidate?: boolean) {
    // if (revalidate) {
    //     revalidateTag("username"); //invalidate the cache
    // }

    try {
        const apiUrl = baseURL +  "/tickets/getwatchlist";
        const searchparams ={"username": username};
        const queryParams = new URLSearchParams(searchparams);
        const urlWithParams = `${apiUrl}?${queryParams.toString()}`;
        const response = await fetch(urlWithParams,
            {
                method : "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization" : user_session
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Error fetching: ${response.statusText}`);
        }

        const result = await response.json();

        const data = result as any[];

        return data;

    } catch (error) {
        throw error;
    }
} 


export async function getTicket(ticketId: string,user_session : string, revalidate?: boolean) {
    if (revalidate) {
        revalidateTag("tickets-view"); //invalidate the cache
    }

    try {
        const apiURl = baseURL +  `/tickets/view?ticket_id=${encodeURIComponent(ticketId)}`;
        const response = await fetch(apiURl,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization" : user_session
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Error fetching: ${response.statusText}`);
        }

        const result = await response.json();

        const data = result as any[];

        return data;

    } catch (error) {
        throw error;
    }
}


// temporary function (request method must be changed to GET)
export async function getTicketsInMunicipality(municipality: string | undefined, user_session : string, revalidate?: boolean) {
    if (!municipality) {
        throw new Error("Missing municipality");
    }

    if (revalidate) {
        revalidateTag("tickets-getinarea"); //invalidate the cache
    }

    try {
        const apiUrl = baseURL + "/api/tickets/getinarea";
        const searchparams ={"municipality": municipality};
        const queryParams = new URLSearchParams(searchparams);
        const urlWithParams = `${apiUrl}?${queryParams.toString()}`;
        const response = await fetch(urlWithParams,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization" : user_session,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Error fetching: ${response.statusText}`);
        }
        

        const result = await response.json();

        if(result.Status == "Failed")
        {
            throw new Error(`Error was : ${result.Error}`);
        }

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