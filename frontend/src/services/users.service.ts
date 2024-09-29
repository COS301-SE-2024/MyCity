
interface UploadProfilePictureResponse {
    picture_url: string;
}

export async function uploadProfilePicture(sessionToken: string | undefined, formData: FormData, revalidate?: boolean) {
    try {
        const response = await fetch(`/api/users/profile-picture/upload`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${sessionToken}`,
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Error uploading profile picture: ${response.statusText}`);
        }

        const result = await response.json();
        const { picture_url } = result as UploadProfilePictureResponse;
        return picture_url;
    } catch (error) {
        throw error;
    }
}
