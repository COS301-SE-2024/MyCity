const AWS_REGION = process.env.AWS_REGION;
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

const S3_BUCKET_BASE_URL = `https://${S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com`;

const getImageBucketUrl = (key: string | null | undefined) => {
    if (key) {
        return `${S3_BUCKET_BASE_URL}${key}`;
    }
    else {
        return "";
    }
};

export {
    getImageBucketUrl
};