import { invalidateCache } from "@/utils/api.utils";

export async function searchIssue(sessionToken: string | undefined, param: string, userMunicipality: string, revalidate?: boolean) {
    if (revalidate) {
        invalidateCache("search-issues"); // Invalidate the cache
    }

    try {
        const response = await fetch(`/api/search/issues`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionToken}`,
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
        const data = result as any[];

        return data;
    } catch (error: any) {
        console.log(error.message);
        const data: any[] = [];
        return data;
    }
}

export async function searchServiceProvider(sessionToken: string | undefined, param: string, revalidate?: boolean) {
    if (revalidate) {
        invalidateCache("search-service-provider"); //invalidate the cache
    }

    try {
        const response = await fetch(`/api/search/service-provider?q=${encodeURIComponent(param)}`,
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

        const data = result as any[];

        return data;
    } catch (error: any) {
        console.log(error.message);
        const data: any[] = [];
        return data;
    }
}

export async function searchMunicipality(sessionToken: string | undefined, param: string, revalidate?: boolean) {
    if (revalidate) {
        invalidateCache("search-municipality"); //invalidate the cache
    }

    try {
        const response = await fetch(`/api/search/municipality?q=${encodeURIComponent(param)}`,
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

        const data = result as any[];

        return data;
    } catch (error: any) {
        console.log(error.message);
        const data: any[] = [];
        return data;
    }
}

export async function searchMunicipalityTickets(sessionToken: string | undefined, municipalityId: string, revalidate?: boolean) {
    if (revalidate) {
        invalidateCache("search-municipality-tickets"); //invalidate the cache
    }

    try {
        const response = await fetch(`/api/search/municipality-tickets?q=${encodeURIComponent(municipalityId)}`,
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

        const data = result as any[];

        return data;
    } catch (error: any) {
        console.log(error.message);
        const data: any[] = [];
        return data;
    }
}