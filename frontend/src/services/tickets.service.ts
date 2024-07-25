import { revalidateTag } from "next/cache";
import { FaultType } from "@/types/custom.types";


export async function getMostUpvote(user_session: string, revalidate?: boolean) {

    // if (revalidate) {
    //     revalidateTag("tickets-getinarea"); //invalidate the cache
    // }
    try {
        const apiUrl = "https://dahex648v1.execute-api.eu-west-1.amazonaws.com/api/tickets/getUpvotes";
        const response = await fetch(apiUrl,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": user_session,
                },
            }
        );

        if (!response.ok ) {
            console.log(`Error fetching: ${response.statusText}`);
            return []
        }

        const result = await response.json();

        const data = result;
        AssignTicketNumbers(data);

        return data;

    } catch (error) {
        console.error(error);
    }
}


export async function getWatchlistTickets(username: string, user_session: string, revalidate?: boolean) {
    // if (revalidate) {
    //     revalidateTag("username"); //invalidate the cache
    // }

    try {
        const apiUrl = 'https://dahex648v1.execute-api.eu-west-1.amazonaws.com/api/tickets/getwatchlist';
        const searchparams = { "username": username };
        const queryParams = new URLSearchParams(searchparams);
        const urlWithParams = `${apiUrl}?${queryParams.toString()}`;
        const response = await fetch(urlWithParams,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": user_session
                },
            }
        );

        if (!response.ok) {
            console.error(`Error fetching: ${response.statusText}`);
            return []
        }

        const result = await response.json();

        if (result.Status ) {
            return [];
        }

        AssignTicketNumbers(result);
        const data = result;

        return data;

    } catch (error) {
        console.error("Error: " + error);
    }
}


export async function getTicket(ticketId: string, user_session: string, revalidate?: boolean) {
    if (revalidate) {
        revalidateTag("tickets-view"); //invalidate the cache
    }

    try {
        const response = await fetch(`/api/tickets/view?ticket_id=${encodeURIComponent(ticketId)}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": user_session
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
        console.error("Error: " + error);
    }
}


// temporary function (request method must be changed to GET)
export async function getTicketsInMunicipality(municipality: string | undefined, user_session: string, revalidate?: boolean) {

    if (!municipality) {
        throw new Error("Missing municipality");
    }

    if (revalidate) {
        revalidateTag("tickets-getinarea"); //invalidate the cache
    }

    try {

        const apiUrl = 'https://dahex648v1.execute-api.eu-west-1.amazonaws.com/api/tickets/getinarea';
        const searchparams = { "municipality": municipality };
        const queryParams = new URLSearchParams(searchparams);
        const urlWithParams = `${apiUrl}?${queryParams.toString()}`;
        console.log(urlWithParams)
        const response = await fetch(urlWithParams,

            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": user_session,
                },
            }
        );

        if (!response.ok) {
            console.error(`Error fetching: ${response.statusText}`);
            return [];
        }


        const result = await response.json();

        if (result.Status) {
            return [];
        }

        AssignTicketNumbers(result);

        const data = result as any[];

        return data;

    } catch (error) {
        console.error("Error: " + error);
    }
}

export async function getFaultTypes(revalidate?: boolean) {
    if (revalidate) {
        revalidateTag("tickets-fault-types"); //invalidate the cache
    }

    try {

        const apiURL = 'https://dahex648v1.execute-api.eu-west-1.amazonaws.com/api/tickets/fault-types'

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

export async function CreatTicket(sessiont: string, assett: string, descrip: string, lat: string, longi: string, fullAddress: string, usern: string): Promise<boolean> {
    const data = {
        asset: assett,
        description: descrip,
        latitude: lat,
        longitude: longi,
        address: fullAddress,
        username: usern,
        state: "OPEN"
    }
    const apiURL = 'https://dahex648v1.execute-api.eu-west-1.amazonaws.com/api/tickets/create';
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

function CreateTicketNumber(municipality: string): string {
    let ticketnumber = municipality[0].toUpperCase();
    for (let index = 0; index < 2; index++) {
        let randint: number = Math.floor(Math.random() * municipality.length);
        while (municipality[randint] == " " || municipality[randint] == "-" || municipality[randint] == "_") {
            console.log("inside loop")
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

function AssignTicketNumbers(data: any[]) {
    data.forEach((item: any) => {
        item['ticketnumber'] = CreateTicketNumber(item.municipality_id);
    });
}