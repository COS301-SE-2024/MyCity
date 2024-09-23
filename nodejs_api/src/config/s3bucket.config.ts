import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const S3_BUCKET_NAME = String(process.env.S3_BUCKET_NAME);
const AWS_REGION = String(process.env.AWS_REGION);
const s3Client = new S3Client();

const getObjectUrl = (objectKey: string) => {
    return `https://${S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${objectKey}`;
};

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
        const fileUrl = getObjectUrl(objectKey);
        return fileUrl;
    } catch (error: any) {
        throw error;
    }
};


export {
    s3Client,
    uploadFile
};