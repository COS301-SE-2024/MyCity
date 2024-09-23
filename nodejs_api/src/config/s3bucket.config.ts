import { S3Client } from "@aws-sdk/client-s3";

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
const AWS_REGION = String(process.env.AWS_REGION);
const AWS_ACCESS_KEY_ID = String(process.env.AWS_ACCESS_KEY_ID);
const AWS_SECRET_ACCESS_KEY = String(process.env.AWS_SECRET_ACCESS_KEY);
const USER_PROFILE_PICTURES_FOLDER = "profile_pictures";

const s3Client = new S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
    }
});

export {
    S3_BUCKET_NAME,
    USER_PROFILE_PICTURES_FOLDER
};