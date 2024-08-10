import { invalidateCache } from "@/utils/apiUtils";

/*export async function searchIssue(param:string, revalidate?: boolean) {
     if (revalidate) {
        invalidateCache("search-issues"); // Invalidate the cache
    }

    try {
        const response = await fetch(`/api/search/issues?q=${encodeURIComponent(param)}`,
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
}*/

export async function searchIssue(param: string, userMunicipality: string, revalidate?: boolean) {
    if (revalidate) {
        invalidateCache("search-issues"); // Invalidate the cache
    }

    try {
        const response = await fetch(`/api/search/issues`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                q: param,
                user_municipality: userMunicipality,
            }),
        });

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



export async function searchServiceProvider(param:string, revalidate?: boolean) {
    if (revalidate) {
        invalidateCache("search-service-provider"); //invalidate the cache
    }

    try {
        const response = await fetch(`/api/search/service-provider?q=${encodeURIComponent(param)}`,
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


export async function searchMunicipality(param:string, revalidate?: boolean) {
    if (revalidate) {
        invalidateCache("search-municipality"); //invalidate the cache
    }

    try {
        const response = await fetch(`/api/search/municipality?q=${encodeURIComponent(param)}`,
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


export async function searchMunicipalityTickets(municipalityId:string, revalidate?: boolean) {
    if (revalidate) {
        invalidateCache("search-municipality-tickets"); //invalidate the cache
    }

    try {
        const response = await fetch(`/api/search/municipality-tickets?q=${encodeURIComponent(municipalityId)}`,
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