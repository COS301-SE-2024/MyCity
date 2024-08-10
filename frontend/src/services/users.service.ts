import { invalidateCache } from "@/utils/apiUtils";

export async function uploadProfilePicture(formData: FormData, revalidate?: boolean) {
    if (revalidate) {
        invalidateCache("users-profile-picture-upload"); // Invalidate the cache
    }

    try {
        const response = await fetch("/api/users/profile-picture/upload", {
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data",
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Error uploading profile picture: ${response.statusText}`);
        }

        const result = await response.json();
        const data = result.data as any[];

        return data;
    } catch (error) {
        throw error;
    }
}
