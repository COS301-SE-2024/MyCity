import { BasicMunicipality } from "@/types/custom.types";
import { invalidateCache } from "@/utils/apiUtils";

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