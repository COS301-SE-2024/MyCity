
interface UploadProfilePictureResponse {
    picture_url: string;
}

export async function uploadProfilePicture(formData: FormData, revalidate?: boolean) {
    //bypass caching route and make request directly to external API
    const API_BASE_URL = process.env.API_BASE_URL;

    if (!API_BASE_URL) {
        throw new Error("missing api base url");
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users/profile-picture/upload`, {
            method: "POST",
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
