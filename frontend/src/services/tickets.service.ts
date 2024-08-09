import { revalidateTag } from "next/cache";
import { FaultType } from "@/types/custom.types";


export async function getMostUpvote(user_session: string, revalidate?: boolean) {

    // if (revalidate) {
    //     revalidateTag("tickets-getinarea"); //invalidate the cache
    // }
    try {
        const apiUrl = "/api/tickets/getUpvotes";
        const response = await fetch(apiUrl,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": user_session,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Error fetching: ${response.statusText}`);
        }

        const result = await response.json();

        const data = result.data as any[];
        AssignTicketNumbers(data);
        formatAddress(data)
        ChangeState(data)
        return data;

    } catch (error) {
        console.error(error);
        throw error;
    }
}


export async function getCompanyTickets(companyname: string, user_session: string, revalidate?: boolean) {
    // if (revalidate) {
    //     revalidateTag("username"); //invalidate the cache
    // }

    try {
        const apiUrl = "/api/tickets/getcompanytickets";
        const urlWithParams = `${apiUrl}?company=${encodeURIComponent(companyname)}`;
        const response = await fetch(urlWithParams,
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

        if (!Array.isArray(result.data)) {
            return [];
        }

        const data = result.data as any[];
        AssignTicketNumbers(data);
        formatAddress(data)
        ChangeState(data)
        return data;

    } catch (error) {
        console.error("Error: " + error);
        throw error;
    }
}



export async function getWatchlistTickets(username: string, user_session: string, revalidate?: boolean) {
    // if (revalidate) {
    //     revalidateTag("username"); //invalidate the cache
    // }

    try {
        const apiUrl = "/api/tickets/getwatchlist";
        const urlWithParams = `${apiUrl}?username=${encodeURIComponent(username)}`;
        const response = await fetch(urlWithParams,
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

        if (!Array.isArray(result.data)) {
            return [];
        }

        const data = result.data as any[];
        AssignTicketNumbers(data);
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

        const data = result.data as any[];

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
        revalidateTag("tickets-getinarea"); //invalidate the cache
    }

    try {

        const apiUrl = "/api/tickets/getinarea";
        const urlWithParams = `${apiUrl}?municipality=${encodeURIComponent(municipality)}`;
        const response = await fetch(urlWithParams,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": user_session,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Error fetching: ${response.statusText}`);
        }


        const result = await response.json();

        if (!Array.isArray(result.data)) {
            return [];
        }

        const data = result.data as any[];

        AssignTicketNumbers(data);
        formatAddress(data)
        ChangeState(data)
        return data;

    } catch (error) {
        console.error("Error: " + error);
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

        const data = result.data as FaultType[];

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

function CreateTicketNumber(municipality: string): string {
    let ticketnumber = municipality[0].toUpperCase();
    for (let index = 0; index < 2; index++) {
        let randint: number = Math.floor(Math.random() * municipality.length);
        while (municipality[randint] == " " || municipality[randint] == "-" || municipality[randint] == "_") {
            // console.log("inside loop")
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

function ChangeState(tickets: any[]){
    tickets.forEach((item: any) => {
        if(item['state'] == "Assigning Contract")
        {
            item['state'] = "In Progress"
        }
        else if(item['state']=="OPEN")
        {
            item['state'] == "Opened"
        }

    });
}

function AssignTicketNumbers(data: any[]) {
    data.forEach((item: any) => {
        item['ticketnumber'] = CreateTicketNumber(item.municipality_id);
    });
}

export async function addCommentWithImage(comment:string, ticket_id:string, image_url:string, user_id:string, user_session: string) {
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

export async function addCommentWithoutImage(comment:string, ticket_id:string, user_id:string, user_session: string,) {
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

export async function getTicketComments(ticket_id:string, user_session:string) {
    try {
        const apiUrl = `/api/tickets/${ticket_id}/comments`;
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Authorization": user_session,
                "Content-Type": "application/json",
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

function formatAddress(data : any[])
{
    data.forEach(item  => {
        let address = String(item.address)
        item['address'] = address.split(',').slice(0, 2).join(',');
    });
}


export async function getTicketsGeoData(sessionToken: string | undefined, revalidate?: boolean) {
    if (revalidate) {
        revalidateTag("tickets-geodata-all"); //invalidate the cache
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

        const data = result.data as FaultGeoData[];
        console.log("faults geodata: ", data);

        return data;

    } catch (error) {
        console.error(error);
        throw error;
    }
}


