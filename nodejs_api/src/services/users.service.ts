import { uploadFile } from "../config/s3bucket.config";

export const uploadProfilePicture = async (username: string, file: Express.Multer.File) => {
    //use amazon s3 to upload the file
    const pictureUrl = await uploadFile("profile_pictures", username, file);
    return { picture_url: pictureUrl };
};
