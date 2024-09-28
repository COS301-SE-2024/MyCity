import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const S3_BUCKET_NAME = String(process.env.S3_BUCKET_NAME);
const s3Client = new S3Client();

const generateObjectKey = (folder: string, username: string, file: Express.Multer.File) => {
    return `${folder}/${username}_${file.originalname}`;
};

const uploadFile = async (folder: string, username: string, file: Express.Multer.File) => {
    try {
        const objectKey = generateObjectKey(folder, username, file);
        const response = await s3Client.send(new PutObjectCommand({
            Bucket: S3_BUCKET_NAME,
            Key: objectKey,
            Body: file.buffer,
            ContentType: file.mimetype
        }));
        const relativeFileUrl = `/${objectKey}`;
        return relativeFileUrl;
    } catch (error: any) {
        throw error;
    }
};

export {
    s3Client,
    uploadFile
};