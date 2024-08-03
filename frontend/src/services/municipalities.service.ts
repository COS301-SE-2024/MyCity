import { BasicMunicipality } from "@/types/custom.types";
import { revalidateTag } from "next/cache";

export async function getMunicipalityList(revalidate?: boolean) {
    if (revalidate) {
        revalidateTag("municipalities-municipalities-list"); //invalidate the cache
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

        const data = result.data as BasicMunicipality[];

        return data;

    } catch (error) {
        throw error;
    }
}