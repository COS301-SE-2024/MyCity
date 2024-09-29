
interface UploadProfilePictureResponse {
    picture_url: string;
}

export async function uploadProfilePicture(sessionToken: string | undefined, formData: FormData, revalidate?: boolean) {
    try {
        const API_BASE_URL = process.env.API_BASE_URL;
        const apiURL = `${API_BASE_URL}/users/profile-picture/upload`;
        const response = await fetch(apiURL, {
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data",
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
