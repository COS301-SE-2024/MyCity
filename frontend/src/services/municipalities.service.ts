import { BasicMunicipality } from "@/types/custom.types";
import { invalidateCache } from "@/utils/api.utils";

export async function getMunicipalityList(revalidate?: boolean) {
    if (revalidate) {
        invalidateCache("municipality-municipalities-list"); //invalidate the cache
    }

    try {
        const response = await fetch("/api/municipality/municipalities-list",
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Error fetching municipalities: ${response.statusText}`);
        }

        const result = await response.json();

        const data = result as BasicMunicipality[];

        return data;

    } catch (error) {
        throw error;
    }
}

// export async function getMunicipalityCoordinates(sessionToken: string | undefined, municipality: string | undefined, revalidate?: boolean) {
//     if (!sessionToken || !municipality) {
//         throw new Error("Session token and municipality are required");
//     }

//     if (revalidate) {
//         invalidateCache("municipality-coordinates"); //invalidate the cache
//     }

//     try {
//         const response = await fetch(`/api/municipality/coordinates?municipality=${encodeURIComponent(municipality)}`,
//             {
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${sessionToken}`,
//                 }
//             }
//         );

//         if (!response.ok) {
//             throw new Error(`Error fetching municipality coordinates: ${response.statusText}`);
//         }

//         const result = await response.json();

//         const data = result as MunicipalityCoordinates;

//         return data;

//     } catch (error) {
//         throw error;
//     }
// }